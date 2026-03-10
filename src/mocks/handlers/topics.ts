import { http, HttpResponse } from 'msw'
import { type TopicCategory, type TopicDefinition } from '../../data/topics'
import { findTopicCategoryById, getRootTopicCategoryId } from '../../data/topicUtils'
import {
  createScopedTopic,
  createScopedTopicCategory,
  deleteScopedTopic,
  deleteScopedTopicCategory,
  getScopedTopic,
  getScopedTopicState,
  listScopedTopicCategories,
  listScopedTopics,
  updateScopedTopic,
  updateScopedTopicCategory,
} from './topicStore'

type TopicCategoryMutation = {
  label: string
  parentId: string
}

const createGuid = () => crypto.randomUUID()

const getRequiredQueryParams = (request: Request) => {
  const url = new URL(request.url)
  const siteId = url.searchParams.get('siteId')
  const aiAgentId = url.searchParams.get('aiAgentId')

  if (!siteId) {
    return {
      error: HttpResponse.json(
        { message: 'Missing required "siteId" query parameter.' },
        { status: 400 },
      ),
    }
  }

  if (!aiAgentId) {
    return {
      error: HttpResponse.json(
        { message: 'Missing required "aiAgentId" query parameter.' },
        { status: 400 },
      ),
    }
  }

  return { siteId, aiAgentId }
}

const getCategoryNotFoundResponse = (categoryId: string) =>
  HttpResponse.json(
    { message: `Topic category "${categoryId}" was not found.` },
    { status: 404 },
  )

const isCategoryPresent = (siteId: string, aiAgentId: string, categoryId: string) =>
  Boolean(findTopicCategoryById(getScopedTopicState(siteId, aiAgentId).categories, categoryId))

const isRootCategory = (siteId: string, aiAgentId: string, categoryId: string) =>
  getRootTopicCategoryId(getScopedTopicState(siteId, aiAgentId).categories) === categoryId

export const topicHandlers = [
  http.get('/api/aiagent/topic-categories', ({ request }) => {
    const requiredQueryParams = getRequiredQueryParams(request)
    if ('error' in requiredQueryParams) {
      return requiredQueryParams.error
    }

    return HttpResponse.json(
      listScopedTopicCategories(requiredQueryParams.siteId, requiredQueryParams.aiAgentId),
    )
  }),

  http.post('/api/aiagent/topic-categories', async ({ request }) => {
    const requiredQueryParams = getRequiredQueryParams(request)
    if ('error' in requiredQueryParams) {
      return requiredQueryParams.error
    }

    const nextCategory = (await request.json()) as TopicCategoryMutation
    const trimmedLabel = nextCategory.label.trim()
    const parentId = nextCategory.parentId.trim()

    if (trimmedLabel.length === 0 || parentId.length === 0) {
      return HttpResponse.json(
        { message: 'Category name and parent category are required.' },
        { status: 400 },
      )
    }

    if (!isCategoryPresent(requiredQueryParams.siteId, requiredQueryParams.aiAgentId, parentId)) {
      return getCategoryNotFoundResponse(parentId)
    }

    const createdCategory: TopicCategory = {
      id: createGuid(),
      label: trimmedLabel,
    }

    createScopedTopicCategory(
      requiredQueryParams.siteId,
      requiredQueryParams.aiAgentId,
      createdCategory,
      parentId,
    )

    return HttpResponse.json(createdCategory, { status: 201 })
  }),

  http.put('/api/aiagent/topic-categories/:categoryId', async ({ params, request }) => {
    const requiredQueryParams = getRequiredQueryParams(request)
    if ('error' in requiredQueryParams) {
      return requiredQueryParams.error
    }

    const categoryId = String(params.categoryId ?? '')
    if (!categoryId) {
      return HttpResponse.json({ message: 'Missing topic category id.' }, { status: 400 })
    }

    if (!isCategoryPresent(requiredQueryParams.siteId, requiredQueryParams.aiAgentId, categoryId)) {
      return getCategoryNotFoundResponse(categoryId)
    }

    const nextCategory = (await request.json()) as TopicCategoryMutation
    const trimmedLabel = nextCategory.label.trim()
    const parentId = nextCategory.parentId.trim()

    if (trimmedLabel.length === 0 || parentId.length === 0) {
      return HttpResponse.json(
        { message: 'Category name and parent category are required.' },
        { status: 400 },
      )
    }

    if (
      isRootCategory(requiredQueryParams.siteId, requiredQueryParams.aiAgentId, categoryId) &&
      parentId !== categoryId
    ) {
      return HttpResponse.json(
        { message: 'The root topic category cannot be moved.' },
        { status: 409 },
      )
    }

    if (!isCategoryPresent(requiredQueryParams.siteId, requiredQueryParams.aiAgentId, parentId)) {
      return getCategoryNotFoundResponse(parentId)
    }

    updateScopedTopicCategory(
      requiredQueryParams.siteId,
      requiredQueryParams.aiAgentId,
      categoryId,
      trimmedLabel,
      parentId,
    )

    return HttpResponse.json({
      id: categoryId,
      label: trimmedLabel,
    })
  }),

  http.delete('/api/aiagent/topic-categories/:categoryId', ({ params, request }) => {
    const requiredQueryParams = getRequiredQueryParams(request)
    if ('error' in requiredQueryParams) {
      return requiredQueryParams.error
    }

    const categoryId = String(params.categoryId ?? '')
    if (!categoryId) {
      return HttpResponse.json({ message: 'Missing topic category id.' }, { status: 400 })
    }

    if (isRootCategory(requiredQueryParams.siteId, requiredQueryParams.aiAgentId, categoryId)) {
      return HttpResponse.json(
        { message: 'The root topic category cannot be deleted.' },
        { status: 409 },
      )
    }

    const deletedCategory = deleteScopedTopicCategory(
      requiredQueryParams.siteId,
      requiredQueryParams.aiAgentId,
      categoryId,
    )

    if (!deletedCategory) {
      return getCategoryNotFoundResponse(categoryId)
    }

    return new HttpResponse(null, { status: 204 })
  }),

  http.get('/api/aiagent/topics', ({ request }) => {
    const requiredQueryParams = getRequiredQueryParams(request)
    if ('error' in requiredQueryParams) {
      return requiredQueryParams.error
    }

    return HttpResponse.json(listScopedTopics(requiredQueryParams.siteId, requiredQueryParams.aiAgentId))
  }),

  http.get('/api/aiagent/topics/:topicId', ({ params, request }) => {
    const requiredQueryParams = getRequiredQueryParams(request)
    if ('error' in requiredQueryParams) {
      return requiredQueryParams.error
    }

    const topicId = String(params.topicId ?? '')
    if (!topicId) {
      return HttpResponse.json({ message: 'Missing topic id.' }, { status: 400 })
    }

    const topic = getScopedTopic(requiredQueryParams.siteId, requiredQueryParams.aiAgentId, topicId)
    if (!topic) {
      return HttpResponse.json({ message: `Topic "${topicId}" was not found.` }, { status: 404 })
    }

    return HttpResponse.json(topic)
  }),

  http.post('/api/aiagent/topics', async ({ request }) => {
    const requiredQueryParams = getRequiredQueryParams(request)
    if ('error' in requiredQueryParams) {
      return requiredQueryParams.error
    }

    const nextTopic = (await request.json()) as TopicDefinition
    const trimmedName = nextTopic.name.trim()
    const trimmedDescription = nextTopic.description.trim()
    const categoryId = nextTopic.categoryId.trim()

    if (trimmedName.length === 0 || trimmedDescription.length === 0 || categoryId.length === 0) {
      return HttpResponse.json(
        { message: 'Topic name, description, and category are required.' },
        { status: 400 },
      )
    }

    if (!isCategoryPresent(requiredQueryParams.siteId, requiredQueryParams.aiAgentId, categoryId)) {
      return getCategoryNotFoundResponse(categoryId)
    }

    const createdTopic = createScopedTopic(requiredQueryParams.siteId, requiredQueryParams.aiAgentId, {
      ...nextTopic,
      id: createGuid(),
      name: trimmedName,
      description: trimmedDescription,
      categoryId,
      naturalLanguageInstructions: nextTopic.naturalLanguageInstructions.trim(),
      functionIds: nextTopic.functionIds ?? [],
    })

    return HttpResponse.json(createdTopic, { status: 201 })
  }),

  http.put('/api/aiagent/topics/:topicId', async ({ params, request }) => {
    const requiredQueryParams = getRequiredQueryParams(request)
    if ('error' in requiredQueryParams) {
      return requiredQueryParams.error
    }

    const topicId = String(params.topicId ?? '')
    if (!topicId) {
      return HttpResponse.json({ message: 'Missing topic id.' }, { status: 400 })
    }

    const nextTopic = (await request.json()) as TopicDefinition
    const trimmedName = nextTopic.name.trim()
    const trimmedDescription = nextTopic.description.trim()
    const categoryId = nextTopic.categoryId.trim()

    if (trimmedName.length === 0 || trimmedDescription.length === 0 || categoryId.length === 0) {
      return HttpResponse.json(
        { message: 'Topic name, description, and category are required.' },
        { status: 400 },
      )
    }

    if (!isCategoryPresent(requiredQueryParams.siteId, requiredQueryParams.aiAgentId, categoryId)) {
      return getCategoryNotFoundResponse(categoryId)
    }

    const updatedTopic = updateScopedTopic(requiredQueryParams.siteId, requiredQueryParams.aiAgentId, topicId, {
      ...nextTopic,
      name: trimmedName,
      description: trimmedDescription,
      categoryId,
      naturalLanguageInstructions: nextTopic.naturalLanguageInstructions.trim(),
      functionIds: nextTopic.functionIds ?? [],
    })

    if (!updatedTopic) {
      return HttpResponse.json({ message: `Topic "${topicId}" was not found.` }, { status: 404 })
    }

    return HttpResponse.json(updatedTopic)
  }),

  http.delete('/api/aiagent/topics/:topicId', ({ params, request }) => {
    const requiredQueryParams = getRequiredQueryParams(request)
    if ('error' in requiredQueryParams) {
      return requiredQueryParams.error
    }

    const topicId = String(params.topicId ?? '')
    if (!topicId) {
      return HttpResponse.json({ message: 'Missing topic id.' }, { status: 400 })
    }

    if (!deleteScopedTopic(requiredQueryParams.siteId, requiredQueryParams.aiAgentId, topicId)) {
      return HttpResponse.json({ message: `Topic "${topicId}" was not found.` }, { status: 404 })
    }

    return new HttpResponse(null, { status: 204 })
  }),
]
