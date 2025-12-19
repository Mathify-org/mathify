import { supabase } from '@/integrations/supabase/client';

export interface GameSession {
  gameId: string;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
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
  isUnlocked: boolean;
  unlockedAt?: string;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  displayName: string;
  highScore: number;
  totalXp: number;
  gamesPlayed: number;
}

// XP calculation based on performance
export const calculateXP = (session: GameSession): number => {
  const baseXP = 10;
  const accuracyBonus = session.totalQuestions > 0 
    ? Math.round((session.correctAnswers / session.totalQuestions) * 50) 
    : 0;
  const scoreBonus = Math.round(session.score * 0.1);
  const difficultyMultiplier = session.difficulty === 'hard' ? 1.5 : session.difficulty === 'medium' ? 1.2 : 1;
  
  return Math.round((baseXP + accuracyBonus + scoreBonus) * difficultyMultiplier);
};

// Level calculation (each level requires progressively more XP)
export const calculateLevel = (totalXp: number): number => {
  // Level formula: level = floor(sqrt(totalXp / 100)) + 1
  return Math.floor(Math.sqrt(totalXp / 100)) + 1;
};

export const xpForLevel = (level: number): number => {
  // XP required to reach a level
  return (level - 1) * (level - 1) * 100;
};

export const xpForNextLevel = (currentXp: number): { current: number; required: number; progress: number } => {
  const currentLevel = calculateLevel(currentXp);
  const currentLevelXp = xpForLevel(currentLevel);
  const nextLevelXp = xpForLevel(currentLevel + 1);
  const xpInCurrentLevel = currentXp - currentLevelXp;
  const xpNeededForNext = nextLevelXp - currentLevelXp;
  
  return {
    current: xpInCurrentLevel,
    required: xpNeededForNext,
    progress: (xpInCurrentLevel / xpNeededForNext) * 100
  };
};

// Save a game session
export const saveGameSession = async (userId: string, session: GameSession): Promise<{ xpEarned: number; newAchievements: Achievement[] }> => {
  const xpEarned = calculateXP(session);
  const accuracy = session.totalQuestions > 0 
    ? Math.round((session.correctAnswers / session.totalQuestions) * 100) 
    : 0;

  // Save game session
  await supabase.from('game_sessions').insert({
    user_id: userId,
    game_id: session.gameId,
    score: session.score,
    correct_answers: session.correctAnswers,
    total_questions: session.totalQuestions,
    time_spent_seconds: session.timeSpentSeconds || null,
    difficulty: session.difficulty || null,
    accuracy,
    xp_earned: xpEarned
  });

  // Update user progress
  const { data: existingProgress } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', userId)
    .single();

  const today = new Date().toISOString().split('T')[0];
  const lastActivity = existingProgress?.last_activity_date;
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  
  let newStreak = 1;
  if (existingProgress) {
    if (lastActivity === today) {
      newStreak = existingProgress.current_streak;
    } else if (lastActivity === yesterday) {
      newStreak = existingProgress.current_streak + 1;
    }
  }

  const uniqueGames = existingProgress?.unique_games_played || [];
  if (!uniqueGames.includes(session.gameId)) {
    uniqueGames.push(session.gameId);
  }

  if (existingProgress) {
    await supabase
      .from('user_progress')
      .update({
        total_xp: existingProgress.total_xp + xpEarned,
        current_level: calculateLevel(existingProgress.total_xp + xpEarned),
        games_played: existingProgress.games_played + 1,
        total_correct_answers: existingProgress.total_correct_answers + session.correctAnswers,
        total_questions_answered: existingProgress.total_questions_answered + session.totalQuestions,
        current_streak: newStreak,
        longest_streak: Math.max(existingProgress.longest_streak, newStreak),
        last_activity_date: today,
        unique_games_played: uniqueGames,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId);
  } else {
    await supabase
      .from('user_progress')
      .insert({
        user_id: userId,
        total_xp: xpEarned,
        current_level: calculateLevel(xpEarned),
        games_played: 1,
        total_correct_answers: session.correctAnswers,
        total_questions_answered: session.totalQuestions,
        current_streak: 1,
        longest_streak: 1,
        last_activity_date: today,
        unique_games_played: [session.gameId]
      });
  }

  // Update leaderboard
  await updateLeaderboard(userId, session.gameId, session.score, xpEarned);

  // Check for new achievements
  const newAchievements = await checkAndUnlockAchievements(userId);

  return { xpEarned, newAchievements };
};

// Update leaderboard entries
const updateLeaderboard = async (userId: string, gameId: string, score: number, xpEarned: number) => {
  const weekStart = getWeekStart();
  const periods = ['daily', 'weekly', 'all_time'];
  
  for (const period of periods) {
    const periodStart = period === 'daily' 
      ? new Date().toISOString().split('T')[0]
      : period === 'weekly' 
        ? weekStart 
        : '2020-01-01';

    const { data: existing } = await supabase
      .from('leaderboard_entries')
      .select('*')
      .eq('user_id', userId)
      .eq('game_id', gameId)
      .eq('period_type', period)
      .eq('period_start', periodStart)
      .single();

    if (existing) {
      await supabase
        .from('leaderboard_entries')
        .update({
          high_score: Math.max(existing.high_score, score),
          total_xp: existing.total_xp + xpEarned,
          games_played: existing.games_played + 1,
          updated_at: new Date().toISOString()
        })
        .eq('id', existing.id);
    } else {
      await supabase
        .from('leaderboard_entries')
        .insert({
          user_id: userId,
          game_id: gameId,
          period_type: period,
          period_start: periodStart,
          high_score: score,
          total_xp: xpEarned,
          games_played: 1
        });
    }
  }
};

const getWeekStart = (): string => {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(now.setDate(diff));
  return monday.toISOString().split('T')[0];
};

// Check and unlock achievements
const checkAndUnlockAchievements = async (userId: string): Promise<Achievement[]> => {
  const { data: progress } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (!progress) return [];

  const { data: allAchievements } = await supabase
    .from('achievements')
    .select('*');

  const { data: unlockedIds } = await supabase
    .from('user_achievements')
    .select('achievement_id')
    .eq('user_id', userId);

  const unlockedSet = new Set(unlockedIds?.map(u => u.achievement_id) || []);
  const newlyUnlocked: Achievement[] = [];

  for (const achievement of allAchievements || []) {
    if (unlockedSet.has(achievement.id)) continue;

    let shouldUnlock = false;
    const value = achievement.requirement_value;

    switch (achievement.requirement_type) {
      case 'games_played':
        shouldUnlock = progress.games_played >= value;
        break;
      case 'total_xp':
        shouldUnlock = progress.total_xp >= value;
        break;
      case 'streak':
        shouldUnlock = progress.current_streak >= value;
        break;
      case 'correct_answers':
        shouldUnlock = progress.total_correct_answers >= value;
        break;
      case 'unique_games':
        shouldUnlock = (progress.unique_games_played?.length || 0) >= value;
        break;
      case 'level':
        shouldUnlock = progress.current_level >= value;
        break;
    }

    if (shouldUnlock) {
      await supabase.from('user_achievements').insert({
        user_id: userId,
        achievement_id: achievement.id
      });

      // Award XP for achievement
      await supabase
        .from('user_progress')
        .update({ 
          total_xp: progress.total_xp + achievement.xp_reward,
          current_level: calculateLevel(progress.total_xp + achievement.xp_reward)
        })
        .eq('user_id', userId);

      newlyUnlocked.push({
        ...achievement,
        requirementType: achievement.requirement_type,
        requirementValue: achievement.requirement_value,
        xpReward: achievement.xp_reward,
        isUnlocked: true,
        unlockedAt: new Date().toISOString()
      });
    }
  }

  return newlyUnlocked;
};

// Get user progress
export const getUserProgress = async (userId: string): Promise<UserProgress | null> => {
  const { data, error } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error || !data) return null;

  return {
    totalXp: data.total_xp,
    currentLevel: data.current_level,
    gamesPlayed: data.games_played,
    totalCorrectAnswers: data.total_correct_answers,
    totalQuestionsAnswered: data.total_questions_answered,
    currentStreak: data.current_streak,
    longestStreak: data.longest_streak,
    lastActivityDate: data.last_activity_date,
    uniqueGamesPlayed: data.unique_games_played || []
  };
};

// Get user achievements
export const getUserAchievements = async (userId: string): Promise<Achievement[]> => {
  const { data: allAchievements } = await supabase
    .from('achievements')
    .select('*');

  const { data: userAchievements } = await supabase
    .from('user_achievements')
    .select('achievement_id, unlocked_at')
    .eq('user_id', userId);

  const unlockedMap = new Map(userAchievements?.map(u => [u.achievement_id, u.unlocked_at]) || []);

  return (allAchievements || []).map(a => ({
    id: a.id,
    name: a.name,
    description: a.description,
    icon: a.icon,
    category: a.category,
    requirementType: a.requirement_type,
    requirementValue: a.requirement_value,
    xpReward: a.xp_reward,
    isUnlocked: unlockedMap.has(a.id),
    unlockedAt: unlockedMap.get(a.id)
  }));
};

// Get leaderboard
export const getLeaderboard = async (
  gameId: string, 
  periodType: 'daily' | 'weekly' | 'all_time' = 'all_time',
  limit: number = 10
): Promise<LeaderboardEntry[]> => {
  const periodStart = periodType === 'daily'
    ? new Date().toISOString().split('T')[0]
    : periodType === 'weekly'
      ? getWeekStart()
      : '2020-01-01';

  const { data } = await supabase
    .from('leaderboard_entries')
    .select('user_id, high_score, total_xp, games_played')
    .eq('game_id', gameId)
    .eq('period_type', periodType)
    .eq('period_start', periodStart)
    .order('high_score', { ascending: false })
    .limit(limit);

  if (!data) return [];

  // Get display names
  const userIds = data.map(d => d.user_id);
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, display_name, first_name')
    .in('id', userIds);

  const profileMap = new Map(profiles?.map(p => [p.id, p.display_name || p.first_name || 'Anonymous']) || []);

  return data.map((entry, index) => ({
    rank: index + 1,
    userId: entry.user_id,
    displayName: profileMap.get(entry.user_id) || 'Player',
    highScore: entry.high_score,
    totalXp: entry.total_xp,
    gamesPlayed: entry.games_played
  }));
};

// Get recent games for a user
export const getRecentGames = async (userId: string, limit: number = 10) => {
  const { data } = await supabase
    .from('game_sessions')
    .select('*')
    .eq('user_id', userId)
    .order('completed_at', { ascending: false })
    .limit(limit);

  return data || [];
};
