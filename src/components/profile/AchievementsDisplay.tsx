import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { progressService, Achievement } from '@/services/progressService';
import { Trophy, Lock, Star, Zap, Flame, Target, Award, Medal, Crown, Sparkles } from 'lucide-react';

interface AchievementsDisplayProps {
  userId: string;
  userAchievements: Achievement[];
}

const iconMap: Record<string, React.ReactNode> = {
  'trophy': <Trophy className="w-6 h-6" />,
  'star': <Star className="w-6 h-6" />,
  'zap': <Zap className="w-6 h-6" />,
  'flame': <Flame className="w-6 h-6" />,
  'target': <Target className="w-6 h-6" />,
  'award': <Award className="w-6 h-6" />,
  'medal': <Medal className="w-6 h-6" />,
  'crown': <Crown className="w-6 h-6" />,
  'sparkles': <Sparkles className="w-6 h-6" />,
};

const AchievementsDisplay: React.FC<AchievementsDisplayProps> = ({ userId, userAchievements }) => {
  const [allAchievements, setAllAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAchievements = async () => {
      const achievements = await progressService.getAllAchievements();
      setAllAchievements(achievements);
      setLoading(false);
    };
    loadAchievements();
  }, []);

  const unlockedIds = new Set(userAchievements.map(a => a.id));
  const unlockedCount = userAchievements.length;
  const totalCount = allAchievements.length;

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="animate-pulse">Loading achievements...</div>
        </CardContent>
      </Card>
    );
  }

  const categories = [...new Set(allAchievements.map(a => a.category))];

  return (
    <div className="space-y-6">
      {/* Progress Summary */}
      <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800">{unlockedCount} / {totalCount}</h3>
                <p className="text-gray-600">Achievements Unlocked</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-yellow-600">
                {totalCount > 0 ? Math.round((unlockedCount / totalCount) * 100) : 0}%
              </p>
              <p className="text-sm text-gray-500">Complete</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Achievements by Category */}
      {categories.map((category) => {
        const categoryAchievements = allAchievements.filter(a => a.category === category);
        
        return (
          <Card key={category}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg capitalize flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-500" />
                {category} Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categoryAchievements.map((achievement, index) => {
                  const isUnlocked = unlockedIds.has(achievement.id);
                  const userAchievement = userAchievements.find(a => a.id === achievement.id);
                  
                  return (
                    <motion.div
                      key={achievement.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`
                        flex items-center gap-4 p-4 rounded-xl border-2 transition-all
                        ${isUnlocked 
                          ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-300 shadow-md' 
                          : 'bg-gray-50 border-gray-200 opacity-60'
                        }
                      `}
                    >
                      <div className={`
                        w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0
                        ${isUnlocked 
                          ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white' 
                          : 'bg-gray-300 text-gray-500'
                        }
                      `}>
                        {isUnlocked 
                          ? (iconMap[achievement.icon] || <Trophy className="w-6 h-6" />)
                          : <Lock className="w-6 h-6" />
                        }
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className={`font-semibold ${isUnlocked ? 'text-gray-800' : 'text-gray-500'}`}>
                          {achievement.name}
                        </h4>
                        <p className={`text-sm ${isUnlocked ? 'text-gray-600' : 'text-gray-400'}`}>
                          {achievement.description}
                        </p>
                        {isUnlocked && userAchievement?.unlockedAt && (
                          <p className="text-xs text-green-600 mt-1">
                            Unlocked {new Date(userAchievement.unlockedAt).toLocaleDateString()}
                          </p>
                        )}
                        {!isUnlocked && achievement.xpReward > 0 && (
                          <p className="text-xs text-yellow-600 mt-1">
                            +{achievement.xpReward} XP reward
                          </p>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        );
      })}

      {allAchievements.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Trophy className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">Achievements are being set up. Check back soon!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AchievementsDisplay;
