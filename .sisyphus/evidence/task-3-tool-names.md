# Verified Circleback MCP Tool Names

## callTool Import Path
./node_modules/@circleback/cli/dist/client/jsonRpc.js
typeof callTool: function

## Tool Names (verified from source)

| CLI Command File | Tool Name | Parameters |
|---|---|---|
| commands/meetings.js | SearchMeetings | { intent, pageIndex, searchTerm?, startDate?, endDate?, tags?, profiles?, domains? } |
| commands/meetings.js | ReadMeetings | { intent, meetingIds } |
| commands/transcripts.js | SearchTranscripts | { intent, searchTerm, tags?, profiles?, domains? } |
| commands/transcripts.js | GetTranscriptsForMeetings | { intent, meetingIds } |
| commands/calendar.js | SearchCalendarEvents | { intent, pageIndex, startDate?, endDate? } |
| commands/profiles.js | FindProfiles | { searchTerms } |
| commands/domains.js | FindDomains | { searchTerms } |
| commands/support.js | SearchSupportArticles | { intent, searchTerm } |
| commands/emails.js | SearchEmails | { intent, pageIndex, searchTerm } |
| commands/actionItems.js | SearchActionItems | { intent, pageIndex, searchTerms?, status?, startDate?, endDate?, tags?, assigneeProfileId? } |

## Pagination Model
Page-index based. SearchMeetings, SearchEmails, and SearchActionItems accept `--page` and pass a numeric `pageIndex`. Calendar hardcodes `pageIndex: 0`. The other commands do not paginate.

## All 10 Tool Names (in order)
1. SearchMeetings
2. ReadMeetings
3. SearchTranscripts
4. GetTranscriptsForMeetings
5. SearchCalendarEvents
6. FindProfiles
7. FindDomains
8. SearchSupportArticles
9. SearchEmails
10. SearchActionItems
