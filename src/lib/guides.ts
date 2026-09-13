import { guides } from '../data/guides.ts'

export function guidePath(slug: string): string {
  return `/guides/${slug}`
}

export function getGuide(slug: string) {
  return guides.find((guide) => guide.slug === slug)
}
