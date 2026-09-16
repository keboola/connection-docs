/**
 * /api/feedback — receives documentation feedback from the page widget and
 * forwards it to a Keboola ingestion endpoint (intended to be a Data Stream
 * that lands each submission as a row in a Storage table).
 *
 * Mirrors api/chat.ts conventions: plain JSON handler, permissive CORS, a GET
 * `{ enabled }` probe so the static frontend can decide whether to render the
 * widget, and a stub mode when the ingestion env isn't configured yet (so the
 * site can ship before the stream exists).
 *
 * Submissions that carry a written comment are additionally filed as GitHub
 * issues, so docs feedback lands where the docs are worked on rather than in a
 * separate database. A bare thumb is never filed: the widget is on all ~366
 * pages, and one issue per click would bury the repository. Bare thumbs (and
 * the beacon-captured abandoned ones) still reach the ingest endpoint below.
 *
 * Optional env (set in the Vercel project):
 *   FEEDBACK_INGEST_URL     ingestion endpoint (e.g. a Keboola Data Stream URL)
 *   FEEDBACK_INGEST_TOKEN   optional bearer token for that endpoint
 *   FEEDBACK_GITHUB_TOKEN   token with Issues: write on FEEDBACK_GITHUB_REPO.
 *                           Use a fine-grained PAT scoped to that one repo —
 *                           this endpoint is reachable by anyone.
 *   FEEDBACK_GITHUB_REPO    owner/repo to file into (default keboola/connection-docs)
 *
 * With neither configured the handler stays in stub mode (logs + 204).
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
const GITHUB_TOKEN = (process.env.FEEDBACK_GITHUB_TOKEN || '').trim();
const GITHUB_REPO = (process.env.FEEDBACK_GITHUB_REPO || 'keboola/connection-docs').trim();

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

interface FeedbackBody {
  verdict?: unknown;
  reason?: unknown;
  comment?: unknown;
  path?: unknown;
  title?: unknown;
  abandoned?: unknown;
  hp?: unknown; // honeypot — must be empty
}

interface FeedbackRecord {
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

function setCors(res: VercelResponse) {
  res.setHeader('access-control-allow-origin', '*');
  res.setHeader('access-control-allow-headers', 'content-type');
  res.setHeader('access-control-allow-methods', 'POST, OPTIONS');
}

async function readJsonBody(req: VercelRequest): Promise<FeedbackBody> {
  if (req.body && typeof req.body === 'object') return req.body as FeedbackBody;
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
function buildRecord(body: FeedbackBody, req: VercelRequest): FeedbackRecord | null {
  // Honeypot: real users never fill this hidden field. Bots do — drop silently.
  if (str(body.hp)) return null;

  const verdict = body.verdict === 'up' || body.verdict === 'down' ? body.verdict : null;
  if (!verdict) return null;

  const path = str(body.path);
  if (!path.startsWith('/')) return null;

  const reasonRaw = str(body.reason, 64).toLowerCase();
  const reason = ALLOWED_REASONS.has(reasonRaw) ? reasonRaw : '';

  return {
    submission_id: `fb-${Date.now()}-${Math.round(Math.random() * 1e9).toString(36)}`,
    verdict,
    reason,
    comment: str(body.comment, MAX_COMMENT),
    path,
    title: str(body.title),
    locale: str((req.headers['accept-language'] as string) || '', 32),
    referrer: str((req.headers['referer'] as string) || ''),
    user_agent: str((req.headers['user-agent'] as string) || ''),
    abandoned: body.abandoned === true,
    ts: new Date().toISOString(),
  };
}

/**
 * File a submission as a GitHub issue.
 *
 * Only called when the reader actually wrote something — that free text is the
 * part a maintainer can act on, and it is the only part worth a notification.
 *
 * The issue body deliberately omits `user_agent`, `referrer` and `locale`.
 * They are useful in a private analytics table but this repository is public,
 * and together they are mildly fingerprinting for no reviewer benefit.
 */
async function createIssue(record: FeedbackRecord): Promise<void> {
  const pageTitle = record.title || record.path;
  const verdict = record.verdict === 'up' ? '👍' : '👎';
  const reason = REASON_TEXT[record.reason] || record.reason;

  // Blank entries are paragraph breaks and have to survive, so the optional
  // reason line is pushed conditionally rather than filtered out afterwards.
  // A list rather than bare lines: consecutive single newlines only render as
  // breaks where a flavour enables hard wrapping, and this body is also read
  // through the API and in notification emails.
  const lines: string[] = [
    `- **Page:** [${record.path}](${SITE_ORIGIN}${record.path})`,
    `- **Verdict:** ${verdict} ${record.verdict === 'up' ? 'Helpful' : 'Not helpful'}`,
  ];
  if (reason) lines.push(`- **Reason:** ${reason}`);
  lines.push(
    '',
    '**Comment:**',
    '',
    // Quote the reader's text so no markdown in it can restructure the issue.
    record.comment
      .split('\n')
      .map((line) => `> ${line}`)
      .join('\n'),
    '',
    '---',
    'Submitted from the docs feedback widget. Anonymous — there is no way to',
    `reply to the author, so treat this as a one-way report. (${record.ts})`,
  );
  const body = lines.join('\n');

  const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/issues`, {
    method: 'POST',
    headers: {
      accept: 'application/vnd.github+json',
      authorization: `Bearer ${GITHUB_TOKEN}`,
      'content-type': 'application/json',
      'x-github-api-version': '2022-11-28',
    },
    body: JSON.stringify({
      title: `Docs feedback: ${pageTitle}`.slice(0, 250),
      body,
      labels: ['docs-feedback', record.verdict === 'up' ? 'feedback:up' : 'feedback:down'],
    }),
  });

  if (!res.ok) {
    // 410 means Issues are disabled on the repo — the one failure worth naming,
    // because it is a settings toggle rather than a bug.
    const hint = res.status === 410 ? ' (Issues disabled on the repository?)' : '';
    throw new Error(`feedback issue create failed: HTTP ${res.status}${hint}`);
  }
}

/** Forward the record to the ingestion endpoint. No-op (stub) when unconfigured. */
async function ingest(record: FeedbackRecord): Promise<void> {
  // A written comment goes to GitHub as an issue; everything else is a counter
  // and belongs in the stream only. The two paths are independent, so a repo
  // with Issues still off doesn't stop the stream from collecting.
  if (GITHUB_TOKEN && record.comment) {
    await createIssue(record);
  }

  if (!INGEST_URL) {
    if (!GITHUB_TOKEN) {
      // Stub mode: nothing wired up at all. Log so it's visible in Vercel.
      console.log('[feedback] (stub, no ingest configured)', JSON.stringify(record));
    }
    return;
  }
  const headers: Record<string, string> = { 'content-type': 'application/json' };
  if (INGEST_TOKEN) headers.authorization = `Bearer ${INGEST_TOKEN}`;

  const res = await fetch(INGEST_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify(record),
  });
  if (!res.ok) {
    throw new Error(`feedback ingest failed: HTTP ${res.status}`);
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    setCors(res);
    res.setHeader('access-control-max-age', '86400');
    res.end();
    return;
  }

  // Probe: lets the static frontend decide whether to render the widget.
  if (req.method === 'GET') {
    res.statusCode = 200;
    res.setHeader('content-type', 'application/json');
    setCors(res);
    res.setHeader('cache-control', 'no-store');
    // Enabled even in stub mode: the widget still works (submissions are logged
    // server-side) and starts collecting the moment the stream env is set.
    res.end(JSON.stringify({ enabled: true }));
    return;
  }

  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('content-type', 'application/json');
    res.end(JSON.stringify({ error: 'Method not allowed' }));
    return;
  }

  setCors(res);

  let body: FeedbackBody;
  try {
    body = await readJsonBody(req);
  } catch {
    res.statusCode = 400;
    res.setHeader('content-type', 'application/json');
    res.end(JSON.stringify({ error: 'Invalid JSON body' }));
    return;
  }

  const record = buildRecord(body, req);
  if (!record) {
    // Invalid or honeypot-tripped: 204 either way (don't teach bots the rules).
    res.statusCode = 204;
    res.end();
    return;
  }

  try {
    await ingest(record);
  } catch (err: any) {
    // Don't surface ingestion failures to the widget — the user already got
    // their "thanks". Log for ops and return 202 (accepted, best-effort).
    console.error('[feedback] ingest error:', err?.message ?? String(err));
    res.statusCode = 202;
    res.end();
    return;
  }

  res.statusCode = 204;
  res.end();
}
