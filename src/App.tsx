import { useEffect, useRef } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Nav from './components/Nav'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import ExercisePage from './pages/ExercisePage'
import CollectionPage from './pages/CollectionPage'
import TrainingListPanel from './components/TrainingListPanel'
import exercises from './data/exercises.json'
import { getPageTitle, sendPageview } from './lib/analytics'
import { getCanonicalUrl, getPageDescription } from './lib/seo'
import { getCollection } from './lib/collections'
import { getGuide } from './lib/guides'
import type { Exercise } from './lib/types'
import { useViewMode } from './lib/useViewMode'
import { getRouteScrollTarget } from './lib/routeScroll'
import GuideIndexPage from './pages/GuideIndexPage'
import GuidePage from './pages/GuidePage'
import EditorialPolicyPage from './pages/EditorialPolicyPage'

const EXERCISES = exercises as Exercise[]

export default function App() {
  const [mode, switchMode] = useViewMode()
  const location = useLocation()
  const lastTrackedPath = useRef<string>()

  // 进入详情页:回到页面顶部(交互习惯:详情从开头看)
  // 返回列表的滚动/搜索恢复由 HomePage 挂载时从 listState 读取,这里不处理
  useEffect(() => {
    const target = getRouteScrollTarget(location.pathname)
    if (target !== null) window.scrollTo(0, target)
  }, [location.pathname])

  useEffect(() => {
    const exerciseId = location.pathname.split('/')[2]
    const exercise = exerciseId ? EXERCISES.find((item) => item.id === exerciseId) : undefined
    const segments = location.pathname.split('/').filter(Boolean)
    const collection = segments[0] === 'browse' ? getCollection(segments[1], segments[2]) : undefined
    const guide = segments[0] === 'guides' ? getGuide(segments[1]) : undefined
    const title = getPageTitle(location.pathname, exercise?.name_zh, collection?.title, guide?.title)
    const description = getPageDescription(location.pathname, exercise, collection, guide)

    document.title = title
    document.querySelector('meta[name="description"]')?.setAttribute('content', description)
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', getCanonicalUrl(location.pathname))
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', title)
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', description)
    document.querySelector('meta[property="og:url"]')?.setAttribute('content', getCanonicalUrl(location.pathname))
    if (lastTrackedPath.current !== location.pathname) {
      sendPageview(location.pathname, title)
      lastTrackedPath.current = location.pathname
    }
  }, [location.pathname])

  return (
    <>
      <Nav mode={mode} onSwitch={switchMode} />
      <main>
        <Routes>
          <Route path="/" element={<HomePage mode={mode} />} />
          <Route path="/exercise/:id" element={<ExercisePage mode={mode} />} />
          <Route path="/browse/:kind/:slug" element={<CollectionPage />} />
          <Route path="/guides" element={<GuideIndexPage />} />
          <Route path="/guides/:slug" element={<GuidePage />} />
          <Route path="/editorial-policy" element={<EditorialPolicyPage />} />
          <Route path="*" element={<HomePage mode={mode} />} />
        </Routes>
      </main>
      <TrainingListPanel />
      <Footer />
    </>
  )
}
