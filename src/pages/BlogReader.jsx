// src/pages/BlogReader.jsx
import React from "react";
import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css"; // Styles for the math
import { blogs } from "../data/blogs"; // Import our fake database

function BlogReader() {
  const { id } = useParams(); // Get the ID from the URL
  const blog = blogs.find((b) => b.id === id); // Find the matching blog

  if (!blog) {
    return <div style={{ color: "white", padding: "50px" }}>Blog not found!</div>;
  }

  return (
    <div style={styles.container}>
      <Link to="/" style={styles.backLink}>← Back to Home</Link>
      
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>{blog.title}</h1>
        <p style={styles.meta}>{blog.author} • {blog.date}</p>
      </div>

      {/* The Article Content */}
      <div className="blog-content" style={styles.content}>
        <ReactMarkdown
          children={blog.content}
          remarkPlugins={[remarkMath]}
          rehypePlugins={[rehypeKatex]}
        />
      </div>
    </div>
  );
}

// Simple CSS styles to match your dark theme
const styles = {
  container: {
    maxWidth: "800px",
    margin: "0 auto",
    padding: "40px 20px",
    color: "#e0e0e0",
    minHeight: "100vh",
  },
  backLink: {
    color: "#888",
    textDecoration: "none",
    marginBottom: "20px",
    display: "inline-block",
  },
  header: {
    borderBottom: "1px solid #333",
    paddingBottom: "20px",
    marginBottom: "30px",
  },
  title: {
    fontSize: "2.5rem",
    marginBottom: "10px",
    color: "#fff",
  },
  meta: {
    color: "#888",
    fontSize: "0.9rem",
  },
  content: {
    fontSize: "1.1rem",
    lineHeight: "1.6",
  }
};

export default BlogReader;
