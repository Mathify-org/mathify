
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Clock, Zap, Shield } from 'lucide-react';
import { gameService, generateNumberWithDigits } from '@/services/additionHero/gameService';
import { MathProblem } from '@/types/additionHero';
import FallingProblem from './FallingProblem';
import GameHUD from './GameHUD';
import AnswerInput from './AnswerInput';
import ZapEffect from './ZapEffect';

interface HeroChallengeProps {
  onGameOver: () => void;
}

// Constants
const CHALLENGE_TIME = 90; // 90 seconds
const MAX_SHIELD = 100;
const BASE_POINTS = 15;
const MAX_PROBLEMS_ONSCREEN = 3;

const HeroChallenge: React.FC<HeroChallengeProps> = ({ onGameOver }) => {
  const [problems, setProblems] = useState<MathProblem[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(CHALLENGE_TIME);
  const [gameStats, setGameStats] = useState({
    score: 0,
    streak: 0,
    longestStreak: 0,
    shieldHealth: MAX_SHIELD,
    correctAnswers: 0,
    incorrectAnswers: 0
  });
  const [isGameActive, setIsGameActive] = useState(true);
  const [zapEffects, setZapEffects] = useState<{id: string, x: number, y: number}[]>([]);
  const [crashEffects, setCrashEffects] = useState<{id: string, x: number, y: number}[]>([]);
  
  // Refs
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const problemGenRef = useRef<NodeJS.Timeout | null>(null);
  
  // Initialize game
  useEffect(() => {
    // Start timer
    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          handleGameOver();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    // Start generating problems
    startGeneratingProblems();
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (problemGenRef.current) clearInterval(problemGenRef.current);
    };
  }, []);
  
  // Start generating problems
  const startGeneratingProblems = () => {
    // Clear existing interval
    if (problemGenRef.current) clearInterval(problemGenRef.current);
    
    // Generate problems periodically
    problemGenRef.current = setInterval(() => {
      // Adjust difficulty based on score and time
      let minDigits = [1, 1] as [number, number];
      let maxDigits = [2, 1] as [number, number];
      
      if (gameStats.score > 500) {
        maxDigits = [3, 2];
      } else if (gameStats.score > 300) {
        maxDigits = [2, 2];
      } else if (gameStats.score > 100) {
        maxDigits = [2, 1];
      }
      
      // Generate one new problem
      const firstNumber = generateNumberWithDigits(
        minDigits[0], 
        maxDigits[0]
      );
      
      const secondNumber = generateNumberWithDigits(
        minDigits[1], 
        maxDigits[1]
      );
      
      const newProblem: MathProblem = {
        id: `challenge-${Date.now()}-${Math.random()}`,
        firstNumber,
        secondNumber,
        operation: "+",
        correctAnswer: firstNumber + secondNumber,
        position: {
          x: 10 + Math.random() * 80, // Random x position between 10-90%
          y: -10 // Start above screen
        },
        speed: 7000 - Math.min(3000, gameStats.score / 100 * 500), // Speed increases with score
        isSolved: false
      };
      
      setProblems(prev => {
        // Only add new problem if we're below max problems onscreen
        if (prev.filter(p => !p.isSolved).length < MAX_PROBLEMS_ONSCREEN) {
          return [...prev, newProblem];
        }
        return prev;
      });
    }, 2500); // New problem every 2.5 seconds
  };
  
  // Handle problem hit the ground
  const handleProblemMissed = (problemId: string) => {
    if (!isGameActive) return;
    
    setProblems(prev => prev.map(p => 
      p.id === problemId ? { ...p, isSolved: true } : p
    ));
    
    // Create crash effect
    const problem = problems.find(p => p.id === problemId);
    if (problem) {
      const newCrash = {
        id: `crash-${Date.now()}`,
        x: problem.position.x,
        y: 90 // Near bottom of screen
      };
      setCrashEffects(prev => [...prev, newCrash]);
      
      // Remove crash effect after animation
      setTimeout(() => {
        setCrashEffects(prev => prev.filter(c => c.id !== newCrash.id));
      }, 1000);
    }
    
    // Reduce shield health
    setGameStats(prev => {
      const newShieldHealth = prev.shieldHealth - 25; // Each miss reduces shield more in challenge mode
      
      // Reset streak
      return {
        ...prev,
        shieldHealth: Math.max(0, newShieldHealth),
        streak: 0,
        incorrectAnswers: prev.incorrectAnswers + 1
      };
    });
  };
  
  // Handle correct answer
  const handleCorrectAnswer = (problemId: string) => {
    if (!isGameActive) return;
    
    // Find the problem and mark it as solved
    const problem = problems.find(p => p.id === problemId);
    if (!problem) return;
    
    setProblems(prev => prev.map(p => 
      p.id === problemId ? { ...p, isSolved: true } : p
    ));
    
    // Create zap effect
    const newZap = {
      id: `zap-${Date.now()}`,
      x: problem.position.x,
      y: problem.position.y
    };
    setZapEffects(prev => [...prev, newZap]);
    
    // Remove zap effect after animation
    setTimeout(() => {
      setZapEffects(prev => prev.filter(z => z.id !== newZap.id));
    }, 1000);
    
    // Update stats
    setGameStats(prev => {
      const newStreak = prev.streak + 1;
      const streakMultiplier = Math.min(Math.floor(newStreak / 5) + 1, 5); // Max 5x multiplier
      const points = BASE_POINTS * streakMultiplier;
      
      // Increase shield slightly with each correct answer in challenge mode
      const newShieldHealth = Math.min(prev.shieldHealth + 5, MAX_SHIELD);
      
      // Update longest streak
      const newLongestStreak = Math.max(prev.longestStreak, newStreak);
      
      return {
        ...prev,
        score: prev.score + points,
        streak: newStreak,
        longestStreak: newLongestStreak,
        shieldHealth: newShieldHealth,
        correctAnswers: prev.correctAnswers + 1
      };
    });
  };
  
  // Handle wrong answer input
  const handleWrongAnswer = () => {
    if (!isGameActive) return;
    
    // Reduce shield health
    setGameStats(prev => {
      const newShieldHealth = prev.shieldHealth - 15; // Wrong answer reduces shield
      
      // Reset streak
      return {
        ...prev,
        shieldHealth: Math.max(0, newShieldHealth),
        streak: 0,
        incorrectAnswers: prev.incorrectAnswers + 1
      };
    });
  };
  
  // Game over
  const handleGameOver = () => {
    setIsGameActive(false);
    
    // Clear intervals
    if (timerRef.current) clearInterval(timerRef.current);
    if (problemGenRef.current) clearInterval(problemGenRef.current);
    
    // Save stats
    gameService.updateHighScore("challenge", 1, gameStats.score);
    gameService.updateTotalCorrectAnswers(gameStats.correctAnswers);
    gameService.updateLongestStreak(gameStats.longestStreak);
    
    // Wait a moment before ending game
    setTimeout(() => {
      onGameOver();
    }, 1000);
  };
  
  // Format time remaining
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="relative w-full h-[80vh] bg-gradient-to-b from-amber-800 via-orange-900 to-red-900 rounded-lg overflow-hidden">
      {/* Timer */}
      <div className="absolute top-0 left-0 right-0 p-3 bg-gradient-to-b from-black/70 to-transparent z-20">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm">
            <Clock className="h-5 w-5 text-amber-400" />
            <span className="font-bold">{formatTime(timeRemaining)}</span>
          </div>
          
          <div className="flex items-center gap-2 bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm">
            <span className="font-bold">{gameStats.score}</span>
            <Zap className="h-5 w-5 text-amber-400" />
          </div>
        </div>
        
        {/* Shield meter */}
        <div className="mt-3 bg-gray-900/60 rounded-full h-3 backdrop-blur-sm">
          <motion.div 
            className={`h-full rounded-full ${
              gameStats.shieldHealth > 60 ? "bg-green-500" :
              gameStats.shieldHealth > 30 ? "bg-yellow-500" : "bg-red-500"
            }`}
            initial={{ width: `${gameStats.shieldHealth}%` }}
            animate={{ width: `${gameStats.shieldHealth}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
          <div className="flex justify-between text-xs text-white/70 mt-1">
            <div className="flex items-center">
              <Shield className="h-3 w-3 mr-1" />
              <span>Shield</span>
            </div>
            <div>{gameStats.shieldHealth}%</div>
          </div>
        </div>
      </div>
      
      {/* Falling problems */}
      {problems.map((problem) => (
        !problem.isSolved && (
          <FallingProblem
            key={problem.id}
            problem={problem}
            speed={problem.speed}
            onMissed={handleProblemMissed}
            onCorrectAnswer={handleCorrectAnswer}
          />
        )
      ))}
      
      {/* Answer input */}
      <AnswerInput
        problems={problems.filter(p => !p.isSolved)}
        onCorrectAnswer={handleCorrectAnswer}
        onWrongAnswer={handleWrongAnswer}
      />
      
      {/* Visual effects */}
      {zapEffects.map(effect => (
        <ZapEffect 
          key={effect.id} 
          x={effect.x} 
          y={effect.y} 
          streak={gameStats.streak}
        />
      ))}
      
      {crashEffects.map(effect => (
        <motion.div 
          key={effect.id}
          initial={{ opacity: 1, scale: 0.5 }}
          animate={{ opacity: 0, scale: 1.5 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute z-10 flex items-center justify-center"
          style={{ left: `${effect.x}%`, top: `${effect.y}%` }}
        >
          <div className="w-16 h-16 rounded-full bg-red-500 opacity-50" />
          <div className="absolute text-white text-3xl font-bold">💥</div>
        </motion.div>
      ))}
    </div>
  );
};

export default HeroChallenge;
