import type { GcSession } from 'gas-city-dashboard-shared';

// Resolution order for the drilldown URL segment. session_name is gc's
// URL-safe primary; alias is human-readable; id is the stable fallback.
// Mirrors the resolution order on the receiving page so a slug always
// round-trips for as long as the session exists.
export function sessionSlug(s: GcSession): string {
  return s.session_name ?? s.alias ?? s.id;
}
