import React from "react";
import "../styles/Header.css";

const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        <img src="/logo.png" alt="Company Logo" />
        <h1>Packers and Movers</h1>
      </div>
      <nav className="nav-links">
        <a href="#services">Services</a>
        <a href="#about">About Us</a>
        <a href="#contact">Contact</a>
        <a href="#login" className="login-btn">Login</a>
      </nav>
    </header>
  );
};

export default Header;