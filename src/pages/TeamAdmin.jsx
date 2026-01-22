import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
    collection, 
    getDocs, 
    addDoc, 
    updateDoc, 
    deleteDoc, 
    doc, 
    query, 
    orderBy 
} from "firebase/firestore";
import { db } from "../firebase"; // Your Firestore instance

import "../styles/pages/blog-admin.css";

const initialMember = {
    name: "",
    role: "Coordinator",
    bio: "",
    image: "",
    linkedin: "",
    github: "",
    priority: 2, // Added priority for sorting
};

export default function TeamAdmin() {
    const [memberData, setMemberData] = useState(initialMember);
    const [editingId, setEditingId] = useState(null);
    const [teamMembers, setTeamMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        // Simple auth check
        if (!localStorage.getItem("admin_token")) navigate("/admin");
        fetchTeamMembers();
    }, [navigate]);

    const handleChange = (e) => {
        setMemberData({ ...memberData, [e.target.name]: e.target.value });
    };

    // --- 1. FETCH FROM FIRESTORE ---
    const fetchTeamMembers = async () => {
        setLoading(true);
        try {
            const q = query(collection(db, "team_members"), orderBy("priority", "asc"));
            const querySnapshot = await getDocs(q);
            const members = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setTeamMembers(members);
        } catch (error) {
            console.error("Error fetching team:", error);
            alert("Failed to load team members from Firestore.");
        } finally {
            setLoading(false);
        }
    };

    // --- 2. SAVE/UPDATE TO FIRESTORE ---
    const handleSave = async () => {
        if (!memberData.name || !memberData.role) {
            alert("Name and Role are required.");
            return;
        }

        setSaving(true);
        try {
            if (editingId) {
                // Update existing document
                const memberRef = doc(db, "team_members", editingId);
                await updateDoc(memberRef, memberData);
            } else {
                // Add new document
                await addDoc(collection(db, "team_members"), memberData);
            }

            alert("Saved successfully!");
            setMemberData(initialMember);
            setEditingId(null);
            fetchTeamMembers(); // Refresh list
        } catch (error) {
            console.error("Error saving member:", error);
            alert("Error saving to Firestore. Check your Rules.");
        } finally {
            setSaving(false);
        }
    };

    // --- 3. DELETE FROM FIRESTORE ---
    const handleDelete = async (id) => {
        if (!confirm("Delete this member permanently?")) return;

        try {
            await deleteDoc(doc(db, "team_members", id));
            setTeamMembers(teamMembers.filter(m => m.id !== id));
        } catch (error) {
            console.error("Error deleting:", error);
            alert("Delete failed.");
        }
    };

    const handleEdit = (member) => {
        setMemberData(member);
        setEditingId(member.id);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleCancelEdit = () => {
        setMemberData(initialMember);
        setEditingId(null);
    };

    return (
        <div style={styles.page}>
            <div style={styles.container}>
                <div style={styles.header}>
                    <div>
                        <h1 style={styles.title}>{editingId ? "Edit Member" : "Manage Team"}</h1>
                        <p style={styles.subtitle}>Firestore Database Mode</p>
                    </div>
                    <div style={styles.btnGroup}>
                        <button onClick={editingId ? handleCancelEdit : () => navigate("/admin/dashboard")} style={styles.secondaryBtn}>
                            {editingId ? "Cancel" : "Exit"}
                        </button>
                        <button onClick={handleSave} style={styles.primaryBtn} disabled={saving}>
                            {saving ? "Saving..." : editingId ? "Update Member" : "Add Member"}
                        </button>
                    </div>
                </div>

                {/* FORM SECTION */}
                <div style={styles.formGrid}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Name</label>
                        <input name="name" value={memberData.name} onChange={handleChange} style={styles.input} />
                    </div>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Position</label>
                        <select name="role" value={memberData.role} onChange={handleChange} style={styles.select}>
                            <option value="Coordinator">Coordinator</option>
                            <option value="Executive">Executive</option>
                        </select>
                    </div>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Priority (Lower = First)</label>
                        <input type="number" name="priority" value={memberData.priority} onChange={handleChange} style={styles.input} />
                    </div>
                    <div style={styles.inputGroupFull}>
                        <label style={styles.label}>Bio</label>
                        <textarea name="bio" value={memberData.bio} onChange={handleChange} style={styles.textarea} />
                    </div>
                    <div style={styles.inputGroupFull}>
                        <label style={styles.label}>Image URL (Cloudinary Recommended)</label>
                        <input name="image" value={memberData.image} onChange={handleChange} style={styles.input} />
                    </div>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>LinkedIn</label>
                        <input name="linkedin" value={memberData.linkedin} onChange={handleChange} style={styles.input} />
                    </div>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>GitHub</label>
                        <input name="github" value={memberData.github} onChange={handleChange} style={styles.input} />
                    </div>
                </div>

                {/* LIST SECTION */}
                <div style={styles.manageSection}>
                    <h2 style={styles.manageTitle}>Current Team Members</h2>
                    {loading ? <p>Loading from Firestore...</p> : (
                        <div style={styles.listGrid}>
                            {teamMembers.map((m) => (
                                <div key={m.id} style={styles.listItem}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                        <div style={styles.avatarPlaceholder}>{m.name?.[0]}</div>
                                        <div>
                                            <div style={styles.itemTitle}>{m.name}</div>
                                            <div style={styles.itemMeta}>{m.role} (Priority: {m.priority})</div>
                                        </div>
                                    </div>
                                    <div style={{ display: "flex", gap: "10px" }}>
                                        <button onClick={() => handleEdit(m)} style={styles.editBtn}>Edit</button>
                                        <button onClick={() => handleDelete(m.id)} style={styles.deleteBtn}>Delete</button>
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

// Reusing your existing styles object...
const styles = {
    page: { minHeight: "100vh", background: "#020617", paddingTop: "100px", paddingBottom: "80px", color: "white" },
    container: { maxWidth: "1000px", margin: "0 auto", padding: "0 24px" },
    header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" },
    title: { fontSize: "2rem", fontWeight: "700" },
    subtitle: { color: "#94a3b8", fontSize: "0.9rem" },
    btnGroup: { display: "flex", gap: "12px" },
    secondaryBtn: { background: "none", border: "1px solid #334155", color: "#cbd5e1", padding: "10px 20px", borderRadius: "8px", cursor: "pointer" },
    primaryBtn: { background: "#7b4bff", border: "none", color: "white", padding: "10px 24px", borderRadius: "8px", fontWeight: "600", cursor: "pointer" },
    formGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", background: "#1e293b", padding: "24px", borderRadius: "12px", border: "1px solid #334155", marginBottom: "40px" },
    inputGroup: { display: "flex", flexDirection: "column", gap: "8px" },
    inputGroupFull: { gridColumn: "1 / -1", display: "flex", flexDirection: "column", gap: "8px" },
    label: { fontSize: "0.9rem", color: "#94a3b8", fontWeight: "600" },
    input: { background: "#0f172a", border: "1px solid #334155", padding: "12px", borderRadius: "8px", color: "white", fontSize: "1rem" },
    select: { background: "#0f172a", border: "1px solid #334155", padding: "12px", borderRadius: "8px", color: "white", fontSize: "1rem", cursor: "pointer" },
    textarea: { background: "#0f172a", border: "1px solid #334155", padding: "12px", borderRadius: "8px", color: "white", fontSize: "1rem", resize: "vertical", minHeight: "80px" },
    manageSection: { borderTop: "1px solid #334155", paddingTop: "40px" },
    manageTitle: { fontSize: "1.5rem", fontWeight: "700", marginBottom: "20px" },
    listGrid: { display: "grid", gridTemplateColumns: "1fr", gap: "12px" },
    listItem: { background: "#1e293b", padding: "12px 16px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "space-between", border: "1px solid #334155" },
    avatarPlaceholder: { width: "40px", height: "40px", borderRadius: "50%", background: "#334155", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", color: "#fff" },
    itemTitle: { fontWeight: "600", fontSize: "1rem" },
    itemMeta: { fontSize: "0.85rem", color: "#94a3b8" },
    editBtn: { background: "rgba(59, 130, 246, 0.1)", color: "#60a5fa", border: "1px solid rgba(59, 130, 246, 0.2)", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "0.85rem", fontWeight: "600" },
    deleteBtn: { background: "rgba(239, 68, 68, 0.1)", color: "#ef4444", border: "1px solid rgba(239, 68, 68, 0.2)", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "0.85rem", fontWeight: "600" },
};