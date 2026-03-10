import { Navigate, Route, Routes, useLocation, useParams } from 'react-router-dom'
import AppShell from './components/layout/AppShell'
import { defaultAiAgentId } from './data/aiAgents'
import { productSnapshots } from './data/dashboard'
import {
  appRoutes,
  defaultSiteId,
  getSiteIdFromPathname,
  legacyRoutes,
  level1Segments,
  placeholderLevel1Segments,
  productDashboardPath,
  productRootPath,
  stripSitePrefix,
} from './data/routes'
import DashboardPage from './pages/ai/DashboardPage'
import ChatResolutionStatusPage from './pages/ai/aiinsights/ChatResolutionStatusPage'
import EditEventPage from './pages/ai/aiagent/events/EditEventPage'
import EditFunctionPage from './pages/ai/aiagent/functions/EditFunctionPage'
import EditSpotlightPage from './pages/ai/aiinsights/spotlights/EditSpotlightPage'
import EditTopicPage from './pages/ai/aiagent/topics/EditTopicPage'
import EventsPage from './pages/ai/aiagent/events/EventsPage'
import FunctionsPage from './pages/ai/aiagent/functions/FunctionsPage'
import InstructionsPage from './pages/ai/aiagent/overview/InstructionsPage'
import KnowledgePage from './pages/ai/aiagent/KnowledgePage'
import NewSpotlightPage from './pages/ai/aiinsights/spotlights/NewSpotlightPage'
import NewFunctionPage from './pages/ai/aiagent/functions/NewFunctionPage'
import OverviewPage from './pages/ai/aiagent/overview/OverviewPage'
import ProductPage from './pages/ProductPage'
import SentimentAnalysisPage from './pages/ai/aiinsights/SentimentAnalysisPage'
import SpotlightsPage from './pages/ai/aiinsights/spotlights/SpotlightsPage'
import ThumbsDownAnswersPage from './pages/ai/aiagent/learning/ThumbsDownAnswersPage'
import TopicsPage from './pages/ai/aiagent/topics/TopicsPage'
import UnansweredQuestionsPage from './pages/ai/aiagent/learning/UnansweredQuestionsPage'

const createPlaceholderRoutes = (siteId?: string) => [
  {
    root: productRootPath(level1Segments.livechat, siteId),
    dashboard: productDashboardPath(level1Segments.livechat, siteId),
    snapshot: productSnapshots.livechat,
  },
  {
    root: productRootPath(level1Segments.ticketing, siteId),
    dashboard: productDashboardPath(level1Segments.ticketing, siteId),
    snapshot: productSnapshots.ticketing,
  },
  {
    root: productRootPath(level1Segments.voice, siteId),
    dashboard: productDashboardPath(level1Segments.voice, siteId),
    snapshot: productSnapshots.voice,
  },
  {
    root: productRootPath(level1Segments.outreach, siteId),
    dashboard: productDashboardPath(level1Segments.outreach, siteId),
    snapshot: productSnapshots.outreach,
  },
  {
    root: productRootPath(level1Segments.queue, siteId),
    dashboard: productDashboardPath(level1Segments.queue, siteId),
    snapshot: productSnapshots.queue,
  },
  {
    root: productRootPath(level1Segments.booking, siteId),
    dashboard: productDashboardPath(level1Segments.booking, siteId),
    snapshot: productSnapshots.booking,
  },
  {
    root: productRootPath(level1Segments.knowledgebase, siteId),
    dashboard: productDashboardPath(level1Segments.knowledgebase, siteId),
    snapshot: productSnapshots.knowledgebase,
  },
  {
    root: productRootPath(level1Segments.contact, siteId),
    dashboard: productDashboardPath(level1Segments.contact, siteId),
    snapshot: productSnapshots.contact,
  },
  {
    root: productRootPath(level1Segments.report, siteId),
    dashboard: productDashboardPath(level1Segments.report, siteId),
    snapshot: productSnapshots.report,
  },
  {
    root: productRootPath(level1Segments.globalsettings, siteId),
    dashboard: productDashboardPath(level1Segments.globalsettings, siteId),
    snapshot: productSnapshots.globalsettings,
  },
  {
    root: productRootPath(level1Segments.integrations, siteId),
    dashboard: productDashboardPath(level1Segments.integrations, siteId),
    snapshot: productSnapshots.integrations,
  },
]

function LegacyAiAgentRedirect() {
  const location = useLocation()
  const legacySuffix = location.pathname.slice(legacyRoutes.aiAgentPrefix.length)
  const nextPath =
    legacySuffix.length === 0 || legacySuffix === '/'
      ? appRoutes.ai.aiAgentOverview(defaultAiAgentId)
      : `${appRoutes.ai.aiAgentRoot}/${defaultAiAgentId}${legacySuffix}`

  return (
    <Navigate to={`${nextPath}${location.search}${location.hash}`} replace />
  )
}

function SitePrefixedRedirect() {
  const location = useLocation()

  return (
    <Navigate
      to={`/ui/${defaultSiteId}${location.pathname}${location.search}${location.hash}`}
      replace
    />
  )
}

function AiAgentSectionRedirect({ to }: { to: (aiAgentId: string) => string }) {
  const { aiAgentId } = useParams<{ aiAgentId: string }>()

  return <Navigate to={to(aiAgentId ?? defaultAiAgentId)} replace />
}

function DefaultAiAgentPathRedirect() {
  const location = useLocation()
  const match = stripSitePrefix(location.pathname).match(
    /^\/ai\/aiagent\/(overview|knowledge|topics|events|functions|learning)$/,
  )
  const nextPath = match
    ? `${appRoutes.ai.aiAgentRoot}/${defaultAiAgentId}/${match[1]}`
    : appRoutes.ai.aiAgentOverview(defaultAiAgentId)

  return <Navigate to={nextPath} replace />
}

function DefaultAiAgentInstructionsRedirect() {
  return <Navigate to={appRoutes.ai.aiAgentInstructions(defaultAiAgentId)} replace />
}

function AiAgentInstructionsRedirect() {
  const { aiAgentId } = useParams<{ aiAgentId: string }>()

  return <Navigate to={appRoutes.ai.aiAgentInstructions(aiAgentId ?? defaultAiAgentId)} replace />
}

function DefaultAiAgentEditRedirect() {
  const location = useLocation()
  const appPath = stripSitePrefix(location.pathname)
  const topicMatch = appPath.match(/^\/ai\/aiagent\/topics\/([^/]+)\/edit$/)
  if (topicMatch) {
    return <Navigate to={appRoutes.ai.aiAgentTopicEdit(topicMatch[1], defaultAiAgentId)} replace />
  }

  const eventMatch = appPath.match(/^\/ai\/aiagent\/events\/([^/]+)\/edit$/)
  if (eventMatch) {
    return <Navigate to={appRoutes.ai.aiAgentEventEdit(eventMatch[1], defaultAiAgentId)} replace />
  }

  const functionMatch = appPath.match(/^\/ai\/aiagent\/functions\/([^/]+)\/edit$/)
  if (functionMatch) {
    return (
      <Navigate
        to={appRoutes.ai.aiAgentFunctionEdit(functionMatch[1], defaultAiAgentId)}
        replace
      />
    )
  }

  return <Navigate to={appRoutes.ai.aiAgentOverview(defaultAiAgentId)} replace />
}

function App() {
  const location = useLocation()
  const siteId = getSiteIdFromPathname(location.pathname)
  const placeholderRoutes = createPlaceholderRoutes(siteId)

  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<Navigate to={appRoutes.home} replace />} />
        <Route
          path={legacyRoutes.dashboard}
          element={<Navigate to={appRoutes.ai.dashboard} replace />}
        />
        <Route
          path={appRoutes.ai.root}
          element={<Navigate to={appRoutes.ai.dashboard} replace />}
        />
        <Route path={appRoutes.ai.dashboard} element={<DashboardPage />} />
        <Route
          path={appRoutes.ai.aiAgentRoot}
          element={<Navigate to={appRoutes.ai.aiAgentOverview(defaultAiAgentId)} replace />}
        />
        <Route
          path={`${appRoutes.ai.aiAgentRoot}/overview`}
          element={<DefaultAiAgentPathRedirect />}
        />
        <Route
          path={`${appRoutes.ai.aiAgentRoot}/knowledge`}
          element={<DefaultAiAgentPathRedirect />}
        />
        <Route
          path={`${appRoutes.ai.aiAgentRoot}/topics`}
          element={<DefaultAiAgentPathRedirect />}
        />
        <Route
          path={`${appRoutes.ai.aiAgentRoot}/events`}
          element={<DefaultAiAgentPathRedirect />}
        />
        <Route
          path={`${appRoutes.ai.aiAgentRoot}/functions`}
          element={<DefaultAiAgentPathRedirect />}
        />
        <Route
          path={`${appRoutes.ai.aiAgentRoot}/functions/new`}
          element={<Navigate to={appRoutes.ai.aiAgentFunctionNew(defaultAiAgentId)} replace />}
        />
        <Route
          path={`${appRoutes.ai.aiAgentRoot}/learning`}
          element={<DefaultAiAgentPathRedirect />}
        />
        <Route
          path={`${appRoutes.ai.aiAgentRoot}/instructions`}
          element={<DefaultAiAgentInstructionsRedirect />}
        />
        <Route
          path={`${appRoutes.ai.aiAgentRoot}/:aiAgentId/instructions`}
          element={<AiAgentInstructionsRedirect />}
        />
        <Route
          path={`${appRoutes.ai.aiAgentRoot}/topics/:topicId/edit`}
          element={<DefaultAiAgentEditRedirect />}
        />
        <Route
          path={`${appRoutes.ai.aiAgentRoot}/events/:eventId/edit`}
          element={<DefaultAiAgentEditRedirect />}
        />
        <Route
          path={`${appRoutes.ai.aiAgentRoot}/functions/:functionId/edit`}
          element={<DefaultAiAgentEditRedirect />}
        />
        <Route
          path={appRoutes.ai.aiAgentBasePattern}
          element={<AiAgentSectionRedirect to={appRoutes.ai.aiAgentOverview} />}
        />
        <Route path={appRoutes.ai.aiAgentOverviewPattern} element={<OverviewPage />} />
        <Route path={appRoutes.ai.aiAgentKnowledgePattern} element={<KnowledgePage />} />
        <Route path={appRoutes.ai.aiAgentTopicsPattern} element={<TopicsPage />} />
        <Route
          path={appRoutes.ai.aiAgentTopicEditPattern}
          element={<EditTopicPage />}
        />
        <Route path={appRoutes.ai.aiAgentEventsPattern} element={<EventsPage />} />
        <Route
          path={appRoutes.ai.aiAgentEventEditPattern}
          element={<EditEventPage />}
        />
        <Route path={appRoutes.ai.aiAgentFunctionsPattern} element={<FunctionsPage />} />
        <Route path={appRoutes.ai.aiAgentFunctionNewPattern} element={<NewFunctionPage />} />
        <Route
          path={appRoutes.ai.aiAgentFunctionEditPattern}
          element={<EditFunctionPage />}
        />
        <Route
          path={appRoutes.ai.aiAgentLearningPattern}
          element={
            <AiAgentSectionRedirect
              to={appRoutes.ai.aiAgentLearningUnansweredQuestions}
            />
          }
        />
        <Route
          path={appRoutes.ai.aiAgentLearningUnansweredQuestionsPattern}
          element={<UnansweredQuestionsPage />}
        />
        <Route
          path={appRoutes.ai.aiAgentLearningThumbsDownAnswersPattern}
          element={<ThumbsDownAnswersPage />}
        />
        <Route
          path={appRoutes.ai.aiAgentInstructionsPattern}
          element={<InstructionsPage />}
        />
        <Route
          path={appRoutes.ai.aiCopilot}
          element={
            <ProductPage
              title={productSnapshots.aicopilot.title}
              description={productSnapshots.aicopilot.description}
            />
          }
        />
        <Route
          path={appRoutes.ai.aiInsights}
          element={<Navigate to={appRoutes.ai.aiInsightsSentimentAnalysis} replace />}
        />
        <Route
          path={appRoutes.ai.aiInsightsSentimentAnalysis}
          element={<SentimentAnalysisPage />}
        />
        <Route
          path={appRoutes.ai.aiInsightsSpotlights}
          element={<SpotlightsPage />}
        />
        <Route
          path={appRoutes.ai.aiInsightsSpotlightNew}
          element={<NewSpotlightPage />}
        />
        <Route
          path={appRoutes.ai.aiInsightsSpotlightEditPattern}
          element={<EditSpotlightPage />}
        />
        <Route
          path={appRoutes.ai.aiInsightsChatResolutionStatus}
          element={<ChatResolutionStatusPage />}
        />
        <Route
          path={appRoutes.ai.taskBot}
          element={
            <ProductPage
              title={productSnapshots.taskbot.title}
              description={productSnapshots.taskbot.description}
            />
          }
        />
        <Route
          path={appRoutes.ai.voiceBot}
          element={
            <ProductPage
              title={productSnapshots.voicebot.title}
              description={productSnapshots.voicebot.description}
            />
          }
        />
        {placeholderRoutes.map((route) => (
          <Route
            key={route.dashboard}
            path={route.root}
            element={<Navigate to={route.dashboard} replace />}
          />
        ))}
        {placeholderRoutes.map((route) => (
          <Route
            key={`${route.dashboard}-page`}
            path={route.dashboard}
            element={
              <ProductPage
                title={route.snapshot.title}
                description={route.snapshot.description}
              />
            }
          />
        ))}
        <Route
          path={`${legacyRoutes.aiAgentPrefix}/*`}
          element={<LegacyAiAgentRedirect />}
        />
        <Route
          path={legacyRoutes.aiCopilot}
          element={<Navigate to={appRoutes.ai.aiCopilot} replace />}
        />
        <Route
          path={legacyRoutes.aiInsights}
          element={<Navigate to={appRoutes.ai.aiInsightsSentimentAnalysis} replace />}
        />
        <Route
          path={legacyRoutes.taskBot}
          element={<Navigate to={appRoutes.ai.taskBot} replace />}
        />
        <Route
          path={legacyRoutes.voiceBot}
          element={<Navigate to={appRoutes.ai.voiceBot} replace />}
        />
        <Route path="/ai/*" element={<SitePrefixedRedirect />} />
        {placeholderLevel1Segments.map((segment) => (
          <Route
            key={`${segment}-site-prefix`}
            path={`/${segment}/*`}
            element={<SitePrefixedRedirect />}
          />
        ))}
        <Route path="*" element={<Navigate to={appRoutes.home} replace />} />
      </Route>
    </Routes>
  )
}

export default App
