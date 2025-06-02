
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface GameTimerProps {
  timeLeft: number;
}

const GameTimer = ({ timeLeft }: GameTimerProps) => {
  const getTimerColor = () => {
    if (timeLeft <= 10) return 'bg-red-500 animate-pulse';
    if (timeLeft <= 20) return 'bg-orange-500';
    return 'bg-green-500';
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="glass-morphism border-2 border-white/30">
      <CardContent className="p-4 text-center">
        <p className="text-sm text-black/80 uppercase tracking-wide mb-2">Total Time Remaining</p>
        <Badge className={`text-2xl px-6 py-3 ${getTimerColor()}`}>
          🕐 {formatTime(timeLeft)}
        </Badge>
      </CardContent>
    </Card>
  );
};

export default GameTimer;
