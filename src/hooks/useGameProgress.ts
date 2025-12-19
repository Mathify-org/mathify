import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { progressService, UserProgress, GameSessionData, Achievement, calculateLevel, getLevelProgress } from '@/services/progressService';

export const useGameProgress = () => {
  const { user } = useAuth();
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  const loadProgress = useCallback(async () => {
    setLoading(true);
    try {
      const data = await progressService.getProgress(user?.id || null);
      setProgress(data);
      
      if (user?.id) {
        const userAchievements = await progressService.getAchievements(user.id);
        setAchievements(userAchievements);
      }
    } catch (err) {
      console.error('Error loading progress:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  // Migrate local progress when user signs in
  useEffect(() => {
    if (user?.id) {
      progressService.migrateLocalProgress(user.id);
    }
  }, [user?.id]);

  const saveSession = useCallback(async (session: GameSessionData) => {
    const result = await progressService.saveGameSession(user?.id || null, session);
    await loadProgress(); // Refresh progress after saving
    return result;
  }, [user?.id, loadProgress]);

  const levelProgress = progress ? getLevelProgress(progress.totalXp) : { current: 0, needed: 100, percentage: 0 };

  return {
    progress,
    loading,
    achievements,
    saveSession,
    refreshProgress: loadProgress,
    isLoggedIn: !!user,
    levelProgress,
    calculateLevel
  };
};
