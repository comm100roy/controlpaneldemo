# AGENTS.md

## Project overview

- This repository is a single React 19 + TypeScript + Vite SPA.
- The app is a control-panel style demo for AI and adjacent products, with the richest flows under `src/pages/ai/**`.
- There is no backend service in this repo. Data is currently served through MSW handlers and seeded frontend data.
- Deployment targets GitHub Pages via `.github/workflows/deploy-pages.yml`.

## Stack

- React 19
- React Router 7
- MUI 7
- Vite 7
- TypeScript 5
- MSW 2 for mock APIs
- Recharts for charts

## Install and run

From the repo root:

```bash
npm ci
npm run dev
npm run build
npm run lint
npm run preview
```

Notes:

- `npm run build` currently succeeds.
- `npm run lint` currently succeeds with one warning in `public/mockServiceWorker.js` about an unused eslint-disable directive.
- Production builds emit a large chunk warning from Vite (`dist/assets/index-*.js` > 500 kB).

## Runtime and environment behavior

- Browser entrypoint: `src/main.tsx`
- App routes: `src/App.tsx`
- Shared layout shell: `src/components/layout/AppShell.tsx`
- Route builders and URL rules: `src/data/routes.ts`
- Sidebar/navigation model: `src/data/navigation.tsx`

Important behavior:

- The app is site-prefixed. Canonical URLs are under `/ui/:siteId/...`.
- Route generation should go through helpers in `src/data/routes.ts`. Do not hardcode AI paths unless there is a strong reason.
- `BrowserRouter` uses `basename={import.meta.env.BASE_URL}`.
- Vite base path is adjusted for GitHub Pages in `vite.config.ts`.

## Mock API architecture

- MSW bootstrap: `src/mocks/browser.ts`
- Registered handlers: `src/mocks/handlers/index.ts`
- Main mock domains:
  - `src/mocks/handlers/aiAgents.ts`
  - `src/mocks/handlers/functions.ts`
  - `src/mocks/handlers/spotlights.ts`
- Frontend API wrappers:
  - `src/api/aiAgents.ts`
  - `src/api/functions.ts`
  - `src/api/spotlights.ts`

Important behavior:

- MSW is enabled by default. In `src/main.tsx`, mocking is disabled only when `VITE_ENABLE_MSW === 'false'`.
- GitHub Pages deployment explicitly builds with `VITE_ENABLE_MSW: 'true'`.
- Mock state is in-memory and scoped by query parameters such as `siteId` and `aiAgentId`.

If you are wiring a real backend:

- Set `VITE_ENABLE_MSW=false`.
- Preserve the existing query parameter contract unless you intentionally change both API wrappers and handlers.
- Keep site-aware routing in mind when constructing API requests or deep links.

## Source layout

### Core app

- `src/main.tsx` - app bootstrap, theme provider, router, MSW startup
- `src/App.tsx` - top-level route table and redirects
- `src/theme.ts` - MUI theme

### Shared UI

- `src/components/layout/AppShell.tsx` - responsive drawer shell and AI agent loading
- `src/components/sidebar/SidebarNav.tsx` - primary navigation UI
- `src/components/common/**` - shared page, table, drawer, and utility components

### Feature areas

- `src/pages/ai/DashboardPage.tsx` - AI dashboard
- `src/pages/ai/aiagent/**` - AI Agent pages:
  - overview
  - knowledge
  - topics
  - events
  - functions
  - learning
- `src/pages/ai/aiinsights/**` - AI Insights pages:
  - sentiment analysis
  - spotlights
  - chat resolution status
- `src/pages/ProductPage.tsx` - placeholder page for non-implemented product dashboards

### Seeded data

- `src/data/aiAgents.ts` - AI agent records and default AI agent id
- `src/data/dashboard.ts` - dashboard snapshots, topic/event/function demo data, knowledge rows
- `src/data/aiInsights.ts` - AI insights seed data
- `src/data/navigation.tsx` - sidebar metadata

## Working conventions

### Routing

- Prefer `appRoutes`/`getAppRoutes()` helpers from `src/data/routes.ts`.
- Preserve the `/ui/:siteId/...` contract.
- AI Agent routes are parameterized by `aiAgentId`; many pages also fall back to `resolveAiAgentId()`.
- Legacy redirects are handled in `src/App.tsx`; be careful when changing path shapes.

### Data flow

- Some screens use API wrappers + MSW-backed CRUD state.
- Some screens still render directly from static seed data in `src/data/dashboard.ts`.
- Before refactoring, confirm whether a page is truly live CRUD or only a seeded UI demo.

### UI patterns

- MUI is the primary component system.
- Most pages are wrapped in `components/common/Page.tsx`.
- Drawers and table-based management UIs are common patterns across the app.

## Known risks and inconsistencies

These are current codebase realities worth knowing before making changes:

1. `defaultAiAgentId` in `src/data/aiAgents.ts` is a fixed string (`eddy`), but `src/mocks/handlers/aiAgents.ts` reseeds agent ids with `crypto.randomUUID()`. `AppShell` works around this by redirecting invalid AI agent URLs to the first loaded agent.
2. Function CRUD is API-backed in `src/pages/ai/aiagent/functions/**`, but topic/event answer editors still use static `functionDefinitions` from `src/data/dashboard.ts`. New or deleted functions do not automatically stay in sync there.
3. Some edit screens expose save-like actions without persistence. Review the exact page before assuming a form is connected end-to-end.
4. No automated test suite is configured yet. Validation is currently build + lint only.

Treat these as guardrails when making changes. If you normalize one side of a mismatch, update the other side in the same change.

## Suggested validation after changes

At minimum run:

```bash
npm run build
npm run lint
```

When touching routing or mock CRUD flows, manually verify:

- `/ui/1/ai/dashboard`
- `/ui/1/ai/aiagent/:aiAgentId/overview`
- topic/event edit pages
- function create/edit/delete flows
- spotlight create/edit/delete flows

## Deployment notes

- GitHub Actions workflow: `.github/workflows/deploy-pages.yml`
- Node version in CI: 22
- Pages build relies on Vite `base` being set from `GITHUB_REPOSITORY`
- `public/404.html` is present to support SPA routing on GitHub Pages

## External product context

This repo does not include the backend database, but current project context says:

- The AutoCoding database contains multiple schemas (`livechat`, `dbo`, `chatbot`, `ticketing`, `kb`, `booking`, `global`, etc.), and each schema maps to a product.
- UI localization texts are stored in `t_AutoCoding_MultilingualText`.

If future work adds backend or localization integration, keep that data model in mind.
