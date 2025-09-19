import React, { useState } from 'react'
import { formatDate } from '../utils/storage'

export default function LinkCard({ link, showCopy = false }) {
  const [copied, setCopied] = useState(false)
  const shortUrl = `${window.location.origin}/${link.shortcode}`
  const isExpired = link.expiry && Date.now() > link.expiry

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // fallback
      const area = document.createElement('textarea')
      area.value = shortUrl
      document.body.appendChild(area)
      area.select()
      document.execCommand('copy')
      document.body.removeChild(area)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    }
  }

  return (
    <div className="bg-white p-4 rounded shadow flex items-start justify-between">
      <div className="flex-1">
        <div className="flex items-baseline space-x-3">
          <a className="text-indigo-600 font-medium underline" href={shortUrl} target="_blank" rel="noreferrer">{shortUrl}</a>
          <span className={`text-xs px-2 py-1 rounded ${isExpired ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {isExpired ? 'Expired' : 'Active'}
          </span>
        </div>

        <div className="text-sm text-gray-600 mt-1 break-all">{link.originalUrl}</div>
        <div className="text-xs text-gray-500 mt-2">Created: {formatDate(link.createdAt)}</div>
        <div className="text-xs text-gray-500">Expiry: {link.expiry ? formatDate(link.expiry) : 'No expiry'}</div>
      </div>

      <div className="ml-4 flex flex-col items-end space-y-2">
        {showCopy && (
          <button onClick={copy} className="px-3 py-1 border rounded text-sm">
            {copied ? 'Copied!' : 'Copy link'}
          </button>
        )}
        <a className="text-sm text-indigo-600 underline" href={link.originalUrl} target="_blank" rel="noreferrer">Open</a>
      </div>
    </div>
  )
}
