import React from 'react';

const Navbar = () => {
  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <div className="brand-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="icon-link"
            >
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
          </div>
          <span className="brand-title">
            Snap<span className="brand-accent">URL</span>
          </span>
          <span className="badge-tag">v1.0</span>
        </div>

        <nav className="navbar-nav">
          <a
            href="http://localhost:5000/"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-link"
            title="Check Backend API Health"
          >
            <span className="status-dot"></span>
            Backend API
          </a>
          <a
            href="#history-section"
            className="nav-btn-secondary"
          >
            My Links
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
