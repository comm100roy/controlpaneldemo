export type TopicCategory = {
  id: string
  label: string
  children?: TopicCategory[]
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

export const rootTopicCategoryId = 'root'

export const seedTopicCategories: TopicCategory[] = [
  {
    id: rootTopicCategoryId,
    label: '/',
    children: [
      {
        id: 'temp',
        label: 'Temp',
      },
    ],
  },
]

export const seedTopicDefinitions: TopicDefinition[] = [
  {
    id: 'check-order-status',
    name: 'Check Order Status',
    description:
      'This topic handles all customer questions related to retrieving, viewing, or understanding the status of an order. When customers want to know where their order is in the fulfillment process, how long delivery will take, whether it has shipped, or any current progress updates, the request should be routed to this topic.',
    categoryId: rootTopicCategoryId,
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
    categoryId: rootTopicCategoryId,
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
