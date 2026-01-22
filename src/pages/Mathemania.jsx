import React, { useState, useEffect } from "react";
import { GOOGLE_SCRIPT_URL } from "../config";
import "../styles/pages/mathemania.css";

function Mathemania() {
  const [announcement, setAnnouncement] = useState("");

  useEffect(() => {
    fetch(`${GOOGLE_SCRIPT_URL}?action=get_announcement`)
      .then((res) => res.json())
      .then((data) => {
        if (data.text) setAnnouncement(data.text);
      })
      .catch((err) => console.error("Error fetching announcement:", err));
  }, []);

  return (
    <div className="math-page-wrapper">
      <div className="math-hero-section">
        <h1 className="math-glitch-title">MATHEMANIA 2025</h1>
        <div className="math-date-tag">Date: 25th Jan 2026</div>
      </div>

      <div className="math-content-grid">
        <div className="math-info-pane">
          <div className="math-glass-card">
            <h2 className="math-card-heading">Rules & Conduct</h2>
            <div className="math-rule-box">
              <ul>
                <li><strong>Online Test:</strong> Strictly proctored. AI tools and external assistance are prohibited.</li>
                <li><strong>Collaboration:</strong> Allowed within your registered team only.</li>
                <li><strong>Format:</strong> Round 1 is <b>objective</b>, while Round 2 is <b>subjective</b>, focusing on mathematical proofs and logical reasoning.</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="math-form-pane">
          <div className="math-glass-card math-status-card">
            <div className="math-closed-content">
              <h2 className="math-card-heading" style={{ color: "#ff4d4d" }}>
                REGISTRATION CLOSED
              </h2>
              
              <div className="math-status-body">
                <p>
                  Registrations for Mathemania 2026 are now officially closed. 
                  Thank you for the overwhelming response!
                </p>

                <div className="math-notice-box">
                  <p>
                    <strong>📩 Check Your Inbox:</strong> Confirmation emails have been 
                    floated to all successfully registered teams.
                  </p>
                  <p>
                    <strong>⚠️ Didn't receive a mail?</strong> If you completed your 
                    registration but haven't received a confirmation, please contact 
                    the admin immediately.
                  </p>
                </div>

                <div className="math-contact-info">
                  <p>For further assistance, please reach out to the organizing team.</p>
                  {/* Redirecting to the /contact path */}
                </div>
                {/* Using a standard anchor tag styled as a button - 100% crash-proof */}
              <a href="/contact" style={{ textDecoration: 'none', display: 'block', width: '100%' }}>
                <button 
                  className="math-submit-btn" 
                  style={{ marginTop: "15px", cursor: "pointer" }}
                  type="button"
                >
                  Contact Admin
                </button>
              </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Mathemania;
// import React, { useState, useEffect } from "react";
// import { GOOGLE_SCRIPT_URL } from "../config";
// import "../styles/pages/mathemania.css";

// function Mathemania() {
//   const initialFormData = {
//     teamName: "",
//     institute: "",
//     teamLeader: "",
//     email: "",
//     contactNumber: "",
//     member2Name: "",
//     member2Email: "",
//     member3Name: "",
//     member3Email: "",
//     member4Name: "",
//     member4Email: ""
//   };

//   const [formData, setFormData] = useState(initialFormData);

//   const [submitting, setSubmitting] = useState(false);
//   const [announcement, setAnnouncement] = useState("");
//   const [contactError, setContactError] = useState("");

//   useEffect(() => {
//     fetch(`${GOOGLE_SCRIPT_URL}?action=get_announcement`)
//       .then((res) => res.json())
//       .then((data) => {
//         if (data.text) setAnnouncement(data.text);
//       })
//       .catch((err) => console.error("Error fetching announcement:", err));
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
    
//     // CHECK 1: Real-time numeric validation for contact number
//     if (name === "contactNumber") {
//       const onlyNums = value.replace(/\D/g, ""); // Remove non-digits
//       if (onlyNums.length <= 10) {
//         setFormData((prev) => ({ ...prev, [name]: onlyNums }));
//       }
//       return;
//     }

//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (submitting) return;

//     // CHECK 2: Length validation before submission
//     if (formData.contactNumber.length !== 10) {
//       setContactError("Contact number must be exactly 10 digits.");
//       return;
//     } else {
//       setContactError("");
//     }

//     // Final check for mandatory emails if names are present
//     for (let i = 2; i <= 4; i++) {
//       const name = formData[`member${i}Name`].trim();
//       const email = formData[`member${i}Email`].trim();
//       if (name && !email) {
//         alert(`Please provide an email for Team Member ${i}.`);
//         return;
//       }
//     }

//     setSubmitting(true);
//     try {
//       await fetch(GOOGLE_SCRIPT_URL, {
//         method: "POST",
//         mode: "no-cors",
//         headers: { "Content-Type": "text/plain;charset=utf-8" },
//         body: JSON.stringify(formData)
//       });
//       alert("🎉 Registration successful!");
//         setFormData(initialFormData);
//         setContactError("");
//     } catch (error) {
//       alert("Error submitting registration.");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   // Logic to check if a member slot is "fully filled"
//   // Added contactNumber check here to unlock Member 2
//   const isFilled = (num) => {
//     if (num === 1) return (
//       formData.teamLeader.trim() !== "" && 
//       formData.email.trim() !== "" && 
//       formData.contactNumber.length === 10
//     );
//     return formData[`member${num}Name`].trim() !== "" && formData[`member${num}Email`].trim() !== "";
//   };

//   return (
//     <div className="math-page-wrapper">
//       <div className="math-hero-section">
//         <h1 className="math-glitch-title">MATHEMANIA 2026</h1>
//         <div className="math-date-tag">Date: 25th Jan 2026</div>
//       </div>

//       <div className="math-content-grid">
//         <div className="math-info-pane">
//           <div className="math-glass-card">
//             <h2 className="math-card-heading">Rules & Conduct</h2>
//             <div className="math-rule-box">
//               <ul>
//                 <li><strong>Online Test:</strong> Strictly proctored. AI tools and external assistance are strictly prohibited.</li>
//                 <li><strong>Collaboration:</strong> Allowed within your registered team only.</li>
//                 <li><strong>Format:</strong> Subjective problems focused on mathematical proofs and logical reasoning.</li>
//               </ul>
//             </div>
//           </div>
//         </div>

//         <div className="math-form-pane">
//           <form className="math-glass-card math-form" onSubmit={handleSubmit}>
//             <h2 className="math-card-heading">Team Registration</h2>
            
//             <div className="math-row">
//               <div className="math-input-group">
//                 <label>Team Name*</label>
//                 <input name="teamName" required value={formData.teamName} onChange={handleChange} />
//               </div>
//               <div className="math-input-group">
//                 <label>Institute*</label>
//                 <input name="institute" required value={formData.institute} onChange={handleChange} />
//               </div>
//             </div>

//             <div className="math-row">
//               <div className="math-input-group">
//                 <label>Leader Name*</label>
//                 <input name="teamLeader" required value={formData.teamLeader} onChange={handleChange} />
//               </div>
//               <div className="math-input-group">
//                 <label>Leader Email*</label>
//                 <input name="email" type="email" required value={formData.email} onChange={handleChange} />
//               </div>
//             </div>

//             <div className="math-input-group">
//               <label>Contact Number*</label>
//               <input 
//                 name="contactNumber" 
//                 type="tel"
//                 placeholder="10-digit mobile number"
//                 required 
//                 value={formData.contactNumber} 
//                 onChange={handleChange} 
//               />
//               {contactError && <span className="math-err-txt">{contactError}</span>}
//             </div>

//             <hr className="math-divider" />

//             {/* Member 2: Depends on Leader Info + Contact Number */}
//             <div className={`math-row ${!isFilled(1) ? "field-locked" : ""}`}>
//               <div className="math-input-group">
//                 <label>Member 2 Name (Optional)</label>
//                 <input 
//                   name="member2Name" 
//                   disabled={!isFilled(1)}
//                   value={formData.member2Name} 
//                   onChange={handleChange} 
//                 />
//               </div>
//               <div className="math-input-group">
//                 <label>Member 2 Email {formData.member2Name && <span className="req-star">*</span>}</label>
//                 <input 
//                   name="member2Email" 
//                   type="email" 
//                   disabled={!isFilled(1)}
//                   required={!!formData.member2Name} 
//                   value={formData.member2Email} 
//                   onChange={handleChange} 
//                 />
//               </div>
//             </div>

//             {/* Member 3: Only enabled if Member 2 is fully filled */}
//             <div className={`math-row ${!isFilled(2) ? "field-locked" : ""}`}>
//               <div className="math-input-group">
//                 <label>Member 3 Name</label>
//                 <input 
//                   name="member3Name" 
//                   disabled={!isFilled(2)} 
//                   value={formData.member3Name} 
//                   onChange={handleChange} 
//                   placeholder={!isFilled(2) ? "Complete Member 2" : ""}
//                 />
//               </div>
//               <div className="math-input-group">
//                 <label>Member 3 Email {formData.member3Name && <span className="req-star">*</span>}</label>
//                 <input 
//                   name="member3Email" 
//                   type="email" 
//                   disabled={!isFilled(2)} 
//                   required={!!formData.member3Name} 
//                   value={formData.member3Email} 
//                   onChange={handleChange} 
//                 />
//               </div>
//             </div>

//             {/* Member 4: Only enabled if Member 3 is fully filled */}
//             <div className={`math-row ${!isFilled(3) ? "field-locked" : ""}`}>
//               <div className="math-input-group">
//                 <label>Member 4 Name</label>
//                 <input 
//                   name="member4Name" 
//                   disabled={!isFilled(3)} 
//                   value={formData.member4Name} 
//                   onChange={handleChange} 
//                   placeholder={!isFilled(3) ? "Complete Member 3" : ""}
//                 />
//               </div>
//               <div className="math-input-group">
//                 <label>Member 4 Email {formData.member4Name && <span className="req-star">*</span>}</label>
//                 <input 
//                   name="member4Email" 
//                   type="email" 
//                   disabled={!isFilled(3)} 
//                   required={!!formData.member4Name} 
//                   value={formData.member4Email} 
//                   onChange={handleChange} 
//                 />
//               </div>
//             </div>

//             <button type="submit" className="math-submit-btn" disabled={submitting}>
//               {submitting ? "Submitting..." : "Register Now"}
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Mathemania;