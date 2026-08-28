// src/App.jsx
// Root component: Navigation bar + page routing
// Uses React Router's <Routes> and <Route> to switch between pages

import React from "react";
import { Routes, Route, NavLink, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import JavaScriptLab from "./pages/JavaScriptLab";
import DatabaseLab from "./pages/DatabaseLab";

function Navbar() {
  const location = useLocation();
  const isDarkLab =
    location.pathname === "/javascript-lab" ||
    location.pathname === "/database-lab";

  return (
    <nav
      className="navbar"
      style={isDarkLab ? { background: "#1e293b", borderColor: "#334155" } : {}}
    >
      <div className="navbar-inner">
        {/* Brand */}
        <NavLink to="/" className="navbar-brand">
          <div className="navbar-logo">⚡</div>
          <div>
            <span
              className="navbar-title"
              style={isDarkLab ? { color: "#f8fafc" } : {}}
            >
              TaskFlow
            </span>
            <span className="navbar-tagline">Learn JavaScript. Manage Tasks.</span>
          </div>
        </NavLink>

        {/* Navigation links */}
        <nav className="navbar-nav">
          <NavLink
            to="/"
            end
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            style={isDarkLab ? { color: "#94a3b8" } : {}}
          >
            📋 Tasks
          </NavLink>
          <NavLink
            to="/javascript-lab"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            style={
              location.pathname === "/javascript-lab"
                ? {
                    background: "rgba(129,140,248,0.15)",
                    color: "#818cf8",
                    borderColor: "#818cf8",
                  }
                : isDarkLab
                ? { color: "#94a3b8" }
                : {}
            }
          >
            🧪 JavaScript Lab
          </NavLink>
          <NavLink
            to="/database-lab"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            style={
              location.pathname === "/database-lab"
                ? {
                    background: "rgba(52,211,153,0.15)",
                    color: "#34d399",
                    borderColor: "#34d399",
                  }
                : isDarkLab
                ? { color: "#94a3b8" }
                : {}
            }
          >
            🗄️ Database Lab
          </NavLink>
        </nav>
      </div>
    </nav>
  );
}

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/javascript-lab" element={<JavaScriptLab />} />
        <Route path="/database-lab" element={<DatabaseLab />} />
      </Routes>
    </>
  );
}

export default App;
