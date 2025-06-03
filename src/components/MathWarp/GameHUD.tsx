
import React from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { Star, Zap } from 'lucide-react';

interface GameHUDProps {
  score: number;
  streak: number;
  timeLeft: number;
  lives: number;
}

const GameHUD: React.FC<GameHUDProps> = ({ score, streak, timeLeft, lives }) => {
  const timeProgress = (timeLeft / 60) * 100;
  const isLowTime = timeLeft <= 10;
  const isWarpStreak = streak >= 5;

  return (
    <div className="flex items-center space-x-4">
      {/* Score */}
      <Card className="bg-black/30 border-blue-400/50 px-3 py-2">
        <div className="text-center">
          <div className="text-xs text-blue-200">SCORE</div>
          <div className="text-lg font-bold text-white">{score.toLocaleString()}</div>
        </div>
      </Card>

      {/* Streak */}
      <Card className={cn(
        "border-purple-400/50 px-3 py-2",
        isWarpStreak ? "bg-yellow-400/20 border-yellow-400" : "bg-black/30"
      )}>
        <div className="text-center">
          <div className="text-xs text-purple-200 flex items-center justify-center gap-1">
            {isWarpStreak && <Zap size={12} className="text-yellow-400" />}
            STREAK
          </div>
          <div className={cn(
            "text-lg font-bold",
            isWarpStreak ? "text-yellow-300" : "text-white"
          )}>
            {streak}
          </div>
        </div>
      </Card>

      {/* Time */}
      <Card className={cn(
        "border-green-400/50 px-3 py-2 min-w-[80px]",
        isLowTime ? "bg-red-400/20 border-red-400 animate-pulse" : "bg-black/30"
      )}>
        <div className="text-center">
          <div className="text-xs text-green-200">TIME</div>
          <div className={cn(
            "text-lg font-bold",
            isLowTime ? "text-red-300" : "text-white"
          )}>
            {timeLeft}s
          </div>
        </div>
      </Card>

      {/* Lives */}
      <Card className="bg-black/30 border-red-400/50 px-3 py-2">
        <div className="text-center">
          <div className="text-xs text-red-200">LIVES</div>
          <div className="flex justify-center space-x-1">
            {[...Array(3)].map((_, i) => (
              <Star
                key={i}
                size={16}
                className={cn(
                  i < lives ? "text-red-400 fill-red-400" : "text-gray-600"
                )}
              />
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default GameHUD;
