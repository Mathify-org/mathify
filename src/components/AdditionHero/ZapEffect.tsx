
import React from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

interface ZapEffectProps {
  x: number;
  y: number;
  streak: number;
}

const ZapEffect: React.FC<ZapEffectProps> = ({ x, y, streak }) => {
  // Determine size, color based on streak
  const getSize = () => {
    if (streak >= 20) return 'w-24 h-24 text-red-400';
    if (streak >= 10) return 'w-20 h-20 text-amber-400';
    if (streak >= 5) return 'w-16 h-16 text-yellow-400';
    return 'w-12 h-12 text-blue-400';
  };
  
  // Get animated particles based on streak
  const getParticles = () => {
    if (streak < 5) return 3;
    if (streak < 10) return 5;
    if (streak < 20) return 8;
    return 12;
  };
  
  // Create particles
  const particles = Array.from({ length: getParticles() }).map((_, i) => {
    const angle = (i / getParticles()) * 360;
    const distance = Math.random() * 40 + 20;
    const delay = Math.random() * 0.2;
    const duration = Math.random() * 0.8 + 0.5;
    const size = Math.random() * 10 + 5;
    
    return (
      <motion.div
        key={i}
        initial={{ 
          x: 0, 
          y: 0, 
          opacity: 1,
          scale: 0.3
        }}
        animate={{ 
          x: Math.cos(angle * Math.PI / 180) * distance,
          y: Math.sin(angle * Math.PI / 180) * distance,
          opacity: 0,
          scale: 1
        }}
        transition={{
          duration,
          delay,
          ease: "easeOut"
        }}
        className={`absolute rounded-full ${
          streak >= 20 ? 'bg-red-400' : 
          streak >= 10 ? 'bg-amber-400' : 
          streak >= 5 ? 'bg-yellow-400' : 'bg-blue-400'
        }`}
        style={{
          width: size,
          height: size
        }}
      />
    );
  });

  return (
    <div 
      className="absolute z-50 pointer-events-none" 
      style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
    >
      <motion.div
        initial={{ scale: 0.5, rotate: -30, opacity: 0.5 }}
        animate={{ scale: [0.5, 1.2, 1], rotate: [0, 15, 0], opacity: [0.5, 1, 0] }}
        transition={{ duration: 0.6 }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <Zap className={`${getSize()} drop-shadow-lg`} />
      </motion.div>
      
      {/* Circular glow effect */}
      <motion.div
        initial={{ scale: 0.1, opacity: 0.7 }}
        animate={{ scale: 2, opacity: 0 }}
        transition={{ duration: 0.7 }}
        className={`absolute inset-0 rounded-full ${
          streak >= 20 ? 'bg-red-400' : 
          streak >= 10 ? 'bg-amber-400' : 
          streak >= 5 ? 'bg-yellow-400' : 'bg-blue-400'
        } blur-xl`}
        style={{ width: '100%', height: '100%' }}
      />
      
      {/* Particles */}
      <div className="relative h-full w-full">
        {particles}
      </div>
    </div>
  );
};

export default ZapEffect;
