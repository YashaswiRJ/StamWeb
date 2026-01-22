// import React, { useState } from "react";
// import "../styles/pages/mathemania-admin.css";

// export default function ManUpload() {
//   const [file, setFile] = useState(null);
//   const [status, setStatus] = useState("");

//   const CLOUD_NAME = "dxyopyus4"; // From your screenshot
//   const UPLOAD_PRESET = "mathemania_preset"; // Get this from Settings

//   const handleUpload = async () => {
//     if (!file) return alert("Select a PDF first!");

//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("upload_preset", UPLOAD_PRESET);
//     formData.append("resource_type", "raw"); // Required for PDFs

//     setStatus("Uploading to Cloud...");

//     try {
//       const response = await fetch(
//         `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/raw/upload`,
//         { method: "POST", body: formData }
//       );

//       const data = await response.json();
      
//       if (data.secure_url) {
//         // Save this URL to localStorage so it's accessible in your View page
//         localStorage.setItem("mathemania_cloud_pdf", data.secure_url);
//         setStatus("✅ Uploaded! View it on the View PDF page.");
//         console.log("PDF URL:", data.secure_url);
//       }
//     } catch (err) {
//       console.error(err);
//       setStatus("❌ Upload failed.");
//     }
//   };

//   return (
//     <div className="mathemania-admin-page">
//       <div className="mathemania-admin-container">
//         <div className="mathemania-admin-card" style={{ maxWidth: "500px", margin: "0 auto" }}>
//           <h3 className="mathemania-admin-card-title">Mathemania PDF Publisher</h3>
//           <p className="mathemania-admin-card-desc">The PDF will be hosted on Cloudinary and viewable everywhere.</p>
          
//           <input 
//             type="file" 
//             accept="application/pdf" 
//             onChange={(e) => setFile(e.target.files[0])} 
//             className="mathemania-admin-file-input"
//           />
          
//           <button onClick={handleUpload} className="mathemania-admin-action-btn" style={{ width: "100%", marginTop: "20px" }}>
//             Publish to Cloud
//           </button>
          
//           <p style={{ color: "#94a3b8", fontSize: "0.8rem", marginTop: "15px", textAlign: "center" }}>{status}</p>
//         </div>
//       </div>
//     </div>
//   );
// }