import type { TopicCategory } from '../data/topicCategories'

type TopicCategoryMutation = {
  label: string
  parentId: string
}

const buildTopicCategoriesUrl = (siteId: string, aiAgentId: string, categoryId?: string) => {
  const searchParams = new URLSearchParams({ siteId, aiAgentId })
  const path = categoryId
    ? `/api/aiagent/topic-categories/${encodeURIComponent(categoryId)}`
    : '/api/aiagent/topic-categories'

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

export async function getTopicCategories(
  siteId: string,
  aiAgentId: string,
): Promise<TopicCategory[]> {
  const response = await fetch(buildTopicCategoriesUrl(siteId, aiAgentId))

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
  const response = await fetch(buildTopicCategoriesUrl(siteId, aiAgentId), {
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
  const response = await fetch(buildTopicCategoriesUrl(siteId, aiAgentId, categoryId), {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(category),
  })

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
  const response = await fetch(buildTopicCategoriesUrl(siteId, aiAgentId, categoryId), {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(response, `Failed to delete topic category (${response.status})`),
    )
  }
}
