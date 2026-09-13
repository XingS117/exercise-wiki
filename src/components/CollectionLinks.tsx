import { Link } from 'react-router-dom'
import type { Collection } from '../lib/collections'
import { collectionPath } from '../lib/collections'

interface Props {
  title: string
  items: Collection[]
  compact?: boolean
}

export default function CollectionLinks({ title, items, compact = false }: Props) {
  if (items.length === 0) return null

  return (
    <section className={'browse-links' + (compact ? ' browse-links--compact' : '')} aria-label={title}>
      <div className="browse-links__head">
        <h2 className="browse-links__title">{title}</h2>
        <span className="mono-label">{items.length} 个入口</span>
      </div>
      <div className="browse-links__list">
        {items.map((collection, index) => (
          <Link key={`${collection.kind}-${collection.key}`} to={collectionPath(collection.kind, collection.key)} className="browse-link">
            <span className="browse-link__index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
            <span className="browse-link__label">{collection.label}</span>
            <span className="browse-link__count mono-label">{collection.count}</span>
            <span className="browse-link__arrow" aria-hidden="true">↗</span>
          </Link>
        ))}
      </div>
    </section>
  )
}
