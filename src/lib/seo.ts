import type { Exercise } from './types.ts'
import type { Collection } from './collections.ts'
import type { TrainingGuide } from '../data/guides.ts'
import { CATEGORY_ZH, EQUIPMENT_ZH, TARGET_ZH, zh } from './zh.ts'

export const SITE_URL = 'https://fitness.xingshuwen.com'
export const HOME_TITLE = '动作百科 · 1324 个健身动作图解库'
export const HOME_DESCRIPTION = '动作百科提供 1324 个健身动作的中文图解、动画演示和分步说明，支持中文动作名与 English exercise name 搜索，并可按身体部位、器械与目标肌群筛选。'
export const GUIDE_INDEX_TITLE = '训练专题 · 动作百科'
export const GUIDE_INDEX_DESCRIPTION = '从明确的训练目标开始，查看适合新手的胸肌、居家徒手和哑铃全身训练安排，并跳转到每个动作的图解。'
export const POLICY_TITLE = '资料来源与编辑原则 · 动作百科'
export const POLICY_DESCRIPTION = '了解动作百科的资料来源、翻译说明、内容更新方式和一般训练信息边界。'

export function getPageTitle(path: string, exerciseName?: string, collectionTitle?: string, guideTitle?: string): string {
  if (path.startsWith('/exercise/') && exerciseName) {
    return `${exerciseName}怎么做？动作步骤、练哪里 · 动作百科`
  }
  if (path.startsWith('/browse/') && collectionTitle) {
    return `${collectionTitle} · 动作百科`
  }
  if (path.startsWith('/guides/') && guideTitle) {
    return `${guideTitle} · 动作百科`
  }
  if (path === '/guides') return GUIDE_INDEX_TITLE
  if (path === '/editorial-policy') return POLICY_TITLE
  return HOME_TITLE
}

export function getPageDescription(path: string, exercise?: Exercise, collection?: Collection, guide?: TrainingGuide): string {
  if (path.startsWith('/exercise/') && exercise) {
    return `查看${exercise.name_zh}（${exercise.name}）的动画演示和分步动作说明，了解训练${zh(exercise.target, TARGET_ZH)}所需器械、身体部位与协同肌群。`
  }
  if (path.startsWith('/browse/') && collection) {
    return `浏览${collection.title}，按动作卡片查看${collection.label}相关的动画演示、中文步骤说明和可替代训练动作。`
  }
  if (path.startsWith('/guides/') && guide) return guide.description
  if (path === '/guides') return GUIDE_INDEX_DESCRIPTION
  if (path === '/editorial-policy') return POLICY_DESCRIPTION
  return HOME_DESCRIPTION
}

export function getCanonicalUrl(path: string): string {
  const normalized = path === '/' ? '' : `/${path.replace(/^\/+|\/+$/g, '')}`
  return `${SITE_URL}${normalized}`
}

export function getExerciseSummary(exercise: Exercise): string {
  return `${zh(exercise.category, CATEGORY_ZH)} · ${zh(exercise.equipment, EQUIPMENT_ZH)} · 目标${zh(exercise.target, TARGET_ZH)}`
}
