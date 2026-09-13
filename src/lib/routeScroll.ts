export function getRouteScrollTarget(pathname: string): number | null {
  return pathname === '/' ? null : 0
}
