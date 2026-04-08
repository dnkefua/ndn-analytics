import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './env'
import './styles/variables.css'
import './styles/typography.css'
import './styles/animations.css'
import './styles/components.css'
import './index.css'
import App from './App.tsx'

const container = document.getElementById('root')!
if (container.hasChildNodes()) {
  hydrateRoot(container, <StrictMode><App /></StrictMode>)
} else {
  createRoot(container).render(<StrictMode><App /></StrictMode>)
}