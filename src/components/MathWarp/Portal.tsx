
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Equation } from '@/pages/MathWarp';
import { Zap, Star, Clock } from 'lucide-react';

interface PortalProps {
  equation: Equation;
  onAnswerSelect: (answer: number) => void;
  isCorrect: boolean | null;
  isWarpActive: boolean;
  portalState: 'closed' | 'opening' | 'open' | 'closing';
  progressLevel: number;
  questionTimeLeft: number;
}

const Portal: React.FC<PortalProps> = ({
  equation,
  onAnswerSelect,
  isCorrect,
  isWarpActive,
  portalState,
  progressLevel,
  questionTimeLeft
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

  const timeProgress = (questionTimeLeft / 3.5) * 100;
  const isUrgent = questionTimeLeft <= 1;

  return (
    <div className="flex flex-col items-center space-y-8">
      {/* Timer Display */}
      {portalState === 'open' && (
        <div className={cn(
          "flex items-center space-x-2 px-4 py-2 rounded-full border-2 transition-all duration-300",
          isUrgent ? "bg-red-900/50 border-red-400 animate-pulse" : "bg-blue-900/30 border-blue-400",
          isWarpActive && "border-yellow-400 bg-yellow-900/30"
        )}>
          <Clock size={20} className={cn(
            "transition-colors",
            isUrgent ? "text-red-300" : "text-blue-300",
            isWarpActive && "text-yellow-300"
          )} />
          <div className={cn(
            "text-lg font-bold",
            isUrgent ? "text-red-200" : "text-blue-200",
            isWarpActive && "text-yellow-200"
          )}>
            {questionTimeLeft.toFixed(1)}s
          </div>
          <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className={cn(
                "h-full transition-all duration-100 ease-linear",
                isUrgent ? "bg-red-400" : "bg-blue-400",
                isWarpActive && "bg-yellow-400"
              )}
              style={{ width: `${timeProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* 3D Portal Container */}
      <div 
        className={cn("relative", getPortalStateClasses())}
        style={{ 
          transformStyle: 'preserve-3d',
          perspective: '1000px'
        }}
      >
        {/* Multiple depth rings for 3D effect */}
        <div className="absolute inset-0" style={{ transformStyle: 'preserve-3d' }}>
          {/* Outer ring - furthest back */}
          <div 
            className={cn(getPortalRingClasses(), "opacity-30")}
            style={{ transform: 'translateZ(-50px) scale(1.2)' }}
          />
          
          {/* Middle ring */}
          <div 
            className={cn(getPortalRingClasses(), "opacity-60")}
            style={{ transform: 'translateZ(-25px) scale(1.1)' }}
          />
          
          {/* Front ring */}
          <div 
            className={getPortalRingClasses()}
            style={{ transform: 'translateZ(0px)' }}
          />
        </div>
        
        {/* 3D Portal Core with depth */}
        <div 
          className="relative"
          style={{ 
            transformStyle: 'preserve-3d',
            transform: 'translateZ(10px)'
          }}
        >
          <Card className={cn(
            "relative p-6 md:p-8 border-2 transition-all duration-500 transform rounded-full w-72 h-72 md:w-80 md:h-80 flex flex-col items-center justify-center",
            "shadow-2xl",
            isCorrect === true && "border-green-400 bg-gradient-to-br from-green-900 via-green-800 to-green-900 animate-pulse scale-110 shadow-green-400/50",
            isCorrect === false && "border-red-400 bg-gradient-to-br from-red-900 via-red-800 to-red-900 animate-bounce scale-95 shadow-red-400/50",
            isWarpActive && "border-yellow-400 bg-gradient-to-br from-yellow-900 via-yellow-800 to-yellow-900 shadow-2xl shadow-yellow-400/50 animate-pulse",
            isCorrect === null && portalState === 'open' && "border-cyan-400 hover:border-purple-400 hover:scale-105 hover:shadow-cyan-400/30",
            portalState === 'opening' && "border-cyan-400 shadow-cyan-400/50",
            portalState === 'closing' && "border-purple-400 shadow-purple-400/50"
          )}
          style={{
            background: isCorrect === true 
              ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.9) 0%, rgba(5, 150, 105, 0.8) 50%, rgba(4, 120, 87, 0.9) 100%)'
              : isCorrect === false
              ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.9) 0%, rgba(220, 38, 38, 0.8) 50%, rgba(185, 28, 28, 0.9) 100%)'
              : isWarpActive
              ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.9) 0%, rgba(217, 119, 6, 0.8) 50%, rgba(180, 83, 9, 0.9) 100%)'
              : 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.9) 50%, rgba(2, 6, 23, 0.95) 100%)',
            boxShadow: '0 0 50px rgba(0,0,0,0.5), inset 0 0 30px rgba(255,255,255,0.1)'
          }}
          >
            {/* Progress level indicator */}
            {progressLevel > 0 && (
              <div className="absolute -top-4 -left-4 flex items-center space-x-1 bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg animate-pulse">
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
            
            <div className="text-center relative z-10">
              <div className={cn(
                "text-sm md:text-lg mb-3 transition-colors duration-300 font-semibold",
                isCorrect === true && "text-green-200",
                isCorrect === false && "text-red-200", 
                isWarpActive && "text-yellow-200",
                isCorrect === null && "text-cyan-200"
              )}>
                Portal Signal Detected
              </div>
              
              {/* 3D Question container */}
              <div 
                className={cn(
                  "px-4 py-3 rounded-lg mb-4 border-2 transition-all duration-300 relative",
                  "shadow-lg",
                  isCorrect === true && "border-green-400",
                  isCorrect === false && "border-red-400",
                  isWarpActive && "border-yellow-400 animate-pulse",
                  isCorrect === null && "border-cyan-400"
                )}
                style={{
                  background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.8) 0%, rgba(15, 23, 42, 0.9) 50%, rgba(0, 0, 0, 0.8) 100%)',
                  boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.5), 0 4px 15px rgba(0,0,0,0.3)',
                  transform: 'translateZ(5px)'
                }}
              >
                <div className={cn(
                  "text-2xl md:text-4xl font-bold transition-all duration-300",
                  isCorrect === true && "text-green-100 animate-pulse",
                  isCorrect === false && "text-red-100", 
                  isWarpActive && "text-yellow-100 animate-pulse",
                  isCorrect === null && "text-white"
                )}>
                  {equation.question}
                </div>
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

            {/* Portal energy effect with depth */}
            <div className={cn(
              "absolute inset-4 rounded-full transition-all duration-500",
              portalState === 'open' && "bg-gradient-radial from-cyan-500/20 via-blue-500/10 to-transparent animate-pulse",
              portalState === 'opening' && "bg-gradient-radial from-cyan-400/30 via-blue-400/20 to-transparent",
              portalState === 'closing' && "bg-gradient-radial from-purple-400/30 via-indigo-400/20 to-transparent",
              isWarpActive && "bg-gradient-radial from-yellow-400/30 via-orange-400/20 to-transparent"
            )}
            style={{ transform: 'translateZ(-5px)' }}
            />
          </Card>
        </div>
      </div>

      {/* 3D Frequency dials (answer options) */}
      <div 
        className={cn(
          "grid grid-cols-2 md:grid-cols-4 gap-4 transition-all duration-500",
          portalState === 'opening' && "opacity-0 scale-50",
          portalState === 'open' && "opacity-100 scale-100",
          portalState === 'closing' && "opacity-50 scale-75"
        )}
        style={{ 
          transformStyle: 'preserve-3d',
          transform: 'translateZ(20px)'
        }}
      >
        {equation.options.map((option, index) => (
          <Button
            key={index}
            onClick={() => portalState === 'open' && onAnswerSelect(option)}
            disabled={isCorrect !== null || portalState !== 'open'}
            className={cn(
              "w-16 h-16 md:w-20 md:h-20 text-xl md:text-2xl font-bold rounded-full transition-all duration-300 transform",
              "bg-gradient-to-br from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400",
              "border-2 border-cyan-300 hover:border-white hover:scale-110 text-white shadow-lg",
              "hover:shadow-cyan-400/50 active:scale-95",
              portalState !== 'open' && "opacity-50 cursor-not-allowed",
              isWarpActive && "animate-pulse border-yellow-400 shadow-yellow-400/50 hover:shadow-yellow-400/70 bg-gradient-to-br from-yellow-400 to-orange-500",
              isCorrect === true && "animate-bounce scale-110 bg-gradient-to-br from-green-400 to-green-600 border-green-300",
              isCorrect === false && "animate-pulse scale-90 bg-gradient-to-br from-red-400 to-red-600 border-red-300"
            )}
            style={{
              boxShadow: '0 4px 15px rgba(0,0,0,0.3), inset 0 2px 5px rgba(255,255,255,0.2)',
              transform: `translateZ(${5 + index * 2}px)`
            }}
          >
            {option}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default Portal;
