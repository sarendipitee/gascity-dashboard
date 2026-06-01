import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import type { GcStatus } from 'gas-city-dashboard-shared';
import {
  parseVersion,
  buildDiagnostics,
  type VersionProbe,
} from './health-diagnostics.js';

// gascity-dashboard-1cob: the diagnostics builder is pure — supervisor status
// and the two version probes are injected, so every branch is testable
// without spawning a process or touching a real supervisor.

describe('parseVersion', () => {
  test('extracts the semver from `dolt version` output', () => {
    assert.equal(parseVersion('dolt version 2.0.7\n'), '2.0.7');
  });

  test('extracts the semver from `bd version` output', () => {
    assert.equal(
      parseVersion('bd version 1.0.4 (ce242a879: HEAD@ce242a879678)\n'),
      '1.0.4',
    );
  });

  test('returns null when no version token is present', () => {
    assert.equal(parseVersion('command not found'), null);
  });

  test('returns null on empty output', () => {
    assert.equal(parseVersion(''), null);
  });
});

function okProbe(version: string): VersionProbe {
  return async () => ({ kind: 'ok', version });
}

function failProbe(reason: string): VersionProbe {
  return async () => ({ kind: 'error', reason });
}

const fullStatus: GcStatus = {
  version: '0.42.0',
  work: { open: 10, ready: 4, in_progress: 2 },
  store_health: {
    size_bytes: 1_000_000,
    live_rows: 2000,
    ratio_mb_per_row: 0.5,
    threshold_mb_per_row: 1.0,
    warning: false,
    last_gc_status: 'success',
    path: '/data/store',
  },
};

describe('buildDiagnostics', () => {
  test('surfaces dolt + beads versions from successful probes', async () => {
    const d = await buildDiagnostics({
      status: fullStatus,
      doltProbe: okProbe('2.0.7'),
      beadsProbe: okProbe('1.0.4'),
    });
    assert.deepEqual(d.doltVersion, {
      status: 'available',
      value: '2.0.7',
      source: 'local probe: dolt version',
    });
    assert.deepEqual(d.beadsVersion, {
      status: 'available',
      value: '1.0.4',
      source: 'local probe: bd version',
    });
  });

  test('surfaces probe failure as unavailable with the reason (no fabrication)', async () => {
    const d = await buildDiagnostics({
      status: fullStatus,
      doltProbe: failProbe('dolt not on PATH'),
      beadsProbe: okProbe('1.0.4'),
    });
    assert.equal(d.doltVersion.status, 'unavailable');
    assert.equal(
      d.doltVersion.status === 'unavailable' ? d.doltVersion.reason : '',
      'dolt not on PATH',
    );
  });

  test('translates store_health into dolt usage', async () => {
    const d = await buildDiagnostics({
      status: fullStatus,
      doltProbe: okProbe('2.0.7'),
      beadsProbe: okProbe('1.0.4'),
    });
    assert.equal(d.doltUsage.status, 'available');
    if (d.doltUsage.status === 'available') {
      assert.equal(d.doltUsage.value.size_bytes, 1_000_000);
      assert.equal(d.doltUsage.value.live_rows, 2000);
      assert.equal(d.doltUsage.value.threshold_mb_per_row, 1.0);
    }
  });

  test('carries last_gc_at and strips unknown passthrough wire keys from dolt usage', async () => {
    // store_health is Zod-decoded with passthrough(), so unknown keys ride
    // along on the wire object at runtime. The edge mapping must surface the
    // known last_gc_at field and drop unknown keys rather than forwarding them
    // into the client DTO (serialization-at-the-edges invariant).
    const status = {
      ...fullStatus,
      store_health: {
        ...fullStatus.store_health,
        last_gc_at: '2026-05-30T08:00:00Z',
        unexpected_wire_key: 'leak',
      },
    } as unknown as GcStatus;
    const d = await buildDiagnostics({
      status,
      doltProbe: okProbe('2.0.7'),
      beadsProbe: okProbe('1.0.4'),
    });
    assert.equal(d.doltUsage.status, 'available');
    if (d.doltUsage.status === 'available') {
      assert.equal(d.doltUsage.value.last_gc_at, '2026-05-30T08:00:00Z');
      assert.ok(
        !Object.prototype.hasOwnProperty.call(d.doltUsage.value, 'unexpected_wire_key'),
        'unknown passthrough key must not leak into the DTO',
      );
    }
  });

  test('translates work counts into beads usage', async () => {
    const d = await buildDiagnostics({
      status: fullStatus,
      doltProbe: okProbe('2.0.7'),
      beadsProbe: okProbe('1.0.4'),
    });
    assert.deepEqual(
      d.beadsUsage.status === 'available' ? d.beadsUsage.value : null,
      { open: 10, ready: 4, in_progress: 2 },
    );
  });

  test('builds a recommended-vs-loaded row from the dolt maintenance threshold', async () => {
    const d = await buildDiagnostics({
      status: fullStatus,
      doltProbe: okProbe('2.0.7'),
      beadsProbe: okProbe('1.0.4'),
    });
    assert.equal(d.configComparison.status, 'available');
    if (d.configComparison.status === 'available') {
      const row = d.configComparison.value.find((r) =>
        r.label.toLowerCase().includes('ratio'),
      );
      assert.ok(row, 'expected a Dolt ratio comparison row');
      assert.equal(row?.withinRecommendation, true);
    }
  });

  test('flags an over-threshold ratio as not within recommendation', async () => {
    const overStatus: GcStatus = {
      ...fullStatus,
      store_health: {
        size_bytes: 5_000_000,
        ratio_mb_per_row: 2.5,
        threshold_mb_per_row: 1.0,
        warning: true,
      },
    };
    const d = await buildDiagnostics({
      status: overStatus,
      doltProbe: okProbe('2.0.7'),
      beadsProbe: okProbe('1.0.4'),
    });
    assert.equal(d.configComparison.status, 'available');
    if (d.configComparison.status === 'available') {
      const row = d.configComparison.value.find((r) =>
        r.label.toLowerCase().includes('ratio'),
      );
      assert.equal(row?.withinRecommendation, false);
    }
  });

  test('marks usage + comparison unavailable when store_health is absent', async () => {
    const d = await buildDiagnostics({
      status: { version: '0.42.0' },
      doltProbe: okProbe('2.0.7'),
      beadsProbe: okProbe('1.0.4'),
    });
    assert.equal(d.doltUsage.status, 'unavailable');
    assert.equal(d.configComparison.status, 'unavailable');
  });

  test('marks beads usage unavailable when status.work is absent', async () => {
    const d = await buildDiagnostics({
      status: { store_health: { size_bytes: 1 } },
      doltProbe: okProbe('2.0.7'),
      beadsProbe: okProbe('1.0.4'),
    });
    assert.equal(d.beadsUsage.status, 'unavailable');
  });

  test('marks everything supervisor-sourced unavailable when status is null (supervisor offline)', async () => {
    const d = await buildDiagnostics({
      status: null,
      doltProbe: okProbe('2.0.7'),
      beadsProbe: okProbe('1.0.4'),
    });
    assert.equal(d.doltUsage.status, 'unavailable');
    assert.equal(d.beadsUsage.status, 'unavailable');
    assert.equal(d.configComparison.status, 'unavailable');
    // Local probes are independent of supervisor reachability.
    assert.equal(d.doltVersion.status, 'available');
  });

  test('omits the ratio comparison row when the supervisor reports no threshold', async () => {
    const d = await buildDiagnostics({
      status: {
        store_health: { size_bytes: 1, ratio_mb_per_row: 0.5 },
        work: { open: 1, ready: 1, in_progress: 1 },
      },
      doltProbe: okProbe('2.0.7'),
      beadsProbe: okProbe('1.0.4'),
    });
    // No threshold => no recommended baseline => unavailable, not a fake row.
    assert.equal(d.configComparison.status, 'unavailable');
  });
});
