export function publicAsset(path: string): string {
  return path.startsWith('/') ? path : `/${path}`
}
