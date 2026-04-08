import { StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'
import './env'
import './styles/variables.css'
import './styles/typography.css'
import './styles/animations.css'
import './styles/components.css'
import './index.css'
import App from './App.tsx'

hydrateRoot(document.getElementById('root')!, 
  <StrictMode>
    <App />
  </StrictMode>
)