import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";
import { callTool } from "@circleback/cli/dist/client/jsonRpc.js";

const tools = [
  {
    name: "SearchMeetings",
    description: "Search meetings by keyword, date range, tags, people, or companies.",
  },
  {
    name: "ReadMeetings",
    description: "Get detailed meeting info including notes and action items.",
  },
  {
    name: "SearchTranscripts",
    description: "Search meeting transcript content by keyword.",
  },
  {
    name: "GetTranscriptsForMeetings",
    description: "Retrieve complete transcripts for specific meetings.",
  },
  {
    name: "SearchCalendarEvents",
    description: "Search calendar events by date range.",
  },
  {
    name: "SearchEmails",
    description: "Search emails with inline filters (from:, to:, before:, after:).",
  },
  {
    name: "FindProfiles",
    description: "Search people by name.",
  },
  {
    name: "FindDomains",
    description: "Search companies by name or domain.",
  },
  {
    name: "SearchActionItems",
    description: "Search action items with status, assignee, date, and tag filters.",
  },
  {
    name: "SearchSupportArticles",
    description: "Search Circleback support documentation.",
  },
];

export default definePluginEntry({
  id: "circleback",
  name: "Circleback",
  description:
    "Search and access meetings, transcripts, emails, calendar events, and more from Circleback.",
  register(api) {
    for (const tool of tools) {
      api.registerTool({
        ...tool,
        async execute(_toolCallId: string, params: Record<string, unknown>) {
          return await callTool(tool.name, params);
        },
      });
    }
  },
});
