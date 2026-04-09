import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";
import { registerMeetingTools } from "./src/tools/meetings.js";
import { registerTranscriptTools } from "./src/tools/transcripts.js";
import { registerCalendarTools } from "./src/tools/calendar.js";
import { registerEmailTools } from "./src/tools/emails.js";
import { registerPeopleTools } from "./src/tools/people.js";
import { registerActionTools } from "./src/tools/actions.js";

export default definePluginEntry({
  id: "circleback",
  name: "Circleback",
  description: "Search and access meetings, transcripts, emails, calendar events, and more from Circleback.",
  register(api) {
    registerMeetingTools(api);
    registerTranscriptTools(api);
    registerCalendarTools(api);
    registerEmailTools(api);
    registerPeopleTools(api);
    registerActionTools(api);
  },
});
