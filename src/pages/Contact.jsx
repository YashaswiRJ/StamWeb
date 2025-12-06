// src/pages/Contact.jsx
import React, { useState } from "react";

function Contact() {
  // 1. State to hold the form data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  
  // 2. State to show "Sending..." or "Success" messages
  const [status, setStatus] = useState(""); 

  // 3. Handle typing in the inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 4. Handle the Submit button
  const handleSubmit = async (e) => {
    e.preventDefault(); // Stop the page from reloading
    setStatus("Sending...");

    // =========================================================
    // PASTE YOUR GOOGLE URL BELOW (Between the quotes)
    // =========================================================
    const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxSyz7fgt9fSn3lgMGnExv7I9sTAm8R7Eq_OmzF6uR8Gdd6zTr5gLPcu_XV4VH_xwHwqg/exec"; 

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors", // IMPORTANT: This bypasses browser security checks for Google
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      // Because of "no-cors", we won't get a standard JSON response,
      // so we assume if it didn't crash, it worked.
      setStatus("Message Sent! We will get back to you soon.");
      setFormData({ name: "", email: "", message: "" }); // Clear the form

    } catch (error) {
      console.error("Error:", error);
      setStatus("Failed to send. Please try again.");
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Contact Us</h1>
      <p style={styles.subHeader}>Have a question? Drop us a message!</p>

      <div style={styles.formCard}>
        <form onSubmit={handleSubmit} style={styles.form}>
          
          {/* Name Input */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              style={styles.input}
              placeholder="Your Name"
            />
          </div>

          {/* Email Input */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={styles.input}
              placeholder="your@email.com"
            />
          </div>

          {/* Message Input */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              style={{ ...styles.input, height: "120px" }}
              placeholder="How can we help?"
            />
          </div>

          <button type="submit" style={styles.button}>
            Send Message
          </button>

          {/* Status Message (Success/Error) */}
          {status && <p style={styles.status}>{status}</p>}
        </form>
      </div>
    </div>
  );
}

// Dark Theme Styles to match your site
const styles = {
  container: {
    padding: "80px 20px",
    maxWidth: "600px",
    margin: "0 auto",
    color: "white",
    textAlign: "center",
    minHeight: "100vh",
  },
  header: { fontSize: "3rem", marginBottom: "10px", fontWeight: "bold" },
  subHeader: { color: "#aaa", marginBottom: "40px", fontSize: "1.1rem" },
  formCard: {
    backgroundColor: "#111",
    padding: "30px",
    borderRadius: "15px",
    border: "1px solid #333",
  },
  form: { display: "flex", flexDirection: "column", gap: "20px" },
  inputGroup: { textAlign: "left" },
  label: { display: "block", marginBottom: "8px", color: "#ccc", fontSize: "0.9rem" },
  input: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#222",
    border: "1px solid #444",
    borderRadius: "8px",
    color: "white",
    fontSize: "1rem",
    outline: "none",
  },
  button: {
    padding: "14px",
    backgroundColor: "#4a90e2",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "1.1rem",
    cursor: "pointer",
    fontWeight: "bold",
    marginTop: "10px",
    transition: "background 0.3s",
  },
  status: { marginTop: "15px", color: "#4caf50", fontWeight: "bold" },
};

export default Contact;
