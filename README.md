# Circleback for OpenClaw

Circleback Community Plugin for OpenClaw. Search and access meetings, transcripts, emails, calendar events, and more.

## Prerequisites

- Node.js >= 18
- [@circleback/cli](https://www.npmjs.com/package/@circleback/cli) installed globally
- Authenticated via `cb login`

## Installation

npm install -g @circleback/cli
cb login
openclaw plugin add @circleback/openclaw-circleback

## Authentication

This plugin uses `@circleback/cli` for authentication. You must run `cb login` once to authenticate with your Circleback account. Tokens are stored at `~/.config/circleback/tokens.json` and refresh automatically.

If you encounter authentication errors, run `cb login` again to refresh your tokens.

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

**"Not authenticated" error**: Run `cb login` to authenticate with Circleback.

**"Token expired" error**: Run `cb login` again. Tokens normally refresh automatically, but may expire after extended inactivity.

**Plugin not loading**: Ensure `@circleback/cli` is installed globally (`npm install -g @circleback/cli`).
