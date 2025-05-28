
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Flame } from 'lucide-react';
import { GameMode } from '@/pages/TargetTakedown';

interface GameStatsProps {
  score: number;
  lives: number;
  streak: number;
  level: number;
  mode: GameMode;
}

const GameStats = ({ score, lives, streak, level, mode }: GameStatsProps) => {
  return (
    <Card className="glass-morphism border-2 border-white/30 mb-6">
      <CardContent className="p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-sm text-white/80 uppercase tracking-wide">Score</p>
              <p className="text-3xl font-bold text-white">{score}</p>
            </div>
            
            {mode === 'survival' && (
              <div className="text-center">
                <p className="text-sm text-white/80 uppercase tracking-wide">Lives</p>
                <div className="flex gap-1 justify-center mt-1">
                  {Array.from({ length: Math.max(lives, 0) }).map((_, i) => (
                    <span key={i} className="text-2xl">❤️</span>
                  ))}
                  {lives === 0 && <span className="text-2xl text-gray-500">💔</span>}
                </div>
              </div>
            )}
            
            <div className="text-center">
              <p className="text-sm text-white/80 uppercase tracking-wide">Streak</p>
              <div className="flex items-center gap-2 justify-center">
                <p className="text-3xl font-bold text-white">{streak}</p>
                {streak >= 5 && <Flame className="text-orange-400 animate-bounce" />}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Badge className={`text-lg px-4 py-2 ${
              level <= 3 ? 'bg-green-500' :
              level <= 6 ? 'bg-yellow-500' :
              level <= 9 ? 'bg-orange-500' : 'bg-red-500'
            }`}>
              Level {level}
            </Badge>
            
            <Badge variant="outline" className="text-lg px-4 py-2 bg-white/10 text-white border-white/30">
              {mode === 'classic' ? '⚡ Classic' :
               mode === 'survival' ? '💀 Survival' : '🌸 Chill'}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GameStats;
