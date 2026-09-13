import { NavLink } from 'react-router-dom'
import type { ViewMode } from '../lib/useViewMode'

interface Props {
  mode: ViewMode
  onSwitch: (m: ViewMode) => void
}

export default function Nav({ mode, onSwitch }: Props) {
  return (
    <header className="nav">
      <div className="container nav__inner">
        <NavLink to="/" className="nav__brand" aria-label="文星首页">
          <img
            className="nav__brand-mark"
            src="/logo.svg"
            alt="文星"
            width={32}
            height={32}
          />
          <span className="nav__brand-text">动作百科</span>
        </NavLink>
        <nav className="nav__links" aria-label="主导航">
          <NavLink to="/" end className={({ isActive }) => 'nav__link' + (isActive ? ' active' : '')}>
            全部动作
          </NavLink>
          <div className="nav__viewswitch" role="group" aria-label="浏览模式">
            <button
              className={'viewswitch-btn' + (mode === 'grid' ? ' is-active' : '')}
              onClick={() => onSwitch('grid')}
              aria-pressed={mode === 'grid'}
            >
              网格
            </button>
            <button
              className={'viewswitch-btn' + (mode === 'gallery' ? ' is-active' : '')}
              onClick={() => onSwitch('gallery')}
              aria-pressed={mode === 'gallery'}
            >
              画廊
            </button>
          </div>
        </nav>
      </div>
    </header>
  )
}
