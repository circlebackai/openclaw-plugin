# Circleback OpenClaw plugin

Circleback plugin for OpenClaw. Search and access meetings, transcripts, emails, calendar events, and more.

## Setup

1. Install the plugin:
   ```
   openclaw plugins install @circleback/openclaw-circleback
   ```

2. Authenticate with Circleback:
   ```
   cb auth login
   ```
   This opens a browser window to log in. Tokens are stored locally and refresh automatically.

   Alternatively, run `cb auth login --api-key` or set `CIRCLEBACK_API_KEY`.

## Available Tools

| Tool | Description |
|------|-------------|
| SearchMeetings | Search meetings by keyword, date range, tags, people, or companies |
| ReadMeetings | Get detailed meeting info including notes and action items |
| SearchTranscripts | Search meeting transcript content by keyword |
| GetTranscriptsForMeetings | Retrieve complete transcripts for specific meetings |
| SearchCalendarEvents | Search calendar events by date range |
| SearchEmails | Search emails with inline filters (from:, to:, before:, after:) |
| FindProfiles | Search people by name |
| FindCompanies | Search companies by name or domain |
| SearchActionItems | Search action items with status, assignee, date, and tag filters |
| SearchSupportArticles | Search Circleback support documentation |
| ListTags | List all tags used to organize meetings |

## Troubleshooting

**"Not logged in" error**: Run `cb auth login` to authenticate.

**"Authentication expired" error**: Run `cb auth logout`, then `cb auth login` again.
