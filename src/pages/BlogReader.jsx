import React, { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css"; 
import { BlogContext } from "../context/BlogContext"; // <--- IMPORT CONTEXT
import { GOOGLE_SCRIPT_URL } from "../config";

export default function BlogReader() {
  const { id } = useParams();
  const { blogs } = useContext(BlogContext); // <--- GET ALL BLOGS
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

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
        <Link to="/blogs" style={styles.backLink}>← Back to Articles</Link>
        
        <header style={styles.header}>
          <h1 style={styles.title}>{blog.title}</h1>
          <p style={styles.meta}>
            {blog.author} • {blog.date ? new Date(blog.date).toLocaleDateString() : "Recent"}
          </p>
        </header>
        
        <div className="markdown-body" style={styles.content}>
          <ReactMarkdown 
            children={blog.content} 
            remarkPlugins={[remarkMath]} 
            rehypePlugins={[rehypeKatex]}
            components={{
              img: ({node, ...props}) => <img style={styles.image} {...props} />
            }} 
          />
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#020617",
    color: "#e2e8f0",
    padding: "120px 20px 60px"
  },
  container: {
    maxWidth: "800px",
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
    fontSize: "1.1rem",
    lineHeight: "1.8",
    color: "#cbd5e1"
  },
  image: {
    maxWidth: "100%",
    borderRadius: "8px",
    marginTop: "20px",
    marginBottom: "20px"
  }
};
