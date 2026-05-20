import { Router, type Request, type Response } from 'express';

// gascity-dashboard-iew: backend-side SSE proxy. The browser opens
// EventSource('/api/events/stream') against this server (same origin as
// the rest of /api/*). This route opens an upstream fetch to the gc
// supervisor's /v0/city/{name}/events/stream and pipes the raw byte
// stream verbatim. SSE framing is line-delimited so chunk boundaries
// don't matter.
//
// Why not direct browser-to-supervisor? Because the supervisor binds
// 127.0.0.1 only. Any deployment where the browser isn't on the same
// host (SSH tunnel, reverse proxy, separate machine) requires either
// forwarding the supervisor port too or this proxy. The proxy keeps
// the deployment story to a single port.

export interface EventsRouterOptions {
  /** Base URL of the gc supervisor — no trailing slash. */
  supervisorUrl: string;
  cityName: string;
  /** Heartbeat comment frequency (defaults to 15s). */
  heartbeatMs?: number;
}

// Nginx default proxy_read_timeout is 60s; 15s keeps the stream alive
// through most intermediaries without spamming the client.
const DEFAULT_HEARTBEAT_MS = 15_000;

export function eventsRouter(opts: EventsRouterOptions): Router {
  const router = Router();
  const heartbeatMs = opts.heartbeatMs ?? DEFAULT_HEARTBEAT_MS;

  router.get('/stream', async (req: Request, res: Response) => {
    // EventSource sends Last-Event-ID automatically on reconnect. The
    // existing FE hook also passes ?after= explicitly; accept both, prefer
    // the header (set by the browser without the FE having to manage it).
    const headerVal = req.headers['last-event-id'];
    const lastEventId = typeof headerVal === 'string' && headerVal.length > 0
      ? headerVal
      : typeof req.query.after === 'string' && req.query.after.length > 0
        ? req.query.after
        : null;

    const upstream = new URL(
      `${opts.supervisorUrl}/v0/city/${encodeURIComponent(opts.cityName)}/events/stream`,
    );
    if (lastEventId) upstream.searchParams.set('after', lastEventId);

    const ctrl = new AbortController();
    req.on('close', () => ctrl.abort());

    let upstreamRes: globalThis.Response;
    try {
      upstreamRes = await fetch(upstream, {
        signal: ctrl.signal,
        headers: { accept: 'text/event-stream' },
      });
    } catch {
      if (!res.headersSent && !res.writableEnded) {
        res.status(502).json({ error: 'gc supervisor SSE upstream unreachable', kind: 'upstream' });
      }
      return;
    }

    if (!upstreamRes.ok) {
      upstreamRes.body?.cancel().catch(() => undefined);
      res.status(502).json({ error: `gc supervisor returned ${upstreamRes.status}`, kind: 'upstream' });
      return;
    }
    if (!upstreamRes.body) {
      res.status(502).json({ error: 'gc supervisor SSE response had no body', kind: 'upstream' });
      return;
    }

    res.status(200);
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    // Nginx / similar reverse proxies otherwise buffer streaming responses.
    res.setHeader('X-Accel-Buffering', 'no');
    res.flushHeaders();

    const heartbeat = setInterval(() => {
      if (!res.writableEnded) res.write(':\n\n');
    }, heartbeatMs);

    const reader = upstreamRes.body.getReader();
    try {
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        if (res.writableEnded) break;
        if (!res.write(value)) {
          // Race drain against close — otherwise a client disconnecting
          // while a write is backpressured would orphan the await
          // forever, leaking the upstream connection and heartbeat timer.
          await new Promise<void>((resolve) => {
            const done = (): void => {
              res.off('drain', done);
              res.off('close', done);
              resolve();
            };
            res.once('drain', done);
            res.once('close', done);
          });
          if (res.writableEnded || res.destroyed) break;
        }
      }
    } catch {
      // Upstream errored or aborted — fall through to cleanup.
    } finally {
      clearInterval(heartbeat);
      try {
        reader.releaseLock();
      } catch {
        // ignore
      }
      ctrl.abort();
      if (!res.writableEnded) res.end();
    }
  });

  return router;
}
