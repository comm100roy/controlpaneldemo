import type { TopicCategory } from './topics'

export const cloneTopicCategories = (categories: TopicCategory[]): TopicCategory[] =>
  categories.map((category) => ({
    ...category,
    children: category.children ? cloneTopicCategories(category.children) : undefined,
  }))

export const findTopicCategoryById = (
  categories: TopicCategory[],
  categoryId: string,
  parentId?: string,
): { node: TopicCategory; parentId?: string } | null => {
  for (const category of categories) {
    if (category.id === categoryId) {
      return { node: category, parentId }
    }

    if (category.children?.length) {
      const match = findTopicCategoryById(category.children, categoryId, category.id)
      if (match) {
        return match
      }
    }
  }

  return null
}

export const collectTopicCategoryIds = (category: TopicCategory): string[] => [
  category.id,
  ...(category.children?.flatMap(collectTopicCategoryIds) ?? []),
]

export const buildTopicCategoryOptions = (
  categories: TopicCategory[],
  excludedIds: string[] = [],
  parentPath = '',
): Array<{ id: string; label: string }> =>
  categories.flatMap((category) => {
    if (excludedIds.includes(category.id)) {
      return []
    }

    const currentPath =
      category.label === '/'
        ? '/'
        : parentPath === '/' || parentPath.length === 0
          ? `${parentPath}${category.label}`.replace(/^$/, category.label)
          : `${parentPath}/${category.label}`

    return [
      { id: category.id, label: currentPath },
      ...(category.children
        ? buildTopicCategoryOptions(category.children, excludedIds, currentPath)
        : []),
    ]
  })

export const insertTopicCategory = (
  categories: TopicCategory[],
  parentId: string,
  child: TopicCategory,
): TopicCategory[] =>
  categories.map((category) =>
    category.id === parentId
      ? {
          ...category,
          children: [...(category.children ?? []), child],
        }
      : {
          ...category,
          children: category.children
            ? insertTopicCategory(category.children, parentId, child)
            : undefined,
        },
  )

export const updateTopicCategoryTree = (
  categories: TopicCategory[],
  categoryId: string,
  updater: (category: TopicCategory) => TopicCategory,
): TopicCategory[] =>
  categories.map((category) =>
    category.id === categoryId
      ? updater(category)
      : {
          ...category,
          children: category.children
            ? updateTopicCategoryTree(category.children, categoryId, updater)
            : undefined,
        },
  )

export const removeTopicCategoryTree = (
  categories: TopicCategory[],
  categoryId: string,
): { removed?: TopicCategory; nextCategories: TopicCategory[] } => {
  let removedCategory: TopicCategory | undefined

  const nextCategories = categories
    .filter((category) => {
      if (category.id === categoryId) {
        removedCategory = category
        return false
      }

      return true
    })
    .map((category) => {
      if (!category.children?.length) {
        return category
      }

      const result = removeTopicCategoryTree(category.children, categoryId)
      removedCategory = removedCategory ?? result.removed

      return {
        ...category,
        children: result.nextCategories,
      }
    })

  return {
    removed: removedCategory,
    nextCategories,
  }
}

export const moveTopicCategoryTree = (
  categories: TopicCategory[],
  categoryId: string,
  nextParentId: string,
): TopicCategory[] => {
  const { removed, nextCategories } = removeTopicCategoryTree(categories, categoryId)

  if (!removed) {
    return categories
  }

  return insertTopicCategory(nextCategories, nextParentId, removed)
}
