import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface ChallengeProgress {
  id: string;
  completed: boolean;
  stars: number;
}

interface IslandProgress {
  id: string;
  completed: boolean;
  stars: number;
  challenges: ChallengeProgress[];
}

interface ShapeExplorerProgress {
  islands: IslandProgress[];
  totalStars: number;
  totalChallengesCompleted: number;
}

const LOCAL_STORAGE_KEY = 'shapeExplorerProgress';

// Default island structure
const getDefaultIslands = (): IslandProgress[] => [
  {
    id: "polygons",
    completed: false,
    stars: 0,
    challenges: [
      { id: "poly-1", completed: false, stars: 0 },
      { id: "poly-2", completed: false, stars: 0 },
      { id: "poly-3", completed: false, stars: 0 },
      { id: "poly-4", completed: false, stars: 0 },
    ]
  },
  {
    id: "circles",
    completed: false,
    stars: 0,
    challenges: [
      { id: "circ-1", completed: false, stars: 0 },
      { id: "circ-2", completed: false, stars: 0 },
    ]
  },
  {
    id: "symmetry",
    completed: false,
    stars: 0,
    challenges: [
      { id: "sym-1", completed: false, stars: 0 },
      { id: "sym-2", completed: false, stars: 0 },
    ]
  }
];

export const useShapeExplorerProgress = () => {
  const { user } = useAuth();
  const [progress, setProgress] = useState<ShapeExplorerProgress | null>(null);
  const [loading, setLoading] = useState(true);

  // Load progress from Supabase or localStorage
  const loadProgress = useCallback(async () => {
    setLoading(true);
    
    if (user) {
      try {
        // Get all shape-explorer sessions for this user
        const { data: sessions, error } = await supabase
          .from('game_sessions')
          .select('*')
          .eq('user_id', user.id)
          .eq('game_id', 'shape-explorer');
        
        if (error) {
          console.error('Error fetching progress:', error);
        }
        
        // Build progress from sessions
        const islands = getDefaultIslands();
        
        if (sessions && sessions.length > 0) {
          // Each session has difficulty field which contains the challenge type
          // We need to extract challenge completions from the sessions
          sessions.forEach(session => {
            // Parse the difficulty field which contains challenge info
            const challengeId = session.difficulty;
            
            for (const island of islands) {
              const challenge = island.challenges.find(c => c.id === challengeId);
              if (challenge) {
                // Calculate stars from score (10 points per star)
                const stars = Math.min(3, Math.ceil(session.score / 10));
                if (stars > challenge.stars) {
                  challenge.stars = stars;
                }
                challenge.completed = true;
              }
            }
          });
          
          // Update island stats
          for (const island of islands) {
            island.stars = island.challenges.reduce((sum, c) => sum + c.stars, 0);
            island.completed = island.challenges.every(c => c.completed);
          }
        }
        
        const totalStars = islands.reduce((sum, i) => sum + i.stars, 0);
        const totalChallengesCompleted = islands.reduce(
          (sum, i) => sum + i.challenges.filter(c => c.completed).length, 
          0
        );
        
        setProgress({ islands, totalStars, totalChallengesCompleted });
      } catch (err) {
        console.error('Error loading progress:', err);
        // Fall back to localStorage
        loadFromLocalStorage();
      }
    } else {
      loadFromLocalStorage();
    }
    
    setLoading(false);
  }, [user]);

  const loadFromLocalStorage = () => {
    try {
      const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        // Convert old format to new format
        const islands: IslandProgress[] = parsed.map((island: any) => ({
          id: island.id,
          completed: island.completed,
          stars: island.stars,
          challenges: island.challenges.map((c: any) => ({
            id: c.id,
            completed: c.completed,
            stars: c.stars
          }))
        }));
        
        const totalStars = islands.reduce((sum, i) => sum + i.stars, 0);
        const totalChallengesCompleted = islands.reduce(
          (sum, i) => sum + i.challenges.filter(c => c.completed).length, 
          0
        );
        
        setProgress({ islands, totalStars, totalChallengesCompleted });
      } else {
        setProgress({
          islands: getDefaultIslands(),
          totalStars: 0,
          totalChallengesCompleted: 0
        });
      }
    } catch (err) {
      console.error('Error loading from localStorage:', err);
      setProgress({
        islands: getDefaultIslands(),
        totalStars: 0,
        totalChallengesCompleted: 0
      });
    }
  };

  // Update challenge progress
  const updateChallengeProgress = useCallback(async (
    islandId: string, 
    challengeId: string, 
    stars: number
  ) => {
    if (!progress) return;
    
    // Update local state
    const newIslands = progress.islands.map(island => {
      if (island.id !== islandId) return island;
      
      const newChallenges = island.challenges.map(challenge => {
        if (challenge.id !== challengeId) return challenge;
        return { ...challenge, completed: true, stars: Math.max(challenge.stars, stars) };
      });
      
      const newStars = newChallenges.reduce((sum, c) => sum + c.stars, 0);
      const isCompleted = newChallenges.every(c => c.completed);
      
      return { ...island, challenges: newChallenges, stars: newStars, completed: isCompleted };
    });
    
    const totalStars = newIslands.reduce((sum, i) => sum + i.stars, 0);
    const totalChallengesCompleted = newIslands.reduce(
      (sum, i) => sum + i.challenges.filter(c => c.completed).length, 
      0
    );
    
    setProgress({ islands: newIslands, totalStars, totalChallengesCompleted });
    
    // Save to localStorage as backup
    const localStorageData = newIslands.map(island => ({
      id: island.id,
      completed: island.completed,
      stars: island.stars,
      challenges: island.challenges
    }));
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(localStorageData));
    
  }, [progress]);

  // Reset progress
  const resetProgress = useCallback(() => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setProgress({
      islands: getDefaultIslands(),
      totalStars: 0,
      totalChallengesCompleted: 0
    });
  }, []);

  // Get island by ID
  const getIsland = useCallback((islandId: string) => {
    return progress?.islands.find(i => i.id === islandId);
  }, [progress]);

  // Get challenge by ID
  const getChallenge = useCallback((islandId: string, challengeId: string) => {
    const island = getIsland(islandId);
    return island?.challenges.find(c => c.id === challengeId);
  }, [getIsland]);

  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  return {
    progress,
    loading,
    updateChallengeProgress,
    resetProgress,
    getIsland,
    getChallenge,
    refreshProgress: loadProgress
  };
};