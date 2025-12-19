import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { UserProgress, getLevelProgress } from '@/services/progressService';
import { Zap, Flame, Target, Trophy, BookOpen, Clock, TrendingUp } from 'lucide-react';

interface ProgressDashboardProps {
  progress: UserProgress;
}

const ProgressDashboard: React.FC<ProgressDashboardProps> = ({ progress }) => {
  const levelProgress = getLevelProgress(progress.totalXp);
  const accuracy = progress.totalQuestionsAnswered > 0 
    ? Math.round((progress.totalCorrectAnswers / progress.totalQuestionsAnswered) * 100) 
    : 0;

  const stats = [
    {
      label: 'Total XP',
      value: progress.totalXp.toLocaleString(),
      icon: <Zap className="w-5 h-5" />,
      color: 'from-yellow-400 to-orange-500',
      bgColor: 'bg-yellow-50'
    },
    {
      label: 'Games Played',
      value: progress.gamesPlayed,
      icon: <Target className="w-5 h-5" />,
      color: 'from-blue-400 to-indigo-500',
      bgColor: 'bg-blue-50'
    },
    {
      label: 'Current Streak',
      value: `${progress.currentStreak} days`,
      icon: <Flame className="w-5 h-5" />,
      color: 'from-orange-400 to-red-500',
      bgColor: 'bg-orange-50'
    },
    {
      label: 'Longest Streak',
      value: `${progress.longestStreak} days`,
      icon: <Trophy className="w-5 h-5" />,
      color: 'from-purple-400 to-pink-500',
      bgColor: 'bg-purple-50'
    },
    {
      label: 'Questions Answered',
      value: progress.totalQuestionsAnswered.toLocaleString(),
      icon: <BookOpen className="w-5 h-5" />,
      color: 'from-green-400 to-emerald-500',
      bgColor: 'bg-green-50'
    },
    {
      label: 'Accuracy',
      value: `${accuracy}%`,
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'from-cyan-400 to-blue-500',
      bgColor: 'bg-cyan-50'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Level Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 text-white border-0 shadow-xl overflow-hidden">
          <CardContent className="p-6 relative">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-white/80 text-sm font-medium">Current Level</p>
                  <h2 className="text-5xl font-bold">{progress.currentLevel}</h2>
                </div>
                <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center">
                  <Zap className="w-10 h-10 text-yellow-300" />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-white/90">
                  <span>Progress to Level {progress.currentLevel + 1}</span>
                  <span>{levelProgress.current} / {levelProgress.needed} XP</span>
                </div>
                <div className="w-full bg-white/30 rounded-full h-3">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${levelProgress.percentage}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="h-full bg-white rounded-full"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`${stat.bgColor} border-0 hover:shadow-lg transition-shadow`}>
              <CardContent className="p-4">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center text-white mb-3`}>
                  {stat.icon}
                </div>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Unique Games Played */}
      {progress.uniqueGamesPlayed.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-500" />
                Games Explored
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {progress.uniqueGamesPlayed.map((gameId) => (
                  <span
                    key={gameId}
                    className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
                  >
                    {gameId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default ProgressDashboard;
