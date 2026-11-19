import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App.jsx'
import VirtualCursor from './VirtualCursor.jsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <VirtualCursor />
  </StrictMode>,
)