import { v4 as uuidv4 } from "uuid";

const STORAGE_KEY = "shortly_links";

export function generateShortcode() {
  return uuidv4().slice(0, 6);
}

export function getAllLinks() {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return [];
  return JSON.parse(data);
}

export function saveLink(shortcode, url, minutes) {
  const links = getAllLinks();
  if (links.find((l) => l.shortcode === shortcode)) {
    return { ok: false, message: "Shortcode already exists." };
  }

  const expiry = Date.now() + minutes * 60 * 1000;
  const newLink = {
    shortcode,
    originalUrl: url,
    expiry,
    createdAt: Date.now(),
    clicks: [],
  };

  links.push(newLink);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(links));
  return { ok: true, link: newLink };
}

export function getLink(shortcode) {
  return getAllLinks().find((l) => l.shortcode === shortcode);
}

export async function recordClick(shortcode, { referrer }) {
  const links = getAllLinks();
  const idx = links.findIndex((l) => l.shortcode === shortcode);
  if (idx === -1) return;

  links[idx].clicks.push({
    timestamp: Date.now(),
    referrer,
    location: "Unknown", // could integrate geo API here
  });

  localStorage.setItem(STORAGE_KEY, JSON.stringify(links));
}
