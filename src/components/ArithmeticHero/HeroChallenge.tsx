import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gameService } from '@/services/arithmeticHero/gameService';
import { MathProblem, GameStats, OperationType, PowerupType } from '@/types/arithmeticHero';
import { AnswerMethod } from '@/types/arithmeticHero';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Timer, Star, Shield, Clock, Zap } from 'lucide-react';
import FallingProblem from './FallingProblem';
import AnswerInput from './AnswerInput';
import GameHUD from './GameHUD';
import ZapEffect from './ZapEffect';
import PowerupNotification from './PowerupNotification';

interface HeroChallengeProps {
  onGameOver: () => void;
}

const CHALLENGE_DURATION = 90; // 90 seconds
const SHIELD_MAX_HEALTH = 100;

const HeroChallenge: React.FC<HeroChallengeProps> = ({ onGameOver }) => {
  const [timeRemaining, setTimeRemaining] = useState<number>(CHALLENGE_DURATION);
  const [gameState, setGameState] = useState<"ready" | "playing" | "gameover">("ready");
  const [problems, setProblems] = useState<MathProblem[]>([]);
  const [stats, setStats] = useState<GameStats>({
    score: 0,
    streak: 0,
    longestStreak: 0,
    shieldHealth: SHIELD_MAX_HEALTH,
    correctAnswers: 0,
    incorrectAnswers: 0
  });
  const [answerMethod, setAnswerMethod] = useState<AnswerMethod>("type");
  const [difficulty, setDifficulty] = useState<1 | 2 | 3>(1);
  const [activeZapEffects, setActiveZapEffects] = useState<{id: string, x: number, y: number, streak: number}[]>([]);
  const [activePowerup, setActivePowerup] = useState<{type: PowerupType, remaining: number} | null>(null);
  const [showPowerupNotification, setShowPowerupNotification] = useState<PowerupType | null>(null);
  const [currentWave, setCurrentWave] = useState<number>(1);
  
  // Refs to store timer and interval IDs
  const problemTimerRef = useRef<NodeJS.Timeout | null>(null);
  const gameTimerRef = useRef<NodeJS.Timeout | null>(null);
  const powerupTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Dynamic difficulty adjustment
  const getDifficulty = () => {
    // Increase difficulty as time passes
    if (timeRemaining <= 30) return 3;
    if (timeRemaining <= 60) return 2;
    return 1;
  };
  
  // Generate problems for challenge mode
  const generateChallengeProblems = () => {
    const currentDifficulty = getDifficulty();
    const availableOperations: OperationType[] = 
      currentDifficulty === 1 ? ["+", "-"] : 
      currentDifficulty === 2 ? ["+", "-", "×"] : 
      ["+", "-", "×", "÷"];
    
    const minDigits = currentDifficulty === 1 ? [1, 1] : 
                       currentDifficulty === 2 ? [2, 1] : [2, 2];
    const maxDigits = currentDifficulty === 1 ? [2, 1] : 
                       currentDifficulty === 2 ? [2, 2] : [3, 2];
    
    // Create 1-3 problems based on difficulty
    const count = currentDifficulty;
    
    // Create new problems
    const newProblems: MathProblem[] = Array.from({length: count}).map((_, idx) => {
      const operation = availableOperations[Math.floor(Math.random() * availableOperations.length)];
      
      let firstNumber = gameService.generateNumberWithDigits(minDigits[0], maxDigits[0]);
      let secondNumber = gameService.generateNumberWithDigits(minDigits[1], maxDigits[1]);
      
      // Special handling for different operations
      if (operation === "-") {
        // Ensure first number is >= second number to avoid negative results
        if (firstNumber < secondNumber) {
          [firstNumber, secondNumber] = [secondNumber, firstNumber];
        }
      }
      
      if (operation === "÷") {
        // Make sure division results in a whole number by working backwards
        secondNumber = Math.max(2, secondNumber % 12 || 2);
        firstNumber = secondNumber * (Math.floor(Math.random() * 10) + 1);
      }
      
      const correctAnswer = gameService.calculateResult(firstNumber, secondNumber, operation);
      
      // Determine if this should be a powerup (10% chance)
      const isPowerup = Math.random() < 0.1;
      
      // Select a powerup type if this is a powerup
      let powerupType: PowerupType | undefined = undefined;
      if (isPowerup) {
        const powerupTypes: PowerupType[] = ["slowMotion", "doublePoints", "shield", "multiZap"];
        powerupType = powerupTypes[Math.floor(Math.random() * powerupTypes.length)];
      }
      
      return {
        id: `challenge-${Date.now()}-${idx}`,
        firstNumber,
        secondNumber,
        operation,
        correctAnswer,
        position: {
          x: 15 + (idx * 30) + (Math.random() * 10), // Distribute across screen
          y: -10
        },
        options: answerMethod === "multichoice" ? gameService.generateOptions(correctAnswer) : undefined,
        speed: 4000 + (Math.random() * 1000), // Random speed between 4-5 seconds
        isSolved: false,
        // Add powerups with small chance 
        isPowerup,
        powerupType
      };
    });
    
    return newProblems;
  };
  
  // Start the challenge
  const startChallenge = () => {
    setGameState("playing");
    setTimeRemaining(CHALLENGE_DURATION);
    setStats({
      score: 0,
      streak: 0,
      longestStreak: 0,
      shieldHealth: SHIELD_MAX_HEALTH,
      correctAnswers: 0,
      incorrectAnswers: 0
    });
    
    // Start game timer
    gameTimerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          endChallenge();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    // Generate initial problems
    setProblems(generateChallengeProblems());
    
    // Setup problem generation timer
    problemTimerRef.current = setInterval(() => {
      setDifficulty(getDifficulty());
      setProblems(prev => {
        // Only add new problems if we have less than 5 active ones
        if (prev.filter(p => !p.isSolved).length < 5) {
          return [...prev, ...generateChallengeProblems()];
        }
        return prev;
      });
    }, 3000);
  };
  
  // End the challenge
  const endChallenge = () => {
    setGameState("gameover");
    
    // Clear all timers
    if (gameTimerRef.current) clearInterval(gameTimerRef.current);
    if (problemTimerRef.current) clearInterval(problemTimerRef.current);
    if (powerupTimerRef.current) clearInterval(powerupTimerRef.current);
    
    // Update high score
    gameService.updateHighScore("challenge", 1, stats.score);
    gameService.updateTotalCorrectAnswers(stats.correctAnswers);
    gameService.updateLongestStreak(stats.longestStreak);
    
    // Trigger game over callback
    onGameOver();
  };
  
  // Handle correct answer
  const handleCorrectAnswer = (problemId: string) => {
    // Update problems to mark this one as solved
    setProblems(prev => 
      prev.map(p => p.id === problemId ? {...p, isSolved: true} : p)
    );
    
    // Find the problem to get its position and powerup status
    const problem = problems.find(p => p.id === problemId);
    if (!problem) return;
    
    // Calculate score based on streak and powerups
    const streakMultiplier = Math.min(5, 1 + Math.floor(stats.streak / 5) * 0.5);
    const pointsPerProblem = 10;
    const basePoints = Math.ceil(pointsPerProblem * streakMultiplier);
    const doublePoints = activePowerup?.type === "doublePoints" ? 2 : 1;
    const points = basePoints * doublePoints;
    
    // Add zap effect at the problem's position
    const newZap = {
      id: `zap-${Date.now()}`,
      x: problem.position.x,
      y: problem.position.y,
      streak: stats.streak + 1
    };
    setActiveZapEffects(prev => [...prev, newZap]);
    
    // Remove the zap effect after animation completes
    setTimeout(() => {
      setActiveZapEffects(prev => prev.filter(z => z.id !== newZap.id));
    }, 800);
    
    // Check for powerup
    if (problem.isPowerup && problem.powerupType) {
      activatePowerup(problem.powerupType);
    }
    
    // Update game stats
    setStats(prev => {
      const newStreak = prev.streak + 1;
      return {
        ...prev,
        score: prev.score + points,
        streak: newStreak,
        longestStreak: Math.max(prev.longestStreak, newStreak),
        correctAnswers: prev.correctAnswers + 1
      };
    });
  };
  
  // Handle missed problem
  const handleMissedProblem = (problemId: string) => {
    // Find the problem to get its position
    const problem = problems.find(p => p.id === problemId);
    if (!problem || problem.isSolved) return;
    
    // Mark problem as solved so it's removed
    setProblems(prev => 
      prev.map(p => p.id === problemId ? {...p, isSolved: true} : p)
    );
    
    // Reduce shield health
    const damageAmount = 20; // Each missed problem does 20% damage
    
    // Update stats
    setStats(prev => {
      const newHealth = Math.max(0, prev.shieldHealth - damageAmount);
      
      // Check for game over
      if (newHealth <= 0 && timeRemaining > 0) {
        // Don't end game in challenge mode, just reset streak
        return {
          ...prev,
          shieldHealth: SHIELD_MAX_HEALTH, // Reset shield
          streak: 0, // Reset streak
          incorrectAnswers: prev.incorrectAnswers + 1
        };
      }
      
      return {
        ...prev,
        shieldHealth: newHealth,
        streak: 0, // Reset streak on miss
        incorrectAnswers: prev.incorrectAnswers + 1
      };
    });
  };
  
  // Activate powerup
  const activatePowerup = (type: PowerupType) => {
    let duration: number;
    
    switch (type) {
      case "slowMotion":
        duration = 15; // 15 seconds of slow motion
        break;
      case "doublePoints":
        duration = 20; // 20 seconds of double points
        break;
      case "shield":
        // Immediately add shield rather than over time
        setStats(prev => ({
          ...prev,
          shieldHealth: Math.min(100, prev.shieldHealth + 30)
        }));
        duration = 0;
        break;
      case "multiZap":
        // Immediately solve all visible problems
        setProblems(prev => {
          const unsolved = prev.filter(p => !p.isSolved);
          
          // Add zap effects for each solved problem
          unsolved.forEach(problem => {
            const newZap = {
              id: `multizap-${Date.now()}-${problem.id}`,
              x: problem.position.x,
              y: problem.position.y,
              streak: stats.streak
            };
            
            setActiveZapEffects(prev => [...prev, newZap]);
            
            // Remove each zap effect after animation
            setTimeout(() => {
              setActiveZapEffects(prev => 
                prev.filter(z => z.id !== newZap.id)
              );
            }, 800);
          });
          
          // Give points for each solved problem
          if (unsolved.length > 0) {
            const basePoints = 5 * unsolved.length; // Less points than manual solving
            const doublePoints = activePowerup?.type === "doublePoints" ? 2 : 1;
            
            setStats(prev => ({
              ...prev,
              score: prev.score + (basePoints * doublePoints),
              correctAnswers: prev.correctAnswers + unsolved.length
            }));
          }
          
          return prev.map(p => p.isSolved ? p : {...p, isSolved: true});
        });
        duration = 0;
        break;
      default:
        duration = 0;
    }
    
    // Show notification
    setShowPowerupNotification(type);
    setTimeout(() => setShowPowerupNotification(null), 3000);
    
    if (duration > 0) {
      // Clear existing powerup timer
      if (powerupTimerRef.current) {
        clearInterval(powerupTimerRef.current);
      }
      
      // Set active powerup
      setActivePowerup({type, remaining: duration});
      
      // Create countdown timer
      powerupTimerRef.current = setInterval(() => {
        setActivePowerup(prev => {
          if (!prev) return null;
          if (prev.remaining <= 1) {
            clearInterval(powerupTimerRef.current!);
            return null;
          }
          return {...prev, remaining: prev.remaining - 1};
        });
      }, 1000);
    }
  };
  
  // Handle wrong answer input
  const handleWrongAnswer = () => {
    // Reduce shield health less severely than a complete miss
    setStats(prev => {
      const newShieldHealth = prev.shieldHealth - 10; // Wrong answer reduces shield by 10%
      
      // Reset streak
      return {
        ...prev,
        shieldHealth: Math.max(0, newShieldHealth),
        streak: 0,
        incorrectAnswers: prev.incorrectAnswers + 1
      };
    });
  };
  
  // Effects
  useEffect(() => {
    // Update difficulty based on time
    setDifficulty(getDifficulty());
    
    // Clean up all timers on unmount
    return () => {
      if (gameTimerRef.current) clearInterval(gameTimerRef.current);
      if (problemTimerRef.current) clearInterval(problemTimerRef.current);
      if (powerupTimerRef.current) clearInterval(powerupTimerRef.current);
    };
  }, [timeRemaining]);
  
  // Render the ready screen
  if (gameState === "ready") {
    return (
      <div className="container max-w-lg mx-auto p-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/10 backdrop-blur-sm rounded-lg p-6 shadow-xl"
        >
          <h2 className="text-3xl font-bold mb-4">Hero Challenge</h2>
          <p className="mb-6">Solve as many equations as you can in 90 seconds!</p>
          
          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-center space-x-2">
              <Timer className="h-5 w-5 text-blue-300" />
              <span>90 second time limit</span>
            </div>
            
            <div className="flex items-center justify-center space-x-2">
              <Star className="h-5 w-5 text-yellow-300" />
              <span>Increasing difficulty as time passes</span>
            </div>
            
            <div className="flex items-center justify-center space-x-2">
              <Shield className="h-5 w-5 text-green-300" />
              <span>Shield resets when depleted</span>
            </div>
            
            <div className="flex items-center justify-center space-x-2">
              <Zap className="h-5 w-5 text-purple-300" />
              <span>Look for special powerup equations!</span>
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-orange-500 to-amber-500 text-white py-3 px-6 rounded-lg font-bold text-lg shadow-lg"
            onClick={startChallenge}
          >
            Begin Challenge
          </motion.button>
        </motion.div>
      </div>
    );
  }
  
  return (
    <div className="relative w-full h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-pink-900 overflow-hidden">
      {/* Game area with falling problems */}
      <div className="relative w-full h-full">
        {/* HUD */}
        <div className="absolute top-0 left-0 w-full z-10 px-4 py-2">
          <GameHUD 
            score={stats.score} 
            streak={stats.streak} 
            level={difficulty} 
            shieldHealth={stats.shieldHealth} 
            wave={currentWave}
            maxShield={SHIELD_MAX_HEALTH}
            activePowerups={activePowerup ? [{ type: activePowerup.type, endTime: Date.now() + (activePowerup.remaining * 1000) }] : []}
          />
          
          {/* Timer */}
          <div className="mt-2 flex justify-between items-center">
            <Badge 
              variant="outline" 
              className="text-lg font-mono bg-black/30 text-white py-1 px-2"
            >
              <Timer className="h-4 w-4 mr-1" />
              {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
            </Badge>
            
            {/* Active powerup */}
            {activePowerup && (
              <Badge 
                variant="outline" 
                className="text-lg bg-purple-500/50 text-white py-1 px-2"
              >
                {activePowerup.type === "slowMotion" && <Clock className="h-4 w-4 mr-1 text-blue-300" />}
                {activePowerup.type === "doublePoints" && <Star className="h-4 w-4 mr-1 text-yellow-300" />}
                <span>{activePowerup.remaining}s</span>
              </Badge>
            )}
          </div>
        </div>
        
        {/* Falling math problems */}
        <AnimatePresence>
          {problems.filter(p => !p.isSolved).map(problem => (
            <FallingProblem
              key={problem.id}
              problem={problem}
              speed={problem.speed}
              onMissed={() => handleMissedProblem(problem.id)}
              onCorrectAnswer={() => handleCorrectAnswer(problem.id)}
            />
          ))}
        </AnimatePresence>
        
        {/* Answer input */}
        <div className="absolute bottom-0 left-0 w-full z-10 p-4">
          <AnswerInput
            problems={problems.filter(p => !p.isSolved)}
            onCorrectAnswer={handleCorrectAnswer}
            onWrongAnswer={handleWrongAnswer}
          />
        </div>
        
        {/* Powerup notification */}
        <AnimatePresence>
          {showPowerupNotification && (
            <PowerupNotification type={showPowerupNotification} />
          )}
        </AnimatePresence>
        
        {/* Visual effects */}
        {activeZapEffects.map(zapEffect => (
          <ZapEffect
            key={zapEffect.id}
            x={zapEffect.x}
            y={zapEffect.y}
            streak={zapEffect.streak}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroChallenge;
