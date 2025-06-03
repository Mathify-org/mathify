
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface SpaceBackgroundProps {
  isWarpActive: boolean;
}

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
}

const SpaceBackground: React.FC<SpaceBackgroundProps> = ({ isWarpActive }) => {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    // Generate stars
    const newStars: Star[] = [];
    for (let i = 0; i < 100; i++) {
      newStars.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        speed: Math.random() * 2 + 0.5,
      });
    }
    setStars(newStars);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Animated star field */}
      {stars.map((star) => (
        <div
          key={star.id}
          className={cn(
            "absolute rounded-full bg-white animate-pulse",
            isWarpActive && "animate-ping"
          )}
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${star.speed}s`,
          }}
        />
      ))}

      {/* Nebula effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-blue-900/20 to-indigo-900/30" />
      
      {/* Warp effect overlay */}
      {isWarpActive && (
        <div className="absolute inset-0 bg-gradient-to-b from-yellow-400/10 to-orange-400/10 animate-pulse" />
      )}
    </div>
  );
};

export default SpaceBackground;
