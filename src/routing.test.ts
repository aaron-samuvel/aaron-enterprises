import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const REDIRECT_KEY = 'ae-spa-redirect'

async function loadRouting() {
  vi.resetModules()
  return import('./routing')
}

beforeEach(() => {
  window.sessionStorage.clear()
  window.history.replaceState(null, '', '/')
})

afterEach(() => {
  window.sessionStorage.clear()
  window.history.replaceState(null, '', '/')
})

describe('GitHub Pages routing helpers', () => {
  it('prefixes app URLs with the configured repository base path', async () => {
    const { createRouting } = await loadRouting()
    const { appUrl } = createRouting('/aaron-enterprises/')

    expect(appUrl('/products')).toBe('/aaron-enterprises/products')
    expect(appUrl('products')).toBe('/aaron-enterprises/products')
    expect(appUrl('/')).toBe('/aaron-enterprises/')
  })

  it('normalizes paths served by the 404 fallback', async () => {
    const { createRouting } = await loadRouting()
    const { appPathname } = createRouting('/aaron-enterprises/')

    expect(appPathname('/aaron-enterprises/products/capstans/')).toBe('/products/capstans')

    expect(appPathname('/aaron-enterprises/')).toBe('/')
  })

  it('restores a saved deep link before the app renders', async () => {
    const { createRouting } = await loadRouting()
    window.sessionStorage.setItem(REDIRECT_KEY, '/products/capstans/')
    const routing = createRouting('/aaron-enterprises/')
    routing.restoreSpaRedirect()

    expect(window.location.pathname).toBe('/aaron-enterprises/products/capstans/')
    expect(window.sessionStorage.getItem(REDIRECT_KEY)).toBeNull()
  })

  it('prefixes only root-relative links that are not already scoped to the app', async () => {
    const { createRouting } = await loadRouting()
    const { prefixInternalLinks } = createRouting('/aaron-enterprises/')
    const root = document.createElement('div')
    root.innerHTML = `
      <a id="internal" href="/contact">Contact</a>
      <a id="already-scoped" href="/aaron-enterprises/products">Products</a>
      <a id="base-root" href="/aaron-enterprises">Home</a>
      <a id="external" href="//example.com/path">External</a>
      <a id="relative" href="privacy">Privacy</a>
    `

    prefixInternalLinks(root)

    expect(root.querySelector('#internal')?.getAttribute('href')).toBe('/aaron-enterprises/contact')
    expect(root.querySelector('#already-scoped')?.getAttribute('href')).toBe('/aaron-enterprises/products')
    expect(root.querySelector('#base-root')?.getAttribute('href')).toBe('/aaron-enterprises')
    expect(root.querySelector('#external')?.getAttribute('href')).toBe('//example.com/path')
    expect(root.querySelector('#relative')?.getAttribute('href')).toBe('privacy')
  })
})
