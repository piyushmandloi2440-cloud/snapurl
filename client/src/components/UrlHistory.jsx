import React, { useState } from 'react';

const UrlHistory = ({ urls, onRefresh, onDelete, onOpenStats, isLoading }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedCode, setCopiedCode] = useState(null);

  const filteredUrls = urls.filter((item) => {
    const term = searchTerm.toLowerCase();
    return (
      item.shortCode.toLowerCase().includes(term) ||
      item.originalUrl.toLowerCase().includes(term) ||
      item.shortUrl.toLowerCase().includes(term)
    );
  });

  const handleCopy = async (shortUrl, shortCode) => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopiedCode(shortCode);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = shortUrl;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopiedCode(shortCode);
      setTimeout(() => setCopiedCode(null), 2000);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Just now';
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <section id="history-section" className="history-section">
      <div className="history-header">
        <div className="history-title-area">
          <h2>
            Recent Shortened URLs
            <span className="count-badge">{urls.length}</span>
          </h2>
          <p className="history-subtitle">
            Manage your generated short links and monitor real-time click engagement.
          </p>
        </div>

        <div className="history-toolbar">
          <div className="search-box">
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
              className="search-icon"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search by code or URL..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <button
            type="button"
            className="refresh-btn"
            onClick={onRefresh}
            disabled={isLoading}
            title="Refresh click counts"
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
              className={isLoading ? 'rotating' : ''}
            >
              <polyline points="23 4 23 10 17 10" />
              <polyline points="1 20 1 14 7 14" />
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
            </svg>
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {urls.length === 0 ? (
        <div className="empty-history-card">
          <div className="empty-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
          </div>
          <h3>No short links created yet</h3>
          <p>Paste a long URL above to generate your first tracked short link.</p>
        </div>
      ) : filteredUrls.length === 0 ? (
        <div className="empty-history-card">
          <p>No shortened links match your search query "{searchTerm}".</p>
        </div>
      ) : (
        <div className="history-table-container">
          <table className="history-table">
            <thead>
              <tr>
                <th>Short Link</th>
                <th>Destination</th>
                <th className="text-center">Clicks</th>
                <th>Created</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUrls.map((item) => {
                const isCopied = copiedCode === item.shortCode;
                return (
                  <tr key={item._id || item.shortCode}>
                    <td className="col-short">
                      <div className="short-code-cell">
                        <span className="code-tag">{item.shortCode}</span>
                        <a
                          href={item.shortUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="table-short-link"
                          title="Open short link"
                        >
                          {item.shortUrl}
                        </a>
                      </div>
                    </td>

                    <td className="col-target">
                      <div className="destination-cell" title={item.originalUrl}>
                        <a
                          href={item.originalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="table-dest-link"
                        >
                          {item.originalUrl}
                        </a>
                      </div>
                    </td>

                    <td className="col-clicks text-center">
                      <span className="click-counter-pill" title="Total clicks">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="13"
                          height="13"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                        {item.clicks || 0}
                      </span>
                    </td>

                    <td className="col-date">
                      <span className="date-text">{formatDate(item.createdAt)}</span>
                    </td>

                    <td className="col-actions text-right">
                      <div className="table-btn-group">
                        <button
                          type="button"
                          className={`table-action-btn ${isCopied ? 'copied' : ''}`}
                          onClick={() => handleCopy(item.shortUrl, item.shortCode)}
                          title="Copy short link"
                        >
                          {isCopied ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="15"
                              height="15"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="15"
                              height="15"
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
                          )}
                        </button>

                        <button
                          type="button"
                          className="table-action-btn"
                          onClick={() => onOpenStats(item.shortCode)}
                          title="View stats"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="15"
                            height="15"
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

                        {onDelete && (
                          <button
                            type="button"
                            className="table-action-btn delete-btn"
                            onClick={() => onDelete(item._id)}
                            title="Delete link"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="15"
                              height="15"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default UrlHistory;
