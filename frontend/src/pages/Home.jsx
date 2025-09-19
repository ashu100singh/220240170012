import React, { useEffect, useState } from 'react'
import { saveLink, getAllLinks, generateShortcode } from '../utils/storage'
import LinkCard from '../components/LinkCard'

export default function Home() {
  const [url, setUrl] = useState('')
  const [validity, setValidity] = useState('')
  const [customCode, setCustomCode] = useState('')
  const [error, setError] = useState('')
  const [created, setCreated] = useState(null)
  const [history, setHistory] = useState([])

  useEffect(() => {
    setHistory(getAllLinks())
  }, [])

  function isValidUrl(str) {
    try {
      const u = new URL(str)
      // simple checks: protocol http or https
      return u.protocol === 'http:' || u.protocol === 'https:'
    } catch {
      return false
    }
  }

  const handleCreate = (e) => {
    e.preventDefault()
    setError('')
    setCreated(null)

    if (!url.trim()) {
      setError('Please enter a URL.')
      return
    }
    if (!isValidUrl(url.trim())) {
      setError('Enter a valid URL including protocol (https://).')
      return
    }

    const minutes = parseInt(validity, 10) || 30
    const shortcode = customCode.trim() || generateShortcode()

    const res = saveLink(shortcode, url.trim(), minutes)
    if (!res.ok) {
      setError(res.message)
      return
    }

    setCreated(res.link)
    setHistory(getAllLinks())
    setUrl('')
    setValidity('')
    setCustomCode('')
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleCreate} className="bg-white p-6 rounded shadow space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Original URL</label>
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            className="w-full border rounded p-2"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">Validity (minutes)</label>
            <input
              value={validity}
              onChange={(e) => setValidity(e.target.value)}
              placeholder="30"
              className="w-full border rounded p-2"
            />
            <p className="text-xs text-gray-500 mt-1">Leave empty for default 30 minutes</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Custom shortcode (optional)</label>
            <input
              value={customCode}
              onChange={(e) => setCustomCode(e.target.value)}
              placeholder="my-code"
              className="w-full border rounded p-2"
            />
            <p className="text-xs text-gray-500 mt-1">Alphanumeric, unique. If taken you will be asked to choose another.</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 bg-indigo-600 text-white rounded">Create Short Link</button>
          <button
            type="button"
            onClick={() => {
              setUrl('')
              setValidity('')
              setCustomCode('')
              setError('')
            }}
            className="px-3 py-2 border rounded"
          >
            Reset
          </button>
        </div>

        {error && <div className="text-sm text-red-600">{error}</div>}
      </form>

      {created && (
        <div>
          <h2 className="text-lg font-medium mb-2">Created</h2>
          <LinkCard link={created} showCopy />
        </div>
      )}

      <div>
        <h2 className="text-lg font-medium mb-2">History</h2>
        <div className="space-y-3">
          {history.length === 0 && <div className="text-sm text-gray-500">No links yet.</div>}
          {history.map((l) => (
            <LinkCard key={l.shortcode} link={l} />
          ))}
        </div>
      </div>
    </div>
  )
}
