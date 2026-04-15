declare module "openclaw/plugin-sdk/plugin-entry" {
  interface ToolDefinition {
    name: string;
    description: string;
    inputSchema: object;
    execute(
      toolCallId: string,
      params: Record<string, unknown>,
    ): Promise<{ content: Array<{ type: string; text: string }> }>;
  }

  interface PluginApi {
    registerTool(tool: ToolDefinition): void;
  }

  interface PluginEntry {
    id: string;
    name: string;
    description: string;
    register: (api: PluginApi) => void;
  }

  export function definePluginEntry(opts: PluginEntry): PluginEntry;
}

declare module "@circleback/cli/dist/client/jsonRpc.js" {
  export function callTool(
    toolName: string,
    toolArguments: Record<string, unknown>,
  ): Promise<string>;
}
