## 2026-04-08
- Vitest config can stay minimal: include only `src/__tests__/**/*.test.ts` and `globals: true`.
- A simple typed mock helper is enough for the plugin test foundation; actual `vi.mock()` calls should live in each test file.
- @circleback/cli imports callTool from dist/client/jsonRpc.js; the export is callable from both CJS require and ESM import.
- Verified MCP tool names are SearchMeetings, ReadMeetings, SearchTranscripts, GetTranscriptsForMeetings, SearchCalendarEvents, FindProfiles, FindDomains, SearchSupportArticles, SearchEmails, and SearchActionItems.
