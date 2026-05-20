import type { GcBead, GcMailItem, GcSession } from 'gas-city-dashboard-shared';

// Per-source project derivation. There is no explicit project field
// on any of the three wire shapes, so we derive from observable
// conventions in the data:
//
// - Beads: ID is `<project>-<suffix>` where suffix is alnum, optionally
//   followed by `.N` (e.g. `gc-1920`, `codeprobe-4cl6.2`,
//   `code-intel-digest-mp5`). Strip the suffix to get the project.
//
// - Sessions: `rig` is a filesystem root path; basename = project.
//   We also fold case + underscores so /home/ds/projects/GEO and
//   bare `geo` group together, and scix_experiments meets
//   scix-experiments. The display label keeps the most-frequent
//   original form (the bucketer in useListFilters picks the winner).
//   Cross-rig orchestration sessions (mayor, the global control
//   dispatcher, chief-of-staff) have an empty rig and a known
//   template; they get lifted into a pinned 'Orchestration' bucket
//   so they don't fall through to (no rig).
//
// - Mail: `rig` is already a project name (e.g. "ds-research"); use
//   directly. When absent, fall back to "(no rig)".

const BEAD_ID_RX = /^(.+?)-[a-z0-9]+(?:\.\d+)?$/i;

export function beadProject(bead: GcBead): string {
  const m = BEAD_ID_RX.exec(bead.id);
  return m?.[1] ?? bead.id;
}

export const ORCHESTRATION_PROJECT = 'Orchestration';

// Templates whose sessions are cross-rig orchestration (no specific
// rig). Per-rig dispatchers (alias '<rig>/control-dispatcher') are
// NOT in this set — they belong to their rig and are styled inline.
const ORCHESTRATION_TEMPLATES: ReadonlySet<string> = new Set([
  'mayor',
  'control-dispatcher',
  'oversight-rig.chief-of-staff',
]);

export function isOrchestrationSession(s: GcSession): boolean {
  if (s.rig && s.rig.length > 0) return false;
  return !!s.template && ORCHESTRATION_TEMPLATES.has(s.template);
}

// A session is a per-rig dispatcher when it's scoped to a rig but
// performs the dispatcher role. Used to italicize the alias cell so
// the operator can spot orchestration even inside rig groups.
const PER_RIG_DISPATCHER_RX = /\/control-dispatcher$/;

export function isPerRigDispatcher(s: GcSession): boolean {
  if (!s.rig || s.rig.length === 0) return false;
  return PER_RIG_DISPATCHER_RX.test(s.alias ?? '');
}

function normalizeRigKey(name: string): string {
  return name.toLowerCase().replace(/_/g, '-');
}

export interface ProjectBucket {
  /** Stable identity used for grouping + collapse state. */
  key: string;
  /** Display label rendered in the group header. */
  label: string;
}

export function sessionProject(session: GcSession): ProjectBucket {
  if (isOrchestrationSession(session)) {
    return { key: ORCHESTRATION_PROJECT, label: ORCHESTRATION_PROJECT };
  }
  const candidate = session.rig ?? session.pool ?? session.template;
  if (!candidate) {
    return { key: '(no rig)', label: '(no rig)' };
  }
  // basename — handle both '/' and '\' for cross-platform safety.
  const parts = candidate.split(/[\\/]/).filter(Boolean);
  const basename = parts[parts.length - 1] ?? candidate;
  return { key: normalizeRigKey(basename), label: basename };
}

export function mailProject(mail: GcMailItem): string {
  if (mail.rig && mail.rig.length > 0) return mail.rig;
  return '(no rig)';
}
