import React, { useState } from 'react'
import Home from './pages/Home'
import Stats from './pages/Stats'
import { Link } from 'react-router-dom'

export default function App({ initialTab = 'home' }) {
  const [tab, setTab] = useState(initialTab)

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <h1 className="text-xl font-semibold">Shortly</h1>
            <span className="text-sm text-gray-500">Frontend-only URL shortener</span>
          </div>

          <nav className="space-x-3">
            <button
              onClick={() => setTab('home')}
              className={`px-3 py-1 rounded ${tab === 'home' ? 'bg-indigo-600 text-white' : 'hover:bg-indigo-50'}`}
            >
              Create
            </button>
            <button
              onClick={() => setTab('stats')}
              className={`px-3 py-1 rounded ${tab === 'stats' ? 'bg-indigo-600 text-white' : 'hover:bg-indigo-50'}`}
            >
              Statistics
            </button>
            {/* <Link to="/" className="ml-2 text-sm text-gray-500 hover:underline">Home route</Link>
            <Link to="/stats" className="ml-2 text-sm text-gray-500 hover:underline">/stats</Link> */}
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4">
        {tab === 'home' ? <Home /> : <Stats />}
      </main>

      <footer className="max-w-4xl mx-auto p-4 text-center text-sm text-gray-500">
        Built with React + Tailwind 
      </footer>
    </div>
  )
}
