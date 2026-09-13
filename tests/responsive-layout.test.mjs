import assert from 'node:assert/strict'
import test from 'node:test'
import { readFile } from 'node:fs/promises'

const css = await readFile(new URL('../src/styles/page.css', import.meta.url), 'utf8')

test('collapses the hero to one column before the tablet title becomes narrow', () => {
  assert.match(css, /@media\s*\(max-width:\s*900px\)[\s\S]*?\.hero__inner\s*\{[^}]*grid-template-columns:\s*1fr/)
})
