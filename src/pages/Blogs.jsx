// src/pages/Blogs.jsx
import React from "react";
import { Link } from "react-router-dom";
import { blogs } from "../data/blogs";

function Blogs() {
  return (
    <div style={styles.container}>
      <h1 style={styles.header}>All Articles</h1>
      <p style={styles.subHeader}>
        Explore our latest thoughts on Mathematics, Statistics, and logic.
      </p>

      {/* The Grid Layout */}
      <div style={styles.grid}>
        {blogs.map((blog) => (
          <article key={blog.id} style={styles.card}>
            <div style={styles.thumbnail}>
              {/* Placeholder image */}
              <div style={styles.placeholderImg}></div>
            </div>
            
            <div style={styles.cardContent}>
              <h2 style={styles.cardTitle}>{blog.title}</h2>
              <p style={styles.meta}>
                {blog.author} · {blog.date}
              </p>
              <Link to={`/blogs/${blog.id}`} style={styles.link}>
                Read Article →
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

// Styles consistent with your dark theme
const styles = {
  container: {
    padding: "80px 20px",
    maxWidth: "1200px",
    margin: "0 auto",
    color: "white",
    minHeight: "100vh",
  },
  header: {
    fontSize: "3rem",
    marginBottom: "10px",
    fontWeight: "bold",
  },
  subHeader: {
    color: "#aaa",
    marginBottom: "50px",
    fontSize: "1.2rem",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "30px",
  },
  card: {
    backgroundColor: "#111",
    border: "1px solid #333",
    borderRadius: "12px",
    overflow: "hidden",
    transition: "transform 0.2s",
  },
  thumbnail: {
    height: "180px",
    backgroundColor: "#222",
  },
  cardContent: {
    padding: "20px",
  },
  cardTitle: {
    fontSize: "1.2rem",
    marginBottom: "10px",
    color: "#fff",
  },
  meta: {
    color: "#666",
    fontSize: "0.9rem",
    marginBottom: "15px",
  },
  link: {
    color: "#4a90e2",
    textDecoration: "none",
    fontWeight: "bold",
  },
};

export default Blogs;
