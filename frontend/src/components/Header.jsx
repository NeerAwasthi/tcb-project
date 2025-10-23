// frontend/src/components/Header.jsx
import React from "react";
import { FaMoon, FaSun, FaStickyNote } from "react-icons/fa";

const Header = ({ theme, setTheme, userInfo, onLogout }) => {
  const toggle = () => setTheme(prev => prev === "dark" ? "light" : "dark");

  return (
    <header className="header">
      <div className="brand">
        <FaStickyNote className="brand-icon" />
        <a href="/" className="brand-text" style={{ textDecoration: 'none', color: 'inherit' }}>
          Notes Manager
        </a>
      </div>

      <div className="header-actions">
        {userInfo ? (
          <>
            <a href="/summarizer" className="btn small ghost">Summarizer</a>
            <span style={{ color: "var(--muted)" }}>Hi, {userInfo.name}</span>
            <button className="btn small ghost" onClick={onLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <a href="/login" className="btn small ghost">Login</a>
            <a href="/signup" className="btn small primary">Sign Up</a>
          </>
        )}

        <button
          aria-label="Toggle theme"
          className="icon-btn"
          onClick={toggle}
          title={theme === "dark" ? "Switch to light" : "Switch to dark"}
        >
          {theme === "dark" ? <FaSun /> : <FaMoon />}
        </button>
      </div>
    </header>
  );
};

export default Header;