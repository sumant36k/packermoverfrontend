import React from "react";
import "../styles/Footer.css";


const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Footer Logo and Title */}
        <div className="footer-title">
          <h2>Packers and Movers</h2>
        </div>

        {/* Links Section */}
        <div className="footer-links">
          <a href="#terms">Terms & Conditions</a>
          <a href="#privacy">Privacy Policy</a>
          <a href="#faq">FAQs</a>
        </div>

        {/* Contact Section */}
        <div className="footer-contact">
          <p>Call Us: <strong>855-008-7858</strong></p>
          <p>Email: <a href="mailto:support@moverspackers.com">support@moverspackers.com</a></p>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="footer-bottom">
        <p>&copy; 2025 Packers and Movers. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;


