import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the CLI module BEFORE importing the tools
vi.mock("@circleback/cli/dist/client/jsonRpc.js", () => ({
  callTool: vi.fn(),
}));

import { callTool } from "@circleback/cli/dist/client/jsonRpc.js";
import { registerTranscriptTools } from "../tools/transcripts.js";

const mockedCallTool = vi.mocked(callTool);

describe("Transcript Tools", () => {
  const tools: any[] = [];
  const mockApi = { registerTool: (t: any) => tools.push(t) };

  beforeEach(() => {
    tools.length = 0;
    mockedCallTool.mockReset();
    registerTranscriptTools(mockApi);
  });

  describe("SearchTranscripts", () => {
    it("registers with correct name and params", () => {
      const tool = tools.find((t) => t.name === "SearchTranscripts");
      expect(tool).toBeDefined();
      expect(tool.description).toBeTruthy();
      expect(tool.parameters).toBeDefined();
    });

    it("forwards intent+searchTerm to callTool and returns result", async () => {
      const mockResult = { content: [{ type: "text", text: "transcript data" }] };
      mockedCallTool.mockResolvedValueOnce(mockResult);

      const tool = tools.find((t) => t.name === "SearchTranscripts");
      const result = await tool.execute("call-1", { intent: "find transcript", searchTerm: "budget" });

      expect(mockedCallTool).toHaveBeenCalledWith("SearchTranscripts", { intent: "find transcript", searchTerm: "budget" });
      expect(result).toEqual(mockResult);
    });

    it("forwards optional filters (tags, profiles, domains) to callTool", async () => {
      const mockResult = { content: [{ type: "text", text: "filtered transcripts" }] };
      mockedCallTool.mockResolvedValueOnce(mockResult);

      const tool = tools.find((t) => t.name === "SearchTranscripts");
      const params = { intent: "filtered search", searchTerm: "Q4", tags: [1, 2], profiles: [10], domains: ["acme.com"] };
      const result = await tool.execute("call-2", params);

      expect(mockedCallTool).toHaveBeenCalledWith("SearchTranscripts", params);
      expect(result).toEqual(mockResult);
    });
  });

  describe("GetTranscriptsForMeetings", () => {
    it("registers with correct name", () => {
      const tool = tools.find((t) => t.name === "GetTranscriptsForMeetings");
      expect(tool).toBeDefined();
    });

    it("forwards intent+meetingIds to callTool", async () => {
      const mockResult = { content: [{ type: "text", text: "full transcript" }] };
      mockedCallTool.mockResolvedValueOnce(mockResult);

      const tool = tools.find((t) => t.name === "GetTranscriptsForMeetings");
      const result = await tool.execute("call-3", { intent: "get transcripts", meetingIds: [42, 43] });

      expect(mockedCallTool).toHaveBeenCalledWith("GetTranscriptsForMeetings", { intent: "get transcripts", meetingIds: [42, 43] });
      expect(result).toEqual(mockResult);
    });
  });

  it("handles callTool errors gracefully", async () => {
    mockedCallTool.mockRejectedValueOnce(new Error("Auth failed"));
    const tool = tools.find((t) => t.name === "SearchTranscripts");

    await expect(tool.execute("call-4", { intent: "test", searchTerm: "fail" })).rejects.toThrow("Auth failed");
  });
});
