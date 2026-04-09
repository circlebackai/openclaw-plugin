import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the CLI module BEFORE importing the tools
vi.mock("@circleback/cli/dist/client/jsonRpc.js", () => ({
  callTool: vi.fn(),
}));

import { callTool } from "@circleback/cli/dist/client/jsonRpc.js";
import { registerPeopleTools } from "../tools/people.js";

const mockedCallTool = vi.mocked(callTool);

describe("People Tools", () => {
  const tools: any[] = [];
  const mockApi = { registerTool: (t: any) => tools.push(t) };

  beforeEach(() => {
    tools.length = 0;
    mockedCallTool.mockReset();
    registerPeopleTools(mockApi);
  });

  describe("FindProfiles", () => {
    it("registers with correct name and params", () => {
      const tool = tools.find((t) => t.name === "FindProfiles");
      expect(tool).toBeDefined();
      expect(tool.description).toBeTruthy();
      expect(tool.parameters).toBeDefined();
    });

    it("forwards searchTerms array to callTool and returns result", async () => {
      const mockResult = { content: [{ type: "text", text: "profiles data" }] };
      mockedCallTool.mockResolvedValueOnce(mockResult);

      const tool = tools.find((t) => t.name === "FindProfiles");
      const result = await tool.execute("call-1", { searchTerms: ["Alice", "Bob"] });

      expect(mockedCallTool).toHaveBeenCalledWith("FindProfiles", { searchTerms: ["Alice", "Bob"] });
      expect(result).toEqual(mockResult);
    });
  });

  describe("FindDomains", () => {
    it("registers with correct name and params", () => {
      const tool = tools.find((t) => t.name === "FindDomains");
      expect(tool).toBeDefined();
      expect(tool.description).toBeTruthy();
      expect(tool.parameters).toBeDefined();
    });

    it("forwards searchTerms array to callTool and returns result", async () => {
      const mockResult = { content: [{ type: "text", text: "domains data" }] };
      mockedCallTool.mockResolvedValueOnce(mockResult);

      const tool = tools.find((t) => t.name === "FindDomains");
      const result = await tool.execute("call-2", { searchTerms: ["acme.com", "Acme Corp"] });

      expect(mockedCallTool).toHaveBeenCalledWith("FindDomains", { searchTerms: ["acme.com", "Acme Corp"] });
      expect(result).toEqual(mockResult);
    });
  });

  it("handles callTool errors gracefully", async () => {
    mockedCallTool.mockRejectedValueOnce(new Error("Auth failed"));
    const tool = tools.find((t) => t.name === "FindProfiles");

    await expect(tool.execute("call-3", { searchTerms: ["Alice"] })).rejects.toThrow("Auth failed");
  });
});
