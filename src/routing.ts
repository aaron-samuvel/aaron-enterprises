const configuredBase = (import.meta as ImportMeta & { env?: { BASE_URL?: string } }).env?.BASE_URL ?? '/'
export const BASE_PATH = configuredBase.replace(/\/$/, '')

export function appUrl(path: string) {
  const suffix = path.startsWith('/') ? path : `/${path}`
  return `${BASE_PATH}${suffix}` || '/'
}

export function appPathname() {
  const pathname = window.location.pathname
  if (BASE_PATH && (pathname === BASE_PATH || pathname.startsWith(`${BASE_PATH}/`))) {
    return pathname.slice(BASE_PATH.length) || '/'
  }
  return pathname
}

export function prefixInternalLinks(root: ParentNode = document) {
  if (!BASE_PATH) return
  root.querySelectorAll<HTMLAnchorElement>('a[href^="/"]').forEach((anchor) => {
    const href = anchor.getAttribute('href')
    if (href && href.startsWith('/') && !href.startsWith('//') && href !== BASE_PATH && !href.startsWith(`${BASE_PATH}/`)) {
      anchor.setAttribute('href', appUrl(href))
    }
  })
}
