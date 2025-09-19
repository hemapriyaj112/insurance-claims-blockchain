import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar({ isDarkMode, toggleDarkMode, user, onLogout, onLoginClick }) {
  return (
    <nav className="navbar">
      {/* Left - Logo + Brand */}
      <div className="navbar-left">
        <img src="/logo192.png" alt="ChainInsure Logo" className="logo" />
        <h1 className="brand">ChainInsure</h1>
      </div>

      {/* Center - Links */}
      <ul className="navbar-links">
        <li>
          <Link to="/">Dashboard</Link>
        </li>
        <li>
          <Link to="/register">Register Policy</Link>
        </li>
        <li>
          <Link to="/claim">File Claim</Link>
        </li>
        <li>
          <Link to="/track">Track Claim</Link>
        </li>
      </ul>

      {/* Right - Controls */}
      <div className="navbar-right">
        <button className="dark-mode-btn" onClick={toggleDarkMode}>
          {isDarkMode ? "☀️" : "🌙"}
        </button>

        {user ? (
          <>
            <span className="user-greeting">Hello, {user}</span>
            <button className="wallet-logout" onClick={onLogout}>
              Logout
            </button>
          </>
        ) : (
          <button className="wallet-btn" onClick={onLoginClick}>
            Login / Sign Up
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
