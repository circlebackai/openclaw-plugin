import { vi } from "vitest";

export type CallToolResult = {
  content: Array<{ type: string; text: string }>;
};

/**
 * Sets up a vi.mock for callTool in @circleback/cli.
 * Call this at the top level of test files (not inside beforeEach).
 * Returns the mock function so you can inspect calls.
 */
export function setupCallToolMock() {
  const mockFn = vi.fn<(toolName: string, args: Record<string, unknown>) => Promise<CallToolResult>>();
  return mockFn;
}

export const mockCallTool = setupCallToolMock;
