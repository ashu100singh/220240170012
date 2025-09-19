import React, { useEffect, useState } from 'react'
import { getAllLinks, formatDate } from '../utils/storage'
import { Link } from 'react-router-dom'

export default function Stats() {
  const [links, setLinks] = useState([])

  useEffect(() => {
    setLinks(getAllLinks())
  }, [])

  const renderReferrerSummary = (clicks) => {
    const map = {}
    clicks.forEach(c => {
      const r = c.referrer || 'direct'
      map[r] = (map[r] || 0) + 1
    })
    const items = Object.entries(map).sort((a,b)=>b[1]-a[1])
    return items.slice(0,5).map(([k,v]) => `${k} (${v})`).join(', ')
  }

  const renderLocations = (clicks) => {
    const set = new Set()
    clicks.forEach(c => {
      if (c.location) set.add(c.location)
    })
    if (set.size === 0) return 'Unknown'
    return Array.from(set).slice(0,5).join(', ')
  }

  return (
    <div>
      <div className="bg-white p-4 rounded shadow mb-4 flex items-center justify-between">
        <h2 className="text-lg font-medium">Statistics</h2>
        <Link to="/" className="text-sm text-indigo-600 underline">Create</Link>
      </div>

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-sm">Short URL</th>
              <th className="px-4 py-2 text-left text-sm">Original URL</th>
              <th className="px-4 py-2 text-left text-sm">Created</th>
              <th className="px-4 py-2 text-left text-sm">Expiry</th>
              <th className="px-4 py-2 text-left text-sm">Clicks</th>
              <th className="px-4 py-2 text-left text-sm">Top Referrers</th>
              <th className="px-4 py-2 text-left text-sm">Locations</th>
            </tr>
          </thead>

          <tbody>
            {links.length === 0 && (
              <tr>
                <td colSpan="7" className="px-4 py-6 text-center text-sm text-gray-500">No links yet.</td>
              </tr>
            )}

            {links.map(link => (
              <tr key={link.shortcode} className="border-t">
                <td className="px-4 py-2 text-sm">
                  <a className="text-indigo-600 underline" href={`${window.location.origin}/${link.shortcode}`} target="_blank" rel="noreferrer">
                    {window.location.origin}/{link.shortcode}
                  </a>
                </td>
                <td className="px-4 py-2 text-sm break-all">
                  <a href={link.originalUrl} className="hover:underline" target="_blank" rel="noreferrer">{link.originalUrl}</a>
                </td>
                <td className="px-4 py-2 text-sm">{formatDate(link.createdAt)}</td>
                <td className="px-4 py-2 text-sm">{link.expiry ? formatDate(link.expiry) : 'No expiry'}</td>
                <td className="px-4 py-2 text-sm">{(link.clicks || []).length}</td>
                <td className="px-4 py-2 text-sm">{renderReferrerSummary(link.clicks || [])}</td>
                <td className="px-4 py-2 text-sm">{renderLocations(link.clicks || [])}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
