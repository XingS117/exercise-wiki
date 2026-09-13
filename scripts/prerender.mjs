import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { applySeoHead } from './prerender-meta.mjs'
import { guides } from '../src/data/guides.ts'

const ROOT = process.cwd()
const DIST = join(ROOT, 'dist')
const SITE_URL = 'https://fitness.xingshuwen.com'
const HOME_TITLE = '动作百科 · 1324 个健身动作图解库'
const HOME_DESCRIPTION = '动作百科提供 1324 个健身动作的中文图解、动画演示和分步说明，支持按身体部位、器械与目标肌群筛选。'
const CATEGORY_ZH = { 'upper arms': '上臂', 'upper legs': '大腿', back: '背部', waist: '腰腹', chest: '胸部', shoulders: '肩部', 'lower legs': '小腿', 'lower arms': '前臂', cardio: '有氧', neck: '颈部' }
const EQUIPMENT_ZH = { 'body weight': '自重', dumbbell: '哑铃', cable: '绳索器械', barbell: '杠铃', 'leverage machine': '杠杆器械', band: '弹力带', 'smith machine': '史密斯机', kettlebell: '壶铃', weighted: '负重', 'stability ball': '健身球', 'ez barbell': '曲杆', assisted: '辅助器械', 'sled machine': '雪橇机', 'medicine ball': '药球', rope: '绳索', roller: '泡沫轴', 'resistance band': '阻力带', 'bosu ball': '波速球', 'olympic barbell': '奥杠', 'wheel roller': '健腹轮', 'upper body ergometer': '上肢测功仪', 'skierg machine': '滑雪测功仪', hammer: '大锤', 'stationary bike': '固定单车', tire: '轮胎', 'trap bar': '陷阱杠', 'elliptical machine': '椭圆机', 'stepmill machine': '台阶机' }
const TARGET_ZH = { abs: '腹肌', pectorals: '胸肌', biceps: '肱二头肌', glutes: '臀肌', delts: '三角肌', triceps: '肱三头肌', 'upper back': '上背部', lats: '背阔肌', calves: '小腿', quads: '股四头肌', forearms: '前臂', 'cardiovascular system': '心肺', hamstrings: '腘绳肌', spine: '脊柱', traps: '斜方肌', adductors: '内收肌', 'serratus anterior': '前锯肌', abductors: '外展肌', 'levator scapulae': '肩胛提肌' }
const zh = (value, table) => table[value] ?? value
const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char])
const escapeJson = (value) => JSON.stringify(value).replace(/</g, '\\u003c')
const publicAsset = (value) => `/${value.replace(/^\/+/, '')}`

const exercises = JSON.parse(await readFile(join(ROOT, 'src/data/exercises.json'), 'utf8'))
const exerciseById = new Map(exercises.map((exercise) => [exercise.id, exercise]))
const shell = await readFile(join(DIST, 'index.html'), 'utf8')

const COLLECTION_CONFIG = [
  { kind: 'body-part', field: 'category', labels: CATEGORY_ZH },
  { kind: 'equipment', field: 'equipment', labels: EQUIPMENT_ZH },
  { kind: 'muscle', field: 'target', labels: TARGET_ZH },
]
const slugify = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const collectionTitle = (kind, label) => kind === 'muscle' ? `目标${label}动作` : `${label}动作`
const collections = COLLECTION_CONFIG.flatMap(({ kind, field, labels }) => {
  const counts = new Map()
  exercises.forEach((exercise) => counts.set(exercise[field], (counts.get(exercise[field]) ?? 0) + 1))
  return [...counts.entries()]
    .map(([key, count]) => {
      const label = zh(key, labels)
      return { kind, field, key, slug: slugify(key), label, title: collectionTitle(kind, label), count }
    })
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label, 'zh-CN'))
})
const collectionItems = (collection) => exercises.filter((exercise) => exercise[collection.field] === collection.key)

function breadcrumb(path, title) {
  const items = [{ '@type': 'ListItem', position: 1, name: '动作百科', item: SITE_URL }]
  if (path !== '/') {
    const parent = path.startsWith('/guides/') ? { name: '训练专题', item: `${SITE_URL}/guides` } : null
    if (parent) items.push({ '@type': 'ListItem', position: 2, ...parent })
    items.push({ '@type': 'ListItem', position: items.length + 1, name: title, item: `${SITE_URL}${path}` })
  }
  return { '@type': 'BreadcrumbList', itemListElement: items }
}

function routeMeta(path, exercise, collection, guide, editorialPage = false) {
  const detail = Boolean(exercise)
  const collectionPage = Boolean(collection)
  const guidePage = Boolean(guide)
  const guideIndex = path === '/guides'
  const title = detail
    ? `${exercise.name_zh}怎么做？动作步骤、练哪里 · 动作百科`
    : collectionPage
      ? `${collection.title} · 动作百科`
      : guidePage
        ? `${guide.title} · 动作百科`
        : guideIndex
          ? '训练专题 · 动作百科'
          : editorialPage
            ? '资料来源与编辑原则 · 动作百科'
            : HOME_TITLE
  const description = detail
    ? `查看${exercise.name_zh}（${exercise.name}）的动画演示和分步动作说明，了解训练${zh(exercise.target, TARGET_ZH)}所需器械、身体部位与协同肌群。`
    : collectionPage
      ? `浏览${collection.title}，按动作卡片查看${collection.label}相关的动画演示、中文步骤说明和可替代训练动作。`
      : guidePage
        ? guide.description
        : guideIndex
          ? '从明确的训练目标开始，查看适合新手的胸肌、居家徒手和哑铃全身训练安排，并跳转到每个动作的图解。'
          : editorialPage
            ? '了解动作百科的资料来源、翻译说明、内容更新方式和一般训练信息边界。'
            : HOME_DESCRIPTION
  const canonical = `${SITE_URL}${path === '/' ? '' : path}`
  const image = detail ? `${SITE_URL}${publicAsset(exercise.image)}` : `${SITE_URL}/hero-bg.jpg`
  const jsonLd = detail ? {
    '@context': 'https://schema.org',
    '@graph': [{
      '@type': 'HowTo',
      name: exercise.name_zh,
      description,
      image,
      step: exercise.steps.map((text, index) => ({ '@type': 'HowToStep', position: index + 1, name: `第${index + 1}步`, text })),
    }, breadcrumb(path, exercise.name_zh)],
  } : collectionPage ? {
    '@context': 'https://schema.org',
    '@graph': [{
      '@type': 'CollectionPage',
      name: title,
      url: canonical,
      description,
      numberOfItems: collection.count,
    }, breadcrumb(path, collection.title)],
  } : guidePage ? {
    '@context': 'https://schema.org',
    '@graph': [{
      '@type': 'Article',
      headline: guide.title,
      description,
      dateModified: guide.updatedAt,
      mainEntityOfPage: canonical,
    }, breadcrumb(path, guide.title)],
  } : guideIndex ? {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: title,
    url: canonical,
    description,
    numberOfItems: guides.length,
  } : editorialPage ? {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    url: canonical,
    description,
  } : {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: '动作百科',
    url: SITE_URL,
    description: HOME_DESCRIPTION,
  }
  return applySeoHead(shell, {
    title: escapeHtml(title),
    description: escapeHtml(description),
    canonical: escapeHtml(canonical),
    ogType: detail || guidePage ? 'article' : 'website',
    image: escapeHtml(image),
    jsonLd: escapeJson(jsonLd),
  })
}

function renderHome() {
  return `<div id="root"><article class="seo-prerender"><h1>1324 个健身动作图解库</h1><p>${escapeHtml(HOME_DESCRIPTION)}</p><p>按身体部位、器械和目标肌群查找动作，打开详情查看动画演示与分步说明。</p></article></div>`
}

function renderExercise(exercise) {
  const category = zh(exercise.category, CATEGORY_ZH)
  const equipment = zh(exercise.equipment, EQUIPMENT_ZH)
  const target = zh(exercise.target, TARGET_ZH)
  const steps = exercise.steps.map((step) => `<li>${escapeHtml(step)}</li>`).join('')
  return `<div id="root"><article class="seo-prerender"><a href="/">返回动作百科</a><h1>${escapeHtml(exercise.name_zh)}</h1><p>${escapeHtml(exercise.name)}</p><img src="${publicAsset(exercise.image)}" alt="${escapeHtml(exercise.name_zh)} 动作演示" width="360" height="360" /><p>${escapeHtml(category)} · ${escapeHtml(equipment)} · 目标${escapeHtml(target)}</p><h2>动作步骤</h2><ol>${steps}</ol></article></div>`
}

function renderCollection(collection) {
  const items = collectionItems(collection)
  const links = items.map((exercise) => `<li><a href="/exercise/${exercise.id}">${escapeHtml(exercise.name_zh)}</a></li>`).join('')
  const description = `共 ${items.length} 个动作，查看动画演示、动作步骤和相关训练动作。`
  return `<div id="root"><article class="seo-prerender"><a href="/">返回动作百科</a><h1>${escapeHtml(collection.title)}</h1><p>${escapeHtml(description)}</p><ul>${links}</ul></article></div>`
}

function renderGuideIndex() {
  const links = guides.map((guide) => `<li><a href="${guidePath(guide.slug)}">${escapeHtml(guide.title)}</a><p>${escapeHtml(guide.description)}</p></li>`).join('')
  return `<div id="root"><article class="seo-prerender"><h1>从“怎么练”开始</h1><p>从明确的训练目标开始，查看适合新手的胸肌、居家徒手和哑铃全身训练安排。</p><ul>${links}</ul></article></div>`
}

function guidePath(slug) {
  return `/guides/${slug}`
}

function renderGuide(guide) {
  const exerciseLinks = guide.exercises.map((item, index) => {
    const exercise = exerciseById.get(item.exerciseId)
    if (!exercise) return ''
    return `<li><strong>${index + 1}. <a href="/exercise/${exercise.id}">${escapeHtml(exercise.name_zh)}</a></strong>：${escapeHtml(item.prescription)}。${escapeHtml(item.alternative)}</li>`
  }).join('')
  const schedule = guide.schedule.map((item) => `<li>${escapeHtml(item)}</li>`).join('')
  const safety = guide.safetyNotes.map((item) => `<li>${escapeHtml(item)}</li>`).join('')
  return `<div id="root"><article class="seo-prerender"><nav><a href="/">动作百科</a> / <a href="/guides">训练专题</a></nav><h1>${escapeHtml(guide.title)}</h1><p>${escapeHtml(guide.answer)}</p><h2>适用人群与频率</h2><p>${escapeHtml(guide.audience)}</p><p><strong>建议频率：</strong>${escapeHtml(guide.frequency)}</p><h2>训练安排</h2><ol>${schedule}</ol><h2>动作清单</h2><ol>${exerciseLinks}</ol><h2>安全提示</h2><ul>${safety}</ul><p>${escapeHtml(guide.sourceLabel)} 更新于 ${escapeHtml(guide.updatedAt)}。本页不替代医疗建议。</p><p><a href="/editorial-policy">资料来源与编辑原则</a></p></article></div>`
}

function renderGuidePolicy() {
  return `<div id="root"><article class="seo-prerender"><h1>资料来源与编辑原则</h1><p>动作百科帮助用户查找训练动作、查看中文图解和理解基础安排。我们尽量让页面内容可追溯、可核对，并清楚说明它的边界。</p><h2>动作资料来源</h2><p>动作的英文名称、分类、器械、目标肌群和演示资料来自 <a href="https://github.com/hasaneyldrm/exercises-dataset">exercises-dataset</a>；动画演示版权归 Gym Visual 所有。</p><h2>翻译与更新</h2><p>中文翻译可能和常见健身用语存在差异，涉及动作识别时应以英文原名、演示和具体步骤交叉核对。更新日期表示本站最近复核日期，不代表医学审查或个人训练效果保证。</p><h2>训练建议边界</h2><p>训练专题是面向一般人群的保守入门信息，不构成医疗建议、康复方案或个体化教练指导。</p><h2>内容维护</h2><p>专题只在能链接到现有动作资料、能明确写出适用边界和安全提示时发布。</p></article></div>`
}

function renderDocument(path, exercise, collection, guide, root, editorialPage = false) {
  return routeMeta(path, exercise, collection, guide, editorialPage).replace('<div id="root"></div>', root)
}

await writeFile(join(DIST, 'index.html'), renderDocument('/', null, null, null, renderHome()))
for (const exercise of exercises) {
  const directory = join(DIST, 'exercise', exercise.id)
  await mkdir(directory, { recursive: true })
  const path = `/exercise/${exercise.id}`
  await writeFile(join(directory, 'index.html'), renderDocument(path, exercise, null, null, renderExercise(exercise)))
}

for (const collection of collections) {
  const directory = join(DIST, 'browse', collection.kind, collection.slug)
  await mkdir(directory, { recursive: true })
  const path = `/browse/${collection.kind}/${collection.slug}`
  await writeFile(join(directory, 'index.html'), renderDocument(path, null, collection, null, renderCollection(collection)))
}

await mkdir(join(DIST, 'guides'), { recursive: true })
await writeFile(join(DIST, 'guides', 'index.html'), renderDocument('/guides', null, null, null, renderGuideIndex()))
for (const guide of guides) {
  const path = guidePath(guide.slug)
  const directory = join(DIST, 'guides', guide.slug)
  await mkdir(directory, { recursive: true })
  await writeFile(join(directory, 'index.html'), renderDocument(path, null, null, guide, renderGuide(guide)))
}
await mkdir(join(DIST, 'editorial-policy'), { recursive: true })
await writeFile(join(DIST, 'editorial-policy', 'index.html'), renderDocument('/editorial-policy', null, null, null, renderGuidePolicy(), true))

const urls = [
  '/',
  ...exercises.map((exercise) => `/exercise/${exercise.id}`),
  ...collections.map((collection) => `/browse/${collection.kind}/${collection.slug}`),
  '/guides',
  ...guides.map((guide) => guidePath(guide.slug)),
  '/editorial-policy',
]
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((path) => `  <url><loc>${SITE_URL}${path === '/' ? '' : path}</loc></url>`).join('\n')}\n</urlset>\n`
await writeFile(join(DIST, 'sitemap.xml'), sitemap)
await writeFile(join(DIST, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`)
console.log(`Pre-rendered ${urls.length} routes and generated sitemap.xml/robots.txt`)
