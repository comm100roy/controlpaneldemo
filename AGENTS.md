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
- API design guide: `API-Design.md`
- Registered handlers: `src/mocks/handlers/index.ts`
- Main mock domains:
  - `src/mocks/handlers/aiAgents.ts`
  - `src/mocks/handlers/functions.ts` (store exported via `getScopedFunctions`)
  - `src/mocks/handlers/topics.ts` (store in `src/mocks/handlers/topicStore.ts`)
  - `src/mocks/handlers/spotlights.ts`
- Frontend API wrappers:
  - `src/api/aiAgents.ts`
  - `src/api/functions.ts`
  - `src/api/topics.ts`
  - `src/api/spotlights.ts`

Important behavior:

- MSW is enabled by default. In `src/main.tsx`, mocking is disabled only when `VITE_ENABLE_MSW === 'false'`.
- GitHub Pages deployment explicitly builds with `VITE_ENABLE_MSW: 'true'`.
- Mock state is in-memory and scoped by query parameters such as `siteId` and `aiAgentId`.

### `include` query parameter

GET-single endpoints support an optional `include` query parameter to embed related entities in the response. The parameter can appear multiple times to include several entity types.

Example: `GET /api/aiagent/topics/:topicId?siteId=1&aiAgentId=abc&include=functions`

When `include=functions` is present, the topic response adds a `functions` array containing the full function objects whose IDs are in the topic's `functionIds`. The response type for this is `TopicWithIncludes` (defined in `src/data/topics.ts`).

When adding a new entity relationship, follow this pattern:

1. Export the related store's lookup function (e.g. `getScopedFunctions` from the functions handler).
2. In the parent entity's GET-single handler, read `url.searchParams.getAll('include')` and resolve matching related data.
3. Define an extended response type (`EntityWithIncludes`) in the data layer.
4. Update the API wrapper to accept an optional `include` array and append it to the query string.

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
- `src/data/topics.ts` - topic type definitions (`TopicDefinition`, `TopicWithIncludes`) and seed data
- `src/data/topicCategories.ts` - topic category types and seed data
- `src/data/aiInsights.ts` - AI insights seed data
- `src/data/navigation.tsx` - sidebar metadata

## Working conventions

### Routing

- Prefer `appRoutes`/`getAppRoutes()` helpers from `src/data/routes.ts`.
- Preserve the `/ui/:siteId/...` contract.
- AI Agent routes are parameterized by `aiAgentId`; many pages also fall back to `resolveAiAgentId()`.
- Legacy redirects are handled in `src/App.tsx`; be careful when changing path shapes.

### Route to menu mapping

Use this table when tracing a visible sidebar/menu item back to its canonical route.

| Menu level | Label | Canonical path |
| --- | --- | --- |
| Level 1 | Live Chat | `/ui/:siteId/livechat/dashboard` |
| Level 1 | Ticketing & Messaging | `/ui/:siteId/ticketing/dashboard` |
| Level 1 | Voice | `/ui/:siteId/voice/dashboard` |
| Level 1 | AI | `/ui/:siteId/ai/dashboard` |
| Level 2 under AI | Dashboard | `/ui/:siteId/ai/dashboard` |
| Level 2 under AI | AI Agent | `/ui/:siteId/ai/aiagent/:aiAgentId/overview` |
| Level 3 under AI Agent | Overview | `/ui/:siteId/ai/aiagent/:aiAgentId/overview` |
| Level 3 under AI Agent | Knowledge | `/ui/:siteId/ai/aiagent/:aiAgentId/knowledge` |
| Level 3 under AI Agent | Topics | `/ui/:siteId/ai/aiagent/:aiAgentId/topics` |
| Level 3 under AI Agent | Events | `/ui/:siteId/ai/aiagent/:aiAgentId/events` |
| Level 3 under AI Agent | Functions | `/ui/:siteId/ai/aiagent/:aiAgentId/functions` |
| Level 3 under AI Agent | Unanswered Questions | `/ui/:siteId/ai/aiagent/:aiAgentId/learning/unanswered-questions` |
| Level 3 under AI Agent | Thumbs Down Answers | `/ui/:siteId/ai/aiagent/:aiAgentId/learning/thumbs-down-answers` |
| Level 2 under AI | AI Copilot | `/ui/:siteId/ai/aicopilot` |
| Level 2 under AI | AI Insights | `/ui/:siteId/ai/aiinsights/sentiment-analysis` |
| Level 3 under AI Insights | Sentiment Analysis | `/ui/:siteId/ai/aiinsights/sentiment-analysis` |
| Level 3 under AI Insights | Spotlights | `/ui/:siteId/ai/aiinsights/spotlights` |
| Level 3 under AI Insights | Chat Resolution Status | `/ui/:siteId/ai/aiinsights/chat-resolution-status` |
| Level 2 under AI | Task Bot | `/ui/:siteId/ai/taskbot` |
| Level 2 under AI | Voice Bot | `/ui/:siteId/ai/voicebot` |
| Level 1 | Outreach | `/ui/:siteId/outreach/dashboard` |
| Level 1 | Queue | `/ui/:siteId/queue/dashboard` |
| Level 1 | Booking | `/ui/:siteId/booking/dashboard` |
| Level 1 | Knowledge Base | `/ui/:siteId/knowledgebase/dashboard` |
| Level 1 | Contact | `/ui/:siteId/contact/dashboard` |
| Level 1 | Report | `/ui/:siteId/report/dashboard` |
| Level 1 | Global Settings | `/ui/:siteId/globalsettings/dashboard` |
| Level 1 | Integrations | `/ui/:siteId/integrations/dashboard` |

Notes:

- The mapping above is sourced from `src/data/navigation.tsx` and `src/data/routes.ts`.
- Placeholder products currently land on `ProductPage` even though they still use dashboard-shaped paths.
- `AI Agent` and `AI Insights` also have redirect-style parent routes in `src/App.tsx`, but menu links point to the concrete child pages above.

### Data flow

- Some screens use API wrappers + MSW-backed CRUD state.
- Some screens still render directly from static seed data in `src/data/dashboard.ts`.
- Before refactoring, confirm whether a page is truly live CRUD or only a seeded UI demo.

Edit pages and edit drawers must fetch the single entity from the API on mount to ensure up-to-date data. Use the `include` parameter to embed related entities when needed (e.g. `getTopic(siteId, aiAgentId, topicId, { include: ['functions'] })`). Pass the included data to child components via props (e.g. `initialFunctions`) so related items render immediately without a separate fetch. When adding a new edit page or drawer, follow this pattern:

1. Call the GET-single API in a `useEffect` on mount, with `include` for any related entities the UI needs.
2. Store the included related data in component state.
3. Pass it to child components so they can render without waiting for a user-triggered fetch.

### UI patterns

- MUI is the primary component system.
- Most pages are wrapped in `components/common/Page.tsx`.
- Drawers and table-based management UIs are common patterns across the app.

## Known risks and inconsistencies

These are current codebase realities worth knowing before making changes:

1. Some edit screens expose save-like actions without persistence. Review the exact page before assuming a form is connected end-to-end.
2. No automated test suite is configured yet. Validation is currently build + lint only.

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
