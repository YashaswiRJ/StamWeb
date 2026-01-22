import React, { useState, useEffect } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../firebase"; // Ensure your firebase.js uses getFirestore()
import "../styles/pages/team.css";

import { FaLinkedin, FaGithub } from "react-icons/fa";

const TeamCard = ({ member, isPriority = false }) => {
  const initials =
    member.name?.split(" ").map(s => s[0]).slice(0, 2).join("").toUpperCase() || "?";

  return (
    <div className={`team-card ${isPriority ? "priority-card" : ""}`}>
      <div className="team-avatar-wrapper">
        {member.image ? (
          <img
            src={member.image}
            alt={member.name}
            className="team-avatar-img"
            loading={isPriority ? "eager" : "lazy"}
          />
        ) : (
          <div className="team-avatar-placeholder">{initials}</div>
        )}
      </div>

      <div className="team-card-info">
        <h3 className="team-name">{member.name}</h3>
        <p className="team-role">{member.role}</p>
        <p className="team-bio">{member.bio}</p>
      </div>

      <div className="team-socials">
  {member.linkedin && (
    <a href={member.linkedin} target="_blank" rel="noreferrer" className="team-link" aria-label="LinkedIn">
      {/* LinkedIn Icon */}
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
      </svg>
    </a>
  )}
  {member.github && (
    <a href={member.github} target="_blank" rel="noreferrer" className="team-link" aria-label="GitHub">
      {/* GitHub Icon */}
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      </svg>
    </a>
  )}
</div>
    </div>
  );
};

export default function Team() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true); // ✅ FIXED: Added missing state

  useEffect(() => {
    // Reference the Firestore collection you just created
    const q = query(collection(db, "team_members"), orderBy("priority", "asc"));
    

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const memberList = [];
      querySnapshot.forEach((doc) => {
        memberList.push({ id: doc.id, ...doc.data() });
      });

      console.log("🔥 Firestore data received:", memberList); // 👈 ADD THIS

      setMembers(memberList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const coordinators = members.filter(m => m.role === "Coordinator");
  const executives = members.filter(m => m.role === "Executive");

  if (loading) return <div className="team-loading">Loading Stamatics Team...</div>;

  return (
    <div className="team-page">
      <div className="team-container">
        <header className="team-header-section">
          <h1 className="team-title">Our Team</h1>
          <p className="team-subtitle">The minds behind Stamatics IIT Kanpur</p>
        </header>

        {coordinators.length > 0 && (
          <section className="role-section">
            <h2 className="role-heading">Coordinators</h2>
            <div className="team-grid coordinators-grid">
              {coordinators.map(m => <TeamCard key={m.id} member={m} isPriority={true} />)}
            </div>
          </section>
        )}

        {executives.length > 0 && (
          <section className="role-section">
            <h2 className="role-heading">Executives</h2>
            <div className="team-grid executives-grid">
              {executives.map(m => <TeamCard key={m.id} member={m} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}