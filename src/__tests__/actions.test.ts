import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the CLI module BEFORE importing the tools
vi.mock("@circleback/cli/dist/client/jsonRpc.js", () => ({
  callTool: vi.fn(),
}));

import { callTool } from "@circleback/cli/dist/client/jsonRpc.js";
import { registerActionTools } from "../tools/actions.js";

const mockedCallTool = vi.mocked(callTool);

describe("Action Tools", () => {
  const tools: any[] = [];
  const mockApi = { registerTool: (t: any) => tools.push(t) };

  beforeEach(() => {
    tools.length = 0;
    mockedCallTool.mockReset();
    registerActionTools(mockApi);
  });

  describe("SearchActionItems", () => {
    it("registers with correct name and params", () => {
      const tool = tools.find((t) => t.name === "SearchActionItems");
      expect(tool).toBeDefined();
      expect(tool.description).toBeTruthy();
      expect(tool.parameters).toBeDefined();
    });

    it("forwards required intent and pageIndex to callTool", async () => {
      const mockResult = { content: [{ type: "text", text: "action items data" }] };
      mockedCallTool.mockResolvedValueOnce(mockResult);

      const tool = tools.find((t) => t.name === "SearchActionItems");
      const result = await tool.execute("call-1", { intent: "find my tasks", pageIndex: 0 });

      expect(mockedCallTool).toHaveBeenCalledWith("SearchActionItems", { intent: "find my tasks", pageIndex: 0 });
      expect(result).toEqual(mockResult);
    });

    it("forwards optional status filter (PENDING)", async () => {
      const mockResult = { content: [{ type: "text", text: "pending items" }] };
      mockedCallTool.mockResolvedValueOnce(mockResult);

      const tool = tools.find((t) => t.name === "SearchActionItems");
      const result = await tool.execute("call-2", {
        intent: "find pending tasks",
        pageIndex: 0,
        status: "PENDING",
      });

      expect(mockedCallTool).toHaveBeenCalledWith("SearchActionItems", {
        intent: "find pending tasks",
        pageIndex: 0,
        status: "PENDING",
      });
      expect(result).toEqual(mockResult);
    });

    it("forwards optional status filter (DONE)", async () => {
      const mockResult = { content: [{ type: "text", text: "done items" }] };
      mockedCallTool.mockResolvedValueOnce(mockResult);

      const tool = tools.find((t) => t.name === "SearchActionItems");
      await tool.execute("call-3", { intent: "find done tasks", pageIndex: 1, status: "DONE" });

      expect(mockedCallTool).toHaveBeenCalledWith("SearchActionItems", {
        intent: "find done tasks",
        pageIndex: 1,
        status: "DONE",
      });
    });

    it("forwards optional assigneeProfileId (number)", async () => {
      const mockResult = { content: [{ type: "text", text: "assigned items" }] };
      mockedCallTool.mockResolvedValueOnce(mockResult);

      const tool = tools.find((t) => t.name === "SearchActionItems");
      await tool.execute("call-4", {
        intent: "find assigned tasks",
        pageIndex: 0,
        assigneeProfileId: 42,
      });

      expect(mockedCallTool).toHaveBeenCalledWith("SearchActionItems", {
        intent: "find assigned tasks",
        pageIndex: 0,
        assigneeProfileId: 42,
      });
    });

    it("forwards optional tags (array of numbers)", async () => {
      const mockResult = { content: [{ type: "text", text: "tagged items" }] };
      mockedCallTool.mockResolvedValueOnce(mockResult);

      const tool = tools.find((t) => t.name === "SearchActionItems");
      await tool.execute("call-5", { intent: "find tagged tasks", pageIndex: 0, tags: [1, 2, 3] });

      expect(mockedCallTool).toHaveBeenCalledWith("SearchActionItems", {
        intent: "find tagged tasks",
        pageIndex: 0,
        tags: [1, 2, 3],
      });
    });

    it("forwards all optional filters together", async () => {
      const mockResult = { content: [{ type: "text", text: "filtered items" }] };
      mockedCallTool.mockResolvedValueOnce(mockResult);

      const tool = tools.find((t) => t.name === "SearchActionItems");
      const params = {
        intent: "find all matching tasks",
        pageIndex: 2,
        searchTerms: ["urgent", "review"],
        status: "PENDING",
        startDate: "2026-01-01",
        endDate: "2026-04-08",
        tags: [10, 20],
        assigneeProfileId: 99,
      };
      const result = await tool.execute("call-6", params);

      expect(mockedCallTool).toHaveBeenCalledWith("SearchActionItems", params);
      expect(result).toEqual(mockResult);
    });
  });

  describe("SearchSupportArticles", () => {
    it("registers with correct name and params", () => {
      const tool = tools.find((t) => t.name === "SearchSupportArticles");
      expect(tool).toBeDefined();
      expect(tool.description).toBeTruthy();
      expect(tool.parameters).toBeDefined();
    });

    it("forwards intent and searchTerm to callTool", async () => {
      const mockResult = { content: [{ type: "text", text: "support articles" }] };
      mockedCallTool.mockResolvedValueOnce(mockResult);

      const tool = tools.find((t) => t.name === "SearchSupportArticles");
      const result = await tool.execute("call-7", { intent: "how to integrate", searchTerm: "OAuth setup" });

      expect(mockedCallTool).toHaveBeenCalledWith("SearchSupportArticles", {
        intent: "how to integrate",
        searchTerm: "OAuth setup",
      });
      expect(result).toEqual(mockResult);
    });
  });

  it("handles callTool errors gracefully (propagates the error)", async () => {
    mockedCallTool.mockRejectedValueOnce(new Error("Auth failed"));
    const tool = tools.find((t) => t.name === "SearchActionItems");

    await expect(tool.execute("call-err", { intent: "test", pageIndex: 0 })).rejects.toThrow("Auth failed");
  });
});
