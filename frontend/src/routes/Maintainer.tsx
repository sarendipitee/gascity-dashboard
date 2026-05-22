import type {
  ContributorStat,
  ContributorTier,
  MaintainerTriage,
  TriageCluster,
  TriageItem,
  TriageItemStatus,
  TriageTier,
  TriageTierSection,
} from 'gas-city-dashboard-shared';
import { PageHeader } from '../components/PageHeader';

// Triage route — read-only maintainer surface for gastownhall/gascity.
// This bead (gascity-dashboard-hq2) ships the editorial-typographic
// shell only: tier headings, cluster sub-headings, row layout, the
// One Mark accent, the contributor byline. Live data wiring lands in
// gascity-dashboard-361 (gh ingest); enrichment in 7ts/gtr/alh/98h.

export function MaintainerPage() {
  const data = MOCK_TRIAGE;
  return (
    <section>
      <PageHeader
        title="Triage"
        synopsis={buildSynopsis(data)}
        meta={
          <span className="text-fg-muted tnum">{formatDate(new Date())}</span>
        }
      />

      <div className="space-y-14">
        {data.tiers.map((tier) => (
          <TierSection key={tier.tier} section={tier} />
        ))}
      </div>

      <Footer computedAt={data.computed_at} />
    </section>
  );
}

function TierSection({ section }: { section: TriageTierSection }) {
  const itemCount =
    section.clusters.reduce((n, c) => n + c.items.length, 0) +
    section.unclustered.length;

  return (
    <section>
      <header className="flex items-baseline justify-between gap-4 mb-6 pb-2 border-b border-rule">
        <h2
          className={
            section.tier === 'regression_breaking'
              ? 'text-headline font-semibold uppercase tracking-wide text-fg'
              : 'text-headline font-semibold uppercase tracking-wide text-fg-muted'
          }
        >
          {tierLabel(section.tier)}
        </h2>
        <span className="text-label uppercase tracking-wider text-fg-muted tnum">
          {itemCount} {itemCount === 1 ? 'item' : 'items'}
        </span>
      </header>

      {section.clusters.length === 0 && section.unclustered.length === 0 ? (
        <p className="text-body text-fg-faint italic">No items in this tier.</p>
      ) : (
        <div className="space-y-10">
          {section.clusters.map((cluster) => (
            <ClusterBlock key={cluster.cluster_id} cluster={cluster} />
          ))}

          {section.unclustered.length > 0 && (
            <div className="space-y-2">
              <div className="text-title font-medium text-fg-muted">
                Unclustered
              </div>
              <div>
                {section.unclustered.map((item) => (
                  <TriageRow key={rowKey(item)} item={item} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

function ClusterBlock({ cluster }: { cluster: TriageCluster }) {
  const issues = cluster.items.filter((i) => i.kind === 'issue').length;
  const prs = cluster.items.filter((i) => i.kind === 'pr').length;
  const totals: string[] = [];
  if (issues > 0) totals.push(`${issues} ${issues === 1 ? 'issue' : 'issues'}`);
  if (prs > 0) totals.push(`${prs} ${prs === 1 ? 'PR' : 'PRs'}`);
  if (cluster.lines_pending > 0) totals.push(`${cluster.lines_pending} lines pending`);

  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between gap-4">
        <div className="text-title font-medium text-fg min-w-0 truncate">
          {cluster.files.join(', ')}
        </div>
        <div className="text-body text-fg-muted tnum shrink-0">
          {totals.join(' · ')}
        </div>
      </div>
      <div>
        {cluster.items.map((item) => (
          <TriageRow key={rowKey(item)} item={item} />
        ))}
      </div>
    </div>
  );
}

function TriageRow({ item }: { item: TriageItem }) {
  if (item.kind === 'pr') return <PrRow item={item} />;
  return <IssueRow item={item} />;
}

function IssueRow({ item }: { item: TriageItem }) {
  const isAnchored = item.linked_numbers.length > 0;
  return (
    <div className="grid grid-cols-[1.25em_1fr_auto] items-baseline gap-x-3 py-1.5">
      <span aria-hidden className="text-accent text-[0.85em] leading-none translate-y-[1px]">
        {item.is_marked ? '●' : ''}
      </span>
      <div className="min-w-0">
        <span className="text-body text-fg">{item.title}</span>
        {item.weak_ties.length > 0 && (
          <span className="ml-3 text-body text-fg-faint">
            also in: {item.weak_ties.map((t) => `${t.label} (${t.count})`).join(', ')}
          </span>
        )}
        {isAnchored && (
          <span className="ml-3 text-label uppercase tracking-wider text-fg-faint">
            anchored
          </span>
        )}
      </div>
      <RowMeta item={item} />
    </div>
  );
}

function PrRow({ item }: { item: TriageItem }) {
  return (
    <div className="grid grid-cols-[1.25em_1fr_auto] items-baseline gap-x-3 py-1 pl-6">
      <span aria-hidden />
      <div className="min-w-0">
        <span className="text-body text-fg-muted">
          PR #{item.number}  <span className="text-fg">{item.title}</span>
        </span>
      </div>
      <PrMeta item={item} />
    </div>
  );
}

function RowMeta({ item }: { item: TriageItem }) {
  return (
    <div className="flex items-baseline gap-3 text-body text-fg-muted shrink-0 tnum">
      <a
        href={item.html_url}
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-fg focus-mark"
      >
        #{item.number}
      </a>
      <span aria-hidden>·</span>
      <ContributorByline author={item.author} />
      <span aria-hidden>·</span>
      <span>{formatAge(item.updated_at)}</span>
    </div>
  );
}

function PrMeta({ item }: { item: TriageItem }) {
  return (
    <div className="flex items-baseline gap-3 text-body text-fg-muted shrink-0 tnum">
      <PrStatus status={item.status} />
      <span aria-hidden>·</span>
      <a
        href={item.html_url}
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-fg focus-mark"
      >
        open ↗
      </a>
    </div>
  );
}

function PrStatus({ status }: { status: TriageItemStatus }) {
  const label = statusLabel(status);
  const className =
    status === 'approved'
      ? 'text-ok'
      : status === 'changes_requested'
        ? 'text-accent'
        : status === 'needs_review'
          ? 'text-warn'
          : 'text-fg-muted';
  return <span className={className}>{label}</span>;
}

function ContributorByline({ author }: { author: ContributorStat }) {
  const ratesAvailable =
    author.issues_accepted !== null &&
    author.issues_opened !== null &&
    author.prs_merged !== null &&
    author.prs_opened !== null;

  const ratesTitle = ratesAvailable
    ? `${author.issues_accepted}/${author.issues_opened} issues accepted · ${author.prs_merged}/${author.prs_opened} PRs merged`
    : 'rates not yet computed';

  return (
    <span title={ratesTitle} className="whitespace-nowrap">
      {author.login}{' '}
      <span className={tierClass(author.tier)}>{tierLabel2(author.tier)}</span>
    </span>
  );
}

function Footer({ computedAt }: { computedAt: string | null }) {
  if (computedAt === null) {
    return (
      <p className="mt-16 text-label uppercase tracking-wider text-fg-faint">
        enrichment not yet computed · status data is live
      </p>
    );
  }
  return (
    <p className="mt-16 text-label uppercase tracking-wider text-fg-faint tnum">
      clusters computed {formatTimestamp(computedAt)} · {formatRelative(computedAt)} ago
    </p>
  );
}

// ── derivation helpers ───────────────────────────────────────────────

function rowKey(item: TriageItem): string {
  return `${item.kind}-${item.number}`;
}

function tierLabel(tier: TriageTier): string {
  if (tier === 'regression_breaking') return 'Regression + breaking';
  if (tier === 'regression') return 'Regression';
  return 'Stability';
}

function tierLabel2(tier: ContributorTier): string {
  if (tier === 'spam_risk') return 'spam risk';
  return tier;
}

function tierClass(tier: ContributorTier): string {
  if (tier === 'core') return 'text-fg font-medium';
  if (tier === 'trusted') return 'text-fg';
  if (tier === 'regular') return 'text-fg-muted';
  if (tier === 'new') return 'text-fg-muted italic';
  return 'text-accent';
}

function statusLabel(status: TriageItemStatus): string {
  if (status === 'needs_review') return 'needs review';
  if (status === 'changes_requested') return 'changes requested';
  return status;
}

function buildSynopsis(data: MaintainerTriage): string {
  const breaking = data.tiers.find((t) => t.tier === 'regression_breaking');
  const breakingCount = breaking
    ? breaking.clusters.reduce((n, c) => n + c.items.length, 0) +
      breaking.unclustered.length
    : 0;
  if (breakingCount > 0) {
    return `${breakingCount} item${breakingCount === 1 ? '' : 's'} in regression+breaking. ${data.totals.issues_open} issues, ${data.totals.prs_open} PRs open across ${data.repo}.`;
  }
  return `Nothing breaking. ${data.totals.issues_open} issues, ${data.totals.prs_open} PRs open across ${data.repo}.`;
}

function formatDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function formatTimestamp(iso: string): string {
  const d = new Date(iso);
  return `${formatDate(d)} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function formatRelative(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const hours = Math.round(ms / 3_600_000);
  if (hours < 1) return `${Math.max(1, Math.round(ms / 60_000))}m`;
  if (hours < 48) return `${hours}h`;
  return `${Math.round(hours / 24)}d`;
}

function formatAge(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const mins = Math.round(ms / 60_000);
  if (mins < 60) return `${mins}m`;
  const hours = Math.round(mins / 60);
  if (hours < 48) return `${hours}h`;
  return `${Math.round(hours / 24)}d`;
}

// ── scaffold mock data (gascity-dashboard-361 replaces with api.maintainerTriage()) ─

const NOW = Date.now();
function isoMinusHours(h: number): string {
  return new Date(NOW - h * 3_600_000).toISOString();
}

function makeAuthor(
  login: string,
  tier: ContributorTier,
  rates: { issuesAccepted: number; issuesOpened: number; prsMerged: number; prsOpened: number } | null,
): ContributorStat {
  return {
    login,
    tier,
    issues_accepted: rates?.issuesAccepted ?? null,
    issues_opened: rates?.issuesOpened ?? null,
    prs_merged: rates?.prsMerged ?? null,
    prs_opened: rates?.prsOpened ?? null,
    computed_at: rates ? isoMinusHours(20) : null,
  };
}

const ALICE = makeAuthor('alice', 'trusted', { issuesAccepted: 5, issuesOpened: 7, prsMerged: 12, prsOpened: 13 });
const BOB = makeAuthor('bob', 'new', { issuesAccepted: 2, issuesOpened: 14, prsMerged: 0, prsOpened: 0 });
const CAROL = makeAuthor('carol', 'core', { issuesAccepted: 12, issuesOpened: 12, prsMerged: 8, prsOpened: 8 });
const DAVE = makeAuthor('dave', 'new', { issuesAccepted: 0, issuesOpened: 3, prsMerged: 0, prsOpened: 0 });
const EVE = makeAuthor('eve', 'regular', { issuesAccepted: 1, issuesOpened: 1, prsMerged: 0, prsOpened: 0 });

const MOCK_TRIAGE: MaintainerTriage = {
  computed_at: isoMinusHours(19),
  repo: 'gastownhall/gascity',
  totals: { issues_open: 41, prs_open: 8 },
  tiers: [
    {
      tier: 'regression_breaking',
      clusters: [
        {
          cluster_id: 'exec-server',
          files: ['internal/exec/exec.go', 'internal/server/server.go'],
          lines_pending: 142,
          items: [
            {
              kind: 'issue', number: 1247,
              title: 'exec hangs after SIGHUP during reload',
              status: 'open', author: ALICE,
              created_at: isoMinusHours(3), updated_at: isoMinusHours(2),
              tier: 'regression_breaking', cluster_id: 'exec-server',
              blast_files: ['internal/exec/exec.go'],
              lines_changed: null,
              weak_ties: [{ label: 'signal-handling', count: 4 }],
              linked_numbers: [523],
              html_url: 'https://github.com/gastownhall/gascity/issues/1247',
              is_marked: true,
            },
            {
              kind: 'issue', number: 1198,
              title: 'panic on reload during exec',
              status: 'open', author: BOB,
              created_at: isoMinusHours(170), updated_at: isoMinusHours(144),
              tier: 'regression_breaking', cluster_id: 'exec-server',
              blast_files: ['internal/exec/exec.go'],
              lines_changed: null,
              weak_ties: [],
              linked_numbers: [],
              html_url: 'https://github.com/gastownhall/gascity/issues/1198',
              is_marked: false,
            },
            {
              kind: 'pr', number: 523,
              title: 'exec: drain channel before SIGHUP rebind',
              status: 'needs_review', author: ALICE,
              created_at: isoMinusHours(8), updated_at: isoMinusHours(2),
              tier: 'regression_breaking', cluster_id: 'exec-server',
              blast_files: ['internal/exec/exec.go', 'internal/server/server.go'],
              lines_changed: 95,
              weak_ties: [],
              linked_numbers: [1247],
              html_url: 'https://github.com/gastownhall/gascity/pull/523',
              is_marked: false,
            },
            {
              kind: 'issue', number: 1142,
              title: 'batch slots dropped during scheduler reload',
              status: 'open', author: ALICE,
              created_at: isoMinusHours(36), updated_at: isoMinusHours(28),
              tier: 'regression_breaking', cluster_id: 'exec-server',
              blast_files: ['internal/server/server.go'],
              lines_changed: null,
              weak_ties: [{ label: 'scheduler', count: 3 }],
              linked_numbers: [519],
              html_url: 'https://github.com/gastownhall/gascity/issues/1142',
              is_marked: false,
            },
            {
              kind: 'pr', number: 519,
              title: 'server: preserve in-flight batch slots across reload',
              status: 'draft', author: ALICE,
              created_at: isoMinusHours(24), updated_at: isoMinusHours(24),
              tier: 'regression_breaking', cluster_id: 'exec-server',
              blast_files: ['internal/server/server.go'],
              lines_changed: 47,
              weak_ties: [],
              linked_numbers: [1142],
              html_url: 'https://github.com/gastownhall/gascity/pull/519',
              is_marked: false,
            },
          ],
        },
        {
          cluster_id: 'scheduler',
          files: ['internal/scheduler/scheduler.go'],
          lines_pending: 47,
          items: [
            {
              kind: 'issue', number: 1201,
              title: 'weekend batch scheduler delay',
              status: 'open', author: CAROL,
              created_at: isoMinusHours(5), updated_at: isoMinusHours(4),
              tier: 'regression_breaking', cluster_id: 'scheduler',
              blast_files: ['internal/scheduler/scheduler.go'],
              lines_changed: null,
              weak_ties: [{ label: 'cron-windows', count: 2 }],
              linked_numbers: [517],
              html_url: 'https://github.com/gastownhall/gascity/issues/1201',
              is_marked: false,
            },
            {
              kind: 'pr', number: 517,
              title: 'scheduler: respect operator timezone for weekend windows',
              status: 'approved', author: CAROL,
              created_at: isoMinusHours(18), updated_at: isoMinusHours(4),
              tier: 'regression_breaking', cluster_id: 'scheduler',
              blast_files: ['internal/scheduler/scheduler.go'],
              lines_changed: 47,
              weak_ties: [],
              linked_numbers: [1201],
              html_url: 'https://github.com/gastownhall/gascity/pull/517',
              is_marked: false,
            },
          ],
        },
      ],
      unclustered: [],
    },
    {
      tier: 'regression',
      clusters: [
        {
          cluster_id: 'config-parser',
          files: ['internal/config/parser.ts'],
          lines_pending: 0,
          items: [
            {
              kind: 'issue', number: 1187,
              title: 'env override precedence wrong',
              status: 'open', author: DAVE,
              created_at: isoMinusHours(52), updated_at: isoMinusHours(48),
              tier: 'regression', cluster_id: 'config-parser',
              blast_files: ['internal/config/parser.ts'],
              lines_changed: null,
              weak_ties: [{ label: 'docs/config', count: 3 }],
              linked_numbers: [],
              html_url: 'https://github.com/gastownhall/gascity/issues/1187',
              is_marked: false,
            },
          ],
        },
      ],
      unclustered: [
        {
          kind: 'issue', number: 1156,
          title: 'docs typo in README',
          status: 'open', author: EVE,
          created_at: isoMinusHours(30), updated_at: isoMinusHours(28),
          tier: 'regression', cluster_id: null,
          blast_files: ['README.md'],
          lines_changed: null,
          weak_ties: [],
          linked_numbers: [],
          html_url: 'https://github.com/gastownhall/gascity/issues/1156',
          is_marked: false,
        },
      ],
    },
    {
      tier: 'stability',
      clusters: [],
      unclustered: [],
    },
  ],
};
