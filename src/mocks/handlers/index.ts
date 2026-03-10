import { aiAgentHandlers } from './aiAgents'
import { functionHandlers } from './functions'

export const handlers = [...aiAgentHandlers, ...functionHandlers]
