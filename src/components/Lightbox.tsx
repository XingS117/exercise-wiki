import { Link } from 'react-router-dom'
import type { Exercise } from '../lib/types'
import { CATEGORY_ZH, EQUIPMENT_ZH, TARGET_ZH, MUSCLE_ZH, zh } from '../lib/zh'
import { publicAsset } from '../lib/assets'

interface Props {
  ex: Exercise
  index: number
  total: number
  onClose: () => void
  onPrev: () => void
  onNext: () => void
  neighbors?: [Exercise | null, Exercise | null] // [prev, next] 用于预加载
}

// 全屏灯箱:大图(GIF 动画)+ 档案式 mono 展签 + 键盘/按钮切换
export default function Lightbox({ ex, index, total, onClose, onPrev, onNext, neighbors }: Props) {
  return (
    <div className="lb" role="dialog" aria-modal="true" aria-label={`${ex.name_zh} 动作查看`}>
      {/* 预加载相邻 GIF,切换更流畅 */}
      {neighbors?.map((n, i) =>
        n ? <img key={n.id} src={publicAsset(n.gif)} alt="" aria-hidden="true" className="lb__preload" /> : null,
      )}
      <button className="lb__close" onClick={onClose} aria-label="关闭">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>
      <button className="lb__arrow lb__arrow--prev" onClick={onPrev} aria-label="上一个">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 6l-6 6 6 6" />
        </svg>
      </button>
      <button className="lb__arrow lb__arrow--next" onClick={onNext} aria-label="下一个">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 6l6 6-6 6" />
        </svg>
      </button>

      <div className="lb__stage">
        <div className="lb__media">
          <img src={publicAsset(ex.gif)} alt={`${ex.name_zh} 动作演示`} width={360} height={360} />
        </div>

        <div className="lb__caption">
          <p className="lb__no mono-label">
            {String(index + 1).padStart(3, '0')} / {String(total).padStart(3, '0')}
          </p>
          <h2 className="lb__zh">{ex.name_zh}</h2>
          <p className="lb__en">{ex.name}</p>
          <div className="lb__meta mono-label">
            <span>{zh(ex.category, CATEGORY_ZH)}</span>
            <span className="lb__dot" aria-hidden="true">·</span>
            <span>{zh(ex.equipment, EQUIPMENT_ZH)}</span>
            <span className="lb__dot" aria-hidden="true">·</span>
            <span>目标 {zh(ex.target, TARGET_ZH)}</span>
          </div>
          <div className="lb__muscles mono-label">
            <span>协同 {zh(ex.muscle_group, MUSCLE_ZH)}</span>
            {ex.secondary_muscles.length > 0 && (
              <span className="lb__secondary">
                {' · '}
                {ex.secondary_muscles.slice(0, 4).map((m) => zh(m, MUSCLE_ZH)).join(' · ')}
              </span>
            )}
          </div>
          <Link to={`/exercise/${ex.id}`} className="lb__link">
            查看完整说明 →
          </Link>
        </div>
      </div>
    </div>
  )
}
