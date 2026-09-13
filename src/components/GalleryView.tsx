import { useEffect, useRef, useState } from 'react'
import type { Exercise } from '../lib/types'
import { CATEGORY_ZH, EQUIPMENT_ZH, TARGET_ZH, zh } from '../lib/zh'
import { publicAsset } from '../lib/assets'
import Lightbox from './Lightbox'

interface Props {
  items: Exercise[]
}

// 照片墙:黑白大图 + mono 展签 + 滚动交错入场 + hover 微交互
export default function GalleryView({ items }: Props) {
  const [open, setOpen] = useState<number | null>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  // 滚动交错入场(IntersectionObserver,尊重 reduced-motion)
  useEffect(() => {
    const root = gridRef.current
    if (!root) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const els = root.querySelectorAll('.g-item')
    const io = new IntersectionObserver(
      (entries) => {
        for (const en of entries) {
          if (en.isIntersecting) {
            en.target.classList.add('is-in')
            io.unobserve(en.target)
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [items])

  // 灯箱键盘导航
  useEffect(() => {
    if (open === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(null)
      if (e.key === 'ArrowRight') setOpen((i) => (i === null ? i : (i + 1) % items.length))
      if (e.key === 'ArrowLeft') setOpen((i) => (i === null ? i : (i - 1 + items.length) % items.length))
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, items.length])

  if (items.length === 0) return null

  return (
    <>
      <div ref={gridRef} className="g-wall" role="list" aria-label="动作照片墙">
        {items.map((ex, i) => (
          <button
            key={ex.id}
            role="listitem"
            className="g-item"
            onClick={() => setOpen(i)}
            aria-label={`查看 ${ex.name_zh}`}
            style={{ transitionDelay: `${(i % 6) * 45}ms` }}
          >
            <span className="g-item__frame">
              <img
                src={publicAsset(ex.image)}
                alt={ex.name_zh}
                loading="lazy"
                width={180}
                height={180}
                className="g-item__img g-item__jpg"
              />
              <img
                src={publicAsset(ex.gif)}
                alt=""
                aria-hidden="true"
                loading="lazy"
                width={180}
                height={180}
                className="g-item__img g-item__gif"
              />
            </span>
            <span className="g-item__label">
              <span className="g-item__no mono-label">{String(i + 1).padStart(3, '0')}</span>
              <span className="g-item__zh">{ex.name_zh}</span>
              <span className="g-item__en">{ex.name}</span>
              <span className="g-item__meta mono-label">
                {zh(ex.category, CATEGORY_ZH)} · {zh(ex.equipment, EQUIPMENT_ZH)} · {zh(ex.target, TARGET_ZH)}
              </span>
            </span>
          </button>
        ))}
      </div>

      {open !== null && items[open] && (
        <Lightbox
          ex={items[open]}
          index={open}
          total={items.length}
          onClose={() => setOpen(null)}
          onPrev={() => setOpen((open - 1 + items.length) % items.length)}
          onNext={() => setOpen((open + 1) % items.length)}
          neighbors={[items[open - 1] ?? null, items[open + 1] ?? null]}
        />
      )}
    </>
  )
}
