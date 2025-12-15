// src/pages/BlogReader.jsx
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

import "../styles/pages/blog-reader.css"; // ← NEW

function BlogReader() {
  const { id } = useParams(); // Get the ID from the URL
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogContent = async () => {
      // PASTE YOUR GOOGLE WEB APP URL HERE
      const GOOGLE_SCRIPT_URL =
        "https://script.google.com/macros/s/AKfycbzWdwnoRrTY9P790xcwkglWhS1gU4D5zFR49ylL2LtGiTYFDHdhp3bdHb1D4hgaK5JV/exec";

      try {
        // Fetch all blogs (Google Sheets is fast enough for this size)
        const response = await fetch(`${GOOGLE_SCRIPT_URL}?action=get_blogs`);
        const data = await response.json();

        // Find the specific blog that matches the ID in the URL
        const foundBlog = data.find((b) => String(b.id) === id);

        if (foundBlog) {
          setBlog(foundBlog);
        } else {
          console.error("Blog not found");
        }
      } catch (error) {
        console.error("Error fetching blog post:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogContent();
  }, [id]);

  if (loading) {
    return (
      <div className="blog-reader-container">
        <div className="blog-reader-header blog-reader-header--no-border">
          Loading article...
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="blog-reader-container">
        <h1 className="blog-reader-title">404</h1>
        <p>Blog post not found.</p>
        <Link to="/blogs" className="blog-reader-back-link">
          ← Back to all blogs
        </Link>
      </div>
    );
  }

  return (
    <div className="blog-reader-container">
      <Link to="/blogs" className="blog-reader-back-link">
        ← Back to All Articles
      </Link>

      {/* Header */}
      <div className="blog-reader-header">
        <h1 className="blog-reader-title">{blog.title}</h1>
        <p className="blog-reader-meta">
          {blog.author} •{" "}
          {blog.date ? new Date(blog.date).toLocaleDateString() : ""}
        </p>
      </div>

      {/* The Article Content */}
      <div className="blog-content blog-reader-content">
        <ReactMarkdown
          children={blog.content}
          remarkPlugins={[remarkMath]}
          rehypePlugins={[rehypeKatex]}
        />
      </div>
    </div>
  );
}

export default BlogReader;
