import { Type, type Static } from "@sinclair/typebox";

export type CallToolResult = {
  content: Array<{ type: string; text: string }>;
};

export const SearchMeetingsParams = Type.Object({
  intent: Type.String({ description: "What the user is looking for" }),
  pageIndex: Type.Number({ description: "Page index (0-based)" }),
  searchTerm: Type.Optional(Type.String({ description: "Search keyword" })),
  startDate: Type.Optional(Type.String({ description: "Start date (ISO format)" })),
  endDate: Type.Optional(Type.String({ description: "End date (ISO format)" })),
  tags: Type.Optional(Type.Array(Type.Number(), { description: "Tag IDs to filter by" })),
  profiles: Type.Optional(Type.Array(Type.Number(), { description: "Profile IDs to filter by" })),
  domains: Type.Optional(Type.Array(Type.String(), { description: "Domain names to filter by" })),
});
export type SearchMeetingsInput = Static<typeof SearchMeetingsParams>;

export const ReadMeetingsParams = Type.Object({
  intent: Type.String({ description: "What the user is looking for" }),
  meetingIds: Type.Array(Type.Number(), { description: "Meeting IDs to read" }),
});
export type ReadMeetingsInput = Static<typeof ReadMeetingsParams>;

export const SearchTranscriptsParams = Type.Object({
  intent: Type.String({ description: "What the user is looking for" }),
  searchTerm: Type.String({ description: "Search keyword (required)" }),
  tags: Type.Optional(Type.Array(Type.Number(), { description: "Tag IDs to filter by" })),
  profiles: Type.Optional(Type.Array(Type.Number(), { description: "Profile IDs to filter by" })),
  domains: Type.Optional(Type.Array(Type.String(), { description: "Domain names to filter by" })),
});
export type SearchTranscriptsInput = Static<typeof SearchTranscriptsParams>;

export const GetTranscriptsForMeetingsParams = Type.Object({
  intent: Type.String({ description: "What the user is looking for" }),
  meetingIds: Type.Array(Type.Number(), { description: "Meeting IDs (max 50)" }),
});
export type GetTranscriptsForMeetingsInput = Static<typeof GetTranscriptsForMeetingsParams>;

export const SearchCalendarEventsParams = Type.Object({
  intent: Type.String({ description: "What the user is looking for" }),
  pageIndex: Type.Number({ description: "Page index (0-based)" }),
  startDate: Type.Optional(Type.String({ description: "Start date (ISO format)" })),
  endDate: Type.Optional(Type.String({ description: "End date (ISO format)" })),
});
export type SearchCalendarEventsInput = Static<typeof SearchCalendarEventsParams>;

export const FindProfilesParams = Type.Object({
  searchTerms: Type.Array(Type.String(), { description: "Names to search for" }),
});
export type FindProfilesInput = Static<typeof FindProfilesParams>;

export const FindDomainsParams = Type.Object({
  searchTerms: Type.Array(Type.String(), { description: "Company names or domains to search for" }),
});
export type FindDomainsInput = Static<typeof FindDomainsParams>;

export const SearchSupportArticlesParams = Type.Object({
  intent: Type.String({ description: "What the user is looking for" }),
  searchTerm: Type.String({ description: "Search keyword" }),
});
export type SearchSupportArticlesInput = Static<typeof SearchSupportArticlesParams>;

export const SearchEmailsParams = Type.Object({
  intent: Type.String({ description: "What the user is looking for" }),
  pageIndex: Type.Number({ description: "Page index (0-based)" }),
  searchTerm: Type.String({ description: "Search term (supports from:, to:, before:, after: prefixes)" }),
});
export type SearchEmailsInput = Static<typeof SearchEmailsParams>;

export const SearchActionItemsParams = Type.Object({
  intent: Type.String({ description: "What the user is looking for" }),
  pageIndex: Type.Number({ description: "Page index (0-based)" }),
  searchTerms: Type.Optional(Type.Array(Type.String(), { description: "Search keywords" })),
  status: Type.Optional(Type.String({ description: "PENDING or DONE" })),
  startDate: Type.Optional(Type.String({ description: "Start date (ISO format)" })),
  endDate: Type.Optional(Type.String({ description: "End date (ISO format)" })),
  tags: Type.Optional(Type.Array(Type.Number(), { description: "Tag IDs" })),
  assigneeProfileId: Type.Optional(Type.Number({ description: "Assignee profile ID" })),
});
export type SearchActionItemsInput = Static<typeof SearchActionItemsParams>;
