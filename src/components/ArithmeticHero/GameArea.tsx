
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Zap, Star } from 'lucide-react';
import { gameService, levels } from '@/services/arithmeticHero/gameService';
import { MathProblem, GameStats, PowerupType } from '@/types/arithmeticHero';
import FallingProblem from './FallingProblem';
import GameHUD from './GameHUD';
import AnswerInput from './AnswerInput';
import ZapEffect from './ZapEffect';
import PowerupNotification from './PowerupNotification';
import confetti from 'canvas-confetti';

interface GameAreaProps {
  level: number;
  onGameOver: () => void;
}

// Constants
const MAX_SHIELD = 100;
const MAX_PROBLEMS_ONSCREEN = 5;
const BASE_POINTS = 10;

const GameArea: React.FC<GameAreaProps> = ({ level, onGameOver }) => {
  // Game state
  const [problems, setProblems] = useState<MathProblem[]>([]);
  const [gameStats, setGameStats] = useState<GameStats>({
    score: 0,
    streak: 0,
    longestStreak: 0,
    shieldHealth: MAX_SHIELD,
    correctAnswers: 0,
    incorrectAnswers: 0
  });
  const [currentWave, setCurrentWave] = useState(1);
  const [isGameActive, setIsGameActive] = useState(true);
  const [showLevelUp, setShowLevelUp] = useState(false);
  
  // Power-ups state
  const [activePowerups, setActivePowerups] = useState<{
    type: PowerupType;
    endTime: number;
  }[]>([]);
  const [lastPowerup, setLastPowerup] = useState<PowerupType | null>(null);
  
  // Visual effects state
  const [zapEffects, setZapEffects] = useState<{id: string, x: number, y: number}[]>([]);
  const [crashEffects, setCrashEffects] = useState<{id: string, x: number, y: number}[]>([]);
  
  // Refs
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const waveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const problemIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Get current level config
  const levelConfig = levels.find(l => l.id === level) || levels[0];
  
  // Initialize game
  useEffect(() => {
    startNewWave();
    
    // Clean up timers
    return () => {
      if (waveTimerRef.current) clearTimeout(waveTimerRef.current);
      if (problemIntervalRef.current) clearInterval(problemIntervalRef.current);
    };
  }, [level]);
  
  // Handle powerups expiration
  useEffect(() => {
    if (activePowerups.length === 0) return;
    
    const interval = setInterval(() => {
      const currentTime = Date.now();
      const expired = activePowerups.filter(p => p.endTime <= currentTime);
      
      if (expired.length > 0) {
        setActivePowerups(prev => prev.filter(p => p.endTime > currentTime));
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [activePowerups]);
  
  // Start a new wave of problems
  const startNewWave = () => {
    // Don't add problems if game is over
    if (!isGameActive) return;
    
    // Clear existing timer
    if (waveTimerRef.current) clearTimeout(waveTimerRef.current);
    if (problemIntervalRef.current) clearInterval(problemIntervalRef.current);
    
    // Generate problems for this wave
    const newProblems = gameService.generateProblems(level, levelConfig.numEquationsPerWave);
    
    // Add problems one by one with a delay
    let index = 0;
    
    problemIntervalRef.current = setInterval(() => {
      if (index < newProblems.length && isGameActive) {
        setProblems(prev => {
          // Limit max problems on screen
          if (prev.filter(p => p && !p.isSolved).length < MAX_PROBLEMS_ONSCREEN) {
            return [...prev, newProblems[index]];
          }
          return prev;
        });
        index++;
      } else {
        if (problemIntervalRef.current) clearInterval(problemIntervalRef.current);
        
        // Schedule next wave after all problems are added
        const waveDelay = Math.max(levelConfig.speed * 1.5, 5000); // At least 5 seconds between waves
        waveTimerRef.current = setTimeout(() => {
          setCurrentWave(prev => prev + 1);
          startNewWave();
        }, waveDelay);
      }
    }, 1500); // Add a new problem every 1.5 seconds
  };
  
  // Handle problem hit the ground
  const handleProblemMissed = (problemId: string) => {
    if (!isGameActive) return;
    
    setProblems(prev => prev.map(p => 
      p && p.id === problemId ? { ...p, isSolved: true } : p
    ));
    
    // Create crash effect
    const problem = problems.find(p => p && p.id === problemId);
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
      const newShieldHealth = prev.shieldHealth - 20; // Each miss reduces shield by 20%
      
      // Check for game over
      if (newShieldHealth <= 0 && isGameActive) {
        handleGameOver();
        return { ...prev, shieldHealth: 0 };
      }
      
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
    
    // Find the problem to mark it as solved
    const problem = problems.find(p => p && p.id === problemId);
    if (!problem) return;
    
    setProblems(prev => prev.map(p => 
      p && p.id === problemId ? { ...p, isSolved: true } : p
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
    
    // Check for powerup
    if (problem.isPowerup && problem.powerupType) {
      activatePowerup(problem.powerupType);
    }
    
    // Update stats
    setGameStats(prev => {
      const newStreak = prev.streak + 1;
      const streakMultiplier = Math.min(Math.floor(newStreak / 5) + 1, 5); // Max 5x multiplier
      
      // Calculate points with streak multiplier and potential double points powerup
      const doublePointsActive = activePowerups.some(p => p.type === "doublePoints");
      const pointsMultiplier = doublePointsActive ? 2 : 1;
      const points = BASE_POINTS * streakMultiplier * pointsMultiplier * level;
      
      // Play confetti for big streaks
      if (newStreak % 10 === 0) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
      
      // Update longest streak
      const newLongestStreak = Math.max(prev.longestStreak, newStreak);
      if (newStreak > prev.longestStreak) {
        gameService.updateLongestStreak(newStreak);
      }
      
      return {
        ...prev,
        score: prev.score + points,
        streak: newStreak,
        longestStreak: newLongestStreak,
        correctAnswers: prev.correctAnswers + 1
      };
    });
  };
  
  // Handle wrong answer input
  const handleWrongAnswer = () => {
    if (!isGameActive) return;
    
    // Reduce shield health less severely than a complete miss
    setGameStats(prev => {
      const newShieldHealth = prev.shieldHealth - 10; // Wrong answer reduces shield by 10%
      
      // Check for game over
      if (newShieldHealth <= 0 && isGameActive) {
        handleGameOver();
        return { ...prev, shieldHealth: 0 };
      }
      
      // Reset streak
      return {
        ...prev,
        shieldHealth: Math.max(0, newShieldHealth),
        streak: 0,
        incorrectAnswers: prev.incorrectAnswers + 1
      };
    });
  };
  
  // Activate a powerup
  const activatePowerup = (type: PowerupType) => {
    // Set durations based on powerup type
    let duration = 0;
    switch (type) {
      case "slowMotion":
        duration = 15000; // 15 seconds of slow motion
        break;
      case "doublePoints":
        duration = 20000; // 20 seconds of double points
        break;
      case "shield":
        // Immediately restore shield rather than add a timed powerup
        setGameStats(prev => ({
          ...prev,
          shieldHealth: Math.min(prev.shieldHealth + 30, MAX_SHIELD)
        }));
        break;
      case "multiZap":
        // Safely handle multiZap powerup - ensure we don't access undefined properties
        setProblems(prev => {
          // Create a safe copy of problems that are valid and not solved
          const visibleProblems = prev.filter(p => p && !p.isSolved);
          
          // Process each visible problem
          visibleProblems.forEach(problem => {
            if (problem && problem.id) {
              // Clone the problem to avoid any reference issues
              const problemCopy = { ...problem };
              
              // Create a zap effect for this problem
              setZapEffects(zapEffects => [
                ...zapEffects, 
                {
                  id: `zap-multi-${Date.now()}-${problemCopy.id}`,
                  x: problemCopy.position.x,
                  y: problemCopy.position.y
                }
              ]);
              
              // Update the stats for each solved problem
              setGameStats(stats => ({
                ...stats,
                score: stats.score + BASE_POINTS * level,
                correctAnswers: stats.correctAnswers + 1
              }));
            }
          });
          
          // Mark all problems as solved
          return prev.map(p => p ? {...p, isSolved: true} : p);
        });
        break;
    }
    
    if (duration > 0) {
      setActivePowerups(prev => [
        ...prev.filter(p => p.type !== type), // Remove any existing powerup of same type
        {
          type,
          endTime: Date.now() + duration
        }
      ]);
    }
    
    // Show powerup notification
    setLastPowerup(type);
    setTimeout(() => setLastPowerup(null), 3000);
  };
  
  // Game over
  const handleGameOver = () => {
    setIsGameActive(false);
    
    // Clear timers
    if (waveTimerRef.current) clearTimeout(waveTimerRef.current);
    if (problemIntervalRef.current) clearInterval(problemIntervalRef.current);
    
    // Save stats
    gameService.updateHighScore("arcade", level, gameStats.score);
    gameService.updateTotalCorrectAnswers(gameStats.correctAnswers);
    
    // Check if player unlocked next level
    const unlocked = gameService.checkLevelProgress(level, gameStats.score);
    
    if (unlocked) {
      setShowLevelUp(true);
      // Show level up for 2 seconds before ending game
      setTimeout(() => {
        onGameOver();
      }, 2000);
    } else {
      // End game immediately
      onGameOver();
    }
  };
  
  // Calculate problem speed based on wave, powerups, etc.
  const getAdjustedSpeed = (baseSpeed: number) => {
    // Increase speed with each wave
    const waveSpeedIncrease = (currentWave - 1) * levelConfig.speedIncrease;
    let speed = baseSpeed - waveSpeedIncrease;
    
    // Apply slow motion powerup if active
    if (activePowerups.some(p => p.type === "slowMotion")) {
      speed = speed * 1.5; // 50% slower
    }
    
    // Don't let speed go below minimum
    return Math.max(speed, levelConfig.speed * 0.4);
  };

  return (
    <div 
      ref={gameAreaRef}
      className="relative w-full h-[80vh] bg-gradient-to-b from-blue-900 via-indigo-900 to-purple-900 rounded-lg overflow-hidden"
    >
      {/* Game HUD */}
      <GameHUD 
        level={level}
        wave={currentWave}
        score={gameStats.score}
        streak={gameStats.streak}
        shieldHealth={gameStats.shieldHealth}
        maxShield={MAX_SHIELD}
        activePowerups={activePowerups}
      />
      
      {/* Falling problems - add null check */}
      <AnimatePresence>
        {problems.filter(p => p !== undefined && !p.isSolved).map((problem) => (
          <FallingProblem
            key={problem.id}
            problem={problem}
            speed={getAdjustedSpeed(problem.speed)}
            onMissed={handleProblemMissed}
            onCorrectAnswer={handleCorrectAnswer}
          />
        ))}
      </AnimatePresence>
      
      {/* Answer input area - add null check */}
      <AnswerInput
        problems={problems.filter(p => p !== undefined && !p.isSolved)}
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
      
      {/* Powerup notification */}
      {lastPowerup && (
        <PowerupNotification type={lastPowerup} />
      )}
      
      {/* Level up notification */}
      {showLevelUp && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute inset-0 flex items-center justify-center bg-black/70 z-30"
        >
          <div className="text-center">
            <h2 className="text-4xl md:text-6xl font-bold text-yellow-400 mb-4">Level Unlocked!</h2>
            <div className="flex justify-center">
              <Star className="text-yellow-300 h-16 w-16" />
            </div>
            <p className="text-xl md:text-2xl text-white mt-4">Level {level + 1} is now available!</p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default GameArea;
