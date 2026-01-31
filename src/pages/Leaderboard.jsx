import React, { useEffect, useState } from 'react';
import { quizService } from '../services/quizService';
import '../styles/pages/leaderboard.css';

const Leaderboard = () => {
  const [rankedTeams, setRankedTeams] = useState([]);
  const [activeRound, setActiveRound] = useState(2); // Defaults to Round 2 (Final)
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsProcessing(true);
        // Switch between Round 1 (leaderboard) and Round 2 (leaderboard_final)
        const data = activeRound === 2 
          ? await quizService.fetchFinalLeaderboard() 
          : await quizService.fetchLeaderboard();
        setRankedTeams(data || []);
      } catch (err) {
        console.error("UI Sync Error:", err.message);
        setRankedTeams([]);
      } finally {
        setIsProcessing(false);
      }
    };
    fetchData();
  }, [activeRound]);

  // Logic to extract styling from the 'position' text
  const getRowMetadata = (pos) => {
    if (activeRound !== 2 || !pos) return { medal: '', style: 'row-default' };
    const p = pos.toLowerCase();
    
    if (p.includes('gold')) return { medal: '🥇', style: 'row-gold' };
    if (p.includes('silver')) return { medal: '🥈', style: 'row-silver' };
    if (p.includes('bronze')) return { medal: '🥉', style: 'row-bronze' };
    if (p.includes('rejected')) return { medal: '🚫', style: 'row-rejected' };
    if (p.includes('distinction')) return { medal: '', style: 'row-distinction' };
    
    return { medal: '', style: 'row-participation' };
  };

  return (
    <div className="board-wrapper">
      {/* Top-Right Toggle: Sober and Non-Intrusive */}
      <div className="round-switcher">
        <button 
          className={activeRound === 2 ? 'btn-active' : ''} 
          onClick={() => setActiveRound(2)}
        >
          Finals
        </button>
        <button 
          className={activeRound === 1 ? 'btn-active' : ''} 
          onClick={() => setActiveRound(1)}
        >
          Round 1
        </button>
      </div>

      <h1 className="board-title">
        MATHEMANIA: {activeRound === 2 ? 'FINAL RESULTS' : 'ROUND 1'}
      </h1>

      {isProcessing ? (
        <div className="board-loader">Syncing rankings...</div>
      ) : rankedTeams.length === 0 ? (
        <div className="board-empty">No records found for Round {activeRound}.</div>
      ) : (
        <div className="table-viewport">
          <table className="board-table">
            <thead>
              <tr>
                <th>RANK</th>
                <th>TEAM NAME</th>
                <th>INSTITUTE</th>
                <th>{activeRound === 2 ? 'TOTAL' : 'SCORE'}</th>
              </tr>
            </thead>
            <tbody>
              {rankedTeams.map((team, idx) => {
                const { medal, style } = getRowMetadata(team.position);
                return (
                  <tr key={team.team_name} className={style}>
                    <td className="rank-cell">
                      <span className="medal-icon">{medal}</span>
                      {activeRound === 2 ? (team.position || idx + 1) : (idx + 1)}
                    </td>
                    <td className="team-cell">{team.team_name}</td>
                    <td className="inst-col">
                      {/* Handles differing column names between rounds */}
                      {team.institute || team.college || '—'}
                    </td>
                    <td className="score-cell">
                      {activeRound === 2 ? team.total : team.score}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;