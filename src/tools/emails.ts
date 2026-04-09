import { callTool } from "@circleback/cli/dist/client/jsonRpc.js";
import { SearchEmailsParams } from "../types.js";

export function registerEmailTools(api: any): void {
  api.registerTool({
    name: "SearchEmails",
    description: "Search emails. Supports inline filters: from:, to:, participant:, before:, after:.",
    parameters: SearchEmailsParams,
    async execute(_toolCallId: string, params: Record<string, unknown>) {
      return await callTool("SearchEmails", params);
    },
  });
}
