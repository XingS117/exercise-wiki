import { useCallback, useEffect, useState } from 'react'

export type ViewMode = 'grid' | 'gallery'

const KEY = 'exercise-wiki-view'

export function useViewMode(): [ViewMode, (m: ViewMode) => void] {
  const [mode, setMode] = useState<ViewMode>(() => {
    const saved = typeof localStorage !== 'undefined' ? localStorage.getItem(KEY) : null
    return saved === 'gallery' ? 'gallery' : 'grid'
  })

  useEffect(() => {
    document.body.classList.toggle('gallery-mode', mode === 'gallery')
  }, [mode])

  const switchMode = useCallback((m: ViewMode) => {
    setMode(m)
    try {
      localStorage.setItem(KEY, m)
    } catch {
      /* ignore */
    }
  }, [])

  return [mode, switchMode]
}
