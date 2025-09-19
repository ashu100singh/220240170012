import React, { useState } from "react";
import Home from "./pages/Home";
import Stats from "./pages/Stats";
import { Log } from "../../Logging Middleware/loggingMiddleware";



export default function App({ initialTab = "home" }) {
  const [tab, setTab] = useState(initialTab);


  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="bg-white shadow sticky top-0">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-indigo-600">
            Shortly — URL Shortener
          </h1>
          <nav className="space-x-3">
            <button
              onClick={() => setTab("home")}
              className={`px-3 py-1 rounded-lg ${
                tab === "home"
                  ? "bg-indigo-600 text-white shadow"
                  : "hover:bg-indigo-50"
              }`}
            >
              Create
            </button>
            <button
              onClick={() => setTab("stats")}
              className={`px-3 py-1 rounded-lg ${
                tab === "stats"
                  ? "bg-indigo-600 text-white shadow"
                  : "hover:bg-indigo-50"
              }`}
            >
              Statistics
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6">
        {tab === "home" ? <Home /> : <Stats />}
      </main>

      <footer className="max-w-4xl mx-auto p-4 text-center text-sm text-gray-500">
        Built with React + Tailwind by Ashutosh Singh
      </footer>
    </div>
  );
}
