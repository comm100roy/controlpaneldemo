import {
  seedTopicCategories,
  seedTopicDefinitions,
  type TopicCategorySeed,
  type TopicCategory,
  type TopicDefinition,
} from '../../data/topics'
import {
  cloneTopicCategories,
  collectTopicCategoryIds,
  findTopicCategoryById,
  getRootTopicCategoryId,
  insertTopicCategory,
  moveTopicCategoryTree,
  removeTopicCategoryTree,
  updateTopicCategoryTree,
} from '../../data/topicUtils'

type ScopedTopicState = {
  categories: TopicCategory[]
  topics: TopicDefinition[]
}

const topicsByScope = new Map<string, ScopedTopicState>()
const createGuid = () => crypto.randomUUID()

const cloneTopicDefinition = (topic: TopicDefinition): TopicDefinition => ({
  ...topic,
  functionIds: [...topic.functionIds],
})

const cloneTopicDefinitions = (topics: TopicDefinition[]) => topics.map(cloneTopicDefinition)

const materializeSeedCategories = (
  categorySeeds: TopicCategorySeed[],
  categoryIdBySeedId: Map<string, string>,
): TopicCategory[] =>
  categorySeeds.map((categorySeed) => {
    const categoryId = createGuid()
    categoryIdBySeedId.set(categorySeed.seedId, categoryId)

    return {
      id: categoryId,
      label: categorySeed.label,
      children: categorySeed.children
        ? materializeSeedCategories(categorySeed.children, categoryIdBySeedId)
        : undefined,
    }
  })

const createSeedTopicState = (): ScopedTopicState => {
  const categoryIdBySeedId = new Map<string, string>()
  const categories = materializeSeedCategories(seedTopicCategories, categoryIdBySeedId)

  return {
    categories,
    topics: seedTopicDefinitions.map((topicSeed) => ({
      id: createGuid(),
      name: topicSeed.name,
      description: topicSeed.description,
      categoryId: categoryIdBySeedId.get(topicSeed.categorySeedId) ?? '',
      answerMode: topicSeed.answerMode,
      naturalLanguageInstructions: topicSeed.naturalLanguageInstructions,
      functionIds: [...topicSeed.functionIds],
    })),
  }
}

const createEmptyTopicState = (): ScopedTopicState => ({
  categories: [
    {
      id: createGuid(),
      label: '/',
      children: [],
    },
  ],
  topics: [],
})

const getScopeKey = (siteId: string, aiAgentId: string) => `${siteId}:${aiAgentId}`

export const getScopedTopicState = (siteId: string, aiAgentId: string): ScopedTopicState => {
  const scopeKey = getScopeKey(siteId, aiAgentId)
  const existingState = topicsByScope.get(scopeKey)

  if (existingState) {
    return existingState
  }

  const seededState = createSeedTopicState()
  topicsByScope.set(scopeKey, seededState)
  return seededState
}

export const createEmptyTopicStateForAgent = (siteId: string, aiAgentId: string) => {
  const scopeKey = getScopeKey(siteId, aiAgentId)
  const nextState = createEmptyTopicState()
  topicsByScope.set(scopeKey, nextState)
  return nextState
}

export const deleteScopedTopicState = (siteId: string, aiAgentId: string) => {
  topicsByScope.delete(getScopeKey(siteId, aiAgentId))
}

export const createScopedTopicCategory = (
  siteId: string,
  aiAgentId: string,
  category: TopicCategory,
  parentId: string,
) => {
  const scopedState = getScopedTopicState(siteId, aiAgentId)
  scopedState.categories = insertTopicCategory(scopedState.categories, parentId, category)
}

export const updateScopedTopicCategory = (
  siteId: string,
  aiAgentId: string,
  categoryId: string,
  nextLabel: string,
  nextParentId: string,
) => {
  const scopedState = getScopedTopicState(siteId, aiAgentId)
  const rootCategoryId = getRootTopicCategoryId(scopedState.categories)
  const currentParentId =
    findTopicCategoryById(scopedState.categories, categoryId)?.parentId ?? rootCategoryId ?? ''

  const renamedCategories = updateTopicCategoryTree(scopedState.categories, categoryId, (category) => ({
    ...category,
    label: nextLabel,
  }))

  scopedState.categories =
    currentParentId === nextParentId
      ? renamedCategories
      : moveTopicCategoryTree(renamedCategories, categoryId, nextParentId)
}

export const deleteScopedTopicCategory = (siteId: string, aiAgentId: string, categoryId: string) => {
  const scopedState = getScopedTopicState(siteId, aiAgentId)
  const rootCategoryId = getRootTopicCategoryId(scopedState.categories)
  const { removed, nextCategories } = removeTopicCategoryTree(scopedState.categories, categoryId)

  if (!removed || !rootCategoryId) {
    return null
  }

  const removedCategoryIds = new Set(collectTopicCategoryIds(removed))

  scopedState.categories = nextCategories
  scopedState.topics = scopedState.topics.map((topic) =>
    removedCategoryIds.has(topic.categoryId)
      ? {
          ...topic,
          categoryId: rootCategoryId,
        }
      : topic,
  )

  return removed
}

export const listScopedTopicCategories = (siteId: string, aiAgentId: string) =>
  cloneTopicCategories(getScopedTopicState(siteId, aiAgentId).categories)

export const listScopedTopics = (siteId: string, aiAgentId: string) =>
  cloneTopicDefinitions(getScopedTopicState(siteId, aiAgentId).topics)

export const getScopedTopic = (siteId: string, aiAgentId: string, topicId: string) => {
  const topic = getScopedTopicState(siteId, aiAgentId).topics.find((item) => item.id === topicId)
  return topic ? cloneTopicDefinition(topic) : null
}

export const createScopedTopic = (siteId: string, aiAgentId: string, topic: TopicDefinition) => {
  const scopedState = getScopedTopicState(siteId, aiAgentId)
  const nextTopic = cloneTopicDefinition(topic)
  scopedState.topics.unshift(nextTopic)
  return nextTopic
}

export const updateScopedTopic = (
  siteId: string,
  aiAgentId: string,
  topicId: string,
  nextTopic: TopicDefinition,
) => {
  const scopedState = getScopedTopicState(siteId, aiAgentId)
  const topicIndex = scopedState.topics.findIndex((topic) => topic.id === topicId)

  if (topicIndex === -1) {
    return null
  }

  const updatedTopic = cloneTopicDefinition({
    ...nextTopic,
    id: topicId,
  })

  scopedState.topics[topicIndex] = updatedTopic
  return updatedTopic
}

export const deleteScopedTopic = (siteId: string, aiAgentId: string, topicId: string) => {
  const scopedState = getScopedTopicState(siteId, aiAgentId)
  const topicIndex = scopedState.topics.findIndex((topic) => topic.id === topicId)

  if (topicIndex === -1) {
    return false
  }

  scopedState.topics.splice(topicIndex, 1)
  return true
}
