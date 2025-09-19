// storage.js - LocalStorage helper and utilities
const STORAGE_KEY = 'shortly_links_v1'

// load data (array of link objects)
function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw)
  } catch {
    return []
  }
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function getAllLinks() {
  const arr = loadData()
  // newest first
  return arr.sort((a,b)=>b.createdAt - a.createdAt)
}

export function getLink(shortcode) {
  const arr = loadData()
  return arr.find(item => item.shortcode === shortcode) || null
}

export function formatDate(timestamp) {
  if (!timestamp) return '—'
  const d = new Date(timestamp)
  return d.toLocaleString()
}

function existsShortcode(code) {
  return !!getLink(code)
}

export function generateShortcode(length = 6) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code
  let attempt = 0
  do {
    code = Array.from({length}).map(()=>chars[Math.floor(Math.random()*chars.length)]).join('')
    attempt++
    // safety: break after many attempts
    if (attempt > 50) break
  } while (existsShortcode(code))
  return code
}

/**
 * Save link into storage.
 * returns { ok: boolean, message?, link? }
 */
export function saveLink(shortcode, originalUrl, validityMinutes = 30) {
  // sanitize shortcode: only alnum, dashes, underscores
  const sc = shortcode.trim()
  if (!sc) return { ok: false, message: 'Shortcode cannot be empty.' }
  if (!/^[A-Za-z0-9-_]+$/.test(sc)) {
    return { ok: false, message: 'Shortcode can only contain letters, numbers, hyphen and underscore.' }
  }

  if (existsShortcode(sc)) {
    return { ok: false, message: 'Shortcode already exists. Choose another.' }
  }

  const now = Date.now()
  const expiry = validityMinutes > 0 ? now + Math.round(validityMinutes * 60 * 1000) : null
  const link = {
    shortcode: sc,
    originalUrl,
    createdAt: now,
    expiry,
    clicks: []
  }

  const arr = loadData()
  arr.push(link)
  saveData(arr)

  return { ok: true, link }
}

/**
 * Record a click for a shortcode. Will attempt to fetch coarse location info via ipapi.co.
 * click = { timestamp, referrer, location }
 */
export async function recordClick(shortcode, { referrer = 'direct' } = {}) {
  const arr = loadData()
  const idx = arr.findIndex(i => i.shortcode === shortcode)
  if (idx === -1) return false

  const click = {
    timestamp: Date.now(),
    referrer,
    location: 'Unknown'
  }

  // push initial click immediately (so stats reflect quickly)
  arr[idx].clicks = arr[idx].clicks || []
  arr[idx].clicks.push(click)
  saveData(arr)

  // try to get coarse location (best-effort). If it fails, keep 'Unknown'
  try {
    const resp = await fetch('https://ipapi.co/json/') // public free endpoint; may rate-limit
    if (resp.ok) {
      const data = await resp.json()
      // choose coarse field: country_name or region
      const loc = data.country_name || data.region || data.country || 'Unknown'
      // update the last click with location
      const arr2 = loadData()
      const idx2 = arr2.findIndex(i => i.shortcode === shortcode)
      if (idx2 !== -1) {
        const clicks = arr2[idx2].clicks || []
        if (clicks.length > 0) {
          clicks[clicks.length - 1].location = loc
          saveData(arr2)
        }
      }
    }
  } catch (e) {
    // ignore
  }

  return true
}
