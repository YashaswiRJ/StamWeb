import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { BlogContext } from "../context/BlogContext";

function Blogs() {
  const { blogs, loading } = useContext(BlogContext);

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>All Blogs</h1>
      <p style={styles.subHeader}>
        Explore our latest thoughts on Mathematics, Statistics, and logic.
      </p>

      {/* SKELETON LOADER (Only shows on very first visit) */}
      {loading && blogs.length === 0 ? (
        <div style={styles.grid}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} style={styles.skeletonCard}>
              <div style={styles.skeletonImage}></div>
              <div style={styles.skeletonText}></div>
              <div style={styles.skeletonTextShort}></div>
            </div>
          ))}
        </div>
      ) : (
        /* REAL CONTENT */
        <div style={styles.grid}>
          {blogs.length === 0 ? (
            <p style={{ color: "#888", gridColumn: "1 / -1", textAlign: "center" }}>
              No blogs found.
            </p>
          ) : (
            blogs.map((blog) => {
              const thumbnail = getThumbnail(blog);
              return (
                <article key={blog.id} style={styles.card}>
                  <div style={styles.thumbnailWrapper}>
                    {thumbnail ? (
                      <img src={thumbnail} alt={blog.title} style={styles.thumbnailImage} onError={(e) => e.target.style.display = 'none'} />
                    ) : (
                      <div style={styles.thumbnailPlaceholder}></div>
                    )}
                  </div>
                  <div style={styles.cardContent}>
                    <h2 style={styles.cardTitle}>
                      {blog.title.length > 100 ? blog.title.substring(0, 100) + "..." : blog.title}
                    </h2>
                    <p style={styles.meta}>
                      {blog.author} • {blog.date ? new Date(blog.date).toLocaleDateString() : "Recent"}
                    </p>
                    <Link to={`/blogs/${blog.id}`} style={styles.link}>
                      Read Blog →
                    </Link>
                  </div>
                </article>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

// Helper to extract thumbnail
const getThumbnail = (blog) => {
  if (blog.thumbnail) return blog.thumbnail;
  // Regex to find first markdown image: ![alt](url "title") or ![alt](url)
  const match = blog.content && blog.content.match(/!\[.*?\]\((.*?)(?:\s+".*?")?\)/);
  return match ? match[1] : null;
};

const styles = {
  container: { padding: "120px 20px 80px", maxWidth: "1200px", margin: "0 auto", color: "white", minHeight: "100vh" },
  header: { fontSize: "3rem", marginBottom: "10px", fontWeight: "bold" },
  subHeader: { color: "#aaa", marginBottom: "50px", fontSize: "1.2rem" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "30px" },

  card: { backgroundColor: "#111", border: "1px solid #333", borderRadius: "12px", overflow: "hidden", transition: "transform 0.2s", display: "flex", flexDirection: "column" },

  thumbnailWrapper: { height: "180px", width: "100%", overflow: "hidden", position: "relative", backgroundColor: "#0f172a" },
  thumbnailImage: { width: "100%", height: "100%", objectFit: "contain" },
  thumbnailPlaceholder: { width: "100%", height: "100%", background: "linear-gradient(135deg, #1e293b, #0f172a)" },

  cardContent: { padding: "20px", flex: 1, display: "flex", flexDirection: "column" },
  cardTitle: { fontSize: "1.2rem", marginBottom: "10px", color: "#fff", fontWeight: "bold", lineHeight: "1.4" },
  meta: { color: "#888", fontSize: "0.9rem", marginBottom: "15px" },
  link: { color: "#7b4bff", textDecoration: "none", fontWeight: "bold", marginTop: "auto" },

  // SKELETON STYLES
  skeletonCard: { backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "12px", height: "350px", overflow: "hidden", animation: "pulse 1.5s infinite" },
  skeletonImage: { width: "100%", height: "180px", backgroundColor: "#1e293b" },
  skeletonText: { width: "80%", height: "24px", backgroundColor: "#334155", margin: "20px", borderRadius: "4px" },
  skeletonTextShort: { width: "40%", height: "20px", backgroundColor: "#334155", margin: "0 20px", borderRadius: "4px" }
};

// Add this animation to index.css if you want the pulse effect:
// @keyframes pulse { 0% { opacity: 0.6; } 50% { opacity: 1; } 100% { opacity: 0.6; } }

export default Blogs;
