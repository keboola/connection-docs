// The guide's sample data, from one place.
//
// Two consumers: SampleData.astro, which draws the tables as cards on load/,
// and src/integrations/page-markdown.mjs, which prints the same rows as a
// table in the markdown twin. Row counts are the ones the 2026-09-08 runs
// loaded into project 264 (DECISIONS.md); change them here, not in the page.

export const SAMPLE_TABLES = [
  { name: 'stores', rows: '6', what: 'six cafés in six Czech cities' },
  { name: 'products', rows: '18', what: 'the menu' },
  { name: 'sales', rows: '9,761', what: 'one summer of sales' },
  { name: 'staffing', rows: '552', what: 'the roster for every café and day' },
  { name: 'weather_daily', rows: '552', what: 'the weather each café had that day' },
].map((t) => ({ ...t, file: `/getting-started/boolabean/${t.name}.csv` }));

export const FORECAST = {
  name: 'forecast',
  rows: '42',
  what: 'next week for all six cafés, live from Open-Meteo, no account or key',
  href: 'https://open-meteo.com/',
};

/** The markdown twin's version of the cards. */
export function sampleText() {
  return [
    '| Table | Source | Rows | What it holds |',
    '|---|---|---|---|',
    ...SAMPLE_TABLES.map((t) => `| ${t.name} | [${t.name}.csv](${t.file}) | ${t.rows} | ${t.what} |`),
    `| ${FORECAST.name} | [Open-Meteo forecast API](${FORECAST.href}) | ${FORECAST.rows} | ${FORECAST.what} |`,
  ];
}
