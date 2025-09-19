import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getLink, recordClick } from "../utils/storage";

export default function RedirectPage() {
  const { shortcode } = useParams();
  const [status, setStatus] = useState("checking");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const run = async () => {
      const link = getLink(shortcode);
      if (!link) {
        setStatus("error");
        setMessage("Shortcode not found.");
        return;
      }

      const now = Date.now();
      if (link.expiry && now > link.expiry) {
        setStatus("expired");
        setMessage("This link has expired.");
        return;
      }

      const referrer = document.referrer || "direct";
      await recordClick(shortcode, { referrer });

      setStatus("redirecting");
      window.location.href = link.originalUrl;
    };
    run();
  }, [shortcode]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      {status === "checking" && <p>Checking link...</p>}
      {status === "redirecting" && <p>Redirecting...</p>}
      {status !== "redirecting" && status !== "checking" && (
        <div className="bg-white p-6 rounded-xl shadow text-center">
          <p className="text-red-600 font-medium">{message}</p>
          <Link to="/" className="mt-3 inline-block text-indigo-600 hover:underline">
            Go back home
          </Link>
        </div>
      )}
    </div>
  );
}
