import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Wallet, PiggyBank, ShoppingCart, Gamepad2, Book, Heart, Star, Trophy, Sparkles, Check, X, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  description: string;
  minPercent: number;
  maxPercent: number;
}

interface Challenge {
  id: number;
  title: string;
  description: string;
  totalBudget: number;
  categories: string[];
  goal: string;
  targetAllocations: { [key: string]: { min: number; max: number } };
  hint: string;
}

const allCategories: Category[] = [
  { id: 'savings', name: 'Savings', icon: <PiggyBank className="h-6 w-6" />, color: 'from-emerald-400 to-green-500', description: 'Money saved for the future', minPercent: 10, maxPercent: 50 },
  { id: 'needs', name: 'Needs', icon: <ShoppingCart className="h-6 w-6" />, color: 'from-blue-400 to-indigo-500', description: 'Essential items like food & clothes', minPercent: 30, maxPercent: 60 },
  { id: 'fun', name: 'Fun', icon: <Gamepad2 className="h-6 w-6" />, color: 'from-pink-400 to-rose-500', description: 'Games, toys, and entertainment', minPercent: 5, maxPercent: 30 },
  { id: 'education', name: 'Education', icon: <Book className="h-6 w-6" />, color: 'from-violet-400 to-purple-500', description: 'Books, courses, and learning', minPercent: 5, maxPercent: 30 },
  { id: 'charity', name: 'Charity', icon: <Heart className="h-6 w-6" />, color: 'from-red-400 to-pink-500', description: 'Helping others in need', minPercent: 0, maxPercent: 20 },
];

const challenges: Challenge[] = [
  {
    id: 1,
    title: "Beginner Budget",
    description: "You received £20 for your birthday! Create a simple budget.",
    totalBudget: 20,
    categories: ['savings', 'fun'],
    goal: "Save at least 25% and have some fun!",
    targetAllocations: { savings: { min: 25, max: 100 }, fun: { min: 0, max: 75 } },
    hint: "Try putting £5 or more into savings first!"
  },
  {
    id: 2,
    title: "Weekly Allowance",
    description: "You get £10 weekly allowance. Plan wisely!",
    totalBudget: 10,
    categories: ['savings', 'needs', 'fun'],
    goal: "Save at least 20%, cover needs, and have fun!",
    targetAllocations: { savings: { min: 20, max: 50 }, needs: { min: 30, max: 50 }, fun: { min: 10, max: 40 } },
    hint: "Balance is key - don't spend everything on fun!"
  },
  {
    id: 3,
    title: "Holiday Money",
    description: "You saved £50 from holiday gifts. Budget it all!",
    totalBudget: 50,
    categories: ['savings', 'needs', 'fun', 'education'],
    goal: "Save 30%+, learn something new, and enjoy!",
    targetAllocations: { savings: { min: 30, max: 60 }, needs: { min: 10, max: 30 }, fun: { min: 10, max: 30 }, education: { min: 10, max: 30 } },
    hint: "Education investments pay off in the long run!"
  },
  {
    id: 4,
    title: "Generous Heart",
    description: "You earned £30 helping neighbours. Share the love!",
    totalBudget: 30,
    categories: ['savings', 'fun', 'charity'],
    goal: "Save 20%+, give 10%+ to charity, enjoy the rest!",
    targetAllocations: { savings: { min: 20, max: 50 }, fun: { min: 20, max: 50 }, charity: { min: 10, max: 30 } },
    hint: "Giving feels as good as receiving!"
  },
  {
    id: 5,
    title: "Master Budgeter",
    description: "You have £100 to manage. Show your skills!",
    totalBudget: 100,
    categories: ['savings', 'needs', 'fun', 'education', 'charity'],
    goal: "Balance all 5 categories wisely!",
    targetAllocations: { savings: { min: 20, max: 40 }, needs: { min: 25, max: 40 }, fun: { min: 10, max: 25 }, education: { min: 10, max: 20 }, charity: { min: 5, max: 15 } },
    hint: "A master budgeter thinks about ALL their priorities!"
  }
];

const BudgetBuilder = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [allocations, setAllocations] = useState<{ [key: string]: number }>({});
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const [completedChallenges, setCompletedChallenges] = useState<number[]>([]);

  const challenge = challenges[currentChallenge];
  const activeCategories = allCategories.filter(c => challenge?.categories.includes(c.id));

  useEffect(() => {
    if (challenge) {
      const initialAllocations: { [key: string]: number } = {};
      challenge.categories.forEach(cat => {
        initialAllocations[cat] = 0;
      });
      setAllocations(initialAllocations);
    }
  }, [currentChallenge, gameStarted]);

  const totalAllocated = Object.values(allocations).reduce((sum, val) => sum + val, 0);
  const remaining = (challenge?.totalBudget || 0) - totalAllocated;

  const adjustAllocation = (categoryId: string, change: number) => {
    const newValue = Math.max(0, Math.min(challenge.totalBudget, (allocations[categoryId] || 0) + change));
    const newTotal = totalAllocated - (allocations[categoryId] || 0) + newValue;
    
    if (newTotal <= challenge.totalBudget) {
      setAllocations({ ...allocations, [categoryId]: newValue });
    }
  };

  const setAllocationPercent = (categoryId: string, percent: number) => {
    const value = Math.round((percent / 100) * challenge.totalBudget);
    const newTotal = totalAllocated - (allocations[categoryId] || 0) + value;
    
    if (newTotal <= challenge.totalBudget) {
      setAllocations({ ...allocations, [categoryId]: value });
    }
  };

  const checkBudget = () => {
    if (remaining !== 0) return;

    let correct = true;
    let earnedPoints = 0;

    Object.entries(challenge.targetAllocations).forEach(([catId, target]) => {
      const allocated = allocations[catId] || 0;
      const percent = (allocated / challenge.totalBudget) * 100;
      
      if (percent >= target.min && percent <= target.max) {
        earnedPoints += 20;
      } else {
        correct = false;
      }
    });

    if (correct) {
      earnedPoints += 50; // Bonus for completing correctly
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }

    setScore(earnedPoints);
    setIsCorrect(correct);
    setShowResult(true);
    
    if (correct) {
      setTotalScore(prev => prev + earnedPoints);
      setCompletedChallenges(prev => [...prev, challenge.id]);
    }
  };

  const nextChallenge = () => {
    if (currentChallenge < challenges.length - 1) {
      setCurrentChallenge(prev => prev + 1);
      setShowResult(false);
    }
  };

  const resetChallenge = () => {
    const initialAllocations: { [key: string]: number } = {};
    challenge.categories.forEach(cat => {
      initialAllocations[cat] = 0;
    });
    setAllocations(initialAllocations);
    setShowResult(false);
  };

  const startGame = () => {
    setGameStarted(true);
    setCurrentChallenge(0);
    setTotalScore(0);
    setCompletedChallenges([]);
  };

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white p-4 md:p-6">
          <div className="container mx-auto">
            <div className="flex items-center gap-3 md:gap-4">
              <Link to="/" className="hover:bg-white/20 p-2 rounded-lg transition-colors">
                <ArrowLeft className="h-5 w-5 md:h-6 md:w-6" />
              </Link>
              <div>
                <h1 className="text-xl md:text-4xl font-bold flex items-center gap-2 md:gap-3 pb-1">
                  <Wallet className="h-6 w-6 md:h-8 md:w-8" />
                  Budget Builder
                </h1>
                <p className="text-emerald-100 text-sm md:text-lg">Learn to manage money wisely!</p>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto p-4 md:p-6 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-8 md:py-16"
          >
            <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full mx-auto mb-6 md:mb-8 flex items-center justify-center shadow-2xl">
              <PiggyBank className="h-12 w-12 md:h-16 md:w-16 text-white" />
            </div>
            
            <h2 className="text-2xl md:text-5xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Welcome to Budget Builder!
            </h2>
            
            <p className="text-base md:text-xl text-gray-600 max-w-2xl mx-auto mb-6 md:mb-8 px-4">
              Learn how to allocate money wisely across different categories. 
              Complete challenges to become a master budgeter!
            </p>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4 max-w-3xl mx-auto mb-8 md:mb-12 px-4">
              {allCategories.map((cat) => (
                <div key={cat.id} className="text-center">
                  <div className={`w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br ${cat.color} rounded-xl mx-auto mb-2 flex items-center justify-center text-white shadow-lg`}>
                    {cat.icon}
                  </div>
                  <span className="text-xs md:text-sm font-medium text-gray-700">{cat.name}</span>
                </div>
              ))}
            </div>

            <Button
              onClick={startGame}
              size="lg"
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-8 md:px-12 py-4 md:py-6 text-lg md:text-xl font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
            >
              <Sparkles className="mr-2 h-5 w-5 md:h-6 md:w-6" />
              Start Building!
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white p-4 md:p-6">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 md:gap-4">
              <Link to="/" className="hover:bg-white/20 p-2 rounded-lg transition-colors">
                <ArrowLeft className="h-5 w-5 md:h-6 md:w-6" />
              </Link>
              <div>
                <h1 className="text-xl md:text-3xl font-bold flex items-center gap-2 pb-1">
                  <Wallet className="h-5 w-5 md:h-7 md:w-7" />
                  Budget Builder
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-2 md:gap-4">
              <div className="bg-white/20 px-3 py-1.5 md:px-4 md:py-2 rounded-xl">
                <span className="text-sm md:text-base font-bold">
                  <Trophy className="inline h-4 w-4 md:h-5 md:w-5 mr-1" />
                  {totalScore} pts
                </span>
              </div>
              <div className="bg-white/20 px-3 py-1.5 md:px-4 md:py-2 rounded-xl">
                <span className="text-sm md:text-base font-medium">
                  {currentChallenge + 1}/{challenges.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-4 md:p-6 max-w-5xl">
        {/* Challenge Info */}
        <motion.div
          key={challenge.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Card className="mb-4 md:mb-6 border-0 shadow-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white overflow-hidden">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl md:text-2xl font-bold mb-2">{challenge.title}</h2>
                  <p className="text-emerald-100 text-sm md:text-base mb-3">{challenge.description}</p>
                  <div className="flex flex-wrap items-center gap-2 md:gap-4">
                    <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                      💰 Budget: £{challenge.totalBudget}
                    </span>
                    <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                      🎯 {challenge.goal}
                    </span>
                  </div>
                </div>
                <div className="text-center shrink-0">
                  <div className="text-3xl md:text-4xl font-bold">£{remaining}</div>
                  <div className="text-xs md:text-sm text-emerald-200">remaining</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Budget Allocation */}
        <div className="grid gap-3 md:gap-4 mb-4 md:mb-6">
          {activeCategories.map((category) => {
            const allocated = allocations[category.id] || 0;
            const percent = challenge.totalBudget > 0 ? (allocated / challenge.totalBudget) * 100 : 0;
            
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="border-0 shadow-lg overflow-hidden">
                  <CardContent className="p-3 md:p-4">
                    <div className="flex items-center gap-3 md:gap-4">
                      <div className={`w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br ${category.color} rounded-xl flex items-center justify-center text-white shadow-lg shrink-0`}>
                        {category.icon}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-bold text-sm md:text-lg truncate">{category.name}</h3>
                          <span className="text-lg md:text-xl font-bold text-emerald-600 shrink-0">£{allocated}</span>
                        </div>
                        <p className="text-xs md:text-sm text-gray-500 mb-2 line-clamp-1">{category.description}</p>
                        
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => adjustAllocation(category.id, -1)}
                            disabled={allocated === 0}
                            className="h-8 w-8 p-0 shrink-0"
                          >
                            -
                          </Button>
                          
                          <div className="flex-1 relative">
                            <Progress value={percent} className="h-3 md:h-4" />
                            <span className="absolute inset-0 flex items-center justify-center text-[10px] md:text-xs font-medium">
                              {percent.toFixed(0)}%
                            </span>
                          </div>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => adjustAllocation(category.id, 1)}
                            disabled={remaining === 0}
                            className="h-8 w-8 p-0 shrink-0"
                          >
                            +
                          </Button>
                        </div>

                        {/* Quick allocation buttons */}
                        <div className="flex gap-1 mt-2 flex-wrap">
                          {[10, 25, 50].map((pct) => (
                            <Button
                              key={pct}
                              variant="ghost"
                              size="sm"
                              onClick={() => setAllocationPercent(category.id, pct)}
                              className="h-6 px-2 text-xs"
                            >
                              {pct}%
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={resetChallenge}
            variant="outline"
            className="flex-1"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Reset
          </Button>
          <Button
            onClick={checkBudget}
            disabled={remaining !== 0}
            className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold"
          >
            <Check className="mr-2 h-4 w-4" />
            Submit Budget
          </Button>
        </div>

        {remaining !== 0 && (
          <p className="text-center text-amber-600 mt-3 text-sm md:text-base font-medium">
            💡 You still have £{remaining} to allocate!
          </p>
        )}

        {/* Hint Section */}
        <Card className="mt-4 md:mt-6 border-0 bg-gradient-to-r from-amber-50 to-yellow-50 border-l-4 border-amber-400">
          <CardContent className="p-3 md:p-4">
            <p className="text-amber-800 text-sm md:text-base">
              <span className="font-bold">💡 Hint:</span> {challenge.hint}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Result Modal */}
      <AnimatePresence>
        {showResult && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl"
            >
              <div className="text-center">
                {isCorrect ? (
                  <>
                    <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <Star className="h-10 w-10 md:h-12 md:w-12 text-white" />
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-emerald-600 mb-2">Excellent!</h3>
                    <p className="text-gray-600 mb-4">You've created a balanced budget!</p>
                    <div className="bg-emerald-50 p-4 rounded-xl mb-6">
                      <span className="text-2xl md:text-3xl font-bold text-emerald-600">+{score} points</span>
                    </div>
                    {currentChallenge < challenges.length - 1 ? (
                      <Button
                        onClick={nextChallenge}
                        className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold py-4 md:py-6 text-lg rounded-xl"
                      >
                        Next Challenge
                      </Button>
                    ) : (
                      <div>
                        <p className="text-xl font-bold text-emerald-600 mb-4">🎉 All challenges complete!</p>
                        <p className="text-lg mb-4">Final Score: {totalScore} points</p>
                        <Button
                          onClick={() => setGameStarted(false)}
                          className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold py-4 rounded-xl"
                        >
                          Play Again
                        </Button>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-orange-400 to-red-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <X className="h-10 w-10 md:h-12 md:w-12 text-white" />
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-orange-600 mb-2">Not Quite!</h3>
                    <p className="text-gray-600 mb-4">Your allocations don't meet the goal. Try again!</p>
                    <p className="text-sm text-gray-500 mb-6 bg-orange-50 p-3 rounded-xl">
                      <span className="font-bold">Goal:</span> {challenge.goal}
                    </p>
                    <Button
                      onClick={resetChallenge}
                      className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-4 md:py-6 text-lg rounded-xl"
                    >
                      Try Again
                    </Button>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BudgetBuilder;
