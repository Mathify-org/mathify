
import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap, Clock, Star } from 'lucide-react';
import { PowerupType } from '@/types/additionHero';

interface GameHUDProps {
  level: number;
  wave: number;
  score: number;
  streak: number;
  shieldHealth: number;
  maxShield: number;
  activePowerups: { type: PowerupType; endTime: number }[];
}

const GameHUD: React.FC<GameHUDProps> = ({
  level,
  wave,
  score,
  streak,
  shieldHealth,
  maxShield,
  activePowerups
}) => {
  // Calculate shield percentage
  const shieldPercentage = (shieldHealth / maxShield) * 100;
  
  // Determine shield color based on health
  const getShieldColor = () => {
    if (shieldPercentage > 60) return "bg-green-500";
    if (shieldPercentage > 30) return "bg-yellow-500";
    return "bg-red-500";
  };
  
  // Calculate remaining time for powerups
  const getTimeRemaining = (endTime: number) => {
    const remaining = Math.ceil((endTime - Date.now()) / 1000);
    return `${remaining}s`;
  };
  
  // Get streak class for visual effects
  const getStreakClass = () => {
    if (streak >= 20) return "text-red-400 animate-pulse";
    if (streak >= 10) return "text-amber-400";
    if (streak >= 5) return "text-yellow-400";
    return "text-white";
  };

  return (
    <div className="absolute top-0 left-0 right-0 p-3 bg-gradient-to-b from-black/70 to-transparent z-20">
      <div className="flex flex-wrap justify-between gap-2">
        <div className="flex items-center gap-4">
          {/* Level indicator */}
          <div className="bg-blue-600/80 rounded-lg px-3 py-1 backdrop-blur-sm">
            <div className="text-xs uppercase tracking-wider opacity-80">Level</div>
            <div className="text-lg font-bold">{level}</div>
          </div>
          
          {/* Wave indicator */}
          <div className="bg-purple-600/80 rounded-lg px-3 py-1 backdrop-blur-sm">
            <div className="text-xs uppercase tracking-wider opacity-80">Wave</div>
            <div className="text-lg font-bold">{wave}</div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Score counter */}
          <div className="bg-indigo-600/80 rounded-lg px-3 py-1 backdrop-blur-sm">
            <div className="text-xs uppercase tracking-wider opacity-80">Score</div>
            <motion.div 
              key={score}
              initial={{ scale: 1.2 }} 
              animate={{ scale: 1 }}
              className="text-lg font-bold"
            >
              {score}
            </motion.div>
          </div>
          
          {/* Streak counter */}
          <div className="bg-black/50 rounded-lg px-3 py-1 backdrop-blur-sm">
            <div className="text-xs uppercase tracking-wider opacity-80">Streak</div>
            <div className={`text-lg font-bold flex items-center ${getStreakClass()}`}>
              {streak}
              {streak >= 5 && (
                <Zap className="ml-1 h-4 w-4" />
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Shield meter */}
      <div className="mt-3 bg-gray-900/60 rounded-full h-3 backdrop-blur-sm">
        <motion.div 
          className={`h-full rounded-full ${getShieldColor()}`}
          initial={{ width: `${shieldPercentage}%` }}
          animate={{ width: `${shieldPercentage}%` }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
        <div className="flex justify-between text-xs text-white/70 mt-1">
          <div className="flex items-center">
            <Shield className="h-3 w-3 mr-1" />
            <span>Shield</span>
          </div>
          <div>{Math.ceil(shieldPercentage)}%</div>
        </div>
      </div>
      
      {/* Active powerups */}
      {activePowerups.length > 0 && (
        <div className="flex gap-2 mt-2">
          {activePowerups.map((powerup, index) => (
            <div 
              key={`${powerup.type}-${index}`}
              className="bg-black/50 rounded-full px-2 py-1 text-xs flex items-center backdrop-blur-sm"
            >
              {powerup.type === "slowMotion" && (
                <Clock className="h-3 w-3 mr-1 text-blue-300" />
              )}
              {powerup.type === "doublePoints" && (
                <Star className="h-3 w-3 mr-1 text-yellow-300" />
              )}
              <span>{getTimeRemaining(powerup.endTime)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GameHUD;
