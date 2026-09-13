import assert from 'node:assert/strict'
import test from 'node:test'
import exercises from '../src/data/exercises.json' with { type: 'json' }
import {
  COLLECTIONS,
  collectionPath,
  exercisesForCollection,
  getCollection,
} from '../src/lib/collections.ts'
import type { Exercise } from '../src/lib/types.ts'

const data = exercises as Exercise[]

test('creates stable browse URLs and resolves their collection', () => {
  const collection = COLLECTIONS.find((item) => item.kind === 'equipment' && item.key === 'dumbbell')!
  const path = collectionPath(collection.kind, collection.key)

  assert.equal(path, '/browse/equipment/dumbbell')
  assert.deepEqual(getCollection(collection.kind, collection.slug), collection)
})

test('filters a collection from the canonical exercise fields', () => {
  const collection = getCollection('body-part', 'chest')!
  const results = exercisesForCollection(data, collection)

  assert.ok(results.length > 0)
  assert.ok(results.every((exercise) => exercise.category === 'chest'))
})
