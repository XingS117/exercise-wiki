import { Link, useParams } from 'react-router-dom'
import exercises from '../data/exercises.json'
import CollectionLinks from '../components/CollectionLinks'
import ExerciseCard from '../components/ExerciseCard'
import type { Exercise } from '../lib/types'
import { COLLECTIONS, exercisesForCollection, getCollection } from '../lib/collections'

const DATA = exercises as Exercise[]

export default function CollectionPage() {
  const { kind, slug } = useParams()
  const collection = getCollection(kind, slug)

  if (!collection) {
    return (
      <div className="container page-detail">
        <div className="empty">
          <h1>未找到这个动作专题</h1>
          <Link to="/" className="btn btn--soft">返回动作库</Link>
        </div>
      </div>
    )
  }

  const results = exercisesForCollection(DATA, collection)
  const alternatives = COLLECTIONS
    .filter((item) => item.kind === collection.kind && item.key !== collection.key)
    .slice(0, 10)

  return (
    <div className="container page-collection">
      <Link to="/" className="back-link">← 返回动作库</Link>
      <header className="collection-head">
        <p className="mono-label">Browse · {collection.kind}</p>
        <h1>{collection.title}</h1>
        <p className="collection-head__sub">
          共 {results.length} 个动作，查看动画演示、动作步骤和相关训练动作。
        </p>
      </header>

      <div className="collection-result-bar">
        <span>找到 <b>{results.length}</b> 个动作</span>
        <Link to="/" className="btn btn--soft btn--sm">打开全部筛选</Link>
      </div>

      <div className="card-grid collection-grid">
        {results.map((exercise) => <ExerciseCard key={exercise.id} ex={exercise} />)}
      </div>

      <CollectionLinks title="继续探索" items={alternatives} compact />
    </div>
  )
}
