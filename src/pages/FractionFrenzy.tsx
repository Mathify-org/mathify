
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/sonner";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Cake, Star, Medal, Trophy, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import FractionVisual from "@/components/FractionFrenzy/FractionVisual";
import GameTimer from "@/components/FractionFrenzy/GameTimer";
import GameModeCard from "@/components/FractionFrenzy/GameModeCard";
import DifficultySelector from "@/components/FractionFrenzy/DifficultySelector";
import StatsDisplay from "@/components/FractionFrenzy/StatsDisplay";
import { FractionData, FractionType, GameMode, GameStats, Theme, Difficulty } from "@/types/fractionFrenzy";

// Game settings
const FRENZY_TIME = 60; // seconds
const SPEED_INCREASE_INTERVAL = 10; // seconds
const INITIAL_CAROUSEL_SPEED = 5000; // ms
const MIN_CAROUSEL_SPEED = 2000; // ms
const MAX_LIVES = 3;

// Helper functions for localStorage
const getStoredStats = (): GameStats => {
  const stored = localStorage.getItem('fractionFrenzyStats');
  if (stored) return JSON.parse(stored);
  return {
    bestFrenzyScore: 0,
    totalCorrect: 0,
    longestStreak: 0,
    currentStreak: 0,
    survivalModeUnlocked: false,
    selectedTheme: 'pizza'
  };
};

const saveStats = (stats: GameStats) => {
  localStorage.setItem('fractionFrenzyStats', JSON.stringify(stats));
};

const FractionFrenzy = () => {
  const [gameMode, setGameMode] = useState<GameMode>("menu");
  const [stats, setStats] = useState<GameStats>(getStoredStats);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(MAX_LIVES);
  const [timeRemaining, setTimeRemaining] = useState(FRENZY_TIME);
  const [currentFraction, setCurrentFraction] = useState<FractionData | null>(null);
  const [options, setOptions] = useState<FractionData[]>([]);
  const [carouselSpeed, setCarouselSpeed] = useState(INITIAL_CAROUSEL_SPEED);
  const [difficulty, setDifficulty] = useState<Difficulty>("mixed");
  const [showAnswer, setShowAnswer] = useState(false);
  const [showMatchType, setShowMatchType] = useState<'fraction-to-visual' | 'visual-to-fraction'>('fraction-to-visual');
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const speedIncreaseRef = useRef<NodeJS.Timeout | null>(null);
  const isMobile = useIsMobile();

  // Generate fraction data
  const generateFractionData = (difficulty: Difficulty): FractionData[] => {
    const fractions: FractionData[] = [];
    
    // Add fractions based on difficulty
    const addFraction = (numerator: number, denominator: number, type: FractionType) => {
      fractions.push({
        numerator,
        denominator,
        type,
        id: `${type}-${numerator}-${denominator}`,
        value: numerator / denominator
      });
    };
    
    if (difficulty === "halves" || difficulty === "mixed") {
      addFraction(1, 2, "half");
    }
    
    if (difficulty === "thirds" || difficulty === "mixed") {
      addFraction(1, 3, "third");
      addFraction(2, 3, "third");
    }
    
    if (difficulty === "quarters" || difficulty === "mixed") {
      addFraction(1, 4, "quarter");
      addFraction(2, 4, "quarter");
      addFraction(3, 4, "quarter");
    }
    
    if (difficulty === "mixed") {
      addFraction(1, 5, "fifth");
      addFraction(2, 5, "fifth");
      addFraction(3, 5, "fifth");
      addFraction(4, 5, "fifth");
      
      addFraction(1, 6, "sixth");
      addFraction(5, 6, "sixth");
    }
    
    return fractions;
  };

  // Get visual options for current game
  const getOptions = (current: FractionData | null, count: number = 4): FractionData[] => {
    if (!current) return [];
    
    const allOptions = generateFractionData(difficulty);
    
    // Filter out the current fraction from options
    const otherOptions = allOptions.filter(
      f => !(f.numerator === current.numerator && f.denominator === current.denominator)
    );
    
    // Shuffle and take required number of options
    const shuffled = otherOptions.sort(() => 0.5 - Math.random());
    const selectedOptions = shuffled.slice(0, count - 1);
    
    // Add the correct answer and shuffle again
    return [...selectedOptions, current].sort(() => 0.5 - Math.random());
  };

  // Start a new round
  const startNewRound = () => {
    const fractions = generateFractionData(difficulty);
    const randomIndex = Math.floor(Math.random() * fractions.length);
    const newFraction = fractions[randomIndex];
    
    // Randomly switch between fraction-to-visual and visual-to-fraction
    const newMatchType = Math.random() > 0.5 ? 'fraction-to-visual' : 'visual-to-fraction';
    setShowMatchType(newMatchType);
    
    setCurrentFraction(newFraction);
    setOptions(getOptions(newFraction));
    setShowAnswer(false);
  };

  // Answer handler
  const handleAnswer = (selected: FractionData) => {
    if (!currentFraction || showAnswer) return;
    
    const isCorrect = selected.numerator === currentFraction.numerator && 
                      selected.denominator === currentFraction.denominator;
    
    // Update score based on game mode
    if (gameMode === "frenzy") {
      setScore(prev => isCorrect ? prev + 1 : Math.max(0, prev - 1));
    } else if (gameMode === "survival" && !isCorrect) {
      setLives(prev => prev - 1);
    } else if (gameMode === "practice") {
      // In practice mode, just track correct answers for stats
      if (isCorrect) {
        setStats(prev => ({
          ...prev,
          totalCorrect: prev.totalCorrect + 1
        }));
      }
    }
    
    // Update streak
    setStats(prev => {
      const newStats = {
        ...prev,
        totalCorrect: isCorrect ? prev.totalCorrect + 1 : prev.totalCorrect,
        currentStreak: isCorrect ? prev.currentStreak + 1 : 0,
      };
      
      // Update longest streak if current streak exceeds it
      if (newStats.currentStreak > prev.longestStreak) {
        newStats.longestStreak = newStats.currentStreak;
      }
      
      return newStats;
    });
    
    // Show feedback
    setShowAnswer(true);
    if (isCorrect) {
      toast.success("Correct!", { position: "top-center" });
    } else {
      toast.error("Not quite!", { position: "top-center" });
    }
    
    // Move to next round after a delay
    setTimeout(() => {
      if (gameMode === "survival" && !isCorrect && lives <= 1) {
        // Game over in survival mode
        endGame();
      } else {
        startNewRound();
      }
    }, 1200);
  };

  // Start game
  const startGame = (mode: GameMode) => {
    setGameMode(mode);
    setScore(0);
    setLives(MAX_LIVES);
    setCarouselSpeed(INITIAL_CAROUSEL_SPEED);
    
    if (mode === "frenzy") {
      setTimeRemaining(FRENZY_TIME);
      // Set up timer for Frenzy Mode
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            endGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      // Set up speed increase interval
      speedIncreaseRef.current = setInterval(() => {
        setCarouselSpeed(prev => Math.max(MIN_CAROUSEL_SPEED, prev - 500));
      }, SPEED_INCREASE_INTERVAL * 1000);
    }
    
    startNewRound();
  };

  // End game
  const endGame = () => {
    // Clear timers
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    if (speedIncreaseRef.current) {
      clearInterval(speedIncreaseRef.current);
      speedIncreaseRef.current = null;
    }
    
    // Update stats
    setStats(prev => {
      const newStats = { ...prev };
      
      if (gameMode === "frenzy" && score > prev.bestFrenzyScore) {
        newStats.bestFrenzyScore = score;
        
        // Unlock survival mode after reaching 15 points
        if (score >= 15) {
          newStats.survivalModeUnlocked = true;
        }
        
        // Show celebration for new high score
        setTimeout(() => {
          toast.success("New High Score! 🎉", { 
            position: "top-center",
            duration: 5000
          });
        }, 500);
      }
      
      return newStats;
    });
    
    // Return to menu
    setGameMode("menu");
  };

  // Save stats when updated
  useEffect(() => {
    saveStats(stats);
  }, [stats]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (speedIncreaseRef.current) clearInterval(speedIncreaseRef.current);
    };
  }, []);

  // Game UI based on mode
  if (gameMode === "menu") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-8 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-6">
            <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 bg-clip-text text-transparent mb-4">
              Fraction Frenzy
            </h1>
            <p className="text-slate-600 max-w-xl mx-auto text-lg">
              Match fractions with their visual representations in this fast-paced math game!
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <GameModeCard 
              title="Frenzy Mode" 
              icon={<Cake className="h-8 w-8 text-pink-500" />}
              description="60 seconds to match as many as possible. Speed increases every 10 seconds!"
              onClick={() => startGame("frenzy")}
            />
            
            <GameModeCard 
              title="Practice Mode" 
              icon={<Star className="h-8 w-8 text-amber-500" />}
              description="Unlimited time, no pressure. Perfect for learning fractions at your own pace."
              onClick={() => startGame("practice")}
            />
            
            <GameModeCard 
              title="Survival Mode" 
              icon={<Trophy className="h-8 w-8 text-emerald-500" />}
              description="3 lives. One mistake = lose a life. How far can you go?"
              onClick={() => startGame("survival")}
              disabled={!stats.survivalModeUnlocked}
              lockedMessage="Score at least 15 points in Frenzy Mode to unlock!"
            />
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg max-w-2xl mx-auto">
            <Tabs defaultValue="stats">
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="stats">My Stats</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              
              <TabsContent value="stats">
                <StatsDisplay stats={stats} />
              </TabsContent>
              
              <TabsContent value="settings">
                <h2 className="text-xl font-semibold mb-4">Game Settings</h2>
                <DifficultySelector 
                  difficulty={difficulty} 
                  onChange={setDifficulty} 
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    );
  }
  
  // Active gameplay UI
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-6 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-xl md:text-3xl font-bold text-purple-700">
              {gameMode === "frenzy" ? "Frenzy Mode" : 
               gameMode === "survival" ? "Survival Mode" : "Practice Mode"}
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            {gameMode === "frenzy" && (
              <GameTimer 
                timeRemaining={timeRemaining} 
                totalTime={FRENZY_TIME}
              />
            )}
            
            {gameMode === "survival" && (
              <div className="flex items-center gap-1">
                {[...Array(MAX_LIVES)].map((_, i) => (
                  <div 
                    key={i}
                    className={cn(
                      "w-5 h-5 rounded-full",
                      i < lives ? "bg-red-500" : "bg-gray-300"
                    )}
                  />
                ))}
              </div>
            )}
            
            {gameMode !== "practice" && (
              <div className="bg-white px-4 py-2 rounded-lg shadow-md">
                <span className="font-bold text-lg text-purple-700">{score}</span>
              </div>
            )}
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={endGame}
            >
              Exit
            </Button>
          </div>
        </div>
        
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="text-center mb-6">
              {showMatchType === 'fraction-to-visual' ? (
                <>
                  <p className="text-lg text-slate-600 mb-2">Find the visual that matches:</p>
                  <div className="text-4xl md:text-6xl font-bold">
                    {currentFraction?.numerator}/{currentFraction?.denominator}
                  </div>
                </>
              ) : (
                <>
                  <p className="text-lg text-slate-600 mb-2">Find the fraction that matches:</p>
                  <div className="flex justify-center">
                    <FractionVisual 
                      fraction={currentFraction} 
                      theme={stats.selectedTheme as Theme}
                      size="large" 
                    />
                  </div>
                </>
              )}
            </div>
            
            <AnimatePresence mode="wait">
              <motion.div
                key={currentFraction?.id || 'options'}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {showMatchType === 'fraction-to-visual' ? (
                  <Carousel
                    opts={{
                      align: "center",
                      loop: true,
                    }}
                    className="w-full"
                  >
                    <CarouselContent>
                      {options.map((option) => (
                        <CarouselItem key={option.id} className="md:basis-1/2 lg:basis-1/3">
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Card 
                              className={cn(
                                "cursor-pointer transition-all border-2",
                                showAnswer && currentFraction?.id === option.id ? "border-green-500 shadow-lg" : "border-transparent"
                              )}
                              onClick={() => handleAnswer(option)}
                            >
                              <CardContent className="flex justify-center items-center p-4">
                                <FractionVisual 
                                  fraction={option}
                                  theme={stats.selectedTheme as Theme} 
                                  size="medium"
                                />
                              </CardContent>
                            </Card>
                          </motion.div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <div className="flex justify-center gap-2 mt-4">
                      <CarouselPrevious className="static" />
                      <CarouselNext className="static" />
                    </div>
                  </Carousel>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    {options.map((option) => (
                      <motion.div
                        key={option.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          className={cn(
                            "w-full h-16 text-2xl",
                            showAnswer && currentFraction?.id === option.id ? "bg-green-500 hover:bg-green-600" : ""
                          )}
                          onClick={() => handleAnswer(option)}
                        >
                          {option.numerator}/{option.denominator}
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </CardContent>
        </Card>
        
        {gameMode === "practice" && (
          <div className="flex justify-center">
            <Button onClick={() => startNewRound()}>Next Question</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FractionFrenzy;
