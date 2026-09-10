import React from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App.jsx'

/* HashRouter, not BrowserRouter: GitHub Pages has no server-side rewrite,
   so a deep link like /stop/s04 would 404 on a hard refresh otherwise. */
createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
)
