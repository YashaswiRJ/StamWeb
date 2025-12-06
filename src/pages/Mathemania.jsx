// src/pages/Mathemania.jsx
import React, { useState } from "react";

function Mathemania() {
  const [formData, setFormData] = useState({
    teamName: "",
    institute: "",
    teamLeader: "",
    email: "",
    contactNumber: "",
    member2Name: "",
    member2Email: "",
    member3Name: "",
    member3Email: "",
    member4Name: "",
    member4Email: ""
  });

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    const teamNamePattern = /^[A-Za-z0-9_ ]+$/;
    if (!teamNamePattern.test(formData.teamName.trim())) {
      alert(
        "Team name can only contain letters, numbers, spaces, and underscores. No emojis or special symbols."
      );
      return;
    }

    setSubmitting(true);

    const GOOGLE_SCRIPT_URL =
      "https://script.google.com/macros/s/AKfycbwv8yFFWikTCVSBpNaGtnYQEfCE_vmEK_J8cF1T_aF2avROc0y5Lfhak_sSKCx6FlQuzA/exec";

    try {
      // Send data as plain text JSON with no-cors to avoid CORS/preflight issues
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "text/plain;charset=utf-8"
        },
        body: JSON.stringify(formData)
      });

      // We can't read the response in no-cors mode, so assume success if no error
      alert("Registration submitted! Your response has been recorded.");

      setFormData({
        teamName: "",
        institute: "",
        teamLeader: "",
        email: "",
        contactNumber: "",
        member2Name: "",
        member2Email: "",
        member3Name: "",
        member3Email: "",
        member4Name: "",
        member4Email: ""
      });
    } catch (error) {
      console.error("Mathemania submit error:", error);
      alert(
        "An error occurred while submitting your registration. Please try again later."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mathemania-page">
      <div className="mathemania-inner">
        {/* HEADER */}
        <header className="mathemania-header">
          <h1 className="mathemania-title">Mathemania</h1>
          <p className="mathemania-subtitle">
            The flagship mathematics contest of Stamatics, IIT Kanpur –
            combining creativity, rigor, and problem-solving under one banner.
          </p>
        </header>

        <div className="mathemania-grid">
          {/* LEFT PANEL */}
          <div className="mathemania-card">
            <h2 className="mathemania-card-title">Event Overview</h2>
            <p className="mathemania-text">
              Mathemania is an engaging team-based mathematics competition
              designed to challenge participants through a curated set of eight
              high-level problems drawn from diverse areas of mathematics. The
              event encourages collaborative problem-solving, strategic
              thinking, and rigorous reasoning under time constraints. Each team
              works together to complete the full question set, applying logic,
              geometry, algebra, number theory, and inequality techniques to
              arrive at correct solutions.
            </p>

            <h2 className="mathemania-card-title mathemania-subheading">
              Key Information
            </h2>

            <p className="mathemania-keyinfo">Format:</p>
            <ul>
              <li>The paper contains 8–10 questions, each worth 10 points.</li>
              <li>
                Each question is subjective and explores areas such as proofs,
                logical reasoning, and geometry.
              </li>
            </ul>

            {/* FIXED HERE */}
            <p className="mathemania-keyinfo">Rules and Conduct:</p>
            <ul>
              <li>
                Interaction between teams is strictly prohibited and may lead to
                penalties or disqualification.
              </li>
              <li>
                All electronic devices must be submitted to an invigilator
                before the event begins. Any use of such devices during the
                competition results in immediate disqualification.
              </li>
            </ul>

            <p className="mathemania-text" style={{ marginTop: "10px" }}>
              <a
                href="https://drive.google.com/drive/folders/1QXsp1OCryBgIKEJScEwKYkb8kdNkmaR6?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#7b4bff",
                  textDecoration: "underline",
                  cursor: "pointer",
                  fontWeight: "600"
                }}
              >
                Click here for PYQs →
              </a>
            </p>

            <p className="mathemania-text mathemania-past-line">
              Past papers and resources will be made available on the Stamatics
              website ahead of the contest.
            </p>
          </div>

          {/* RIGHT PANEL – FORM */}
          <div className="mathemania-card">
            <h2 className="mathemania-card-title">
              Mathemania Registration Form
            </h2>
            <p className="mathemania-text">
              Group size limit: up to 4 members.
              <br />
              <span className="mathemania-note">
                Team name should contain only Roman characters, digits, spaces,
                and underscores (no emojis or special symbols).
              </span>
            </p>

            <form className="mathemania-form" onSubmit={handleSubmit}>
              {/* TEAM NAME */}
              <div className="mathemania-field">
                <label htmlFor="teamName">
                  Team Name<span className="required-star">*</span>
                </label>
                <input
                  id="teamName"
                  name="teamName"
                  type="text"
                  required
                  pattern="[A-Za-z0-9_ ]+"
                  placeholder="Enter team name"
                  value={formData.teamName}
                  onChange={handleChange}
                />
              </div>

              {/* INSTITUTE */}
              <div className="mathemania-field">
                <label htmlFor="institute">
                  Institute<span className="required-star">*</span>
                </label>
                <input
                  id="institute"
                  name="institute"
                  type="text"
                  required
                  placeholder="Enter institute name"
                  value={formData.institute}
                  onChange={handleChange}
                />
              </div>

              {/* TEAM LEADER */}
              <div className="mathemania-field">
                <label htmlFor="teamLeader">
                  Team Leader<span className="required-star">*</span>
                </label>
                <input
                  id="teamLeader"
                  name="teamLeader"
                  type="text"
                  required
                  placeholder="Full name of team leader"
                  value={formData.teamLeader}
                  onChange={handleChange}
                />
              </div>

              {/* EMAIL */}
              <div className="mathemania-field">
                <label htmlFor="leaderEmail">
                  Email<span className="required-star">*</span>
                </label>
                <input
                  id="leaderEmail"
                  name="email"
                  type="email"
                  required
                  placeholder="leader@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              {/* CONTACT NUMBER */}
              <div className="mathemania-field">
                <label htmlFor="contactNumber">
                  Contact Number<span className="required-star">*</span>
                </label>
                <input
                  id="contactNumber"
                  name="contactNumber"
                  type="tel"
                  required
                  placeholder="10-digit phone number"
                  value={formData.contactNumber}
                  onChange={handleChange}
                />
              </div>

              {/* MEMBER 2 */}
              <div className="mathemania-field-group">
                <div className="mathemania-field">
                  <label htmlFor="member2">Team Member 2</label>
                  <input
                    id="member2"
                    name="member2Name"
                    type="text"
                    placeholder="Name (optional)"
                    value={formData.member2Name}
                    onChange={handleChange}
                  />
                </div>
                <div className="mathemania-field">
                  <label htmlFor="member2Email">Email</label>
                  <input
                    id="member2Email"
                    name="member2Email"
                    type="email"
                    placeholder="member2@example.com"
                    value={formData.member2Email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* MEMBER 3 */}
              <div className="mathemania-field-group">
                <div className="mathemania-field">
                  <label htmlFor="member3">Team Member 3</label>
                  <input
                    id="member3"
                    name="member3Name"
                    type="text"
                    placeholder="Name (optional)"
                    value={formData.member3Name}
                    onChange={handleChange}
                  />
                </div>
                <div className="mathemania-field">
                  <label htmlFor="member3Email">Email</label>
                  <input
                    id="member3Email"
                    name="member3Email"
                    type="email"
                    placeholder="member3@example.com"
                    value={formData.member3Email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* MEMBER 4 */}
              <div className="mathemania-field-group">
                <div className="mathemania-field">
                  <label htmlFor="member4">Team Member 4</label>
                  <input
                    id="member4"
                    name="member4Name"
                    type="text"
                    placeholder="Name (optional)"
                    value={formData.member4Name}
                    onChange={handleChange}
                  />
                </div>
                <div className="mathemania-field">
                  <label htmlFor="member4Email">Email</label>
                  <input
                    id="member4Email"
                    name="member4Email"
                    type="email"
                    placeholder="member4@example.com"
                    value={formData.member4Email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <p className="mathemania-text mathemania-footnote">
                Fields marked with <span className="required-star">*</span> are
                compulsory. Group size limit is up to 4 members.
              </p>

              <button
                type="submit"
                className="mathemania-button"
                disabled={submitting}
              >
                {submitting ? "Submitting..." : "Submit Registration"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Mathemania;
