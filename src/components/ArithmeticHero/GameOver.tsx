
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, BarChart3, RefreshCw, Home, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { gameService } from '@/services/arithmeticHero/gameService';
import { GameMode } from '@/types/arithmeticHero';
import HeroAvatar from './HeroAvatar';
import confetti from 'canvas-confetti';

interface GameOverProps {
  gameMode: GameMode;
  level: number;
  score?: number;
  correctAnswers?: number;
  incorrectAnswers?: number;
  longestStreak?: number;
  newAchievements?: string[];
  onRetry: () => void;
  onReturnToMenu: () => void;
}

const GameOver: React.FC<GameOverProps> = ({
  gameMode,
  level,
  score = 0,
  correctAnswers = 0,
  incorrectAnswers = 0,
  longestStreak = 0,
  newAchievements = [],
  onRetry,
  onReturnToMenu
}) => {
  const [isNewHighScore, setIsNewHighScore] = useState(false);
  const [isNewLevelUnlocked, setIsNewLevelUnlocked] = useState(false);
  const [accuracy, setAccuracy] = useState(0);

  useEffect(() => {
    // Check if this is a new high score
    const newHighScore = gameService.updateHighScore(gameMode, level, score);
    setIsNewHighScore(newHighScore);
    
    if (newHighScore) {
      // Trigger confetti for new high score
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
    
    // Check if a new level was unlocked
    if (gameMode === "arcade") {
      const levelUnlocked = gameService.checkLevelProgress(level, score);
      setIsNewLevelUnlocked(levelUnlocked);
      
      if (levelUnlocked) {
        setTimeout(() => {
          confetti({
            particleCount: 200,
            spread: 90,
            origin: { y: 0.5 }
          });
        }, 1000);
      }
    }
    
    // Calculate accuracy
    const totalAnswered = correctAnswers + incorrectAnswers;
    setAccuracy(totalAnswered > 0 ? Math.round((correctAnswers / totalAnswered) * 100) : 0);
    
    // Animate in
    const animationTimeout = setTimeout(() => {
      // Trigger another small confetti burst after elements animate in
      if (newHighScore || isNewLevelUnlocked) {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 }
        });
      }
    }, 600);
    
    return () => clearTimeout(animationTimeout);
  }, []);

  const getScoreFeedback = () => {
    if (score >= 2000) return "Incredible!";
    if (score >= 1500) return "Amazing!";
    if (score >= 1000) return "Outstanding!";
    if (score >= 500) return "Great job!";
    if (score >= 200) return "Well done!";
    return "Good effort!";
  };
  
  const getAccuracyFeedback = () => {
    if (accuracy >= 95) return "Perfect precision!";
    if (accuracy >= 90) return "Excellent accuracy!";
    if (accuracy >= 80) return "Great accuracy!";
    if (accuracy >= 70) return "Good accuracy!";
    return "Keep practicing!";
  };

  return (
    <motion.div 
      className="flex flex-col items-center justify-center p-6"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Game Over</h1>
        <p className="text-xl">{getScoreFeedback()}</p>
        
        <div className="mt-4">
          <HeroAvatar size="large" animate={isNewHighScore} />
        </div>
      </div>
      
      <Card className="bg-white/10 backdrop-blur-sm border-none shadow-xl w-full max-w-md mb-6">
        <CardContent className="p-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col items-center p-3 bg-white/10 rounded-lg">
              <Trophy className="h-8 w-8 text-yellow-300 mb-1" />
              <div className="text-sm opacity-80">Score</div>
              <div className="text-2xl font-bold">
                {score}
                {isNewHighScore && <span className="text-yellow-300 ml-2">★</span>}
              </div>
            </div>
            
            <div className="flex flex-col items-center p-3 bg-white/10 rounded-lg">
              <Star className="h-8 w-8 text-yellow-300 mb-1" />
              <div className="text-sm opacity-80">Best Streak</div>
              <div className="text-2xl font-bold">{longestStreak}x</div>
            </div>
            
            <div className="flex flex-col items-center p-3 bg-white/10 rounded-lg">
              <BarChart3 className="h-8 w-8 text-green-300 mb-1" />
              <div className="text-sm opacity-80">Accuracy</div>
              <div className="text-2xl font-bold">{accuracy}%</div>
              <div className="text-xs mt-1">{getAccuracyFeedback()}</div>
            </div>
            
            <div className="flex flex-col items-center p-3 bg-white/10 rounded-lg">
              <Award className="h-8 w-8 text-purple-300 mb-1" />
              <div className="text-sm opacity-80">Total Solved</div>
              <div className="text-2xl font-bold">{correctAnswers}</div>
            </div>
          </div>
          
          {isNewLevelUnlocked && (
            <motion.div 
              className="mt-4 p-3 bg-gradient-to-r from-yellow-500/80 to-amber-600/80 rounded-lg text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <Trophy className="h-6 w-6 text-white mx-auto mb-1" />
              <div className="font-bold">New Level Unlocked!</div>
              <div className="text-sm">You've reached level {level + 1}!</div>
            </motion.div>
          )}
          
          {newAchievements.length > 0 && (
            <motion.div 
              className="mt-4 p-3 bg-gradient-to-r from-purple-500/80 to-indigo-600/80 rounded-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <Award className="h-6 w-6 text-white mx-auto mb-1" />
              <div className="font-bold text-center">Achievements Unlocked!</div>
              <div className="text-sm mt-2">
                {newAchievements.map((achievement, index) => (
                  <div key={index} className="mb-1">• {achievement}</div>
                ))}
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-2 gap-4 w-full max-w-md">
        <Button 
          onClick={onRetry}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600"
        >
          <RefreshCw className="mr-2 h-4 w-4" /> Play Again
        </Button>
        
        <Button 
          variant="outline"
          onClick={onReturnToMenu}
          className="w-full bg-white/20"
        >
          <Home className="mr-2 h-4 w-4" /> Main Menu
        </Button>
      </div>
    </motion.div>
  );
};

export default GameOver;
