import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router'
import { StrictMode } from 'react'
import { HelmetProvider } from 'react-helmet-async'
import type { HelmetServerState } from 'react-helmet-async'
import './env'
import './styles/variables.css'
import './styles/typography.css'
import './styles/animations.css'
import './styles/components.css'
import './index.css'
import App from './App.tsx'

export function render(url: string) {
  const helmetContext: { helmet?: HelmetServerState } = {}
  const html = renderToString(
    <StrictMode>
      <HelmetProvider context={helmetContext}>
        <StaticRouter location={url}>
          <App />
        </StaticRouter>
      </HelmetProvider>
    </StrictMode>
  )
  const { helmet } = helmetContext
  return { html, helmet }
}