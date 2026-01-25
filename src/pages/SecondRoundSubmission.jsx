import React, { useState } from 'react';
// import { supabase, quizService } from './quizService';
// import { createClient } from '@supabase/supabase-js';
import { supabase, quizService } from "../services/quizService";
// import { quizService } from "../services/quizService";
import '../styles/pages/SecondRoundSubmission.css'

const SecondRoundSubmission = () => {
  const [uniqueCode, setUniqueCode] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState({ type: '', msg: '' });

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setStatus({ type: '', msg: '' });
    } else {
      setStatus({ type: 'error', msg: 'Please select a valid PDF file.' });
      setFile(null);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !uniqueCode) return;

    setUploading(true);
    setStatus({ type: 'info', msg: 'Verifying credentials...' });

    try {
      // 1. Verify Team using unique code from mathemania_registrations
      const team = await quizService.verifyTeamStatus(uniqueCode);

      setStatus({ type: 'info', msg: `Uploading ${team.team_name}'s solution...` });

      // 2. Upload to Supabase Storage bucket 'solutions'
      const fileExt = file.name.split('.').pop();
      const fileName = `round2/${team.team_name.replace(/\s+/g, '_')}_${Date.now()}.${fileExt}`;
      
      const { error: storageError } = await supabase.storage
        .from('solutions')
        .upload(fileName, file);

      if (storageError) throw storageError;

      // 3. Get the URL and store in the new round_2_submissions table
      const { data: { publicUrl } } = supabase.storage.from('solutions').getPublicUrl(fileName);

      const { error: dbError } = await supabase
        .from('round_2_submissions')
        .insert([{
          team_name: team.team_name,
          institute: team.institute,
          file_path: fileName,
          file_url: publicUrl
        }]);

      if (dbError) throw dbError;

      setStatus({ type: 'success', msg: `Submission Successful for ${team.team_name}!` });
      setFile(null);
      setUniqueCode('');
    } catch (err) {
      setStatus({ type: 'error', msg: err.message });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="math-dark-container">
      <div className="auth-card submission-card">
        <h1 className="glitch-title">Round 2</h1>
        <p className="submission-subtitle">Subjective Solution Upload</p>
        
        <form onSubmit={handleUpload}>
          <div className="input-group">
            <span className="input-label">Unique Code</span>
            <input 
              className="code-input"
              type="text" 
              value={uniqueCode}
              onChange={(e) => setUniqueCode(e.target.value)}
              placeholder="Ex: MATH-XXXX"
              required
            />
          </div>

          <div className={`file-drop-zone ${file ? 'file-selected' : ''}`}>
            <input 
              type="file" 
              id="file-upload"
              accept="application/pdf" 
              onChange={handleFileChange}
              hidden
            />
            <label htmlFor="file-upload" className="file-label">
              {file ? `📄 ${file.name}` : "Drop your PDF here or Click to Browse"}
            </label>
          </div>

          <button 
            type="submit" 
            className="math-submit-btn"
            disabled={!file || !uniqueCode || uploading}
          >
            {uploading ? 'Processing...' : 'Upload Solution'}
          </button>
        </form>

        {status.msg && (
          <div className={`status-message ${status.type}`}>
            {status.msg}
          </div>
        )}
      </div>
    </div>
  );
};

export default SecondRoundSubmission;