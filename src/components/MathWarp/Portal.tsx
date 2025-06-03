
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Equation } from '@/pages/MathWarp';
import { Zap } from 'lucide-react';

interface PortalProps {
  equation: Equation;
  onAnswerSelect: (answer: number) => void;
  isCorrect: boolean | null;
  isWarpActive: boolean;
}

const Portal: React.FC<PortalProps> = ({
  equation,
  onAnswerSelect,
  isCorrect,
  isWarpActive
}) => {
  return (
    <div className="flex flex-col items-center space-y-8">
      {/* Portal with equation */}
      <Card className={cn(
        "relative p-8 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-2 transition-all duration-500 transform",
        isCorrect === true && "border-green-400 bg-green-500/20 animate-pulse scale-110 shadow-green-400/50 shadow-2xl",
        isCorrect === false && "border-red-400 bg-red-500/20 animate-bounce scale-95 shadow-red-400/50 shadow-xl",
        isWarpActive && "border-yellow-400 bg-yellow-500/20 shadow-2xl shadow-yellow-400/50 animate-pulse",
        isCorrect === null && "border-blue-400 hover:border-purple-400 hover:scale-105 hover:shadow-blue-400/30 hover:shadow-xl"
      )}>
        {isWarpActive && (
          <div className="absolute -top-2 -right-2 animate-bounce">
            <div className="flex items-center space-x-1 bg-yellow-400 text-black px-2 py-1 rounded-full text-sm font-bold animate-pulse">
              <Zap size={16} className="animate-spin" />
              <span>WARP STREAK!</span>
            </div>
          </div>
        )}
        
        <div className="text-center">
          <div className={cn(
            "text-lg mb-2 transition-colors duration-300",
            isCorrect === true && "text-green-200",
            isCorrect === false && "text-red-200", 
            isWarpActive && "text-yellow-200",
            isCorrect === null && "text-blue-200"
          )}>
            Portal Signal Detected
          </div>
          <div className={cn(
            "text-3xl md:text-4xl font-bold mb-4 transition-all duration-300",
            isCorrect === true && "text-green-100 animate-pulse",
            isCorrect === false && "text-red-100", 
            isWarpActive && "text-yellow-100 animate-pulse",
            isCorrect === null && "text-white"
          )}>
            {equation.question}
          </div>
          <div className={cn(
            "text-sm transition-colors duration-300",
            isCorrect === true && "text-green-200",
            isCorrect === false && "text-red-200", 
            isWarpActive && "text-yellow-200",
            isCorrect === null && "text-purple-200"
          )}>
            Select the correct frequency to open portal
          </div>
        </div>
      </Card>

      {/* Frequency dials (answer options) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {equation.options.map((option, index) => (
          <Button
            key={index}
            onClick={() => onAnswerSelect(option)}
            disabled={isCorrect !== null}
            className={cn(
              "w-16 h-16 md:w-20 md:h-20 text-2xl font-bold rounded-full transition-all duration-300 transform",
              "bg-gradient-to-br from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400",
              "border-2 border-cyan-300 hover:border-white hover:scale-110",
              "shadow-lg hover:shadow-cyan-400/50 active:scale-95",
              isWarpActive && "animate-pulse border-yellow-400 shadow-yellow-400/50 hover:shadow-yellow-400/70",
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
