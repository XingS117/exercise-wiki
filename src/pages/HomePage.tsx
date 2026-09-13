import { Link } from 'react-router-dom'
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import exercises from '../data/exercises.json'
import type { Exercise } from '../lib/types'
import { CATEGORY_ZH, EQUIPMENT_ZH, TARGET_ZH, zh } from '../lib/zh'
import type { ViewMode } from '../lib/useViewMode'
import { listState } from '../lib/listState'
import ExerciseCard from '../components/ExerciseCard'
import GalleryZone from '../components/GalleryZone'
import { publicAsset } from '../lib/assets'
import CollectionLinks from '../components/CollectionLinks'
import { COLLECTIONS } from '../lib/collections'
import { guides } from '../data/guides'
import { guidePath } from '../lib/guides'
import { GUIDE_VISUAL_IDS } from '../lib/guideVisuals'

const DATA = exercises as Exercise[]

// Hero 右侧演示墙:精选 6 个经典力量动作(GIF 演示,悬停变彩)
const HERO_IDS = ['0025', '0032', '0039', '0651', '0027', '0414']
const HEROS = HERO_IDS
  .map((id) => DATA.find((e) => e.id === id))
  .filter((e): e is Exercise => !!e)

// 统计与筛选项(按动作数排序,多的在前)——模块级一次性计算
function countBy(key: (e: Exercise) => string): Array<[string, number]> {
  const m = new Map<string, number>()
  for (const e of DATA) m.set(key(e), (m.get(key(e)) ?? 0) + 1)
  return [...m.entries()].sort((a, b) => b[1] - a[1])
}
const categoryCounts = countBy((e) => e.category)
const equipmentCounts = countBy((e) => e.equipment)
const targetCounts = countBy((e) => e.target)
const bodyBrowseLinks = COLLECTIONS.filter((collection) => collection.kind === 'body-part').slice(0, 6)
const equipmentBrowseLinks = COLLECTIONS.filter((collection) => collection.kind === 'equipment').slice(0, 6)
const guideVisuals = new Map(
  guides.map((guide) => [guide.slug, DATA.find((exercise) => exercise.id === GUIDE_VISUAL_IDS[guide.slug])])
)

function normalize(s: string): string {
  return s.toLowerCase().trim()
}

// 与 CSS 的 card-grid 断点保持一致:桌面 min 210px / gap 24,移动 ≤640 min 155px / gap 16
function computeLayout(vw: number): { cols: number; gap: number } {
  const containerW = Math.min(1180, vw - 64) // container = 100% - space-xl*2
  const isMobile = vw <= 640
  const minCard = isMobile ? 155 : 210
  const gap = isMobile ? 16 : 24
  const cols = Math.max(1, Math.floor((containerW + gap) / (minCard + gap)))
  return { cols, gap }
}

export default function HomePage({ mode }: { mode: ViewMode }) {
  // 从 listState 恢复上次浏览状态(从详情返回时)
  const [pendingQ, setPendingQ] = useState(() => listState.qDraft)
  const [submittedQ, setSubmittedQ] = useState(() => listState.q)
  const [category, setCategory] = useState<string | null>(() => listState.category)
  const [equipments, setEquipments] = useState<Set<string>>(
    () => new Set(listState.equipments)
  )
  const [targets, setTargets] = useState<Set<string>>(
    () => new Set(listState.targets)
  )
  const [filterOpen, setFilterOpen] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // 状态变化时同步到 listState(返回列表时恢复用)
  useEffect(() => {
    listState.qDraft = pendingQ
    listState.q = submittedQ
    listState.category = category
    listState.equipments = [...equipments]
    listState.targets = [...targets]
  }, [pendingQ, submittedQ, category, equipments, targets])

  // 挂载时恢复上次列表滚动位置(从详情返回)
  useLayoutEffect(() => {
    if (listState.scroll > 0) {
      const target = listState.scroll
      listState.scroll = 0
      // 等虚拟列表完成首帧渲染(图片/行数就位)再恢复,
      // 避免文档高度不足时 scrollTo 被 clamp 到顶部
      requestAnimationFrame(() =>
        requestAnimationFrame(() => window.scrollTo(0, target))
      )
    }
  }, [])

  // 卸载前兜底保存滚动位置:卡片点击已在导航前保存正确值,
  // 这里只在未保存时(其他入口进入详情)补一次
  useEffect(() => {
    return () => {
      if (listState.scroll === 0) {
        listState.scroll = window.scrollY
      }
    }
  }, [])

  // 响应式列数(与 CSS card-grid 断点一致)
  const [layout, setLayout] = useState(() =>
    typeof window !== 'undefined' ? computeLayout(window.innerWidth) : { cols: 5, gap: 24 }
  )
  useEffect(() => {
    const onResize = () => setLayout(computeLayout(window.innerWidth))
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  const { cols, gap } = layout

  // 移动端抽屉打开时锁定 body 滚动
  useEffect(() => {
    if (!filterOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [filterOpen])

  // 搜索/筛选条件变化后的滚动策略:
  // - 搜索提交 → 滚到结果区顶部(直接看结果)
  // - 筛选变化 → 滚到筛选区顶部(筛选区保持可见,便于连续改选,不再被滚出视口)
  // 用签名比对判断"真的变化了",不用 firstRenderRef 标记(StrictMode 双挂载会误判)
  const prevQRef = useRef<string | null>(null)
  const prevFSigRef = useRef<string | null>(null)
  const pendingScrollRef = useRef(false)
  const resultBarRef = useRef<HTMLDivElement>(null)
  const filtersRef = useRef<HTMLElement>(null)

  const scrollToResults = useCallback(() => {
    const el = resultBarRef.current
    if (!el) return
    // 结果区顶部(留一点呼吸空间),用 window.scrollTo 适配 body 滚动
    const top = el.getBoundingClientRect().top + window.scrollY
    window.scrollTo({ top: Math.max(0, top - 12), behavior: 'auto' })
  }, [])

  // 滚到筛选区顶部:筛选区 + 结果区同时可见,连续点选不被中断
  const scrollToFilters = useCallback(() => {
    const el = filtersRef.current
    if (!el) return
    const top = el.getBoundingClientRect().top + window.scrollY
    window.scrollTo({ top: Math.max(0, top - 8), behavior: 'auto' })
  }, [])

  useEffect(() => {
    const fSig = JSON.stringify([category, [...equipments].sort(), [...targets].sort()])
    const first = prevQRef.current === null && prevFSigRef.current === null
    const qChanged = prevQRef.current !== null && prevQRef.current !== submittedQ
    const fChanged = prevFSigRef.current !== null && prevFSigRef.current !== fSig
    prevQRef.current = submittedQ
    prevFSigRef.current = fSig
    if (first || (!qChanged && !fChanged)) return
    if (filterOpen) {
      // 抽屉还开着(移动端):等关闭后再滚
      pendingScrollRef.current = true
    } else if (qChanged) {
      scrollToResults()
    } else {
      scrollToFilters()
    }
  }, [submittedQ, category, equipments, targets, filterOpen, scrollToResults, scrollToFilters])

  // 移动端抽屉关闭后,若筛选有变化则滚动到结果区
  useEffect(() => {
    if (!filterOpen && pendingScrollRef.current) {
      pendingScrollRef.current = false
      // 等 body 滚动解锁后执行
      requestAnimationFrame(() => requestAnimationFrame(scrollToResults))
    }
  }, [filterOpen, scrollToResults])

  const submitSearch = () => {
    setSubmittedQ(pendingQ)
    // 搜索与筛选互斥:提交搜索即清空全部筛选条件(搜索是新意图,不再叠加)
    setCategory(null)
    setEquipments(new Set())
    setTargets(new Set())
  }
  const clearSearch = () => {
    setPendingQ('')
    setSubmittedQ('')
    searchInputRef.current?.focus()
  }
  // 搜索与筛选互斥:点筛选即清空搜索词(筛选是新意图,不再叠加)
  const clearQuery = () => {
    setPendingQ('')
    setSubmittedQ('')
  }

  const toggle = (set: Set<string>, key: string, fn: (s: Set<string>) => void) => {
    const next = new Set(set)
    if (next.has(key)) next.delete(key)
    else next.add(key)
    fn(next)
  }

  const results = useMemo(() => {
    const nq = normalize(submittedQ)
    return DATA.filter((e) => {
      if (category && e.category !== category) return false
      if (equipments.size && !equipments.has(e.equipment)) return false
      if (targets.size && !targets.has(e.target)) return false
      if (!nq) return true
      const hay = normalize(`${e.name_zh} ${e.name} ${zh(e.category, CATEGORY_ZH)} ${zh(e.equipment, EQUIPMENT_ZH)} ${zh(e.target, TARGET_ZH)}`)
      return hay.includes(nq)
    })
  }, [submittedQ, category, equipments, targets])

  const hasFilter = category !== null || equipments.size > 0 || targets.size > 0
  const filterCount = (category ? 1 : 0) + equipments.size + targets.size
  const hasDraft = pendingQ.trim().length > 0 && pendingQ !== submittedQ
  const hasQuery = submittedQ.trim().length > 0
  const clearAll = () => {
    setCategory(null)
    setEquipments(new Set())
    setTargets(new Set())
  }

  // ── 轻量行虚拟化:保持 body 滚动,只渲染视口附近的行 ──
  const gridRef = useRef<HTMLDivElement>(null)
  const [scrollTop, setScrollTop] = useState(0)
  const [rowH, setRowH] = useState(0)          // 实测行高(首行渲染后校准)
  const [gridTop, setGridTop] = useState(0)     // 网格相对文档顶部的偏移

  useEffect(() => {
    let raf = 0
    const sync = () => {
      raf = 0
      setScrollTop(window.scrollY)
      const el = gridRef.current
      if (el) setGridTop(el.getBoundingClientRect().top + window.scrollY)
    }
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(sync)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    sync()
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  // 首行渲染后测量真实行高(卡片高度 + 行距),校准滚动计算
  useEffect(() => {
    if (rowH > 0) return
    const el = gridRef.current?.querySelector('.grid-row')
    if (el) setRowH(el.getBoundingClientRect().height)
  }, [results.length, cols, rowH])

  const rowCount = Math.ceil(results.length / cols)
  const measuredRowH = rowH || 300
  const viewportH = typeof window !== 'undefined' ? window.innerHeight : 800
  const overscan = 4
  const firstVisible = Math.max(
    0,
    Math.floor((scrollTop - gridTop) / measuredRowH) - overscan
  )
  const visibleCount = Math.ceil(viewportH / measuredRowH) + overscan * 2
  const visibleRows: number[] = []
  for (let i = firstVisible; i < Math.min(firstVisible + visibleCount, rowCount); i++) {
    visibleRows.push(i)
  }
  const totalHeight = rowCount * measuredRowH

  return (
    <div className={mode === 'gallery' ? 'container page-gallery' : 'container page-home'}>
      {/* 画廊模式:独立沉浸浏览(门户 → 黑白照片墙),不走网格的 hero/筛选 */}
      {mode === 'gallery' ? (
        <GalleryZone items={DATA} />
      ) : (
        <>
      {/* Hero:左侧文案/搜索/统计,右侧动作演示墙(深色力量感) */}
      <section className="hero">
        <div className="hero__inner">
          <div className="hero__content">
            <p className="mono-label">
              <span className="eyebrow-en">Exercise Encyclopedia · </span>动作百科
            </p>
            <h1 className="hero__title">
              1324 个健身动作，
              <br />
              每个都有<b style={{ color: 'var(--color-accent-3)' }}>动画演示</b>
            </h1>
            <p className="hero__sub">
              中文图解库 · 支持 English exercise name 搜索 · 按部位、器械、肌群筛选 · 悬停卡片即可观看动作演示
            </p>
            <form
              className="search-wrap"
              role="search"
              onSubmit={(e) => {
                e.preventDefault()
                submitSearch()
              }}
            >
              <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
              <input
                ref={searchInputRef}
                className="search-input"
                type="search"
                placeholder="搜索动作,如「卧推」「深蹲」或 push-up,回车确认…"
                value={pendingQ}
                onChange={(e) => setPendingQ(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Escape' && hasDraft) setPendingQ(submittedQ)
                }}
                aria-label="搜索动作"
              />
              <button
                type="submit"
                className="search-submit"
                disabled={!pendingQ.trim()}
                aria-label="搜索"
              >
                搜索
              </button>
              {hasQuery && (
                <button
                  type="button"
                  className="search-clear"
                  onClick={clearSearch}
                  aria-label="清除搜索"
                >
                  ×
                </button>
              )}
            </form>
            {hasDraft && (
              <p className="search-hint mono-label">
                按 <kbd>回车</kbd> 或点击「搜索」按钮确认 · <kbd>Esc</kbd> 取消
              </p>
            )}
            <div className="hero__stats" aria-label="数据统计">
              <span><b>{DATA.length}</b> <span className="hero__stats-label">动作</span></span>
              <span className="hero__sep" />
              <span><b>{categoryCounts.length}</b> <span className="hero__stats-label">大部位</span></span>
              <span className="hero__sep" />
              <span><b>{equipmentCounts.length}</b> <span className="hero__stats-label">种器械</span></span>
              <span className="hero__sep" />
              <span><b>{targetCounts.length}</b> <span className="hero__stats-label">个肌群</span></span>
            </div>
          </div>

          {/* 右侧动作演示墙:黑白静止,悬停变彩动画 */}
          <div className="hero__wall" aria-hidden="true">
            {HEROS.map((ex, i) => (
              <Link
                key={ex.id}
                to={`/exercise/${ex.id}`}
                className="hero__wall-card"
                style={{ '--i': i } as React.CSSProperties}
                tabIndex={-1}
              >
                <img
                  className="hero__wall-img"
                  src={publicAsset(ex.image)}
                  alt={ex.name_zh}
                  loading="lazy"
                  decoding="async"
                />
                <img
                  className="hero__wall-gif"
                  src={publicAsset(ex.gif)}
                  alt=""
                  loading="lazy"
                  decoding="async"
                />
                <span className="hero__wall-name">{ex.name_zh}</span>
                <span className="hero__wall-tag mono-label">{ex.category}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Filters:桌面内联展示;移动端收进右侧抽屉 */}
      <div className="browse-links-pair">
        <CollectionLinks title="按身体部位探索" items={bodyBrowseLinks} />
        <CollectionLinks title="按常用器械探索" items={equipmentBrowseLinks} />
      </div>
      <section className="guide-promo" aria-labelledby="guide-promo-title">
        <div className="guide-promo__head">
          <div>
            <p className="mono-label">训练专题</p>
            <h2 id="guide-promo-title">给身体一个明确的开始</h2>
          </div>
          <div className="guide-promo__summary">
            <p>从适合你的训练场景开始，先看频率、动作顺序和安全边界，再进入动作图解核对细节。</p>
            <Link className="guide-promo__index" to="/guides">查看全部训练专题</Link>
          </div>
        </div>
        <div className="guide-promo__list" aria-label="训练专题入口">
          {guides.map((guide) => {
            const visual = guideVisuals.get(guide.slug)
            return (
              <Link className="guide-promo-card" key={guide.slug} to={guidePath(guide.slug)}>
                <div className="guide-promo-card__media" aria-hidden="true">
                  {visual && <img src={publicAsset(visual.gif)} alt="" loading="lazy" decoding="async" />}
                </div>
                <div className="guide-promo-card__body">
                  <h3>{guide.title}</h3>
                  <p>{guide.description}</p>
                  <span className="guide-promo-card__action">查看安排</span>
                </div>
              </Link>
            )
          })}
        </div>
      </section>
      {filterOpen && (
        <div className="filters-scrim" onClick={() => setFilterOpen(false)} aria-hidden="true" />
      )}
      <section
        ref={filtersRef}
        className={'filters' + (filterOpen ? ' filters--open' : '')}
        aria-label="筛选"
        role="dialog"
        aria-modal="true"
        aria-hidden={!filterOpen}
      >
        <div className="filters__head">
          <span className="filters__title mono-label">
            筛选条件{filterCount > 0 ? ` · 已选 ${filterCount} 项` : ''}
          </span>
          <button
            type="button"
            className="filters__close"
            onClick={() => setFilterOpen(false)}
            aria-label="关闭筛选"
          >
            ×
          </button>
        </div>
        <div className="filter-row">
          <span className="filter-row__label mono-label">部位</span>
          <div className="filter-row__chips" role="group" aria-label="按部位筛选">
            <button
              className={'chip' + (category === null ? ' chip--active' : '')}
              aria-pressed={category === null}
              onClick={() => { clearQuery(); setCategory(null) }}
            >
              全部
            </button>
            {categoryCounts.map(([key, count]) => (
              <button
                key={key}
                className={'chip' + (category === key ? ' chip--active' : '')}
                aria-pressed={category === key}
                onClick={() => { clearQuery(); setCategory(category === key ? null : key) }}
              >
                {zh(key, CATEGORY_ZH)}
                <span className="chip-count">{count}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="filter-row">
          <span className="filter-row__label mono-label">器械</span>
          <div className="filter-row__chips" role="group" aria-label="按器械筛选">
            {equipmentCounts.map(([key, count]) => (
              <button
                key={key}
                className={'chip' + (equipments.has(key) ? ' chip--active' : '')}
                aria-pressed={equipments.has(key)}
                onClick={() => { clearQuery(); toggle(equipments, key, setEquipments) }}
              >
                {zh(key, EQUIPMENT_ZH)}
                <span className="chip-count">{count}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="filter-row">
          <span className="filter-row__label mono-label">肌群</span>
          <div className="filter-row__chips" role="group" aria-label="按肌群筛选">
            {targetCounts.map(([key, count]) => (
              <button
                key={key}
                className={'chip' + (targets.has(key) ? ' chip--active' : '')}
                aria-pressed={targets.has(key)}
                onClick={() => { clearQuery(); toggle(targets, key, setTargets) }}
              >
                {zh(key, TARGET_ZH)}
                <span className="chip-count">{count}</span>
              </button>
            ))}
          </div>
        </div>
        <button type="button" className="btn btn--soft filters__done" onClick={() => setFilterOpen(false)}>
          完成
        </button>
      </section>

      {/* Result bar */}
      <div className="result-bar" ref={resultBarRef}>
        <p>
          找到 <b className="result-count">{results.length}</b> 个动作
          {hasQuery && !hasDraft && (
            <span className="result-echo"> · 关键词「{submittedQ}」</span>
          )}
          {(hasFilter || hasQuery) && (
            <button className="result-clear" onClick={() => { clearAll(); if (hasQuery) clearSearch() }}>清除全部</button>
          )}
        </p>
        <button
          type="button"
          className={'filter-toggle' + (filterCount > 0 ? ' filter-toggle--active' : '')}
          onClick={() => setFilterOpen(true)}
          aria-haspopup="dialog"
          aria-expanded={filterOpen}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
            <path d="M4 6h16M7 12h10M10 18h4" />
          </svg>
          筛选
          {filterCount > 0 && <span className="filter-toggle__count">{filterCount}</span>}
        </button>
      </div>

      {/* Grid:虚拟列表,只渲染视口附近的行 */}
      {results.length > 0 ? (
        <div
          ref={gridRef}
          className="card-grid"
          style={{ position: 'relative', height: totalHeight }}
        >
          {visibleRows.map((rowIndex) => {
            const rowItems = results.slice(rowIndex * cols, rowIndex * cols + cols)
            return (
              <div
                key={rowIndex}
                data-index={rowIndex}
                className="grid-row"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  transform: `translateY(${rowIndex * measuredRowH}px)`,
                  display: 'grid',
                  gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
                  gap,
                  paddingBottom: gap,
                }}
              >
                {rowItems.map((ex) => (
                  <ExerciseCard key={ex.id} ex={ex} />
                ))}
              </div>
            )
          })}
        </div>
      ) : (
        <div className="empty">
          <div className="empty__emoji" aria-hidden="true">🏋️</div>
          <h2>没有找到匹配的动作</h2>
          <p>换个关键词，或清除部分筛选条件再试</p>
          <button className="btn btn--soft" onClick={clearAll}>清除全部筛选</button>
        </div>
      )}
        </>
      )}
    </div>
  )
}
