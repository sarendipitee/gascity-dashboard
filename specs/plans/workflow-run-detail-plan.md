# Workflow Run Detail Plan

Status: proposed
Mockup: [assets/workflow-run-detail-graphv2-adopt-pr.svg](assets/workflow-run-detail-graphv2-adopt-pr.svg)

## Goal

Make the Workflows page navigable from a run summary to a run detail page for graph.v2 formula runs. The detail page should show:

- A vertical workflow visualization with a distinct shape for each formula construct type.
- Node state for already run, running, and not yet run work, with room for blocked, failed, skipped, and ready.
- Current git working tree changes in code files for the folder where the formula is executing, skipped when that folder is not a git work tree.
- The full coding-agent session for the selected node, streaming while active. The transcript should read like real agent work: request/context, agent responses, tool calls, command output summaries, file edits, and final handoff.
- Exactly zero or one selected node. Clicking the selected node again clears selection.

The target layout is a split view:

- Left: vertical formula graph.
- Right: tabs for `Diff` and `Session`. `Diff` is a code working-tree diff, not a workflow/spec diff. `Session` is a coding-agent request/response transcript, not a generic log.

## Scope

This plan is graph.v2-only.

In scope:

- Workflow roots whose formula/run metadata identifies a graph.v2 formula run.
- Graph.v2 workflow formulas and graph.v2 expansion formulas after they have been compiled/materialized into the run graph.
- Runtime graph nodes and controls emitted by the graph.v2 compiler/dispatcher: normal steps, retry controls, check-loop controls, scope/body nodes, fanout controls, scope-check controls, workflow-finalize controls, and spec/source nodes where present.

Out of scope for this plan:

- Legacy molecule or root-only formula detail pages.
- Router formulas that do not declare `contract = "graph.v2"` unless they launch or resolve to a graph.v2 run.
- Generic formula catalog/preview UI.
- A compatibility renderer for non-graph bead hierarchies.
- Recovering source-level semantics from legacy formulas.

Terminology rule:

- The operator-facing UI must say `check loop`, `review loop`, or the formula's own step title.
- Do not expose the internal implementation name `ralph` in UI copy, route labels, mockups, or operator-facing docs.
- Backend enrichment may map internal `ralph` metadata to the external `check-loop` construct kind.

## Repo Comparison

### This Repo: `gascity-dashboard`

Relevant files:

- `frontend/src/routes/Workflows.tsx`
- `frontend/src/components/workflow/WorkflowMap.tsx`
- `frontend/src/components/workflow/LaneCard.tsx`
- `backend/src/snapshot/collectors/workflows.ts`
- `shared/src/snapshot/types.ts`
- `backend/src/gc-client.ts`
- `backend/src/routes/sessions.ts`
- `backend/src/routes/events.ts`

Current behavior:

- `/workflows` reads `/api/snapshot`.
- The backend builds a `WorkflowSummary` from `GcClient.listBeads({ limit: 1000 })`.
- The UI renders lane summaries only: title, formula, phase, active assignees, status counts, and a five-step stage strip.
- `WorkflowLane.id` is the root workflow id, but rows are not links and no detail route exists.
- Existing transcript support is session-centric:
  - `GcClient.fetchTranscript(id)` calls `/v0/city/{city}/session/{id}/transcript`.
  - `POST /api/sessions/:id/peek` sanitizes and caps transcript output.
- Existing SSE support proxies supervisor city events through `/api/events/stream`, but there is not yet a session stream proxy.

Takeaway:

This repo has the right entry point and design language, but the workflow data shape is summary-only. It needs a run-detail API shape before the requested detail page can be real.

### `~/Code/gastownhall/demo-dash`

Relevant files:

- `src/components/WorkflowMap.ts`
- `src/server/collectors/workflows.ts`

Current behavior:

- This is the predecessor of the current dashboard workflow summary.
- It renders an "Active run map" with lanes, count boxes, circular stage nodes, and connecting lines.
- It collects issues by shelling out to `bd list` in city and rig roots, then groups issues by workflow root id.
- It has the same phase grammar and formula-specific stage inference as this repo.

Takeaway:

`demo-dash` is useful history for how workflow lanes got here, but it does not solve node-level run detail, construct-specific shapes, diff viewing, or session drill-in.

### `~/Code/gascity/gasworks-gui`

Relevant frontend files:

- `src/hooks/useOrdersFormulas.ts`
- `src/components/orders/OrdersListTab.tsx`
- `src/components/orders/OrdersDagDetail.tsx`
- `src/components/orders/WorkflowGraph.tsx`
- `src/components/orders/workflowGraphLayout.ts`
- `src/components/orders/workflowGraphHelpers.ts`
- `src/components/orders/workflowSessionLinks.ts`
- `src/components/orders/useOrdersDagDetailState.ts`
- `src/components/orders/useWorkflowWatchRuntime.ts`

Relevant server files:

- `server/src/ws/workflow_presentation.rs`
- `server/src/ws/workflow_presentation/types.rs`
- `server/src/ws/workflow_presentation/logical_mapping.rs`
- `server/src/ws/workflow_presentation/logical_nodes.rs`
- `server/src/ws/workflow_presentation/display/mod.rs`
- `server/src/ws/workflow_presentation/display/node_filter.rs`

Current behavior:

- Formula runs can open a DAG detail view through `OrdersDagDetail`.
- `getWorkflowDetail` sends `convoy:get` through the broker with `workflow_id`, `scope_kind`, and `scope_ref`.
- The detail response uses `WorkflowSnapshot`, including:
  - physical `beads`
  - physical `deps`
  - `logical_nodes`
  - `logical_edges`
  - `scope_groups`
  - `display_graph`
  - `snapshot_version`
  - `snapshot_event_seq`
- The Rust presentation layer enriches Gas City's raw workflow snapshot into logical nodes, logical edges, scope groups, and display graph.
- `WorkflowGraph` renders the display graph with lanes, status counts, live session chips, zoom/pan, and selected-node styling.
- Selection currently sets the selected node id; it does not toggle off when clicking the already selected node.
- Session links are resolved from node metadata and active/completed node state.
- Workflow updates use a broker watch/resync flow. The dashboard can use its existing supervisor SSE event stream instead.

Takeaway:

This is the best implementation reference. The right move is to reuse the same conceptual contract (`WorkflowSnapshot` plus `display_graph`) and adapt the rendering to the dashboard's quieter vertical layout. The dashboard should not own all workflow grouping, retry aggregation, and scope collapsing logic if Gasworks already has it in one place.

## Formula Construct Research

Relevant Gas City files:

- `/Users/csells/Code/gastownhall/gascity/internal/formula/types.go`
- `/Users/csells/Code/gastownhall/gascity/internal/formula/recipe.go`
- `/Users/csells/Code/gastownhall/gascity/internal/formula/controlflow.go`
- `/Users/csells/Code/gastownhall/gascity/internal/formula/expand.go`
- `/Users/csells/Code/gastownhall/gascity/internal/formula/graph.go`
- `/Users/csells/Code/gastownhall/gascity/internal/formula/retry.go`
- `/Users/csells/Code/gastownhall/gascity/internal/formula/ralph.go` (internal check-loop implementation)
- `/Users/csells/Code/gastownhall/gascity/internal/api/handler_convoy_dispatch.go`
- `/Users/csells/Code/gastownhall/gascity/internal/api/huma_types_convoys.go`

Graph.v2 constructs in scope for this plan:

- Source formula contracts: `contract: "graph.v2"` only.
- Source formula types: graph.v2 `workflow` and graph.v2 `expansion`.
- Standard executable step: `Step` with `id`, `title`, `type`, `assignee`, metadata, labels.
- Dependency edge: `depends_on` or `needs`.
- Inline expansion: `expand` and `expand_vars`, when it is visible in source/spec metadata or compiled runtime metadata.
- Conditional step: `condition`, primarily surfaced as skipped or pending runtime state unless source/spec metadata is retained.
- Nested container: `children`, compiled to parent/child or promoted epic/scope semantics.
- Retry control: `retry`, compiled to a control bead plus attempt beads.
- Check-loop control: public formula syntax uses `check`, stored internally as `ralph`, compiled to a control bead plus iteration/check beads.
- Runtime graph controls: `fanout`, `scope-check`, `workflow-finalize`, and `spec` nodes inserted during graph control application.

Compiler-supported graph.v2 constructs that are not first-pass implementation scope unless live graph.v2 runtime data exposes them:

- Wait gate: `waits_for`.
- Async gate: `gate`.
- Loop: `loop` with `count`, `until`, `max`, `range`, `var`, and `body`.
- Runtime fanout source rule: `on_complete` with `for_each`, `bond`, `parallel`, `sequential`.
- Branch rules: `compose.branch` with `from`, `steps`, and `join`.
- Gate rules: `compose.gate`.
- Map rules: `compose.map`.
- Aspect/advice rendering.

Important data-source caveat:

Gas City's native workflow endpoint currently returns physical beads and deps. In `huma_types_convoys.go`, `LogicalNode` and `ScopeGroup` are intentionally empty presentation placeholders, and comments say logical presentation belongs downstream. Gasworks-gui's server is that downstream presentation layer today.

That means this dashboard has two implementation choices:

1. Port the Gasworks presentation enrichment into this repo's backend.
2. Move the presentation enrichment upstream into Gas City, then have this repo consume it.

Recommendation: start by porting the smallest necessary TypeScript equivalent into this dashboard so this feature can ship, but keep the API shape aligned with Gasworks' `WorkflowSnapshot`. If Gas City later owns presentation enrichment, the dashboard adapter can collapse to a pass-through.

## Real-World Formula Pack Observations

Reference pack:

- `/Users/csells/Code/gascity/gas-city-inc/packs/workflows/formulas`

The pack contains 13 TOML formulas: 9 `mol-*` workflow formulas and 4 `expansion-*` formulas. 11 declare `contract = "graph.v2"`; the two router formulas do not declare the graph contract directly and are out of scope unless the detail route resolves them to a launched graph.v2 run.

Construct frequency from exact TOML section/key scans:

| Construct | Observed usage | Notes |
| --- | ---: | --- |
| `[[steps]]` | 68 total across workflow formulas | The dominant visible unit. |
| `[[template]]` | 16 total across expansion formulas | Expansion output becomes normal runtime nodes after compile. |
| `[...retry]` | 67 total | Highest priority non-trivial shape. Release, bugflow, review, and bug-hunt flows all rely on retry-managed steps. |
| check-loop control, stored internally as `[...ralph]` | 5 total | High priority, because these are the iterative review/fix loops the operator will care about. |
| `[[...children]]` | 11 total | Used mainly inside check loops as scoped loop bodies. |
| `[[compose.expand]]` | 5 total | Used to inline review/design-review expansions into target steps. |
| `condition =` | 5 total | Mostly skip flags such as `skip_gemini` and `skip_human_approval`. |
| explicit `loop`, `waits_for`, `gate`, `compose.branch`, `compose.map`, `compose.gate`, `on_complete` | 0 exact TOML sections/keys in this pack | Document as graph.v2 vocabulary, but do not implement first unless live graph.v2 data requires them. |

Important examples:

- `mol-adopt-pr-v2.toml` uses a `review-loop` check loop, child steps for the review pipeline and fix application, `compose.expand` with `expansion-review-pr`, conditional human approval, and a second check loop for CI repair.
- `expansion-review-pr.toml` expands a multi-model PR review fanout into retry-managed Claude/Codex/Gemini review steps, a synthesis step, and a scorecard step. The Gemini lane is conditional.
- `expansion-design-review-core.toml` uses a design review/apply check loop and an explicit runtime fanout control bead through `metadata.gc.kind = "fanout"`, rather than formula-level `on_complete`.
- `mol-bug-report-implementation-v2.toml` composes both design review and PR review expansions, has a code-review check loop, and uses human approval steps represented as normal/retry-managed work rather than formula `gate` sections.
- `mol-release-v1.toml` is mostly a long linear graph with a scope body and retry-managed release gates. "Gate" appears as domain language around CI/GitHub workflows, not as the formula `gate` construct.

Planning implication:

The first production slice should optimize for graph.v2 runtime runs that contain `step`, `retry`, check-loop controls, `children/scope`, `compose.expand`, `condition`, `fanout`, `scope-check`, and `workflow-finalize`. Source-level `loop`, `compose.branch`, `compose.map`, `waits_for`, and `gate` should stay documented as future graph.v2 shapes, not first-pass implementation work.

## Proposed User Experience

### Workflows Page

`LaneCard` becomes a navigable row.

- Primary click target: `/workflows/:workflowId`.
- Preserve external PR/issue links as separate links.
- Pass or fetch `scope_kind` and `scope_ref` when available. If the current summary cannot provide them, the detail endpoint should resolve by workflow id and fall back to the configured city scope.
- Keep the current summary surface quiet. Do not put mini graphs inside every lane.

### Detail Page

Route:

```text
/workflows/:workflowId
```

Optional query params:

```text
?scope_kind=city&scope_ref=<city>&node=<node-id>
```

Recommended behavior:

- Load the workflow detail from `/api/workflows/:workflowId`.
- Load git diff status from `/api/workflows/:workflowId/diff`.
- If `node` is in the query string and exists, select it. Otherwise start with no selected node.
- Selecting a node updates component state. The selected id is a semantic node id, not a physical bead id or a single execution attempt id. Updating `?node=` is optional for the first pass; useful for shareable detail links.
- Clicking a different node selects it.
- Clicking the selected node clears selection.
- Pressing Escape clears selection.
- The `Session` tab is enabled only when the selected semantic node resolves to at least one execution instance with a session link.
- If selected node has no execution instance with a session, the session panel says that no session is attached to this node.
- If no node is selected, the session panel says to select a node.
- Session content is rendered as a coding-agent transcript:
  - inbound task/request or continuation context
  - assistant responses
  - tool/command invocations
  - stdout/stderr summaries, capped
  - file edit summaries
  - final response or current streaming turn
- Do not auto-select active nodes on first load. Start with no selected node unless `?node=` explicitly names a valid node.

### Layout

Desktop:

- Header: workflow title, formula, status summary, root bead id, store/scope, snapshot timestamp/version.
- Main content: two-column split.
- Left column: vertically oriented workflow diagram.
- Right column: evidence panel with tabs:
  - `Diff`
  - `Session`

Mobile/narrow:

- Stack diagram above tabs.
- Keep node selection behavior identical.
- Avoid horizontal graph panning on the initial implementation.

## Visual System

The page should follow `PRODUCT.md` and `DESIGN.md`:

- Light default, dark optional.
- Typography and whitespace carry hierarchy.
- No card grid.
- No neon graph palette.
- Status cannot be carried by color alone.
- Maroon is the rare focus/anomaly mark.

### Node Shapes

Shape priority should follow the graph.v2 formulas in the real-world pack: normal steps, retry, check loops, child scopes, expansion, condition, and fanout first.

First-pass graph.v2 shapes:

| Construct | Shape | Status treatment |
| --- | --- | --- |
| Workflow root | Double-outline rectangle | Summary count and finalizer badge |
| Normal step/task/bug/chore | Rectangle | Check glyph when complete, active mark when running |
| Container/children/epic/scope | Rounded grouping band or bracketed region | Contains child vertical run, muted when complete |
| Conditional step | Split diamond or hexagon | Skipped state when condition false, pending when unresolved |
| Runtime fanout/on_complete | Dashed rounded rectangle | Fanout badge with count when known |
| Retry | Stacked capsule plus visible attempt/body nodes when present | Attempt badge such as `2/3`; executable attempt nodes remain selectable |
| Check loop | Capsule with check notch plus visible loop body nodes | Run/check state and attempt badge; executable loop nodes remain selectable |
| Expansion | Dashed outline group or small expansion badge | Shows generated nodes without pretending source step was directly run |
| Scope-check | Badge attached to target node | Hidden from main graph for v1; may be exposed later through detail/debug affordances |
| Workflow-finalize | Badge on root | Hidden from main graph for v1; may be exposed later through detail/debug affordances |
| Spec/source node | Hidden by default | Available in debug/metadata only |

Loop visibility rule:

- Do not make loops opaque rollups. The user must be able to see and select executable nodes inside retry/check-loop bodies.
- The left graph renders the current/latest iteration body nodes only.
- Show prior iterations as a subtle stack/history cue on the loop region or control node, not as selectable left-graph nodes.
- The current/latest iteration can show multiple selectable body nodes, and more than one of those nodes can have an active streaming session when the graph allows parallel work.
- Selecting a body node opens Session panel iteration tabs for that logical node. Those right-panel tabs are how the user navigates prior iterations.
- Previous iterations are historical. Their sessions are static transcript history and do not stream.
- Control nodes may show aggregate status and attempt counts, but they do not replace the body nodes.
- Compiler/housekeeping nodes such as `scope-check`, `workflow-finalize`, `cleanup`, and `spec` stay hidden or badged for v1 unless they are the only way to expose real operator work.

Deferred graph.v2 shapes:

| Construct | Shape | Status treatment |
| --- | --- | --- |
| Gate/waits_for/compose.gate | Diamond | Locked/pending glyph, active outline when waiting |
| Loop/range/until | Loop pill with circular glyph | Attempt/iteration badge |
| Branch/fork/join | Hexagon or fork node | Parallel child rails below it |
| Map/aspect/advice | Dashed outline group or badge | Shows generated or advisory nodes only when graph.v2 metadata is explicit |

Status vocabulary:

- `done` or `completed`: already run.
- `active` or `running`: running now.
- `pending`: not yet run.
- `ready`: can run now.
- `blocked`: waiting on dependency, gate, human, or tool approval.
- `failed`: terminal failure.
- `skipped`: terminal skipped state.

Each status needs both visual and textual/glyph representation:

- Complete: check glyph plus muted text.
- Running: dark active outline plus "running" label; maroon used only for selected/focus or true anomaly.
- Pending: faint dashed outline plus "pending" label.
- Blocked/failed: explicit word and glyph, not just color.

## Data Contracts

### Semantic Nodes and Execution Instances

Keep the runtime model explicit:

- A semantic node is the formula/logical work unit the operator selects in the graph, for example `review-codex`, `apply-fixes`, or `synthesize`.
- An execution instance is one materialized run of that semantic node, for example `review-codex` in iteration 1, `review-codex` in iteration 2, or retry attempt 2 within iteration 2.
- The left graph renders semantic nodes for the latest visible execution context.
- The right evidence panel navigates execution instances for the selected semantic node.

This distinction prevents UI selection from depending on brittle bead ids, step-ref parsing, or whichever retry/loop attempt happens to be current.

### Workflow Summary Extension

Current `WorkflowLane` should gain enough detail to link reliably:

```ts
interface WorkflowLane {
  id: string;
  title: string;
  formula: string | null;
  scopeKind?: 'city' | 'rig' | null;
  scopeRef?: string | null;
  rootStoreRef?: string | null;
  // existing fields unchanged
}
```

If scope/store cannot be populated from the summary collector yet, leave them nullable and resolve on the detail route.

### Workflow Detail

Add shared types aligned with Gasworks:

```ts
type WorkflowNodeStatus =
  | 'pending'
  | 'ready'
  | 'running'
  | 'active'
  | 'done'
  | 'completed'
  | 'failed'
  | 'blocked'
  | 'skipped';

interface WorkflowSessionLink {
  sessionId: string;
  sessionName: string;
  assignee: string;
  rigId?: string;
}

interface WorkflowExecutionInstance {
  id: string;
  semanticNodeId: string;
  beadId?: string;
  iteration?: number;
  attempt?: number;
  label?: string;
  status?: WorkflowNodeStatus;
  sessionLink?: WorkflowSessionLink | null;
  currentIteration?: boolean;
  historical?: boolean;
  streamable?: boolean;
}

interface WorkflowDisplayNode {
  id: string;
  semanticNodeId: string;
  title: string;
  kind: string;
  constructKind: WorkflowConstructKind;
  status: WorkflowNodeStatus;
  currentBeadId?: string;
  scopeRef?: string;
  loopControlNodeId?: string;
  visibleIteration?: number;
  iterationCount?: number;
  hasHistoricalIterations?: boolean;
  attemptBadge?: string;
  attemptCount?: number;
  activeAttempt?: number;
  visibleExecutionInstanceId?: string;
  executionInstances: WorkflowExecutionInstance[];
  controlBadges?: Array<{
    id: string;
    label: string;
    status: WorkflowNodeStatus;
  }>;
}

interface WorkflowDisplayEdge {
  from: string;
  to: string;
  kind?: string;
}

interface WorkflowDisplayLane {
  id: string;
  label: string;
  nodeIds: string[];
}

interface WorkflowRunDetail {
  workflowId: string;
  rootBeadId: string;
  rootStoreRef: string;
  resolvedRootStore: string;
  scopeKind: 'city' | 'rig';
  scopeRef: string;
  title: string;
  formula: string | null;
  executionPath: string | null;
  snapshotVersion: number;
  snapshotEventSeq?: number | null;
  partial: boolean;
  nodes: WorkflowDisplayNode[];
  edges: WorkflowDisplayEdge[];
  lanes: WorkflowDisplayLane[];
}
```

### Backend Endpoints

```text
GET /api/workflows/:workflowId
GET /api/workflows/:workflowId/diff
GET /api/sessions/:id/stream
```

`GET /api/workflows/:workflowId`:

- Calls supervisor workflow endpoint if available:
  - `/v0/city/{cityName}/workflow/{workflowId}`
  - include `scope_kind` and `scope_ref` when supplied.
- Enriches physical beads/deps into display nodes/edges if supervisor returns only raw data.
- Returns the dashboard-specific `WorkflowRunDetail`.
- Uses the same timeout and topology-leak posture as existing routes.

`GET /api/workflows/:workflowId/diff`:

- Server resolves the execution path. The browser never supplies a filesystem path.
- The diff represents the current code working tree for that execution folder. It is expected to be mostly source files, tests, package/config files, and docs changed by the selected run.
- It does not attempt to diff the formula definition, bead metadata, or workflow graph unless those files are actually changed in the execution folder.
- UI copy must describe the diff as the current working tree for the run's execution folder. Do not imply the diff is node-scoped or causally attributable to the selected run until the backend has per-node baselines or commits.
- Resolve the path from supervisor-owned run data:
  - Prefer the formula execution `cwd` when the workflow detail exposes it.
  - Then use root/run metadata such as `gc.work_dir` or `work_dir`.
  - Then use attached session metadata such as `work_dir`, if that is the only execution path the supervisor exposes.
  - If execution cwd/work-dir metadata is missing, use the run's rig root.
  - If neither execution path nor rig root is available, return `kind: "path_unknown"`.
- Do not infer paths from browser query params, PR URLs, GitHub state, or local checkout conventions.
- Check git with `git -C <path> rev-parse --show-toplevel`.
- If not a git work tree, return `kind: "not_git"`.
- If it is git:
  - `git -C <path> status --porcelain=v1`
  - `git -C <path> diff --no-ext-diff --no-color`
  - optionally `git -C <path> diff --cached --no-ext-diff --no-color`
- Use `execFile`, not shell strings.
- Cap output bytes and use a timeout.
- Return plain unified diff. Colorize in the frontend from diff prefixes rather than rendering raw ANSI.
- Add lightweight file classification in the response if cheap, for example `code`, `test`, `docs`, `config`, `other`, so the UI can summarize changed code files without pretending to understand every language.
- Include truncation metadata.

Example response:

```ts
interface WorkflowDiffResponse {
  kind: 'ok' | 'not_git' | 'path_unknown' | 'error';
  rootPath: string | null;
  status: string[];
  changedFiles: Array<{
    path: string;
    status: string;
    kind: 'code' | 'test' | 'docs' | 'config' | 'other';
  }>;
  unstagedDiff: string;
  stagedDiff: string;
  truncated: boolean;
  error?: string;
}
```

`GET /api/sessions/:id/stream`:

- Proxy supervisor SSE:
  - `/v0/city/{cityName}/session/{id}/stream`
- Use the same same-origin SSE proxy pattern as `/api/events/stream`.
- Accept `Last-Event-ID`.
- If streaming fails, the frontend can fall back to `POST /api/sessions/:id/peek`.
- Treat transcript payloads as coding-agent turns. Preserve enough structure to distinguish user/request text, assistant text, tool calls, tool output, and terminal/final messages when the supervisor provides it. If the supervisor only returns plain text, render it in transcript order without inventing structure.

## Workflow Presentation Enrichment

The display graph should be derived using Gasworks' model:

1. Map physical bead ids to semantic node ids.
2. Build execution instances from materialized beads, preserving iteration, attempt, session, status, and streamability.
3. Choose the latest/current execution context for the left graph, while preserving historical instances for the evidence panel.
4. Group retry and check-loop attempts under their control node without hiding latest-iteration executable body nodes.
5. Collapse scope-check and workflow-finalize into control badges where appropriate.
6. Compute logical edges from physical deps, excluding containment/deletion-only edges.
7. Build scope groups/lanes.
8. Build display graph for the React page.

Initial port scope:

- Port enough logic to handle:
  - workflow root
  - normal steps
  - retry
  - check loops
  - scope-check
  - workflow-finalize
  - fanout
  - session link resolution
- Preserve richer future fields so loop/branch/expansion can be added without changing the route contract.

Construct shape derivation:

- Prefer explicit `constructKind` if upstream adds it.
- Otherwise derive from:
  - `node.kind`
  - bead metadata `gc.kind`
  - metadata `gc.original_kind`
  - metadata `gc.step_ref`
  - `control_badges`
  - formula source/spec nodes when present.

Known limitation:

Some source-level constructs, especially `condition`, `expand`, `map`, and `branch`, may be lost or flattened after compilation unless the source formula/spec is attached. The UI can still show the runtime graph, but exact source-construct labeling needs upstream metadata or source-spec retention.

Historical-only case:

- A semantic node may have execution history but not appear in the latest visible graph because conditions, expansions, or fanout changed between iterations.
- Do not invent a left-graph node for that case in v1.
- If the selected semantic node has historical execution instances that are not represented in the latest graph, the evidence panel should label them as historical-only and keep transcripts available from the right side.

## Frontend Components

Add:

- `frontend/src/routes/WorkflowRunDetail.tsx`
- `frontend/src/components/workflow/WorkflowRunDiagram.tsx`
- `frontend/src/components/workflow/WorkflowRunNode.tsx`
- `frontend/src/components/workflow/WorkflowRunEdges.tsx`
- `frontend/src/components/workflow/WorkflowRunTabs.tsx`
- `frontend/src/components/workflow/WorkflowDiffPanel.tsx`
- `frontend/src/components/workflow/WorkflowNodeEvidencePanel.tsx`
- `frontend/src/components/workflow/WorkflowNodeSessionPanel.tsx`
- `frontend/src/hooks/useWorkflowRunDetail.ts`
- `frontend/src/hooks/useSessionStream.ts`

Modify:

- `frontend/src/App.tsx`: add `/workflows/:workflowId`.
- `frontend/src/components/workflow/LaneCard.tsx`: make row navigable.
- `frontend/src/api/client.ts`: add workflow detail, diff, and session stream helpers.

Selection behavior:

```ts
setSelectedNodeId((current) =>
  current === clickedNodeId ? null : clickedNodeId,
);
```

The selected node should be visually obvious without becoming the only status signal:

- Focus outline or inset rule.
- `aria-pressed`.
- Keyboard activation with Enter/Space.
- Escape to clear.

## Backend Components

Add:

- `backend/src/routes/workflows.ts`
- `backend/src/workflows/types.ts`
- `backend/src/workflows/enrich.ts`
- `backend/src/workflows/diff.ts`
- `backend/src/workflows/paths.ts`

Modify:

- `backend/src/gc-client.ts`:
  - `getWorkflow(workflowId, scope?)`
  - `streamSession(sessionId)` or route-local proxy helper.
- `backend/src/server.ts`: mount `/api/workflows` and `/api/sessions/:id/stream`.
- `shared/src/snapshot/types.ts`: shared run-detail types, or create a new shared workflow-detail module.

Implementation note:

Keep git path resolution server-owned. Do not accept arbitrary `path` query params from the browser.

## Implementation Phases

### Phase 1: Contract and Routing

- Add shared workflow detail and diff types.
- Add backend `GET /api/workflows/:workflowId`.
- Call supervisor workflow endpoint.
- Reject or return an unsupported state for workflow roots that do not resolve to graph.v2.
- If the supervisor returns only raw beads/deps for a graph.v2 root, return a basic enriched graph with one node per bead.
- Add frontend route and loading/error states.
- Make Workflow lanes clickable.

Exit criteria:

- Clicking a workflow lane opens a detail page.
- The page can render a basic graph from fixture or live data.
- No git/session work yet.

### Phase 2: Presentation Enrichment

- Port/adapt Gasworks' logical mapping, node aggregation, edge filtering, scope groups, and display graph logic.
- Normalize raw supervisor workflow snapshots into semantic nodes plus execution instances before rendering.
- Add `constructKind` derivation.
- Render vertical diagram with construct-specific shapes.
- Implement exact one-node selection and toggle-off.
- Add golden snapshot tests: raw supervisor workflow snapshot in, normalized display graph/evidence model out.

Exit criteria:

- Retry/check attempts collapse correctly.
- Semantic nodes and execution instances are distinct in the shared contract.
- Running/done/pending/blocked/skipped/failed states render distinctly.
- Selection state passes keyboard and click tests.

### Phase 3: Git Diff Panel

- Add backend diff endpoint.
- Resolve execution path from supervisor-owned run data, using execution cwd/work-dir first and rig root if cwd/work-dir metadata is missing.
- Label the diff as current execution-folder working tree state, not node-specific or run-causal evidence.
- Add no-git/path-unknown/skipped states.
- Summarize changed code files from `git status --porcelain=v1`.
- Render staged and unstaged diffs with prefix-based colorization.
- Cap large diffs.

Exit criteria:

- Git work trees show colorized code diffs.
- Non-git folders show a quiet skipped state.
- Large diffs truncate intentionally.

### Phase 4: Session Panel and Streaming

- Resolve execution instances for the selected semantic node.
- If a selected loop body node has execution instances from multiple iterations, show them as tabs or a compact segmented control labeled by iteration number.
- If a selected retry-managed node has multiple attempt execution instances within an iteration, show attempt tabs inside the selected iteration context.
- Default to the current/latest iteration. Within that iteration, default to the active/running attempt session when one exists; otherwise default to the latest completed attempt.
- Reuse transcript rendering conventions from Agent Detail/Peek, but frame the content as coding-agent request/response turns.
- Add `/api/sessions/:id/stream` SSE proxy to supervisor session stream.
- Fall back to existing peek endpoint when SSE is unavailable.
- Stream only while the Session tab is visible and the selected node's selected session is in the current/latest loop iteration and active/running.
- Previous loop iterations never stream. Render their sessions from fetched transcript history.
- When a retry node has multiple attempt tabs, only the open attempt may stream. Other attempts remain static until clicked.
- Surface historical-only execution instances in the evidence panel without adding left-graph nodes.
- Preserve tool-call and command-output boundaries where available. This matters because formula nodes are usually coding tasks, not simple status logs.

Exit criteria:

- Selecting a completed node shows its full transcript.
- Selecting an active node streams new turns.
- The transcript visually distinguishes request/context, assistant response, tool call, and tool output sections.
- Changing selection closes the previous stream.

### Phase 5: Polish and Hardening

- Add light/dark styling.
- Add responsive stacked layout.
- Add empty states:
  - no graph
  - no git repo
  - no selected node
  - selected node without session
  - stale/partial snapshot
- Add screenshot coverage for the detail route.

Exit criteria:

- Typechecks pass.
- Snapshot captures pass for `/workflows` and `/workflows/:workflowId`.
- The page still satisfies the Flat Page Rule and Greyscale Test.

## Tests

Backend:

- `workflows` route returns 400 for invalid ids/scope.
- `workflows` route maps upstream 404 without leaking supervisor URL.
- Enrichment handles retry, check loops, scope-check, workflow-finalize, fanout, skipped, failed.
- Golden snapshot tests cover raw supervisor snapshots for active and completed graph.v2 runs.
- Golden snapshot tests assert semantic-node ids stay stable while execution-instance ids vary by iteration/attempt.
- Diff endpoint:
  - returns `not_git` outside git.
  - returns status and diff inside git.
  - classifies changed files well enough for code/test/docs/config summaries.
  - caps output.
  - uses fixed server-side paths only.
- Session stream proxy:
  - forwards SSE headers.
  - closes upstream on client disconnect.
  - forwards `Last-Event-ID`.

Frontend:

- `LaneCard` links to detail route while preserving external links.
- Detail page loading, error, partial, and empty graph states.
- Node selection toggles off when clicking selected node.
- Only one node is selected at a time.
- Left graph selects semantic nodes, not physical beads or execution instances.
- Previous loop iterations are represented as subtle stack/history cues, not selectable left-graph nodes.
- Diff colorization for added, removed, hunk, context, and file header lines.
- Session panel states for no selection, no session, completed coding-agent transcript, and active stream.
- Session panel shows iteration/attempt history for the selected semantic node and marks historical-only instances.
- Transcript rendering for request, assistant response, tool call, tool output, and final response blocks.

Visual:

- `npm --workspace frontend run typecheck`
- `npm --workspace backend run typecheck`
- `node scripts/snap.mjs workflows`
- Add a detail snapshot harness once fixture workflow detail exists.

## Risks

- Current dashboard summary lacks scope/store details, so first detail-route resolution may need to search workflow roots by id.
- The most likely source of implementation mess is confusing semantic nodes with execution instances. Keep that boundary explicit in shared types, selectors, tests, and component names.
- Exact formula construct type can be impossible to recover from compiled beads unless source/spec metadata is available.
- Gasworks and this dashboard could drift if enrichment logic is copied instead of shared upstream.
- Golden snapshot tests reduce drift but do not eliminate it; long term, presentation enrichment should move upstream or into a shared package.
- Large workflows need graph simplification or virtualization.
- Git diffs can be large and potentially sensitive; keep them local, capped, and explicit. They are current working-tree evidence, not proof that a selected node made a change.
- Session streaming adds long-lived connections. It needs cleanup on tab switch, selection change, and route leave.
- Previous loop iterations can contain nodes that no longer exist in the latest visible graph. The right evidence panel must preserve that history without cluttering the left diagram.

## Grill-Me Questions

1. Should the dashboard own workflow presentation enrichment, or should Gas City own it?

Recommended answer: short term, dashboard owns a small TypeScript port aligned with Gasworks' contract. Medium term, move enrichment upstream or into a shared package so Gasworks and dashboard do not fork semantics.

2. Should `/workflows/:workflowId` be enough, or should scope be part of the route?

Recommended answer: use `/workflows/:workflowId` with optional `scope_kind` and `scope_ref` query params. It keeps the main URL readable and still disambiguates if duplicate workflow ids appear across stores.

3. Should active node selection happen automatically?

Answer: no. Start with no selected nodes unless `?node=` explicitly names a valid node. The user can click a node when they want session detail.

4. Should the Diff tab show all repo changes or only changes tied to the selected node?

Recommended answer: first version shows the current repo diff for the workflow execution folder. Node-scoped diffs need per-node baselines or commits, which are not available yet.

5. Should the Session tab stream by default when a selected node is active?

Answer: yes, but only while the Session tab is visible, only for the selected node/session, and only when that node belongs to the current/latest loop iteration. Previous loop iterations render static transcript history.

6. Should control nodes such as scope-check and workflow-finalize be full nodes?

Answer: no for v1. Render them as badges attached to their target/root, matching Gasworks. Add a detail/debug affordance later if the operator needs to inspect them directly.

7. Should no-git folders be treated as an error?

Recommended answer: no. Show a quiet skipped state. The user explicitly asked to skip if there is no git in the folder.

8. Should the diagram use a graph library?

Recommended answer: not in the first pass. Gasworks already has a layout engine, and this dashboard wants a narrow vertical graph. A simple deterministic layout is easier to control visually. Revisit React Flow only if pan/zoom/large-graph interaction becomes the bottleneck.

9. How should previous loop iterations appear?

Answer: show a subtle stack/history cue on the left graph, but only render/select the latest iteration's body nodes there. Use the Session panel's iteration tabs to navigate prior iterations for the selected logical node.

## Open Implementation Decision

The only major unresolved dependency is graph.v2 source-construct fidelity. Runtime bead kinds tell us a lot about retry, check loops, fanout, scope-check, workflow-finalize, and normal work. They do not always tell us whether a node came from `condition`, `expand`, `map`, or `compose.branch`.

Recommended next step before coding:

- Pick one real active formula run.
- Fetch its supervisor workflow snapshot.
- Inspect bead metadata for source/spec retention.
- Decide whether `constructKind` can be derived locally or needs new Gas City metadata.
