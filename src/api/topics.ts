import type { TopicCategory, TopicDefinition } from '../data/topics'

type TopicCategoryMutation = {
  label: string
  parentId: string
}

const buildScopedUrl = (
  path: '/api/aiagent/topic-categories' | '/api/aiagent/topics',
  siteId: string,
  aiAgentId: string,
  resourceId?: string,
) => {
  const searchParams = new URLSearchParams({ siteId, aiAgentId })
  const nextPath = resourceId ? `${path}/${encodeURIComponent(resourceId)}` : path

  return `${nextPath}?${searchParams.toString()}`
}

const getErrorMessage = async (response: Response, fallbackMessage: string) => {
  try {
    const data = (await response.json()) as { message?: string }
    return data.message ?? fallbackMessage
  } catch {
    return fallbackMessage
  }
}

export async function getTopicCategories(
  siteId: string,
  aiAgentId: string,
): Promise<TopicCategory[]> {
  const response = await fetch(buildScopedUrl('/api/aiagent/topic-categories', siteId, aiAgentId))

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(response, `Failed to load topic categories (${response.status})`),
    )
  }

  return response.json() as Promise<TopicCategory[]>
}

export async function createTopicCategory(
  siteId: string,
  aiAgentId: string,
  category: TopicCategoryMutation,
): Promise<TopicCategory> {
  const response = await fetch(buildScopedUrl('/api/aiagent/topic-categories', siteId, aiAgentId), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(category),
  })

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(response, `Failed to create topic category (${response.status})`),
    )
  }

  return response.json() as Promise<TopicCategory>
}

export async function updateTopicCategory(
  siteId: string,
  aiAgentId: string,
  categoryId: string,
  category: TopicCategoryMutation,
): Promise<TopicCategory> {
  const response = await fetch(
    buildScopedUrl('/api/aiagent/topic-categories', siteId, aiAgentId, categoryId),
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(category),
    },
  )

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(response, `Failed to update topic category (${response.status})`),
    )
  }

  return response.json() as Promise<TopicCategory>
}

export async function deleteTopicCategory(
  siteId: string,
  aiAgentId: string,
  categoryId: string,
): Promise<void> {
  const response = await fetch(
    buildScopedUrl('/api/aiagent/topic-categories', siteId, aiAgentId, categoryId),
    {
      method: 'DELETE',
    },
  )

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(response, `Failed to delete topic category (${response.status})`),
    )
  }
}

export async function getTopics(siteId: string, aiAgentId: string): Promise<TopicDefinition[]> {
  const response = await fetch(buildScopedUrl('/api/aiagent/topics', siteId, aiAgentId))

  if (!response.ok) {
    throw new Error(await getErrorMessage(response, `Failed to load topics (${response.status})`))
  }

  return response.json() as Promise<TopicDefinition[]>
}

export async function getTopic(
  siteId: string,
  aiAgentId: string,
  topicId: string,
): Promise<TopicDefinition> {
  const response = await fetch(buildScopedUrl('/api/aiagent/topics', siteId, aiAgentId, topicId))

  if (!response.ok) {
    throw new Error(await getErrorMessage(response, `Failed to load topic (${response.status})`))
  }

  return response.json() as Promise<TopicDefinition>
}

export async function createTopic(
  siteId: string,
  aiAgentId: string,
  topic: TopicDefinition,
): Promise<TopicDefinition> {
  const response = await fetch(buildScopedUrl('/api/aiagent/topics', siteId, aiAgentId), {
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
  const response = await fetch(buildScopedUrl('/api/aiagent/topics', siteId, aiAgentId, topic.id), {
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
  const response = await fetch(buildScopedUrl('/api/aiagent/topics', siteId, aiAgentId, topicId), {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error(await getErrorMessage(response, `Failed to delete topic (${response.status})`))
  }
}
