import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import exercises from '../data/exercises.json'
import { readTrainingIds, toggleTrainingId, TRAINING_LIST_KEY } from './trainingList'
import type { Exercise } from './types'

interface TrainingListContextValue {
  ids: string[]
  count: number
  has: (id: string) => boolean
  toggle: (id: string) => void
  clear: () => void
}

const TrainingListContext = createContext<TrainingListContextValue | null>(null)
const DATA = exercises as Exercise[]

export function TrainingListProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>(() => (
    typeof window === 'undefined' ? [] : readTrainingIds(window.localStorage)
  ))

  useEffect(() => {
    try {
      const validIds = ids.filter((id) => DATA.some((exercise) => exercise.id === id))
      window.localStorage.setItem(TRAINING_LIST_KEY, JSON.stringify(validIds))
    } catch {
      // Storage may be unavailable in private browsing or embedded contexts.
    }
  }, [ids])

  const value: TrainingListContextValue = {
    ids,
    count: ids.length,
    has: (id) => ids.includes(id),
    toggle: (id) => setIds((current) => toggleTrainingId(current, id)),
    clear: () => setIds([]),
  }

  return <TrainingListContext.Provider value={value}>{children}</TrainingListContext.Provider>
}

export function useTrainingList(): TrainingListContextValue {
  const value = useContext(TrainingListContext)
  if (!value) throw new Error('useTrainingList must be used inside TrainingListProvider')
  return value
}
