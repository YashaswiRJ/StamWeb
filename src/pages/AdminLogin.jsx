import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GOOGLE_SCRIPT_URL } from "../config";
import bgImage from "../assets/home_background.jpg";

import "../styles/pages/admin-login.css"; // ← NEW

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // SECURITY FEATURE: 
  // When this page loads (even via Back button), WIPE the token immediately.
  // This ensures that "Forward" navigation will fail because the session is dead.
  useEffect(() => {
    localStorage.removeItem("admin_token");
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    // Server-Side Auth Logic
    try {
      // 1. Send password to Google Script
      const response = await fetch(`${import.meta.env.VITE_GOOGLE_SCRIPT_URL || "https://script.google.com/macros/s/AKfycbyv5Pfn8jL2_0aK5t4Ue-FqfRjM4A4qR4X1-7F4h_l_j8h4f5s/exec"}`, {
        method: "POST",
        mode: "no-cors", // NOTE: no-cors means we CANNOT read the response token directly in browser due to CORS. 
        // WAIT. If we use no-cors, we CANNOT get the token back. 
        // We MUST use CORS (mode: 'cors') or JSONP.
        // But GAS `doPost` CORS is tricky. It usually works if we follow redirects.
        // Standard React fetch to GAS `doPost` with `redirect: follow` usually allows reading JSON *if* the script returns correct headers.
        // BUT `no-cors` is strictly opaque.
        // The existing code uses `no-cors` for writes (fire and forget).
        // For LOGIN, we NEED to read the response.
        // We must use `method: "POST"` without `mode: "no-cors"`.
        // AND the Google Script must serve JSON with `Content-Type: application/json`.
      });

      // RE-EVALUATION: 
      // Handling CORS with GAS is painful. 
      // Alternative: Send a GET request for login? `action=login&password=...`
      // GET requests allow reading JSON easily with CORS if script returns it.
      // Passwords in URL logs are bad practice, but for GAS simplistic auth?
      // Better: Use `POST` with `redirect: "follow"` and hope the user's GAS deployment allows it.
      // Usually `ContentService.createTextOutput(JSON.stringify(...)).setMimeType(ContentService.MimeType.JSON)` handles CORS for GET.
      // For POST, it involves redirects.

      // LET'S TRY GET FOR LOGIN to avoid CORS blocked response issues.
      // `?action=login&password=...`
      // It's less secure (history logs), but robust for GAS connectivity.
      // Given the "Admin Password" is likely shared/simple, this trade-off is often accepted in GAS projects.
      // OR: We try standard POST. If it fails, we guide user.

      // Let's use POST. If 'no-cors' prevents reading token, we are stuck.
      // So we MUST NOT use 'no-cors'.

      const scriptUrl = "https://script.google.com/macros/s/AKfycbz_1H2_... (user's url usually)";
      // Actually we import GOOGLE_SCRIPT_URL.
    } catch (e) { }

    // ...
  };

  // RETHINKING: 
  // User asked for "Server-Side Strategy".
  // If `no-cors` prevents reading the token, we can't do modern auth easily.
  // WORKAROUND:
  // We will use the `doGet` endpoint for Login.
  // GET requests are much friendlier for CORS in GAS.
  // `fetch(URL + "?action=login&password=" + password)`
  // This allows us to `await response.json()` and get the token.

  // Implementation:
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("Verifying...");

    try {
      // Use GET for Login to bypass CORS issues with POST response reading
      const response = await fetch(`${import.meta.env.VITE_GOOGLE_SCRIPT_URL || "https://script.google.com/macros/s/AKfycbzS5-..."}?action=login&password=${encodeURIComponent(password)}`);
      const data = await response.json();

      if (data.success && data.token) {
        localStorage.setItem("admin_token", data.token);
        navigate("/admin/dashboard");
      } else {
        setError("Invalid Password (Server Rejected)");
      }
    } catch (err) {
      console.error(err);
      // Fallback for demo/offline: if password is the hardcoded one, we might allow? NO. User asked for Security.
      setError("Connection Failed or Script not deployed properly.");
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
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                )}
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
