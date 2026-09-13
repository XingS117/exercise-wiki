import { Link, useParams } from 'react-router-dom'
import exercises from '../data/exercises.json'
import type { Exercise } from '../lib/types'
import { CATEGORY_ZH, EQUIPMENT_ZH, TARGET_ZH, MUSCLE_ZH, zh } from '../lib/zh'
import ExerciseCard from '../components/ExerciseCard'
import { publicAsset } from '../lib/assets'
import { collectionPath } from '../lib/collections'
import { useTrainingList } from '../lib/trainingListContext'

const DATA = exercises as Exercise[]

export default function ExercisePage(_props: { mode?: 'grid' | 'gallery' }) {
  const { id } = useParams()
  const ex = DATA.find((e) => e.id === id)

  if (!ex) {
    return (
      <div className="container page-detail">
        <div className="empty">
          <h2>未找到该动作</h2>
          <Link to="/" className="btn btn--soft">返回动作库</Link>
        </div>
      </div>
    )
  }

  const related = DATA.filter((e) => e.target === ex.target && e.id !== ex.id)
    .slice(0, 6)
  const substitutes = DATA.filter((e) => e.target === ex.target && e.equipment !== ex.equipment && e.id !== ex.id)
    .slice(0, 4)
  const { has, toggle } = useTrainingList()
  const inTrainingList = has(ex.id)

  const meta: Array<[string, string]> = [
    ['身体部位', zh(ex.category, CATEGORY_ZH)],
    ['所需器械', zh(ex.equipment, EQUIPMENT_ZH)],
    ['肌群', zh(ex.target, TARGET_ZH)],
    ['协同肌群', zh(ex.muscle_group, MUSCLE_ZH)],
  ]

  return (
    <div className="container page-detail">
      <Link to="/" className="back-link">← 返回动作库</Link>

      <section className="detail-hero">
        <div className="detail-media">
          <img
            src={publicAsset(ex.gif)}
            alt={`${ex.name_zh} 动作演示`}
            width={360}
            height={360}
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
          <p className="detail-media__hint mono-label">动画演示 · 悬停即播</p>
        </div>
        <div className="detail-info">
          <p className="mono-label">{ex.id}</p>
          <h1 className="detail-title">{ex.name_zh}</h1>
          <p className="detail-en">English name · 英文动作名：{ex.name}</p>
          <dl className="detail-meta">
            {meta.map(([k, v]) => {
              const path = k === '身体部位'
                ? collectionPath('body-part', ex.category)
                : k === '所需器械'
                  ? collectionPath('equipment', ex.equipment)
                  : k === '肌群'
                    ? collectionPath('muscle', ex.target)
                    : null
              return (
                <div key={k} className="detail-meta__row">
                  <dt>{k}</dt>
                  <dd>
                    {path ? <Link to={path} className="tag tag--pear">{v}</Link> : <span className="tag tag--pear">{v}</span>}
                  </dd>
                </div>
              )
            })}
            {ex.secondary_muscles.length > 0 && (
              <div className="detail-meta__row">
                <dt>次要用力</dt>
                <dd className="detail-meta__muscles">
                  {ex.secondary_muscles.slice(0, 6).map((m) => (
                    <span key={m} className="tag tag--mint">{zh(m, MUSCLE_ZH)}</span>
                  ))}
                </dd>
              </div>
            )}
          </dl>
          <button
            type="button"
            className={'training-toggle' + (inTrainingList ? ' training-toggle--active' : '')}
            onClick={() => toggle(ex.id)}
            aria-pressed={inTrainingList}
          >
            {inTrainingList ? '已加入训练清单' : '加入训练清单'}
          </button>
        </div>
      </section>

      <section className="detail-steps" aria-label="分步说明">
        <h2 className="section-head">怎么做</h2>
        <ol className="steps-list">
          {ex.steps.map((step, i) => (
            <li key={i} className="steps-item">
              <span className="steps-item__num" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <p>{step}</p>
            </li>
          ))}
        </ol>
      </section>

      {related.length > 0 && (
        <section className="detail-related" aria-label="相关动作">
          <h2 className="section-head">
            同练{zh(ex.target, TARGET_ZH)}的动作
            <span className="section-head__count mono-label">{related.length}+</span>
          </h2>
          <div className="card-grid">
            {related.map((r) => (
              <ExerciseCard key={r.id} ex={r} />
            ))}
          </div>
        </section>
      )}

      {substitutes.length > 0 && (
        <section className="detail-related" aria-label="替代动作">
          <h2 className="section-head">没有这个器械？试试这些</h2>
          <div className="card-grid">
            {substitutes.map((r) => <ExerciseCard key={r.id} ex={r} />)}
          </div>
        </section>
      )}
    </div>
  )
}
