import { Navigate, Route, Routes, useLocation, useParams } from 'react-router-dom'
import AppShell from './components/layout/AppShell'
import { defaultAiAgentId } from './data/aiAgents'
import { productSnapshots } from './data/dashboard'
import {
  appRoutes,
  legacyRoutes,
  level1Segments,
  productDashboardPath,
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

const placeholderRoutes = [
  {
    root: `/${level1Segments.livechat}`,
    dashboard: productDashboardPath(level1Segments.livechat),
    snapshot: productSnapshots.livechat,
  },
  {
    root: `/${level1Segments.ticketing}`,
    dashboard: productDashboardPath(level1Segments.ticketing),
    snapshot: productSnapshots.ticketing,
  },
  {
    root: `/${level1Segments.voice}`,
    dashboard: productDashboardPath(level1Segments.voice),
    snapshot: productSnapshots.voice,
  },
  {
    root: `/${level1Segments.outreach}`,
    dashboard: productDashboardPath(level1Segments.outreach),
    snapshot: productSnapshots.outreach,
  },
  {
    root: `/${level1Segments.queue}`,
    dashboard: productDashboardPath(level1Segments.queue),
    snapshot: productSnapshots.queue,
  },
  {
    root: `/${level1Segments.booking}`,
    dashboard: productDashboardPath(level1Segments.booking),
    snapshot: productSnapshots.booking,
  },
  {
    root: `/${level1Segments.knowledgebase}`,
    dashboard: productDashboardPath(level1Segments.knowledgebase),
    snapshot: productSnapshots.knowledgebase,
  },
  {
    root: `/${level1Segments.contact}`,
    dashboard: productDashboardPath(level1Segments.contact),
    snapshot: productSnapshots.contact,
  },
  {
    root: `/${level1Segments.report}`,
    dashboard: productDashboardPath(level1Segments.report),
    snapshot: productSnapshots.report,
  },
  {
    root: `/${level1Segments.globalsettings}`,
    dashboard: productDashboardPath(level1Segments.globalsettings),
    snapshot: productSnapshots.globalsettings,
  },
  {
    root: `/${level1Segments.integrations}`,
    dashboard: productDashboardPath(level1Segments.integrations),
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

function AiAgentSectionRedirect({ to }: { to: (aiAgentId: string) => string }) {
  const { aiAgentId } = useParams<{ aiAgentId: string }>()

  return <Navigate to={to(aiAgentId ?? defaultAiAgentId)} replace />
}

function DefaultAiAgentPathRedirect() {
  const location = useLocation()
  const match = location.pathname.match(
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
  const topicMatch = location.pathname.match(/^\/ai\/aiagent\/topics\/([^/]+)\/edit$/)
  if (topicMatch) {
    return <Navigate to={appRoutes.ai.aiAgentTopicEdit(topicMatch[1], defaultAiAgentId)} replace />
  }

  const eventMatch = location.pathname.match(/^\/ai\/aiagent\/events\/([^/]+)\/edit$/)
  if (eventMatch) {
    return <Navigate to={appRoutes.ai.aiAgentEventEdit(eventMatch[1], defaultAiAgentId)} replace />
  }

  const functionMatch = location.pathname.match(/^\/ai\/aiagent\/functions\/([^/]+)\/edit$/)
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
        <Route path="*" element={<Navigate to={appRoutes.home} replace />} />
      </Route>
    </Routes>
  )
}

export default App
