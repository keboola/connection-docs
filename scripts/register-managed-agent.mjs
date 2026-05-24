#!/usr/bin/env node
/**
 * register-managed-agent.mjs
 *
 * One-off setup script: creates a Claude Managed Agent that points at the
 * docs MCP server, prints the IDs we need to set as Vercel env vars on the
 * keboola-docs-beacon project.
 *
 * Required env (load via `vercel env pull .env.local` or export inline):
 *   ANTHROPIC_API_KEY       — Anthropic API key
 *   DOCS_MCP_URL            — public Streamable HTTP URL of the docs MCP server
 *
 * Optional:
 *   DOCS_MCP_BEARER         — bearer token for the MCP server. If set, a vault
 *                              holding it is created and the script prints
 *                              KAI_VAULT_ID. If unset, the MCP server is
 *                              assumed to be open (no auth) and no vault is
 *                              created.
 *
 * On success, writes the IDs to .agent.json (gitignored) so you can re-source
 * them and so a follow-up run can update instead of creating duplicates.
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import Anthropic from '@anthropic-ai/sdk';

// Run via:
//   node --env-file=.env.local scripts/register-managed-agent.mjs
// Pull the env first with: vercel env pull .env.local --environment=production

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
const mcpBearer = process.env.DOCS_MCP_BEARER || null;

const client = new Anthropic({ apiKey });

const SYSTEM_PROMPT = `
You are Kai, the Keboola documentation assistant in a sidebar chat widget.

Your only knowledge source is the \`docs_query\` MCP tool. Do not rely on
prior knowledge of Keboola; the docs are the source of truth.

Be brief. The widget is narrow. Default to 60–120 words. Use one short
paragraph, or 3–6 short bullets only when the answer is genuinely a list.
Never include H1/H2/H3 headings (\`#\`, \`##\`, \`###\`) — the response renders
inside an existing card and headings look wrong. If you need structure,
use **bold** for short labels at the start of bullets.

Citations: embed every fact's source as an inline markdown link like
\`...as described in [Flows overview](https://help.keboola.com/flows/)...\`.
Only use URLs the tool returned in \`source_urls\`; never invent links. No
separate "Sources" list — citations are inline only.

If \`docs_query\` returns nothing relevant, say so plainly in one sentence
and suggest a rephrase. Don't pad. Don't apologize. Don't say "based on
the docs" — just answer.

Never expose raw tool output, JSON, internal URLs, or any reasoning steps.
You are Kai talking to a user, not a debug log.
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

  // 0. Environment — the runtime sandbox the agent operates in. Required
  //    by sessions.create(). One per project is fine; we reuse if it exists.
  console.log('\n[0/2] Creating / reusing environment…');
  let environmentId = existing?.environmentId || null;
  if (environmentId) {
    const env = await client.beta.environments.retrieve(environmentId).catch(() => null);
    if (!env) environmentId = null;
  }
  if (!environmentId) {
    const env = await client.beta.environments.create({ name: 'keboola-docs-env' });
    environmentId = env.id;
  }
  console.log(`    environment id: ${environmentId}`);

  // 1. Vault — only needed if the MCP server requires a bearer token.
  let vaultId = null;
  if (mcpBearer) {
    console.log('\n[1/2] Creating / updating vault…');
    const vault = existing?.vaultId
      ? await client.beta.vaults.retrieve(existing.vaultId).catch(() => null)
      : null;
    vaultId =
      vault?.id ??
      (await client.beta.vaults.create({ name: 'keboola-docs-mcp-vault' })).id;
    console.log(`    vault id: ${vaultId}`);

    await client.beta.vaults.credentials.create(vaultId, {
      type: 'static_bearer',
      mcp_server_url: mcpUrl,
      bearer_token: mcpBearer,
    });
    console.log('    stored static_bearer credential');
  } else {
    console.log('\n[1/2] Skipping vault — MCP server is open (no bearer).');
  }

  // 2. Agent declaring the MCP server + tools.
  console.log('\n[2/2] Creating / updating agent…');
  const agentParams = {
    name: 'keboola-docs-kai',
    // Haiku is plenty for tool-driven docs Q&A and ~2-3x faster than Sonnet
    // for the simple synthesize-from-search pattern we're using here.
    model: 'claude-haiku-4-5',
    system: SYSTEM_PROMPT,
    mcp_servers: [
      {
        type: 'url',
        name: 'docs',
        url: mcpUrl,
      },
    ],
    tools: [
      {
        type: 'mcp_toolset',
        mcp_server_name: 'docs',
        // Auto-approve every tool call. The docs MCP is read-only and exposed
        // to a public docs chat widget; gating each call on human approval
        // would freeze the conversation. (Default is `always_ask`.)
        default_config: {
          enabled: true,
          permission_policy: { type: 'always_allow' },
        },
      },
    ],
  };

  let agentId;
  if (existing?.agentId) {
    // Update requires the current version for optimistic concurrency.
    const current = await client.beta.agents.retrieve(existing.agentId);
    const updated = await client.beta.agents.update(existing.agentId, {
      ...agentParams,
      version: current.version,
    });
    agentId = updated.id;
    console.log(`    updated agent id: ${agentId} (v${updated.version})`);
  } else {
    const created = await client.beta.agents.create(agentParams);
    agentId = created.id;
    console.log(`    created agent id: ${agentId}`);
  }

  const state = {
    agentId,
    environmentId,
    vaultId,
    mcpUrl,
    updatedAt: new Date().toISOString(),
  };
  writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));

  console.log('\nDone. Set these on the Vercel project (keboola-docs-beacon):');
  console.log(`  ANTHROPIC_API_KEY=<your key>`);
  console.log(`  KAI_AGENT_ID=${agentId}`);
  console.log(`  KAI_ENVIRONMENT_ID=${environmentId}`);
  if (vaultId) console.log(`  KAI_VAULT_ID=${vaultId}`);
  console.log('\nState written to .agent.json (gitignored).');
}

main().catch((err) => {
  console.error('\nFailed:', err?.message || err);
  if (err?.response) console.error(err.response);
  process.exit(1);
});
