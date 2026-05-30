# Workflow Run Detail Type Architecture

Status: current implementation documented, with target-state gaps called out.

Primary files:

- `shared/src/workflow-detail.ts`
- `backend/src/routes/workflows.ts`
- `backend/src/workflows/enrich.ts`
- `backend/src/workflows/formula-run.ts`
- `backend/src/workflows/execution-instances.ts`
- `backend/src/workflows/display-state.ts`
- `frontend/src/hooks/useWorkflowRunDetail.ts`
- `frontend/src/routes/WorkflowRunDetail.tsx`
- `frontend/src/components/workflow/*`

## Purpose

The workflow run detail type is the browser contract for one graph.v2 formula
run. Its job is to turn many supervisor-facing pieces into one display-ready
projection:

- the supervisor workflow snapshot
- runtime bead state
- formula detail/preview order
- dependency edges
- loop iterations and retry attempts
- hidden control beads rendered as badges
- session links and streamability
- execution folder identity
- aggregate progress counts

The frontend should not infer workflow semantics from raw beads, raw sessions,
raw dependency rows, or formula files. The backend owns that interpretation and
returns a single, browser-safe `WorkflowRunDetail`.

## Design Goals

1. Keep formula-run semantics out of React.

   React renders nodes, edges, tabs, diffs, and transcripts from an explicit
   wire shape. It should not know how to group retry attempts, collapse control
   beads, decide whether a pending node is ready or blocked, or resolve a
   physical bead into a semantic formula construct.

2. Use supervisor-owned data as the source of truth.

   The dashboard must not parse formula TOML files. Formula order and construct
   metadata come from the supervisor workflow snapshot and formula detail API.
   Runtime status comes from supervisor bead/session APIs.

3. Make missing and degraded data explicit.

   Required app-owned states use tagged shapes, not silent nulls or empty-list
   coercion. Examples include `WorkflowFormula`, `WorkflowExecutionPath`,
   `WorkflowSnapshotSequence`, `WorkflowSessionAttachment`,
   `WorkflowIteration`, and `WorkflowAttempt`.

4. Model semantic nodes separately from execution instances.

   A formula construct is a stable semantic node. Each concrete bead execution
   of that construct is an execution instance. Loop iterations and retry
   attempts should therefore add instances, not invent unrelated UI concepts.

5. Make the UI a pure projection.

   The left graph renders `WorkflowDisplayNode[]` and `WorkflowDisplayEdge[]`.
   The right evidence tabs render `WorkflowDiffResponse` and the selected
   node's `WorkflowExecutionInstance[]`. Header copy uses `WorkflowRunProgress`.

6. Prefer whole-projection refresh over client-side event mutation.

   Supervisor event streams are used as invalidation signals. The backend
   rebuilds the aggregate from current supervisor state. The frontend should not
   patch graph state by interpreting raw streamed bead events.

## Public Wire Shape

`WorkflowRunDetail` is the frontend-facing type:

```ts
interface WorkflowRunDetail {
  workflowId: string;
  rootBeadId: string;
  rootStoreRef: string;
  resolvedRootStore: string;
  scopeKind: WorkflowScopeKind;
  scopeRef: string;
  title: string;
  formula: WorkflowFormula;
  executionPath: WorkflowExecutionPath;
  snapshotVersion: number;
  snapshotEventSeq: WorkflowSnapshotSequence;
  completeness: WorkflowRunCompleteness;
  progress: WorkflowRunProgress;
  nodes: WorkflowDisplayNode[];
  edges: WorkflowDisplayEdge[];
  lanes: WorkflowDisplayLane[];
}
```

`WorkflowRunCompleteness` is the explicit degraded-state contract:

```ts
type WorkflowRunCompleteness =
  | { kind: "complete" }
  | { kind: "partial"; reasons: WorkflowRunPartialReason[] };
```

Current partial reasons are supervisor snapshot incompleteness, failed runtime
bead refresh, failed session list load, and unavailable formula detail. This is
separate from `WorkflowRunProgress.snapshotPartial`, which records only the
supervisor snapshot flag.

`WorkflowDisplayNode` is the semantic construct rendered in the graph:

```ts
interface WorkflowDisplayNode {
  id: string;
  semanticNodeId: string;
  title: string;
  kind: string;
  constructKind: WorkflowConstructKind;
  status: WorkflowNodeStatus;
  currentBeadId: string;
  scope: WorkflowNodeScope;
  visibleInGraph: boolean;
  historicalOnly: boolean;
  iterationSummary: WorkflowIterationSummary;
  attemptSummary: WorkflowAttemptSummary;
  visibleExecutionInstanceId: string;
  executionInstances: WorkflowExecutionInstance[];
  controlBadges: WorkflowControlBadge[];
}
```

`WorkflowExecutionInstance` is the concrete runtime execution of a semantic
node:

```ts
interface WorkflowExecutionInstance {
  id: string;
  semanticNodeId: string;
  beadId: string;
  iteration: WorkflowIteration;
  attempt: WorkflowAttempt;
  label: string;
  status: WorkflowNodeStatus;
  session: WorkflowSessionAttachment;
  currentIteration: boolean;
  historical: boolean;
}
```

This split is the load-bearing part of the design. The graph selects semantic
nodes; the session panel can then expose individual iterations/attempts for the
selected semantic node.

## Backend Projection

The backend's internal aggregate is `RunningFormulaRun` in
`backend/src/workflows/formula-run.ts`. It is intentionally richer than the
wire type:

- raw supervisor snapshot
- root identity and scope
- deduped workflow beads
- semantic node groups
- physical-to-semantic bead id mapping
- control badges keyed by target node
- latest loop iteration by loop control
- session index and session link context
- display nodes, edges, lanes, and progress

The route sequence is:

1. `GET /api/workflows/:workflowId` validates `workflowId`, `scope_kind`, and
   `scope_ref`.
2. The backend fetches the supervisor workflow snapshot.
3. For city-store workflows, runtime bead reads overlay current status,
   assignee, cwd/session metadata, `session_id`/`session_name`,
   `gc.session_id`/`gc.session_name`, and other presentation fields onto the
   embedded snapshot rows.
4. For rig-store workflows, the embedded workflow snapshot is treated as
   authoritative because the supervisor does not expose rig-store per-bead
   reads through the city bead endpoint.
5. The backend fetches session summaries so node instances can resolve attached
   sessions to canonical session ids.
6. The backend fetches formula detail/preview when the root bead provides
   `gc.formula` plus a target from `gc.run_target`, `gc.routed_to`, or the
   root assignee. This gives compiled formula order without local file parsing.
7. `enrichWorkflowRun()` validates graph.v2 identity and calls
   `buildRunningFormulaRun()`.
8. `buildRunningFormulaRun()` groups beads, orders groups, builds execution
   instances, builds edges, applies display status, builds lanes, calculates
   progress, and returns `RunningFormulaRun`.
9. `enrichWorkflowRun()` emits `WorkflowRunDetail`.

## Current Supervisor Data Sources

The dashboard can build the current detail view from existing supervisor data.
The important sources are:

- Workflow snapshot identity: `workflow_id`, `root_bead_id`,
  `root_store_ref`, `resolved_root_store`, `scope_kind`, `scope_ref`,
  snapshot version/sequence, `partial`, beads, and deps.
- Root bead metadata: `gc.formula_contract`, `gc.formula`,
  `gc.run_target`/`gc.routed_to`, `gc.cwd`/`gc.work_dir`,
  `gc.rig_root`, and optional `gc.workflow_id`/`gc.root_bead_id` identity.
- Per-bead presentation metadata: `gc.kind`, `gc.original_kind`,
  `gc.logical_bead_id`, `gc.step_id`, `gc.step_ref`, `gc.scope_ref`,
  `gc.control_for`, `gc.iteration`, `gc.attempt`, `gc.max_attempts`, and
  `gc.outcome`.
- Runtime bead overlay metadata: unprefixed `session_id`/`session_name` and
  supervisor-prefixed `gc.session_id`/`gc.session_name`, plus cwd/rig-root
  metadata used for the execution path.
- Session summaries: current supervisor sessions resolve session ids, aliases,
  titles, templates, and runtime session names to canonical transcript links.
- Formula detail: compiled preview/order comes from the supervisor formula API
  once the root bead supplies the formula name and run target.
- City events: exact invalidation is available when an event carries
  top-level workflow identity or bead metadata with `gc.workflow_id` and
  `gc.root_bead_id`. Events without identity remain broad invalidation signals.

Gasworks uses the same metadata family for its workflow presentation graph:
logical identity comes from `gc.logical_bead_id`/`gc.step_ref`, scope and loop
state from `gc.scope_ref`/iteration metadata, and session links from
unprefixed or `gc.*` session metadata. Those are therefore implementation data
sources, not missing supervisor API surfaces.

## Status Model

Node status is presentation status, not only raw bead status.

The pipeline is:

1. `presentationStatus(bead)` maps supervisor bead status into
   `WorkflowNodeStatus`.
2. `buildWorkflowDisplayNode()` aggregates all execution instances for one
   semantic node and chooses the visible instance.
3. Loop historical state marks older iterations as `historical` and prevents
   them from rendering as left-graph nodes.
4. Session streamability is true only when an instance is attached to a session,
   belongs to the current visible iteration, and has a running status.
5. `applyDisplayNodeStates()` upgrades current pending instances to `ready` or
   `blocked` based on inbound dependency edges.
6. `WorkflowRunProgress` counts visible statuses and all-node statuses
   separately.

The UI should read `node.status` for per-node display and
`detail.progress.statusCounts` for aggregate display. It should not recompute
these values by walking raw instances.

## Loop And Retry Model

The graph is intentionally simple on the left:

- only current/latest graph nodes are selectable
- older loop iterations remain available as execution instances
- selected loop nodes expose iteration tabs in the session panel
- attempts within an iteration expose attempt choices when more than one exists

This means a loop produces a subtle stacked visual indication in the graph, but
history navigation happens on the right where transcripts live.

Deep links may still target a historical-only semantic node by `?node=...` so a
saved transcript URL can open directly to its evidence. That does not make the
node selectable on the left: `visibleInGraph === false` still prevents graph
rendering, and normal click selection remains limited to current/latest graph
nodes.

## UI Consumption

`useWorkflowRunDetail()` loads:

- `api.workflowRun(workflowId, scope)`
- `api.workflowDiff(workflowId, scope)`

`WorkflowRunDetailPage` then renders:

- header title and status synopsis from `detail.title` and `detail.progress`
- metadata from `detail.formula`, `detail.rootBeadId`, `detail.scopeKind`,
  `detail.scopeRef`, and `detail.resolvedRootStore`
- partial warning from `detail.completeness`
- left graph from `detail.nodes` and `detail.edges`
- right tabs from `diff` and `selectedNode`

`useWorkflowRunDetail()` exposes a tagged load state: idle, loading, ready, or
failed. A ready state contains a non-null detail and diff response; background
refresh state is tagged separately so a stale visible detail can report refresh
failures without collapsing into a nullable detail/diff pair.

`useWorkflowNodeSelection()` owns the zero-or-one selected semantic node. A
click selects a node; clicking the selected node clears selection. The selected
node is looked up from the latest `detail.nodes`.

`WorkflowNodeSessionPanel` reads the selected node's
`executionInstances`. It groups attached sessions by iteration and attempt,
chooses a streamable instance when available, and delegates transcript loading
to `useSessionStream()`.

## Notification And Refresh Model

There are two independent stream paths today:

1. City event stream: `/api/events/stream`

   `useGcEventRefresh()` parses supervisor event envelopes, matches event type
   prefixes, coalesces bursts, and calls a refresh callback. This is used on the
   Workflows list to refresh the snapshot when `bead.*` events arrive.

   This stream is an invalidation channel. It does not carry a
   `WorkflowRunDetail` patch, and React should not mutate a detail graph from
   raw event payloads.

2. Session stream: `/api/sessions/:id/stream`

   `useSessionStream()` first loads a transcript snapshot, then appends streamed
   turns or replaces the snapshot when the stream sends a full transcript. This
   updates the selected-node transcript panel only.

Current implementation note: the Workflows list subscribes to `bead.*` city
events, and the Workflow Run Detail page subscribes to both `bead.*` and
`session.*` city events. The detail page filters matching events to the current
run when the event envelope or bead metadata carries `workflow_id`,
`root_bead_id`, `gc.workflow_id`, or `gc.root_bead_id`; otherwise it falls back
to broad invalidation and refetches the whole backend-owned projection. Active
selected sessions also open their own transcript stream; that stream updates
only the transcript panel, not the graph projection.

## Current Implementation Against The Ideal

Implemented:

- graph.v2-only validation before enrichment
- dedicated backend aggregate, `RunningFormulaRun`
- browser-owned wire shape, `WorkflowRunDetail`
- semantic node grouping over physical beads
- control badges for hidden workflow controls
- formula-detail order from the supervisor, with snapshot order fallback
- execution instances for loop iterations and retry attempts
- current/latest loop node visibility on the left
- historical instances available in the session panel
- status presentation for pending, ready, running, done, failed, blocked, and
  skipped
- progress counts in `WorkflowRunProgress`
- session link resolution from unprefixed and `gc.*` bead metadata plus current
  session summaries
- streamable session marking for current running instances
- city-event invalidation on the detail page for `bead.*` and `session.*`
  changes, filtered by workflow/root identity when event metadata provides it,
  using whole-projection refresh rather than client-side mutation
- current working-tree diff from the execution folder
- explicit workflow completeness with partial reasons instead of a generic
  `partial` boolean
- tagged workflow-detail load state in React, with non-null ready detail and
  diff values
- route validation for workflow id and scope query pairs
- deterministic browser harness for the detail route
- generated OpenAPI path/query/response types plus `openapi-fetch` for
  supervisor workflow endpoint calls
- generated OpenAPI runtime validation for the supervisor payloads that feed
  workflow detail projection: session lists, workflow snapshots, formula
  details, transcripts, and health
- generated OpenAPI runtime validation for bead, bead-list, mail-list, and
  event-list payloads, with an explicit generated-schema overlay for the
  observed nullable `Bead.priority` supervisor drift
- centralized client-error reporting for workflow detail load failures, diff
  failures, malformed city event payloads, and malformed selected-session
  stream events
- tests asserting that current running execution instances either have an
  attached streamable session or expose `session_unresolved`

## Fixture Gap Analysis

`frontend/src/test/fixtures/workflow-run-detail.json` is the richest current
browser fixture for this route. It models a real run detail with seven semantic
nodes, four dependency edges, one lane, four transcript snapshots, one active
session stream, hidden control badges, historical-only evidence, retry/loop
instances, no-graph and degraded diff variants in the harness, and both
attached and unresolved session states.

Current implementation coverage against that fixture:

- Header and metadata consume the fixture's title, formula, root bead, scope,
  resolved store, snapshot version/sequence, completeness, and progress counts.
- The graph consumes visible nodes, construct kinds, statuses, bounded attempt
  badges, stacked iteration summaries, hidden-control badges, and
  `visibleInGraph`/`historicalOnly`.
- The evidence panel consumes current working-tree diff states, transcript
  snapshots, active stream turns, historical iteration transcripts, failed retry
  transcript links, unresolved-session empty states, and not-started empty
  states.
- The route consumes fixture-backed workflow/root event identity via the city
  event matcher and falls back to broad invalidation when no identity is
  present.
- The deterministic browser harness covers the fixture journey in both light
  and dark themes, including scoped navigation, diff rendering, related
  entities, active session streaming, historical-only evidence, partial runs,
  no-graph runs, and diff unavailable states.

Current implementation gaps against the fixture data:

1. **Dependency edges are summarized, not drawn.** The fixture carries four
   `WorkflowDisplayEdge` rows and `progress.edgeCount`; the UI renders the
   count (`4 dependency edges`) but does not draw source-to-target connectors,
   edge labels, or edge-kind-specific affordances. Backend edge semantics still
   feed status derivation before the browser receives the detail.
2. **Lanes are not rendered in the run-detail graph.** The fixture carries a
   `lanes` array, but `WorkflowRunDiagram` intentionally preserves
   `detail.nodes` order and ignores lane grouping. With the current one-lane
   fixture this is not visible, but a multi-lane run would not show lane labels
   or lane boundaries on the detail page.
3. **Mixed attached-history and current-unresolved instances collapse to the
   attached history in the session panel.** For `apply-fixes`, the fixture has
   a historical attached transcript and a current `not_started` instance. The
   session panel filters to attached instances before building iteration and
   attempt controls, so it shows the historical transcript but does not also
   surface the current not-started instance for that selected node.
4. **Execution-instance identity is internal-only.** The fixture carries
   `currentBeadId`, `visibleExecutionInstanceId`, execution instance ids, and
   bead ids. The current UI uses these for keys, selection, and transcript
   lookup, but does not expose them as inspectable/copyable operator metadata.
5. **Attempt summary is compact on graph nodes.** Bounded retry state is shown
   as a small node suffix such as `attempt 1/3`, and multi-attached attempts
   become session-panel radios. The graph does not yet expose the full
   `attemptSummary.active` state when the active/current instance has no
   attached session.

These are dashboard presentation gaps, not current gc supervisor API gaps. The
fixture already has the data needed to address them.

External constraints and future ownership:

- Formula detail/preview improves ordering, but the dashboard still carries a
  local TypeScript approximation of workflow presentation semantics that should
  eventually be owned by Gas City or shared with Gasworks.
- Runtime bead overlay is complete for city-store workflows, but rig-store
  workflows depend on the embedded snapshot because the current supervisor API
  lacks rig-store per-bead reads.
- Session resolution uses current session summaries plus unprefixed and `gc.*`
  bead metadata. It can still surface `session_unresolved` when no session
  identity exists on the bead and the assignee cannot be resolved, but that is
  data absence for that execution, not a missing API shape.

## Gas City And Shared Change Tracker

These are the changes outside this repository that would move the architecture
from dashboard-owned approximation to the target boundary:

1. **Canonical graph.v2 presentation package.** Gas City or a shared package
   should own semantic node ids, construct kinds, external display names,
   hidden-control collapsing, control badge targeting, loop/retry grouping,
   visible graph nodes, logical edges, scope groups, and compiled display order.
   The dashboard should consume that shape instead of deriving it from bead
   metadata in TypeScript.
2. **Scoped runtime bead reads or fresh scoped snapshots.** The supervisor
   should expose rig-store bead reads or guarantee that scoped workflow
   snapshots include current runtime status for non-city stores.
3. **OpenAPI schema alignment.** The supervisor OpenAPI schema should match
   observed payloads, especially nullable `Bead.priority`, so dashboard schema
   overlays can be removed.
4. **Optional canonical execution-instance fields.** Existing metadata is
   sufficient for the current detail page, but a canonical upstream/shared
   presentation shape could expose execution instance ids, semantic node ids,
   loop iteration, retry attempt, current/historical flags, and attached
   session identity directly so the dashboard no longer derives them.

Items that are not current supervisor API gaps after validating the Gasworks
implementation:

- Workflow/root identity for projection invalidation is available from
  top-level workflow data or bead metadata `gc.workflow_id`/`gc.root_bead_id`;
  events without identity still fall back to broad refresh.
- Session identity is available through `session_id`/`session_name` and
  `gc.session_id`/`gc.session_name`.
- Formula detail target selection can use root-bead `gc.run_target`,
  `gc.routed_to`, or assignee; no local formula-file parsing is required.
- Logical grouping, loop scope, retry attempts, and hidden-control targeting
  have usable metadata sources: `gc.logical_bead_id`, `gc.step_ref`,
  `gc.scope_ref`, `gc.control_for`, `gc.iteration`, `gc.attempt`, and
  `gc.max_attempts`.

Intentionally outside the current dashboard-owned implementation target:

- Incremental event application to the run projection. This is intentionally
  not a goal until the backend can own the event reducer.
- Durable analytics or metrics beyond the existing centralized client-error
  log.

## Ideal Target State

The ideal design keeps the same public concept but moves more ownership to
stable backend boundaries:

1. Supervisor client generation owns endpoint paths, params, and response
   shapes.
2. Runtime deserialization at `GcClient` rejects malformed supervisor payloads
   before workflow projection sees them.
3. Gas City or a shared presentation package owns graph.v2 display semantics:
   semantic nodes, logical edges, scope groups, display graph, loop/retry
   collapsing, and session-link hints.
4. The dashboard backend maps that canonical presentation data into
   `RunningFormulaRun`, adds dashboard-local evidence such as git diff and
   transcript streamability, then emits `WorkflowRunDetail`.
5. The detail page subscribes to city events only as refresh invalidation,
   coalesces refreshes, and always re-renders from a newly fetched
   `WorkflowRunDetail`.
6. Session transcript streaming remains separate from graph projection refresh,
   but selected-node session availability is refreshed by the detail projection
   when bead/session events arrive.

## Invariants

- `WorkflowRunDetail` is dashboard-owned. Do not expose raw supervisor workflow
  snapshots directly to React for run detail rendering.
- `RunningFormulaRun` is the single backend aggregation point for run-detail
  state.
- `WorkflowDisplayNode.id` is the semantic node id used by selection and graph
  rendering.
- `WorkflowDisplayNode.executionInstances` are the only place loop iterations
  and retry attempts should be exposed to the UI.
- `visibleInGraph === false` means a node can exist for transcript/history
  purposes but should not render in the left graph.
- A streamable session must be attached, running, and current, not historical.
- `WorkflowRunDetail.completeness.kind === "partial"` means the view is
  degraded and should say why.
- Diff state is evidence for the execution folder, not part of formula graph
  state.
- City SSE events invalidate cached views; they do not directly mutate
  `WorkflowRunDetail` in the browser.

## Architectural Risks

1. Presentation drift from Gasworks and Gas City.

   The local TypeScript projection is useful, but it is not the best permanent
   owner for graph.v2 semantics. Real formula examples and captured supervisor
   fixtures need to keep this honest until a canonical presentation layer is
   available.

2. Event freshness on the detail page.

   The detail page now refetches the whole projection when relevant city events
   arrive. This avoids stale graph status without inventing a browser-side
   reducer, but it still depends on the backend projection route being fast
   enough and on SSE delivery staying connected.

3. Session-link ambiguity.

   When beads do not carry stable session metadata, the dashboard falls back to
   assignee/name matching. That is inherently weaker than a supervisor-owned
   session id attached to each execution instance.

4. Rig-store freshness.

   Rig-store workflow details cannot currently refresh each bead independently
   through the city bead endpoint. The embedded workflow snapshot needs to be
   fresh enough or the supervisor needs an API for scoped runtime bead reads.

5. Supervisor schema drift.

   The current boundary uses generated OpenAPI types, `openapi-fetch`, and
   generated runtime schema validation for the supervisor payloads read through
   `GcClient`. The remaining drift risk is schema accuracy, such as the
   dashboard's explicit nullable `Bead.priority` overlay until the upstream
   OpenAPI schema matches observed supervisor output.

## Future Implementation Moves

1. Capture real graph.v2 supervisor snapshots for completed, running, blocked,
   retried, and looped runs; use them as backend enrichment fixtures.
2. Replace local graph.v2 presentation derivation with the canonical Gas City or
   shared package once available.
3. Remove the generated-schema `Bead.priority` nullable overlay once the
   upstream supervisor OpenAPI schema matches the observed wire shape.
