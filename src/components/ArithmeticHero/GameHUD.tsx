
import React from 'react';
import { Shield, Clock, Star, Zap } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { PowerupType } from '@/types/arithmeticHero';

interface GameHUDProps {
  level: number;
  wave: number;
  score: number;
  streak: number;
  shieldHealth: number;
  maxShield: number;
  activePowerups: {
    type: PowerupType;
    endTime: number;
  }[];
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
  // Calculate powerup time remaining
  const getTimeRemaining = (endTime: number): number => {
    const remaining = Math.max(0, Math.ceil((endTime - Date.now()) / 1000));
    return remaining;
  };

  // Get shield color based on health
  const getShieldColor = () => {
    const percentage = (shieldHealth / maxShield) * 100;
    if (percentage > 60) return "bg-green-500";
    if (percentage > 30) return "bg-amber-500";
    return "bg-red-500";
  };
  
  // Get streak icon and class
  const getStreakDisplay = () => {
    if (streak >= 20) return { icon: "🔥🔥🔥", class: "text-orange-300" };
    if (streak >= 10) return { icon: "🔥🔥", class: "text-orange-200" };
    if (streak >= 5) return { icon: "🔥", class: "text-orange-100" };
    return { icon: "", class: "" };
  };

  const streakDisplay = getStreakDisplay();

  return (
    <div className="absolute top-0 left-0 right-0 p-3 bg-black/40 backdrop-blur-sm z-20 flex flex-wrap items-center justify-between">
      {/* Level and Wave */}
      <div className="flex items-center space-x-2 text-sm md:text-base">
        <div className="px-2 py-0.5 rounded bg-indigo-800 text-white">
          Level {level}
        </div>
        <div className="px-2 py-0.5 rounded bg-purple-800 text-white">
          Wave {wave}
        </div>
      </div>
      
      {/* Score */}
      <div className="text-center flex-1 text-xl md:text-2xl font-bold">
        {score.toLocaleString()}
      </div>
      
      {/* Shield health */}
      <div className="w-full mt-2">
        <div className="flex justify-between text-xs mb-1">
          <div className="flex items-center">
            <Shield className="h-3 w-3 mr-1 text-blue-300" />
            <span>Shield</span>
          </div>
          <span>{Math.round((shieldHealth / maxShield) * 100)}%</span>
        </div>
        <Progress value={(shieldHealth / maxShield) * 100} className={`h-2 ${getShieldColor()}`} />
      </div>
      
      {/* Streak */}
      {streak > 0 && (
        <div className="absolute top-14 left-0 right-0 flex justify-center">
          <div className={`px-3 py-1 rounded-full bg-gradient-to-r from-amber-900/60 to-red-900/60 backdrop-blur-sm 
                         text-white font-bold flex items-center ${streakDisplay.class}`}>
            <span className="mr-1">
              {streakDisplay.icon}
            </span>
            <span>
              {streak}
            </span>
            {streak >= 5 && (
              <span className="ml-1 text-yellow-300">x{Math.min(Math.floor(streak / 5) + 1, 5)}</span>
            )}
          </div>
        </div>
      )}
      
      {/* Active powerups */}
      <div className="absolute top-12 right-3 flex flex-col space-y-2">
        {activePowerups.map((powerup, index) => {
          const remaining = getTimeRemaining(powerup.endTime);
          
          let icon;
          let bgColor;
          
          switch (powerup.type) {
            case "slowMotion":
              icon = <Clock className="h-4 w-4 mr-1 text-blue-300" />;
              bgColor = "bg-blue-900/60";
              break;
            case "doublePoints":
              icon = <Star className="h-4 w-4 mr-1 text-yellow-300" />;
              bgColor = "bg-amber-900/60";
              break;
            default:
              icon = <Zap className="h-4 w-4 mr-1 text-purple-300" />;
              bgColor = "bg-purple-900/60";
          }
          
          return (
            <div 
              key={index}
              className={`px-2 py-0.5 rounded backdrop-blur-sm text-white text-xs flex items-center ${bgColor}`}
            >
              {icon}
              <span>{remaining}s</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GameHUD;
