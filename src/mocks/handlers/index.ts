import { aiAgentHandlers } from './aiAgents'
import { functionHandlers } from './functions'
import { spotlightHandlers } from './spotlights'
import { topicHandlers } from './topics'

export const handlers = [...aiAgentHandlers, ...functionHandlers, ...topicHandlers, ...spotlightHandlers]
