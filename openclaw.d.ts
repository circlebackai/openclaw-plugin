declare module "openclaw/plugin-sdk/plugin-entry" {
  export function definePluginEntry(opts: {
    id: string;
    name: string;
    description: string;
    register: (api: any) => void;
  }): { id: string; name: string; description: string; register: (api: any) => void };
}

declare module "@circleback/cli/dist/client/jsonRpc.js" {
  export function callTool(
    toolName: string,
    toolArguments: Record<string, unknown>,
  ): Promise<{ content: Array<{ type: string; text: string }> }>;
}
