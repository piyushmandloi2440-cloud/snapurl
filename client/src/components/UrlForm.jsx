import React, { useState } from 'react';

const UrlForm = ({ onShorten, isLoading }) => {
  const [inputUrl, setInputUrl] = useState('');
  const [validationError, setValidationError] = useState('');

  const quickSamples = [
    { label: 'GitHub', url: 'https://github.com' },
    { label: 'Google', url: 'https://www.google.com' },
    { label: 'MDN Web Docs', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript' },
  ];

  const validateUrl = (value) => {
    if (!value.trim()) {
      return 'Please enter a URL to shorten';
    }
    try {
      const parsed = new URL(value.trim());
      if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
        return 'URL must start with http:// or https://';
      }
      return '';
    } catch {
      return 'Please enter a valid URL (e.g. https://example.com/page)';
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const error = validateUrl(inputUrl);
    if (error) {
      setValidationError(error);
      return;
    }
    setValidationError('');
    onShorten(inputUrl.trim());
  };

  const handleInputChange = (e) => {
    setInputUrl(e.target.value);
    if (validationError) {
      setValidationError('');
    }
  };

  const handleSampleClick = (url) => {
    setInputUrl(url);
    setValidationError('');
  };

  const handleClear = () => {
    setInputUrl('');
    setValidationError('');
  };

  return (
    <div className="url-form-container">
      <form onSubmit={handleSubmit} className="url-form">
        <div className={`input-wrapper ${validationError ? 'input-error' : ''}`}>
          <div className="input-prefix-icon">
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
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
          </div>

          <input
            type="text"
            className="url-input"
            placeholder="Paste your long URL here (e.g. https://example.com/very/long/link)"
            value={inputUrl}
            onChange={handleInputChange}
            disabled={isLoading}
            autoFocus
          />

          {inputUrl && (
            <button
              type="button"
              className="clear-btn"
              onClick={handleClear}
              title="Clear input"
              aria-label="Clear input"
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
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}

          <button
            type="submit"
            className="submit-btn"
            disabled={isLoading || !inputUrl.trim()}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                <span>Shortening...</span>
              </>
            ) : (
              <>
                <span>Shorten URL</span>
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
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </>
            )}
          </button>
        </div>

        {validationError && (
          <div className="validation-message">
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
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{validationError}</span>
          </div>
        )}
      </form>

      <div className="quick-samples">
        <span className="samples-label">Try sample:</span>
        <div className="samples-pills">
          {quickSamples.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              className="sample-pill"
              onClick={() => handleSampleClick(sample.url)}
            >
              {sample.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UrlForm;
