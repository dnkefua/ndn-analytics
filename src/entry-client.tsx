import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import './env'
import './styles/variables.css'
import './styles/typography.css'
import './styles/animations.css'
import './styles/components.css'
import './styles/mobile.css'
import './index.css'
import App from './App.tsx'

const releaseGlobalScrollLock = () => {
  const root = document.documentElement
  if (root.classList.contains('swg-disable-scroll')) {
    root.classList.remove('swg-disable-scroll')
  }
  if (root.style.paddingBottom) {
    root.style.removeProperty('padding-bottom')
  }
  if (root.style.overflowY !== 'auto') {
    root.style.overflowY = 'auto'
  }
  if (document.body.style.overflowY !== 'auto') {
    document.body.style.overflowY = 'auto'
  }
}

releaseGlobalScrollLock()

new MutationObserver(releaseGlobalScrollLock).observe(document.documentElement, {
  attributes: true,
  attributeFilter: ['class', 'style'],
})

const container = document.getElementById('root')!
if (container.hasChildNodes()) {
  hydrateRoot(
    container,
    <StrictMode>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </StrictMode>
  )
} else {
  createRoot(container).render(
    <StrictMode>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </StrictMode>
  )
}

if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        registration.update().catch(() => undefined)
        registration.waiting?.postMessage({ type: 'SKIP_WAITING' })
      })
      .catch((error) => {
        console.warn('[NDN Analytics] Service worker registration failed:', error)
      })
  })
}
