import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";
import { callTool } from "@circleback/cli/dist/client/jsonRpc.js";
import tools from "./tools.json" with { type: "json" };

export default definePluginEntry({
  id: "circleback",
  name: "Circleback",
  description:
    "Search and manage meetings, transcripts, action items, tags, emails, calendar events, and more in Circleback.",
  register(api) {
    tools.forEach((tool) => {
      api.registerTool({
        name: tool.name,
        description: tool.description,
        parameters: tool.inputSchema,
        async execute(_toolCallId: string, params: Record<string, unknown>) {
          const text = await callTool(tool.name, params);
          return { content: [{ type: "text", text }] };
        },
      });
    });
  },
});
