# Circleback OpenClaw Community Plugin

## TL;DR

> **Quick Summary**: Build an OpenClaw community plugin that wraps all 10 Circleback MCP tools as OpenClaw agent tools, importing `@circleback/cli` for API communication and OAuth token management.
> 
> **Deliverables**:
> - Plugin scaffold: `package.json`, `openclaw.plugin.json`, `tsconfig.json`, `.gitignore`
> - Plugin entry: `index.ts` using `definePluginEntry` registering 10 agent tools
> - Tool modules: `src/tools/*.ts` — one per domain (meetings, transcripts, calendar, emails, people, actions)
> - Test suite: TDD with vitest, mocked MCP calls, one test file per tool module
> - README with setup/usage instructions
> 
> **Estimated Effort**: Medium
> **Parallel Execution**: YES — 4 waves
> **Critical Path**: Task 1 (scaffold) → Task 4 (entry point) → Tasks 6-10 (tools) → Task 12 (integration)

---

## Context

### Original Request
Convert the Circleback CLI into an OpenClaw community plugin on ClawHub. The plugin should register Circleback MCP tools as OpenClaw agent tools via `definePluginEntry`, importing/adapting logic from the existing `@circleback/cli` package.

### Interview Summary
**Key Discussions**:
- **Auth architecture**: CLI token piggyback — plugin imports `callTool` from `@circleback/cli` which manages OAuth tokens at `~/.config/circleback/tokens.json`. User must run `cb login` first.
- **Tool scope**: All 10 MCP tools (meetings, transcripts, calendar, emails, people, companies, action items, support)
- **Implementation approach**: Import `@circleback/cli` as a dependency (not a lightweight custom MCP client)
- **Test strategy**: TDD — set up vitest first, write tests before implementation
- **File structure**: Separate tool modules in `src/tools/` for parallel development, imported by `index.ts`

**Research Findings**:
- OpenClaw plugin API: `definePluginEntry` → `register(api)` → `api.registerTool({ name, description, parameters: Type.Object({...}), execute })`
- `@circleback/cli` v0.1.4 on npm: exports `callTool(toolName, toolArguments)` from `dist/client/jsonRpc.js`, handles OAuth refresh automatically
- CLI publishes only compiled JS — no `.d.ts` type declarations. Local type stubs needed.
- Circleback MCP: 10 tools, JSON-RPC 2.0 at `https://app.circleback.ai/api/mcp`
- Tool name discrepancy flagged: `FindProfiles`/`FindDomains` vs `SearchProfiles`/`SearchDomains` — must verify from CLI source before implementing
- Real plugin examples: Firecrawl (tool plugin), DingTalk (channel plugin), 20+ community plugins on npm

### Metis Review
**Identified Gaps** (addressed):
- **Auth architecture ambiguity** → Resolved: CLI token piggyback (option A)
- **Tool name discrepancy** → Task 3 validates exact names from CLI dist files before tool implementation
- **No TypeScript types from CLI** → Task 5 creates local type declarations
- **Pagination model unclear** → Task 3 verifies whether CLI uses `pageIndex` or cursors
- **Missing .gitignore** → Included in Task 1 scaffold
- **Test framework unspecified** → Decided: vitest with callTool mocking

---

## Work Objectives

### Core Objective
Create a ClawHub-publishable OpenClaw community plugin that exposes all 10 Circleback MCP tools as agent tools, delegating API calls and authentication to the `@circleback/cli` package.

### Concrete Deliverables
- `package.json` with `openclaw.extensions` and `@circleback/cli` dependency
- `openclaw.plugin.json` manifest with plugin metadata
- `tsconfig.json` for TypeScript compilation
- `.gitignore` excluding node_modules, dist, coverage
- `index.ts` — plugin entry point using `definePluginEntry`
- `src/types.ts` — local type declarations for `@circleback/cli`
- `src/tools/meetings.ts` — SearchMeetings + ReadMeetings tool registrations
- `src/tools/transcripts.ts` — SearchTranscripts + GetTranscriptsForMeetings tool registrations
- `src/tools/calendar.ts` — SearchCalendarEvents tool registration
- `src/tools/emails.ts` — SearchEmails tool registration
- `src/tools/people.ts` — FindProfiles + FindDomains tool registrations (names TBC by Task 3)
- `src/tools/actions.ts` — SearchActionItems + SearchSupportArticles tool registrations
- `src/__tests__/*.test.ts` — one test file per tool module
- `README.md` — setup instructions (cb login, plugin installation, usage)

### Definition of Done
- [ ] `npx tsc --noEmit` compiles with zero errors
- [ ] `npx vitest run` passes all tests (10+ tool tests + integration)
- [ ] Plugin entry exports a valid `DefinedPluginEntry` object
- [ ] All 10 Circleback MCP tools registered by name
- [ ] README documents: prerequisites, install, auth (cb login), usage examples

### Must Have
- All 10 Circleback MCP tools exposed as OpenClaw agent tools
- TypeBox parameter schemas matching actual MCP tool parameters
- Mocked tests for every tool (never hits real Circleback API)
- Plugin entry test verifying exactly 10 tools registered
- README with `cb login` prerequisite documented

### Must NOT Have (Guardrails)
- No retry logic, exponential backoff, or resilience patterns — thin passthrough only
- No abstract base classes or shared tool handler interfaces
- No data transformation beyond what MCP returns — pass through `callTool` results as-is
- No custom OAuth server or browser-based auth flow — auth is the CLI's responsibility
- No tools beyond the 10 Circleback MCP tools
- No caching layer, auto-pagination, or request queuing
- No excessive JSDoc — only on the public plugin entry export
- No `utils/` directory or premature abstractions
- No CI/CD pipeline setup or ClawHub publishing (user handles)

---

## Verification Strategy

> **ZERO HUMAN INTERVENTION** — ALL verification is agent-executed. No exceptions.

### Test Decision
- **Infrastructure exists**: NO (greenfield repo)
- **Automated tests**: TDD (tests before implementation)
- **Framework**: vitest
- **Pattern**: Each tool task writes failing test → implements tool → test passes

### QA Policy
Every task MUST include agent-executed QA scenarios.
Evidence saved to `.sisyphus/evidence/task-{N}-{scenario-slug}.{ext}`.

- **Tool registration**: Use Bash (node/bun REPL) — import plugin entry, verify tools registered
- **TypeScript compilation**: Use Bash (`npx tsc --noEmit`) — zero errors
- **Test execution**: Use Bash (`npx vitest run`) — all pass
- **Package validity**: Use Bash (`node -e "require('./package.json')"`) — valid JSON

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Foundation — 3 parallel, all quick):
├── Task 1: Project scaffold (.gitignore, package.json, tsconfig, manifest) [quick]
├── Task 2: Test framework setup (vitest config, mock helpers) [quick]
└── Task 3: CLI validation (verify callTool import, exact tool names, pagination) [quick]

Wave 2 (Entry point + types — 2 parallel, quick):
├── Task 4: Plugin entry scaffold (definePluginEntry, import structure) [quick]
└── Task 5: Type declarations for @circleback/cli [quick]

Wave 3 (Tool implementation — 5 parallel, TDD each):
├── Task 6: Meeting tools (SearchMeetings, ReadMeetings) [unspecified-high]
├── Task 7: Transcript tools (SearchTranscripts, GetTranscriptsForMeetings) [unspecified-high]
├── Task 8: Calendar + Email tools (SearchCalendarEvents, SearchEmails) [unspecified-high]
├── Task 9: People + Company tools (FindProfiles, FindDomains) [unspecified-high]
└── Task 10: Action + Support tools (SearchActionItems, SearchSupportArticles) [unspecified-high]

Wave 4 (Integration + polish — 2 parallel):
├── Task 11: Integration test + tsc verification [unspecified-high]
└── Task 12: README update with setup/usage docs [writing]

Wave FINAL (Verification — 4 parallel):
├── F1: Plan compliance audit [oracle]
├── F2: Code quality review [unspecified-high]
├── F3: Real manual QA [unspecified-high]
└── F4: Scope fidelity check [deep]
-> Present results -> Get explicit user okay

Critical Path: Task 1 → Task 4 → Tasks 6-10 → Task 11 → F1-F4 → user okay
Parallel Speedup: ~65% faster than sequential
Max Concurrent: 5 (Wave 3)
```

### Dependency Matrix

| Task | Depends On | Blocks | Wave |
|------|-----------|--------|------|
| 1 | — | 2, 3, 4, 5 | 1 |
| 2 | 1 (package.json exists) | 6-10 | 1 |
| 3 | 1 (@circleback/cli installed) | 5, 6-10 | 1 |
| 4 | 1 (tsconfig, manifest) | 6-10, 11 | 2 |
| 5 | 1, 3 (verified tool names) | 6-10 | 2 |
| 6 | 2, 4, 5 | 11 | 3 |
| 7 | 2, 4, 5 | 11 | 3 |
| 8 | 2, 4, 5 | 11 | 3 |
| 9 | 2, 4, 5 | 11 | 3 |
| 10 | 2, 4, 5 | 11 | 3 |
| 11 | 6-10 | F1-F4 | 4 |
| 12 | 1, 3 | F1-F4 | 4 |
| F1-F4 | 11, 12 | — | FINAL |

### Agent Dispatch Summary

- **Wave 1**: **3 agents** — T1 → `quick`, T2 → `quick`, T3 → `quick`
- **Wave 2**: **2 agents** — T4 → `quick`, T5 → `quick`
- **Wave 3**: **5 agents** — T6-T10 → `unspecified-high`
- **Wave 4**: **2 agents** — T11 → `unspecified-high`, T12 → `writing`
- **FINAL**: **4 agents** — F1 → `oracle`, F2 → `unspecified-high`, F3 → `unspecified-high`, F4 → `deep`

---

## TODOs

- [x] 1. Project Scaffold

  **What to do**:
  - Create `.gitignore` excluding `node_modules/`, `dist/`, `coverage/`, `.env`, `*.tgz`
  - Create `package.json` with:
    - `"name": "@circleback/openclaw-circleback"`
    - `"type": "module"`
    - `"dependencies": { "@circleback/cli": "^0.1.4" }`
    - `"devDependencies": { "openclaw": ">=2026.3.24-beta.2", "vitest": "latest", "@sinclair/typebox": "latest", "typescript": "latest" }`
    - `"openclaw": { "extensions": ["./index.ts"], "compat": { "pluginApi": ">=2026.3.24-beta.2" } }`
    - `"scripts": { "test": "vitest run", "typecheck": "tsc --noEmit" }`
  - Create `tsconfig.json` with: `target: "ES2022"`, `module: "NodeNext"`, `moduleResolution: "NodeNext"`, `strict: true`, `outDir: "./dist"`, `rootDir: "."`, `include: ["index.ts", "src/**/*.ts"]`
  - Create `openclaw.plugin.json`:
    ```json
    {
      "id": "circleback",
      "name": "Circleback",
      "description": "Search and access meetings, transcripts, emails, calendar events, and more from Circleback.",
      "configSchema": {
        "type": "object",
        "additionalProperties": false,
        "properties": {}
      }
    }
    ```
  - Run `npm install` to generate lock file and install dependencies

  **Must NOT do**:
  - Do not add CI/CD configuration
  - Do not add eslint/prettier config (keep minimal)
  - Do not add any source code files yet

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Straightforward file creation with known content, no complex logic
  - **Skills**: []
  - **Skills Evaluated but Omitted**:
    - `frontend-ui-ux`: No UI work involved

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 2, 3)
  - **Blocks**: Tasks 2, 3, 4, 5
  - **Blocked By**: None (can start immediately)

  **References**:

  **Pattern References**:
  - User's scaffolding from the original request — specifies exact package.json openclaw field structure
  - DingTalk plugin `package.json`: `https://raw.githubusercontent.com/soimy/openclaw-channel-dingtalk/main/package.json` — shows `openclaw.extensions`, `openclaw.compat` field format

  **API/Type References**:
  - OpenClaw plugin manifest schema: `openclaw.plugin.json` requires `id` + `configSchema` at minimum. The `configSchema` is empty because auth is handled by `@circleback/cli` externally.

  **WHY Each Reference Matters**:
  - DingTalk package.json shows the exact format for the `openclaw` field in package.json — copy the structure, not the values
  - The empty configSchema reflects the architectural decision: auth is CLI-managed, not plugin-managed

  **Acceptance Criteria**:

  - [ ] `.gitignore` exists and contains `node_modules/`, `dist/`, `coverage/`
  - [ ] `package.json` valid JSON: `node -e "require('./package.json')"`
  - [ ] `package.json` has `@circleback/cli` in dependencies
  - [ ] `package.json` has `openclaw.extensions` pointing to `./index.ts`
  - [ ] `openclaw.plugin.json` valid JSON with `id: "circleback"`
  - [ ] `tsconfig.json` valid JSONC with `strict: true`
  - [ ] `npm install` completes without errors, `node_modules/` exists

  **QA Scenarios:**

  ```
  Scenario: Package.json is valid and has required fields
    Tool: Bash
    Preconditions: Task files created, npm install completed
    Steps:
      1. Run: node -e "const p = require('./package.json'); console.log(JSON.stringify({name: p.name, type: p.type, ext: p.openclaw?.extensions, cli: !!p.dependencies?.['@circleback/cli']}))"
      2. Assert output contains: {"name":"@circleback/openclaw-circleback","type":"module","ext":["./index.ts"],"cli":true}
    Expected Result: All fields present and correct
    Failure Indicators: Missing fields, wrong package name, missing CLI dependency
    Evidence: .sisyphus/evidence/task-1-package-json-valid.txt

  Scenario: Manifest and tsconfig are valid JSON
    Tool: Bash
    Preconditions: Files created
    Steps:
      1. Run: node -e "const m = JSON.parse(require('fs').readFileSync('openclaw.plugin.json','utf8')); console.log(m.id)"
      2. Assert output: "circleback"
      3. Run: npx tsc --showConfig 2>&1 | head -5
      4. Assert output contains "strict": true
    Expected Result: Both files parse without error
    Failure Indicators: JSON parse error, missing id field, strict not enabled
    Evidence: .sisyphus/evidence/task-1-manifest-tsconfig-valid.txt

  Scenario: npm install fails (negative case)
    Tool: Bash
    Preconditions: package.json with intentionally wrong dependency name
    Steps:
      1. This is verified implicitly — if npm install succeeded in the happy path, this is covered
      2. Verify node_modules/@circleback/cli/dist/client/jsonRpc.js exists
    Expected Result: CLI package installed and dist files accessible
    Failure Indicators: Missing jsonRpc.js file in node_modules
    Evidence: .sisyphus/evidence/task-1-cli-installed.txt
  ```

  **Commit**: YES (commit 1)
  - Message: `chore: scaffold openclaw plugin project`
  - Files: `.gitignore`, `package.json`, `tsconfig.json`, `openclaw.plugin.json`, `package-lock.json`
  - Pre-commit: `node -e "require('./package.json')"`

- [x] 2. Test Framework Setup

  **What to do**:
  - Create `vitest.config.ts` with sensible defaults (include `src/__tests__/**/*.test.ts`)
  - Create `src/__tests__/setup.ts` with a mock helper for `callTool`:
    - Export a `mockCallTool(toolName, expectedArgs, mockResponse)` utility
    - Uses `vi.mock` to mock `@circleback/cli/dist/client/jsonRpc` module
    - Returns a function that asserts `callTool` was called with correct tool name and args
  - Create `src/__tests__/placeholder.test.ts` with a trivial passing test to verify vitest works
  - Run `npx vitest run` to verify framework is operational

  **Must NOT do**:
  - Do not add coverage thresholds yet
  - Do not create tool-specific tests (those come in Wave 3)
  - Do not install additional test utilities beyond vitest

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Straightforward config file creation and a simple mock helper
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 3)
  - **Blocks**: Tasks 6, 7, 8, 9, 10
  - **Blocked By**: Task 1 (needs package.json and vitest installed)

  **References**:

  **Pattern References**:
  - Vitest config pattern: `https://vitest.dev/config/` — standard vitest.config.ts setup
  - The mock helper should intercept `import { callTool } from '@circleback/cli/dist/client/jsonRpc'` — this is the import path the tool modules will use

  **External References**:
  - Vitest mocking docs: `https://vitest.dev/guide/mocking.html` — vi.mock for module mocking

  **WHY Each Reference Matters**:
  - The mock helper is the foundation for ALL tool tests in Wave 3. Getting the mock path right (`@circleback/cli/dist/client/jsonRpc`) is critical — every tool test depends on it.

  **Acceptance Criteria**:

  - [ ] `vitest.config.ts` exists
  - [ ] `src/__tests__/setup.ts` exports `mockCallTool` function
  - [ ] `npx vitest run` passes with 1+ test

  **QA Scenarios:**

  ```
  Scenario: Vitest runs and passes placeholder test
    Tool: Bash
    Preconditions: vitest.config.ts and placeholder test created
    Steps:
      1. Run: npx vitest run --reporter=verbose 2>&1
      2. Assert output contains "1 passed" or "Tests  1 passed"
      3. Assert exit code 0
    Expected Result: Vitest runs, finds placeholder test, passes
    Failure Indicators: "no tests found", non-zero exit code, config error
    Evidence: .sisyphus/evidence/task-2-vitest-passes.txt

  Scenario: Mock helper is importable
    Tool: Bash
    Preconditions: setup.ts created
    Steps:
      1. Run: npx tsx -e "import { mockCallTool } from './src/__tests__/setup'; console.log(typeof mockCallTool)"
      2. Assert output: "function"
    Expected Result: mockCallTool exports as a function
    Failure Indicators: Import error, "undefined" output
    Evidence: .sisyphus/evidence/task-2-mock-helper-importable.txt
  ```

  **Commit**: YES (commit 2)
  - Message: `chore: add vitest config and test helpers`
  - Files: `vitest.config.ts`, `src/__tests__/setup.ts`, `src/__tests__/placeholder.test.ts`
  - Pre-commit: `npx vitest run`

- [x] 3. CLI Validation — Verify Tool Names and Importability

  **What to do**:
  - After `npm install` from Task 1, inspect `node_modules/@circleback/cli/dist/` to:
    1. Confirm `callTool` is exported from `dist/client/jsonRpc.js` (or find the actual export path)
    2. Read all command files in `dist/commands/` to extract the EXACT MCP tool names passed to `callTool()`
    3. Document the exact parameter shapes each tool expects
    4. Verify pagination model (pageIndex vs cursor)
  - Write findings to `.sisyphus/evidence/task-3-tool-names.md` with:
    - Confirmed import path for `callTool`
    - Exact tool names (e.g., is it `FindProfiles` or `SearchProfiles`?)
    - Parameter shapes per tool
    - Pagination model
  - Test that `callTool` can be imported in ESM context:
    ```bash
    npx tsx -e "import { callTool } from '@circleback/cli/dist/client/jsonRpc'; console.log(typeof callTool)"
    ```
  - If import fails, document the actual export structure and recommend an alternative import strategy

  **Must NOT do**:
  - Do not call the real Circleback API
  - Do not modify any CLI package files
  - Do not write source code — this task is research/validation only

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: File inspection and import testing, no implementation
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 2)
  - **Blocks**: Task 5 (type declarations depend on verified names), Tasks 6-10 (tools use verified names)
  - **Blocked By**: Task 1 (@circleback/cli must be installed)

  **References**:

  **Pattern References**:
  - `node_modules/@circleback/cli/dist/client/jsonRpc.js` — expected location of `callTool` export
  - `node_modules/@circleback/cli/dist/commands/` — CLI command files containing tool name strings

  **WHY Each Reference Matters**:
  - The ENTIRE plugin depends on importing `callTool` correctly. If the export path is wrong, nothing works.
  - Tool names are passed as string literals to `callTool('SearchMeetings', {...})`. Wrong name = runtime tool-not-found error from MCP server.
  - Metis flagged `FindProfiles` vs `SearchProfiles` discrepancy — this task resolves it definitively.

  **Acceptance Criteria**:

  - [ ] `.sisyphus/evidence/task-3-tool-names.md` exists with all 10 verified tool names
  - [ ] `callTool` import test succeeds (or alternative path documented)
  - [ ] Parameter shapes documented per tool

  **QA Scenarios:**

  ```
  Scenario: callTool is importable
    Tool: Bash
    Preconditions: @circleback/cli installed via npm
    Steps:
      1. Run: npx tsx -e "import { callTool } from '@circleback/cli/dist/client/jsonRpc'; console.log(typeof callTool)"
      2. If fails, try: npx tsx -e "const m = await import('@circleback/cli/dist/client/jsonRpc.js'); console.log(Object.keys(m))"
      3. Document the working import path
    Expected Result: Output "function" or documented alternative export
    Failure Indicators: Import error with no alternative found
    Evidence: .sisyphus/evidence/task-3-calltool-import.txt

  Scenario: All 10 tool names extracted from CLI source
    Tool: Bash
    Preconditions: CLI installed
    Steps:
      1. Search for callTool invocations: grep -r "callTool" node_modules/@circleback/cli/dist/commands/
      2. Extract all first arguments (tool name strings)
      3. Verify count is 10
      4. Write to evidence file
    Expected Result: Exactly 10 unique tool names found
    Failure Indicators: Fewer than 10 names, or names don't match expected list
    Evidence: .sisyphus/evidence/task-3-tool-names.md
  ```

  **Commit**: YES (commit 3)
  - Message: `docs: document verified MCP tool names and import paths`
  - Files: `.sisyphus/evidence/task-3-tool-names.md`, `.sisyphus/evidence/task-3-calltool-import.txt`
  - Pre-commit: —

- [x] 4. Plugin Entry Point Scaffold

  **What to do**:
  - Create `index.ts` with `definePluginEntry`:
    ```typescript
    import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";
    import { registerMeetingTools } from "./src/tools/meetings.js";
    import { registerTranscriptTools } from "./src/tools/transcripts.js";
    import { registerCalendarTools } from "./src/tools/calendar.js";
    import { registerEmailTools } from "./src/tools/emails.js";
    import { registerPeopleTools } from "./src/tools/people.js";
    import { registerActionTools } from "./src/tools/actions.js";

    export default definePluginEntry({
      id: "circleback",
      name: "Circleback",
      description: "Search and access meetings, transcripts, emails, calendar events, and more from Circleback.",
      register(api) {
        registerMeetingTools(api);
        registerTranscriptTools(api);
        registerCalendarTools(api);
        registerEmailTools(api);
        registerPeopleTools(api);
        registerActionTools(api);
      },
    });
    ```
  - Create empty stub files for each tool module (`src/tools/meetings.ts`, etc.) that export the expected function names but with empty bodies — this lets TypeScript compile while tool tasks work in parallel
  - Verify `npx tsc --noEmit` passes with the stub structure

  **Must NOT do**:
  - Do not implement any tool logic — stubs only
  - Do not add configSchema validation (config is empty)
  - Do not add hooks, providers, or channels

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Boilerplate entry point with stub imports, no complex logic
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Task 5)
  - **Blocks**: Tasks 6-10 (tools fill in the stubs), Task 11 (integration)
  - **Blocked By**: Task 1 (tsconfig, manifest must exist)

  **References**:

  **Pattern References**:
  - Firecrawl plugin entry: `https://github.com/openclaw/openclaw/blob/main/extensions/firecrawl/index.ts` — shows `definePluginEntry` with `api.registerTool()` calls inside `register(api)`
  - Memory LanceDB plugin: `https://github.com/openclaw/openclaw/blob/main/extensions/memory-lancedb/index.ts` — shows tool registration with TypeBox schemas

  **API/Type References**:
  - `definePluginEntry` signature: `import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry"` — returns `DefinedPluginEntry`
  - `OpenClawPluginApi.registerTool()` — the method each tool module will call

  **WHY Each Reference Matters**:
  - Firecrawl is the closest pattern match (tool-only plugin, no providers/channels). Copy its structure.
  - The import path `"openclaw/plugin-sdk/plugin-entry"` is the canonical entry — do NOT use other paths.

  **Acceptance Criteria**:

  - [ ] `index.ts` exists and exports default `definePluginEntry` result
  - [ ] All 6 tool module stubs exist in `src/tools/`
  - [ ] `npx tsc --noEmit` passes (stubs compile)

  **QA Scenarios:**

  ```
  Scenario: Plugin entry compiles and exports correct shape
    Tool: Bash
    Preconditions: index.ts and all stubs created
    Steps:
      1. Run: npx tsc --noEmit 2>&1
      2. Assert exit code 0 (no type errors)
      3. Run: npx tsx -e "import entry from './index'; console.log(entry.id, typeof entry.register)"
      4. Assert output contains: "circleback function"
    Expected Result: TypeScript compiles clean, entry exports id and register function
    Failure Indicators: Type errors, wrong id, register not a function
    Evidence: .sisyphus/evidence/task-4-entry-compiles.txt

  Scenario: Stub modules exist and are importable
    Tool: Bash
    Preconditions: Stub files created
    Steps:
      1. Run: ls src/tools/
      2. Assert 6 files: meetings.ts, transcripts.ts, calendar.ts, emails.ts, people.ts, actions.ts
      3. Run: npx tsx -e "import { registerMeetingTools } from './src/tools/meetings'; console.log(typeof registerMeetingTools)"
      4. Assert output: "function"
    Expected Result: All 6 module stubs importable
    Failure Indicators: Missing files, import errors
    Evidence: .sisyphus/evidence/task-4-stubs-importable.txt
  ```

  **Commit**: YES (commit 4)
  - Message: `feat: add plugin entry point with tool module stubs`
  - Files: `index.ts`, `src/tools/meetings.ts`, `src/tools/transcripts.ts`, `src/tools/calendar.ts`, `src/tools/emails.ts`, `src/tools/people.ts`, `src/tools/actions.ts`
  - Pre-commit: `npx tsc --noEmit`

- [x] 5. Type Declarations for @circleback/cli

  **What to do**:
  - Create `src/types.ts` with local type declarations based on Task 3's verified findings:
    - Type for `callTool` function signature: `(toolName: string, toolArguments: Record<string, unknown>) => Promise<CallToolResult>`
    - Type for `CallToolResult` matching MCP JSON-RPC response shape: `{ content: Array<{ type: string; text: string }> }`
    - TypeBox schema constants for each MCP tool's parameters (using verified names from Task 3):
      - `SearchMeetingsParams`, `ReadMeetingsParams`, `SearchTranscriptsParams`, etc.
      - Each schema must use exact field names and types from the verified MCP tool parameters
  - If Task 3 found that `callTool` is not directly importable, create a thin wrapper in `src/client.ts` that handles the import

  **Must NOT do**:
  - Do not add types for features not used (streaming, pagination cursors if CLI handles them internally)
  - Do not create a class hierarchy for tool types
  - Do not modify `@circleback/cli` package files

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Type declarations based on documented findings, no complex logic
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Task 4)
  - **Blocks**: Tasks 6-10 (tools import these types)
  - **Blocked By**: Task 1 (package installed), Task 3 (verified tool names and parameter shapes)

  **References**:

  **Pattern References**:
  - `.sisyphus/evidence/task-3-tool-names.md` — **PRIMARY REFERENCE**: Contains the verified tool names, parameter shapes, and import paths discovered by Task 3. Use these EXACTLY.
  - `.sisyphus/evidence/task-3-calltool-import.txt` — Confirmed import path for `callTool`

  **API/Type References**:
  - `@sinclair/typebox` — `Type.Object()`, `Type.String()`, `Type.Number()`, `Type.Optional()`, `Type.Array()` for TypeBox schemas
  - MCP JSON-RPC response shape: `{ content: [{ type: "text", text: "..." }] }`

  **WHY Each Reference Matters**:
  - Task 3 evidence is the ONLY reliable source for tool names and params — do not use the draft's names (they may be wrong)
  - TypeBox is OpenClaw's schema format for tool parameters — must use it, not Zod or plain interfaces

  **Acceptance Criteria**:

  - [ ] `src/types.ts` exists with `callTool` type and all 10 parameter schemas
  - [ ] TypeBox schemas use verified tool parameter names from Task 3
  - [ ] `npx tsc --noEmit` passes

  **QA Scenarios:**

  ```
  Scenario: Types compile and schemas are valid TypeBox
    Tool: Bash
    Preconditions: src/types.ts created with all schemas
    Steps:
      1. Run: npx tsc --noEmit 2>&1
      2. Assert exit code 0
      3. Run: npx tsx -e "import * as T from './src/types'; console.log(Object.keys(T).filter(k => k.includes('Params')).length)"
      4. Assert output: "10" (one schema per tool)
    Expected Result: 10 TypeBox parameter schemas exported, all compile clean
    Failure Indicators: Type errors, fewer than 10 schemas
    Evidence: .sisyphus/evidence/task-5-types-compile.txt
  ```

  **Commit**: YES (groups with commit 4)
  - Message: `feat: add plugin entry point and CLI type declarations`
  - Files: `src/types.ts` (and `src/client.ts` if needed)
  - Pre-commit: `npx tsc --noEmit`

- [x] 6. Meeting Tools — SearchMeetings + ReadMeetings (TDD)

  **What to do**:
  - **RED** — Write tests in `src/__tests__/meetings.test.ts`:
    - Test `SearchMeetings`: mock `callTool('SearchMeetings', {...})`, verify correct params forwarded, verify response returned as tool result
    - Test `ReadMeetings`: mock `callTool('ReadMeetings', { meetingIds: [1, 2] })`, verify params and response
    - Test error case: mock `callTool` throwing, verify graceful error in tool result
  - **GREEN** — Implement `src/tools/meetings.ts`:
    - Replace the stub with actual `api.registerTool()` calls for both tools
    - `SearchMeetings`: parameters from `SearchMeetingsParams` TypeBox schema, execute calls `callTool`
    - `ReadMeetings`: parameters from `ReadMeetingsParams` TypeBox schema, execute calls `callTool`
    - Return MCP response content directly as `{ content: [{ type: "text", text: responseText }] }`
  - **REFACTOR** — Clean up, ensure no duplication
  - Run `npx vitest run src/__tests__/meetings.test.ts` — all pass

  **Must NOT do**:
  - Do not transform or parse MCP response content — pass through as-is
  - Do not add retry logic or error recovery
  - Do not modify other tool modules

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: TDD cycle requires understanding the OpenClaw tool API, TypeBox schemas, and vitest mocking patterns
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 7, 8, 9, 10)
  - **Blocks**: Task 11 (integration)
  - **Blocked By**: Tasks 2 (test framework), 4 (entry point stubs), 5 (type declarations)

  **References**:

  **Pattern References**:
  - `src/__tests__/setup.ts` — Mock helper from Task 2. Use `mockCallTool(toolName, expectedArgs, mockResponse)` to set up mocks.
  - `src/types.ts` — TypeBox schemas `SearchMeetingsParams` and `ReadMeetingsParams` from Task 5. Import and use as `parameters` field.
  - `.sisyphus/evidence/task-3-tool-names.md` — Verified tool names. Use the EXACT name strings found here.

  **API/Type References**:
  - OpenClaw tool result shape: `{ content: [{ type: "text", text: "..." }] }` — this is what `execute` must return
  - `callTool(toolName, args)` — from `@circleback/cli`, returns `{ content: [{ type: "text", text: "..." }] }`

  **External References**:
  - Vitest mocking: `https://vitest.dev/guide/mocking.html` — `vi.mock()` pattern for module mocks

  **WHY Each Reference Matters**:
  - The mock helper from Task 2 is the testing foundation — every tool test uses it identically
  - TypeBox schemas from Task 5 are the EXACT parameter definitions — import, don't recreate
  - Task 3 evidence has the verified tool names — use those strings, not assumptions

  **Acceptance Criteria**:

  - [ ] `src/__tests__/meetings.test.ts` exists with 3+ tests (SearchMeetings happy, ReadMeetings happy, error case)
  - [ ] `src/tools/meetings.ts` registers 2 tools with `api.registerTool()`
  - [ ] `npx vitest run src/__tests__/meetings.test.ts` — all pass

  **QA Scenarios:**

  ```
  Scenario: Meeting tool tests pass
    Tool: Bash
    Preconditions: Test and implementation files created
    Steps:
      1. Run: npx vitest run src/__tests__/meetings.test.ts --reporter=verbose 2>&1
      2. Assert output contains "SearchMeetings" test passing
      3. Assert output contains "ReadMeetings" test passing
      4. Assert output contains "error" test passing
      5. Assert exit code 0
    Expected Result: 3+ tests pass, zero failures
    Failure Indicators: Test failures, import errors, mock not working
    Evidence: .sisyphus/evidence/task-6-meetings-tests.txt

  Scenario: Meeting tools register correctly
    Tool: Bash
    Preconditions: Implementation complete
    Steps:
      1. Run: npx tsx -e "import { registerMeetingTools } from './src/tools/meetings'; const tools = []; const api = { registerTool: (t) => tools.push(t.name || t().name) }; registerMeetingTools(api); console.log(tools.sort().join(','))"
      2. Assert output contains both meeting tool names (from Task 3 evidence)
    Expected Result: Both tool names registered
    Failure Indicators: Missing tool, wrong name, registration error
    Evidence: .sisyphus/evidence/task-6-meetings-registered.txt
  ```

  **Commit**: YES (groups into commit 5 with Tasks 7-10)
  - Message: `feat: register all 10 circleback MCP tools with tests`
  - Files: `src/tools/meetings.ts`, `src/__tests__/meetings.test.ts`
  - Pre-commit: `npx vitest run`

- [x] 7. Transcript Tools — SearchTranscripts + GetTranscriptsForMeetings (TDD)

  **What to do**:
  - **RED** — Write tests in `src/__tests__/transcripts.test.ts`:
    - Test `SearchTranscripts`: mock `callTool`, verify search term and optional filters forwarded
    - Test `GetTranscriptsForMeetings`: mock `callTool`, verify meeting IDs forwarded
    - Test error case: mock callTool throwing
  - **GREEN** — Implement `src/tools/transcripts.ts`:
    - `registerTranscriptTools(api)` registers 2 tools using TypeBox schemas from `src/types.ts`
    - Each tool's execute calls `callTool` and returns response as-is
  - Run `npx vitest run src/__tests__/transcripts.test.ts` — all pass

  **Must NOT do**:
  - Do not parse transcript content or extract speakers
  - Do not add max-50-meetings validation (let MCP server handle limits)

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Same TDD pattern as Task 6, different tool domain
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 6, 8, 9, 10)
  - **Blocks**: Task 11
  - **Blocked By**: Tasks 2, 4, 5

  **References**:

  **Pattern References**:
  - `src/tools/meetings.ts` (from Task 6) — Follow the IDENTICAL pattern. Same structure, different tool names and params.
  - `src/__tests__/setup.ts` — Mock helper
  - `src/types.ts` — `SearchTranscriptsParams`, `GetTranscriptsForMeetingsParams` schemas

  **WHY Each Reference Matters**:
  - Task 6's meeting tools are the template — transcript tools are structurally identical. Copy the pattern, swap names/params.

  **Acceptance Criteria**:

  - [ ] `src/__tests__/transcripts.test.ts` exists with 3+ tests
  - [ ] `src/tools/transcripts.ts` registers 2 tools
  - [ ] `npx vitest run src/__tests__/transcripts.test.ts` — all pass

  **QA Scenarios:**

  ```
  Scenario: Transcript tool tests pass
    Tool: Bash
    Preconditions: Test and implementation files created
    Steps:
      1. Run: npx vitest run src/__tests__/transcripts.test.ts --reporter=verbose 2>&1
      2. Assert 3+ tests pass, zero failures
      3. Assert exit code 0
    Expected Result: All transcript tests pass
    Failure Indicators: Failures, wrong tool names
    Evidence: .sisyphus/evidence/task-7-transcripts-tests.txt
  ```

  **Commit**: YES (groups into commit 5)
  - Message: `feat: register all 10 circleback MCP tools with tests`
  - Files: `src/tools/transcripts.ts`, `src/__tests__/transcripts.test.ts`

- [x] 8. Calendar + Email Tools — SearchCalendarEvents + SearchEmails (TDD)

  **What to do**:
  - **RED** — Write tests in `src/__tests__/calendar-emails.test.ts`:
    - Test `SearchCalendarEvents`: mock callTool, verify date range params
    - Test `SearchEmails`: mock callTool, verify search term with inline filters (from:, to:, before:, after:)
    - Test error cases for both
  - **GREEN** — Implement `src/tools/calendar.ts` and `src/tools/emails.ts`:
    - `registerCalendarTools(api)` — 1 tool (SearchCalendarEvents)
    - `registerEmailTools(api)` — 1 tool (SearchEmails)
  - Run tests — all pass

  **Must NOT do**:
  - Do not parse email filter syntax (from:, to:) — pass search term as-is to callTool
  - Do not add date validation — let MCP server validate

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Same TDD pattern, two tool domains in one task
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 6, 7, 9, 10)
  - **Blocks**: Task 11
  - **Blocked By**: Tasks 2, 4, 5

  **References**:

  **Pattern References**:
  - `src/tools/meetings.ts` (from Task 6) — Same registration pattern
  - `src/types.ts` — `SearchCalendarEventsParams`, `SearchEmailsParams` schemas

  **WHY Each Reference Matters**:
  - Same pattern as meetings, different schemas. SearchEmails has a `searchTerm` string that can contain inline filters — the plugin doesn't parse these, just forwards.

  **Acceptance Criteria**:

  - [ ] `src/__tests__/calendar-emails.test.ts` exists with 4+ tests
  - [ ] `src/tools/calendar.ts` registers 1 tool, `src/tools/emails.ts` registers 1 tool
  - [ ] `npx vitest run src/__tests__/calendar-emails.test.ts` — all pass

  **QA Scenarios:**

  ```
  Scenario: Calendar and email tool tests pass
    Tool: Bash
    Preconditions: Test and implementation files created
    Steps:
      1. Run: npx vitest run src/__tests__/calendar-emails.test.ts --reporter=verbose 2>&1
      2. Assert 4+ tests pass, zero failures
    Expected Result: All calendar/email tests pass
    Failure Indicators: Test failures
    Evidence: .sisyphus/evidence/task-8-calendar-emails-tests.txt
  ```

  **Commit**: YES (groups into commit 5)
  - Files: `src/tools/calendar.ts`, `src/tools/emails.ts`, `src/__tests__/calendar-emails.test.ts`

- [x] 9. People + Company Tools — FindProfiles + FindDomains (TDD)

  **What to do**:
  - **IMPORTANT**: Use the VERIFIED tool names from `.sisyphus/evidence/task-3-tool-names.md`. These may be `FindProfiles`/`FindDomains` OR `SearchProfiles`/`SearchDomains` — Task 3 determines which.
  - **RED** — Write tests in `src/__tests__/people.test.ts`:
    - Test profile search: mock callTool with verified name, verify search terms array forwarded
    - Test domain search: mock callTool with verified name, verify search terms forwarded
    - Test error cases
  - **GREEN** — Implement `src/tools/people.ts`:
    - `registerPeopleTools(api)` — registers 2 tools using verified names
  - Run tests — all pass

  **Must NOT do**:
  - Do not hardcode tool names — read from Task 3 evidence
  - Do not add people/company data parsing

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Same TDD pattern, but must cross-reference Task 3 evidence for correct tool names
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 6, 7, 8, 10)
  - **Blocks**: Task 11
  - **Blocked By**: Tasks 2, 4, 5

  **References**:

  **Pattern References**:
  - `.sisyphus/evidence/task-3-tool-names.md` — **CRITICAL**: Contains the VERIFIED names for profile and domain tools. DO NOT assume `FindProfiles`/`FindDomains` — check this file first.
  - `src/tools/meetings.ts` (from Task 6) — Same pattern

  **WHY Each Reference Matters**:
  - Metis flagged that the profile/domain tool names may differ from initial assumptions. Task 3 evidence is the authoritative source.

  **Acceptance Criteria**:

  - [ ] Tool names in code match `.sisyphus/evidence/task-3-tool-names.md` exactly
  - [ ] `src/__tests__/people.test.ts` exists with 3+ tests
  - [ ] `src/tools/people.ts` registers 2 tools
  - [ ] `npx vitest run src/__tests__/people.test.ts` — all pass

  **QA Scenarios:**

  ```
  Scenario: People tool tests pass with verified names
    Tool: Bash
    Preconditions: Test and implementation files created
    Steps:
      1. Run: npx vitest run src/__tests__/people.test.ts --reporter=verbose 2>&1
      2. Assert 3+ tests pass
      3. Verify tool names in src/tools/people.ts match .sisyphus/evidence/task-3-tool-names.md
    Expected Result: Tests pass, names match evidence
    Failure Indicators: Wrong tool names, test failures
    Evidence: .sisyphus/evidence/task-9-people-tests.txt
  ```

  **Commit**: YES (groups into commit 5)
  - Files: `src/tools/people.ts`, `src/__tests__/people.test.ts`

- [x] 10. Action Items + Support Tools — SearchActionItems + SearchSupportArticles (TDD)

  **What to do**:
  - **RED** — Write tests in `src/__tests__/actions.test.ts`:
    - Test `SearchActionItems`: mock callTool, verify optional filters (status: PENDING/DONE, assigneeProfileId, date range, tags)
    - Test `SearchSupportArticles`: mock callTool, verify search term forwarded
    - Test error cases
  - **GREEN** — Implement `src/tools/actions.ts`:
    - `registerActionTools(api)` — registers 2 tools
    - `SearchActionItems` has the most complex parameter schema (status enum, optional assignee, dates, tags)
  - Run tests — all pass

  **Must NOT do**:
  - Do not validate status enum values — let MCP server validate
  - Do not add action item completion/update functionality (read-only tools only)

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: SearchActionItems has the most complex schema of all 10 tools
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 6, 7, 8, 9)
  - **Blocks**: Task 11
  - **Blocked By**: Tasks 2, 4, 5

  **References**:

  **Pattern References**:
  - `src/tools/meetings.ts` (from Task 6) — Same pattern
  - `src/types.ts` — `SearchActionItemsParams` (most complex schema: intent, searchTerms, pageIndex, status enum, dates, tags, assigneeProfileId), `SearchSupportArticlesParams`

  **WHY Each Reference Matters**:
  - SearchActionItems schema includes optional enum (`status: "PENDING" | "DONE"`), optional number (`assigneeProfileId`), optional arrays (`tags`), and optional dates. This is the most complex TypeBox schema in the plugin.

  **Acceptance Criteria**:

  - [ ] `src/__tests__/actions.test.ts` exists with 3+ tests
  - [ ] `src/tools/actions.ts` registers 2 tools
  - [ ] `npx vitest run src/__tests__/actions.test.ts` — all pass

  **QA Scenarios:**

  ```
  Scenario: Action/support tool tests pass
    Tool: Bash
    Preconditions: Test and implementation files created
    Steps:
      1. Run: npx vitest run src/__tests__/actions.test.ts --reporter=verbose 2>&1
      2. Assert 3+ tests pass (SearchActionItems happy, SearchSupportArticles happy, error)
    Expected Result: All tests pass
    Failure Indicators: Schema validation errors, wrong tool names
    Evidence: .sisyphus/evidence/task-10-actions-tests.txt
  ```

  **Commit**: YES (groups into commit 5)
  - Message: `feat: register all 10 circleback MCP tools with tests`
  - Files: `src/tools/actions.ts`, `src/__tests__/actions.test.ts`

- [x] 11. Integration Test + TypeScript Verification

  **What to do**:
  - Create `src/__tests__/integration.test.ts`:
    - Import the plugin entry from `../../index`
    - Call `register()` with a mock `api` object that collects `registerTool` calls
    - Assert exactly 10 tools registered
    - Assert each tool has: `name` (non-empty string), `description` (non-empty string), `parameters` (TypeBox schema), `execute` (function)
    - Assert all 10 expected tool names are present (from Task 3 evidence)
  - Run full test suite: `npx vitest run` — all tests pass (tool tests + integration)
  - Run TypeScript check: `npx tsc --noEmit` — zero errors
  - Verify no `as any`, `@ts-ignore`, or empty catch blocks in any source file

  **Must NOT do**:
  - Do not call real Circleback API
  - Do not add e2e tests requiring a running OpenClaw instance

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Integration test requires understanding full plugin structure and verifying cross-module correctness
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4 (with Task 12)
  - **Blocks**: F1-F4 (verification)
  - **Blocked By**: Tasks 6-10 (all tools must be implemented)

  **References**:

  **Pattern References**:
  - `index.ts` — Plugin entry that imports all tool modules
  - `.sisyphus/evidence/task-3-tool-names.md` — Verified list of all 10 tool names to assert against

  **WHY Each Reference Matters**:
  - The integration test is the final safety net — it verifies the full plugin hangs together (entry + all 10 tools + correct names)
  - Task 3 evidence provides the canonical list of expected tool names

  **Acceptance Criteria**:

  - [ ] `src/__tests__/integration.test.ts` exists
  - [ ] `npx vitest run` — ALL tests pass (tool tests + integration)
  - [ ] `npx tsc --noEmit` — zero errors
  - [ ] No `as any`, `@ts-ignore`, or empty catches in source files

  **QA Scenarios:**

  ```
  Scenario: Full test suite passes
    Tool: Bash
    Preconditions: All tool implementations and tests complete
    Steps:
      1. Run: npx vitest run --reporter=verbose 2>&1
      2. Count total tests passing
      3. Assert zero failures
      4. Assert integration test specifically passes
    Expected Result: 15+ tests pass (3 per tool domain × 5 + integration), zero failures
    Failure Indicators: Any test failure, import errors, missing tools
    Evidence: .sisyphus/evidence/task-11-full-suite.txt

  Scenario: TypeScript compiles clean
    Tool: Bash
    Preconditions: All source files written
    Steps:
      1. Run: npx tsc --noEmit 2>&1
      2. Assert exit code 0
      3. Run: grep -rn "as any\|@ts-ignore\|catch {}" src/ index.ts || echo "CLEAN"
      4. Assert output: "CLEAN"
    Expected Result: Zero type errors, no type escape hatches
    Failure Indicators: Type errors, `as any` found
    Evidence: .sisyphus/evidence/task-11-tsc-clean.txt

  Scenario: Integration test verifies 10 tools (negative: missing tool)
    Tool: Bash
    Preconditions: Integration test created
    Steps:
      1. The integration test itself asserts exactly 10 tools
      2. If a tool module forgot to register, test fails with specific "expected 10, got N" message
    Expected Result: Test explicitly catches missing registrations
    Failure Indicators: Test passes with fewer than 10 tools (false positive)
    Evidence: .sisyphus/evidence/task-11-tool-count.txt
  ```

  **Commit**: YES (commit 6, groups with Task 12)
  - Message: `feat: add integration test and setup documentation`
  - Files: `src/__tests__/integration.test.ts`
  - Pre-commit: `npx tsc --noEmit && npx vitest run`

- [x] 12. README Update — Setup and Usage Documentation

  **What to do**:
  - Replace the current README.md with comprehensive setup documentation:
    - **Prerequisites**: Node.js ≥18, `@circleback/cli` installed globally (`npm install -g @circleback/cli`), authenticated via `cb login`
    - **Installation**: How to add the plugin to OpenClaw (e.g., `openclaw plugin add @circleback/openclaw-circleback`)
    - **Available Tools**: List all 10 tools with brief descriptions of what each does and example use cases
    - **Authentication**: Explain that the plugin uses `@circleback/cli`'s OAuth tokens — user must run `cb login` once before the plugin works
    - **Troubleshooting**: Common issues (not authenticated, token expired → run `cb login` again)
  - Keep it concise — no tutorial, no screenshots, just reference documentation

  **Must NOT do**:
  - Do not add badges, screenshots, or marketing copy
  - Do not write a tutorial or walkthrough
  - Do not document internal architecture

  **Recommended Agent Profile**:
  - **Category**: `writing`
    - Reason: Documentation task, no code changes
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4 (with Task 11)
  - **Blocks**: F1-F4
  - **Blocked By**: Task 1 (package name), Task 3 (verified tool names/descriptions)

  **References**:

  **Pattern References**:
  - `.sisyphus/evidence/task-3-tool-names.md` — Verified tool names and descriptions for the "Available Tools" section
  - Current `README.md` — Existing content to replace (just 5 lines currently)

  **External References**:
  - Circleback MCP docs: `https://support.circleback.ai/en/articles/13249081-circleback-mcp` — reference for auth flow description

  **WHY Each Reference Matters**:
  - Task 3 evidence provides accurate tool names/descriptions — README must match actual implementation

  **Acceptance Criteria**:

  - [ ] README.md updated with: prerequisites, installation, tools list, auth instructions, troubleshooting
  - [ ] All 10 tool names listed match implementation
  - [ ] `cb login` prerequisite clearly documented

  **QA Scenarios:**

  ```
  Scenario: README contains all required sections
    Tool: Bash
    Preconditions: README updated
    Steps:
      1. Run: grep -c "## " README.md
      2. Assert at least 4 section headers (Prerequisites, Installation, Tools, Authentication or similar)
      3. Run: grep -c "cb login" README.md
      4. Assert at least 1 mention of cb login
      5. Count tool names mentioned — assert 10
    Expected Result: README has all sections, mentions cb login, lists all tools
    Failure Indicators: Missing sections, missing tool names, no auth instructions
    Evidence: .sisyphus/evidence/task-12-readme-sections.txt
  ```

  **Commit**: YES (commit 6, groups with Task 11)
  - Message: `feat: add integration test and setup documentation`
  - Files: `README.md`
  - Pre-commit: `npx tsc --noEmit && npx vitest run`

---

## Final Verification Wave (MANDATORY — after ALL implementation tasks)

> 4 review agents run in PARALLEL. ALL must APPROVE. Present consolidated results to user and get explicit "okay" before completing.

- [ ] F1. **Plan Compliance Audit** — `oracle`
  Read the plan end-to-end. For each "Must Have": verify implementation exists (read file, run command). For each "Must NOT Have": search codebase for forbidden patterns — reject with file:line if found. Check evidence files exist in .sisyphus/evidence/. Compare deliverables against plan.
  Output: `Must Have [N/N] | Must NOT Have [N/N] | Tasks [N/N] | VERDICT: APPROVE/REJECT`

- [ ] F2. **Code Quality Review** — `unspecified-high`
  Run `npx tsc --noEmit` + `npx vitest run`. Review all source files for: `as any`/`@ts-ignore`, empty catches, console.log in prod, commented-out code, unused imports. Check AI slop: excessive comments, over-abstraction, generic names, unnecessary utils. Verify TypeBox schemas match actual MCP parameters.
  Output: `Build [PASS/FAIL] | Tests [N pass/N fail] | Files [N clean/N issues] | VERDICT`

- [ ] F3. **Real Manual QA** — `unspecified-high`
  Start from clean state. Verify: `npm install` succeeds, `npx tsc --noEmit` passes, `npx vitest run` all pass, plugin entry can be imported and returns a valid DefinedPluginEntry, each registered tool has name + description + parameters + execute. Run every test scenario from every task. Save evidence to `.sisyphus/evidence/final-qa/`.
  Output: `Scenarios [N/N pass] | Integration [N/N] | VERDICT`

- [ ] F4. **Scope Fidelity Check** — `deep`
  For each task: read "What to do", read actual files created. Verify 1:1 — everything in spec was built, nothing beyond spec was built. Check "Must NOT do" compliance: no retry logic, no base classes, no utils/, no extra tools. Flag unaccounted files or patterns.
  Output: `Tasks [N/N compliant] | Scope [CLEAN/N issues] | VERDICT`

---

## Commit Strategy

| # | Scope | Message | Files | Pre-commit |
|---|-------|---------|-------|------------|
| 1 | Scaffold | `chore: scaffold openclaw plugin project` | .gitignore, package.json, tsconfig.json, openclaw.plugin.json | `node -e "require('./package.json')"` |
| 2 | Test framework | `chore: add vitest config and test helpers` | vitest.config.ts, src/__tests__/setup.ts | `npx vitest run` (placeholder passes) |
| 3 | CLI validation | `docs: document verified MCP tool names` | src/types.ts (initial), .sisyphus/evidence/task-3-* | — |
| 4 | Entry point + types | `feat: add plugin entry point and CLI type declarations` | index.ts, src/types.ts | `npx tsc --noEmit` |
| 5 | All tools | `feat: register all 10 circleback MCP tools with tests` | src/tools/*.ts, src/__tests__/*.test.ts | `npx vitest run` (all pass) |
| 6 | Integration + README | `feat: add integration test and setup documentation` | src/__tests__/integration.test.ts, README.md | `npx tsc --noEmit && npx vitest run` |

---

## Success Criteria

### Verification Commands
```bash
npx tsc --noEmit          # Expected: zero errors
npx vitest run            # Expected: all tests pass (10+ tool tests + integration)
node -e "const p = require('./dist/index.js'); console.log(p.default?.id)"  # Expected: "circleback"
```

### Final Checklist
- [ ] All 10 Circleback MCP tools registered as OpenClaw agent tools
- [ ] TypeBox schemas match verified MCP tool parameters
- [ ] Every tool has mocked test (never calls real API)
- [ ] Plugin loads and registers tools without error
- [ ] TypeScript compilation clean (`tsc --noEmit`)
- [ ] README documents: cb login prerequisite, install steps, tool descriptions
- [ ] No retry logic, no base classes, no utils/, no extra tools
- [ ] No `as any`, no `@ts-ignore`, no empty catches, no console.log in prod code
