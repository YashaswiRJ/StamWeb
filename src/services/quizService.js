import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xtcxaivsebyyswqognuf.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const supabase = createClient(supabaseUrl, supabaseKey);

export const quizService = {
  /**
   * Verification Logic
   * 1. Checks if code exists in registrations.
   * 2. Checks if team_name is already in the leaderboard.
   */
  verifyTeamStatus: async (code) => {
    // 1. Check registration table for the unique code to get the team name
    const { data: team, error: regError } = await supabase
      .from('mathemania_registrations')
      .select('team_name, institute')
      .eq('unique_code', code)
      .single();

    if (regError || !team) {
      throw new Error("Invalid Unique Code. Please check and try again.");
    }

    // 2. Check leaderboard table to see if this team_name has already submitted
    const { data: existing, error: leadError } = await supabase
      .from('leaderboard')
      .select('team_name')
      .eq('team_name', team.team_name)
      .maybeSingle();

    if (existing) {
      // If a record exists in the leaderboard, block the submission
      throw new Error(`Access Denied: Team "${team.team_name}" has already submitted.`);
    }

    return team; // Returns { team_name, institute }
  },

  submitResponse: async (teamName, college, responses) => {
    const { error } = await supabase
      .from('quiz_responses')
      .insert([{ 
        team_name: teamName, 
        institute: college, 
        answers: responses, 
        submitted_at: new Date().toISOString()
      }]);
    
    if (error) throw error;
  },

  getRawResponses: async () => {
    const { data, error } = await supabase.from('quiz_responses').select('*');
    if (error) throw error;
    return data;
  },

  saveToLeaderboard: async (teamName, totalMarks, collegeName, submittedAt) => {
    const { error } = await supabase
      .from('leaderboard')
      .upsert({ 
        team_name: teamName, 
        score: totalMarks, 
        college: collegeName ,
        updated_at: submittedAt
      }, { onConflict: 'team_name' });
    
    if (error) throw error;
  },

  fetchLeaderboard: async () => {
    const { data, error } = await supabase
      .from('leaderboard')
      .select('*')
      .order('score', { ascending: false })
      .order('updated_at', { ascending: true });
    if (error) throw error;
    return data;
  },
  // NEW: Fetch Round 2 Leaderboard
  fetchRound2Leaderboard: async () => {
    const { data, error } = await supabase
      .from('leaderboard_round2') // Ensure this table exists in Supabase
      .select('team_name, institute, total_marks')
      .order('total_marks', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  fetchFinalLeaderboard: async () => {
    const { data, error } = await supabase
      .from('leaderboard_final')
      .select('team_name, institute, total, position')
      .order('total', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  syncLeaderboard: async () => {
    // Calls the PostgreSQL function we just created
    const { error } = await supabase.rpc('calculate_team_scores');
    if (error) throw error;
    
    // Then fetch the sorted results
    return await quizService.fetchLeaderboard();
  }
};