import React, { useState, useEffect, useMemo } from "react";
import globalTeamData from "../data/team.json";
import { GOOGLE_SCRIPT_URL } from "../config";
import "../styles/pages/team.css";

// ROBUST IMAGE HANDLER: Bypasses Google Drive 403/429 CORS errors
const getSafeImageUrl = (url) => {
  if (!url || typeof url !== 'string' || url === "#") return null;

  // Explicitly reject Google Drive Folders (cannot be rendered as image)
  if (url.includes("/folders/")) return null;

  if (url.includes("drive.google.com")) {
    const fileIdMatch = url.match(/\/d\/(.+?)\/(view|edit|xp)/) || url.match(/id=(.+?)(&|$)/);
    if (fileIdMatch && fileIdMatch[1]) {
      const fileId = fileIdMatch[1];
      // Use wsrv.nl proxy: Bypasses CORS, caches the image, and optimizes it to WebP
      const driveUrl = encodeURIComponent(`https://drive.google.com/uc?export=download&id=${fileId}`);
      return `https://wsrv.nl/?url=${driveUrl}&w=400&h=400&fit=cover&output=webp&q=80`;
    }
  }
  return url;
};

const Avatar = ({ name, image, priority = false }) => {
  const [imgError, setImgError] = useState(false);
  const safeUrl = useMemo(() => getSafeImageUrl(image), [image]);

  const initials = name
    ? name.split(" ").map(s => s[0]).slice(0, 2).join("").toUpperCase()
    : "?";

  return (
    <div className="team-avatar-wrapper">
      {safeUrl && !imgError ? (
        <img
          src={safeUrl}
          alt={name}
          className="team-avatar-img"
          onError={() => setImgError(true)}
          loading={priority ? "eager" : "lazy"}
          {...(priority ? { fetchPriority: "high" } : {})}
        />
      ) : (
        <div className="team-avatar-placeholder">{initials}</div>
      )}
    </div>
  );
};

const TeamCard = ({ member, priority = false }) => (
  <div className="team-card">
    <Avatar name={member.name} image={member.image} priority={priority} />
    <div className="team-card-info">
      <h3 className="team-name">{member.name}</h3>
      <p className="team-role">{member.role}</p>
      <p className="team-bio">{member.bio}</p>
    </div>
    <div className="team-socials">
      {member.linkedin && member.linkedin !== "#" && (
        <a href={member.linkedin} target="_blank" rel="noreferrer" className="team-link" aria-label="LinkedIn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
        </a>
      )}
      {member.github && member.github !== "#" && (
        <a href={member.github} target="_blank" rel="noreferrer" className="team-link" aria-label="GitHub">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
        </a>
      )}
    </div>
  </div>
);

export default function Team() {
  const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  const [teamData, setTeamData] = useState(() => {
    try {
      const cached = localStorage.getItem("team_data_cache");
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Array.isArray(data) && Date.now() - timestamp < CACHE_TTL) {
          return data;
        }
      }
    } catch (e) {}

    return globalTeamData;
  });

  // const [teamData, setTeamData] = useState(() => {
  //   // 1. Try LocalStorage for returning users
  //   try {
  //     const cached = localStorage.getItem("team_data_cache");
  //     if (cached) {
  //       const { data } = JSON.parse(cached);
  //       if (Array.isArray(data)) return data;
  //     }
  //   } catch (e) { }

  //   // 2. Fallback to build-time JSON (Instant for new users if deployed)
  //   return globalTeamData;
  // });

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        // const response = await fetch(`${GOOGLE_SCRIPT_URL}?action=get_team`);
        const response = await fetch(
          `${GOOGLE_SCRIPT_URL}?action=get_team&ts=${Date.now()}`,
            { cache: "no-store" }
        );

        const data = await response.json();
        if (Array.isArray(data)) {
          setTeamData(data);
          // Update Cache
          localStorage.setItem("team_data_cache", JSON.stringify({
            data,
            timestamp: Date.now()
          }));
        }
      } catch (e) { console.error("Update failed", e); }
    };
    // Fetch in background to keep fresh
    fetchTeam();
  }, []);

  // Split logic: using case-insensitive search
  const coordinators = teamData.filter(m => m.role.toLowerCase().includes("coordinator"));
  const executives = teamData.filter(m => m.role.toLowerCase().includes("executive"));

  return (
    <div className="team-page">
      <div className="team-container">
        <header className="team-header-section">
          <h1 className="team-title">Our Team</h1>
          <p className="team-subtitle">Meet the students who run the club.</p>
        </header>

        {/* COORDINATORS SECTION */}
        {coordinators.length > 0 && (
          <section className="role-section">
            <h2 className="role-heading">Coordinators</h2>
            <div className="team-grid coordinators-grid">
              {coordinators.map((m, i) => (
                <TeamCard key={`coord-${i}`} member={m} priority={true} />
              ))}
            </div>
          </section>
        )}

        {/* EXECUTIVES SECTION */}
        {executives.length > 0 && (
          <section className="role-section">
            <h2 className="role-heading">Executives</h2>
            <div className="team-grid executives-grid">
              {executives.map((m, i) => (
                <TeamCard key={`exec-${i}`} member={m} priority={false} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}