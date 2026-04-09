declare module "openclaw/plugin-sdk/plugin-entry" {
  export function definePluginEntry(opts: {
    id: string;
    name: string;
    description: string;
    register: (api: any) => void;
  }): { id: string; name: string; description: string; register: (api: any) => void };
}
