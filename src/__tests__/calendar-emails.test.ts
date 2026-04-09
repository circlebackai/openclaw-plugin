import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the CLI module BEFORE importing the tools
vi.mock("@circleback/cli/dist/client/jsonRpc.js", () => ({
  callTool: vi.fn(),
}));

import { callTool } from "@circleback/cli/dist/client/jsonRpc.js";
import { registerCalendarTools } from "../tools/calendar.js";
import { registerEmailTools } from "../tools/emails.js";

const mockedCallTool = vi.mocked(callTool);

describe("Calendar Tools", () => {
  const tools: any[] = [];
  const mockApi = { registerTool: (t: any) => tools.push(t) };

  beforeEach(() => {
    tools.length = 0;
    mockedCallTool.mockReset();
    registerCalendarTools(mockApi);
  });

  describe("SearchCalendarEvents", () => {
    it("registers with correct name and params", () => {
      const tool = tools.find((t) => t.name === "SearchCalendarEvents");
      expect(tool).toBeDefined();
      expect(tool.description).toBeTruthy();
      expect(tool.parameters).toBeDefined();
    });

    it("forwards intent and pageIndex to callTool and returns result", async () => {
      const mockResult = { content: [{ type: "text", text: "calendar events" }] };
      mockedCallTool.mockResolvedValueOnce(mockResult);

      const tool = tools.find((t) => t.name === "SearchCalendarEvents");
      const result = await tool.execute("call-1", { intent: "find team meetings", pageIndex: 0 });

      expect(mockedCallTool).toHaveBeenCalledWith("SearchCalendarEvents", {
        intent: "find team meetings",
        pageIndex: 0,
      });
      expect(result).toEqual(mockResult);
    });

    it("forwards optional startDate and endDate when provided", async () => {
      const mockResult = { content: [{ type: "text", text: "filtered events" }] };
      mockedCallTool.mockResolvedValueOnce(mockResult);

      const tool = tools.find((t) => t.name === "SearchCalendarEvents");
      await tool.execute("call-2", {
        intent: "find Q1 events",
        pageIndex: 1,
        startDate: "2026-01-01",
        endDate: "2026-03-31",
      });

      expect(mockedCallTool).toHaveBeenCalledWith("SearchCalendarEvents", {
        intent: "find Q1 events",
        pageIndex: 1,
        startDate: "2026-01-01",
        endDate: "2026-03-31",
      });
    });

    it("propagates callTool errors", async () => {
      mockedCallTool.mockRejectedValueOnce(new Error("Auth failed"));
      const tool = tools.find((t) => t.name === "SearchCalendarEvents");

      await expect(
        tool.execute("call-3", { intent: "test", pageIndex: 0 })
      ).rejects.toThrow("Auth failed");
    });
  });
});

describe("Email Tools", () => {
  const tools: any[] = [];
  const mockApi = { registerTool: (t: any) => tools.push(t) };

  beforeEach(() => {
    tools.length = 0;
    mockedCallTool.mockReset();
    registerEmailTools(mockApi);
  });

  describe("SearchEmails", () => {
    it("registers with correct name and params", () => {
      const tool = tools.find((t) => t.name === "SearchEmails");
      expect(tool).toBeDefined();
      expect(tool.description).toBeTruthy();
      expect(tool.parameters).toBeDefined();
    });

    it("forwards intent, pageIndex and searchTerm to callTool", async () => {
      const mockResult = { content: [{ type: "text", text: "emails data" }] };
      mockedCallTool.mockResolvedValueOnce(mockResult);

      const tool = tools.find((t) => t.name === "SearchEmails");
      const result = await tool.execute("call-4", {
        intent: "find project emails",
        pageIndex: 0,
        searchTerm: "project update",
      });

      expect(mockedCallTool).toHaveBeenCalledWith("SearchEmails", {
        intent: "find project emails",
        pageIndex: 0,
        searchTerm: "project update",
      });
      expect(result).toEqual(mockResult);
    });

    it("forwards searchTerm with inline filters (from:, to:) as-is", async () => {
      const mockResult = { content: [{ type: "text", text: "filtered emails" }] };
      mockedCallTool.mockResolvedValueOnce(mockResult);

      const tool = tools.find((t) => t.name === "SearchEmails");
      await tool.execute("call-5", {
        intent: "find emails from Alice",
        pageIndex: 0,
        searchTerm: "from:alice@example.com project",
      });

      expect(mockedCallTool).toHaveBeenCalledWith("SearchEmails", {
        intent: "find emails from Alice",
        pageIndex: 0,
        searchTerm: "from:alice@example.com project",
      });
    });

    it("propagates callTool errors", async () => {
      mockedCallTool.mockRejectedValueOnce(new Error("Network error"));
      const tool = tools.find((t) => t.name === "SearchEmails");

      await expect(
        tool.execute("call-6", { intent: "test", pageIndex: 0, searchTerm: "test" })
      ).rejects.toThrow("Network error");
    });
  });
});
