import { Link } from 'react-router-dom'
import { guides } from '../data/guides.ts'
import { guidePath } from '../lib/guides.ts'

export default function GuideIndexPage() {
  return (
    <div className="container page-guide-index">
      <header className="guide-index-head">
        <p className="mono-label">TRAINING GUIDES</p>
        <h1>从“怎么练”开始</h1>
        <p>为已有明确目标的新手准备的训练安排。按目标、人群、器械或训练场景选择专题，先看完整计划，再进入动作详情核对姿势和替代方案。</p>
      </header>
      <section className="guide-index-list" aria-label="训练专题">
        {guides.map((guide) => (
          <article className="guide-index-item" key={guide.slug}>
            <p className="mono-label">{guide.frequency}</p>
            <h2><Link to={guidePath(guide.slug)}>{guide.title}</Link></h2>
            <p>{guide.description}</p>
            <Link className="guide-text-link" to={guidePath(guide.slug)}>查看训练安排 <span aria-hidden="true">→</span></Link>
          </article>
        ))}
      </section>
    </div>
  )
}
