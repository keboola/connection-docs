// Tests for src/components/lede.mjs, which decides whether PageTitle.astro
// shows a page's description as the lede under the H1. A description that is
// the body's own first sentence would show twice, so it is dropped; a summary
// stays. Run: npm test

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { firstParagraph, ledeRepeatsBody } from '../src/components/lede.mjs';

test('a description copied from the first sentence repeats the body', () => {
  const body = '\nThis data destination connector sends data to a Snowflake database.\nIt supports\nfull and incremental loads.\n\n## Configuration\n';
  assert.equal(
    ledeRepeatsBody('This data destination connector sends data to a Snowflake database.', body),
    true,
  );
});

test('a summary does not repeat the body', () => {
  const body = 'This data destination connector sends data to a Snowflake database.\n';
  assert.equal(ledeRepeatsBody('Write tables from Storage to an existing Snowflake database.', body), false);
});

test('markup, case and a closing colon turned period do not hide a repeat', () => {
  const body = 'Components are divided into the **following** [categories](/components/#types):\n\n- one\n';
  assert.equal(ledeRepeatsBody('Components are divided into the following categories.', body), true);
});

test('links with parentheses in the URL keep only their text', () => {
  const body = 'An [API](https://en.wikipedia.org/wiki/Interface_(computing)) is an interface to an application.\n';
  assert.equal(ledeRepeatsBody('An API is an interface to an application.', body), true);
});

test('a paragraph cut short by a list is the start of the description', () => {
  const body = 'The connector allows you to fetch data from the\n- [Azure Table storage](https://example.com) or the\n- Cosmos DB Table API.\n';
  assert.equal(
    ledeRepeatsBody('The connector allows you to fetch data from the Azure Table storage or the Cosmos DB Table API.', body),
    true,
  );
});

test('a short first paragraph does not swallow an unrelated description', () => {
  assert.equal(ledeRepeatsBody('Kai is generally available in every project.', 'Kai is\n'), false);
});

test('first paragraph skips what renders before the prose', () => {
  const body = [
    "import Prereqs from '../components/Prereqs.astro';",
    '',
    '<!-- VERIFY(owner): something',
    'spanning two lines -->',
    '{/* an MDX comment */}',
    ':::caution[Deprecated]',
    'This connector no longer works.',
    ':::',
    '```bash',
    'echo not prose',
    '```',
    '![Screenshot](/a/b.png)',
    '<Prereqs needs={["project"]} />',
    '',
    'The first real paragraph',
    'continues here.',
    '',
    'The second paragraph.',
  ].join('\r\n');
  assert.equal(firstParagraph(body), 'The first real paragraph continues here.');
});

test('a body with no prose has no first paragraph', () => {
  assert.equal(firstParagraph('## Heading\n\n- a list\n'), '');
  assert.equal(ledeRepeatsBody('Anything at all.', '## Heading\n'), false);
});
