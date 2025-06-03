
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface SpaceBackgroundProps {
  isWarpActive: boolean;
}

interface Star {
  id: number;
  x: number;
  y: number;
  z: number;
  size: number;
  speed: number;
}

const SpaceBackground: React.FC<SpaceBackgroundProps> = ({ isWarpActive }) => {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    // Generate stars with 3D positions
    const newStars: Star[] = [];
    for (let i = 0; i < 150; i++) {
      newStars.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        z: Math.random() * 1000,
        size: Math.random() * 3 + 1,
        speed: Math.random() * 2 + 0.5,
      });
    }
    setStars(newStars);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ perspective: '1000px' }}>
      {/* Animated star field with depth */}
      {stars.map((star) => {
        const depth = star.z / 1000;
        const scale = Math.max(0.1, 1 - depth);
        const opacity = Math.max(0.1, 1 - depth);
        
        return (
          <div
            key={star.id}
            className={cn(
              "absolute rounded-full bg-white animate-pulse",
              isWarpActive && "animate-ping"
            )}
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size * scale}px`,
              height: `${star.size * scale}px`,
              opacity: opacity,
              transform: `translateZ(${-star.z}px)`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${star.speed}s`,
              boxShadow: `0 0 ${star.size * scale * 2}px rgba(255,255,255,${opacity * 0.5})`
            }}
          />
        );
      })}

      {/* Multiple nebula layers for depth */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-blue-900/20 to-indigo-900/30" 
        style={{ transform: 'translateZ(-800px)' }}
      />
      
      <div 
        className="absolute inset-0 bg-gradient-to-tl from-indigo-800/25 via-purple-800/15 to-blue-800/25" 
        style={{ transform: 'translateZ(-400px)' }}
      />
      
      <div 
        className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 via-transparent to-purple-900/20" 
        style={{ transform: 'translateZ(-200px)' }}
      />
      
      {/* Warp effect overlay with 3D depth */}
      {isWarpActive && (
        <>
          <div 
            className="absolute inset-0 bg-gradient-to-b from-yellow-400/10 to-orange-400/10 animate-pulse" 
            style={{ transform: 'translateZ(-100px)' }}
          />
          <div 
            className="absolute inset-0 bg-gradient-radial from-yellow-300/15 via-transparent to-orange-300/15 animate-pulse" 
            style={{ transform: 'translateZ(-50px)' }}
          />
        </>
      )}
      
      {/* 3D Grid effect for depth perception */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          background: `
            linear-gradient(90deg, transparent 49%, rgba(100,200,255,0.3) 50%, transparent 51%),
            linear-gradient(0deg, transparent 49%, rgba(100,200,255,0.3) 50%, transparent 51%)
          `,
          backgroundSize: '100px 100px',
          transform: 'translateZ(-600px) rotateX(60deg)',
          transformOrigin: 'bottom center'
        }}
      />
    </div>
  );
};

export default SpaceBackground;
