import { aiAgentHandlers } from './aiAgents'
import { functionHandlers } from './functions'
import { instructionHandlers } from './instructions'
import { spotlightHandlers } from './spotlights'
import { topicHandlers } from './topics'

export const handlers = [...aiAgentHandlers, ...functionHandlers, ...instructionHandlers, ...topicHandlers, ...spotlightHandlers]
