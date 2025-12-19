import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Target, Percent, Clock, RotateCcw, Home, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useProgressTracking } from '@/hooks/useProgressTracking';
import { SignUpPrompt } from './SignUpPrompt';
import { AchievementUnlocked } from './AchievementUnlocked';
import { XPGainDisplay } from './XPGainDisplay';
import type { Achievement } from '@/services/progressService';

interface GameEndScreenProps {
  gameId: string;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  timeSpentSeconds?: number;
  difficulty?: string;
  onPlayAgain: () => void;
  onGoHome: () => void;
}

export const GameEndScreen: React.FC<GameEndScreenProps> = ({
  gameId,
  score,
  correctAnswers,
  totalQuestions,
  timeSpentSeconds,
  difficulty,
  onPlayAgain,
  onGoHome,
}) => {
  const { saveProgress, isAuthenticated } = useProgressTracking();
  const [xpEarned, setXpEarned] = useState<number>(0);
  const [showXp, setShowXp] = useState(false);
  const [newAchievements, setNewAchievements] = useState<Achievement[]>([]);
  const [currentAchievement, setCurrentAchievement] = useState<Achievement | null>(null);
  const [showSignUp, setShowSignUp] = useState(false);
  const [saved, setSaved] = useState(false);

  const accuracy = totalQuestions > 0 
    ? Math.round((correctAnswers / totalQuestions) * 100) 
    : 0;

  useEffect(() => {
    const save = async () => {
      if (isAuthenticated && !saved) {
        const result = await saveProgress({
          gameId,
          score,
          correctAnswers,
          totalQuestions,
          timeSpentSeconds,
          difficulty,
        });

        if (result) {
          setSaved(true);
          setXpEarned(result.xpEarned);
          setShowXp(true);
          setTimeout(() => setShowXp(false), 3000);

          if (result.newAchievements.length > 0) {
            setNewAchievements(result.newAchievements);
            setCurrentAchievement(result.newAchievements[0]);
          }
        }
      } else if (!isAuthenticated) {
        setTimeout(() => setShowSignUp(true), 1000);
      }
    };

    save();
  }, [isAuthenticated, saved]);

  const handleAchievementClose = () => {
    const remaining = newAchievements.slice(1);
    setNewAchievements(remaining);
    setCurrentAchievement(remaining[0] || null);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        {/* Score Card */}
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="bg-card rounded-3xl shadow-xl border border-border p-8 mb-6"
        >
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary/60 mb-4"
            >
              <Trophy className="w-10 h-10 text-primary-foreground" />
            </motion.div>
            
            <h2 className="text-2xl font-bold text-foreground mb-2">Game Complete!</h2>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent"
            >
              {score}
            </motion.div>
            <p className="text-muted-foreground">points</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-muted/50 rounded-xl p-4 text-center"
            >
              <Target className="w-6 h-6 mx-auto mb-2 text-blue-500" />
              <div className="text-2xl font-bold text-foreground">
                {correctAnswers}/{totalQuestions}
              </div>
              <div className="text-xs text-muted-foreground">Correct</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-muted/50 rounded-xl p-4 text-center"
            >
              <Percent className="w-6 h-6 mx-auto mb-2 text-green-500" />
              <div className="text-2xl font-bold text-foreground">{accuracy}%</div>
              <div className="text-xs text-muted-foreground">Accuracy</div>
            </motion.div>

            {timeSpentSeconds && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-muted/50 rounded-xl p-4 text-center"
              >
                <Clock className="w-6 h-6 mx-auto mb-2 text-orange-500" />
                <div className="text-2xl font-bold text-foreground">
                  {formatTime(timeSpentSeconds)}
                </div>
                <div className="text-xs text-muted-foreground">Time</div>
              </motion.div>
            )}

            {isAuthenticated && xpEarned > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-xl p-4 text-center border border-purple-500/30"
              >
                <Zap className="w-6 h-6 mx-auto mb-2 text-purple-500" />
                <div className="text-2xl font-bold text-purple-400">+{xpEarned}</div>
                <div className="text-xs text-purple-300">XP Earned</div>
              </motion.div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              onClick={onPlayAgain}
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Play Again
            </Button>
            <Button
              onClick={onGoHome}
              variant="outline"
              className="flex-1"
            >
              <Home className="w-4 h-4 mr-2" />
              Home
            </Button>
          </div>
        </motion.div>

        {/* Sign Up Prompt for anonymous users */}
        {showSignUp && !isAuthenticated && (
          <SignUpPrompt 
            score={score} 
            onDismiss={() => setShowSignUp(false)} 
          />
        )}
      </motion.div>

      {/* XP Gain Display */}
      <XPGainDisplay xp={xpEarned} show={showXp} />

      {/* Achievement Popup */}
      <AchievementUnlocked 
        achievement={currentAchievement} 
        onClose={handleAchievementClose} 
      />
    </div>
  );
};
