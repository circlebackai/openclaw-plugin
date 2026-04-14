import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";
import { callTool } from "@circleback/cli/dist/client/jsonRpc.js";

const tools = [
  {
    name: "SearchMeetings",
    description:
      "Search meetings by keyword, date range, tags, people, or companies.",
    inputSchema: {
      type: "object" as const,
      properties: {
        intent: {
          type: "string",
          description: "The reason why this tool call is being done.",
        },
        searchTerm: {
          type: "string",
          description: "Optional search term to find related meetings.",
        },
        pageIndex: {
          type: "number",
          description: "The page index to fetch. Always start with page 0.",
        },
        startDate: {
          type: "string",
          description:
            "Optional ISO date string (YYYY-MM-DD) for earliest date.",
        },
        endDate: {
          type: "string",
          description:
            "Optional ISO date string (YYYY-MM-DD) for latest date.",
        },
        tags: {
          type: "array",
          items: { type: "number" },
          description: "Optional array of tag IDs to filter by.",
        },
        profiles: {
          type: "array",
          items: { type: "number" },
          description: "Optional array of profile IDs to filter by.",
        },
        domains: {
          type: "array",
          items: { type: "string" },
          description: "Optional array of domains to filter by.",
        },
      },
      required: ["intent", "pageIndex"],
    },
  },
  {
    name: "ReadMeetings",
    description:
      "Get detailed meeting info including notes and action items.",
    inputSchema: {
      type: "object" as const,
      properties: {
        intent: {
          type: "string",
          description: "The reason why this tool call is being done.",
        },
        meetingIds: {
          type: "array",
          items: { type: "number" },
          description: "The meeting IDs to get more information about.",
        },
      },
      required: ["intent", "meetingIds"],
    },
  },
  {
    name: "SearchTranscripts",
    description: "Search meeting transcript content by keyword.",
    inputSchema: {
      type: "object" as const,
      properties: {
        intent: {
          type: "string",
          description: "The reason why this tool call is being done.",
        },
        searchTerm: {
          type: "string",
          description:
            "The search term to find relevant transcript chunks.",
        },
        tags: {
          type: "array",
          items: { type: "number" },
          description: "Optional array of tag IDs to filter by.",
        },
        profiles: {
          type: "array",
          items: { type: "number" },
          description: "Optional array of profile IDs to filter by.",
        },
        domains: {
          type: "array",
          items: { type: "string" },
          description: "Optional array of domains to filter by.",
        },
      },
      required: ["intent", "searchTerm"],
    },
  },
  {
    name: "GetTranscriptsForMeetings",
    description: "Retrieve complete transcripts for specific meetings.",
    inputSchema: {
      type: "object" as const,
      properties: {
        intent: {
          type: "string",
          description: "The reason why this tool call is being done.",
        },
        meetingIds: {
          type: "array",
          items: { type: "number" },
          maxItems: 50,
          description: "Array of meeting IDs to get transcripts for.",
        },
      },
      required: ["intent", "meetingIds"],
    },
  },
  {
    name: "SearchCalendarEvents",
    description: "Search calendar events by date range.",
    inputSchema: {
      type: "object" as const,
      properties: {
        intent: {
          type: "string",
          description: "The reason why this tool call is being done.",
        },
        startDate: {
          type: "string",
          description:
            "Optional ISO date string (YYYY-MM-DD) for earliest date.",
        },
        endDate: {
          type: "string",
          description:
            "Optional ISO date string (YYYY-MM-DD) for latest date.",
        },
        pageIndex: {
          type: "number",
          description: "The page index to fetch. Always start with page 0.",
        },
      },
      required: ["intent", "pageIndex"],
    },
  },
  {
    name: "SearchEmails",
    description:
      "Search emails with inline filters (from:, to:, before:, after:).",
    inputSchema: {
      type: "object" as const,
      properties: {
        intent: {
          type: "string",
          description: "The reason why this tool call is being done.",
        },
        searchTerm: {
          type: "string",
          description:
            "Query string supporting filters: from:, to:, participant:, before:, after:",
        },
        pageIndex: {
          type: "number",
          description: "The page index to fetch. Always start with page 0.",
        },
      },
      required: ["intent", "searchTerm"],
    },
  },
  {
    name: "FindProfiles",
    description: "Search people by name.",
    inputSchema: {
      type: "object" as const,
      properties: {
        searchTerms: {
          type: "array",
          items: { type: "string" },
          description:
            "Array of people's names to find matching profiles.",
        },
      },
      required: ["searchTerms"],
    },
  },
  {
    name: "FindDomains",
    description: "Search companies by name or domain.",
    inputSchema: {
      type: "object" as const,
      properties: {
        searchTerms: {
          type: "array",
          items: { type: "string" },
          description:
            "Array of search terms to find matching company domains.",
        },
      },
      required: ["searchTerms"],
    },
  },
  {
    name: "SearchActionItems",
    description:
      "Search action items with status, assignee, date, and tag filters.",
    inputSchema: {
      type: "object" as const,
      properties: {
        intent: {
          type: "string",
          description: "The reason why this tool call is being done.",
        },
        searchTerms: {
          type: "array",
          items: { type: "string" },
          description: "Optional search keywords.",
        },
        status: {
          type: "string",
          enum: ["Pending", "Done"],
          description: "Optional status filter.",
        },
        pageIndex: {
          type: "number",
          description: "The page index to fetch. Always start with page 0.",
        },
        startDate: {
          type: "string",
          description:
            "Optional ISO date string (YYYY-MM-DD) for earliest date.",
        },
        endDate: {
          type: "string",
          description:
            "Optional ISO date string (YYYY-MM-DD) for latest date.",
        },
        tags: {
          type: "array",
          items: { type: "number" },
          description: "Optional array of tag IDs to filter by.",
        },
        assigneeProfileId: {
          type: "number",
          description: "Profile ID to filter by assignee.",
        },
      },
      required: ["intent", "pageIndex"],
    },
  },
  {
    name: "SearchSupportArticles",
    description: "Search Circleback support documentation.",
    inputSchema: {
      type: "object" as const,
      properties: {
        searchTerm: {
          type: "string",
          description:
            "Search term or query to find relevant support articles.",
        },
      },
      required: ["searchTerm"],
    },
  },
  {
    name: "ListTags",
    description: "List all tags used to organize meetings.",
    inputSchema: {
      type: "object" as const,
      properties: {
        intent: {
          type: "string",
          description: "The reason why this tool call is being done.",
        },
      },
      required: ["intent"],
    },
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
        name: tool.name,
        description: tool.description,
        inputSchema: tool.inputSchema,
        async execute(_toolCallId: string, params: Record<string, unknown>) {
          const text = await callTool(tool.name, params);
          return { content: [{ type: "text", text }] };
        },
      });
    }
  },
});
