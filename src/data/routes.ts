import { defaultAiAgentId } from './aiAgents'

export const level1Segments = {
  livechat: 'livechat',
  ticketing: 'ticketing',
  voice: 'voice',
  ai: 'ai',
  outreach: 'outreach',
  queue: 'queue',
  booking: 'booking',
  knowledgebase: 'knowledgebase',
  contact: 'contact',
  report: 'report',
  globalsettings: 'globalsettings',
  integrations: 'integrations',
} as const

export type Level1Segment = (typeof level1Segments)[keyof typeof level1Segments]

export const defaultSiteId = '1'

const sitePrefixPattern = /^\/ui\/(\d+)(?=\/|$)/

const normalizeSitePath = (path: string) => {
  if (!path || path === '/') {
    return ''
  }

  return path.startsWith('/') ? path : `/${path}`
}

export const getSiteIdFromPathname = (pathname: string) =>
  pathname.match(sitePrefixPattern)?.[1]

export const resolveSiteId = (siteId?: string) => {
  if (siteId && /^\d+$/.test(siteId)) {
    return siteId
  }

  if (typeof window !== 'undefined') {
    return getSiteIdFromPathname(window.location.pathname) ?? defaultSiteId
  }

  return defaultSiteId
}

export const stripSitePrefix = (pathname: string) => {
  const nextPath = pathname.replace(sitePrefixPattern, '')
  return nextPath.length > 0 ? nextPath : '/'
}

const withSitePrefix = (path: string, siteId?: string) =>
  `/ui/${resolveSiteId(siteId)}${normalizeSitePath(path)}`

export const placeholderLevel1Segments: Level1Segment[] = [
  level1Segments.livechat,
  level1Segments.ticketing,
  level1Segments.voice,
  level1Segments.outreach,
  level1Segments.queue,
  level1Segments.booking,
  level1Segments.knowledgebase,
  level1Segments.contact,
  level1Segments.report,
  level1Segments.globalsettings,
  level1Segments.integrations,
]

export const productRootPath = (level1: Level1Segment, siteId?: string) =>
  withSitePrefix(`/${level1}`, siteId)

export const productDashboardPath = (level1: Level1Segment, siteId?: string) =>
  withSitePrefix(`/${level1}/dashboard`, siteId)

export const resolveAiAgentId = (aiAgentId?: string) => aiAgentId || defaultAiAgentId

export const getAppRoutes = (siteId?: string) =>
  ({
    get home() {
      return withSitePrefix('/ai/dashboard', siteId)
    },
    ai: {
      get root() {
        return withSitePrefix('/ai', siteId)
      },
      get dashboard() {
        return withSitePrefix('/ai/dashboard', siteId)
      },
      get aiAgentRoot() {
        return withSitePrefix('/ai/aiagent', siteId)
      },
      get aiAgentBasePattern() {
        return withSitePrefix('/ai/aiagent/:aiAgentId', siteId)
      },
      get aiAgentOverviewPattern() {
        return withSitePrefix('/ai/aiagent/:aiAgentId/overview', siteId)
      },
      aiAgentOverview: (aiAgentId: string = defaultAiAgentId, routeSiteId?: string) =>
        withSitePrefix(`/ai/aiagent/${aiAgentId}/overview`, routeSiteId ?? siteId),
      get aiAgentKnowledgePattern() {
        return withSitePrefix('/ai/aiagent/:aiAgentId/knowledge', siteId)
      },
      aiAgentKnowledge: (aiAgentId: string = defaultAiAgentId, routeSiteId?: string) =>
        withSitePrefix(`/ai/aiagent/${aiAgentId}/knowledge`, routeSiteId ?? siteId),
      get aiAgentTopicsPattern() {
        return withSitePrefix('/ai/aiagent/:aiAgentId/topics', siteId)
      },
      aiAgentTopics: (aiAgentId: string = defaultAiAgentId, routeSiteId?: string) =>
        withSitePrefix(`/ai/aiagent/${aiAgentId}/topics`, routeSiteId ?? siteId),
      get aiAgentTopicEditPattern() {
        return withSitePrefix('/ai/aiagent/:aiAgentId/topics/:topicId/edit', siteId)
      },
      aiAgentTopicEdit: (
        topicId: string,
        aiAgentId: string = defaultAiAgentId,
        routeSiteId?: string,
      ) => withSitePrefix(`/ai/aiagent/${aiAgentId}/topics/${topicId}/edit`, routeSiteId ?? siteId),
      get aiAgentEventsPattern() {
        return withSitePrefix('/ai/aiagent/:aiAgentId/events', siteId)
      },
      aiAgentEvents: (aiAgentId: string = defaultAiAgentId, routeSiteId?: string) =>
        withSitePrefix(`/ai/aiagent/${aiAgentId}/events`, routeSiteId ?? siteId),
      get aiAgentEventEditPattern() {
        return withSitePrefix('/ai/aiagent/:aiAgentId/events/:eventId/edit', siteId)
      },
      aiAgentEventEdit: (
        eventId: string,
        aiAgentId: string = defaultAiAgentId,
        routeSiteId?: string,
      ) => withSitePrefix(`/ai/aiagent/${aiAgentId}/events/${eventId}/edit`, routeSiteId ?? siteId),
      get aiAgentFunctionsPattern() {
        return withSitePrefix('/ai/aiagent/:aiAgentId/functions', siteId)
      },
      aiAgentFunctions: (aiAgentId: string = defaultAiAgentId, routeSiteId?: string) =>
        withSitePrefix(`/ai/aiagent/${aiAgentId}/functions`, routeSiteId ?? siteId),
      get aiAgentFunctionNewPattern() {
        return withSitePrefix('/ai/aiagent/:aiAgentId/functions/new', siteId)
      },
      aiAgentFunctionNew: (aiAgentId: string = defaultAiAgentId, routeSiteId?: string) =>
        withSitePrefix(`/ai/aiagent/${aiAgentId}/functions/new`, routeSiteId ?? siteId),
      get aiAgentFunctionEditPattern() {
        return withSitePrefix('/ai/aiagent/:aiAgentId/functions/:functionId/edit', siteId)
      },
      aiAgentFunctionEdit: (
        functionId: string,
        aiAgentId: string = defaultAiAgentId,
        routeSiteId?: string,
      ) =>
        withSitePrefix(
          `/ai/aiagent/${aiAgentId}/functions/${functionId}/edit`,
          routeSiteId ?? siteId,
        ),
      get aiAgentLearningPattern() {
        return withSitePrefix('/ai/aiagent/:aiAgentId/learning', siteId)
      },
      aiAgentLearning: (aiAgentId: string = defaultAiAgentId, routeSiteId?: string) =>
        withSitePrefix(`/ai/aiagent/${aiAgentId}/learning`, routeSiteId ?? siteId),
      get aiAgentLearningUnansweredQuestionsPattern() {
        return withSitePrefix('/ai/aiagent/:aiAgentId/learning/unanswered-questions', siteId)
      },
      aiAgentLearningUnansweredQuestions: (
        aiAgentId: string = defaultAiAgentId,
        routeSiteId?: string,
      ) =>
        withSitePrefix(
          `/ai/aiagent/${aiAgentId}/learning/unanswered-questions`,
          routeSiteId ?? siteId,
        ),
      get aiAgentLearningThumbsDownAnswersPattern() {
        return withSitePrefix('/ai/aiagent/:aiAgentId/learning/thumbs-down-answers', siteId)
      },
      aiAgentLearningThumbsDownAnswers: (
        aiAgentId: string = defaultAiAgentId,
        routeSiteId?: string,
      ) =>
        withSitePrefix(
          `/ai/aiagent/${aiAgentId}/learning/thumbs-down-answers`,
          routeSiteId ?? siteId,
        ),
      get aiAgentInstructionsPattern() {
        return withSitePrefix('/ai/aiagent/:aiAgentId/overview/instructions', siteId)
      },
      aiAgentInstructions: (aiAgentId: string = defaultAiAgentId, routeSiteId?: string) =>
        withSitePrefix(`/ai/aiagent/${aiAgentId}/overview/instructions`, routeSiteId ?? siteId),
      get aiCopilot() {
        return withSitePrefix('/ai/aicopilot', siteId)
      },
      get aiInsights() {
        return withSitePrefix('/ai/aiinsights', siteId)
      },
      get aiInsightsSentimentAnalysis() {
        return withSitePrefix('/ai/aiinsights/sentiment-analysis', siteId)
      },
      get aiInsightsSpotlights() {
        return withSitePrefix('/ai/aiinsights/spotlights', siteId)
      },
      get aiInsightsSpotlightNew() {
        return withSitePrefix('/ai/aiinsights/spotlights/new', siteId)
      },
      get aiInsightsSpotlightEditPattern() {
        return withSitePrefix('/ai/aiinsights/spotlights/:spotlightId/edit', siteId)
      },
      aiInsightsSpotlightEdit: (spotlightId: string, routeSiteId?: string) =>
        withSitePrefix(`/ai/aiinsights/spotlights/${spotlightId}/edit`, routeSiteId ?? siteId),
      get aiInsightsChatResolutionStatus() {
        return withSitePrefix('/ai/aiinsights/chat-resolution-status', siteId)
      },
      get taskBot() {
        return withSitePrefix('/ai/taskbot', siteId)
      },
      get voiceBot() {
        return withSitePrefix('/ai/voicebot', siteId)
      },
    },
  }) as const

export const appRoutes = getAppRoutes()

export const legacyRoutes = {
  dashboard: '/dashboard',
  aiAgentPrefix: '/ai-agent',
  aiCopilot: '/ai-copilot',
  aiInsights: '/ai-insights',
  taskBot: '/task-bot',
  voiceBot: '/voice-bot',
} as const
