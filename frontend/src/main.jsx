import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import RedirectPage from './pages/Redirect'
import './index.css'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/stats" element={<App initialTab="stats" />} />
        {/* Param route last so it doesn't override other routes */}
        <Route path="/:shortcode" element={<RedirectPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
