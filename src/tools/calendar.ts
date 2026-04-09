import { callTool } from "@circleback/cli/dist/client/jsonRpc.js";
import { SearchCalendarEventsParams } from "../types.js";

export function registerCalendarTools(api: any): void {
  api.registerTool({
    name: "SearchCalendarEvents",
    description: "Search calendar events by date range.",
    parameters: SearchCalendarEventsParams,
    async execute(_toolCallId: string, params: Record<string, unknown>) {
      return await callTool("SearchCalendarEvents", params);
    },
  });
}
