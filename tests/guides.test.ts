import assert from 'node:assert/strict'
import test from 'node:test'
import exercises from '../src/data/exercises.json' with { type: 'json' }
import { guides } from '../src/data/guides.ts'
import { getGuide, guidePath } from '../src/lib/guides.ts'
import type { Exercise } from '../src/lib/types.ts'

const exerciseById = new Map((exercises as Exercise[]).map((exercise) => [exercise.id, exercise]))

test('every guide resolves to at least three existing exercise pages', () => {
  for (const guide of guides) {
    assert.ok(guide.exercises.length >= 3)
    guide.exercises.forEach(({ exerciseId }) => assert.ok(exerciseById.has(exerciseId), `${guide.slug} references ${exerciseId}`))
  }
})

test('guide paths are stable and unique', () => {
  assert.deepEqual(guides.map((guide) => guidePath(guide.slug)), [
    '/guides/beginner-chest-workout',
    '/guides/home-bodyweight-full-body',
    '/guides/beginner-dumbbell-full-body',
    '/guides/male-fitness-exercises',
    '/guides/core-abs-beginner',
    '/guides/indoor-no-equipment-workout',
    '/guides/fitness-exercise-guide',
    '/guides/beginner-bodybuilding-exercises',
    '/guides/exercise-english-names',
  ])
  assert.equal(new Set(guides.map((guide) => guidePath(guide.slug))).size, guides.length)
})

test('SEO expansion guides have complete answers and real exercise links', () => {
  const expansionSlugs = [
    'male-fitness-exercises',
    'core-abs-beginner',
    'indoor-no-equipment-workout',
    'fitness-exercise-guide',
    'beginner-bodybuilding-exercises',
    'exercise-english-names',
  ]

  expansionSlugs.forEach((slug) => {
    const guide = getGuide(slug)
    assert.ok(guide, `${slug} should resolve`)
    assert.ok(guide.title.length > 0)
    assert.ok(guide.answer.length > 0)
    assert.ok(guide.frequency.length > 0)
    assert.ok(guide.exercises.length >= 4)
    guide.exercises.forEach(({ exerciseId }) => assert.ok(exerciseById.has(exerciseId), `${slug} references ${exerciseId}`))
  })
})

test('looks up guides by slug without matching partial paths', () => {
  assert.equal(getGuide('beginner-chest-workout')?.title, '新手胸肌怎么练')
  assert.equal(getGuide('beginner-chest'), undefined)
})
