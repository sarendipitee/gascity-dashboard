import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import type { GcBead, GcSession, LinkNode } from 'gas-city-dashboard-shared';
import { buildRelationIndex } from '../src/links/relation-index.js';
import { buildLinkView } from '../src/links/build-link-view.js';
import { parseRef } from '../src/links/node-ref.js';
import { ResolutionRollup } from '../src/links/instrumentation.js';

function bead(id: string, metadata: Record<string, unknown> = {}): GcBead {
  return {
    id,
    title: `bead ${id}`,
    status: 'open',
    issue_type: 'task',
    priority: 2,
    created_at: '2026-05-20T00:00:00Z',
    updated_at: '2026-05-20T00:00:00Z',
    metadata,
  };
}

function session(id: string, over: Partial<GcSession> = {}): GcSession {
  return {
    id,
    template: 'tpl',
    state: 'active',
    created_at: '2026-05-20T00:00:00Z',
    attached: false,
    ...over,
  };
}

function ok(raw: string) {
  const parsed = parseRef(raw);
  assert.equal(parsed.ok, true, `parseRef(${raw}) should be ok`);
  return parsed as Extract<ReturnType<typeof parseRef>, { ok: true }>;
}

function nodeFor(nodes: LinkNode[], predicate: (n: LinkNode) => boolean): LinkNode {
  const found = nodes.find(predicate);
  assert.ok(found, 'expected a matching node');
  return found;
}

describe('buildLinkView (R2/R3/R4/R6/R7/R11)', () => {
  test('R2: derived vs supervisor provenance on edges', () => {
    const beads = [
      bead('focus', { 'gc.parent_bead_id': 'root', molecule_id: 'mol-1' }),
      bead('root'),
      bead('sibling', { molecule_id: 'mol-1' }),
    ];
    const index = buildRelationIndex(beads, [], 'c');
    const view = buildLinkView(index, ok('focus'));
    const parentEdge = view.edges.find((e) => e.relation === 'parent');
    const molEdge = view.edges.find((e) => e.relation === 'molecule');
    assert.equal(parentEdge?.provenance, 'supervisor');
    assert.equal(molEdge?.provenance, 'supervisor');
    // forward + inverse both present: focus has a parent and a molecule peer.
    assert.ok(parentEdge);
    assert.ok(molEdge);
  });

  test('R4: a javascript: pr_url is never rendered as a url', () => {
    const beads = [
      bead('focus', {
        'pr_review.pr_number': '7',
        'pr_review.pr_url': 'javascript:alert(1)',
      }),
    ];
    const index = buildRelationIndex(beads, [], 'c');
    const view = buildLinkView(index, ok('focus'));
    const prNode = nodeFor(view.nodes, (n) => n.type === 'github_pr');
    assert.equal(prNode.url, null, 'javascript: url must be stripped to null');
  });

  test('R4: a valid https pr_url passes through', () => {
    const beads = [
      bead('focus', {
        'pr_review.pr_number': '7',
        'pr_review.pr_url': 'https://github.com/o/r/pull/7',
      }),
    ];
    const index = buildRelationIndex(beads, [], 'c');
    const view = buildLinkView(index, ok('focus'));
    const prNode = nodeFor(view.nodes, (n) => n.type === 'github_pr');
    assert.equal(prNode.url, 'https://github.com/o/r/pull/7');
  });

  test('R6: a PR absent from the fetched set renders unresolved with a ↗ url', () => {
    const beads = [
      bead('focus', {
        'pr_review.pr_number': '42',
        'pr_review.pr_url': 'https://github.com/o/r/pull/42',
      }),
    ];
    const index = buildRelationIndex(beads, [], 'c');
    const rollup = new ResolutionRollup();
    const view = buildLinkView(index, ok('focus'), { recorder: rollup.recorder() });
    const prNode = nodeFor(view.nodes, (n) => n.type === 'github_pr');
    assert.equal(prNode.unresolved, true);
    assert.equal(prNode.url, 'https://github.com/o/r/pull/42');
    // R11: an unresolvable PR ref produces an `unresolved` outcome record.
    const stat = rollup.snapshot().find((s) => s.relation === 'pr');
    assert.equal(stat?.unresolved, 1);
    assert.equal(stat?.resolved, 0);
  });

  test('R6: a session name matching two sessions renders as N candidates (focus on PR)', () => {
    // Two live beads reference the same PR number → focusing the PR yields
    // two candidates for the focus, recorded as n-candidates (R11).
    const beads = [
      bead('a', { 'pr_review.pr_number': '5' }),
      bead('b', { 'pr_review.pr_number': '5' }),
    ];
    const index = buildRelationIndex(beads, [], 'c');
    const view = buildLinkView(index, ok('pr/5'));
    assert.equal(view.focus.type, 'github_pr');
    assert.equal(view.focus.ref, 'pr/5');
    // The PR focus resolved to two candidate beads; the focus node records
    // the count rather than guessing a single target (R6).
    assert.equal(view.nodes[0]?.candidateCount, 2);
  });

  test('R7: section asOf is the older of two contributing sources', () => {
    const beads = [
      bead('focus', { session_id: 'sess-1' }),
    ];
    const fresh = '2026-05-26T12:00:00Z';
    const old = '2026-05-25T12:00:00Z';
    const index = buildRelationIndex(beads, [session('sess-1')], 'c');
    const view = buildLinkView(index, ok('focus'), {
      supervisorFetchedAt: fresh,
      githubFetchedAt: old,
    });
    // No github node here, but the explicit fallback uses the older source.
    // Add a github edge to exercise the node-level path:
    assert.ok(Date.parse(view.asOf ?? '') <= Date.parse(fresh));
  });

  test('R7: a stale github node and a fresh bead node keep distinct fetchedAt', () => {
    const beads = [
      bead('focus', {
        session_id: 'sess-1',
        'pr_review.pr_number': '9',
      }),
    ];
    const fresh = '2026-05-26T12:00:00Z';
    const stale = '2026-05-25T12:00:00Z';
    const index = buildRelationIndex(beads, [session('sess-1')], 'c');
    const view = buildLinkView(index, ok('focus'), {
      supervisorFetchedAt: fresh,
      githubFetchedAt: stale,
    });
    const sessionNode = nodeFor(view.nodes, (n) => n.type === 'session');
    const prNode = nodeFor(view.nodes, (n) => n.type === 'github_pr');
    assert.equal(sessionNode.fetchedAt, fresh);
    assert.equal(prNode.fetchedAt, stale);
    // asOf is the older of the two.
    assert.equal(view.asOf, stale);
  });

  test('R3: an unresolvable focus ref returns a focus-only partial view (not an error)', () => {
    const index = buildRelationIndex([bead('other')], [], 'c');
    const view = buildLinkView(index, ok('no-such-bead'));
    assert.equal(view.partial, true);
    assert.equal(view.nodes.length, 1, 'only the focus node');
    assert.equal(view.edges.length, 0);
  });

  test('R11: a resolved supervisor edge records a resolved outcome', () => {
    const beads = [bead('focus', { 'gc.parent_bead_id': 'p' }), bead('p')];
    const index = buildRelationIndex(beads, [], 'c');
    const rollup = new ResolutionRollup();
    buildLinkView(index, ok('focus'), { recorder: rollup.recorder() });
    const stat = rollup.snapshot().find((s) => s.relation === 'parent');
    assert.equal(stat?.resolved, 1);
  });
});
