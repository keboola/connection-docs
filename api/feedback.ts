/**
 * /api/feedback — receives documentation feedback from the page widget and
 * forwards it to a Keboola ingestion endpoint (intended to be a Data Stream
 * that lands each submission as a row in a Storage table).
 *
 * Mirrors api/chat.ts conventions: plain JSON handler, a GET
 * `{ enabled }` probe so the static frontend can decide whether to render the
 * widget, and a stub mode when the ingestion env isn't configured yet (so the
 * site can ship before the stream exists).
 *
 * Submissions that carry a written comment are additionally filed as Linear
 * issues, so docs feedback lands where the docs work is triaged. Linear rather
 * than GitHub Issues: connection-docs is public, and readers paste project IDs,
 * stack URLs and emails into a "what could be better?" box. A bare thumb is
 * never filed: the widget is on every page, and one issue per click would bury
 * the team. Bare thumbs still reach the ingest endpoint below. An abandoned
 * verdict (thumb clicked, form never submitted) never carries its comment.
 *
 * Optional env (set in the Vercel project):
 *   FEEDBACK_INGEST_URL       ingestion endpoint (e.g. a Keboola Data Stream URL)
 *   FEEDBACK_INGEST_TOKEN     optional bearer token for that endpoint
 *   FEEDBACK_LINEAR_API_KEY   Linear API key or OAuth access token. Issues show
 *                             as created by its owner, so use an app actor or a
 *                             service account, not a person's key.
 *   FEEDBACK_LINEAR_TEAM_ID   team UUID the issues are filed into
 *   FEEDBACK_LINEAR_LABEL_IDS optional, comma-separated label UUIDs
 *   FEEDBACK_LINEAR_PROJECT_ID optional project UUID
 *   FEEDBACK_LINEAR_STATE_ID  optional workflow state UUID (e.g. the team's
 *                             Triage); without it the team's default applies
 *   FEEDBACK_LINEAR_DAILY_CAP optional cap on issues per instance per day (50)
 *
 * With nothing configured the probe reports `enabled: false`, so the widget
 * stays hidden and merging this is a no-op until a sink exists.
 *
 * Request:  POST { verdict: 'up'|'down', reason?, comment?, path, title?,
 *                  abandoned?, hp? }
 * Response: 204 No Content on success (or when silently dropped);
 *           400 on invalid payload.
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';

export const config = { runtime: 'nodejs' };

const INGEST_URL = (process.env.FEEDBACK_INGEST_URL || '').trim();
const INGEST_TOKEN = (process.env.FEEDBACK_INGEST_TOKEN || '').trim();
const LINEAR_API_KEY = (process.env.FEEDBACK_LINEAR_API_KEY || '').trim();
const LINEAR_TEAM_ID = (process.env.FEEDBACK_LINEAR_TEAM_ID || '').trim();
const LINEAR_LABEL_IDS = (process.env.FEEDBACK_LINEAR_LABEL_IDS || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);
const LINEAR_PROJECT_ID = (process.env.FEEDBACK_LINEAR_PROJECT_ID || '').trim();
const LINEAR_STATE_ID = (process.env.FEEDBACK_LINEAR_STATE_ID || '').trim();
const LINEAR_DAILY_CAP = Number(process.env.FEEDBACK_LINEAR_DAILY_CAP) || 50;
const LINEAR_ENABLED = Boolean(LINEAR_API_KEY && LINEAR_TEAM_ID);

/** Upstream calls must not hold the function until Vercel kills it. */
const UPSTREAM_TIMEOUT_MS = 5000;

const SITE_ORIGIN = 'https://help.keboola.com';

/** Reason values rendered for humans; keys mirror ALLOWED_REASONS. */
const REASON_TEXT: Record<string, string> = {
  accurate: 'Accurate',
  'solved-problem': 'Solved my problem',
  'easy-to-understand': 'Easy to understand',
  'helped-decide': 'Helped me decide to use the product',
  inaccurate: 'Inaccurate',
  'hard-to-understand': 'Hard to understand',
  'missing-info': 'Missing information',
  'didnt-solve': "Didn't solve my problem",
  'another-reason': 'Another reason',
};

// Keep in sync with the reasons offered in Feedback.astro. Unknown reasons are
// dropped rather than rejected, so tweaking the UI never 400s a submission.
const ALLOWED_REASONS = new Set([
  // 👍 "What did you like?"
  'accurate',
  'solved-problem',
  'easy-to-understand',
  'helped-decide',
  // 👎 "What could be better?"
  'inaccurate',
  'hard-to-understand',
  'missing-info',
  'didnt-solve',
  // shared
  'another-reason',
]);

const MAX_COMMENT = 1000;
const MAX_FIELD = 512;

/**
 * What location.pathname can legitimately look like on this site. Anything
 * else is dropped: the path is interpolated into the issue's page link, so a
 * `]`, `)` or newline in it could otherwise inject markdown outside the fence.
 */
const PATH_RE = /^\/[A-Za-z0-9/_.~%-]{0,255}$/;

/** Per-IP issue limit within one function instance. */
const IP_WINDOW_MS = 60 * 60 * 1000;
const IP_MAX_ISSUES = 5;

interface FeedbackBody {
  verdict?: unknown;
  reason?: unknown;
  comment?: unknown;
  path?: unknown;
  title?: unknown;
  abandoned?: unknown;
  hp?: unknown; // honeypot — must be empty
}

export interface FeedbackRecord {
  submission_id: string;
  verdict: 'up' | 'down';
  reason: string;
  comment: string;
  path: string;
  title: string;
  locale: string;
  referrer: string;
  user_agent: string;
  abandoned: boolean;
  ts: string;
}

/**
 * Origins allowed to call this endpoint from a browser.
 *
 * In a production or preview build the widget requests `/api/feedback` with an
 * empty apiBase, i.e. same-origin, and same-origin requests are not subject to
 * CORS at all — so a wildcard grants access to nobody who needs it, and to
 * every third-party page that does not. That is a free spam vector: any site
 * could POST feedback using its visitors' browsers and IPs.
 *
 * The only cross-origin caller is `astro dev`, where Feedback.astro points
 * apiBase at the scratch beacon deployment. Hence localhost and this project's
 * own Vercel hostnames, rather than all of vercel.app — anyone can deploy
 * there.
 *
 * CORS is a browser control and stops none of this from curl, so the honeypot,
 * length caps and reason allow-list in buildRecord() remain the real defence.
 * This just removes the free half.
 */
const ALLOWED_ORIGIN =
  /^https:\/\/help\.keboola\.com$|^https:\/\/(?:connection-docs|keboola-docs-beacon)[a-z0-9-]*\.vercel\.app$|^http:\/\/(?:localhost|127\.0\.0\.1)(?::\d+)?$/;

function setCors(req: VercelRequest, res: VercelResponse) {
  const origin = typeof req.headers.origin === 'string' ? req.headers.origin : '';
  if (origin && ALLOWED_ORIGIN.test(origin)) {
    res.setHeader('access-control-allow-origin', origin);
    // The response now varies by origin; without this a shared cache could
    // hand one origin's allow header to another.
    res.setHeader('vary', 'origin');
  }
  res.setHeader('access-control-allow-headers', 'content-type');
  res.setHeader('access-control-allow-methods', 'POST, OPTIONS');
}

async function readJsonBody(req: VercelRequest): Promise<unknown> {
  // Vercel has already parsed a JSON body, including `null` or a bare number;
  // the caller decides what is a submission.
  if (req.body !== undefined && typeof req.body !== 'string') return req.body;
  if (typeof req.body === 'string' && req.body) return JSON.parse(req.body);
  const chunks: Buffer[] = [];
  for await (const chunk of req as any) chunks.push(chunk as Buffer);
  const raw = Buffer.concat(chunks).toString('utf-8');
  return raw ? JSON.parse(raw) : {};
}

/** Coerce to a trimmed string capped at `max` chars; non-strings → ''. */
function str(v: unknown, max = MAX_FIELD): string {
  return typeof v === 'string' ? v.trim().slice(0, max) : '';
}

/** Build a validated record, or null if the payload is unusable / dropped. */
export function buildRecord(body: FeedbackBody, req: VercelRequest): FeedbackRecord | null {
  // Honeypot: real users never fill this hidden field. Bots do — drop silently.
  if (str(body.hp)) return null;

  const verdict = body.verdict === 'up' || body.verdict === 'down' ? body.verdict : null;
  if (!verdict) return null;

  const path = str(body.path);
  if (!PATH_RE.test(path)) return null;

  const reasonRaw = str(body.reason, 64).toLowerCase();
  const reason = ALLOWED_REASONS.has(reasonRaw) ? reasonRaw : '';

  return {
    submission_id: `fb-${Date.now()}-${Math.round(Math.random() * 1e9).toString(36)}`,
    verdict,
    reason,
    // An abandoned verdict was never submitted, so whatever sits in the box is
    // not something the reader chose to send. The client strips it too.
    comment:
      body.abandoned === true
        ? ''
        : str(body.comment, MAX_COMMENT).replace(/\r\n?/g, '\n'),
    path,
    title: str(body.title).replace(/\s+/g, ' '),
    locale: str((req.headers['accept-language'] as string) || '', 32),
    referrer: str((req.headers['referer'] as string) || ''),
    user_agent: str((req.headers['user-agent'] as string) || ''),
    abandoned: body.abandoned === true,
    ts: new Date().toISOString(),
  };
}

/**
 * Wrap reader text in a code fence it cannot close: one backtick longer than
 * the longest run inside it. A blockquote doesn't hold — a bare `\r` ends the
 * quote, and mentions and references inside it still render.
 */
export function fence(text: string): string {
  const longest = Math.max(0, ...(text.match(/`+/g) ?? []).map((m) => m.length));
  const ticks = '`'.repeat(Math.max(3, longest + 1));
  return `${ticks}text\n${text}\n${ticks}`;
}

/** Markdown description for a Linear issue. Exported for the handler tests. */
export function issueMarkdown(record: FeedbackRecord): string {
  const verdict = record.verdict === 'up' ? '👍 Helpful' : '👎 Not helpful';
  const reason = REASON_TEXT[record.reason] || record.reason;

  // Blank entries are paragraph breaks and have to survive, so the optional
  // reason line is pushed conditionally rather than filtered out afterwards.
  const lines: string[] = [
    // `path` matched PATH_RE in buildRecord, so it is safe inside the link.
    `- **Page:** [${record.path}](${SITE_ORIGIN}${record.path})`,
    `- **Verdict:** ${verdict}`,
  ];
  if (reason) lines.push(`- **Reason:** ${reason}`);
  lines.push(
    '',
    '**Comment:**',
    '',
    fence(record.comment),
    '',
    '---',
    'Submitted from the docs feedback widget. Anonymous — there is no way to',
    `reply to the author, so treat this as a one-way report. (${record.ts})`,
  );
  return lines.join('\n');
}

const ISSUE_CREATE = `mutation DocsFeedback($input: IssueCreateInput!) {
  issueCreate(input: $input) { success issue { identifier } }
}`;

/**
 * File a submission as a Linear issue.
 *
 * Only called when the reader actually wrote something — that free text is the
 * part someone can act on, and it is the only part worth a notification.
 * `user_agent`, `referrer` and `locale` stay out of the issue: they belong in
 * an analytics table, not in a ticket.
 */
async function createLinearIssue(record: FeedbackRecord): Promise<void> {
  const pageTitle = record.title || record.path;
  const reason = REASON_TEXT[record.reason];
  const verdict = record.verdict === 'up' ? '👍' : '👎';
  const input: Record<string, unknown> = {
    teamId: LINEAR_TEAM_ID,
    title: `Docs feedback (${verdict}${reason ? ` ${reason}` : ''}): ${pageTitle}`.slice(0, 250),
    description: issueMarkdown(record),
  };
  if (LINEAR_LABEL_IDS.length) input.labelIds = LINEAR_LABEL_IDS;
  if (LINEAR_PROJECT_ID) input.projectId = LINEAR_PROJECT_ID;
  if (LINEAR_STATE_ID) input.stateId = LINEAR_STATE_ID;

  const res = await fetch('https://api.linear.app/graphql', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      // Personal API keys go in bare; OAuth access tokens need the scheme.
      authorization: LINEAR_API_KEY.startsWith('lin_api_')
        ? LINEAR_API_KEY
        : `Bearer ${LINEAR_API_KEY}`,
    },
    body: JSON.stringify({ query: ISSUE_CREATE, variables: { input } }),
    signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
  });
  // GraphQL reports most failures as 200 with an `errors` array.
  const json: any = await res.json().catch(() => null);
  if (!res.ok || json?.errors?.length || !json?.data?.issueCreate?.success) {
    const detail = json?.errors?.[0]?.message ?? `HTTP ${res.status}`;
    throw new Error(`feedback issue create failed: ${detail}`);
  }
}

/**
 * Rate limits on issue creation. The honeypot and caps do nothing against a
 * curl loop, and every commented request would otherwise become an issue.
 *
 * These counters live in one function instance, so they are a backstop, not
 * the limit: the real per-IP limit is a Vercel Firewall rule on /api/feedback.
 * What they guarantee is that a single warm instance can't flood the team.
 */
const ipHits = new Map<string, number[]>();
let dayKey = '';
let dayCount = 0;

function clientIp(req: VercelRequest): string {
  const fwd = req.headers['x-forwarded-for'];
  const first = (Array.isArray(fwd) ? fwd[0] : fwd || '').split(',')[0].trim();
  return first || 'unknown';
}

export function allowIssue(ip: string, now = Date.now()): boolean {
  const today = new Date(now).toISOString().slice(0, 10);
  if (today !== dayKey) {
    dayKey = today;
    dayCount = 0;
    ipHits.clear();
  }
  if (dayCount >= LINEAR_DAILY_CAP) return false;
  const recent = (ipHits.get(ip) ?? []).filter((t) => now - t < IP_WINDOW_MS);
  if (recent.length >= IP_MAX_ISSUES) {
    ipHits.set(ip, recent);
    return false;
  }
  recent.push(now);
  ipHits.set(ip, recent);
  dayCount += 1;
  return true;
}

/** Forward the record to the ingestion endpoint. */
async function postIngest(record: FeedbackRecord): Promise<void> {
  const headers: Record<string, string> = { 'content-type': 'application/json' };
  if (INGEST_TOKEN) headers.authorization = `Bearer ${INGEST_TOKEN}`;

  const res = await fetch(INGEST_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify(record),
    signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
  });
  if (!res.ok) {
    throw new Error(`feedback ingest failed: HTTP ${res.status}`);
  }
}

/**
 * Send the record to every configured sink. The sinks are independent: a
 * Linear failure must not cost the stream its row, and the other way round.
 * Resolves to false if any sink failed, after logging each failure.
 */
async function deliver(record: FeedbackRecord, req: VercelRequest): Promise<boolean> {
  const jobs: Promise<void>[] = [];
  if (LINEAR_ENABLED && record.comment) {
    if (allowIssue(clientIp(req))) jobs.push(createLinearIssue(record));
    else console.warn('[feedback] issue rate limit hit; comment kept in ingest only');
  }
  if (INGEST_URL) jobs.push(postIngest(record));

  const results = await Promise.allSettled(jobs);
  let ok = true;
  for (const r of results) {
    if (r.status === 'rejected') {
      ok = false;
      console.error('[feedback] sink error:', r.reason?.message ?? String(r.reason));
    }
  }
  return ok;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    setCors(req, res);
    res.setHeader('access-control-max-age', '86400');
    res.end();
    return;
  }

  // Probe: lets the static frontend decide whether to render the widget.
  if (req.method === 'GET') {
    res.statusCode = 200;
    res.setHeader('content-type', 'application/json');
    setCors(req, res);
    res.setHeader('cache-control', 'no-store');
    // Only with a sink. Otherwise readers' text would go nowhere but the short
    // retention of the function logs, so the widget stays hidden instead.
    res.end(JSON.stringify({ enabled: Boolean(INGEST_URL || LINEAR_ENABLED) }));
    return;
  }

  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('content-type', 'application/json');
    res.end(JSON.stringify({ error: 'Method not allowed' }));
    return;
  }

  setCors(req, res);

  let body: unknown;
  try {
    body = await readJsonBody(req);
  } catch {
    res.statusCode = 400;
    res.setHeader('content-type', 'application/json');
    res.end(JSON.stringify({ error: 'Invalid JSON body' }));
    return;
  }

  // `null`, an array or a number is valid JSON but not a submission.
  const record = body && typeof body === 'object' && !Array.isArray(body) ? buildRecord(body as FeedbackBody, req) : null;
  if (!record) {
    // Invalid or honeypot-tripped: 204 either way (don't teach bots the rules).
    res.statusCode = 204;
    res.end();
    return;
  }

  // Don't surface sink failures to the widget — the user already got their
  // "thanks". 202 (accepted, best-effort) tells the client something went
  // wrong without making it an error.
  res.statusCode = (await deliver(record, req)) ? 204 : 202;
  res.end();
}
