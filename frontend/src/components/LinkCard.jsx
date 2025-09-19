import React, { useState } from "react";

export default function LinkCard({ link, showCopy = false }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(
      `${window.location.origin}/${link.shortcode}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-xl shadow p-4 flex flex-col md:flex-row md:items-center md:justify-between">
      <div>
        <a
          href={`/${link.shortcode}`}
          className="text-indigo-600 font-semibold hover:underline"
        >
          {window.location.origin}/{link.shortcode}
        </a>
        <p className="text-sm text-gray-600 break-all">
          {link.originalUrl}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Expiry: {new Date(link.expiry).toLocaleString()}
        </p>
      </div>

      {showCopy && (
        <button
          onClick={handleCopy}
          className="mt-3 md:mt-0 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      )}
    </div>
  );
}
