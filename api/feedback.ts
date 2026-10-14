/**
 * /api/feedback — receives documentation feedback from the page widget.
 *
 * Mirrors api/chat.ts conventions: plain JSON handler and a GET `{ enabled }`
 * probe, so the static frontend renders the widget only when a sink exists.
 *
 * Sinks:
 * - Linear: submissions that carry a written comment become issues, so docs
 *   feedback lands where the docs work is triaged. Linear rather than GitHub
 *   Issues: connection-docs is public, and readers paste project IDs, stack URLs
 *   and emails into a "what could be better?" box. A bare thumb is never filed:
 *   the widget is on every page, and one issue per click would bury the team.
 * - FEEDBACK_INGEST_URL (optional): every record, thumbs included, as a row.
 * - Function logs: when no ingest is configured, every vote is logged as one
 *   `[feedback] vote` line so it stays countable (a log drain can collect it),
 *   and a comment no sink accepted is logged as `[feedback] undelivered comment`
 *   rather than lost.
 *
 * An abandoned verdict (thumb clicked, form never submitted) never carries its
 * comment. It shares `submission_id` with a later full submission from the same
 * widget, so a consumer keeps the latest row per id.
 *
 * Env (set in the Vercel project):
 *   FEEDBACK_LINEAR_API_KEY   Linear API key or OAuth access token. The only
 *                             variable Linear filing needs. Issues show as
 *                             created by its owner, so prefer an app actor or a
 *                             service account over a person's key.
 *   FEEDBACK_LINEAR_TEAM_ID / _PROJECT_ID / _STATE_ID / _LABEL_IDS
 *                             optional overrides of LINEAR_DEFAULTS below; an
 *                             empty value clears project, state or labels. The
 *                             default project, state and label belong to the
 *                             default team, so another team gets none of them
 *                             unless they are set too.
 *   FEEDBACK_LINEAR_DAILY_CAP optional cap on issues per instance per day (50);
 *                             0 stops Linear filing
 *   FEEDBACK_INGEST_URL       optional ingestion endpoint (e.g. a Keboola Data
 *                             Stream URL)
 *   FEEDBACK_INGEST_TOKEN     optional bearer token for that endpoint
 *
 * With neither a Linear key nor an ingest URL the probe reports
 * `enabled: false`, so the widget stays hidden.
 *
 * Request:  POST { verdict: 'up'|'down', reason?, comment?, path, title?,
 *                  abandoned?, sid?, hp? }
 * Response: 204 when every record went where it should, or when the payload
 *           was dropped (invalid, honeypot); 202 when a sink failed or a
 *           comment reached no sink; 400 on a body that isn't JSON.
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';

export const config = { runtime: 'nodejs' };

const INGEST_URL = (process.env.FEEDBACK_INGEST_URL || '').trim();
const INGEST_TOKEN = (process.env.FEEDBACK_INGEST_TOKEN || '').trim();
const LINEAR_API_KEY = (process.env.FEEDBACK_LINEAR_API_KEY || '').trim();
// Where issues land. These IDs are not secrets, so they live here and the
// only thing the Vercel project has to hold is the API key. Env overrides them.
const LINEAR_DEFAULTS = {
  team: '20917244-2e69-4226-8f05-d1bf40d99ea2', // [Team] Product (PRDCT)
  project: 'f5a83846-63e4-4ddd-b19f-0ddfb425fc8b', // Docs feedback (P-PRDCT-302)
  state: '78e62541-bf17-4628-8155-a3c12470c66b', // Backlog (PRDCT has no Triage)
  labels: '9c08b2d5-1598-4aeb-bd4a-085349e371e2', // docs-feedback
};
const LINEAR_TEAM_ID = (process.env.FEEDBACK_LINEAR_TEAM_ID || '').trim() || LINEAR_DEFAULTS.team;
// The default project, state and label are PRDCT's. Sent with another team
// they would fail every issueCreate, so a team override drops them.
const TEAM_DEFAULTS =
  LINEAR_TEAM_ID === LINEAR_DEFAULTS.team ? LINEAR_DEFAULTS : { project: '', state: '', labels: '' };
const LINEAR_LABEL_IDS = (process.env.FEEDBACK_LINEAR_LABEL_IDS ?? TEAM_DEFAULTS.labels)
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);
const LINEAR_PROJECT_ID = (process.env.FEEDBACK_LINEAR_PROJECT_ID ?? TEAM_DEFAULTS.project).trim();
const LINEAR_STATE_ID = (process.env.FEEDBACK_LINEAR_STATE_ID ?? TEAM_DEFAULTS.state).trim();
// Parsed by hand: `Number(x) || 50` would turn an explicit 0 into 50.
const LINEAR_DAILY_CAP = (() => {
  const raw = (process.env.FEEDBACK_LINEAR_DAILY_CAP || '').trim();
  const n = Number(raw);
  return raw !== '' && Number.isFinite(n) && n >= 0 ? n : 50;
})();
const LINEAR_ENABLED = Boolean(LINEAR_API_KEY && LINEAR_TEAM_ID);

/** Upstream calls must not hold the function until Vercel kills it. */
const UPSTREAM_TIMEOUT_MS = 5000;

const SITE_ORIGIN = 'https://help.keboola.com';

/** Reason values rendered for humans; its keys are the allowed reasons. */
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

// Keep REASON_TEXT in sync with the reasons offered in Feedback.astro. Unknown
// reasons are dropped rather than rejected, so tweaking the UI never 400s a
// submission.
const ALLOWED_REASONS = new Set(Object.keys(REASON_TEXT));

const MAX_COMMENT = 1000;
const MAX_FIELD = 512;

/**
 * What location.pathname can legitimately look like on this site. Anything
 * else is dropped: the path is interpolated into the issue's page link, so a
 * `]`, `)` or newline in it could otherwise inject markdown outside the fence.
 */
const PATH_RE = /^\/[A-Za-z0-9/_.~%-]{0,255}$/;

/** A crypto.randomUUID() from the widget. */
const SID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

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
  sid?: unknown; // client-generated id, shared by the abandoned and the full row
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
 * CORS at all. The only cross-origin caller is `astro dev` on localhost, where
 * Feedback.astro points apiBase at the scratch beacon deployment. No vercel.app
 * pattern belongs here: anyone can name a Vercel project `connection-docs-…`.
 *
 * CORS is a browser control and stops none of this from curl, so the honeypot,
 * caps and rate limits remain the real defence. This removes the free half:
 * third-party pages posting with their visitors' browsers.
 */
const ALLOWED_ORIGIN = /^https:\/\/help\.keboola\.com$|^http:\/\/(?:localhost|127\.0\.0\.1)(?::\d+)?$/;

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

/** slice() that never leaves half of a surrogate pair (an emoji) at the end. */
function cut(s: string, max: number): string {
  const out = s.slice(0, max);
  return /[\uD800-\uDBFF]$/.test(out) ? out.slice(0, -1) : out;
}

/** Coerce to a trimmed string capped at `max` chars; non-strings → ''. */
function str(v: unknown, max = MAX_FIELD): string {
  return typeof v === 'string' ? cut(v.trim(), max) : '';
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

  const sid = str(body.sid, 64);
  return {
    submission_id: SID_RE.test(sid)
      ? sid
      : `fb-${Date.now()}-${Math.round(Math.random() * 1e9).toString(36)}`,
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
 * Wrap reader text in a code fence it cannot close. A blockquote doesn't hold
 * (a bare `\r` ends the quote, and mentions and references inside it still
 * render), and a longer fence only holds where the parser follows CommonMark's
 * fence-length rule. So no backtick run survives at all: a zero-width space goes
 * between adjacent backticks, which no parser reads as a fence.
 */
export function fence(text: string): string {
  return '```text\n' + text.replace(/`(?=`)/g, '`\u200B') + '\n```';
}

/** Markdown description for a Linear issue. Exported for the handler tests. */
export function issueMarkdown(record: FeedbackRecord): string {
  const verdict = record.verdict === 'up' ? '👍 Helpful' : '👎 Not helpful';
  const reason = REASON_TEXT[record.reason] || record.reason;

  // Blank entries are paragraph breaks and have to survive, so the optional
  // reason line is pushed conditionally rather than filtered out afterwards.
  const lines: string[] = [
    // `path` matched PATH_RE in buildRecord, so it is safe inside the link.
    // Code span in the link text, so `~` or `_` in a path can't format it.
    `- **Page:** [\`${record.path}\`](${SITE_ORIGIN}${record.path})`,
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
    'Submitted from the docs feedback widget. Anonymous: there is no way to',
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
    title: cut(`Docs feedback (${verdict}${reason ? ` ${reason}` : ''}): ${pageTitle}`, 250),
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
 * Resolves to false if a sink failed or a comment reached no sink.
 */
async function deliver(record: FeedbackRecord, req: VercelRequest): Promise<boolean> {
  let linear: Promise<void> | null = null;
  if (LINEAR_ENABLED && record.comment) {
    if (allowIssue(clientIp(req))) linear = createLinearIssue(record);
    else console.warn('[feedback] issue rate limit hit');
  }
  const [linearResult, ingestResult] = await Promise.allSettled([
    linear ?? Promise.resolve(),
    INGEST_URL ? postIngest(record) : Promise.resolve(),
  ]);

  let ok = true;
  for (const r of [linearResult, ingestResult]) {
    if (r.status === 'rejected') {
      ok = false;
      console.error('[feedback] sink error:', r.reason?.message ?? String(r.reason));
    }
  }

  const inIngest = Boolean(INGEST_URL) && ingestResult.status === 'fulfilled';
  if (!inIngest) {
    // No row anywhere, so keep the vote countable from the logs. No comment,
    // user agent or referrer in this line.
    const { submission_id, verdict, reason, path, abandoned, ts } = record;
    console.log('[feedback] vote', JSON.stringify({ submission_id, verdict, reason, path, abandoned, ts }));
    const inLinear = linear !== null && linearResult.status === 'fulfilled';
    if (record.comment && !inLinear) {
      // Rate-limited, Linear down or the key revoked: the logs are the last
      // place this comment exists, so say so loudly instead of dropping it.
      ok = false;
      console.error(
        '[feedback] undelivered comment',
        JSON.stringify({ submission_id, path, comment: record.comment }),
      );
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
