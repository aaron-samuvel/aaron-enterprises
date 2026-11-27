const configuredBase = (import.meta as ImportMeta & { env?: { BASE_URL?: string } }).env?.BASE_URL ?? '/'
const SPA_REDIRECT_KEY = 'ae-spa-redirect'

export const BASE_PATH = configuredBase.replace(/\/$/, '')

export function createRouting(base: string) {
  const basePath = base.replace(/\/$/, '')

  function appUrl(path: string) {
    const suffix = path.startsWith('/') ? path : `/${path}`
    return `${basePath}${suffix}` || '/'
  }

  function appPathname(pathname = window.location.pathname) {
    if (basePath && (pathname === basePath || pathname.startsWith(`${basePath}/`))) {
      const sub = pathname.slice(basePath.length) || '/'
      /* GitHub Pages appends a trailing slash when serving the 404 fallback
         (e.g. /products/); normalize so route matchers keep working. */
      return sub === '/' ? '/' : sub.replace(/\/+$/, '') || '/'
    }
    return pathname
  }

  function prefixInternalLinks(root: ParentNode = document) {
    if (!basePath) return
    root.querySelectorAll<HTMLAnchorElement>('a[href^="/"]').forEach((anchor) => {
      const href = anchor.getAttribute('href')
      if (href && href.startsWith('/') && !href.startsWith('//') && href !== basePath && !href.startsWith(`${basePath}/`)) {
        anchor.setAttribute('href', appUrl(href))
      }
    })
  }

  function restoreSpaRedirect() {
    /* GitHub Pages 404.html fallback hands the intended path over via
       sessionStorage; restore it into the address bar before first render. */
    try {
      const saved = window.sessionStorage.getItem(SPA_REDIRECT_KEY)
      if (saved) {
        window.sessionStorage.removeItem(SPA_REDIRECT_KEY)
        const suffix = saved.startsWith('/') ? saved : `/${saved}`
        window.history.replaceState(null, '', `${basePath}${suffix}` || '/')
      }
    } catch {
      /* sessionStorage unavailable — ignore */
    }
  }

  return { appUrl, appPathname, prefixInternalLinks, restoreSpaRedirect }
}

const routing = createRouting(configuredBase)
routing.restoreSpaRedirect()

export const appUrl = routing.appUrl
export const appPathname = routing.appPathname
export const prefixInternalLinks = routing.prefixInternalLinks
