import exercises from '../data/exercises.json' with { type: 'json' }
import type { Exercise } from './types.ts'
import { CATEGORY_ZH, EQUIPMENT_ZH, TARGET_ZH, zh } from './zh.ts'

export type CollectionKind = 'body-part' | 'equipment' | 'muscle'

export interface Collection {
  kind: CollectionKind
  key: string
  slug: string
  label: string
  title: string
  count: number
}

const DATA = exercises as Exercise[]

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function buildCollections(
  kind: CollectionKind,
  values: string[],
  labels: Record<string, string>,
): Collection[] {
  const counts = new Map<string, number>()
  values.forEach((value) => counts.set(value, (counts.get(value) ?? 0) + 1))
  return [...counts.entries()]
    .map(([key, count]) => {
      const label = zh(key, labels)
      return {
        kind,
        key,
        slug: slugify(key),
        label,
        title: kind === 'muscle' ? `目标${label}动作` : `${label}动作`,
        count,
      }
    })
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label, 'zh-CN'))
}

export const COLLECTIONS: Collection[] = [
  ...buildCollections('body-part', DATA.map((exercise) => exercise.category), CATEGORY_ZH),
  ...buildCollections('equipment', DATA.map((exercise) => exercise.equipment), EQUIPMENT_ZH),
  ...buildCollections('muscle', DATA.map((exercise) => exercise.target), TARGET_ZH),
]

export function collectionPath(kind: CollectionKind, key: string): string {
  return `/browse/${kind}/${slugify(key)}`
}

export function getCollection(kind: string | undefined, slug: string | undefined): Collection | undefined {
  return COLLECTIONS.find((collection) => collection.kind === kind && collection.slug === slug)
}

export function exercisesForCollection(items: Exercise[], collection: Collection): Exercise[] {
  return items.filter((exercise) => {
    if (collection.kind === 'body-part') return exercise.category === collection.key
    if (collection.kind === 'equipment') return exercise.equipment === collection.key
    return exercise.target === collection.key
  })
}
