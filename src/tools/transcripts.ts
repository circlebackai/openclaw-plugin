import { callTool } from "@circleback/cli/dist/client/jsonRpc.js";
import { SearchTranscriptsParams, GetTranscriptsForMeetingsParams } from "../types.js";

export function registerTranscriptTools(api: any): void {
  api.registerTool({
    name: "SearchTranscripts",
    description: "Search meeting transcript content by keyword.",
    parameters: SearchTranscriptsParams,
    async execute(_toolCallId: string, params: Record<string, unknown>) {
      return await callTool("SearchTranscripts", params);
    },
  });

  api.registerTool({
    name: "GetTranscriptsForMeetings",
    description: "Retrieve complete transcripts for specific meetings.",
    parameters: GetTranscriptsForMeetingsParams,
    async execute(_toolCallId: string, params: Record<string, unknown>) {
      return await callTool("GetTranscriptsForMeetings", params);
    },
  });
}
