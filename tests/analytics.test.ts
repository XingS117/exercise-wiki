import assert from 'node:assert/strict'
import test from 'node:test'
import { buildPageviewUrl, getPageTitle, sendPageview } from '../src/lib/analytics.ts'

test('encodes route, title, referrer, and campaign parameters', () => {
  const url = buildPageviewUrl(
    '/exercise/squat',
    '深蹲 · 动作百科',
    'https://www.google.com/search?q=squat',
  )

  assert.match(url, /^\/__analytics\/pageview\?/) 
  assert.match(url, /path=%2Fexercise%2Fsquat/)
  assert.match(url, /title=%E6%B7%B1%E8%B9%B2/) 
  assert.match(url, /referrer=https%3A%2F%2Fwww.google.com%2Fsearch/) 
})

test('truncates untrusted route and referrer values before encoding', () => {
  const url = buildPageviewUrl('x'.repeat(301), 't'.repeat(161), 'r'.repeat(501))
  const params = new URL(`https://fitness.xingshuwen.com${url}`).searchParams

  assert.equal(params.get('path')?.length, 300)
  assert.equal(params.get('title')?.length, 160)
  assert.equal(params.get('referrer')?.length, 500)
})

test('sends a same-origin beacon with the pageview payload', () => {
  let sentUrl = ''

  sendPageview('/exercise/squat', '深蹲 · 动作百科', (url) => {
    sentUrl = url
    return true
  })

  assert.match(sentUrl, /^\/__analytics\/pageview\?/) 
  assert.match(sentUrl, /path=%2Fexercise%2Fsquat/)
})

test('uses a human-readable exercise title for detail routes', () => {
  assert.equal(getPageTitle('/exercise/squat', '深蹲'), '深蹲怎么做？动作步骤、练哪里 · 动作百科')
  assert.equal(getPageTitle('/', undefined), '动作百科 · 1324 个健身动作图解库')
})
