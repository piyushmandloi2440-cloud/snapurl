import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import UrlForm from './components/UrlForm';
import UrlResult from './components/UrlResult';
import UrlHistory from './components/UrlHistory';
import StatsModal from './components/StatsModal';
import Footer from './components/Footer';

// Backend API Base URL
const API_BASE_URL = 'http://localhost:5000/api';

function App() {
  const [urls, setUrls] = useState([]);
  const [latestResult, setLatestResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingUrls, setIsFetchingUrls] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [activeStatsCode, setActiveStatsCode] = useState(null);

  // Fetch recent URLs from backend
  const fetchUrls = useCallback(async () => {
    try {
      setIsFetchingUrls(true);
      const res = await fetch(`${API_BASE_URL}/urls`);
      const data = await res.json();
      if (res.ok && data.success) {
        setUrls(data.data || []);
      }
    } catch (err) {
      console.warn('Could not connect to backend to fetch URLs:', err.message);
    } finally {
      setIsFetchingUrls(false);
    }
  }, []);

  useEffect(() => {
    fetchUrls();
  }, [fetchUrls]);

  // Handle URL Shortening
  const handleShorten = async (originalUrl) => {
    try {
      setIsLoading(true);
      setErrorMessage('');
      setSuccessMessage('');

      const res = await fetch(`${API_BASE_URL}/shorten`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ originalUrl }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to shorten URL.');
      }

      setLatestResult(data.data);
      setSuccessMessage(data.message || 'URL shortened successfully!');

      // Update history list with new or existing item
      setUrls((prev) => {
        const filtered = prev.filter((item) => item.shortCode !== data.data.shortCode);
        return [data.data, ...filtered];
      });
    } catch (err) {
      setErrorMessage(err.message || 'Error communicating with backend server.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle deleting a URL
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this shortened URL?')) {
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/urls/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setUrls((prev) => prev.filter((item) => item._id !== id));
        if (latestResult && latestResult._id === id) {
          setLatestResult(null);
        }
        setSuccessMessage('Shortened link removed successfully.');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setErrorMessage(data.message || 'Failed to delete URL.');
      }
    } catch (err) {
      setErrorMessage('Error communicating with server.');
    }
  };

  return (
    <div className="app-layout">
      <Navbar />

      <main className="main-content">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-badge">
            <span className="hero-badge-dot"></span>
            Fast, Reliable & Trackable Link Shortener
          </div>

          <h1 className="hero-title">
            Shorten URLs, <span className="gradient-text">Expand Reach</span>
          </h1>

          <p className="hero-description">
            Transform long, complex URLs into neat 6-character links in seconds.
            Track every click, monitor engagement, and share with confidence.
          </p>

          {/* Alert Messages */}
          {errorMessage && (
            <div className="alert alert-error animate-fade-in" role="alert">
              <div className="alert-content">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>{errorMessage}</span>
              </div>
              <button
                type="button"
                className="alert-close"
                onClick={() => setErrorMessage('')}
                aria-label="Dismiss alert"
              >
                &times;
              </button>
            </div>
          )}

          {successMessage && (
            <div className="alert alert-success animate-fade-in" role="alert">
              <div className="alert-content">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>{successMessage}</span>
              </div>
              <button
                type="button"
                className="alert-close"
                onClick={() => setSuccessMessage('')}
                aria-label="Dismiss alert"
              >
                &times;
              </button>
            </div>
          )}

          {/* URL Input Form */}
          <UrlForm onShorten={handleShorten} isLoading={isLoading} />

          {/* Generated Result Card */}
          {latestResult && (
            <UrlResult
              result={latestResult}
              onOpenStats={(code) => setActiveStatsCode(code)}
            />
          )}

          {/* Highlights / Features Banner */}
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon icon-bolt">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
              </div>
              <h3>Instant Redirection</h3>
              <p>Optimized Express router guarantees ultra-fast HTTP 302 redirects to your target destination.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon icon-chart">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 20V10" />
                  <path d="M12 20V4" />
                  <path d="M6 20v-6" />
                </svg>
              </div>
              <h3>Click Tracking</h3>
              <p>Every link visit is tracked and incremented in MongoDB in real time.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon icon-shield">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <h3>Collision Free</h3>
              <p>Unique cryptographic short code generation ensures no duplicate or clashing URLs.</p>
            </div>
          </div>
        </section>

        {/* URLs History & Management Section */}
        <UrlHistory
          urls={urls}
          onRefresh={fetchUrls}
          onDelete={handleDelete}
          onOpenStats={(code) => setActiveStatsCode(code)}
          isLoading={isFetchingUrls}
        />
      </main>

      {/* Analytics Modal */}
      {activeStatsCode && (
        <StatsModal
          shortCode={activeStatsCode}
          onClose={() => setActiveStatsCode(null)}
        />
      )}

      <Footer />
    </div>
  );
}

export default App;
