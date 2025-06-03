
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
        "relative p-8 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-2 transition-all duration-500",
        isCorrect === true && "border-green-400 bg-green-500/20 animate-pulse",
        isCorrect === false && "border-red-400 bg-red-500/20 animate-bounce",
        isWarpActive && "border-yellow-400 bg-yellow-500/20 shadow-2xl shadow-yellow-400/50",
        isCorrect === null && "border-blue-400 hover:border-purple-400"
      )}>
        {isWarpActive && (
          <div className="absolute -top-2 -right-2">
            <div className="flex items-center space-x-1 bg-yellow-400 text-black px-2 py-1 rounded-full text-sm font-bold">
              <Zap size={16} />
              <span>WARP STREAK!</span>
            </div>
          </div>
        )}
        
        <div className="text-center">
          <div className="text-lg text-blue-200 mb-2">Portal Signal Detected</div>
          <div className="text-3xl md:text-4xl font-bold text-white mb-4">
            {equation.question}
          </div>
          <div className="text-sm text-purple-200">Select the correct frequency to open portal</div>
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
              "w-16 h-16 md:w-20 md:h-20 text-2xl font-bold rounded-full transition-all duration-200",
              "bg-gradient-to-br from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400",
              "border-2 border-cyan-300 hover:border-white hover:scale-110 transform",
              "shadow-lg hover:shadow-cyan-400/50",
              isWarpActive && "animate-pulse border-yellow-400 shadow-yellow-400/50"
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
