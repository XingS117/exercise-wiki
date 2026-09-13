import assert from 'node:assert/strict'
import test from 'node:test'
import exercises from '../src/data/exercises.json' with { type: 'json' }
import { guides } from '../src/data/guides.ts'
import { GUIDE_VISUAL_IDS } from '../src/lib/guideVisuals.ts'
import type { Exercise } from '../src/lib/types.ts'

const exerciseIds = new Set((exercises as Exercise[]).map((exercise) => exercise.id))

test('every training guide has a real visual exercise mapping', () => {
  for (const guide of guides) {
    const visualId = GUIDE_VISUAL_IDS[guide.slug]
    assert.ok(visualId, `${guide.slug} should have a visual exercise`) 
    assert.ok(exerciseIds.has(visualId), `${guide.slug} visual ${visualId} should exist`)
  }
})
