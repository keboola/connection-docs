/**
 * Reads the Keboola Platform Changelog RSS feed at build time.
 *
 * The changelog lives on Ghost at changelog.keboola.com; the docs only mirror
 * its newest entries on /changelog/ so a reader doesn't have to leave the site
 * to learn what changed. Ghost's feed is flat and well-formed — title, link,
 * pubDate, a short plain-text description and a full-HTML content:encoded per
 * item, no categories — so it is parsed here directly rather than through a
 * dependency. (`sax` happens to be in node_modules today, but only
 * transitively; leaning on it would break on an unrelated bump.)
 *
 * Only title, link, date and the short description are used. The full HTML
 * body is deliberately not rendered: it is Ghost markup styled for Ghost, and
 * the entry's own page is one click away.
 *
 * Never throws. A failed or slow fetch returns `{ ok: false }` so the page can
 * fall back to a plain link — a docs build must not fail because a marketing
 * site was down for a minute.
 */

export const CHANGELOG_URL = 'https://changelog.keboola.com/';
export const CHANGELOG_RSS_URL = 'https://changelog.keboola.com/rss/';

const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", '#39': "'" };

/** Unwraps a CDATA section if present, then decodes the XML entities. */
function text(raw) {
  if (raw == null) return '';
  let s = raw.trim();
  const cdata = s.match(/^<!\[CDATA\[([\s\S]*?)\]\]>$/);
  if (cdata) s = cdata[1];
  return s
    .replace(/&(amp|lt|gt|quot|apos|#39);/g, (_m, e) => ENTITIES[e])
    .replace(/&#(\d+);/g, (_m, n) => String.fromCodePoint(Number(n)))
    .trim();
}

/** First <tag>…</tag> inside an item, or '' — tags are not repeated in Ghost's feed. */
function field(item, tag) {
  const m = item.match(new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)</${tag}>`));
  return m ? text(m[1]) : '';
}

export function parseChangelogRss(xml) {
  const items = [];
  for (const [, body] of xml.matchAll(/<item>([\s\S]*?)<\/item>/g)) {
    const title = field(body, 'title');
    const link = field(body, 'link');
    const date = new Date(field(body, 'pubDate'));
    if (!title || !link || Number.isNaN(date.getTime())) continue;
    items.push({ title, link, date, description: field(body, 'description') });
  }
  // Ghost already orders newest first; sort anyway so the page never depends on it.
  return items.sort((a, b) => b.date - a.date);
}

/**
 * @param {{ url?: string, limit?: number, timeoutMs?: number }} [opts]
 * @returns {Promise<{ ok: true, items: Array<{title:string,link:string,date:Date,description:string}> } | { ok: false, error: string }>}
 */
export async function fetchChangelog({ url = CHANGELOG_RSS_URL, limit = 15, timeoutMs = 8000 } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal, headers: { accept: 'application/rss+xml, application/xml' } });
    if (!res.ok) return { ok: false, error: `HTTP ${res.status} from ${url}` };
    const items = parseChangelogRss(await res.text()).slice(0, limit);
    if (items.length === 0) return { ok: false, error: `no items parsed from ${url}` };
    return { ok: true, items };
  } catch (error) {
    return { ok: false, error: error?.name === 'AbortError' ? `timed out after ${timeoutMs}ms` : String(error?.message ?? error) };
  } finally {
    clearTimeout(timer);
  }
}
