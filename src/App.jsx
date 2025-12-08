// src/App.jsx
import { Routes, Route } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Contact from "./pages/Contact";

import BlogReader from "./pages/BlogReader";
import Blogs from "./pages/Blogs";  // <--- NEW: Import the page

import Mathemania from "./pages/Mathemania";
import Team from "./pages/Team";
import Participants from "./pages/Participants";

function App() {
  return (
    <div className="page-root">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />

        
        {/* NEW: The main list of blogs */}
        <Route path="/blogs" element={<Blogs />} />

        {/* The reader for a specific blog */}
        <Route path="/blogs/:id" element={<BlogReader />} />

        <Route path="/mathemania" element={<Mathemania />} />

        <Route path="/team" element={<Team />} />

        <Route path="/competitions/participants" element={<Participants />} />


      </Routes>
    </div>
  );
}

export default App;
