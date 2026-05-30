import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import type {
  GcBead,
  GcWorkflowBead,
  GcWorkflowSnapshot,
} from 'gas-city-dashboard-shared';
import { mergeWorkflowRuntimeState } from '../src/workflows/runtime-state.js';

describe('workflow runtime state overlay', () => {
  test('preserves gc-prefixed session metadata from live bead reads', () => {
    const merged = mergeWorkflowRuntimeState(
      workflowSnapshot([
        workflowBead({
          id: 'node',
          metadata: {
            session_id: 'stale-session',
            session_name: 'stale-session-name',
          },
        }),
      ]),
      [
        runtimeBead({
          id: 'node',
          metadata: {
            'gc.session_id': 'gc-live-session',
            'gc.session_name': 'gc-live-session-name',
          },
        }),
      ],
    );

    assert.equal(merged.beads?.[0]?.metadata['gc.session_id'], 'gc-live-session');
    assert.equal(merged.beads?.[0]?.metadata['gc.session_name'], 'gc-live-session-name');
  });
});

function workflowSnapshot(beads: GcWorkflowBead[]): GcWorkflowSnapshot {
  return {
    workflow_id: 'workflow-1',
    root_bead_id: 'root',
    root_store_ref: 'city:test',
    resolved_root_store: 'city:test',
    scope_kind: 'city',
    scope_ref: 'test',
    snapshot_version: 1,
    snapshot_event_seq: 1,
    partial: false,
    stores_scanned: ['city:test'],
    beads,
    deps: [],
    logical_nodes: [],
    logical_edges: [],
    scope_groups: [],
  };
}

function workflowBead(overrides: Partial<GcWorkflowBead>): GcWorkflowBead {
  return {
    id: 'node',
    title: 'Node',
    status: 'ready',
    kind: 'task',
    metadata: {},
    ...overrides,
  };
}

function runtimeBead(overrides: Partial<GcBead>): GcBead {
  return {
    id: 'node',
    title: 'Node',
    status: 'in_progress',
    issue_type: 'task',
    priority: null,
    created_at: '2026-01-01T00:00:00.000Z',
    metadata: {},
    ...overrides,
  };
}
