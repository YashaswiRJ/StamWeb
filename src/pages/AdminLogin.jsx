import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import bgImage from "../assets/home_background.jpg";

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

  const handleLogin = (e) => {
    e.preventDefault();
    
    if (username === "stamatics" && password === "stamatics2025") {
      // Create the session
      localStorage.setItem("admin_token", "valid-token");
      
      // Standard navigation (Pushes to history, so Back button works)
      navigate("/admin/dashboard");
    } else {
      setError("Invalid Username or Password");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.overlay} />
      
      <div style={styles.card}>
        <h1 style={styles.title}>Admin Portal</h1>
        
        <p style={styles.subtitle}>Authorized Personnel Only</p>
        
        <form onSubmit={handleLogin} style={styles.form}>
          
          <div style={styles.inputGroup}>
            <input
              type="text"
              style={styles.input}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              autoComplete="off"
            />
          </div>

          <div style={styles.inputGroup}>
            <div style={styles.passwordWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                style={styles.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
              />
              
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={styles.eyeButton}
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
          
          {error && <p style={styles.error}>{error}</p>}

          <button type="submit" style={styles.button}>
            Login to Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    width: "100%",
    backgroundImage: `url(${bgImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  overlay: {
    position: "absolute",
    inset: 0,
    background: "rgba(0, 0, 0, 0.7)",
    zIndex: 1,
  },
  card: {
    position: "relative",
    zIndex: 10,
    width: "100%",
    maxWidth: "400px",
    background: "rgba(15, 23, 42, 0.6)", 
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "16px",
    padding: "40px",
    textAlign: "center",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
  },
  title: {
    color: "#fff",
    fontSize: "2rem",
    fontWeight: "700",
    marginBottom: "4px",
  },
  subtitle: {
    color: "#ef4444", 
    fontSize: "0.9rem",
    marginBottom: "32px",
    textTransform: "uppercase",
    letterSpacing: "1px",
    fontWeight: "600",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    textAlign: "left",
  },
  passwordWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  input: {
    width: "100%",
    background: "rgba(0, 0, 0, 0.3)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    color: "#fff",
    padding: "14px",
    borderRadius: "8px",
    fontSize: "1rem",
    outline: "none",
    textAlign: "left",
    transition: "border-color 0.2s",
  },
  eyeButton: {
    position: "absolute",
    right: "12px",
    background: "transparent",
    border: "none",
    color: "#94a3b8",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    background: "#7b4bff",
    color: "#fff",
    border: "none",
    padding: "14px",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "10px",
    transition: "transform 0.1s, background 0.2s",
  },
  error: {
    color: "#ef4444",
    fontSize: "0.9rem",
    margin: "0",
  },
};
