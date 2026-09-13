import assert from 'node:assert/strict'
import test from 'node:test'
import { getCanonicalUrl, getPageDescription, getPageTitle } from '../src/lib/seo.ts'
import type { Exercise } from '../src/lib/types.ts'
import { getCollection } from '../src/lib/collections.ts'
import { getGuide } from '../src/lib/guides.ts'

const exercise: Exercise = {
  id: '0032',
  name: 'barbell deadlift',
  name_zh: '杠铃硬拉',
  category: 'upper legs',
  equipment: 'barbell',
  target: 'glutes',
  muscle_group: 'hamstrings',
  secondary_muscles: ['hamstrings'],
  instructions: '保持背部挺直并控制重量。',
  steps: ['站稳并握住杠铃。', '髋部发力站起。'],
  image: 'images/0032-example.jpg',
  gif: 'videos/0032-example.gif',
  attribution: 'test',
}

test('builds unique detail metadata', () => {
  assert.equal(getPageTitle('/exercise/0032', exercise.name_zh), `${exercise.name_zh}怎么做？动作步骤、练哪里 · 动作百科`)
  assert.match(getPageDescription('/exercise/0032', exercise), /动画演示/)
  assert.equal(getCanonicalUrl('/exercise/0032'), 'https://fitness.xingshuwen.com/exercise/0032')
})

test('keeps the homepage canonical URL stable', () => {
  assert.equal(getCanonicalUrl('/'), 'https://fitness.xingshuwen.com')
  assert.match(getPageDescription('/', undefined), /1324 个健身动作/)
  assert.match(getPageDescription('/', undefined), /English exercise name/)
})

test('builds collection metadata for shareable browse pages', () => {
  const collection = getCollection('body-part', 'chest')!

  assert.equal(getPageTitle('/browse/body-part/chest', undefined, collection.title), '胸部动作 · 动作百科')
  assert.match(getPageDescription('/browse/body-part/chest', undefined, collection), /胸部动作/)
  assert.equal(getCanonicalUrl('/browse/body-part/chest'), 'https://fitness.xingshuwen.com/browse/body-part/chest')
})

test('builds direct-answer metadata for guide pages', () => {
  const guide = getGuide('beginner-chest-workout')!

  assert.equal(getPageTitle('/guides/beginner-chest-workout', undefined, undefined, guide.title), '新手胸肌怎么练 · 动作百科')
  assert.equal(getPageDescription('/guides/beginner-chest-workout', undefined, undefined, guide), guide.description)
  assert.equal(getCanonicalUrl('/guides/beginner-chest-workout'), 'https://fitness.xingshuwen.com/guides/beginner-chest-workout')
})

test('builds metadata for the English exercise-name guide', () => {
  const guide = getGuide('exercise-english-names')!

  assert.equal(getPageTitle('/guides/exercise-english-names', undefined, undefined, guide.title), '健身动作英文名称对照与示范 · 动作百科')
  assert.match(getPageDescription('/guides/exercise-english-names', undefined, undefined, guide), /英文动作名/)
  assert.equal(getCanonicalUrl('/guides/exercise-english-names'), 'https://fitness.xingshuwen.com/guides/exercise-english-names')
})

test('keeps the editorial policy metadata stable after hydration', () => {
  assert.equal(getPageTitle('/editorial-policy'), '资料来源与编辑原则 · 动作百科')
  assert.match(getPageDescription('/editorial-policy'), /资料来源/)
})
