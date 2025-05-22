
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Medal, Star, Award, Trophy, Lock, Check } from 'lucide-react';
import { gameService } from '@/services/arithmeticHero/gameService';
import HeroAvatar from './HeroAvatar';

interface RewardsGalleryProps {
  onClose: () => void;
}

const RewardsGallery: React.FC<RewardsGalleryProps> = ({ onClose }) => {
  const playerProgress = gameService.getPlayerProgress();
  const achievements = gameService.getAchievements();
  const unlockedAchievements = achievements.filter(a => a.isUnlocked).length;
  
  // Calculate overall progress
  const totalAchievements = achievements.length;
  const achievementProgress = Math.round((unlockedAchievements / totalAchievements) * 100);
  
  // Calculate level progress
  const totalLevels = 5; // Assuming 5 levels total
  const levelProgress = Math.round((playerProgress.unlockedLevels / totalLevels) * 100);
  
  return (
    <div className="container max-w-3xl mx-auto p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex justify-between items-center mb-6">
          <Button variant="ghost" onClick={onClose}>
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back
          </Button>
          
          <h2 className="text-2xl font-bold">Rewards Gallery</h2>
          
          <div className="w-20"></div> {/* Placeholder for alignment */}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Progress summary */}
          <Card className="bg-white/10 border-none shadow-xl backdrop-blur-sm md:col-span-1">
            <CardContent className="p-6">
              <div className="flex flex-col items-center">
                <HeroAvatar size="large" />
                
                <h3 className="text-xl font-bold mt-4">Your Progress</h3>
                
                <div className="w-full mt-6 space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="flex items-center">
                        <Award className="h-4 w-4 mr-1 text-purple-300" />
                        Achievements
                      </span>
                      <span>{unlockedAchievements}/{totalAchievements}</span>
                    </div>
                    <Progress value={achievementProgress} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="flex items-center">
                        <Trophy className="h-4 w-4 mr-1 text-yellow-300" />
                        Levels Unlocked
                      </span>
                      <span>{playerProgress.unlockedLevels}/{totalLevels}</span>
                    </div>
                    <Progress value={levelProgress} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="flex items-center">
                        <Star className="h-4 w-4 mr-1 text-blue-300" />
                        Total Correct
                      </span>
                      <span>{playerProgress.totalCorrectAnswers}</span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="flex items-center">
                        <Medal className="h-4 w-4 mr-1 text-amber-300" />
                        Best Streak
                      </span>
                      <span>{playerProgress.longestStreak}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Achievements and rewards tabs */}
          <Card className="bg-white/10 border-none shadow-xl backdrop-blur-sm md:col-span-2">
            <CardContent className="p-6">
              <Tabs defaultValue="achievements">
                <TabsList className="grid grid-cols-2 mb-6">
                  <TabsTrigger value="achievements">Achievements</TabsTrigger>
                  <TabsTrigger value="high-scores">High Scores</TabsTrigger>
                </TabsList>
                
                <TabsContent value="achievements">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {achievements.map(achievement => (
                      <div 
                        key={achievement.id}
                        className={`relative rounded-lg p-3 ${
                          achievement.isUnlocked 
                            ? 'bg-gradient-to-r from-blue-800/40 to-indigo-800/40' 
                            : 'bg-white/10'
                        }`}
                      >
                        <div className="flex">
                          <div className={`rounded-full p-2 mr-3 ${
                            achievement.isUnlocked 
                              ? 'bg-blue-500/30' 
                              : 'bg-gray-500/20'
                          }`}>
                            {getAchievementIcon(achievement.icon, achievement.isUnlocked)}
                          </div>
                          
                          <div>
                            <h4 className="font-medium">
                              {achievement.name}
                              {achievement.isUnlocked && (
                                <Check className="h-4 w-4 ml-1 inline text-green-400" />
                              )}
                            </h4>
                            <p className="text-sm opacity-80">{achievement.description}</p>
                          </div>
                        </div>
                        
                        {!achievement.isUnlocked && (
                          <div className="absolute top-1 right-1">
                            <Lock className="h-4 w-4 opacity-60" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="high-scores">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-3 flex items-center">
                        <Trophy className="h-5 w-5 mr-2 text-yellow-300" />
                        Arcade Mode High Scores
                      </h3>
                      
                      <div className="space-y-3">
                        {playerProgress.highScores.arcade.map((score, index) => (
                          <div 
                            key={index} 
                            className="flex justify-between items-center p-3 rounded-lg bg-white/10"
                          >
                            <div className="flex items-center">
                              <div className="h-8 w-8 rounded-full bg-blue-500/30 flex items-center justify-center mr-3">
                                {index + 1}
                              </div>
                              <div>
                                <div className="font-medium">Level {index + 1}</div>
                                <div className="text-xs opacity-70">
                                  {index < playerProgress.unlockedLevels 
                                    ? 'Unlocked' 
                                    : 'Locked'}
                                </div>
                              </div>
                            </div>
                            
                            <div className="text-xl font-bold">
                              {score > 0 ? score : '-'}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-3 flex items-center">
                        <Award className="h-5 w-5 mr-2 text-purple-300" />
                        Challenge Mode Best Score
                      </h3>
                      
                      <div className="p-4 rounded-lg bg-gradient-to-r from-orange-800/40 to-amber-800/40 flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-orange-500/30 flex items-center justify-center mr-3">
                            <Trophy className="h-5 w-5 text-yellow-300" />
                          </div>
                          <div>
                            <div className="font-medium">Hero Challenge</div>
                            <div className="text-xs opacity-70">90-second sprint</div>
                          </div>
                        </div>
                        
                        <div className="text-2xl font-bold">
                          {playerProgress.highScores.challenge > 0 
                            ? playerProgress.highScores.challenge 
                            : '-'}
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
};

// Helper function to render achievement icons
const getAchievementIcon = (iconName: string, isUnlocked: boolean) => {
  const color = isUnlocked ? "text-blue-300" : "text-gray-400";
  
  switch (iconName) {
    case "zap":
      return <Zap className={`h-5 w-5 ${color}`} />;
    case "fire":
      return <Flame className={`h-5 w-5 ${color}`} />;
    case "lightning-bolt":
      return <Zap className={`h-5 w-5 ${color}`} />;
    case "star":
      return <Star className={`h-5 w-5 ${color}`} />;
    case "shield":
      return <Shield className={`h-5 w-5 ${color}`} />;
    case "award":
      return <Award className={`h-5 w-5 ${color}`} />;
    case "medal":
      return <Medal className={`h-5 w-5 ${color}`} />;
    default:
      return <Trophy className={`h-5 w-5 ${color}`} />;
  }
};

// Import missing icons
import { Zap, Flame, Shield } from 'lucide-react';

export default RewardsGallery;
