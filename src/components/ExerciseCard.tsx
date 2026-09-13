import { Link } from 'react-router-dom'
import { listState } from '../lib/listState'
import type { Exercise } from '../lib/types'
import { CATEGORY_ZH, EQUIPMENT_ZH, TARGET_ZH, zh } from '../lib/zh'
import { publicAsset } from '../lib/assets'

interface Props {
  ex: Exercise
}

// 卡片标签:部位(pear)+ 器械(cyan)+ 目标肌肉(lav)
export default function ExerciseCard({ ex }: Props) {
  return (
    <Link
      to={`/exercise/${ex.id}`}
      className="ex-card"
      onClick={() => {
        // 导航前立即保存列表滚动位置:卸载时虚拟列表 DOM 先被移除,
        // 文档高度骤减会把 scrollY clamp 到更小值,cleanup 读到的是错误位置
        listState.scroll = window.scrollY
      }}
    >
      <div className="ex-card__media">
        <img
          className="jpg-layer"
          src={publicAsset(ex.image)}
          alt={ex.name_zh}
          loading="lazy"
          width={180}
          height={180}
        />
        <img
          className="gif-layer"
          src={publicAsset(ex.gif)}
          alt=""
          loading="lazy"
          aria-hidden="true"
          width={180}
          height={180}
        />
      </div>
      <div className="ex-card__body">
        <h3 className="ex-card__title">{ex.name_zh}</h3>
        <p className="ex-card__en">{ex.name}</p>
        <div className="ex-card__tags">
          <span className="tag tag--pear">{zh(ex.category, CATEGORY_ZH)}</span>
          <span className="tag tag--cyan">{zh(ex.equipment, EQUIPMENT_ZH)}</span>
          <span className="tag tag--lav">{zh(ex.target, TARGET_ZH)}</span>
        </div>
      </div>
    </Link>
  )
}
