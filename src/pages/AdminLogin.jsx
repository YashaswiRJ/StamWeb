import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GOOGLE_SCRIPT_URL } from "../config";
import bgImage from "../assets/home_background.jpg";

import "../styles/pages/admin-login.css";

/**
 * SECURITY MODEL:
 * - Username + SHA-256 password check (frontend)
 * - No plain-text password comparison
 * - No backend response reading (CORS-safe)
 * - Suitable for college admin panel
 */

// 🔐 ADMIN CREDENTIALS
const ADMIN_USERNAME = "stamatics";

// 🔐 SHA-256 HASH of the real password
// (Generated once using crypto.subtle)
const ADMIN_PASSWORD_HASH =
  "5a92444ec916ca40c3756ca510cdcab2991d35a8d243dad52f0bb52475c3a216";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // Clear any existing admin session on page load
  useEffect(() => {
    localStorage.removeItem("admin_token");
  }, []);

  // 🔐 SHA-256 hashing using Web Crypto API
  const sha256 = async (text) => {
    const encoded = new TextEncoder().encode(text);
    const hashBuffer = await crypto.subtle.digest("SHA-256", encoded);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    // Username check
    if (username.trim() !== ADMIN_USERNAME) {
      setError("Invalid username");
      return;
    }

    try {
      // Hash entered password
      const enteredHash = await sha256(password);

      // Password check (HASH vs HASH)
      if (enteredHash !== ADMIN_PASSWORD_HASH) {
        setError("Invalid password");
        return;
      }

      const scriptUrl =
        import.meta.env.VITE_GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL;

      // Optional backend ping (fire-and-forget)
      await fetch(scriptUrl, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "ping" }),
      });

      // Login success
      localStorage.setItem("admin_token", "LOGGED_IN");
      navigate("/admin/dashboard");

    } catch (err) {
      console.error(err);
      setError("Login failed. Please try again.");
    }
  };

  return (
    <div
      className="admin-login-page"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="admin-login-overlay" />

      <div className="admin-login-card">
        <h1 className="admin-login-title">Admin Portal</h1>
        <p className="admin-login-subtitle">Authorized Personnel Only</p>

        <form onSubmit={handleLogin} className="admin-login-form">

          {/* Username */}
          <div className="admin-login-input-group">
            <input
              type="text"
              className="admin-login-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              autoComplete="off"
            />
          </div>

          {/* Password */}
          <div className="admin-login-input-group">
            <div className="admin-login-password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                className="admin-login-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="admin-login-eye-button"
                aria-label="Toggle password visibility"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {error && <p className="admin-login-error">{error}</p>}

          <button type="submit" className="admin-login-button">
            Login to Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}
