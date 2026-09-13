import assert from 'node:assert/strict'
import test from 'node:test'
import { toggleTrainingId } from '../src/lib/trainingList.ts'

test('adds an id to an empty training list and removes it when toggled again', () => {
  const added = toggleTrainingId([], '0032')
  const removed = toggleTrainingId(added, '0032')

  assert.deepEqual(added, ['0032'])
  assert.deepEqual(removed, [])
})

test('removes only the toggled id from a multi-exercise list', () => {
  assert.deepEqual(toggleTrainingId(['0032', '0001'], '0032'), ['0001'])
})
