import { useMemo } from 'react';
import { AnsiUp } from 'ansi_up';
import type { TranscriptResult, TranscriptTurn } from 'gas-city-dashboard-shared';

// Render layer for a session's transcript snapshot. Used by:
//   - Agents page peek modal (one-shot fetch)
//   - Agent drilldown live peek panel (auto-refreshing)
//
// Pure presentation — fetch + cadence decisions belong to the caller.

const PROMPT_INJECTION_NOTICE =
  'Content is agent-generated and may contain misleading instructions.';

interface SessionPeekContentProps {
  loading: boolean;
  error: string | null;
  result: TranscriptResult | null;
}

export function SessionPeekContent({ loading, error, result }: SessionPeekContentProps) {
  if (loading && result === null) {
    return <p className="text-fg-muted italic">Fetching transcript.</p>;
  }
  if (error) {
    return (
      <p className="text-accent" role="alert">
        {error}
      </p>
    );
  }
  if (!result) return null;
  if (result.turns.length === 0) {
    return <p className="text-fg-muted italic">No turns in this session yet.</p>;
  }

  return (
    <div className="space-y-6">
      <p className="text-label uppercase tracking-wider text-warn">
        ▲ {PROMPT_INJECTION_NOTICE}
      </p>
      <ol className="space-y-5">
        {result.turns.map((turn, idx) => (
          <TurnBlock key={idx} turn={turn} index={idx} />
        ))}
      </ol>
      {result.truncated && (
        <p className="text-label uppercase tracking-wider text-fg-faint italic">
          Some turns truncated at the per-turn or total cap. Run{' '}
          <code className="text-fg-muted">gc session peek</code> in a terminal for the full transcript.
        </p>
      )}
    </div>
  );
}

function TurnBlock({ turn, index }: { turn: TranscriptTurn; index: number }) {
  const html = useMemo(() => {
    const renderer = new AnsiUp();
    renderer.use_classes = true;
    return renderer.ansi_to_html(turn.text);
  }, [turn.text]);

  return (
    <li>
      <header className="flex items-baseline justify-between gap-3 pb-2 border-b border-rule mb-2">
        <span className="text-label uppercase tracking-wider text-fg-faint tnum">
          #{(index + 1).toString().padStart(2, '0')}
        </span>
        <RoleLabel role={turn.role} />
      </header>
      <pre
        className="text-body whitespace-pre-wrap leading-relaxed overflow-x-auto text-fg"
        // eslint-disable-next-line react/no-danger -- html is ansi_up output of server-sanitised text; see SECURITY.md
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </li>
  );
}

function RoleLabel({ role }: { role: string }) {
  const tone = roleTone(role);
  return (
    <span className={`text-label uppercase tracking-wider font-medium ${tone}`}>
      {role.replace(/_/g, ' ')}
    </span>
  );
}

function roleTone(role: string): string {
  switch (role) {
    case 'assistant':
      return 'text-accent';
    case 'user':
      return 'text-fg';
    case 'system':
      return 'text-warn';
    case 'tool_use':
    case 'tool_result':
      return 'text-fg-muted';
    default:
      return 'text-fg-faint';
  }
}

export function formatPeekChars(n: number): string {
  if (n < 1024) return `${n} chars`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}
