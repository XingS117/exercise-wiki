import assert from 'node:assert/strict'
import test from 'node:test'
import { getRouteScrollTarget } from '../src/lib/routeScroll.ts'

test('scrolls new non-home routes to the top', () => {
  assert.equal(getRouteScrollTarget('/guides/core-abs-beginner'), 0)
  assert.equal(getRouteScrollTarget('/browse/body-part/chest'), 0)
})

test('leaves home scroll to the existing list-state restoration', () => {
  assert.equal(getRouteScrollTarget('/'), null)
})
