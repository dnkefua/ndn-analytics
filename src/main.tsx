import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Fonts — bundled locally, no CDN
import '@fontsource-variable/inter'
import '@fontsource-variable/syne'
import '@fontsource-variable/jetbrains-mono'
import './styles/variables.css'
import './styles/typography.css'
import './styles/animations.css'
import './styles/components.css'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
