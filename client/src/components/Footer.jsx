import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-left">
          <p>
            <strong>SnapURL</strong> &mdash; MERN Stack URL Shortener
          </p>
          <p className="footer-tech">
            Built with MongoDB, Express.js, React, and Node.js
          </p>
        </div>
        <div className="footer-right">
          <span className="footer-badge">TASK 1 Assignment</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
