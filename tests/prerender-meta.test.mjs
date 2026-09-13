import assert from 'node:assert/strict'
import test from 'node:test'
import { applySeoHead } from '../scripts/prerender-meta.mjs'

const shell = `<!doctype html>
<html><head>
  <title>动作百科</title>
  <meta name="description" content="首页描述" />
  <link rel="canonical" href="https://fitness.xingshuwen.com/" />
  <meta property="og:title" content="动作百科" />
  <meta property="og:description" content="首页描述" />
  <meta property="og:url" content="https://fitness.xingshuwen.com/" />
  <meta property="og:type" content="website" />
  <meta property="og:image" content="https://fitness.xingshuwen.com/hero-bg.jpg" />
  <script type="application/ld+json">{"@type":"WebSite"}</script>
</head><body><div id="root"></div></body></html>`

test('replaces template SEO tags instead of appending duplicates', () => {
  const html = applySeoHead(shell, {
    title: '杠铃卧推怎么做？动作步骤、练哪里 · 动作百科',
    description: '查看杠铃卧推的动作步骤、目标肌群和器械要求。',
    canonical: 'https://fitness.xingshuwen.com/exercise/0025',
    ogType: 'article',
    image: 'https://fitness.xingshuwen.com/images/0025.jpg',
    jsonLd: '{"@context":"https://schema.org","@type":"HowTo"}',
  })

  assert.equal((html.match(/<title>/g) ?? []).length, 1)
  assert.equal((html.match(/name="description"/g) ?? []).length, 1)
  assert.equal((html.match(/rel="canonical"/g) ?? []).length, 1)
  assert.equal((html.match(/property="og:/g) ?? []).length, 5)
  assert.equal((html.match(/type="application\/ld\+json"/g) ?? []).length, 1)
  assert.match(html, /href="https:\/\/fitness\.xingshuwen\.com\/exercise\/0025"/)
  assert.match(html, /"@type":"HowTo"/)
})
