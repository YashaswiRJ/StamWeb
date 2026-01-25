import React from "react";
import "../styles/pages/view-pdf.css"; // Import the new CSS

export default function ViewPdf() {
  // Your confirmed Cloudinary URL
  // const pdfUrl = "https://res.cloudinary.com/dxyopyus4/image/upload/v1769062913/__f1n5pu.pdf";

  // Round 1
  // const pdfUrl = "https://res.cloudinary.com/dxyopyus4/image/upload/v1769277232/_-2_s1ntmf.pdf";

  // Round 2
  // const pdfUrl = "https://res.cloudinary.com/dxyopyus4/image/upload/v1769277233/_-3_xvy8m8.pdf";

   // Objective Paper
   const pdfUrl = "https://res.cloudinary.com/dxyopyus4/image/upload/v1769324100/Mathemania_Obj_Full_fo463e.pdf";

  return (
    <div className="pdf-view-container">
      <div className="pdf-header">
        <h1 className="math-glitch-title" style={{ fontSize: '3rem', marginBottom: '10px' }}>
          Event Resources
        </h1>
        <p style={{ color: '#94a3b8' }}>Mathemania 2025 • Official Document Viewer</p>
      </div>

      <div className="pdf-viewer-card">
        <div className="pdf-toolbar">
          <span style={{ color: '#cbd5e1', fontWeight: '500' }}>
             📄 Mathemania Round 1.pdf
          </span>
          <a href={pdfUrl} download className="pdf-download-btn">
            <span>📥</span> Download Document
          </a>
        </div>

        <iframe 
          src={`${pdfUrl}#toolbar=0`}  // #toolbar=0 hides the internal browser UI for a cleaner look
          className="pdf-frame"
          title="Mathemania PDF Viewer"
        ></iframe>
      </div>
      
      <p style={{ marginTop: '20px', color: '#475569', fontSize: '0.8rem' }}>
        Stamatics IIT Kanpur 
      </p>
    </div>
  );
}