import { callTool } from "@circleback/cli/dist/client/jsonRpc.js";
import { SearchActionItemsParams, SearchSupportArticlesParams } from "../types.js";

export function registerActionTools(api: any): void {
  api.registerTool({
    name: "SearchActionItems",
    description: "Search action items with optional status, assignee, date, and tag filters.",
    parameters: SearchActionItemsParams,
    async execute(_toolCallId: string, params: Record<string, unknown>) {
      return await callTool("SearchActionItems", params);
    },
  });

  api.registerTool({
    name: "SearchSupportArticles",
    description: "Search Circleback support documentation.",
    parameters: SearchSupportArticlesParams,
    async execute(_toolCallId: string, params: Record<string, unknown>) {
      return await callTool("SearchSupportArticles", params);
    },
  });
}
