import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './env'
import './styles/variables.css'
import './styles/typography.css'
import './styles/animations.css'
import './styles/components.css'
import './index.css'
import App from './App.tsx'
import { initAnalytics, debugAnalytics } from './lib/analytics'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// initialize analytics (if VITE_GA_ID is set)
initAnalytics();
// log debug output so developer can verify in browser console
debugAnalytics();
