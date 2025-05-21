
import React from 'react';
import { motion } from 'framer-motion';

interface ZapEffectProps {
  x: number;
  y: number;
  streak: number;
}

const ZapEffect: React.FC<ZapEffectProps> = ({ x, y, streak }) => {
  // Enhance visual effects based on streak level
  const getStreakSize = () => {
    if (streak >= 20) return 48;
    if (streak >= 10) return 40;
    if (streak >= 5) return 32;
    return 24;
  };

  const getStreakColor = () => {
    if (streak >= 20) return "rgba(255, 215, 0, 0.8)"; // Gold
    if (streak >= 10) return "rgba(255, 140, 0, 0.8)"; // Orange
    if (streak >= 5) return "rgba(255, 80, 80, 0.8)"; // Red
    return "rgba(100, 149, 237, 0.8)"; // Blue
  };

  return (
    <motion.div
      initial={{ scale: 0.5, opacity: 1 }}
      animate={{ scale: [0.5, 1.5, 0], opacity: [1, 1, 0] }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="absolute pointer-events-none z-20"
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      {/* Inner zap burst */}
      <motion.div
        className="absolute rounded-full"
        style={{
          backgroundColor: "white",
          width: getStreakSize(),
          height: getStreakSize(),
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)"
        }}
        animate={{
          opacity: [1, 0],
          scale: [1, 2]
        }}
        transition={{ duration: 0.5 }}
      />
      
      {/* Outer color burst */}
      <motion.div
        className="absolute rounded-full"
        style={{
          backgroundColor: getStreakColor(),
          width: getStreakSize() * 1.5,
          height: getStreakSize() * 1.5,
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)"
        }}
        animate={{
          opacity: [0.8, 0],
          scale: [0.8, 1.5]
        }}
        transition={{ duration: 0.7 }}
      />
      
      {/* Lightning icon in the middle */}
      <motion.div 
        className="absolute text-white font-bold text-2xl"
        style={{
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)"
        }}
        animate={{
          scale: [1, 1.2, 0]
        }}
        transition={{ duration: 0.5 }}
      >
        ⚡
      </motion.div>
      
      {/* Streak number */}
      {streak >= 5 && (
        <motion.div
          className="absolute text-white font-bold"
          style={{
            fontSize: streak >= 20 ? "1.5rem" : "1.2rem",
            left: "50%",
            top: "calc(50% + 30px)",
            transform: "translate(-50%, -50%)"
          }}
          animate={{
            opacity: [0, 1, 0]
          }}
          transition={{ duration: 0.7 }}
        >
          {streak}x
        </motion.div>
      )}
    </motion.div>
  );
};

export default ZapEffect;
