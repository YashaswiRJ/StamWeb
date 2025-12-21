import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import { useNavigate } from "react-router-dom";
import { GOOGLE_SCRIPT_URL } from "../config";

import "../styles/pages/blog-admin.css";
import { cleanMarkdown } from "../utils/cleanMarkdown";

const initialBlog = { title: "", author: "", thumbnail: "", content: "" };

export default function BlogAdmin() {
  const [blogData, setBlogData] = useState(initialBlog);
  const [editingId, setEditingId] = useState(null); // ID of blog being edited
  const [importing, setImporting] = useState(false);

  // List State
  const [existingBlogs, setExistingBlogs] = useState([]);
  const [loadingList, setLoadingList] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("admin_token")) navigate("/admin");
    fetchExistingBlogs();
  }, [navigate]);

  const handleChange = (e) => setBlogData({ ...blogData, [e.target.name]: e.target.value });

  // --- 1. FETCH LIST ---
  const fetchExistingBlogs = async () => {
    setLoadingList(true);
    try {
      const response = await fetch(`${GOOGLE_SCRIPT_URL}?action=get_blogs`);
      const data = await response.json();
      if (data.error) {
        alert("Backend Error: " + data.error);
        setExistingBlogs([]);
      } else {
        setExistingBlogs(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Error loading list:", error);
    } finally {
      setLoadingList(false);
    }
  };

  // --- 2. START EDITING ---
  const handleEdit = (blog) => {
    setBlogData({ title: blog.title, author: blog.author, thumbnail: blog.thumbnail || "", content: blog.content });
    setEditingId(blog.id);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to editor
  };

  // --- 3. CANCEL EDIT ---
  const handleCancelEdit = () => {
    setBlogData(initialBlog);
    setEditingId(null);
  };

  // --- 4. SAVE / UPDATE ---
  const handleSave = async () => {
    if (!blogData.title || !blogData.content) {
      alert("Please enter a Title and Content.");
      return;
    }

    // Decide Action: CREATE or EDIT
    const action = editingId ? "edit_blog" : "create_blog";

    // If Creating: Generate new ID. If Editing: Use existing ID.
    const id = editingId ? editingId : blogData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Date.now();

    const payload = {
      action: action,
      id: id,
      token: localStorage.getItem("admin_token"),
      title: blogData.title,
      author: blogData.author,
      thumbnail: blogData.thumbnail,
      content: blogData.content
    };

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload),
      });

      alert(editingId ? "Blog updated successfully!" : "Blog published successfully!");
      setBlogData(initialBlog);
      setEditingId(null); // Exit edit mode
      fetchExistingBlogs(); // Refresh list to show changes
    } catch (error) {
      alert("Failed to save.");
    }
  };

  // --- 5. DELETE ---
  const handleDelete = async (id) => {
    if (!confirm("Delete this post? This cannot be undone.")) return;
    try {
      setExistingBlogs(existingBlogs.filter(b => b.id !== id)); // Optimistic UI update
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({ action: "delete_blog", id: id, token: localStorage.getItem("admin_token") }),
      });
    } catch (error) {
      alert("Failed to delete.");
      fetchExistingBlogs();
    }
  };

  // --- 6. IMPORT MEDIUM ---
  const handleImportMedium = async () => {
    if (!confirm("Import latest stories from Medium?")) return;
    setImporting(true);
    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({ action: "import_medium", token: localStorage.getItem("admin_token") }),
      });
      alert("Request sent! Refreshing list...");
      setTimeout(fetchExistingBlogs, 5000);
    } catch (error) {
      alert("Import failed.");
    } finally {
      setImporting(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>{editingId ? "Edit Post" : "Blog Editor"}</h1>
            <p style={styles.subtitle}>Markdown + LaTeX Supported</p>
          </div>
          <div style={styles.btnGroup}>
            {!editingId && (
              <button onClick={handleImportMedium} disabled={importing} style={{ ...styles.secondaryBtn, color: "#a78bfa", borderColor: "#a78bfa" }}>
                {importing ? "Importing..." : "📥 Import Medium"}
              </button>
            )}

            {editingId ? (
              <button onClick={handleCancelEdit} style={styles.secondaryBtn}>Cancel Edit</button>
            ) : (
              <button onClick={() => navigate("/admin/dashboard")} style={styles.secondaryBtn}>Exit</button>
            )}

            <button onClick={handleSave} style={styles.primaryBtn}>
              {editingId ? "Update Post" : "Publish"}
            </button>
          </div>
        </div>

        {/* EDITOR */}
        <div style={styles.editorGrid}>
          <div style={styles.inputCol}>
            <input name="title" placeholder="Post Title" value={blogData.title} onChange={handleChange} style={styles.titleInput} />
            <div style={{ display: "flex", gap: "10px" }}>
              <input name="author" placeholder="Author Name" value={blogData.author} onChange={handleChange} style={{ ...styles.metaInput, flex: 1 }} />
              <input name="thumbnail" placeholder="Thumbnail URL (Optional)" value={blogData.thumbnail} onChange={handleChange} style={{ ...styles.metaInput, flex: 1 }} />
            </div>
            <textarea
              name="content"
              placeholder="Write your blog post here... (Markdown & LaTeX supported)"
              value={blogData.content}
              onChange={handleChange}
              style={styles.contentInput}
            />
          </div>

          <div style={styles.previewCol}>
            <div style={styles.previewHeader}>Preview</div>
            <div style={styles.previewScroll}>
              <h1 style={styles.prevTitle}>{blogData.title || "Untitled"}</h1>
              <p style={styles.prevMeta}>{blogData.author || "Author"} • {new Date().toLocaleDateString()}</p>
              {/* Thumbnail Preview */}
              {blogData.thumbnail || (blogData.content && blogData.content.match(/!\[.*?\]\((.*?)(?:\s+".*?")?\)/)) ? (
                <img
                  src={blogData.thumbnail || (blogData.content.match(/!\[.*?\]\((.*?)(?:\s+".*?")?\)/) ? blogData.content.match(/!\[.*?\]\((.*?)(?:\s+".*?")?\)/)[1] : "")}
                  alt="Thumbnail Preview"
                  style={{ width: "100%", height: "200px", objectFit: "contain", backgroundColor: "#020617", marginBottom: "20px", borderRadius: "8px", border: "1px solid #334155" }}
                  onError={(e) => e.target.style.display = 'none'}
                />
              ) : (
                <div style={{ width: "100%", height: "100px", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#1e293b", marginBottom: "20px", borderRadius: "8px", border: "1px dashed #334155", color: "#64748b", fontSize: "0.9rem" }}>
                  No Thumbnail Preview
                </div>
              )}

              <div className="markdown-body" style={styles.markdownBody}>
                <ReactMarkdown
                  children={cleanMarkdown(blogData.content)}
                  remarkPlugins={[remarkMath]}
                  rehypePlugins={[rehypeKatex]}
                  components={{ img: ({ node, ...props }) => <img {...props} style={{ maxWidth: "100%", borderRadius: "8px", margin: "15px 0" }} /> }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* MANAGE SECTION */}
        <div style={styles.manageSection}>
          <h2 style={styles.manageTitle}>Manage Existing Blogs</h2>
          {loadingList ? <p style={{ color: "#64748b" }}>Loading list...</p> : (
            <div style={styles.listGrid}>
              {existingBlogs.length === 0 && <p style={{ color: "#64748b" }}>No blogs found.</p>}
              {existingBlogs.map((blog) => (
                <div key={blog.id} style={styles.listItem}>
                  <div style={{ flex: 1 }}>
                    <div style={styles.itemTitle}>{blog.title}</div>
                    <div style={styles.itemMeta}>{blog.author} • {blog.date ? new Date(blog.date).toLocaleDateString() : ""}</div>
                  </div>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button onClick={() => handleEdit(blog)} style={styles.editBtn}>Edit</button>
                    <button onClick={() => handleDelete(blog.id)} style={styles.deleteBtn}>Delete</button>
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

// Local cleanContent helper removed (centralized in utils/cleanMarkdown.js)

const styles = {
  page: { minHeight: "100vh", background: "#020617", paddingTop: "100px", paddingBottom: "80px", color: "white" },
  container: { maxWidth: "1400px", margin: "0 auto", padding: "0 24px" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" },
  title: { fontSize: "2rem", fontWeight: "700" },
  subtitle: { color: "#94a3b8", fontSize: "0.9rem" },
  btnGroup: { display: "flex", gap: "12px" },
  secondaryBtn: { background: "none", border: "1px solid #334155", color: "#cbd5e1", padding: "10px 20px", borderRadius: "8px", cursor: "pointer" },
  primaryBtn: { background: "#7b4bff", border: "none", color: "white", padding: "10px 24px", borderRadius: "8px", fontWeight: "600", cursor: "pointer" },

  editorGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", height: "60vh", marginBottom: "60px" },
  inputCol: { display: "flex", flexDirection: "column", gap: "16px" },
  titleInput: { background: "#1e293b", border: "1px solid #334155", padding: "16px", borderRadius: "8px", fontSize: "1.2rem", color: "white", fontWeight: "600" },
  metaInput: { background: "#1e293b", border: "1px solid #334155", padding: "14px", borderRadius: "8px", fontSize: "1rem", color: "white" },
  contentInput: { flex: 1, background: "#1e293b", border: "1px solid #334155", padding: "16px", borderRadius: "8px", fontSize: "1rem", color: "#e2e8f0", fontFamily: "monospace", resize: "none", lineHeight: "1.5" },

  previewCol: { background: "#0f172a", border: "1px solid #334155", borderRadius: "12px", display: "flex", flexDirection: "column", overflow: "hidden" },
  previewHeader: { background: "#1e293b", padding: "10px 20px", fontSize: "0.8rem", fontWeight: "600", textTransform: "uppercase", color: "#94a3b8", borderBottom: "1px solid #334155" },
  previewScroll: { padding: "30px", overflowY: "auto", flex: 1 },
  prevTitle: { fontSize: "2rem", marginBottom: "8px", lineHeight: "1.2" },
  prevMeta: { color: "#64748b", fontSize: "0.9rem", marginBottom: "24px" },
  markdownBody: { lineHeight: "1.7", color: "#cbd5e1", fontSize: "1.05rem" },

  manageSection: { borderTop: "1px solid #334155", paddingTop: "40px" },
  manageTitle: { fontSize: "1.5rem", fontWeight: "700", marginBottom: "20px" },
  listGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))", gap: "16px" },
  listItem: { background: "#1e293b", padding: "16px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "space-between", border: "1px solid #334155" },
  itemTitle: { fontWeight: "600", fontSize: "1rem", marginBottom: "4px" },
  itemMeta: { fontSize: "0.85rem", color: "#94a3b8" },

  // Button Styles
  editBtn: { background: "rgba(59, 130, 246, 0.1)", color: "#60a5fa", border: "1px solid rgba(59, 130, 246, 0.2)", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "0.85rem", fontWeight: "600", transition: "0.2s" },
  deleteBtn: { background: "rgba(239, 68, 68, 0.1)", color: "#ef4444", border: "1px solid rgba(239, 68, 68, 0.2)", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "0.85rem", fontWeight: "600", transition: "0.2s" }
};
