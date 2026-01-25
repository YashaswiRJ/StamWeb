import React, { useState, useEffect } from "react";
import { quizService } from "../services/quizService";
import "../styles/pages/mathemania.css";
import "../styles/pages/math-quiz.css";

export default function MathQuiz() {
  const [uniqueCode, setUniqueCode] = useState("");
  const [userAnswers, setUserAnswers] = useState(() => {
    const saved = localStorage.getItem("mathemania_progress");
    return saved ? JSON.parse(saved) : {};
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: '', msg: '' });

  // Persist progress to local storage
  useEffect(() => {
    localStorage.setItem("mathemania_progress", JSON.stringify(userAnswers));
  }, [userAnswers]);

  // Logic for Multiple Select Questions (1-17)
  const handleToggleOption = (qId, option) => {
    setUserAnswers(prev => {
      const currentAnswers = Array.isArray(prev[qId]) ? prev[qId] : [];
      if (currentAnswers.includes(option)) {
        return { ...prev, [qId]: currentAnswers.filter(item => item !== option) };
      } else {
        return { ...prev, [qId]: [...currentAnswers, option].sort() };
      }
    });
  };

  // Logic for Integer Type Questions (18-20)
  const handleIntegerChange = (qId, value) => {
    setUserAnswers(prev => ({
      ...prev,
      [qId]: value // Store as a direct string/number
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: '', msg: '' });

    try {
      // 1. Verify code and check for duplicate submission in leaderboard
      const team = await quizService.verifyTeamStatus(uniqueCode);

      // 2. Submit raw responses
      await quizService.submitResponse(team.team_name, team.institute, userAnswers);

      localStorage.removeItem("mathemania_progress");
      alert("Round 1 Submission Successful!");
      window.location.href = "/leaderboard";
      
    } catch (err) {
      setStatus({ type: 'error', msg: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <h1 className="glitch-title">MATHEMANIA 2025</h1>
        <div className="save-indicator">
          <span className="pulse-dot"></span> Progress Auto-Saving
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Render 20 Questions Total */}
        {[...Array(20)].map((_, i) => {
          const qId = i + 1;
          const isIntegerType = qId > 17; // Q18, Q19, Q20 are integers
          const currentAnswer = userAnswers[qId];

          return (
            <div key={qId} className="question-card">
              <div className="q-circle">{qId}</div>
              <div className="q-header-flex">
                <h3>Question {qId}</h3>
                <span className={`type-badge ${isIntegerType ? 'int-badge' : 'msq-badge'}`}>
                  {isIntegerType ? "Integer Answer" : "Multiple Correct Possible"}
                </span>
              </div>
              
              <div className="options-container">
                {isIntegerType ? (
                  /* Integer Input Field */
                  <div className="integer-input-wrapper">
                    <input 
                      type="number" 
                      className="math-integer-input"
                      value={currentAnswer || ""}
                      onChange={(e) => handleIntegerChange(qId, e.target.value)}
                      placeholder="Enter numerical value..."
                    />
                  </div>
                ) : (
                  /* MSQ Grid Buttons */
                  <div className="options-grid">
                    {['A', 'B', 'C', 'D'].map(opt => {
                      const isSelected = Array.isArray(currentAnswer) && currentAnswer.includes(opt);
                      return (
                        <button 
                          type="button"
                          key={opt}
                          onClick={() => handleToggleOption(qId, opt)}
                          className={`option-btn ${isSelected ? "selected" : ""}`}
                        >
                          <div className={`checkbox ${isSelected ? "checked" : ""}`}>
                            {isSelected && "✓"}
                          </div>
                          <span className="opt-char">{opt}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        <div className="submission-gate-container">
          <div className="submission-divider">
            <span>End of Examination</span>
          </div>

          <div className="auth-card submission-card">
            <div className="submission-header">
              <h2 className="submit-title">ROUND 1 SUBMISSION</h2>
              <p>Enter your team's unique code to finalize your responses.</p>
            </div>

            <div className="input-group">
              <input 
                type="text" 
                className="code-input"
                value={uniqueCode} 
                onChange={(e) => setUniqueCode(e.target.value.toUpperCase())}
                placeholder="e.g. 1MA0DLLFX"
                required
              />
              <label className="input-label">Unique Team Code</label>
            </div>
            
            {status.msg && (
              <div className={`status-message ${status.type}`}>
                {status.type === 'error' ? '❌' : '✅'} {status.msg}
              </div>
            )}

            <button 
              type="submit" 
              className="math-submit-btn" 
              disabled={isSubmitting}
            >
              {isSubmitting ? "Verifying..." : "SUBMIT ALL RESPONSES"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
