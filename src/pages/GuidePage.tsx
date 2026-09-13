import { Link, Navigate, useParams } from 'react-router-dom'
import exercises from '../data/exercises.json'
import { getGuide, guidePath } from '../lib/guides.ts'
import type { Exercise } from '../lib/types.ts'

const exerciseById = new Map((exercises as Exercise[]).map((exercise) => [exercise.id, exercise]))

export default function GuidePage() {
  const { slug = '' } = useParams()
  const guide = getGuide(slug)

  if (!guide) return <Navigate to="/guides" replace />

  return (
    <div className="container page-guide">
      <nav className="guide-breadcrumb" aria-label="面包屑">
        <Link to="/">动作百科</Link><span aria-hidden="true">/</span><Link to="/guides">训练专题</Link><span aria-hidden="true">/</span><span>{guide.title}</span>
      </nav>
      <article>
        <header className="guide-hero">
          <p className="mono-label">TRAINING GUIDE · 更新于 {guide.updatedAt}</p>
          <h1>{guide.title}</h1>
          <p className="guide-answer">{guide.answer}</p>
        </header>

        <div className="guide-content">
          <section>
            <h2>适用人群与频率</h2>
            <p>{guide.audience}</p>
            <p><strong>建议频率：</strong>{guide.frequency}</p>
          </section>
          <section>
            <h2>训练安排</h2>
            <ol>
              {guide.schedule.map((item) => <li key={item}>{item}</li>)}
            </ol>
          </section>
          <section>
            <h2>动作清单</h2>
            <div className="guide-exercise-list">
              {guide.exercises.map((item, index) => {
                const exercise = exerciseById.get(item.exerciseId)
                if (!exercise) return null
                return (
                  <article className="guide-exercise" key={item.exerciseId}>
                    <p className="mono-label">{String(index + 1).padStart(2, '0')}</p>
                    <h3><Link to={`/exercise/${exercise.id}`}>{exercise.name_zh}<span className="guide-exercise__en"> · {exercise.name}</span></Link></h3>
                    <p><strong>{item.prescription}</strong></p>
                    <p>{item.alternative}</p>
                    <Link className="guide-text-link" to={`/exercise/${exercise.id}`}>查看动作图解 <span aria-hidden="true">→</span></Link>
                  </article>
                )
              })}
            </div>
          </section>
          <section className="guide-safety">
            <h2>安全提示</h2>
            <ul>
              {guide.safetyNotes.map((note) => <li key={note}>{note}</li>)}
            </ul>
          </section>
          <section className="guide-source">
            <h2>来源与更新</h2>
            <p>{guide.sourceLabel}</p>
            <p>本页为一般训练信息，不替代医疗诊断或个体化训练指导。更多说明见 <Link to="/editorial-policy">资料来源与编辑原则</Link>。</p>
          </section>
        </div>
      </article>
      <Link className="guide-back" to={guidePath(guide.slug) === '/guides' ? '/' : '/guides'}>返回训练专题</Link>
    </div>
  )
}
