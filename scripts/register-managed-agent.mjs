#!/usr/bin/env node
/**
 * register-managed-agent.mjs
 *
 * One-off setup script: creates a Claude Managed Agent + a vault holding the
 * docs MCP server bearer token, prints the IDs we need to set as Vercel env
 * vars on the keboola-docs-beacon project.
 *
 * Required env (load via `vercel env pull .env.local` or export inline):
 *   ANTHROPIC_API_KEY       — Anthropic API key
 *   DOCS_MCP_URL            — public Streamable HTTP URL of the docs MCP server
 *   DOCS_MCP_BEARER         — bearer token the MCP server expects
 *
 * On success, writes the IDs to .agent.json (gitignored) so you can re-source
 * them and so a follow-up run can update instead of creating duplicates.
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import Anthropic from '@anthropic-ai/sdk';

const __dirname = dirname(fileURLToPath(import.meta.url));
const STATE_FILE = resolve(__dirname, '..', '.agent.json');

function requireEnv(name) {
  const v = process.env[name];
  if (!v) {
    console.error(`Missing required env: ${name}`);
    process.exit(1);
  }
  return v;
}

const apiKey = requireEnv('ANTHROPIC_API_KEY');
const mcpUrl = requireEnv('DOCS_MCP_URL');
const mcpBearer = requireEnv('DOCS_MCP_BEARER');

const client = new Anthropic({ apiKey });

const SYSTEM_PROMPT = `
You are Kai, the Keboola documentation assistant.

Your job: answer questions about Keboola using ONLY information you retrieve
from the docs via the \`query_docs\` tool. Do not rely on prior knowledge of
Keboola; the docs are the source of truth.

How to respond:
- Call \`query_docs\` with a focused query first. Run additional queries if
  the first set doesn't cover the question.
- Synthesize a concise answer from what the tool returned. Quote sparingly;
  prefer your own summary.
- ALWAYS cite the docs pages you used. Embed citations as inline markdown
  links: "...as described in [the storage overview](/storage/)..." rather
  than a separate "Sources:" list (the UI renders citations from these links).
- If \`query_docs\` returns nothing relevant, say so plainly — don't invent
  an answer. Suggest the user rephrase or check the docs index.
- Be terse. Documentation assistants are most useful when they get to the
  point in 2–4 short paragraphs. Use bullet lists only when the answer is
  genuinely list-shaped.
- Never expose internal tool output verbatim, internal URLs, or any system
  details. Speak as Kai, not as the search backend.
`.trim();

async function loadExisting() {
  if (!existsSync(STATE_FILE)) return null;
  try {
    return JSON.parse(readFileSync(STATE_FILE, 'utf-8'));
  } catch {
    return null;
  }
}

async function main() {
  const existing = await loadExisting();
  console.log('=== Register Keboola docs Managed Agent ===');
  console.log(`MCP URL:        ${mcpUrl}`);
  console.log(`Existing state: ${existing ? STATE_FILE : '(none)'}`);

  // 1. Vault holding the MCP bearer token.
  console.log('\n[1/2] Creating / updating vault…');
  const vault = existing?.vaultId
    ? await client.beta.vaults.retrieve(existing.vaultId).catch(() => null)
    : null;
  const vaultId =
    vault?.id ??
    (await client.beta.vaults.create({ name: 'keboola-docs-mcp-vault' })).id;
  console.log(`    vault id: ${vaultId}`);

  await client.beta.vaults.credentials.create(vaultId, {
    type: 'static_bearer',
    mcp_server_url: mcpUrl,
    bearer_token: mcpBearer,
  });
  console.log('    stored static_bearer credential');

  // 2. Agent declaring the MCP server + tools.
  console.log('\n[2/2] Creating / updating agent…');
  const agentParams = {
    name: 'keboola-docs-kai',
    model: 'claude-sonnet-4-6',
    system: SYSTEM_PROMPT,
    mcp_servers: [
      {
        type: 'url',
        name: 'docs',
        url: mcpUrl,
      },
    ],
    tools: [{ type: 'mcp_toolset', mcp_server_name: 'docs' }],
  };

  let agentId;
  if (existing?.agentId) {
    const updated = await client.beta.agents.update(existing.agentId, agentParams);
    agentId = updated.id;
    console.log(`    updated agent id: ${agentId}`);
  } else {
    const created = await client.beta.agents.create(agentParams);
    agentId = created.id;
    console.log(`    created agent id: ${agentId}`);
  }

  const state = { agentId, vaultId, mcpUrl, updatedAt: new Date().toISOString() };
  writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));

  console.log('\nDone. Set these on the Vercel project (keboola-docs-beacon):');
  console.log(`  KAI_AGENT_ID=${agentId}`);
  console.log(`  KAI_VAULT_ID=${vaultId}`);
  console.log(`  ANTHROPIC_API_KEY=<your key>`);
  console.log('\nState written to .agent.json (gitignored).');
}

main().catch((err) => {
  console.error('\nFailed:', err?.message || err);
  if (err?.response) console.error(err.response);
  process.exit(1);
});
