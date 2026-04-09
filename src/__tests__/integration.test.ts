import { describe, it, expect, vi } from "vitest";

vi.mock("@circleback/cli/dist/client/jsonRpc.js", () => ({
  callTool: vi.fn(),
}));

vi.mock("openclaw/plugin-sdk/plugin-entry", () => ({
  definePluginEntry: (opts: any) => opts,
}));

import entry from "../../index.js";

describe("Plugin Integration", () => {
  it("exports plugin entry with correct id", () => {
    expect(entry.id).toBe("circleback");
    expect(entry.name).toBe("Circleback");
    expect(typeof entry.register).toBe("function");
  });

  it("registers exactly 10 tools", () => {
    const tools: any[] = [];
    const mockApi = { registerTool: (t: any) => tools.push(t) };
    entry.register(mockApi);

    expect(tools).toHaveLength(10);
  });

  it("registers all expected tool names", () => {
    const tools: any[] = [];
    const mockApi = { registerTool: (t: any) => tools.push(t) };
    entry.register(mockApi);

    const names = tools.map((t) => t.name).sort();
    expect(names).toEqual([
      "FindDomains",
      "FindProfiles",
      "GetTranscriptsForMeetings",
      "ReadMeetings",
      "SearchActionItems",
      "SearchCalendarEvents",
      "SearchEmails",
      "SearchMeetings",
      "SearchSupportArticles",
      "SearchTranscripts",
    ]);
  });

  it("every tool has name, description, parameters, and execute", () => {
    const tools: any[] = [];
    const mockApi = { registerTool: (t: any) => tools.push(t) };
    entry.register(mockApi);

    for (const tool of tools) {
      expect(tool.name).toBeTruthy();
      expect(tool.description).toBeTruthy();
      expect(tool.parameters).toBeDefined();
      expect(typeof tool.execute).toBe("function");
    }
  });
});
