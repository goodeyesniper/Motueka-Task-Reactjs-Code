import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import { ThemeProvider } from './components/ThemeContext'
import AppWithUser from './components/AppWithUser'; // new wrapper component

import './index.css'

// Note <App /> has been transferred to AppWithUser.jsx

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AppWithUser />
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)
