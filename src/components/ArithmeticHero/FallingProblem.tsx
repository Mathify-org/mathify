
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MathProblem } from '@/types/arithmeticHero';
import { Shield, Clock, Star, Zap } from 'lucide-react';

interface FallingProblemProps {
  problem: MathProblem;
  speed: number;
  onMissed: (id: string) => void;
  onCorrectAnswer: (id: string) => void;
  // Add support for the HeroChallenge usage
  onSolve?: () => void;
  onMiss?: () => void;
  answerMethod?: string;
  slowMotion?: boolean;
}

const FallingProblem: React.FC<FallingProblemProps> = ({ 
  problem,
  speed,
  onMissed,
  onCorrectAnswer,
  onSolve, // Optional prop for HeroChallenge
  onMiss,   // Optional prop for HeroChallenge
  slowMotion = false,
}) => {
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    // When animation completes, mark as missed
    if (animationComplete) {
      onMissed(problem.id);
      // Also call the optional onMiss if provided
      if (onMiss) onMiss();
    }
  }, [animationComplete, problem.id, onMissed, onMiss]);

  // Get powerup icon
  const getPowerupIcon = () => {
    switch (problem.powerupType) {
      case "slowMotion":
        return <Clock className="h-5 w-5 text-blue-300" />;
      case "doublePoints":
        return <Star className="h-5 w-5 text-yellow-300" />;
      case "shield":
        return <Shield className="h-5 w-5 text-green-300" />;
      case "multiZap":
        return <Zap className="h-5 w-5 text-purple-300" />;
      default:
        return null;
    }
  };

  const powerupIcon = problem.isPowerup ? getPowerupIcon() : null;
  
  // Different background colors based on operation or powerup
  let bgColor = "from-blue-500 to-blue-600";
  if (problem.isPowerup) {
    switch (problem.powerupType) {
      case "slowMotion":
        bgColor = "from-cyan-500 to-blue-600";
        break;
      case "doublePoints":
        bgColor = "from-amber-400 to-orange-500";
        break;
      case "shield":
        bgColor = "from-emerald-500 to-green-600";
        break;
      case "multiZap":
        bgColor = "from-violet-500 to-purple-600";
        break;
    }
  } else {
    // Color based on operation
    switch (problem.operation) {
      case "+":
        bgColor = "from-blue-500 to-blue-600";
        break;
      case "-":
        bgColor = "from-green-500 to-green-600";
        break;
      case "×":
        bgColor = "from-purple-500 to-purple-600";
        break;
      case "÷":
        bgColor = "from-orange-500 to-orange-600";
        break;
    }
  }

  // Adjust animation duration if slow motion is active
  const animationDuration = slowMotion ? speed * 1.5 / 1000 : speed / 1000;

  return (
    <motion.div
      initial={{ x: `${problem.position.x}%`, y: "-10%" }}
      animate={{ y: "100%" }}
      transition={{ 
        duration: animationDuration, // Convert ms to seconds
        ease: "linear"
      }}
      onAnimationComplete={() => setAnimationComplete(true)}
      className="absolute"
      style={{ left: `${problem.position.x}%`, transform: "translateX(-50%)" }}
    >
      <div 
        className={`px-4 py-3 rounded-xl shadow-lg bg-gradient-to-b ${bgColor} text-white 
                   border-2 border-white/20 min-w-[100px] text-center`}
      >
        {/* Problem equation */}
        <div className="font-bold text-sm sm:text-lg">
          {problem.firstNumber} {problem.operation} {problem.secondNumber}
        </div>
        
        {/* Powerup indicator if applicable */}
        {problem.isPowerup && (
          <div className="absolute -top-2 -right-2 bg-white rounded-full p-1">
            {powerupIcon}
          </div>
        )}
      </div>
      
      {/* Meteor trail effect - color based on operation */}
      <div className={`absolute left-1/2 -z-10 transform -translate-x-1/2 -top-8 w-5 h-20 
                      bg-gradient-to-t ${problem.operation === "+" ? "from-blue-500" : 
                                        problem.operation === "-" ? "from-green-500" :
                                        problem.operation === "×" ? "from-purple-500" : 
                                        "from-orange-500"} to-transparent opacity-50 rounded-full blur-sm`} />
    </motion.div>
  );
};

export default FallingProblem;
