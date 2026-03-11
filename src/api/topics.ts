import type { TopicDefinition, TopicWithIncludes } from '../data/topics'

type BuildTopicsUrlOptions = {
  siteId: string
  aiAgentId: string
  topicId?: string
  include?: string[]
}

const buildTopicsUrl = ({ siteId, aiAgentId, topicId, include }: BuildTopicsUrlOptions) => {
  const searchParams = new URLSearchParams({ siteId, aiAgentId })

  if (include) {
    for (const entity of include) {
      searchParams.append('include', entity)
    }
  }

  const path = topicId ? `/api/aiagent/topics/${encodeURIComponent(topicId)}` : '/api/aiagent/topics'

  return `${path}?${searchParams.toString()}`
}

const getErrorMessage = async (response: Response, fallbackMessage: string) => {
  try {
    const data = (await response.json()) as { message?: string }
    return data.message ?? fallbackMessage
  } catch {
    return fallbackMessage
  }
}

export async function getTopics(siteId: string, aiAgentId: string): Promise<TopicDefinition[]> {
  const response = await fetch(buildTopicsUrl({ siteId, aiAgentId }))

  if (!response.ok) {
    throw new Error(await getErrorMessage(response, `Failed to load topics (${response.status})`))
  }

  return response.json() as Promise<TopicDefinition[]>
}

export async function getTopic(
  siteId: string,
  aiAgentId: string,
  topicId: string,
  options?: { include?: string[] },
): Promise<TopicWithIncludes> {
  const response = await fetch(
    buildTopicsUrl({ siteId, aiAgentId, topicId, include: options?.include }),
  )

  if (!response.ok) {
    throw new Error(await getErrorMessage(response, `Failed to load topic (${response.status})`))
  }

  return response.json() as Promise<TopicWithIncludes>
}

export async function createTopic(
  siteId: string,
  aiAgentId: string,
  topic: TopicDefinition,
): Promise<TopicDefinition> {
  const response = await fetch(buildTopicsUrl({ siteId, aiAgentId }), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(topic),
  })

  if (!response.ok) {
    throw new Error(await getErrorMessage(response, `Failed to create topic (${response.status})`))
  }

  return response.json() as Promise<TopicDefinition>
}

export async function updateTopic(
  siteId: string,
  aiAgentId: string,
  topic: TopicDefinition,
): Promise<TopicDefinition> {
  const response = await fetch(buildTopicsUrl({ siteId, aiAgentId, topicId: topic.id }), {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(topic),
  })

  if (!response.ok) {
    throw new Error(await getErrorMessage(response, `Failed to update topic (${response.status})`))
  }

  return response.json() as Promise<TopicDefinition>
}

export async function deleteTopic(
  siteId: string,
  aiAgentId: string,
  topicId: string,
): Promise<void> {
  const response = await fetch(buildTopicsUrl({ siteId, aiAgentId, topicId }), {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error(await getErrorMessage(response, `Failed to delete topic (${response.status})`))
  }
}
