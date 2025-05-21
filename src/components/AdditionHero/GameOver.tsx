
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Medal, Star, Zap, Trophy, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { gameService } from '@/services/additionHero/gameService';
import { GameMode } from '@/types/additionHero';
import confetti from 'canvas-confetti';
import HeroAvatar from './HeroAvatar';

interface GameOverProps {
  gameMode: GameMode;
  level: number;
  onRetry: () => void;
  onReturnToMenu: () => void;
}

const GameOver: React.FC<GameOverProps> = ({ 
  gameMode,
  level,
  onRetry,
  onReturnToMenu
}) => {
  const [progress, setProgress] = useState(gameService.getPlayerProgress());
  const [isNewHighScore, setIsNewHighScore] = useState(false);
  const [unlockedAchievements, setUnlockedAchievements] = useState(gameService.getPendingAchievements());
  
  const highScore = gameMode === 'challenge' 
    ? progress.highScores.challenge 
    : progress.highScores.arcade[level - 1];
  
  useEffect(() => {
    // Check if the current score is a new high score
    const currentScore = gameMode === 'challenge' 
      ? progress.highScores.challenge 
      : progress.highScores.arcade[level - 1];
      
    // Compare current score with previous high score
    const previousProgress = JSON.parse(localStorage.getItem("additionHeroProgress") || "{}");
    const previousScore = gameMode === 'challenge' 
      ? previousProgress?.highScores?.challenge 
      : previousProgress?.highScores?.arcade?.[level - 1];
    
    if (currentScore > (previousScore || 0)) {
      setIsNewHighScore(true);
      
      // Play celebration confetti for high score
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [gameMode, level, progress]);
  
  // Refresh pending achievements
  useEffect(() => {
    const achievements = gameService.getPendingAchievements();
    setUnlockedAchievements(achievements);
    gameService.clearPendingAchievements();
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center p-4"
    >
      <div className="bg-black/30 backdrop-blur-sm rounded-xl max-w-md mx-auto p-6 shadow-xl">
        <h2 className="text-3xl font-bold mb-6">Game Over!</h2>
        
        <div className="flex justify-center mb-6">
          <HeroAvatar size="large" />
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-blue-900/50 p-4 rounded-lg">
            <div className="text-sm opacity-70">Score</div>
            <div className="text-2xl font-bold flex justify-center items-center">
              {highScore}
              {isNewHighScore && (
                <Trophy className="ml-2 h-4 w-4 text-yellow-400" />
              )}
            </div>
          </div>
          
          <div className="bg-purple-900/50 p-4 rounded-lg">
            <div className="text-sm opacity-70">Best Streak</div>
            <div className="text-2xl font-bold">{progress.longestStreak}</div>
          </div>
          
          <div className="bg-indigo-900/50 p-4 rounded-lg">
            <div className="text-sm opacity-70">Total Correct</div>
            <div className="text-2xl font-bold">{progress.totalCorrectAnswers}</div>
          </div>
          
          <div className="bg-violet-900/50 p-4 rounded-lg">
            <div className="text-sm opacity-70">Levels Unlocked</div>
            <div className="text-2xl font-bold">{progress.unlockedLevels} / 5</div>
          </div>
        </div>
        
        {/* New Achievements */}
        {unlockedAchievements.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-bold mb-3 flex items-center justify-center">
              <Medal className="mr-2 h-5 w-5 text-yellow-400" />
              New Achievements
            </h3>
            
            <div className="grid gap-2">
              {unlockedAchievements.map(achievement => (
                <motion.div 
                  key={achievement.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3 text-left flex items-center"
                >
                  <div className="mr-3 p-2 bg-yellow-500/20 rounded-full">
                    {achievement.icon === 'zap' && <Zap className="h-5 w-5 text-yellow-400" />}
                    {achievement.icon === 'fire' && <Zap className="h-5 w-5 text-yellow-400" />}
                    {achievement.icon === 'lightning-bolt' && <Zap className="h-5 w-5 text-yellow-400" />}
                    {achievement.icon === 'star' && <Star className="h-5 w-5 text-yellow-400" />}
                    {achievement.icon === 'shield' && <Zap className="h-5 w-5 text-yellow-400" />}
                    {achievement.icon === 'award' && <Zap className="h-5 w-5 text-yellow-400" />}
                    {achievement.icon === 'medal' && <Medal className="h-5 w-5 text-yellow-400" />}
                  </div>
                  <div>
                    <div className="font-bold">{achievement.name}</div>
                    <div className="text-xs opacity-80">{achievement.description}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
        
        {/* Stats Summary */}
        {isNewHighScore && (
          <div className="mb-6 bg-gradient-to-r from-amber-500/30 to-yellow-500/30 p-3 rounded-lg">
            <div className="flex items-center justify-center">
              <Trophy className="h-6 w-6 text-yellow-400 mr-2" />
              <span className="font-bold">New High Score!</span>
            </div>
          </div>
        )}
        
        <div className="flex flex-col gap-3">
          <Button 
            onClick={onRetry} 
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Zap className="mr-2 h-5 w-5" />
            Try Again
          </Button>
          
          <Button 
            variant="outline" 
            onClick={onReturnToMenu}
            className="bg-white/10 hover:bg-white/20"
          >
            Return to Menu
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default GameOver;
