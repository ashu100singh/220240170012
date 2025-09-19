import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getLink, recordClick } from '../utils/storage'

export default function RedirectPage() {
  const { shortcode } = useParams()
  const [status, setStatus] = useState('checking') // 'checking' | 'redirecting' | 'error' | 'expired'
  const [message, setMessage] = useState('')
  const [linkObj, setLinkObj] = useState(null)

  useEffect(() => {
    const run = async () => {
      if (!shortcode) {
        setStatus('error')
        setMessage('No shortcode provided in URL.')
        return
      }

      const link = getLink(shortcode)
      if (!link) {
        setStatus('error')
        setMessage('Shortcode not found.')
        return
      }

      setLinkObj(link)

      const now = Date.now()
      if (link.expiry && now > link.expiry) {
        setStatus('expired')
        setMessage('This link has expired.')
        return
      }

      // record click (async)
      const referrer = document.referrer || 'direct'
      // recordClick will attempt to fetch coarse geo; not required for redirect
      recordClick(shortcode, { referrer }).catch(() => {})

      setStatus('redirecting')
      // small delay for UX/visibility (100-300ms). Immediately redirect in practice:
      setTimeout(() => {
        window.location.href = link.originalUrl
      }, 200)
    }

    run()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shortcode])

  if (status === 'checking') {
    return (
      <div className="max-w-2xl mx-auto mt-12 text-center">
        <div className="bg-white p-6 rounded shadow">Checking shortcode…</div>
      </div>
    )
  }

  if (status === 'redirecting') {
    return (
      <div className="max-w-2xl mx-auto mt-12 text-center">
        <div className="bg-white p-6 rounded shadow">
          Redirecting you to: <a className="text-indigo-600 underline" href={linkObj?.originalUrl}>{linkObj?.originalUrl}</a>
        </div>
      </div>
    )
  }

  // error or expired
  return (
    <div className="max-w-2xl mx-auto mt-12">
      <div className="bg-white p-6 rounded shadow space-y-4">
        <h2 className="text-lg font-medium">{status === 'expired' ? 'Link expired' : 'Link not found'}</h2>
        <p className="text-sm text-gray-600">{message}</p>
        <div className="pt-2">
          <Link to="/" className="text-indigo-600 underline">Go back to home</Link>
        </div>
      </div>
    </div>
  )
}
