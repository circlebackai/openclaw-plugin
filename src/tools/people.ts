import { callTool } from "@circleback/cli/dist/client/jsonRpc.js";
import { FindProfilesParams, FindDomainsParams } from "../types.js";

export function registerPeopleTools(api: any): void {
  api.registerTool({
    name: "FindProfiles",
    description: "Search people by name.",
    parameters: FindProfilesParams,
    async execute(_toolCallId: string, params: Record<string, unknown>) {
      return await callTool("FindProfiles", params);
    },
  });

  api.registerTool({
    name: "FindDomains",
    description: "Search companies by name or domain.",
    parameters: FindDomainsParams,
    async execute(_toolCallId: string, params: Record<string, unknown>) {
      return await callTool("FindDomains", params);
    },
  });
}
