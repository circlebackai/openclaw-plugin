import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the CLI module BEFORE importing the tools
vi.mock("@circleback/cli/dist/client/jsonRpc.js", () => ({
  callTool: vi.fn(),
}));

import { callTool } from "@circleback/cli/dist/client/jsonRpc.js";
import { registerMeetingTools } from "../tools/meetings.js";

const mockedCallTool = vi.mocked(callTool);

describe("Meeting Tools", () => {
  const tools: any[] = [];
  const mockApi = { registerTool: (t: any) => tools.push(t) };

  beforeEach(() => {
    tools.length = 0;
    mockedCallTool.mockReset();
    registerMeetingTools(mockApi);
  });

  describe("SearchMeetings", () => {
    it("registers with correct name and params", () => {
      const tool = tools.find((t) => t.name === "SearchMeetings");
      expect(tool).toBeDefined();
      expect(tool.description).toBeTruthy();
      expect(tool.parameters).toBeDefined();
    });

    it("forwards params to callTool and returns result", async () => {
      const mockResult = { content: [{ type: "text", text: "meetings data" }] };
      mockedCallTool.mockResolvedValueOnce(mockResult);

      const tool = tools.find((t) => t.name === "SearchMeetings");
      const result = await tool.execute("call-1", { intent: "find standup", pageIndex: 0 });

      expect(mockedCallTool).toHaveBeenCalledWith("SearchMeetings", { intent: "find standup", pageIndex: 0 });
      expect(result).toEqual(mockResult);
    });
  });

  describe("ReadMeetings", () => {
    it("registers with correct name", () => {
      const tool = tools.find((t) => t.name === "ReadMeetings");
      expect(tool).toBeDefined();
    });

    it("forwards meetingIds to callTool", async () => {
      const mockResult = { content: [{ type: "text", text: "meeting details" }] };
      mockedCallTool.mockResolvedValueOnce(mockResult);

      const tool = tools.find((t) => t.name === "ReadMeetings");
      const result = await tool.execute("call-2", { intent: "read meeting", meetingIds: [1, 2] });

      expect(mockedCallTool).toHaveBeenCalledWith("ReadMeetings", { intent: "read meeting", meetingIds: [1, 2] });
      expect(result).toEqual(mockResult);
    });
  });

  it("handles callTool errors gracefully", async () => {
    mockedCallTool.mockRejectedValueOnce(new Error("Auth failed"));
    const tool = tools.find((t) => t.name === "SearchMeetings");
    
    await expect(tool.execute("call-3", { intent: "test", pageIndex: 0 })).rejects.toThrow("Auth failed");
  });
});
