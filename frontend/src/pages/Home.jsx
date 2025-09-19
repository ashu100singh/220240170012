import React, { useState, useEffect } from "react";
import { saveLink, getAllLinks, generateShortcode } from "../utils/storage";
import LinkCard from "../components/LinkCard";

export default function Home() {
  const [url, setUrl] = useState("");
  const [validity, setValidity] = useState("");
  const [customCode, setCustomCode] = useState("");
  const [error, setError] = useState("");
  const [created, setCreated] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    setHistory(getAllLinks());
  }, []);

  function isValidUrl(str) {
    try {
      new URL(str);
      return true;
    } catch {
      return false;
    }
  }

  const handleCreate = (e) => {
    e.preventDefault();
    setError("");

    if (!url.trim()) {
      setError("Please enter a URL");
      return;
    }
    if (!isValidUrl(url.trim())) {
      setError("Enter a valid URL including https://");
      return;
    }

    const minutes = parseInt(validity) || 30;
    const shortcode = customCode.trim() || generateShortcode();
    const res = saveLink(shortcode, url.trim(), minutes);
    if (!res.ok) {
      setError(res.message);
      return;
    }

    setCreated(res.link);
    setHistory(getAllLinks());
    setUrl("");
    setCustomCode("");
    setValidity("");
  };

  return (
    <div className="space-y-6">
      <form
        onSubmit={handleCreate}
        className="bg-white p-6 rounded-2xl shadow-md space-y-4"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Original URL
          </label>
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Validity (minutes)
            </label>
            <input
              value={validity}
              onChange={(e) => setValidity(e.target.value)}
              placeholder="30"
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Custom shortcode (optional)
            </label>
            <input
              value={customCode}
              onChange={(e) => setCustomCode(e.target.value)}
              placeholder="my-code"
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow">
            Create Short Link
          </button>
          <button
            type="button"
            onClick={() => {
              setUrl("");
              setValidity("");
              setCustomCode("");
              setError("");
            }}
            className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
          >
            Reset
          </button>
        </div>

        {error && (
          <div className="text-sm bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg">
            {error}
          </div>
        )}
      </form>

      {created && (
        <div>
          <h2 className="text-lg font-medium mb-2">Created</h2>
          <LinkCard link={created} showCopy />
        </div>
      )}

      <div>
        <h2 className="text-lg font-medium mb-2">All Links</h2>
        <div className="space-y-3">
          {history.length === 0 && (
            <div className="text-sm text-gray-500">No links yet.</div>
          )}
          {history.map((l) => (
            <LinkCard key={l.shortcode} link={l} />
          ))}
        </div>
      </div>
    </div>
  );
}
