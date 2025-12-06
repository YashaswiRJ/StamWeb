import React from "react";
import teamData from "../data/team.json";

/**
 * Single-file Team component (includes card UI).
 * Place this at: src/pages/team/Team.jsx
 *
 * IMPORTANT:
 * - The JSON data file should live at: src/data/team.json
 * - From this file location, the correct import path is "../../data/team.json"
 */

function Avatar({ name, image, alt }) {
  // if image exists, show it; otherwise show initials fallback
  if (image) {
    return (
      <img
        src={image}
        alt={alt || name}
        className="w-28 h-28 rounded-full object-cover mx-auto border-2 border-gray-200 dark:border-gray-700"
      />
    );
  }

  const initials = name
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="w-28 h-28 rounded-full mx-auto flex items-center justify-center bg-gray-100 dark:bg-gray-700 text-2xl font-semibold text-gray-700 dark:text-gray-100 border-2 border-gray-200 dark:border-gray-600">
      {initials}
    </div>
  );
}

function TeamCard({ member }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 text-center hover:shadow-xl transition">
      <Avatar name={member.name} image={member.image} alt={member.name} />

      <h3 className="text-lg font-semibold mt-4">{member.name}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{member.role}</p>

      <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">{member.bio}</p>

      <div className="flex items-center justify-center gap-3">
        {member.linkedin && (
          <a
            href={member.linkedin}
            target="_blank"
            rel="noreferrer noopener"
            aria-label={`${member.name} LinkedIn`}
            className="text-blue-600 dark:text-blue-400 text-sm hover:underline"
          >
            LinkedIn
          </a>
        )}

        {member.github && (
          <a
            href={member.github}
            target="_blank"
            rel="noreferrer noopener"
            aria-label={`${member.name} GitHub`}
            className="text-gray-800 dark:text-gray-100 text-sm hover:underline"
          >
            GitHub
          </a>
        )}
      </div>
    </div>
  );
}

export default function Team() {
  // If import fails or data is empty, fall back to a small default
  const members = Array.isArray(teamData) && teamData.length ? teamData : [
    { name: "Saurav Kumar", role: "President", image: "/assets/team/user1.jpg", linkedin: "#", github: "#", bio: "Organizer & lead" },
    { name: "Ananya Gupta", role: "VP", image: "/assets/team/user2.jpg", linkedin: "#", github: "#", bio: "Events & outreach" }
  ];

  return (
    <div className="mt-6">
      <h1 className="text-3xl font-bold mb-3 text-center">Our Team</h1>

      <p className="text-center text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
        Meet the students who run the club, organize events and build the community.
      </p>

      <div className="mx-auto max-w-6xl px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {members.map((member, idx) => (
            <TeamCard key={idx} member={member} />
          ))}
        </div>
      </div>
    </div>
  );
}
