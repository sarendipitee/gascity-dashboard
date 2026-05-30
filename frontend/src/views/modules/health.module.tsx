// Health is a core view: always mounted, never opt-out-able. The lazy
// import keeps the Health route's chunk out of the default first-paint
// bundle even though it's core — the route only renders when the operator
// navigates to /health, which is rare.

import { lazy } from 'react';
import type { ComponentType, LazyExoticComponent } from 'react';
import type { ViewDescriptor } from 'gas-city-dashboard-shared';

export type FrontendViewDescriptor = ViewDescriptor<LazyExoticComponent<ComponentType>>;

export const healthView: FrontendViewDescriptor = {
  id: 'health',
  kind: 'core',
  path: '/health',
  nav: { label: 'Health', order: 60 },
  element: lazy(() =>
    import('../../routes/Health').then((m) => ({ default: m.HealthPage })),
  ),
};
