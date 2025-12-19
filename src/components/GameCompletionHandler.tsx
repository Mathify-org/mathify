import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useGameProgress } from '@/hooks/useGameProgress';
import { GameSessionData, Achievement } from '@/services/progressService';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Link } from 'react-router-dom';
import { Trophy, Star, Zap, TrendingUp, Flame, UserPlus } from 'lucide-react';
import confetti from 'canvas-confetti';

interface GameCompletionHandlerProps {
  gameId: string;
  gameName: string;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  timeSpentSeconds?: number;
  difficulty?: string;
  onClose: () => void;
  onPlayAgain?: () => void;
}

const GameCompletionHandler: React.FC<GameCompletionHandlerProps> = ({
  gameId,
  gameName,
  score,
  correctAnswers,
  totalQuestions,
  timeSpentSeconds,
  difficulty,
  onClose,
  onPlayAgain
}) => {
  const { user } = useAuth();
  const { saveSession, progress, levelProgress } = useGameProgress();
  const [xpEarned, setXpEarned] = useState(0);
  const [newAchievements, setNewAchievements] = useState<Achievement[]>([]);
  const [showSignupPrompt, setShowSignupPrompt] = useState(false);
  const [previousLevel, setPreviousLevel] = useState(progress?.currentLevel || 1);
  const [isProcessing, setIsProcessing] = useState(true);

  const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

  useEffect(() => {
    const processCompletion = async () => {
      setPreviousLevel(progress?.currentLevel || 1);
      
      const session: GameSessionData = {
        gameId,
        score,
        correctAnswers,
        totalQuestions,
        accuracy,
        timeSpentSeconds,
        difficulty
      };

      const result = await saveSession(session);
      setXpEarned(result.xpEarned);
      setNewAchievements(result.newAchievements);
      setIsProcessing(false);

      // Celebrate if good performance
      if (accuracy >= 70) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }

      // Show signup prompt for anonymous users after a delay
      if (!user) {
        setTimeout(() => setShowSignupPrompt(true), 2000);
      }
    };

    processCompletion();
  }, []);

  const leveledUp = progress && progress.currentLevel > previousLevel;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="w-full max-w-md"
        >
          <Card className="bg-gradient-to-br from-white to-purple-50 border-2 border-purple-200 shadow-2xl">
            <CardContent className="p-6">
              {/* Header */}
              <div className="text-center mb-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                  className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center"
                >
                  {accuracy >= 80 ? (
                    <Trophy className="w-10 h-10 text-white" />
                  ) : accuracy >= 60 ? (
                    <Star className="w-10 h-10 text-white" />
                  ) : (
                    <Zap className="w-10 h-10 text-white" />
                  )}
                </motion.div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {accuracy >= 80 ? 'Excellent!' : accuracy >= 60 ? 'Great Job!' : 'Keep Practicing!'}
                </h2>
                <p className="text-gray-600">{gameName}</p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="text-center p-3 bg-blue-100 rounded-xl">
                  <p className="text-2xl font-bold text-blue-600">{score}</p>
                  <p className="text-xs text-blue-600">Score</p>
                </div>
                <div className="text-center p-3 bg-green-100 rounded-xl">
                  <p className="text-2xl font-bold text-green-600">{correctAnswers}/{totalQuestions}</p>
                  <p className="text-xs text-green-600">Correct</p>
                </div>
                <div className="text-center p-3 bg-purple-100 rounded-xl">
                  <p className="text-2xl font-bold text-purple-600">{accuracy}%</p>
                  <p className="text-xs text-purple-600">Accuracy</p>
                </div>
              </div>

              {/* XP Earned */}
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl p-4 mb-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-600" />
                    <span className="font-semibold text-yellow-800">XP Earned</span>
                  </div>
                  <span className="text-2xl font-bold text-yellow-600">+{xpEarned}</span>
                </div>
              </motion.div>

              {/* Level Progress */}
              {user && progress && (
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="mb-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-purple-600" />
                      <span className="text-sm font-medium text-gray-700">Level {progress.currentLevel}</span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {levelProgress.current} / {levelProgress.needed} XP
                    </span>
                  </div>
                  <Progress value={levelProgress.percentage} className="h-2" />
                  
                  {leveledUp && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="mt-2 text-center text-green-600 font-bold"
                    >
                      🎉 Level Up! You're now Level {progress.currentLevel}!
                    </motion.div>
                  )}
                </motion.div>
              )}

              {/* Streak */}
              {user && progress && progress.currentStreak > 0 && (
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="bg-gradient-to-r from-orange-100 to-red-100 rounded-xl p-3 mb-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Flame className="w-5 h-5 text-orange-500" />
                    <span className="font-medium text-orange-800">Daily Streak</span>
                  </div>
                  <span className="text-xl font-bold text-orange-600">{progress.currentStreak} days</span>
                </motion.div>
              )}

              {/* New Achievements */}
              {newAchievements.length > 0 && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="mb-4"
                >
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">🏆 New Achievements!</h3>
                  <div className="space-y-2">
                    {newAchievements.map((achievement) => (
                      <div
                        key={achievement.id}
                        className="flex items-center gap-3 bg-yellow-50 border border-yellow-200 rounded-lg p-2"
                      >
                        <span className="text-2xl">{achievement.icon}</span>
                        <div>
                          <p className="font-semibold text-sm text-gray-800">{achievement.name}</p>
                          <p className="text-xs text-gray-600">{achievement.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Sign Up Prompt for Anonymous Users */}
              {showSignupPrompt && !user && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-4 mb-4 border border-purple-200"
                >
                  <div className="flex items-start gap-3">
                    <UserPlus className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-purple-800">Save Your Progress!</h3>
                      <p className="text-sm text-purple-700 mb-3">
                        Sign up to save your XP, unlock achievements, and compete on leaderboards!
                      </p>
                      <Link to="/auth">
                        <Button size="sm" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                          Create Free Account
                        </Button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                {onPlayAgain && (
                  <Button
                    onClick={onPlayAgain}
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                  >
                    Play Again
                  </Button>
                )}
                <Button
                  onClick={onClose}
                  variant="outline"
                  className="flex-1"
                >
                  {onPlayAgain ? 'Exit' : 'Continue'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default GameCompletionHandler;
