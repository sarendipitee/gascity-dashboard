import { useEffect, useRef, useState } from 'react';

// gascity-dashboard-iew: EventSource against the backend's same-origin
// SSE proxy at /api/events/stream. The backend pipes the gc supervisor's
// /v0/city/{name}/events/stream verbatim. Same-origin SSE means CSP
// 'self' covers it and deployment only needs one port reachable from
// the browser.

export type GcEventConnState = 'connecting' | 'open' | 'closed';

/**
 * Subscribe to gc events. When an event whose type starts with any of
 * `prefixes` arrives, `onMatch` is invoked. Designed for "refresh this
 * panel when its underlying data changed" — pass refresh().
 */
export function useGcEventRefresh(
  prefixes: ReadonlyArray<string>,
  onMatch: () => void,
): GcEventConnState {
  const [state, setState] = useState<GcEventConnState>('connecting');
  const onMatchRef = useRef(onMatch);
  onMatchRef.current = onMatch;
  // Stable hash of prefixes for the effect dep array.
  const prefixKey = prefixes.join(',');

  useEffect(() => {
    let es: EventSource | null = null;
    let cancelled = false;
    let retryTimer: ReturnType<typeof setTimeout> | null = null;
    let retryDelayMs = 1_000;

    const connect = () => {
      // Same-origin path; the browser will send Last-Event-ID automatically
      // on reconnect, and the backend proxy forwards it to upstream.
      es = new EventSource('/api/events/stream');
      setState('connecting');
      es.onopen = () => {
        if (cancelled) return;
        setState('open');
        retryDelayMs = 1_000;
      };
      // gc supervisor sends events with `event: event` (the event NAME
      // is literally "event"), not the default "message". EventSource
      // routes named events to addEventListener('<name>', ...) — only
      // unnamed events reach .onmessage. Both handlers point to the same
      // dispatch so the path is identical regardless of how the server
      // names them.
      const handleData = (msg: MessageEvent<string>) => {
        if (cancelled) return;
        let parsed: { type?: string } | null = null;
        try {
          parsed = JSON.parse(msg.data) as { type?: string };
        } catch {
          return;
        }
        const t = parsed?.type;
        if (typeof t !== 'string') return;
        for (const prefix of prefixes) {
          if (t.startsWith(prefix)) {
            onMatchRef.current();
            break;
          }
        }
      };
      es.onmessage = handleData;
      es.addEventListener('event', handleData as EventListener);
      es.onerror = () => {
        if (cancelled) return;
        setState('closed');
        es?.close();
        es = null;
        // Exponential backoff capped at 30s.
        retryTimer = setTimeout(() => {
          retryDelayMs = Math.min(retryDelayMs * 2, 30_000);
          connect();
        }, retryDelayMs);
      };
    };

    connect();

    return () => {
      cancelled = true;
      if (retryTimer) clearTimeout(retryTimer);
      es?.close();
    };
    // We re-bind only when the prefix set changes — onMatch is captured in a ref.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefixKey]);

  return state;
}
