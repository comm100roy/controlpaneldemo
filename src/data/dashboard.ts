import type { InfoPanelItem } from '../components/dashboard/InfoPanel'
import type { InstructionRow } from '../components/dashboard/InstructionTable'
import type { StatItem } from '../components/dashboard/StatsGrid'
import { appRoutes } from './routes'

export const agentProfile = {
  badge: 'Paid',
  name: 'AI Agent',
  description:
    'A support agent that answers visitor questions on the website, providing accurate and helpful information in a friendly and professional manner.',
  capabilities: [
    'Stays On-Topic: responses are based solely on the provided Topics and Knowledge.',
    'Prevents Hallucination: blocks use of external knowledge or fabricated content.',
    'Filters Harmful Content: automatically blocks inappropriate or offensive material.',
    'Protects Privacy: does not collect, store, or share sensitive user information.',
  ],
  profile: [
    { label: 'Name', value: 'Eddy' },
    { label: 'Language', value: 'Friendly' },
    { label: 'Description', value: 'Live chat support specialist for website visitors.' },
  ],
  status: [
    { label: 'Channel', value: 'Live Chat' },
    { label: 'Publish Status', value: 'Published in 2 Live Chat Campaigns' },
    { label: 'Coverage', value: 'Active during business hours with fallback workflows' },
  ],
}

export const knowledgeStats: StatItem[] = [
  { label: 'Webpage', value: 0, caption: 'from 0 website pages' },
  { label: 'File', value: 0, caption: 'from uploaded files' },
  { label: 'KB Article', value: 0, caption: 'from UKB knowledge base' },
  { label: 'Cloud File', value: 0, caption: 'from cloud directory' },
  { label: 'Snippet', value: 0, caption: 'saved response snippets' },
]

export const overviewPanels: Array<{
  title: string
  description: string
  count: number
  items: InfoPanelItem[]
}> = [
  {
    title: 'Topics',
    description: 'User-defined subjects that guide AI Agent responses.',
    count: 1,
    items: [
      {
        title: 'Visitor transfer handling',
        description:
          'AI Agent must have a topic to handle visitor transfer requests; without it, AI Agent cannot transfer to human.',
        meta: 'Priority topic',
      },
    ],
  },
  {
    title: 'Instructions',
    description: 'Business-wide rules that define how AI Agent communicates.',
    count: 3,
    items: [
      {
        title: 'Friendly language',
        description:
          "AI Agent's response style, including tone, wording, length, and formatting, can be customized in Instructions.",
      },
      {
        title: 'Structured responses',
        description:
          'Use bullets for lists, numbered steps when useful, and clear sections for longer responses.',
      },
      {
        title: 'Brevity by default',
        description:
          'Keep simple answers to 1-2 sentences and expand only when the visitor needs more context.',
      },
    ],
  },
  {
    title: 'Events',
    description: 'Triggers that define how AI Agent interacts and responds.',
    count: 4,
    items: [
      {
        title: 'Event when a visitor starts a chat',
        description: 'Send a welcome message and suggest the top support topics.',
      },
      {
        title: 'Event after AI Agent completes an answer',
        description: 'Offer next-best actions or a follow-up question.',
      },
      {
        title: 'Event when AI Agent cannot answer visitor question',
        description: 'Escalate to human support or collect contact details.',
      },
      {
        title: 'Event when a visitor rates an answer as not helpful',
        description: 'Trigger improvement review and create a learning task.',
      },
    ],
  },
]

export const lowerMetrics = [
  {
    title: 'Functions',
    value: 0,
    description: 'Functions that the AI Agent executes to complete specific tasks.',
    countLabel: 'Functions',
    countHref: appRoutes.ai.aiAgentFunctions(),
  },
  {
    title: 'Learning',
    value: 0,
    description: 'Unanswered questions that require input to refine the response.',
    countLabel: 'Unanswered questions this week',
  },
  {
    title: 'Collected Leads',
    value: 0,
    description: 'Lead details captured by the AI Agent.',
    countLabel: 'Leads this week',
  },
  {
    title: 'Booked Meetings',
    value: 0,
    description: 'Meetings scheduled by the AI Agent.',
    countLabel: 'Meetings this week',
  },
]

export const dashboardMetrics = [
  {
    title: 'Active Automations',
    value: 12,
    caption: '8 customer-facing bots and 4 internal assistants are currently live.',
  },
  {
    title: 'Weekly Conversations',
    value: '4.2k',
    caption: 'Conversation volume is up 18% compared with last week.',
  },
  {
    title: 'Auto Resolution Rate',
    value: '72%',
    caption: 'Most questions are resolved without escalation during support hours.',
  },
  {
    title: 'Satisfaction Score',
    value: '4.8',
    caption: 'Average rating across AI Agent, AI Copilot, and Task Bot workflows.',
  },
]

export const dashboardPanels = {
  quickActions: [
    {
      title: 'Prepare AI Agent launch',
      description: 'Review knowledge, topics, and publishing before the next campaign goes live.',
      meta: 'Next milestone',
    },
    {
      title: 'Audit unresolved questions',
      description: 'Route unanswered visitor questions into learning tasks for review.',
      meta: 'Recommended today',
    },
    {
      title: 'Optimize conversion prompts',
      description: 'Tune event messaging for lead capture and booked meetings.',
      meta: 'Marketing alignment',
    },
  ] satisfies InfoPanelItem[],
  activity: [
    {
      title: 'Knowledge sync completed',
      description: 'The most recent website crawl finished successfully with no new pages detected.',
      meta: '12 minutes ago',
    },
    {
      title: 'Voice Bot draft updated',
      description: 'Outbound prompts were refreshed for the latest product launch flow.',
      meta: '47 minutes ago',
    },
    {
      title: 'AI Copilot enabled',
      description: 'The internal team assistant is now available to support agents in live chat.',
      meta: '1 hour ago',
    },
  ] satisfies InfoPanelItem[],
}

export const knowledgeHighlights = {
  stats: [
    { label: 'Published Sources', value: 12, caption: '11 webpages and 1 curated snippet' },
    { label: 'Pending Review', value: 4, caption: 'Awaiting QA approval before publishing' },
    { label: 'Last Sync', value: '2h', caption: 'Triggered from website content sync' },
    { label: 'Coverage Score', value: '89%', caption: 'Strong support coverage for top intents' },
  ] satisfies StatItem[],
  sources: [
    {
      title: 'Website Knowledge',
      description: 'Core product pages and FAQ entries synced from the main website.',
      meta: '11 active pages',
    },
    {
      title: 'Response Snippets',
      description: 'Short, approved answers for billing, account access, and refund questions.',
      meta: '8 snippets',
    },
    {
      title: 'Cloud Directory',
      description: 'Ready for future uploads from product collateral and onboarding decks.',
      meta: 'No files yet',
    },
  ] satisfies InfoPanelItem[],
}

export type KnowledgeRow = InstructionRow & {
  enabled: boolean
  type: 'File' | 'Snippet'
  updatedTime: string
  fileKind: 'txt' | 'pdf' | 'snippet'
  showInReference: boolean
}

export const knowledgeRows: KnowledgeRow[] = [
  {
    id: 'faq-txt',
    content: 'Comm100 Live Chat FAQ.txt',
    enabled: true,
    type: 'File',
    updatedTime: '2026/01/19 16:40:33',
    fileKind: 'txt',
    showInReference: true,
  },
  {
    id: 'on-premise-pdf',
    content: 'Comm100 Live Chat On Premise Setup...',
    enabled: false,
    type: 'File',
    updatedTime: '2026/01/19 16:40:40',
    fileKind: 'pdf',
    showInReference: false,
  },
  {
    id: 'qa-guide-pdf',
    content: 'Comm100_QA_Guide.pdf',
    enabled: true,
    type: 'File',
    updatedTime: '2026/01/19 16:40:42',
    fileKind: 'pdf',
    showInReference: true,
  },
  {
    id: 'customize-snippet',
    content: 'How to Customize My Chat Window Using...',
    enabled: true,
    type: 'Snippet',
    updatedTime: '2026/01/21 13:53:44',
    fileKind: 'snippet',
    showInReference: true,
  },
  {
    id: 'hp-user-guide',
    content: 'HP Laptop User Guide.pdf',
    enabled: true,
    type: 'File',
    updatedTime: '2026/01/19 16:40:50',
    fileKind: 'pdf',
    showInReference: true,
  },
  {
    id: 'hp-maintenance-guide',
    content: 'HP Maintenance and Service Guide.pdf',
    enabled: true,
    type: 'File',
    updatedTime: '2026/01/19 16:41:00',
    fileKind: 'pdf',
    showInReference: true,
  },
]

export const topicsLibrary: InfoPanelItem[] = [
  {
    title: 'Visitor transfer requests',
    description: 'Explains when the bot should escalate to a human and how to set expectations.',
    meta: 'Enabled',
  },
  {
    title: 'Pricing questions',
    description: 'Guides responses around plan comparison, usage limits, and upgrade paths.',
    meta: 'Draft',
  },
  {
    title: 'Booking flows',
    description: 'Covers rescheduling, confirmations, and handoff to booking automation.',
    meta: 'Enabled',
  },
]

export const eventAutomations: InfoPanelItem[] = [
  {
    title: 'Chat started',
    description: 'Welcomes the visitor and suggests the most common questions.',
    meta: 'Live',
  },
  {
    title: 'Answer completed',
    description: 'Suggests a follow-up prompt or relevant resource after each response.',
    meta: 'Live',
  },
  {
    title: 'Answer unavailable',
    description: 'Collects lead details and escalates to human support when confidence is low.',
    meta: 'Needs review',
  },
]

export type FunctionInputRow = {
  name: string
  type: string
  isRequired: string
  description: string
}

export type FunctionHeaderRow = {
  key: string
  value: string
}

export type FunctionOutputRow = {
  responseKey: string
  description: string
  saveToVariable: string
}

export type FunctionFormValues = {
  id: string
  name: string
  description: string
  authorizationRequired: boolean
  method: string
  url: string
  inputs: FunctionInputRow[]
  headers: FunctionHeaderRow[]
  body: string
  outputs: FunctionOutputRow[]
  usedInTopics: number
}

export const emptyFunctionFormValues: FunctionFormValues = {
  id: 'new',
  name: '',
  description: '',
  authorizationRequired: false,
  method: 'GET',
  url: '',
  inputs: [],
  headers: [],
  body: '1',
  outputs: [],
  usedInTopics: 0,
}

export const functionDefinitions: FunctionFormValues[] = [
  {
    id: 'get-order',
    name: 'Get_order',
    description:
      'Fetch order details and status information so the AI Agent can answer order-tracking questions.',
    authorizationRequired: true,
    method: 'GET',
    url: 'https://api.example.com/orders/{!Input.orderId}',
    inputs: [
      {
        name: 'orderId',
        type: 'String',
        isRequired: 'Yes',
        description: 'The unique order number from the customer.',
      },
      {
        name: 'email',
        type: 'String',
        isRequired: 'No',
        description: 'Optional email used to confirm the order owner.',
      },
    ],
    headers: [
      {
        key: 'Authorization',
        value: 'Bearer {!Variable.Token}',
      },
      {
        key: 'Content-Type',
        value: 'application/json',
      },
    ],
    body: '{\n  "orderId": "{!Input.orderId}",\n  "email": "{!Input.email}"\n}',
    outputs: [
      {
        responseKey: 'status',
        description: 'Current order status returned by the API.',
        saveToVariable: 'orderStatus',
      },
      {
        responseKey: 'trackingNumber',
        description: 'Tracking number for shipped orders.',
        saveToVariable: 'trackingNumber',
      },
    ],
    usedInTopics: 0,
  },
]

export const functionRows: InstructionRow[] = functionDefinitions.map((definition) => ({
  id: definition.id,
  content: definition.name,
  secondaryValue: definition.usedInTopics,
}))

export type TopicCategory = {
  id: string
  label: string
  children?: TopicCategory[]
}

export type TopicRow = InstructionRow & {
  categoryId: string
}

export type TopicAnswerMode = 'workflow' | 'natural-language'

export type TopicDefinition = {
  id: string
  name: string
  description: string
  categoryId: string
  answerMode: TopicAnswerMode
  naturalLanguageInstructions: string
  functionIds: string[]
}

export const topicCategories: TopicCategory[] = [
  {
    id: 'all',
    label: 'All Categories',
  },
  {
    id: 'root',
    label: '/',
    children: [
      {
        id: 'temp',
        label: 'Temp',
      },
    ],
  },
]

export const topicDefinitions: TopicDefinition[] = [
  {
    id: 'check-order-status',
    name: 'Check Order Status',
    description:
      'This topic handles all customer questions related to retrieving, viewing, or understanding the status of an order. When customers want to know where their order is in the fulfillment process, how long delivery will take, whether it has shipped, or any current progress updates, the request should be routed to this topic.',
    categoryId: 'root',
    answerMode: 'workflow',
    naturalLanguageInstructions:
      'Help customers check their order status. Ask for the order number when needed, confirm the most recent shipment stage, and offer the next helpful step if the order is delayed.',
    functionIds: ['get-order'],
  },
  {
    id: 'get-latest-comment',
    name: 'Get latest comment',
    description:
      'Use this topic when customers ask for the newest internal note or latest update attached to a support case or order.',
    categoryId: 'root',
    answerMode: 'natural-language',
    naturalLanguageInstructions:
      'Summarize the latest comment in plain language. Keep the answer short, highlight any action the customer should take next, and avoid exposing internal-only phrasing.',
    functionIds: ['get-order'],
  },
  {
    id: 'place-new-order-items',
    name: 'Place a new order with following items',
    description:
      'Guides customers through placing a new order that includes a predefined group of items.',
    categoryId: 'temp',
    answerMode: 'workflow',
    naturalLanguageInstructions:
      'Confirm the requested items, validate availability, and tell the customer what happens next after submission.',
    functionIds: [],
  },
  {
    id: 'test-google-api',
    name: 'Test google API',
    description:
      'A sandbox topic used to validate API-driven answer flows and troubleshooting responses.',
    categoryId: 'temp',
    answerMode: 'workflow',
    naturalLanguageInstructions:
      'Explain the API test outcome clearly, including any error details that a support agent may need to follow up on.',
    functionIds: [],
  },
  {
    id: 'test-json-response',
    name: 'Test JSON Response',
    description:
      'Used to verify that structured JSON payloads are transformed into readable customer-facing responses.',
    categoryId: 'temp',
    answerMode: 'natural-language',
    naturalLanguageInstructions:
      'Interpret the JSON response and convert it into concise customer-friendly language without exposing raw field names.',
    functionIds: [],
  },
]

export const topicRows: TopicRow[] = topicDefinitions.map((topic) => ({
  id: topic.id,
  content: topic.name,
  secondaryValue:
    topic.answerMode === 'workflow' ? 'Workflow' : 'Natural Language',
  categoryId: topic.categoryId,
}))

export type EventDefinition = {
  id: string
  name: string
  description: string
  answerMode: TopicAnswerMode
  naturalLanguageInstructions: string
  functionIds: string[]
}

export const eventDefinitions: EventDefinition[] = [
  {
    id: 'visitor-starts-chat',
    name: 'Event when a visitor starts a chat',
    description: 'Send a welcome message and suggest the top support topics.',
    answerMode: 'workflow',
    naturalLanguageInstructions:
      'Greet the visitor warmly, explain that the AI Agent can help, and suggest the most common support topics to get the conversation started.',
    functionIds: [],
  },
  {
    id: 'after-ai-agent-completes-answer',
    name: 'Event after AI Agent completes an answer',
    description: 'Offer next-best actions or a follow-up question.',
    answerMode: 'natural-language',
    naturalLanguageInstructions:
      'After answering, ask a concise follow-up question or suggest the next best action to keep the conversation moving forward.',
    functionIds: [],
  },
  {
    id: 'cannot-answer-visitor-question',
    name: 'Event when AI Agent cannot answer visitor question',
    description: 'Escalate to human support or collect contact details.',
    answerMode: 'natural-language',
    naturalLanguageInstructions:
      'Acknowledge the gap clearly, apologize briefly, and direct the visitor to a human agent or collect contact details for follow-up.',
    functionIds: ['create-ticket'],
  },
  {
    id: 'visitor-rates-answer-not-helpful',
    name: 'Event when a visitor rates an answer as not helpful',
    description: 'Trigger improvement review and create a learning task.',
    answerMode: 'natural-language',
    naturalLanguageInstructions:
      'Thank the visitor for the feedback, offer another form of help, and route the interaction for review so the AI Agent can improve.',
    functionIds: [],
  },
]

export const eventRows: InstructionRow[] = eventDefinitions.map((eventDefinition) => ({
  id: eventDefinition.id,
  content: eventDefinition.name,
}))

export const learningItems: InfoPanelItem[] = [
  {
    title: 'Refund policy for yearly plans',
    description: 'Visitor asked whether yearly subscriptions can be partially refunded after renewal.',
    meta: 'High frequency',
  },
  {
    title: 'Availability for weekend support',
    description: 'Bot needs clearer guidance on business hours and emergency escalation.',
    meta: 'Needs answer',
  },
  {
    title: 'Setup for multilingual FAQs',
    description: 'Customer requested support in multiple locales for the website knowledge source.',
    meta: 'Add knowledge',
  },
]

export const instructionRows: InstructionRow[] = [
  {
    id: 'friendly',
    content:
      'Use warm, welcoming, and conversational language. Show empathy with phrases like "I’d be happy to help" and maintain a positive, encouraging tone.',
  },
  {
    id: 'structure',
    content:
      'Structure responses for readability. Use bullet points for lists, numbered steps for processes, and clear spacing between topics.',
  },
  {
    id: 'brevity',
    content:
      'Keep responses brief by default. Aim for 1-2 sentences for simple questions and 2-3 short paragraphs for more complex topics.',
  },
]

export type InstructionTemplate = {
  id: string
  title: string
  description: string
}

export const instructionTemplates: InstructionTemplate[] = [
  {
    id: 'friendly-tone',
    title: 'Friendly Tone',
    description:
      'Use warm, welcoming, and conversational language. Show empathy with phrases like "I’d be happy to help" and "Great question." Maintain a positive and encouraging attitude.',
  },
  {
    id: 'neutral-tone',
    title: 'Neutral Tone',
    description:
      'Maintain balanced, objective tone. Present information factually without emotional language. Focus on accuracy and clarity while remaining professional and courteous.',
  },
  {
    id: 'professional-tone',
    title: 'Professional Tone',
    description:
      'Use formal, business-appropriate language with proper grammar. Avoid slang and casual expressions. Demonstrate expertise through clear, authoritative communication.',
  },
  {
    id: 'humorous-tone',
    title: 'Humorous Tone',
    description:
      'Incorporate appropriate humor and playful language when suitable. Keep humor tasteful and inclusive. Avoid humor when discussing complaints or sensitive topics.',
  },
  {
    id: 'text-formatting',
    title: 'Text Formatting',
    description:
      'Structure responses for readability. Use bullet points for lists, numbered lists for steps, and line breaks between topics. Organize complex information with clear sections.',
  },
  {
    id: 'written-style',
    title: 'Written Style',
    description:
      'Use formal written language with complete sentences. Avoid contractions. Use "cannot" instead of "can’t"; use "will not" instead of "won’t". Suitable for formal communications.',
  },
  {
    id: 'conversational-style',
    title: 'Conversational Style',
    description:
      'Write as if speaking naturally to the customer. Use contractions when useful and keep sentences short and direct with everyday vocabulary.',
  },
  {
    id: 'concise-responses',
    title: 'Concise Responses',
    description:
      'Keep responses brief. Aim for 1-2 sentences for simple questions and 2-3 for complex topics. Get straight to the answer without unnecessary elaboration.',
  },
  {
    id: 'standard-responses',
    title: 'Standard Responses',
    description:
      'Provide thorough responses with 3-5 sentences. Include necessary context and examples when helpful. Balance completeness with clarity.',
  },
  {
    id: 'emoji-use',
    title: 'Use Emoji',
    description:
      'Use 1-2 emojis per response to add warmth when appropriate. Examples: smiles for friendliness and check marks for confirmations. Avoid emoji in formal or serious contexts.',
  },
  {
    id: 'positive-language',
    title: 'Positive Language',
    description:
      'Focus on solutions and possibilities. Say "Here’s what we can do" instead of "We can’t do that." Lead with what is possible before explaining constraints.',
  },
  {
    id: 'simple-language',
    title: 'Simple Language',
    description:
      'Use clear, everyday words anyone can understand. Choose "help" over "facilitate" and "use" over "utilize." Explain technical terms simply when needed.',
  },
]

export const productSnapshots = {
  livechat: {
    title: 'Live Chat',
    description:
      'Monitor live conversations, automation coverage, and handoff readiness across customer-facing chat experiences.',
  },
  ticketing: {
    title: 'Ticketing & Messaging',
    description:
      'Review asynchronous support queues, message routing, and automation opportunities across ticket channels.',
  },
  voice: {
    title: 'Voice',
    description:
      'Track voice workflows, prompt readiness, and escalation coverage for inbound and outbound conversations.',
  },
  outreach: {
    title: 'Outreach',
    description:
      'Coordinate proactive campaigns, follow-up journeys, and response automation for outreach programs.',
  },
  queue: {
    title: 'Queue',
    description:
      'Balance demand, priority, and staffing signals across the operational queue experience.',
  },
  booking: {
    title: 'Booking',
    description:
      'Manage scheduling flows, meeting automation, and booking handoffs from conversational journeys.',
  },
  knowledgebase: {
    title: 'Knowledge Base',
    description:
      'Measure content coverage, publishing readiness, and knowledge health for self-service experiences.',
  },
  contact: {
    title: 'Contact',
    description:
      'Organize audience records, communication preferences, and customer contact readiness in one place.',
  },
  report: {
    title: 'Report',
    description:
      'Track performance trends, operational risks, and product outcomes across the control panel.',
  },
  globalsettings: {
    title: 'Global Settings',
    description:
      'Configure shared rules, workspace defaults, and cross-product operational settings.',
  },
  integrations: {
    title: 'Integrations',
    description:
      'Manage connected systems, sync health, and configuration status across external platforms.',
  },
  aicopilot: {
    title: 'AI Copilot',
    description:
      'Assist internal agents with suggested replies, summaries, and workflow shortcuts during live conversations.',
  },
  aiinsights: {
    title: 'AI Insights',
    description:
      'Monitor conversation trends, conversion signals, and operational gaps across all automation products.',
  },
  taskbot: {
    title: 'Task Bot',
    description:
      'Automate repeatable support and back-office tasks that can be triggered from AI Agent conversations.',
  },
  voicebot: {
    title: 'Voice Bot',
    description:
      'Handle scripted outbound or inbound voice flows with consistent prompts and follow-up routing.',
  },
}
