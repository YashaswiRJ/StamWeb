import React from "react";
import { Routes, Route } from "react-router-dom";

// Components
import Navbar from "./components/Navbar";
import ScrollToTop from "./components/ScrollToTop";


// Public Pages
import Home from "./pages/Home";
import Blogs from "./pages/Blogs";
import BlogReader from "./pages/BlogReader";
import Team from "./pages/Team";
import Contact from "./pages/Contact";
import Mathemania from "./pages/Mathemania";
import ViewPdf from "./pages/ViewPdf";
import MathQuiz from "./pages/MathQuiz";
import TeamTest from "./pages/TeamTest";
import Leaderboard from "./pages/Leaderboard";
import FetchRes from "./pages/FetchRes";
import SecondRoundSubmission from "./pages/SecondRoundSubmission";

// Admin Pages (Ensure you created these in the previous step)
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import MathemaniaAdmin from "./pages/MathemaniaAdmin";
import BlogAdmin from "./pages/BlogAdmin";
import TeamAdmin from "./pages/TeamAdmin";
// import ManUpload from "./pages/manUpload";

import "./styles/globals.css";

function App() {
  return (
    <div className="page-root">
      <ScrollToTop />
      <Navbar />
      <Routes>
        {/* ================= PUBLIC ROUTES ================= */}
        <Route path="/" element={<Home />} />

        {/* Since you don't have a specific Competitions page yet, 
            we can redirect /competitions to Mathemania or just remove it.
            For now, I have removed it to prevent errors. 
            [cite_start]The Navbar links directly to /mathemania anyway. [cite: 22] */}

        {/* <Route path="/mathemania" element={<Mathemania />} /> */}
        <Route path="/leaderboard" element={<Leaderboard />} />

        <Route path="/blogs" element={<Blogs />} />
        <Route path="/blogs/:id" element={<BlogReader />} />

        <Route path="/team" element={<Team />} />
        <Route path="/contact" element={<Contact />} />
        {/* <Route path="/view-pdf" element={<ViewPdf />} /> */}
        {/* <Route path="/submit-answers" element={<MathQuiz />} /> */}
        {/* <Route path="/team-test" element={<TeamTest />} /> */}
        {/* <Route path="/second-round" element={<MathQuiz />} /> */}


        {/* ================= ADMIN ROUTES ================= */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/mathemania" element={<MathemaniaAdmin />} />
        <Route path="/admin/blogs" element={<BlogAdmin />} />
        <Route path="/admin/team" element={<TeamAdmin />} />
        {/* <Route path="/man-upload" element={<ManUpload />} /> */}

        {/* Fallback for unknown routes (optional) */}
        <Route path="*" element={<div style={{ padding: 50, color: "white" }}>404 - Page Not Found</div>} />
      </Routes>
    </div>
  );
}

export default App;
