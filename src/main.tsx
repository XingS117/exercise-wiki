import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './styles/global.css'
import { TrainingListProvider } from './lib/trainingListContext'

function migrateLegacyHashRoute() {
  if (window.location.hash.startsWith('#/')) {
    window.history.replaceState(null, '', window.location.hash.slice(1))
  }
}

migrateLegacyHashRoute()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <TrainingListProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </TrainingListProvider>
  </React.StrictMode>,
)
