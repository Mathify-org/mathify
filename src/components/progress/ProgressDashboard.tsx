import React from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Trophy, 
  Flame, 
  Target, 
  TrendingUp, 
  Gamepad2,
  Star,
  Calendar
} from 'lucide-react';
import { useUserProgress, useUserAchievements, useRecentGames } from '@/hooks/useProgressTracking';
import { xpForNextLevel } from '@/services/progressService';
import { Progress } from '@/components/ui/progress';

const gameNames: Record<string, string> = {
  'mental-maths': 'Mental Maths',
  'times-tables': 'Times Tables Master',
  'fraction-frenzy': 'Fraction Frenzy',
  'arithmetic-hero': 'Arithmetic Hero',
  'target-takedown': 'Target Takedown',
  'math-warp': 'Math Warp',
  'shape-explorer': 'Shape Explorer',
  'algebra-adventure': 'Algebra Adventure',
  'geometry-master': 'Geometry Master',
  'math-facts-race': 'Math Facts Race',
};

export const ProgressDashboard: React.FC = () => {
  const { data: progress, isLoading: progressLoading } = useUserProgress();
  const { data: achievements, isLoading: achievementsLoading } = useUserAchievements();
  const { data: recentGames, isLoading: gamesLoading } = useRecentGames(5);

  if (progressLoading || achievementsLoading || gamesLoading) {
    return (
      <div className="space-y-6">
        <div className="h-40 bg-muted/50 rounded-2xl animate-pulse" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-muted/50 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const levelProgress = progress ? xpForNextLevel(progress.totalXp) : { current: 0, required: 100, progress: 0 };
  const unlockedAchievements = achievements?.filter(a => a.isUnlocked) || [];

  return (
    <div className="space-y-6">
      {/* Level & XP Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-primary/20 via-card to-secondary/20 rounded-2xl p-6 border border-primary/20"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
              <span className="text-2xl font-bold text-primary-foreground">
                {progress?.currentLevel || 1}
              </span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">Level {progress?.currentLevel || 1}</h3>
              <p className="text-muted-foreground flex items-center gap-1">
                <Zap className="w-4 h-4 text-purple-500" />
                {progress?.totalXp?.toLocaleString() || 0} XP Total
              </p>
            </div>
          </div>
          
          <div className="text-right">
            <Flame className={`w-8 h-8 ${(progress?.currentStreak || 0) > 0 ? 'text-orange-500' : 'text-muted-foreground'}`} />
            <p className="text-sm font-bold text-foreground">{progress?.currentStreak || 0} day streak</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress to Level {(progress?.currentLevel || 1) + 1}</span>
            <span className="text-foreground font-medium">
              {levelProgress.current} / {levelProgress.required} XP
            </span>
          </div>
          <Progress value={levelProgress.progress} className="h-3" />
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-xl p-4 border border-border"
        >
          <Gamepad2 className="w-6 h-6 text-blue-500 mb-2" />
          <div className="text-2xl font-bold text-foreground">{progress?.gamesPlayed || 0}</div>
          <div className="text-xs text-muted-foreground">Games Played</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-xl p-4 border border-border"
        >
          <Target className="w-6 h-6 text-green-500 mb-2" />
          <div className="text-2xl font-bold text-foreground">{progress?.totalCorrectAnswers || 0}</div>
          <div className="text-xs text-muted-foreground">Correct Answers</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card rounded-xl p-4 border border-border"
        >
          <TrendingUp className="w-6 h-6 text-purple-500 mb-2" />
          <div className="text-2xl font-bold text-foreground">{progress?.longestStreak || 0}</div>
          <div className="text-xs text-muted-foreground">Best Streak</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card rounded-xl p-4 border border-border"
        >
          <Trophy className="w-6 h-6 text-amber-500 mb-2" />
          <div className="text-2xl font-bold text-foreground">{unlockedAchievements.length}</div>
          <div className="text-xs text-muted-foreground">Achievements</div>
        </motion.div>
      </div>

      {/* Achievements Section */}
      {achievements && achievements.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-card rounded-2xl p-6 border border-border"
        >
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold text-foreground">Achievements</h3>
            <span className="text-sm text-muted-foreground">
              ({unlockedAchievements.length}/{achievements.length})
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {achievements.slice(0, 8).map((achievement) => (
              <div
                key={achievement.id}
                className={`p-3 rounded-xl border ${
                  achievement.isUnlocked
                    ? 'bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/30'
                    : 'bg-muted/30 border-transparent opacity-50'
                }`}
              >
                <div className="text-2xl mb-1">{achievement.isUnlocked ? '🏆' : '🔒'}</div>
                <p className="text-sm font-medium text-foreground truncate">{achievement.name}</p>
                <p className="text-xs text-muted-foreground truncate">{achievement.description}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Recent Games */}
      {recentGames && recentGames.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-card rounded-2xl p-6 border border-border"
        >
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-blue-500" />
            <h3 className="font-bold text-foreground">Recent Activity</h3>
          </div>

          <div className="space-y-3">
            {recentGames.map((game: any) => (
              <div
                key={game.id}
                className="flex items-center justify-between p-3 bg-muted/30 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Gamepad2 className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      {gameNames[game.game_id] || game.game_id}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(game.completed_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-foreground">{game.score}</p>
                  <p className="text-xs text-purple-500">+{game.xp_earned} XP</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};
