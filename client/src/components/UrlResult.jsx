import React, { useState } from 'react';

const UrlResult = ({ result, onOpenStats }) => {
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);

  if (!result) return null;

  const { shortUrl, originalUrl, shortCode, clicks } = result;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback copy using textarea
      const textarea = document.createElement('textarea');
      textarea.value = shortUrl;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
    shortUrl
  )}&bgcolor=1e293b&color=ffffff&margin=10`;

  return (
    <div className="result-card-wrapper animate-slide-up">
      <div className="result-card">
        <div className="result-header">
          <div className="result-status">
            <span className="success-badge">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              URL Shortened
            </span>
            <span className="code-pill">Code: {shortCode}</span>
          </div>

          <div className="result-stats-badge" title="Total clicks">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            <span>{clicks || 0} {clicks === 1 ? 'click' : 'clicks'}</span>
          </div>
        </div>

        {/* Shortened URL display box */}
        <div className="result-box">
          <div className="short-url-text">
            <a
              href={shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="short-link"
              title="Click to test redirect"
            >
              {shortUrl}
            </a>
          </div>

          <div className="result-actions">
            <button
              type="button"
              className={`action-btn copy-btn ${copied ? 'copied' : ''}`}
              onClick={handleCopy}
              title="Copy to clipboard"
            >
              {copied ? (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                  <span>Copy</span>
                </>
              )}
            </button>

            <a
              href={shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="action-btn visit-btn"
              title="Visit short URL"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              <span>Visit</span>
            </a>

            <button
              type="button"
              className="action-btn icon-only-btn"
              onClick={() => setShowQr(!showQr)}
              title={showQr ? 'Hide QR Code' : 'Show QR Code'}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
              </svg>
            </button>

            {onOpenStats && (
              <button
                type="button"
                className="action-btn icon-only-btn"
                onClick={() => onOpenStats(shortCode)}
                title="View Analytics"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="20" x2="18" y2="10" />
                  <line x1="12" y1="20" x2="12" y2="4" />
                  <line x1="6" y1="20" x2="6" y2="14" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* QR Code expansion */}
        {showQr && (
          <div className="qr-container animate-fade-in">
            <div className="qr-box">
              <img
                src={qrApiUrl}
                alt={`QR code for ${shortUrl}`}
                className="qr-image"
                loading="lazy"
              />
              <p className="qr-caption">Scan with mobile camera to test redirection</p>
            </div>
          </div>
        )}

        {/* Original Destination URL details */}
        <div className="result-footer">
          <div className="original-url-info">
            <span className="destination-label">Target Destination:</span>
            <span className="destination-text" title={originalUrl}>
              {originalUrl}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UrlResult;
