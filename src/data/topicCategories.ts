export type TopicCategory = {
  id: string
  label: string
  children?: TopicCategory[]
}

export type TopicCategorySeed = {
  seedId: string
  label: string
  children?: TopicCategorySeed[]
}

export const seedTopicCategories: TopicCategorySeed[] = [
  {
    seedId: 'root',
    label: '/',
    children: [
      {
        seedId: 'temp',
        label: 'Temp',
      },
    ],
  },
]
