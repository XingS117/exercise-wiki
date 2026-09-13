const MAX_PATH_LENGTH = 300
const MAX_TITLE_LENGTH = 160
const MAX_REFERRER_LENGTH = 500
const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign'] as const
export { getPageTitle } from './seo.ts'

function currentSearch() {
  return typeof window === 'undefined' ? '' : window.location.search
}

function currentReferrer() {
  return typeof document === 'undefined' ? '' : document.referrer
}

export function buildPageviewUrl(
  path: string,
  title: string,
  referrer = currentReferrer(),
  search = currentSearch(),
) {
  const params = new URLSearchParams({
    path: path.slice(0, MAX_PATH_LENGTH),
    title: title.slice(0, MAX_TITLE_LENGTH),
    referrer: referrer.slice(0, MAX_REFERRER_LENGTH),
  })
  const campaign = new URLSearchParams(search)

  UTM_KEYS.forEach((key) => {
    const value = campaign.get(key)
    if (value) params.set(key, value.slice(0, 120))
  })

  return `/__analytics/pageview?${params}`
}

type BeaconSender = (url: string) => boolean

function defaultBeaconSender(): BeaconSender | undefined {
  if (typeof navigator === 'undefined' || !navigator.sendBeacon) return undefined
  return navigator.sendBeacon.bind(navigator)
}

export function sendPageview(path: string, title: string, beacon = defaultBeaconSender()) {
  const url = buildPageviewUrl(path, title)

  if (beacon) {
    return beacon(url)
  }

  void fetch(url, { method: 'POST', keepalive: true, credentials: 'same-origin' })
  return true
}
