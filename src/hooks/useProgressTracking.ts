import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  saveGameSession, 
  getUserProgress, 
  getUserAchievements,
  getLeaderboard,
  getRecentGames,
  type GameSession,
  type UserProgress,
  type Achievement,
  type LeaderboardEntry
} from '@/services/progressService';
import { useQuery } from '@tanstack/react-query';

export const useProgressTracking = () => {
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);

  const saveProgress = useCallback(async (session: GameSession) => {
    if (!user) return null;
    
    setIsSaving(true);
    try {
      const result = await saveGameSession(user.id, session);
      return result;
    } catch (error) {
      console.error('Failed to save progress:', error);
      return null;
    } finally {
      setIsSaving(false);
    }
  }, [user]);

  return { saveProgress, isSaving, isAuthenticated: !!user };
};

export const useUserProgress = () => {
  const { user } = useAuth();

  return useQuery<UserProgress | null>({
    queryKey: ['userProgress', user?.id],
    queryFn: () => user ? getUserProgress(user.id) : null,
    enabled: !!user,
    staleTime: 30000,
  });
};

export const useUserAchievements = () => {
  const { user } = useAuth();

  return useQuery<Achievement[]>({
    queryKey: ['userAchievements', user?.id],
    queryFn: () => user ? getUserAchievements(user.id) : [],
    enabled: !!user,
    staleTime: 30000,
  });
};

export const useLeaderboard = (
  gameId: string, 
  periodType: 'daily' | 'weekly' | 'all_time' = 'all_time'
) => {
  return useQuery<LeaderboardEntry[]>({
    queryKey: ['leaderboard', gameId, periodType],
    queryFn: () => getLeaderboard(gameId, periodType),
    staleTime: 60000,
  });
};

export const useRecentGames = (limit: number = 10) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['recentGames', user?.id, limit],
    queryFn: () => user ? getRecentGames(user.id, limit) : [],
    enabled: !!user,
    staleTime: 30000,
  });
};
