# Circleback for OpenClaw

Circleback plugin for OpenClaw. Search and access meetings, transcripts, emails, calendar events, and more.

## Setup

1. Install the plugin:
   ```
   openclaw plugins install @circleback/openclaw-circleback
   ```

2. Authenticate with Circleback:
   ```
   cb login
   ```
   This opens a browser window to log in. Tokens are stored locally and refresh automatically.

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
| FindDomains | Search companies by name or domain |
| SearchActionItems | Search action items with status, assignee, date, and tag filters |
| SearchSupportArticles | Search Circleback support documentation |
| ListTags | List all tags used to organize meetings |

## Troubleshooting

**"Not authenticated" error**: Run `cb login` to authenticate.

**"Token expired" error**: Run `cb login` again.
