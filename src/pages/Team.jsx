import React from "react";
import teamData from "../data/team.json";
import "../styles/pages/team.css"; 

function Avatar({ name, image }) {
  // Shows image if available, otherwise shows Initials (e.g. "SK")
  if (image && image !== "#" && image.trim() !== "") {
    return <img src={image} alt={name} className="team-avatar-img" />;
  }

  const initials = name
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return <div className="team-avatar-placeholder">{initials}</div>;
}

function TeamCard({ member }) {
  return (
    <div className="team-card">
      <Avatar name={member.name} image={member.image} />

      <h3 className="team-name">{member.name}</h3>
      <p className="team-role">{member.role}</p>
      <p className="team-bio">{member.bio}</p>

      <div className="team-socials">
        {member.linkedin && member.linkedin !== "#" && (
          <a href={member.linkedin} target="_blank" rel="noreferrer" className="team-link">
            LinkedIn
          </a>
        )}
        {member.github && member.github !== "#" && (
          <a href={member.github} target="_blank" rel="noreferrer" className="team-link">
            GitHub
          </a>
        )}
      </div>
    </div>
  );
}

export default function Team() {
  return (
    <div className="team-page">
      <div className="team-container">
        <header>
          <h1 className="team-header">Our Team</h1>
          <p className="team-subtitle">
            Meet the students who run the club, organize events, and build the community.
          </p>
        </header>

        <div className="team-grid">
          {teamData.map((member, idx) => (
            <TeamCard key={idx} member={member} />
          ))}
        </div>
      </div>
    </div>
  );
}
