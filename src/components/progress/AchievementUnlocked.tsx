import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Zap, Target, Flame, Award } from 'lucide-react';
import type { Achievement } from '@/services/progressService';

interface AchievementUnlockedProps {
  achievement: Achievement | null;
  onClose: () => void;
}

const iconMap: Record<string, React.ElementType> = {
  trophy: Trophy,
  star: Star,
  zap: Zap,
  target: Target,
  flame: Flame,
  award: Award,
};

export const AchievementUnlocked: React.FC<AchievementUnlockedProps> = ({ 
  achievement, 
  onClose 
}) => {
  if (!achievement) return null;

  const IconComponent = iconMap[achievement.icon] || Trophy;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: -50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: -50 }}
        className="fixed top-20 left-1/2 -translate-x-1/2 z-50"
        onClick={onClose}
      >
        <motion.div
          className="relative bg-gradient-to-br from-amber-500 via-yellow-500 to-orange-500 rounded-2xl p-1 shadow-2xl cursor-pointer"
          animate={{
            boxShadow: [
              '0 0 20px rgba(251, 191, 36, 0.5)',
              '0 0 40px rgba(251, 191, 36, 0.8)',
              '0 0 20px rgba(251, 191, 36, 0.5)',
            ],
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="bg-background rounded-xl p-6 min-w-[300px]">
            <div className="flex items-center gap-4">
              <motion.div
                className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5, repeat: 3 }}
              >
                <IconComponent className="w-8 h-8 text-white" />
              </motion.div>
              
              <div className="flex-1">
                <motion.p
                  className="text-xs font-bold text-amber-500 uppercase tracking-wider"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  Achievement Unlocked!
                </motion.p>
                <motion.h3
                  className="text-lg font-bold text-foreground"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {achievement.name}
                </motion.h3>
                <motion.p
                  className="text-sm text-muted-foreground"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {achievement.description}
                </motion.p>
                <motion.div
                  className="flex items-center gap-1 mt-2 text-amber-500"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <Zap className="w-4 h-4" />
                  <span className="text-sm font-bold">+{achievement.xpReward} XP</span>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Confetti particles */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{
              background: ['#fbbf24', '#f59e0b', '#ef4444', '#22c55e', '#3b82f6'][i % 5],
              top: '50%',
              left: '50%',
            }}
            initial={{ x: 0, y: 0, opacity: 1 }}
            animate={{
              x: Math.cos((i * 30 * Math.PI) / 180) * 150,
              y: Math.sin((i * 30 * Math.PI) / 180) * 150,
              opacity: 0,
            }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        ))}
      </motion.div>
    </AnimatePresence>
  );
};
