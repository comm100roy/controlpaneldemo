import { aiAgentHandlers } from './aiAgents'
import { functionHandlers } from './functions'
import { spotlightHandlers } from './spotlights'

export const handlers = [...aiAgentHandlers, ...functionHandlers, ...spotlightHandlers]
