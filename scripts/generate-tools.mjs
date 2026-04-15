#!/usr/bin/env node

/**
 * Generates tools.json from the Circleback MCP server's tools/list endpoint.
 * Requires: `cb login` to have been run (needs valid auth tokens).
 */

import { createRequire } from "module";
import { writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const require = createRequire(import.meta.url);
const { getValidAccessToken } = require("@circleback/cli/dist/auth/oauth");
const { BASE_URL } = require("@circleback/cli/dist/constants");

const __dirname = dirname(fileURLToPath(import.meta.url));

async function fetchToolsList() {
  const accessToken = await getValidAccessToken();

  const response = await fetch(`${BASE_URL}/api/mcp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json, text/event-stream",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "tools/list",
      params: {},
    }),
  });

  if (!response.ok) {
    throw new Error(`MCP server returned ${response.status}: ${await response.text()}`);
  }

  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("text/event-stream")) {
    const text = await response.text();
    const lines = text.split("\n").filter((l) => l.startsWith("data: "));
    for (const line of lines) {
      const parsed = JSON.parse(line.slice(6));
      if (parsed.error) throw new Error(`MCP error: ${parsed.error.message}`);
      if (parsed.result?.tools) return parsed.result.tools;
    }
    throw new Error("No tools found in SSE response.");
  }

  const body = await response.json();
  if (body.error) throw new Error(`MCP error: ${body.error.message}`);
  return body.result.tools;
}

async function main() {
  console.log("Fetching tools from Circleback MCP server...");

  const mcpTools = await fetchToolsList();

  const tools = mcpTools.map((tool) => ({
    name: tool.name,
    description: tool.description,
    inputSchema: tool.inputSchema,
  }));

  const outPath = join(__dirname, "..", "tools.json");
  writeFileSync(outPath, JSON.stringify(tools, null, 2) + "\n");

  console.log(`Wrote ${tools.length} tools to tools.json`);
  for (const t of tools) {
    console.log(`  - ${t.name}`);
  }
}

main().catch((err) => {
  console.error("Failed to generate tools:", err.message);
  process.exit(1);
});
