export const TRAINING_LIST_KEY = 'exercise-wiki-training-list'

export function toggleTrainingId(ids: string[], id: string): string[] {
  return ids.includes(id) ? ids.filter((item) => item !== id) : [...ids, id]
}

export function readTrainingIds(storage?: Pick<Storage, 'getItem'>): string[] {
  if (!storage) return []
  try {
    const value = storage.getItem(TRAINING_LIST_KEY)
    const parsed = value ? JSON.parse(value) : []
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === 'string') : []
  } catch {
    return []
  }
}
