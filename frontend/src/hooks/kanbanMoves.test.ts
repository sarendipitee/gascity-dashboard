import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { KanbanCard, KanbanColumn, KanbanResponse } from 'gas-city-dashboard-shared';
import {
  detectMoves,
  RECENT_MOVES_CAP,
  RECENT_MOVES_TTL_MS,
  RING_HIGHLIGHT_MS,
  useKanbanMoves,
} from './kanbanMoves';

const AT = Date.parse('2026-05-20T12:00:00.000Z');

function card(id: string, opts: Partial<KanbanCard> = {}): KanbanCard {
  return {
    id,
    title: opts.title ?? `Title for ${id}`,
    assignee: opts.assignee ?? '',
    last_active: opts.last_active ?? null,
    open_blocker_count: opts.open_blocker_count ?? 0,
    priority: opts.priority ?? 2,
  };
}

function emptyColumns(): Record<KanbanColumn, KanbanCard[]> {
  return {
    mayor_plate: [],
    in_flight: [],
    stalled: [],
    blocked_real: [],
    blocked_stale: [],
    in_review: [],
    needs_changes: [],
    approved: [],
    closed_24h: [],
  };
}

function snapshot(
  placements: Partial<Record<KanbanColumn, KanbanCard[]>>,
): KanbanResponse {
  const columns = emptyColumns();
  for (const [col, cards] of Object.entries(placements)) {
    columns[col as KanbanColumn] = cards ?? [];
  }
  const total = Object.values(columns).reduce((n, cs) => n + cs.length, 0);
  return {
    as_of: new Date(AT).toISOString(),
    columns,
    total,
  };
}

describe('detectMoves', () => {
  it('returns [] when prev is null (initial load)', () => {
    const next = snapshot({ in_flight: [card('bead-1')] });
    expect(detectMoves(null, next, AT)).toEqual([]);
  });

  it('returns [] when snapshots are identical', () => {
    const a = snapshot({ in_flight: [card('bead-1')], mayor_plate: [card('bead-2')] });
    const b = snapshot({ in_flight: [card('bead-1')], mayor_plate: [card('bead-2')] });
    expect(detectMoves(a, b, AT)).toEqual([]);
  });

  it('detects a single column transition', () => {
    const prev = snapshot({ mayor_plate: [card('bead-1', { title: 'one' })] });
    const next = snapshot({ in_flight: [card('bead-1', { title: 'one' })] });
    const moves = detectMoves(prev, next, AT);
    expect(moves).toHaveLength(1);
    expect(moves[0]).toMatchObject({
      id: 'bead-1',
      from: 'mayor_plate',
      to: 'in_flight',
      title: 'one',
      at: AT,
    });
  });

  it('uses the new snapshot title (move record reflects current state)', () => {
    const prev = snapshot({ mayor_plate: [card('bead-1', { title: 'old' })] });
    const next = snapshot({ in_flight: [card('bead-1', { title: 'new' })] });
    const moves = detectMoves(prev, next, AT);
    expect(moves).toHaveLength(1);
    expect(moves[0]!.title).toBe('new');
  });

  it('does not emit a move when title changes but column is the same', () => {
    const prev = snapshot({ in_flight: [card('bead-1', { title: 'old' })] });
    const next = snapshot({ in_flight: [card('bead-1', { title: 'new' })] });
    expect(detectMoves(prev, next, AT)).toEqual([]);
  });

  it('does not synthesize a phantom move when a bead leaves the board entirely', () => {
    // bead-1 was in closed_24h, then aged out of the 24h window. No new
    // column hosts it. That is not a column transition the operator
    // cares about.
    const prev = snapshot({ closed_24h: [card('bead-1')] });
    const next = snapshot({});
    expect(detectMoves(prev, next, AT)).toEqual([]);
  });

  it('does not synthesize a phantom move for a newly-appeared bead', () => {
    // bead-2 wasn't on the previous board (just created). Not a move.
    const prev = snapshot({});
    const next = snapshot({ mayor_plate: [card('bead-2')] });
    expect(detectMoves(prev, next, AT)).toEqual([]);
  });

  it('detects multiple moves in one diff', () => {
    const prev = snapshot({
      mayor_plate: [card('bead-1')],
      in_flight: [card('bead-2')],
      in_review: [card('bead-3')],
    });
    const next = snapshot({
      in_flight: [card('bead-1')],
      stalled: [card('bead-2')],
      approved: [card('bead-3')],
    });
    const moves = detectMoves(prev, next, AT);
    expect(moves).toHaveLength(3);
    const byId = Object.fromEntries(moves.map((m) => [m.id, m]));
    expect(byId['bead-1']).toMatchObject({ from: 'mayor_plate', to: 'in_flight' });
    expect(byId['bead-2']).toMatchObject({ from: 'in_flight', to: 'stalled' });
    expect(byId['bead-3']).toMatchObject({ from: 'in_review', to: 'approved' });
  });

  it('attaches the supplied at timestamp to every emitted move', () => {
    const prev = snapshot({ mayor_plate: [card('bead-1')] });
    const next = snapshot({ in_flight: [card('bead-1')] });
    const moves = detectMoves(prev, next, 1_700_000_000_000);
    expect(moves).toHaveLength(1);
    expect(moves[0]!.at).toBe(1_700_000_000_000);
  });

  it('assigns a unique move id derived from bead id + at + to', () => {
    const prev = snapshot({ mayor_plate: [card('bead-1')] });
    const next = snapshot({ in_flight: [card('bead-1')] });
    const moves = detectMoves(prev, next, AT);
    expect(moves).toHaveLength(1);
    const move = moves[0]!;
    expect(typeof move.moveId).toBe('string');
    expect(move.moveId.length).toBeGreaterThan(0);
    expect(move.moveId).toContain('bead-1');
  });

  // Defense against a malformed gc supervisor snapshot. The classifier is
  // expected to place each bead in exactly one column, but if it ever
  // emits the same id in two columns we want a deterministic outcome
  // (first column wins) rather than map-insertion-order dependency.
  // The "first column" both tests below refer to is the first appearance in
  // `emptyColumns()` declaration order (in_flight before stalled). `indexById`
  // iterates `Object.entries(snapshot.columns)`, which preserves the literal's
  // insertion order under V8; if `emptyColumns()` is ever reordered, expected
  // `from`/`to` values below shift accordingly. The point of these tests is
  // determinism, not the specific column chosen.
  it('treats the first column as authoritative when the same id appears twice in next', () => {
    const prev = snapshot({ mayor_plate: [card('bead-1', { title: 'one' })] });
    // bead-1 appears in BOTH in_flight and stalled in the next snapshot.
    // `in_flight` comes first in emptyColumns() order, so first-wins should
    // report the move as mayor_plate -> in_flight.
    const next = snapshot({
      in_flight: [card('bead-1', { title: 'one' })],
      stalled: [card('bead-1', { title: 'one' })],
    });
    const moves = detectMoves(prev, next, AT);
    expect(moves).toHaveLength(1);
    expect(moves[0]).toMatchObject({
      id: 'bead-1',
      from: 'mayor_plate',
      to: 'in_flight',
    });
  });

  it('treats the first column as authoritative when the same id appears twice in prev', () => {
    // Symmetric case: malformed prev snapshot. First-wins keeps `from` stable
    // (anchored to emptyColumns() order) instead of depending on the order
    // V8 happened to iterate Object.entries.
    const prev = snapshot({
      in_flight: [card('bead-1', { title: 'one' })],
      stalled: [card('bead-1', { title: 'one' })],
    });
    const next = snapshot({ approved: [card('bead-1', { title: 'one' })] });
    const moves = detectMoves(prev, next, AT);
    expect(moves).toHaveLength(1);
    expect(moves[0]).toMatchObject({
      id: 'bead-1',
      from: 'in_flight',
      to: 'approved',
    });
  });
});

describe('useKanbanMoves', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(AT));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns empty moves and empty recentMoveIds on first render with null data', () => {
    const { result } = renderHook(() => useKanbanMoves(null));
    expect(result.current.moves).toEqual([]);
    expect(result.current.recentMoveIds.size).toBe(0);
  });

  it('seeds the prev ref on first non-null data without emitting moves', () => {
    const initial = snapshot({ mayor_plate: [card('bead-1')] });
    const { result } = renderHook(({ data }) => useKanbanMoves(data), {
      initialProps: { data: initial as KanbanResponse | null },
    });
    expect(result.current.moves).toEqual([]);
    expect(result.current.recentMoveIds.size).toBe(0);
  });

  it('emits a move and marks the id ring-flashed on a column transition', () => {
    const a = snapshot({ mayor_plate: [card('bead-1', { title: 'one' })] });
    const b = snapshot({ in_flight: [card('bead-1', { title: 'one' })] });
    const { result, rerender } = renderHook(({ data }) => useKanbanMoves(data), {
      initialProps: { data: a as KanbanResponse | null },
    });
    rerender({ data: b });
    expect(result.current.moves).toHaveLength(1);
    expect(result.current.moves[0]).toMatchObject({
      id: 'bead-1',
      from: 'mayor_plate',
      to: 'in_flight',
      title: 'one',
    });
    expect(result.current.recentMoveIds.has('bead-1')).toBe(true);
  });

  it('clears recentMoveIds for an id after RING_HIGHLIGHT_MS elapses', () => {
    const a = snapshot({ mayor_plate: [card('bead-1')] });
    const b = snapshot({ in_flight: [card('bead-1')] });
    const { result, rerender } = renderHook(({ data }) => useKanbanMoves(data), {
      initialProps: { data: a as KanbanResponse | null },
    });
    rerender({ data: b });
    expect(result.current.recentMoveIds.has('bead-1')).toBe(true);

    act(() => {
      vi.advanceTimersByTime(RING_HIGHLIGHT_MS);
    });
    expect(result.current.recentMoveIds.has('bead-1')).toBe(false);
    // The move entry itself remains in the log; only the ring drops off.
    expect(result.current.moves).toHaveLength(1);
  });

  it('resets the ring timer when the same id moves again before it expires', () => {
    const a = snapshot({ mayor_plate: [card('bead-1')] });
    const b = snapshot({ in_flight: [card('bead-1')] });
    const c = snapshot({ stalled: [card('bead-1')] });
    const { result, rerender } = renderHook(({ data }) => useKanbanMoves(data), {
      initialProps: { data: a as KanbanResponse | null },
    });
    rerender({ data: b });
    expect(result.current.recentMoveIds.has('bead-1')).toBe(true);

    // Halfway through the first ring window, the bead moves again. The
    // timer must reset, not fire half-early.
    act(() => {
      vi.advanceTimersByTime(RING_HIGHLIGHT_MS / 2);
    });
    act(() => {
      vi.setSystemTime(new Date(AT + RING_HIGHLIGHT_MS / 2));
      rerender({ data: c });
    });
    expect(result.current.recentMoveIds.has('bead-1')).toBe(true);

    // Advancing another half-window from the ORIGINAL move would have
    // expired the first timer. The reset means the ring is still active.
    act(() => {
      vi.advanceTimersByTime(RING_HIGHLIGHT_MS / 2);
    });
    expect(result.current.recentMoveIds.has('bead-1')).toBe(true);

    // Now advance the rest of the second timer's window. The ring drops.
    act(() => {
      vi.advanceTimersByTime(RING_HIGHLIGHT_MS / 2);
    });
    expect(result.current.recentMoveIds.has('bead-1')).toBe(false);
  });

  it('trims the moves log to RECENT_MOVES_CAP, newest first', () => {
    const total = RECENT_MOVES_CAP + 3;
    const ids = Array.from({ length: total }, (_, i) => `bead-${i}`);

    // Start with every bead in mayor_plate.
    const initial: KanbanResponse = snapshot({
      mayor_plate: ids.map((id) => card(id)),
    });
    const { result, rerender } = renderHook(({ data }) => useKanbanMoves(data), {
      initialProps: { data: initial as KanbanResponse | null },
    });

    // Move one bead per rerender so each transition is a single move.
    // Stay within the TTL window so the cap is what trims, not TTL.
    ids.forEach((_id, i) => {
      const next: KanbanResponse = snapshot({
        mayor_plate: ids.slice(i + 1).map((rest) => card(rest)),
        in_flight: ids.slice(0, i + 1).map((moved) => card(moved)),
      });
      act(() => {
        vi.setSystemTime(new Date(AT + (i + 1) * 1_000));
        rerender({ data: next });
      });
    });

    expect(result.current.moves).toHaveLength(RECENT_MOVES_CAP);
    // Newest first: the most recently moved id is at index 0.
    const newest = result.current.moves[0];
    expect(newest).toBeDefined();
    expect(newest!.id).toBe(ids[ids.length - 1]!);
    // Oldest moves (the first `total - CAP` ids) are gone.
    const presentIds = new Set(result.current.moves.map((m) => m.id));
    for (let i = 0; i < total - RECENT_MOVES_CAP; i++) {
      expect(presentIds.has(ids[i]!)).toBe(false);
    }
  });

  it('prunes moves older than RECENT_MOVES_TTL_MS when options.now advances past the cutoff', () => {
    const a = snapshot({ mayor_plate: [card('bead-1')] });
    const b = snapshot({ in_flight: [card('bead-1')] });
    const { result, rerender } = renderHook(
      ({ data, now }) => useKanbanMoves(data, { now }),
      { initialProps: { data: a as KanbanResponse | null, now: AT } },
    );
    rerender({ data: b, now: AT });
    expect(result.current.moves).toHaveLength(1);

    // options.now still inside the TTL window: nothing prunes.
    rerender({ data: b, now: AT + RECENT_MOVES_TTL_MS - 1 });
    expect(result.current.moves).toHaveLength(1);

    // options.now crosses past the TTL cutoff: the old entry is pruned.
    rerender({ data: b, now: AT + RECENT_MOVES_TTL_MS + 1 });
    expect(result.current.moves).toEqual([]);
  });

  it('returns the same moves array reference when TTL pruning is a no-op', () => {
    // Defends the `filtered.length === current.length` short-circuit. Without
    // it, every options.now tick would allocate a fresh array and force a
    // re-render in any consumer that compares by reference.
    const a = snapshot({ mayor_plate: [card('bead-1')] });
    const b = snapshot({ in_flight: [card('bead-1')] });
    const { result, rerender } = renderHook(
      ({ data, now }) => useKanbanMoves(data, { now }),
      { initialProps: { data: a as KanbanResponse | null, now: AT } },
    );
    rerender({ data: b, now: AT });
    const firstRef = result.current.moves;
    expect(firstRef).toHaveLength(1);

    rerender({ data: b, now: AT + 1_000 });
    expect(result.current.moves).toBe(firstRef);
  });

  it('prunes moves older than RECENT_MOVES_TTL_MS during the data-effect merge step', () => {
    // Defends the inline `merged.filter(...)` cutoff in useKanbanMoves' data
    // effect. The options.now path is tested above; this exercises the
    // separate path that fires when a NEW snapshot lands long enough after
    // a previous move that the previous move has aged out.
    const a = snapshot({ mayor_plate: [card('bead-1')] });
    const b = snapshot({ in_flight: [card('bead-1')] });
    const c = snapshot({
      in_flight: [card('bead-1')],
      mayor_plate: [card('bead-2')],
    });
    // Final snapshot: bead-1 stays put (no new move), bead-2 moves. The
    // expected pruning is of bead-1's *old* move (recorded at AT) when
    // the merge runs with cutoff = (AT + TTL + 2) - TTL = AT + 2.
    const d = snapshot({
      in_flight: [card('bead-1'), card('bead-2')],
    });

    const { result, rerender } = renderHook(({ data }) => useKanbanMoves(data), {
      initialProps: { data: a as KanbanResponse | null },
    });
    rerender({ data: b });
    expect(result.current.moves).toHaveLength(1);
    expect(result.current.moves[0]!.id).toBe('bead-1');

    // Seed bead-2 on the board so its later move is detectable. This is
    // not a move (new bead, no prior column).
    act(() => {
      vi.setSystemTime(new Date(AT + RECENT_MOVES_TTL_MS + 1));
      rerender({ data: c });
    });

    // Now move bead-2. bead-1's earlier move is well past the TTL cutoff
    // and must be pruned during the merge step.
    act(() => {
      vi.setSystemTime(new Date(AT + RECENT_MOVES_TTL_MS + 2));
      rerender({ data: d });
    });
    expect(result.current.moves).toHaveLength(1);
    expect(result.current.moves[0]!.id).toBe('bead-2');
  });

  it('clears pending ring timers on unmount', () => {
    // React 18 removed the "setState on unmounted component" warning, so a
    // console.error spy would not catch a leaked timer. Spy on clearTimeout
    // instead: the cleanup effect must call it for every ring timer the
    // hook started.
    const clearSpy = vi.spyOn(globalThis, 'clearTimeout');
    const a = snapshot({ mayor_plate: [card('bead-1')] });
    const b = snapshot({ in_flight: [card('bead-1')] });
    const { rerender, unmount } = renderHook(({ data }) => useKanbanMoves(data), {
      initialProps: { data: a as KanbanResponse | null },
    });
    rerender({ data: b });

    // Baseline: no clears from the ring map yet (the data-effect itself
    // doesn't clear unless a re-move replaces an existing timer).
    const beforeUnmount = clearSpy.mock.calls.length;
    unmount();
    // Unmount cleanup must clear at least the one timer set for bead-1.
    expect(clearSpy.mock.calls.length).toBeGreaterThan(beforeUnmount);

    clearSpy.mockRestore();
  });
});
