import { useEffect, useMemo, useRef, useState } from 'react'
import type { Exercise } from '../lib/types'
import { CATEGORY_ZH, EQUIPMENT_ZH, TARGET_ZH, zh } from '../lib/zh'
import { publicAsset } from '../lib/assets'
import GalleryView from './GalleryView'

interface Props {
  items: Exercise[] // 已按搜索/器械/目标筛选(传进来的是上层过滤后的数据)
}

// 部位门户数据:10 大部位 + 代表图/动画 + 计数
function buildZones(all: Exercise[]) {
  const order = [
    'chest', 'back', 'shoulders', 'upper arms', 'lower arms',
    'upper legs', 'lower legs', 'waist', 'cardio', 'neck',
  ]
  const map = new Map<string, { name: string; cover: string; gif: string; count: number }>()
  for (const e of all) {
    if (!map.has(e.category)) {
      map.set(e.category, { name: e.category, cover: e.image, gif: e.gif, count: 0 })
    }
    map.get(e.category)!.count++
  }
  const zones = order
    .filter((c) => map.has(c))
    .map((c) => map.get(c)!)
  const rest = [...map.entries()]
    .filter(([k]) => !order.includes(k))
    .map(([, v]) => v)
  return [...zones, ...rest]
}

// 画廊分区:顶部全局搜索 + 部位门户 → 部位照片墙
export default function GalleryZone({ items }: Props) {
  const [zone, setZone] = useState<string | null>(null)
  // pendingQ:用户正在输入(草稿) / submittedQ:已提交,用于过滤
  const [pendingQ, setPendingQ] = useState('')
  const [submittedQ, setSubmittedQ] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const nq = submittedQ.trim().toLowerCase()
  const hasQuery = nq.length > 0
  const hasDraft = pendingQ.trim().length > 0 && pendingQ !== submittedQ

  const submitSearch = () => {
    setSubmittedQ(pendingQ)
    inputRef.current?.blur()
  }
  const clearSearch = () => {
    setPendingQ('')
    setSubmittedQ('')
    inputRef.current?.focus()
  }

  // 全局搜索结果(跨所有部位)
  const globalResults = useMemo(() => {
    if (!hasQuery) return []
    return items.filter((e) => {
      const hay = (
        e.name_zh +
        ' ' +
        e.name +
        ' ' +
        zh(e.category, CATEGORY_ZH) +
        ' ' +
        zh(e.equipment, EQUIPMENT_ZH) +
        ' ' +
        zh(e.target, TARGET_ZH)
      ).toLowerCase()
      return hay.includes(nq)
    })
  }, [items, hasQuery, nq])

  // 分区内的搜索结果
  const zoneItems = useMemo(() => {
    if (!zone) return []
    return items.filter((e) => {
      if (zone !== '__all__' && e.category !== zone) return false
      if (!hasQuery) return true
      const hay = (e.name_zh + ' ' + e.name).toLowerCase()
      return hay.includes(nq)
    })
  }, [items, zone, hasQuery, nq])

  // 进入分区时清除焦点(让用户看得到变化)
  useEffect(() => {
    if (zone) inputRef.current?.blur()
  }, [zone])

  // 搜索时若不在分区则维持门户可见;若有搜索词但用户点击了分区,则跳到该分区的搜索结果
  const showSearchResults = hasQuery && (zone !== null || true) // 有搜索词总是显示结果
  const inZone = zone !== null

  const zones = useMemo(() => buildZones(items), [items])

  return (
    <section className="g-zone-root" aria-label="动作画廊">
      {/* 顶部全局搜索栏(画廊模式恒在) */}
      <div className="g-search">
        <p className="mono-label">Gallery · 展览</p>
        <form
          className="search-wrap g-search__wrap"
          onSubmit={(e) => {
            e.preventDefault()
            submitSearch()
          }}
          role="search"
        >
          <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input
            ref={inputRef}
            className="search-input"
            type="search"
            placeholder={inZone ? `在「${zone === '__all__' ? '全部动作' : zh(zone, CATEGORY_ZH)}」中搜索,回车确认…` : '搜索动作,如「卧推」「深蹲」,回车确认…'}
            value={pendingQ}
            onChange={(e) => setPendingQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Escape' && hasDraft) {
                setPendingQ(submittedQ)
              }
            }}
            aria-label="搜索动作"
            autoFocus={!inZone}
          />
          <button
            type="submit"
            className="g-search__submit"
            disabled={!pendingQ.trim()}
            aria-label="搜索"
          >
            搜索
          </button>
          {hasQuery && (
            <button
              type="button"
              className="g-search__clear"
              onClick={clearSearch}
              aria-label="清除搜索"
            >
              ×
            </button>
          )}
        </form>
        {hasDraft && (
          <p className="g-search__hint mono-label">
            按 <kbd>回车</kbd> 或点击「搜索」按钮确认 · <kbd>Esc</kbd> 取消
          </p>
        )}
        {hasQuery && !hasDraft && (
          <p className="g-search__count mono-label">
            {inZone
              ? `${zoneItems.length} 个结果 · 关键词「${submittedQ}」`
              : `${globalResults.length} 个结果 · 关键词「${submittedQ}」`}
          </p>
        )}
      </div>

      {/* 搜索有结果时:直接展示照片墙 + 返回门户入口 */}
      {hasQuery && !inZone && globalResults.length > 0 && (
        <>
          <button className="g-back" onClick={clearSearch} aria-label="返回部位门户">
            ← 全部部位
          </button>
          <GalleryView items={globalResults} />
        </>
      )}

      {/* 搜索有结果且在分区:展示该分区的搜索结果 */}
      {hasQuery && inZone && zoneItems.length > 0 && (
        <>
          <button className="g-back" onClick={() => setZone(null)} aria-label="返回部位门户">
            ← 全部部位
          </button>
          <GalleryView items={zoneItems} />
        </>
      )}

      {/* 搜索无结果(全局或分区) */}
      {hasQuery && (
        ((inZone && zoneItems.length === 0) || (!inZone && globalResults.length === 0))
      ) && (
        <div className="empty">
          <h2>没有匹配的动作</h2>
          <p>换个关键词,或在画廊模式下从部位门户浏览</p>
          <button className="btn btn--soft" onClick={clearSearch}>清除搜索</button>
        </div>
      )}

      {/* 无搜索词时:展示部位门户 */}
      {!hasQuery && !inZone && (
        <>
          <h2 className="g-portal__title">选择要探索的部位</h2>
          <p className="g-portal__sub">
            每个分区是一座小型展览馆 —— 浏览该部位的全部动作动画
          </p>
          <div className="g-portal__grid">
            <button className="g-zone" onClick={() => setZone('__all__')}>
              <span className="g-zone__frame">
                <img src={zones[0] ? publicAsset(zones[0].cover) : undefined} alt="" loading="lazy" aria-hidden="true" />
                <span className="g-zone__badge mono-label">ALL</span>
              </span>
              <span className="g-zone__name">全部动作</span>
              <span className="g-zone__count mono-label">{items.length} 个动作</span>
            </button>
            {zones.map((z) => (
              <button key={z.name} className="g-zone" onClick={() => setZone(z.name)}>
                <span className="g-zone__frame">
                  <img src={publicAsset(z.cover)} alt="" loading="lazy" aria-hidden="true" className="g-zone__jpg" />
                  <img src={publicAsset(z.gif)} alt="" aria-hidden="true" loading="lazy" className="g-zone__gif" />
                  <span className="g-zone__badge mono-label">{String(z.count).padStart(3, '0')}</span>
                </span>
                <span className="g-zone__name">{zh(z.name, CATEGORY_ZH)}</span>
                <span className="g-zone__count mono-label">{z.name}</span>
              </button>
            ))}
          </div>
        </>
      )}

      {/* 分区内无搜索词:展示分区照片墙 */}
      {!hasQuery && inZone && (
        <>
          <button className="g-back" onClick={() => setZone(null)} aria-label="返回部位门户">
            ← 全部部位
          </button>
          <h2 className="g-zone-view__title">{zone === '__all__' ? '全部动作' : zh(zone, CATEGORY_ZH)}</h2>
          <p className="g-zone-view__meta mono-label">
            {(zone === '__all__' ? 'ALL EXERCISES' : zone.toUpperCase())} · {zoneItems.length} 个动作
          </p>
          <GalleryView items={zoneItems} />
        </>
      )}
    </section>
  )
}
