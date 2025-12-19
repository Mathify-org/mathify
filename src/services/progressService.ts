import { supabase } from '@/integrations/supabase/client';

export interface GameSessionData {
  gameId: string;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  accuracy?: number;
  timeSpentSeconds?: number;
  difficulty?: string;
}

export interface UserProgress {
  totalXp: number;
  currentLevel: number;
  gamesPlayed: number;
  totalCorrectAnswers: number;
  totalQuestionsAnswered: number;
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string | null;
  uniqueGamesPlayed: string[];
  lastPlayedGames: Array<{ gameId: string; playedAt: string; score: number }>;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  requirementType: string;
  requirementValue: number;
  xpReward: number;
  unlockedAt?: string;
}

const LOCAL_STORAGE_KEY = 'mathify_progress';
const LOCAL_SESSIONS_KEY = 'mathify_sessions';

// Calculate level from XP (Level 1: 0-99, Level 2: 100-399, Level 3: 400-899, etc.)
export const calculateLevel = (xp: number): number => {
  return Math.max(1, Math.floor(Math.sqrt(xp / 100)) + 1);
};

// Calculate XP needed for next level
export const xpForNextLevel = (level: number): number => {
  return level * level * 100;
};

// Calculate XP progress within current level
export const getLevelProgress = (xp: number): { current: number; needed: number; percentage: number } => {
  const level = calculateLevel(xp);
  const currentLevelXp = (level - 1) * (level - 1) * 100;
  const nextLevelXp = level * level * 100;
  const current = xp - currentLevelXp;
  const needed = nextLevelXp - currentLevelXp;
  return {
    current,
    needed,
    percentage: Math.min(100, (current / needed) * 100)
  };
};

// Calculate XP earned from a game session
export const calculateXpEarned = (session: GameSessionData): number => {
  const baseXp = session.correctAnswers * 10;
  const accuracyBonus = session.accuracy && session.accuracy >= 80 ? Math.floor(baseXp * 0.2) : 0;
  const completionBonus = session.totalQuestions >= 10 ? 25 : 0;
  return baseXp + accuracyBonus + completionBonus;
};

// Get default progress
const getDefaultProgress = (): UserProgress => ({
  totalXp: 0,
  currentLevel: 1,
  gamesPlayed: 0,
  totalCorrectAnswers: 0,
  totalQuestionsAnswered: 0,
  currentStreak: 0,
  longestStreak: 0,
  lastActivityDate: null,
  uniqueGamesPlayed: [],
  lastPlayedGames: []
});

// Check if streak should continue or reset
const calculateStreak = (lastActivityDate: string | null, currentStreak: number): number => {
  if (!lastActivityDate) return 1;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const lastActivity = new Date(lastActivityDate);
  lastActivity.setHours(0, 0, 0, 0);
  
  const diffDays = Math.floor((today.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return currentStreak; // Same day, keep streak
  if (diffDays === 1) return currentStreak + 1; // Consecutive day, increment
  return 1; // Streak broken, reset to 1
};

export const progressService = {
  // Get progress - from Supabase if logged in, localStorage if not
  getProgress: async (userId: string | null): Promise<UserProgress> => {
    if (userId) {
      try {
        const { data, error } = await supabase
          .from('user_progress')
          .select('*')
          .eq('user_id', userId)
          .single();
        
        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching progress:', error);
        }
        
        if (data) {
          return {
            totalXp: data.total_xp,
            currentLevel: data.current_level,
            gamesPlayed: data.games_played,
            totalCorrectAnswers: data.total_correct_answers,
            totalQuestionsAnswered: data.total_questions_answered,
            currentStreak: data.current_streak,
            longestStreak: data.longest_streak,
            lastActivityDate: data.last_activity_date,
            uniqueGamesPlayed: data.unique_games_played || [],
            lastPlayedGames: (data.last_played_games as any[]) || []
          };
        }
      } catch (err) {
        console.error('Error in getProgress:', err);
      }
    }
    
    // Fall back to localStorage
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    return stored ? JSON.parse(stored) : getDefaultProgress();
  },

  // Save game session and update progress
  saveGameSession: async (userId: string | null, session: GameSessionData): Promise<{ xpEarned: number; newAchievements: Achievement[] }> => {
    const xpEarned = calculateXpEarned(session);
    const today = new Date().toISOString().split('T')[0];
    const newAchievements: Achievement[] = [];
    
    if (userId) {
      try {
        // Save game session
        const { error: sessionError } = await supabase
          .from('game_sessions')
          .insert({
            user_id: userId,
            game_id: session.gameId,
            score: session.score,
            correct_answers: session.correctAnswers,
            total_questions: session.totalQuestions,
            accuracy: session.accuracy,
            time_spent_seconds: session.timeSpentSeconds,
            difficulty: session.difficulty,
            xp_earned: xpEarned
          });
        
        if (sessionError) console.error('Error saving session:', sessionError);
        
        // Get current progress
        const { data: currentProgress } = await supabase
          .from('user_progress')
          .select('*')
          .eq('user_id', userId)
          .single();
        
        const newStreak = calculateStreak(
          currentProgress?.last_activity_date,
          currentProgress?.current_streak || 0
        );
        
        const uniqueGames = currentProgress?.unique_games_played || [];
        if (!uniqueGames.includes(session.gameId)) {
          uniqueGames.push(session.gameId);
        }
        
        const lastPlayedGames = (currentProgress?.last_played_games as any[]) || [];
        lastPlayedGames.unshift({ gameId: session.gameId, playedAt: new Date().toISOString(), score: session.score });
        if (lastPlayedGames.length > 10) lastPlayedGames.pop();
        
        const newTotalXp = (currentProgress?.total_xp || 0) + xpEarned;
        const newLevel = calculateLevel(newTotalXp);
        
        // Upsert progress
        const { error: progressError } = await supabase
          .from('user_progress')
          .upsert({
            user_id: userId,
            total_xp: newTotalXp,
            current_level: newLevel,
            games_played: (currentProgress?.games_played || 0) + 1,
            total_correct_answers: (currentProgress?.total_correct_answers || 0) + session.correctAnswers,
            total_questions_answered: (currentProgress?.total_questions_answered || 0) + session.totalQuestions,
            current_streak: newStreak,
            longest_streak: Math.max(currentProgress?.longest_streak || 0, newStreak),
            last_activity_date: today,
            unique_games_played: uniqueGames,
            last_played_games: lastPlayedGames
          }, { onConflict: 'user_id' });
        
        if (progressError) console.error('Error updating progress:', progressError);
        
        // Check for new achievements
        const earnedAchievements = await progressService.checkAchievements(userId, {
          totalXp: newTotalXp,
          gamesPlayed: (currentProgress?.games_played || 0) + 1,
          totalCorrectAnswers: (currentProgress?.total_correct_answers || 0) + session.correctAnswers,
          currentStreak: newStreak,
          uniqueGamesPlayed: uniqueGames,
          currentLevel: newLevel,
          accuracy: session.accuracy
        });
        
        newAchievements.push(...earnedAchievements);
        
      } catch (err) {
        console.error('Error in saveGameSession:', err);
      }
    } else {
      // Save to localStorage
      const progress = await progressService.getProgress(null);
      const newStreak = calculateStreak(progress.lastActivityDate, progress.currentStreak);
      
      const uniqueGames = [...progress.uniqueGamesPlayed];
      if (!uniqueGames.includes(session.gameId)) {
        uniqueGames.push(session.gameId);
      }
      
      const lastPlayedGames = [...progress.lastPlayedGames];
      lastPlayedGames.unshift({ gameId: session.gameId, playedAt: new Date().toISOString(), score: session.score });
      if (lastPlayedGames.length > 10) lastPlayedGames.pop();
      
      const newTotalXp = progress.totalXp + xpEarned;
      
      const updatedProgress: UserProgress = {
        ...progress,
        totalXp: newTotalXp,
        currentLevel: calculateLevel(newTotalXp),
        gamesPlayed: progress.gamesPlayed + 1,
        totalCorrectAnswers: progress.totalCorrectAnswers + session.correctAnswers,
        totalQuestionsAnswered: progress.totalQuestionsAnswered + session.totalQuestions,
        currentStreak: newStreak,
        longestStreak: Math.max(progress.longestStreak, newStreak),
        lastActivityDate: today,
        uniqueGamesPlayed: uniqueGames,
        lastPlayedGames
      };
      
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedProgress));
      
      // Store sessions locally too
      const sessions = JSON.parse(localStorage.getItem(LOCAL_SESSIONS_KEY) || '[]');
      sessions.push({ ...session, xpEarned, completedAt: new Date().toISOString() });
      localStorage.setItem(LOCAL_SESSIONS_KEY, JSON.stringify(sessions.slice(-50)));
    }
    
    return { xpEarned, newAchievements };
  },

  // Check and award achievements
  checkAchievements: async (userId: string, stats: {
    totalXp?: number;
    gamesPlayed?: number;
    totalCorrectAnswers?: number;
    currentStreak?: number;
    uniqueGamesPlayed?: string[];
    currentLevel?: number;
    accuracy?: number;
  }): Promise<Achievement[]> => {
    const newlyUnlocked: Achievement[] = [];
    
    try {
      // Get all achievements
      const { data: allAchievements } = await supabase
        .from('achievements')
        .select('*');
      
      // Get user's unlocked achievements
      const { data: userAchievements } = await supabase
        .from('user_achievements')
        .select('achievement_id')
        .eq('user_id', userId);
      
      const unlockedIds = new Set(userAchievements?.map(a => a.achievement_id) || []);
      
      for (const achievement of allAchievements || []) {
        if (unlockedIds.has(achievement.id)) continue;
        
        let shouldUnlock = false;
        
        switch (achievement.requirement_type) {
          case 'total_xp':
            shouldUnlock = (stats.totalXp || 0) >= achievement.requirement_value;
            break;
          case 'games_played':
            shouldUnlock = (stats.gamesPlayed || 0) >= achievement.requirement_value;
            break;
          case 'correct_answers':
            shouldUnlock = (stats.totalCorrectAnswers || 0) >= achievement.requirement_value;
            break;
          case 'streak':
          case 'daily_streak':
            shouldUnlock = (stats.currentStreak || 0) >= achievement.requirement_value;
            break;
          case 'unique_games':
            shouldUnlock = (stats.uniqueGamesPlayed?.length || 0) >= achievement.requirement_value;
            break;
          case 'level':
            shouldUnlock = (stats.currentLevel || 1) >= achievement.requirement_value;
            break;
          case 'perfect_game':
            // Perfect game achievements are unlocked when accuracy is 100%
            shouldUnlock = (stats.accuracy || 0) === 100 && (stats.gamesPlayed || 0) >= achievement.requirement_value;
            break;
        }
        
        if (shouldUnlock) {
          const { error } = await supabase
            .from('user_achievements')
            .insert({
              user_id: userId,
              achievement_id: achievement.id
            });
          
          if (!error) {
            newlyUnlocked.push({
              id: achievement.id,
              name: achievement.name,
              description: achievement.description,
              icon: achievement.icon,
              category: achievement.category,
              requirementType: achievement.requirement_type,
              requirementValue: achievement.requirement_value,
              xpReward: achievement.xp_reward
            });
            
            // Award XP for achievement
            if (achievement.xp_reward > 0) {
              await supabase
                .from('user_progress')
                .update({ 
                  total_xp: (stats.totalXp || 0) + achievement.xp_reward 
                })
                .eq('user_id', userId);
            }
          }
        }
      }
    } catch (err) {
      console.error('Error checking achievements:', err);
    }
    
    return newlyUnlocked;
  },

  // Get user achievements
  getAchievements: async (userId: string | null): Promise<Achievement[]> => {
    if (!userId) return [];
    
    try {
      const { data } = await supabase
        .from('user_achievements')
        .select(`
          achievement_id,
          unlocked_at,
          achievements (*)
        `)
        .eq('user_id', userId);
      
      return (data || []).map((item: any) => ({
        id: item.achievements.id,
        name: item.achievements.name,
        description: item.achievements.description,
        icon: item.achievements.icon,
        category: item.achievements.category,
        requirementType: item.achievements.requirement_type,
        requirementValue: item.achievements.requirement_value,
        xpReward: item.achievements.xp_reward,
        unlockedAt: item.unlocked_at
      }));
    } catch (err) {
      console.error('Error getting achievements:', err);
      return [];
    }
  },

  // Get all achievements (for display)
  getAllAchievements: async (): Promise<Achievement[]> => {
    try {
      const { data } = await supabase
        .from('achievements')
        .select('*')
        .order('requirement_value', { ascending: true });
      
      return (data || []).map(a => ({
        id: a.id,
        name: a.name,
        description: a.description,
        icon: a.icon,
        category: a.category,
        requirementType: a.requirement_type,
        requirementValue: a.requirement_value,
        xpReward: a.xp_reward
      }));
    } catch (err) {
      console.error('Error getting all achievements:', err);
      return [];
    }
  },

  // Migrate localStorage data to Supabase when user signs in
  migrateLocalProgress: async (userId: string): Promise<void> => {
    const localProgress = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!localProgress) return;
    
    try {
      const progress: UserProgress = JSON.parse(localProgress);
      
      // Check if user already has progress
      const { data: existing } = await supabase
        .from('user_progress')
        .select('id')
        .eq('user_id', userId)
        .single();
      
      if (!existing) {
        // Migrate local progress to Supabase
        await supabase
          .from('user_progress')
          .insert({
            user_id: userId,
            total_xp: progress.totalXp,
            current_level: progress.currentLevel,
            games_played: progress.gamesPlayed,
            total_correct_answers: progress.totalCorrectAnswers,
            total_questions_answered: progress.totalQuestionsAnswered,
            current_streak: progress.currentStreak,
            longest_streak: progress.longestStreak,
            last_activity_date: progress.lastActivityDate,
            unique_games_played: progress.uniqueGamesPlayed,
            last_played_games: progress.lastPlayedGames
          });
        
        // Clear local storage after successful migration
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        localStorage.removeItem(LOCAL_SESSIONS_KEY);
      }
    } catch (err) {
      console.error('Error migrating progress:', err);
    }
  },

  // Get recent game sessions
  getRecentSessions: async (userId: string | null, limit: number = 10): Promise<any[]> => {
    if (userId) {
      try {
        const { data } = await supabase
          .from('game_sessions')
          .select('*')
          .eq('user_id', userId)
          .order('completed_at', { ascending: false })
          .limit(limit);
        
        return data || [];
      } catch (err) {
        console.error('Error getting recent sessions:', err);
      }
    }
    
    const sessions = JSON.parse(localStorage.getItem(LOCAL_SESSIONS_KEY) || '[]');
    return sessions.slice(0, limit);
  }
};
