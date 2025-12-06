// src/pages/Home.jsx

import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom"; // Import Link for navigation

import bgImage from "../assets/home_background.jpg";
import { blogs } from "../data/blogs";   // Import your blog data

function Home() {
  return (
    <>
      {/* HERO SECTION */}
      <div
        className="hero-root"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="hero-overlay" />

        <main className="hero-content">
          {/* LEFT HERO TEXT */}
          <section className="hero-left">
            <h1 className="hero-title">
              <span>Stamatics</span><br />
              <span>IIT Kanpur</span>
            </h1>
            <p className="hero-subtitle">
              Bring problems. Leave with answers.
            </p>
            <button className="hero-button">Explore Competitions</button>
          </section>

          {/* RIGHT BLOGS PANEL */}
          <section className="hero-right" id="blogs">
            <div className="newsletter-card">
              <h3 className="newsletter-title">Latest Blogs</h3>

              <div className="blog-list">
                {blogs.map((blog) => (
                  <article className="blog-item" key={blog.id}>
                    <div className="blog-thumbnail">
                      <img
                        src="https://via.placeholder.com/80x60"
                        alt={blog.title}
                      />
                    </div>
                    <div className="blog-info">
                      <h4 className="blog-title">{blog.title}</h4>
                      <p className="blog-meta">
                        {blog.author} · {blog.date}
                      </p>
                      <Link to={`/blogs/${blog.id}`} className="blog-link">
                        Read more →
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        </main>

        {/* SCROLL ARROW */}
        <div className="scroll-indicator">
          <span className="scroll-arrow">↓</span>
        </div>
      </div>

      {/* ABOUT US SECTION */}
      <section className="about-section" id="about">
        <div className="about-inner">
          <h2 className="about-title">About Us</h2>
          <div className="about-grid">
            <div className="about-card">
              <h3>What We Do</h3>
              <p>
                Throughout the year, Stamatics organises mathematical competitions, talks by various professors and students, workshops, and numerous other informal and formal sessions to guide students towards a fruitful life in the campus and outside. Aimed at shedding more light and inculcating more interest in Mathematics, as well as making it fun and enjoyable, Stamatics distributes its newsletter full of interesting stuff ranging from groundbreaking scientific research articles to academic guidance by seniors and professors in various fields.
              </p>
            </div>

            <div className="about-card">
              <h3>Who We Are</h3>
              <p>
                Stamatics is a society of IIT Kanpur under the Department of Mathematics and Statistics. In a nutshell, it is a community of students who share a passion for mathematical thinking—bringing together opportunities, interesting research, engaging puzzles, and valuable guidance from seniors and mentors. Stamatics works to make these resources accessible to everyone on campus, fostering curiosity, collaboration, and a deeper appreciation for the world of mathematics.
              </p>
            </div>

            {/* Removed the "Why Join" card */}
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
