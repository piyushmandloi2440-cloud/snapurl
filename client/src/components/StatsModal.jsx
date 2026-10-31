import React, { useState, useEffect } from 'react';

const StatsModal = ({ shortCode, onClose }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!shortCode) return;

    const fetchStats = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await fetch(`http://localhost:5000/api/stats/${shortCode}`);
        const data = await res.json();

        if (res.ok && data.success) {
          setStats(data.data);
        } else {
          setError(data.message || 'Failed to load link analytics.');
        }
      } catch (err) {
        setError('Error connecting to backend server.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [shortCode]);

  const handleCopy = async () => {
    if (!stats?.shortUrl) return;
    try {
      await navigator.clipboard.writeText(stats.shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card animate-scale-in" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrap">
            <div className="modal-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
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
            </div>
            <div>
              <h3>Link Analytics</h3>
              <p className="modal-code">Code: <span>{shortCode}</span></p>
            </div>
          </div>

          <button type="button" className="close-btn" onClick={onClose} title="Close modal">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="modal-body">
          {loading ? (
            <div className="modal-loading">
              <div className="spinner large-spinner"></div>
              <p>Fetching link analytics...</p>
            </div>
          ) : error ? (
            <div className="modal-error">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <p>{error}</p>
            </div>
          ) : stats ? (
            <div className="stats-grid">
              {/* Stat Card 1: Total Clicks */}
              <div className="stat-card highlight">
                <span className="stat-label">Total Clicks</span>
                <span className="stat-number">{stats.clicks}</span>
                <span className="stat-note">Tracked redirects</span>
              </div>

              {/* Stat Card 2: Created Date */}
              <div className="stat-card">
                <span className="stat-label">Created Date</span>
                <span className="stat-value">{formatDate(stats.createdAt)}</span>
                <span className="stat-note">Initial generation</span>
              </div>

              {/* Detail: Short URL */}
              <div className="stat-detail-box full-width">
                <span className="detail-label">Short URL</span>
                <div className="detail-copy-row">
                  <a
                    href={stats.shortUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="detail-link"
                  >
                    {stats.shortUrl}
                  </a>
                  <button
                    type="button"
                    className={`mini-copy-btn ${copied ? 'copied' : ''}`}
                    onClick={handleCopy}
                  >
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>

              {/* Detail: Destination URL */}
              <div className="stat-detail-box full-width">
                <span className="detail-label">Original Long Destination</span>
                <p className="detail-orig-url" title={stats.originalUrl}>
                  {stats.originalUrl}
                </p>
              </div>
            </div>
          ) : null}
        </div>

        <div className="modal-footer">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatsModal;
