
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface TargetDisplayProps {
  target: number;
  selectedSum: number;
  className?: string;
  effect: 'correct' | 'wrong' | 'none';
}

const TargetDisplay = ({ target, selectedSum, className, effect }: TargetDisplayProps) => {
  const getEffectClass = () => {
    switch (effect) {
      case 'correct':
        return 'animate-bounce bg-gradient-to-r from-green-400 to-blue-500';
      case 'wrong':
        return 'animate-pulse bg-gradient-to-r from-red-400 to-orange-500';
      default:
        return 'bg-gradient-to-r from-purple-500 to-pink-500';
    }
  };

  return (
    <Card className={`glass-morphism border-2 border-white/30 ${getEffectClass()}`}>
      <CardContent className="p-8 text-center">
        <p className="text-xl text-white/80 mb-2 uppercase tracking-wide">Target Number</p>
        <div className="relative">
          <p className={`text-8xl font-bold ${className} relative z-10`}>
            {target}
          </p>
          {effect === 'correct' && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-6xl animate-ping">🎯</span>
            </div>
          )}
          {effect === 'wrong' && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-6xl animate-bounce">❌</span>
            </div>
          )}
        </div>
        <p className="text-lg text-white/70 mt-4">
          Tap numbers that add up to this target!
        </p>
      </CardContent>
    </Card>
  );
};

export default TargetDisplay;
