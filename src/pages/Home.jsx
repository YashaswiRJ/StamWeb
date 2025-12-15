// src/pages/Home.jsx

import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom"; // Import Link for navigation

import "../styles/pages/home.css"; 

import bgImage from "../assets/home_background.jpg";

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
