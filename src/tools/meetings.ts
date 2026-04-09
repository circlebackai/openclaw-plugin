import { callTool } from "@circleback/cli/dist/client/jsonRpc.js";
import { SearchMeetingsParams, ReadMeetingsParams } from "../types.js";

export function registerMeetingTools(api: any): void {
  api.registerTool({
    name: "SearchMeetings",
    description: "Search meetings by keyword, date range, tags, people, or companies.",
    parameters: SearchMeetingsParams,
    async execute(_toolCallId: string, params: Record<string, unknown>) {
      return await callTool("SearchMeetings", params);
    },
  });

  api.registerTool({
    name: "ReadMeetings",
    description: "Get detailed meeting info including notes and action items.",
    parameters: ReadMeetingsParams,
    async execute(_toolCallId: string, params: Record<string, unknown>) {
      return await callTool("ReadMeetings", params);
    },
  });
}
