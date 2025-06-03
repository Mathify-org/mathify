
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Rocket, Star, Zap } from 'lucide-react';

interface GameOverProps {
  score: number;
  streak: number;
  onPlayAgain: () => void;
  onBackToMenu: () => void;
}

const GameOver: React.FC<GameOverProps> = ({ 
  score, 
  streak, 
  onPlayAgain, 
  onBackToMenu 
}) => {
  const getPerformanceMessage = () => {
    if (score >= 1000) return "🌟 WARP MASTER! Outstanding performance!";
    if (score >= 500) return "🚀 SPACE ACE! Excellent flying!";
    if (score >= 250) return "⭐ STELLAR PILOT! Great job!";
    return "🛸 SPACE CADET! Keep practicing!";
  };

  const getStreakBadge = () => {
    if (streak >= 15) return { text: "WARP LEGEND", color: "bg-yellow-500" };
    if (streak >= 10) return { text: "STREAK MASTER", color: "bg-purple-500" };
    if (streak >= 5) return { text: "HOT STREAK", color: "bg-blue-500" };
    return { text: "GETTING STARTED", color: "bg-gray-500" };
  };

  const streakBadge = getStreakBadge();

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="bg-black/40 border-2 border-blue-400/50 max-w-md w-full text-center">
        <CardHeader>
          <CardTitle className="text-4xl mb-4 text-white">
            🛸 Mission Complete!
          </CardTitle>
          <p className="text-xl text-blue-200">{getPerformanceMessage()}</p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Final Stats */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-blue-200">Final Score:</span>
              <span className="text-2xl font-bold text-yellow-400">{score.toLocaleString()}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-blue-200">Best Streak:</span>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-purple-300">{streak}</span>
                <Badge className={`${streakBadge.color} text-white`}>
                  {streakBadge.text}
                </Badge>
              </div>
            </div>
          </div>

          {/* Performance Stars */}
          <div className="flex justify-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={24}
                className={
                  i < Math.min(Math.floor(score / 200), 5)
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-600"
                }
              />
            ))}
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={onPlayAgain}
              className="w-full text-xl py-4 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold transform hover:scale-105 transition-all duration-200"
            >
              🔄 WARP AGAIN
            </Button>
            
            <Button
              onClick={onBackToMenu}
              variant="outline"
              className="w-full text-lg py-3 border-blue-400 text-blue-300 hover:bg-blue-400/10"
            >
              🏠 RETURN TO BASE
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GameOver;
