
import React from 'react';
import { motion } from 'framer-motion';
import { Medal, Award, Check, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { gameService } from '@/services/additionHero/gameService';
import { Achievement } from '@/types/additionHero';

interface RewardsGalleryProps {
  onClose: () => void;
}

const RewardsGallery: React.FC<RewardsGalleryProps> = ({ onClose }) => {
  const achievements = gameService.getAchievements();
  const progress = gameService.getPlayerProgress();
  
  // Group achievements by category
  const achievementsByCategory = {
    streaks: achievements.filter(a => a.id.includes('streak')),
    milestones: achievements.filter(a => a.id.includes('correct')),
    levels: achievements.filter(a => a.id.includes('level')),
    other: achievements.filter(a => !a.id.includes('streak') && !a.id.includes('correct') && !a.id.includes('level'))
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto bg-purple-900/90 backdrop-blur-md rounded-lg p-6 shadow-xl"
    >
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold flex items-center justify-center">
          <Award className="mr-2 h-6 w-6 text-yellow-400" />
          Achievement Gallery
        </h2>
        <p className="text-purple-200">Your collection of rewards and achievements</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Achievements */}
        <div>
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <Medal className="mr-2 h-5 w-5 text-yellow-400" />
            Achievements
          </h3>
          
          <div className="space-y-6">
            {/* Streak Achievements */}
            <div>
              <h4 className="text-lg font-medium mb-2 text-purple-200">Streak Master</h4>
              <div className="grid gap-2">
                {achievementsByCategory.streaks.map(achievement => (
                  <RenderAchievement key={achievement.id} achievement={achievement} />
                ))}
              </div>
            </div>
            
            {/* Milestone Achievements */}
            <div>
              <h4 className="text-lg font-medium mb-2 text-purple-200">Milestones</h4>
              <div className="grid gap-2">
                {achievementsByCategory.milestones.map(achievement => (
                  <RenderAchievement key={achievement.id} achievement={achievement} />
                ))}
              </div>
            </div>
            
            {/* Level Achievements */}
            <div>
              <h4 className="text-lg font-medium mb-2 text-purple-200">Level Progression</h4>
              <div className="grid gap-2">
                {achievementsByCategory.levels.map(achievement => (
                  <RenderAchievement key={achievement.id} achievement={achievement} />
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Stats and Progress */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Your Stats</h3>
          
          <div className="bg-purple-800/50 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm opacity-70">Total Score</div>
                <div className="text-2xl font-bold">{progress.totalCorrectAnswers * 10}</div>
              </div>
              
              <div>
                <div className="text-sm opacity-70">Longest Streak</div>
                <div className="text-2xl font-bold">{progress.longestStreak}</div>
              </div>
              
              <div>
                <div className="text-sm opacity-70">Total Correct</div>
                <div className="text-2xl font-bold">{progress.totalCorrectAnswers}</div>
              </div>
              
              <div>
                <div className="text-sm opacity-70">Levels Unlocked</div>
                <div className="text-2xl font-bold">{progress.unlockedLevels} / 5</div>
              </div>
            </div>
          </div>
          
          <h3 className="text-xl font-semibold mb-4">Hero Items</h3>
          <div className="bg-purple-800/50 rounded-lg p-4">
            <p className="mb-4 text-sm">Unlock special items to customize your hero avatar by earning points.</p>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="p-2 rounded-lg bg-purple-700/50 text-sm">
                <div className="font-medium">Cape Styles</div>
                <div className="text-xs opacity-70">Unlocked: {progress.unlockedItems.filter(i => i.includes('cape')).length}/3</div>
              </div>
              
              <div className="p-2 rounded-lg bg-purple-700/50 text-sm">
                <div className="font-medium">Mask Styles</div>
                <div className="text-xs opacity-70">Unlocked: {progress.unlockedItems.filter(i => i.includes('mask')).length}/3</div>
              </div>
              
              <div className="p-2 rounded-lg bg-purple-700/50 text-sm">
                <div className="font-medium">Hero Colors</div>
                <div className="text-xs opacity-70">Unlocked: {progress.unlockedItems.filter(i => i.includes('color')).length}/5</div>
              </div>
              
              <div className="p-2 rounded-lg bg-purple-700/50 text-sm">
                <div className="font-medium">Emblems</div>
                <div className="text-xs opacity-70">Unlocked: {progress.unlockedItems.filter(i => i.includes('emblem')).length}/3</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8 flex justify-end">
        <Button 
          onClick={onClose}
          className="bg-purple-600 hover:bg-purple-700"
        >
          Close
        </Button>
      </div>
    </motion.div>
  );
};

// Helper component to render achievements
const RenderAchievement = ({ achievement }: { achievement: Achievement }) => {
  return (
    <div className={`flex items-center gap-3 p-3 rounded-lg ${
      achievement.isUnlocked 
        ? 'bg-yellow-900/30 border border-yellow-500/30' 
        : 'bg-purple-800/30 border border-purple-500/30 opacity-60'
    }`}>
      <div className={`p-1.5 rounded-full ${
        achievement.isUnlocked ? 'bg-yellow-500/20' : 'bg-purple-500/20'
      }`}>
        {achievement.isUnlocked ? (
          <Check className="h-4 w-4 text-yellow-400" />
        ) : (
          <Lock className="h-4 w-4 text-purple-300" />
        )}
      </div>
      
      <div className="flex-1">
        <div className="font-medium text-sm">{achievement.name}</div>
        <div className="text-xs opacity-80">{achievement.description}</div>
      </div>
    </div>
  );
};

export default RewardsGallery;
