import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GOOGLE_SCRIPT_URL } from "../config";

import "../styles/pages/blog-admin.css"; // Reusing BlogAdmin styles for consistency

const initialMember = {
    name: "",
    role: "Coordinator", // Default to Coordinator
    bio: "",
    image: "",
    linkedin: "",
    github: "",
};

export default function TeamAdmin() {
    const [memberData, setMemberData] = useState(initialMember);
    const [editingId, setEditingId] = useState(null);
    const [teamMembers, setTeamMembers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (!localStorage.getItem("admin_token")) navigate("/admin");
        fetchTeamMembers();
    }, [navigate]);

    const handleChange = (e) => {
        setMemberData({ ...memberData, [e.target.name]: e.target.value });
    };

    // --- 1. FETCH TEAM (with Cache) ---
    const fetchTeamMembers = async () => {
        // Load cache first
        const cached = localStorage.getItem("team_data_cache");
        if (cached) {
            try {
                const { data } = JSON.parse(cached);
                if (Array.isArray(data)) setTeamMembers(data);
            } catch (e) { }
        }

        if (!cached) setLoading(true); // Only show spinner if no cache

        try {
            const response = await fetch(`${GOOGLE_SCRIPT_URL}?action=get_team`);
            const data = await response.json();
            if (data.error) {
                alert("Backend Error: " + data.error);
                setTeamMembers([]);
            } else if (Array.isArray(data)) {
                setTeamMembers(data);
                // Update Cache
                localStorage.setItem("team_data_cache", JSON.stringify({
                    data,
                    timestamp: Date.now()
                }));
            }
        } catch (error) {
            console.error("Error loading team:", error);
        } finally {
            setLoading(false);
        }
    };

    // --- 2. START EDITING ---
    const handleEdit = (member) => {
        setMemberData(member);
        setEditingId(member.id);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // --- 3. CANCEL EDIT ---
    const handleCancelEdit = () => {
        setMemberData(initialMember);
        setEditingId(null);
    };

    // --- 4. SAVE (Optimistic) ---
    const handleSave = async () => {
        if (!memberData.name || !memberData.role) {
            alert("Name and Role are required.");
            return;
        }

        // 1. Prepare Data
        const action = editingId ? "edit_team_member" : "create_team_member";
        const id = editingId
            ? editingId
            : memberData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Date.now();

        const newMember = { ...memberData, id };
        // AUTH: Include Token
        const token = localStorage.getItem("admin_token");
        const payload = { action, id, token, ...memberData };

        // 2. OPTIMISTIC UPDATE: Update UI immediately
        let updatedList;
        if (editingId) {
            updatedList = teamMembers.map(m => m.id === id ? newMember : m);
        } else {
            updatedList = [...teamMembers, newMember];
        }

        setTeamMembers(updatedList);
        setMemberData(initialMember);
        setEditingId(null);

        // Update Cache immediately
        localStorage.setItem("team_data_cache", JSON.stringify({
            data: updatedList,
            timestamp: Date.now()
        }));

        // 3. Send to Backend (Background)
        // We don't await this for the UI update, but we catch errors to revert
        try {
            await fetch(GOOGLE_SCRIPT_URL, {
                method: "POST",
                mode: "no-cors",
                headers: { "Content-Type": "text/plain;charset=utf-8" },
                body: JSON.stringify(payload),
            });
            // Success (Silent)
        } catch (error) {
            console.error("Save failed:", error);
            alert("Saved locally, but failed to sync to server. Please check connection.");
            // Optional: Revert changes here if strict data consistency is needed
        }
    };

    // --- 5. DELETE (Optimistic) ---
    const handleDelete = async (id) => {
        if (!confirm("Delete this member?")) return;

        // Optimistic update
        const updatedList = teamMembers.filter((m) => m.id !== id);
        setTeamMembers(updatedList);

        // Update Cache
        localStorage.setItem("team_data_cache", JSON.stringify({
            data: updatedList,
            timestamp: Date.now()
        }));

        try {
            const token = localStorage.getItem("admin_token");
            await fetch(GOOGLE_SCRIPT_URL, {
                method: "POST",
                mode: "no-cors",
                headers: { "Content-Type": "text/plain;charset=utf-8" },
                body: JSON.stringify({ action: "delete_team_member", id, token }),
            });
        } catch (error) {
            alert("Failed to delete from server.");
            fetchTeamMembers(); // Revert
        }
    };

    return (
        <div style={styles.page}>
            <div style={styles.container}>
                {/* HEADER */}
                <div style={styles.header}>
                    <div>
                        <h1 style={styles.title}>{editingId ? "Edit Member" : "Manage Team"}</h1>
                        <p style={styles.subtitle}>Add or update team members</p>
                    </div>
                    <div style={styles.btnGroup}>
                        <button
                            onClick={editingId ? handleCancelEdit : () => navigate("/admin/dashboard")}
                            style={styles.secondaryBtn}
                        >
                            {editingId ? "Cancel" : "Exit"}
                        </button>
                        <button onClick={handleSave} style={styles.primaryBtn} disabled={saving}>
                            {saving ? "Saving..." : editingId ? "Update Member" : "Add Member"}
                        </button>
                    </div>
                </div>

                {/* EDITOR FORM */}
                <div style={styles.formGrid}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Name</label>
                        <input
                            name="name"
                            value={memberData.name}
                            onChange={handleChange}
                            style={styles.input}
                            placeholder="e.g. John Doe"
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Position</label>
                        <select
                            name="role"
                            value={memberData.role}
                            onChange={handleChange}
                            style={styles.select}
                        >
                            <option value="Coordinator">Coordinator</option>
                            <option value="Executive">Executive</option>
                        </select>
                    </div>

                    <div style={styles.inputGroupFull}>
                        <label style={styles.label}>Bio</label>
                        <textarea
                            name="bio"
                            value={memberData.bio}
                            onChange={handleChange}
                            style={styles.textarea}
                            placeholder="Short bio..."
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Image URL</label>
                        <input
                            name="image"
                            value={memberData.image}
                            onChange={(e) => {
                                let val = e.target.value;
                                // Auto-fix Google Drive links to be direct
                                if (val.includes("drive.google.com") && val.includes("/d/")) {
                                    const id = val.match(/\/d\/(.+?)\//)?.[1];
                                    if (id) val = `https://drive.google.com/uc?export=view&id=${id}`;
                                }
                                setMemberData({ ...memberData, image: val });
                            }}
                            style={styles.input}
                            placeholder="https://..."
                        />
                        <p style={{ fontSize: "0.8rem", color: "#64748b", marginTop: "4px" }}>
                            Paste a direct image link. Google Drive links are auto-converted.
                        </p>
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>LinkedIn URL</label>
                        <input
                            name="linkedin"
                            value={memberData.linkedin}
                            onChange={handleChange}
                            style={styles.input}
                            placeholder="https://linkedin.com/in/..."
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>GitHub URL</label>
                        <input
                            name="github"
                            value={memberData.github}
                            onChange={handleChange}
                            style={styles.input}
                            placeholder="https://github.com/..."
                        />
                    </div>
                </div>

                {/* LIST SECTION */}
                <div style={styles.manageSection}>
                    <h2 style={styles.manageTitle}>Current Team Members</h2>
                    {loading ? (
                        <p style={{ color: "#64748b" }}>Loading...</p>
                    ) : (
                        <div style={styles.listGrid}>
                            {teamMembers.length === 0 && (
                                <p style={{ color: "#64748b" }}>No members found.</p>
                            )}
                            {teamMembers.map((m) => (
                                <div key={m.id || Math.random()} style={styles.listItem}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1 }}>
                                        {m.image && m.image !== "#" ? (
                                            <img src={m.image} alt={m.name} style={styles.avatar} />
                                        ) : (
                                            <div style={styles.avatarPlaceholder}>{m.name?.[0]}</div>
                                        )}
                                        <div>
                                            <div style={styles.itemTitle}>{m.name}</div>
                                            <div style={styles.itemMeta}>{m.role}</div>
                                        </div>
                                    </div>
                                    <div style={{ display: "flex", gap: "10px" }}>
                                        <button onClick={() => handleEdit(m)} style={styles.editBtn}>
                                            Edit
                                        </button>
                                        <button onClick={() => handleDelete(m.id)} style={styles.deleteBtn}>
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

const styles = {
    page: {
        minHeight: "100vh",
        background: "#020617",
        paddingTop: "100px",
        paddingBottom: "80px",
        color: "white",
    },
    container: { maxWidth: "1000px", margin: "0 auto", padding: "0 24px" },
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "30px",
    },
    title: { fontSize: "2rem", fontWeight: "700" },
    subtitle: { color: "#94a3b8", fontSize: "0.9rem" },
    btnGroup: { display: "flex", gap: "12px" },
    secondaryBtn: {
        background: "none",
        border: "1px solid #334155",
        color: "#cbd5e1",
        padding: "10px 20px",
        borderRadius: "8px",
        cursor: "pointer",
    },
    primaryBtn: {
        background: "#7b4bff",
        border: "none",
        color: "white",
        padding: "10px 24px",
        borderRadius: "8px",
        fontWeight: "600",
        cursor: "pointer",
    },
    primaryBtnDisabled: {
        background: "#4b3b7f",
        color: "#ccc",
    },

    formGrid: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "20px",
        background: "#1e293b",
        padding: "24px",
        borderRadius: "12px",
        border: "1px solid #334155",
        marginBottom: "40px",
    },
    inputGroup: { display: "flex", flexDirection: "column", gap: "8px" },
    inputGroupFull: { gridColumn: "1 / -1", display: "flex", flexDirection: "column", gap: "8px" },
    label: { fontSize: "0.9rem", color: "#94a3b8", fontWeight: "600" },
    input: {
        background: "#0f172a",
        border: "1px solid #334155",
        padding: "12px",
        borderRadius: "8px",
        color: "white",
        fontSize: "1rem",
    },
    select: {
        background: "#0f172a",
        border: "1px solid #334155",
        padding: "12px",
        borderRadius: "8px",
        color: "white",
        fontSize: "1rem",
        cursor: "pointer",
    },
    textarea: {
        background: "#0f172a",
        border: "1px solid #334155",
        padding: "12px",
        borderRadius: "8px",
        color: "white",
        fontSize: "1rem",
        resize: "vertical",
        minHeight: "80px",
    },

    manageSection: { borderTop: "1px solid #334155", paddingTop: "40px" },
    manageTitle: { fontSize: "1.5rem", fontWeight: "700", marginBottom: "20px" },
    listGrid: {
        display: "grid",
        gridTemplateColumns: "1fr",
        gap: "12px",
    },
    listItem: {
        background: "#1e293b",
        padding: "12px 16px",
        borderRadius: "8px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        border: "1px solid #334155",
    },
    avatar: { width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover" },
    avatarPlaceholder: {
        width: "40px",
        height: "40px",
        borderRadius: "50%",
        background: "#334155",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "bold",
        color: "#fff",
    },
    itemTitle: { fontWeight: "600", fontSize: "1rem" },
    itemMeta: { fontSize: "0.85rem", color: "#94a3b8" },

    editBtn: {
        background: "rgba(59, 130, 246, 0.1)",
        color: "#60a5fa",
        border: "1px solid rgba(59, 130, 246, 0.2)",
        padding: "6px 12px",
        borderRadius: "6px",
        cursor: "pointer",
        fontSize: "0.85rem",
        fontWeight: "600",
    },
    deleteBtn: {
        background: "rgba(239, 68, 68, 0.1)",
        color: "#ef4444",
        border: "1px solid rgba(239, 68, 68, 0.2)",
        padding: "6px 12px",
        borderRadius: "6px",
        cursor: "pointer",
        fontSize: "0.85rem",
        fontWeight: "600",
    },
};
