
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface DifficultyBadgeProps {
  level: number;
}

const DifficultyBadge = ({ level }: DifficultyBadgeProps) => {
  const getDifficulty = (level: number) => {
    if (level <= 3) return { name: 'Beginner', color: 'bg-green-500', emoji: '🌱' };
    if (level <= 6) return { name: 'Intermediate', color: 'bg-yellow-500', emoji: '⭐' };
    if (level <= 9) return { name: 'Advanced', color: 'bg-orange-500', emoji: '🔥' };
    return { name: 'Expert', color: 'bg-red-500', emoji: '🚀' };
  };

  const difficulty = getDifficulty(level);

  return (
    <Badge className={`${difficulty.color} text-white text-sm px-3 py-1`}>
      {difficulty.emoji} {difficulty.name}
    </Badge>
  );
};

export default DifficultyBadge;
