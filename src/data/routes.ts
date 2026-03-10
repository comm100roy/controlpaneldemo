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

export const productDashboardPath = (level1: Level1Segment) => `/${level1}/dashboard`

export const resolveAiAgentId = (aiAgentId?: string) => aiAgentId || defaultAiAgentId

export const appRoutes = {
  home: '/ai/dashboard',
  ai: {
    root: '/ai',
    dashboard: '/ai/dashboard',
    aiAgentRoot: '/ai/aiagent',
    aiAgentBasePattern: '/ai/aiagent/:aiAgentId',
    aiAgentOverviewPattern: '/ai/aiagent/:aiAgentId/overview',
    aiAgentOverview: (aiAgentId: string = defaultAiAgentId) =>
      `/ai/aiagent/${aiAgentId}/overview`,
    aiAgentKnowledgePattern: '/ai/aiagent/:aiAgentId/knowledge',
    aiAgentKnowledge: (aiAgentId: string = defaultAiAgentId) =>
      `/ai/aiagent/${aiAgentId}/knowledge`,
    aiAgentTopicsPattern: '/ai/aiagent/:aiAgentId/topics',
    aiAgentTopics: (aiAgentId: string = defaultAiAgentId) =>
      `/ai/aiagent/${aiAgentId}/topics`,
    aiAgentTopicEditPattern: '/ai/aiagent/:aiAgentId/topics/:topicId/edit',
    aiAgentTopicEdit: (topicId: string, aiAgentId: string = defaultAiAgentId) =>
      `/ai/aiagent/${aiAgentId}/topics/${topicId}/edit`,
    aiAgentEventsPattern: '/ai/aiagent/:aiAgentId/events',
    aiAgentEvents: (aiAgentId: string = defaultAiAgentId) =>
      `/ai/aiagent/${aiAgentId}/events`,
    aiAgentEventEditPattern: '/ai/aiagent/:aiAgentId/events/:eventId/edit',
    aiAgentEventEdit: (eventId: string, aiAgentId: string = defaultAiAgentId) =>
      `/ai/aiagent/${aiAgentId}/events/${eventId}/edit`,
    aiAgentFunctionsPattern: '/ai/aiagent/:aiAgentId/functions',
    aiAgentFunctions: (aiAgentId: string = defaultAiAgentId) =>
      `/ai/aiagent/${aiAgentId}/functions`,
    aiAgentFunctionNewPattern: '/ai/aiagent/:aiAgentId/functions/new',
    aiAgentFunctionNew: (aiAgentId: string = defaultAiAgentId) =>
      `/ai/aiagent/${aiAgentId}/functions/new`,
    aiAgentFunctionEditPattern: '/ai/aiagent/:aiAgentId/functions/:functionId/edit',
    aiAgentFunctionEdit: (functionId: string, aiAgentId: string = defaultAiAgentId) =>
      `/ai/aiagent/${aiAgentId}/functions/${functionId}/edit`,
    aiAgentLearningPattern: '/ai/aiagent/:aiAgentId/learning',
    aiAgentLearning: (aiAgentId: string = defaultAiAgentId) =>
      `/ai/aiagent/${aiAgentId}/learning`,
    aiAgentLearningUnansweredQuestionsPattern:
      '/ai/aiagent/:aiAgentId/learning/unanswered-questions',
    aiAgentLearningUnansweredQuestions: (aiAgentId: string = defaultAiAgentId) =>
      `/ai/aiagent/${aiAgentId}/learning/unanswered-questions`,
    aiAgentLearningThumbsDownAnswersPattern:
      '/ai/aiagent/:aiAgentId/learning/thumbs-down-answers',
    aiAgentLearningThumbsDownAnswers: (aiAgentId: string = defaultAiAgentId) =>
      `/ai/aiagent/${aiAgentId}/learning/thumbs-down-answers`,
    aiAgentInstructionsPattern: '/ai/aiagent/:aiAgentId/overview/instructions',
    aiAgentInstructions: (aiAgentId: string = defaultAiAgentId) =>
      `/ai/aiagent/${aiAgentId}/overview/instructions`,
    aiCopilot: '/ai/aicopilot',
    aiInsights: '/ai/aiinsights',
    aiInsightsSentimentAnalysis: '/ai/aiinsights/sentiment-analysis',
    aiInsightsSpotlights: '/ai/aiinsights/spotlights',
    aiInsightsSpotlightNew: '/ai/aiinsights/spotlights/new',
    aiInsightsSpotlightEditPattern: '/ai/aiinsights/spotlights/:spotlightId/edit',
    aiInsightsSpotlightEdit: (spotlightId: string) => `/ai/aiinsights/spotlights/${spotlightId}/edit`,
    aiInsightsChatResolutionStatus: '/ai/aiinsights/chat-resolution-status',
    taskBot: '/ai/taskbot',
    voiceBot: '/ai/voicebot',
  },
} as const

export const legacyRoutes = {
  dashboard: '/dashboard',
  aiAgentPrefix: '/ai-agent',
  aiCopilot: '/ai-copilot',
  aiInsights: '/ai-insights',
  taskBot: '/task-bot',
  voiceBot: '/voice-bot',
} as const
