export type AiAgentChannelKind = 'chat' | 'dot'

export type AiAgentRecord = {
  id: string
  name: string
  subtitle: string
  type: 'AI Agent' | 'Classic' | 'Third Party'
  language: string
  channelLabel: string
  channelCount: number
  channelKinds: AiAgentChannelKind[]
  paymentStatus: 'Paid' | 'Trial'
}

export const defaultAiAgentId = 'eddy'
export const paidAiAgentsLimit = 101
export const additionalPaidAiAgentsCount = 70

export const aiAgentRecords: AiAgentRecord[] = [
  {
    id: 'eddy',
    name: 'Eddy',
    subtitle: 'Primary live chat agent',
    type: 'AI Agent',
    language: 'English',
    channelLabel: 'Live Chat',
    channelCount: 1,
    channelKinds: ['chat'],
    paymentStatus: 'Paid',
  },
  {
    id: 'william-rag',
    name: 'William AI Agent RAG V2',
    subtitle: 'Retrieval-augmented support assistant',
    type: 'AI Agent',
    language: 'English',
    channelLabel: 'Messaging',
    channelCount: 0,
    channelKinds: ['chat'],
    paymentStatus: 'Paid',
  },
  {
    id: 'cute-classic',
    name: 'Cute Classic NLP_old',
    subtitle: 'Legacy NLP bot',
    type: 'Classic',
    language: 'English',
    channelLabel: 'Messaging',
    channelCount: 1,
    channelKinds: ['chat', 'dot', 'dot', 'dot', 'dot', 'dot'],
    paymentStatus: 'Paid',
  },
  {
    id: 'karas-demo',
    name: 'Karas - Demo',
    subtitle: 'Demo bot',
    type: 'AI Agent',
    language: 'English',
    channelLabel: 'Live Chat',
    channelCount: 1,
    channelKinds: ['chat'],
    paymentStatus: 'Paid',
  },
  {
    id: 'karas-v2',
    name: 'Karas AI Agent V2',
    subtitle: 'Production bot',
    type: 'AI Agent',
    language: 'English',
    channelLabel: 'Live Chat',
    channelCount: 1,
    channelKinds: ['chat'],
    paymentStatus: 'Paid',
  },
  {
    id: 'survey-testing',
    name: 'Survey Testing',
    subtitle: 'Survey workflow bot',
    type: 'AI Agent',
    language: 'English',
    channelLabel: 'Messaging',
    channelCount: 0,
    channelKinds: ['chat'],
    paymentStatus: 'Paid',
  },
  {
    id: 'third-test',
    name: '3rd test',
    subtitle: 'Testing bot',
    type: 'Third Party',
    language: '-',
    channelLabel: 'Messaging',
    channelCount: 0,
    channelKinds: ['chat'],
    paymentStatus: 'Paid',
  },
  {
    id: 'nick-test',
    name: 'Nick Test',
    subtitle: 'Testing bot',
    type: 'AI Agent',
    language: 'English',
    channelLabel: 'Live Chat',
    channelCount: 1,
    channelKinds: ['chat'],
    paymentStatus: 'Paid',
  },
  {
    id: 'james-v2',
    name: 'James AI Agent V2',
    subtitle: 'Automation bot',
    type: 'AI Agent',
    language: 'English',
    channelLabel: 'Live Chat',
    channelCount: 1,
    channelKinds: ['chat'],
    paymentStatus: 'Paid',
  },
  {
    id: 'jack-cn',
    name: 'jack ai v2 - cn',
    subtitle: 'Chinese support bot',
    type: 'AI Agent',
    language: 'Chinese (Simplified)',
    channelLabel: 'Live Chat',
    channelCount: 1,
    channelKinds: ['chat'],
    paymentStatus: 'Paid',
  },
]

export const getAiAgentRecord = (aiAgentId?: string) =>
  aiAgentRecords.find((agent) => agent.id === aiAgentId) ?? aiAgentRecords[0]
