
import React from 'react';
import { cn } from '@/lib/utils';
import { Rocket } from 'lucide-react';

interface SpaceshipProps {
  isCorrect: boolean | null;
  isWarpActive: boolean;
}

const Spaceship: React.FC<SpaceshipProps> = ({ isCorrect, isWarpActive }) => {
  return (
    <div className={cn(
      "fixed bottom-20 left-1/2 transform -translate-x-1/2 transition-all duration-500",
      isCorrect === true && "animate-bounce scale-110",
      isCorrect === false && "animate-pulse",
      isWarpActive && "animate-float"
    )}>
      <div className={cn(
        "relative p-4 rounded-full transition-all duration-300",
        isCorrect === true && "bg-green-400/30 shadow-lg shadow-green-400/50",
        isCorrect === false && "bg-red-400/30 shadow-lg shadow-red-400/50",
        isWarpActive && "bg-yellow-400/30 shadow-2xl shadow-yellow-400/50",
        isCorrect === null && "bg-blue-400/20"
      )}>
        <Rocket 
          size={48} 
          className={cn(
            "text-white transition-all duration-300",
            isCorrect === true && "text-green-300",
            isCorrect === false && "text-red-300",
            isWarpActive && "text-yellow-300 animate-pulse"
          )}
        />
        
        {/* Thrust flames */}
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
          <div className={cn(
            "w-4 h-8 bg-gradient-to-t from-orange-500 to-yellow-400 rounded-full animate-pulse",
            isWarpActive && "h-12 from-yellow-400 to-white animate-bounce"
          )} />
        </div>
      </div>
    </div>
  );
};

export default Spaceship;
