import React, { useContext, useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import { BlogContext } from "../context/BlogContext"; // <--- IMPORT CONTEXT
import { GOOGLE_SCRIPT_URL } from "../config";
import { cleanMarkdown } from "../utils/cleanMarkdown";

export default function BlogReader() {
  const { id } = useParams();
  const { blogs } = useContext(BlogContext); // <--- GET ALL BLOGS
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();



  useEffect(() => {
    // STRATEGY: Memory First, Network Fallback

    // 1. Try to find the blog in our existing list (INSTANT)
    const foundInMemory = blogs.find((b) => String(b.id) === String(id));

    if (foundInMemory) {
      setBlog(foundInMemory);
      setLoading(false);
    } else {
      // 2. Only fetch if we don't have it (e.g., direct link to a brand new post)
      const fetchIndividualBlog = async () => {
        try {
          const response = await fetch(`${GOOGLE_SCRIPT_URL}?action=get_blogs`);
          const data = await response.json();
          const foundOnline = data.find((b) => String(b.id) === String(id));
          setBlog(foundOnline || null);
        } catch (error) {
          console.error("Error:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchIndividualBlog();
    }
  }, [id, blogs]);

  if (loading) return <div style={styles.loading}>Loading article...</div>;

  if (!blog) return (
    <div style={styles.errorContainer}>
      <h1 style={styles.errorTitle}>404</h1>
      <p>Blog post not found.</p>
      <Link to="/blogs" style={styles.backLink}>← Back to All Blogs</Link>
    </div>
  );

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div
          onClick={() => {
            // Check if there is history to go back to (hacky check: if state is null, might be new tab)
            if (window.history.state && window.history.state.idx > 0) {
              navigate(-1);
            } else {
              navigate("/blogs");
            }
          }}
          style={{ ...styles.backLink, cursor: "pointer" }}
        >
          ← Back to Blogs
        </div>

        <header style={styles.header}>
          <h1 style={styles.title}>{blog.title}</h1>
          <p style={styles.meta}>
            {blog.author} • {blog.date ? new Date(blog.date).toLocaleDateString() : "Recent"}
          </p>
        </header>

        <div className="markdown-body" style={styles.content}>
          <ReactMarkdown
            children={cleanMarkdown(blog.content)}
            remarkPlugins={[remarkMath]}
            rehypePlugins={[rehypeKatex]}
            components={{
              img: ({ node, ...props }) => <img style={styles.image} {...props} />,
              p: ({ node, ...props }) => <p style={styles.paragraph} {...props} />,
              h1: ({ node, ...props }) => <h1 style={styles.heading} {...props} />,
              h2: ({ node, ...props }) => <h2 style={styles.heading} {...props} />,
              h3: ({ node, ...props }) => <h3 style={styles.heading} {...props} />,
              li: ({ node, ...props }) => <li style={styles.listItem} {...props} />,
              ul: ({ node, ...props }) => <ul style={styles.list} {...props} />,
              ol: ({ node, ...props }) => <ol style={styles.list} {...props} />,
              blockquote: ({ node, ...props }) => <blockquote style={styles.blockquote} {...props} />,
              code: ({ node, inline, className, children, ...props }) => {
                return inline ? (
                  <code style={styles.inlineCode} {...props}>{children}</code>
                ) : (
                  <pre style={styles.pre} {...props}><code style={styles.blockCode}>{children}</code></pre>
                );
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}

// Local cleanContent removed in favor of src/utils/cleanMarkdown.js

const styles = {
  page: {
    minHeight: "100vh",
    background: "#09090b", // Slightly lighter than pure black for less eye strain (Medium Dark Mode)
    color: "#e2e8f0",
    padding: "100px 20px 60px"
  },
  container: {
    maxWidth: "700px",
    margin: "0 auto"
  },
  loading: {
    color: "#94a3b8",
    textAlign: "center",
    marginTop: "100px",
    fontSize: "1.2rem"
  },
  errorContainer: {
    textAlign: "center",
    marginTop: "100px",
    color: "white"
  },
  errorTitle: {
    fontSize: "3rem",
    marginBottom: "10px"
  },
  backLink: {
    color: "#7b4bff",
    textDecoration: "none",
    fontWeight: "600",
    display: "inline-block",
    marginBottom: "30px"
  },
  header: {
    marginBottom: "40px",
    borderBottom: "1px solid #334155",
    paddingBottom: "30px"
  },
  title: {
    fontSize: "2.5rem",
    fontWeight: "700",
    color: "white",
    marginBottom: "10px",
    lineHeight: "1.2"
  },
  meta: {
    color: "#94a3b8",
    fontSize: "1rem"
  },
  content: {
    // Container styles for the markdown wrapper
    width: "100%"
  },
  paragraph: {
    fontSize: "20px",
    lineHeight: "1.6",
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "left",
    marginBottom: "32px", // Medium uses large paragraph spacing
    fontFamily: '"Merriweather", "Georgia", serif',
    fontWeight: "300",
    letterSpacing: "0.01em",
    marginTop: "0"
  },
  heading: {
    fontFamily: '"Poppins", sans-serif', // Keep headings distinct
    fontWeight: "700",
    marginTop: "48px",
    marginBottom: "16px",
    lineHeight: "1.2",
    color: "#fff"
  },
  listItem: {
    fontSize: "20px",
    lineHeight: "1.6",
    fontFamily: '"Merriweather", "Georgia", serif',
    marginBottom: "12px",
    color: "rgba(255, 255, 255, 0.9)"
  },
  image: {
    maxWidth: "100%",
    borderRadius: "4px",
    marginTop: "32px",
    marginBottom: "32px",
    display: "block",
    marginLeft: "auto",
    marginRight: "auto"
  },
  list: {
    marginLeft: "20px",
    marginBottom: "32px"
  },
  blockquote: {
    borderLeft: "4px solid #fff",
    paddingLeft: "20px",
    marginLeft: "0",
    marginRight: "0",
    marginBottom: "32px",
    fontStyle: "italic",
    color: "#cbd5e1",
    fontSize: "20px"
  },
  inlineCode: {
    background: "rgba(255, 255, 255, 0.1)",
    padding: "2px 6px",
    borderRadius: "4px",
    fontFamily: '"Menlo", "Monaco", "Courier New", monospace',
    fontSize: "0.9em"
  },
  pre: {
    background: "#1e1e1e",
    padding: "20px",
    borderRadius: "8px",
    overflowX: "auto",
    marginBottom: "32px",
    border: "1px solid #333"
  },
  blockCode: {
    fontFamily: '"Menlo", "Monaco", "Courier New", monospace',
    fontSize: "16px",
    color: "#e2e8f0"
  }
};
