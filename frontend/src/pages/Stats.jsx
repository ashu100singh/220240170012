import React from "react";
import { getAllLinks } from "../utils/storage";

export default function Stats() {
  const links = getAllLinks();

  return (
    <div className="bg-white p-6 rounded-xl shadow overflow-x-auto">
      <h2 className="text-lg font-medium mb-4">All Shortened URLs</h2>
      {links.length === 0 ? (
        <p className="text-sm text-gray-500">No links created yet.</p>
      ) : (
        <table className="w-full border border-gray-200 text-sm">
          <thead>
            <tr className="bg-indigo-600 text-white text-left">
              <th className="px-3 py-2">Short URL</th>
              <th className="px-3 py-2">Original URL</th>
              <th className="px-3 py-2">Expiry</th>
              <th className="px-3 py-2">Clicks</th>
              <th className="px-3 py-2">Referrers</th>
            </tr>
          </thead>
          <tbody>
            {links.map((link) => (
              <tr
                key={link.shortcode}
                className="border-t border-gray-200 hover:bg-gray-50"
              >
                <td className="px-3 py-2 text-indigo-600">
                  {window.location.origin}/{link.shortcode}
                </td>
                <td className="px-3 py-2 break-all">{link.originalUrl}</td>
                <td className="px-3 py-2">
                  {new Date(link.expiry).toLocaleString()}
                </td>
                <td className="px-3 py-2">{link.clicks.length}</td>
                <td className="px-3 py-2">
                  {link.clicks.length > 0
                    ? link.clicks.map((c, i) => (
                        <span key={i} className="inline-block bg-gray-100 px-2 py-1 rounded mr-1 text-xs">
                          {c.referrer}
                        </span>
                      ))
                    : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
