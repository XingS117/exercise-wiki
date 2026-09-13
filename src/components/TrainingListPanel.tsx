import { useState } from 'react'
import { Link } from 'react-router-dom'
import exercises from '../data/exercises.json'
import { useTrainingList } from '../lib/trainingListContext'
import type { Exercise } from '../lib/types'

const DATA = exercises as Exercise[]

export default function TrainingListPanel() {
  const { ids, count, toggle, clear } = useTrainingList()
  const [open, setOpen] = useState(false)
  const selected = ids.map((id) => DATA.find((exercise) => exercise.id === id)).filter((item): item is Exercise => !!item)

  if (count === 0) return null

  return (
    <aside className={'training-list' + (open ? ' training-list--open' : '')} aria-label="训练清单">
      {open && (
        <div className="training-list__panel">
          <div className="training-list__head">
            <div>
              <p className="mono-label">Training list</p>
              <h2>训练清单 <span>{selected.length}</span></h2>
            </div>
            <button type="button" className="training-list__close" onClick={() => setOpen(false)} aria-label="关闭训练清单">×</button>
          </div>
          <ol className="training-list__items">
            {selected.map((exercise, index) => (
              <li key={exercise.id}>
                <span className="training-list__number">{String(index + 1).padStart(2, '0')}</span>
                <Link to={`/exercise/${exercise.id}`} onClick={() => setOpen(false)}>{exercise.name_zh}</Link>
                <button type="button" onClick={() => toggle(exercise.id)} aria-label={`移除${exercise.name_zh}`}>×</button>
              </li>
            ))}
          </ol>
          <button type="button" className="btn btn--soft btn--sm training-list__clear" onClick={clear}>清空清单</button>
        </div>
      )}
      <div className="training-list__bar">
        <span><b>{count}</b> 个动作已加入训练清单</span>
        <button type="button" className="btn btn--sm btn--cyan" onClick={() => setOpen((value) => !value)} aria-expanded={open}>
          {open ? '收起' : '查看清单'}
        </button>
      </div>
    </aside>
  )
}
