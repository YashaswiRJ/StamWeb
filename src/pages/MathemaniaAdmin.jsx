import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GOOGLE_SCRIPT_URL } from "../config";

import "../styles/pages/mathemania-admin.css"; // ← NEW

export default function MathemaniaAdmin() {
  const navigate = useNavigate();
  
  // Data States
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);

  // Announcement State
  const [announcement, setAnnouncement] = useState("");

  useEffect(() => {
    if (!localStorage.getItem("admin_token")) navigate("/admin");
    else fetchRegistrations();
  }, [navigate]);

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${GOOGLE_SCRIPT_URL}?action=get_registrations`);
      const data = await response.json();
      setRegistrations(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!announcement) return alert("Please enter text.");
    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        body: JSON.stringify({ action: "update_announcement", text: announcement }),
      });
      alert("Announcement updated!");
      setAnnouncement("");
    } catch (error) {
      alert("Failed to update announcement.");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Mathemania Admin</h1>
          <button onClick={() => navigate("/admin/dashboard")} style={styles.backBtn}>← Dashboard</button>
        </div>

        {/* CONTROLS SECTION */}
        <div style={styles.controlsGrid}>
          {/* ANNOUNCEMENT CARD (Now Full Width) */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Announcements</h3>
            <p style={styles.cardDesc}>Update the event page marquee</p>
            <textarea 
              value={announcement}
              onChange={(e) => setAnnouncement(e.target.value)}
              placeholder="Type update here..." 
              style={styles.textArea} 
            />
            <button onClick={handlePublish} style={styles.actionBtn}>Publish Update</button>
          </div>
        </div>

        {/* REGISTRATIONS TABLE */}
        <div style={styles.tableCard}>
          <div style={styles.tableHeader}>
            <h3 style={styles.cardTitle}>Registrations</h3>
            <button onClick={fetchRegistrations} style={styles.refreshBtn}>
              {loading ? "Loading..." : "↻ Refresh Data"}
            </button>
          </div>
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr className="mathemania-admin-th-row">
                  <th className="mathemania-admin-th">Team Name</th>
                  <th className="mathemania-admin-th">Leader</th>
                  <th className="mathemania-admin-th">Email</th>
                  <th className="mathemania-admin-th">Institute</th>
                  <th className="mathemania-admin-th">Status</th>
                </tr>
              </thead>
              <tbody>
                {registrations.length === 0 ? (
                  <tr><td colSpan="5" style={styles.tdCenter}>No data found.</td></tr>
                ) : (
                  registrations.map((row, idx) => (
                    <tr key={idx} style={idx % 2 === 0 ? styles.trEven : styles.trOdd}>
                      <td style={styles.tdBold}>{row.team}</td>
                      <td style={styles.td}>{row.leader}</td>
                      <td style={styles.td}>{row.email}</td>
                      <td style={styles.td}>{row.inst}</td>
                      <td style={styles.td}><span style={styles.badgeGreen}>{row.status}</span></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", background: "#020617", paddingTop: "100px", paddingBottom: "50px", color: "white" },
  container: { maxWidth: "1100px", margin: "0 auto", padding: "0 24px" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" },
  title: { fontSize: "2rem", fontWeight: "700" },
  backBtn: { background: "none", border: "1px solid #334155", color: "#94a3b8", padding: "8px 16px", borderRadius: "8px", cursor: "pointer" },
  
  // Changed grid to single column since we removed one card
  controlsGrid: { display: "grid", gridTemplateColumns: "1fr", gap: "24px", marginBottom: "30px", maxWidth: "600px" },
  
  card: { background: "rgba(30, 41, 59, 0.4)", border: "1px solid #334155", borderRadius: "12px", padding: "24px" },
  cardTitle: { fontSize: "1.2rem", fontWeight: "600", marginBottom: "8px" },
  cardDesc: { color: "#94a3b8", fontSize: "0.9rem", marginBottom: "16px" },
  textArea: { width: "100%", background: "#0f172a", border: "1px solid #334155", borderRadius: "8px", padding: "12px", color: "white", minHeight: "80px", marginBottom: "12px" },
  actionBtn: { background: "#7b4bff", color: "white", border: "none", padding: "10px 20px", borderRadius: "6px", fontWeight: "600", cursor: "pointer" },
  
  tableCard: { background: "rgba(30, 41, 59, 0.4)", border: "1px solid #334155", borderRadius: "12px", overflow: "hidden" },
  tableHeader: { padding: "20px", borderBottom: "1px solid #334155", display: "flex", justifyContent: "space-between" },
  refreshBtn: { background: "none", color: "#7b4bff", border: "none", cursor: "pointer", fontWeight: "600" },
  tableWrapper: { overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse", fontSize: "0.95rem" },
  thRow: { background: "#0f172a", textAlign: "left" },
  th: { padding: "16px", color: "#94a3b8", fontWeight: "600", textTransform: "uppercase", fontSize: "0.8rem" },
  trEven: { background: "rgba(30, 41, 59, 0.3)" },
  trOdd: { background: "transparent" },
  td: { padding: "16px", color: "#cbd5e1", borderBottom: "1px solid #1e293b" },
  tdBold: { padding: "16px", color: "white", fontWeight: "600", borderBottom: "1px solid #1e293b" },
  tdCenter: { padding: "30px", textAlign: "center", color: "#94a3b8" },
  badgeGreen: { background: "rgba(34, 197, 94, 0.2)", color: "#4ade80", padding: "4px 8px", borderRadius: "4px", fontSize: "0.8rem", fontWeight: "600" },
};
