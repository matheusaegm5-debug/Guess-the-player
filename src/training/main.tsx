import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './training.css'
import TrainingApp from './TrainingApp.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TrainingApp />
  </StrictMode>,
)
