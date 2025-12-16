// src/pages/AdminDashboard.jsx
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import "../styles/pages/admin-dashboard.css"; // ← NEW (CSS import)

export default function AdminDashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    // Basic security check: Redirect to login if no token is found
    if (!localStorage.getItem("admin_token")) navigate("/admin");
  }, [navigate]);

  return (
    <div className="admin-dashboard-page">
      <div className="admin-dashboard-container">
        {/* Header */}
        <div className="admin-dashboard-header">
          <h1 className="admin-dashboard-title">Dashboard</h1>
        </div>

        {/* Cards Grid */}
        <div className="admin-dashboard-grid">

          {/* Card 1: Mathemania */}
          <Link to="/admin/mathemania" className="admin-dashboard-card">
            <div className="admin-dashboard-card-icon">🏆</div>
            <h2 className="admin-dashboard-card-title">Mathemania</h2>
            <p className="admin-dashboard-card-desc">
              Manage registrations, view team details, and upload event PDFs.
            </p>
            <span className="admin-dashboard-link-text">Manage Event →</span>
          </Link>

          {/* Card 2: Blog Editor */}
          <Link to="/admin/blogs" className="admin-dashboard-card">
            <div className="admin-dashboard-card-icon">✍️</div>
            <h2 className="admin-dashboard-card-title">Blog Editor</h2>
            <p className="admin-dashboard-card-desc">
              Write and publish new articles using Markdown and LaTeX support.
            </p>
            <span className="admin-dashboard-link-text">Open Editor →</span>
          </Link>

          {/* Card 3: Team Management */}
          <Link to="/admin/team" className="admin-dashboard-card">
            <div className="admin-dashboard-card-icon">👥</div>
            <h2 className="admin-dashboard-card-title">Team</h2>
            <p className="admin-dashboard-card-desc">
              Add or remove team members and update their details.
            </p>
            <span className="admin-dashboard-link-text">Manage Team →</span>
          </Link>

        </div>
      </div>
    </div>
  );
}
