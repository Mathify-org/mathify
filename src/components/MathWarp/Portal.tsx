
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Equation } from '@/pages/MathWarp';
import { Zap, Star } from 'lucide-react';

interface PortalProps {
  equation: Equation;
  onAnswerSelect: (answer: number) => void;
  isCorrect: boolean | null;
  isWarpActive: boolean;
  portalState: 'closed' | 'opening' | 'open' | 'closing';
  progressLevel: number;
}

const Portal: React.FC<PortalProps> = ({
  equation,
  onAnswerSelect,
  isCorrect,
  isWarpActive,
  portalState,
  progressLevel
}) => {
  const getPortalStateClasses = () => {
    switch (portalState) {
      case 'closed':
        return "scale-0 opacity-0 rotate-180";
      case 'opening':
        return "scale-100 opacity-100 rotate-0 transition-all duration-800 ease-out";
      case 'open':
        return "scale-100 opacity-100 rotate-0";
      case 'closing':
        return "scale-75 opacity-50 rotate-45 transition-all duration-1000 ease-in";
      default:
        return "scale-100 opacity-100 rotate-0";
    }
  };

  const getPortalRingClasses = () => {
    const baseClasses = "absolute inset-0 rounded-full border-4 animate-spin";
    if (portalState === 'opening') {
      return `${baseClasses} border-cyan-400 animate-spin duration-2000`;
    }
    if (portalState === 'closing') {
      return `${baseClasses} border-purple-400 animate-spin duration-500`;
    }
    if (isWarpActive) {
      return `${baseClasses} border-yellow-400 animate-spin duration-1000`;
    }
    return `${baseClasses} border-blue-400 animate-spin duration-3000`;
  };

  return (
    <div className="flex flex-col items-center space-y-8">
      {/* Portal with equation */}
      <div className={cn("relative", getPortalStateClasses())}>
        {/* Outer spinning ring */}
        <div className={getPortalRingClasses()}></div>
        
        {/* Inner portal core */}
        <Card className={cn(
          "relative p-6 md:p-8 bg-slate-900 border-2 transition-all duration-500 transform rounded-full w-72 h-72 md:w-80 md:h-80 flex flex-col items-center justify-center",
          isCorrect === true && "border-green-400 bg-green-900 animate-pulse scale-110 shadow-green-400/50 shadow-2xl",
          isCorrect === false && "border-red-400 bg-red-900 animate-bounce scale-95 shadow-red-400/50 shadow-xl",
          isWarpActive && "border-yellow-400 bg-yellow-900 shadow-2xl shadow-yellow-400/50 animate-pulse",
          isCorrect === null && portalState === 'open' && "border-cyan-400 hover:border-purple-400 hover:scale-105 hover:shadow-cyan-400/30 hover:shadow-xl",
          portalState === 'opening' && "border-cyan-400 shadow-cyan-400/50 shadow-2xl",
          portalState === 'closing' && "border-purple-400 shadow-purple-400/50 shadow-xl"
        )}>
          {/* Progress level indicator */}
          {progressLevel > 0 && (
            <div className="absolute -top-4 -left-4 flex items-center space-x-1 bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
              <Star size={16} className="animate-pulse" />
              <span>Level {progressLevel}</span>
            </div>
          )}

          {/* Warp streak indicator */}
          {isWarpActive && (
            <div className="absolute -top-4 -right-4 animate-bounce">
              <div className="flex items-center space-x-1 bg-yellow-400 text-black px-2 py-1 rounded-full text-sm font-bold animate-pulse">
                <Zap size={16} className="animate-spin" />
                <span>WARP!</span>
              </div>
            </div>
          )}
          
          <div className="text-center">
            <div className={cn(
              "text-sm md:text-lg mb-3 transition-colors duration-300 font-semibold",
              isCorrect === true && "text-green-200",
              isCorrect === false && "text-red-200", 
              isWarpActive && "text-yellow-200",
              isCorrect === null && "text-cyan-200"
            )}>
              Portal Signal Detected
            </div>
            
            <div className={cn(
              "text-2xl md:text-4xl font-bold mb-4 transition-all duration-300 text-white",
              isCorrect === true && "text-green-100 animate-pulse",
              isCorrect === false && "text-red-100", 
              isWarpActive && "text-yellow-100 animate-pulse"
            )}>
              {equation.question}
            </div>
            
            <div className={cn(
              "text-xs md:text-sm transition-colors duration-300",
              isCorrect === true && "text-green-300",
              isCorrect === false && "text-red-300", 
              isWarpActive && "text-yellow-300",
              isCorrect === null && "text-cyan-300"
            )}>
              Select the correct frequency
            </div>
          </div>

          {/* Portal energy effect */}
          <div className={cn(
            "absolute inset-4 rounded-full transition-all duration-500",
            portalState === 'open' && "bg-gradient-radial from-cyan-500/20 via-blue-500/10 to-transparent animate-pulse",
            portalState === 'opening' && "bg-gradient-radial from-cyan-400/30 via-blue-400/20 to-transparent",
            portalState === 'closing' && "bg-gradient-radial from-purple-400/30 via-indigo-400/20 to-transparent",
            isWarpActive && "bg-gradient-radial from-yellow-400/30 via-orange-400/20 to-transparent"
          )}></div>
        </Card>
      </div>

      {/* Frequency dials (answer options) */}
      <div className={cn(
        "grid grid-cols-2 md:grid-cols-4 gap-4 transition-all duration-500",
        portalState === 'opening' && "opacity-0 scale-50",
        portalState === 'open' && "opacity-100 scale-100",
        portalState === 'closing' && "opacity-50 scale-75"
      )}>
        {equation.options.map((option, index) => (
          <Button
            key={index}
            onClick={() => portalState === 'open' && onAnswerSelect(option)}
            disabled={isCorrect !== null || portalState !== 'open'}
            className={cn(
              "w-16 h-16 md:w-20 md:h-20 text-xl md:text-2xl font-bold rounded-full transition-all duration-300 transform",
              "bg-gradient-to-br from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400",
              "border-2 border-cyan-300 hover:border-white hover:scale-110 text-white",
              "shadow-lg hover:shadow-cyan-400/50 active:scale-95",
              portalState !== 'open' && "opacity-50 cursor-not-allowed",
              isWarpActive && "animate-pulse border-yellow-400 shadow-yellow-400/50 hover:shadow-yellow-400/70 bg-gradient-to-br from-yellow-400 to-orange-500",
              isCorrect === true && "animate-bounce scale-110 bg-gradient-to-br from-green-400 to-green-600 border-green-300",
              isCorrect === false && "animate-pulse scale-90 bg-gradient-to-br from-red-400 to-red-600 border-red-300"
            )}
          >
            {option}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default Portal;
