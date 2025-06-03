import React, { useState, useCallback, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Trophy, Target, Timer, Star } from "lucide-react";
import { toast } from "sonner";

import DifficultySelector from "@/components/FractionFrenzy/DifficultySelector";
import GameModeCard from "@/components/FractionFrenzy/GameModeCard";
import FractionVisual from "@/components/FractionFrenzy/FractionVisual";
import GameTimer from "@/components/FractionFrenzy/GameTimer";
import StatsDisplay from "@/components/FractionFrenzy/StatsDisplay";

import { GameMode, Difficulty, GameState, FractionQuestion, GameStats } from "@/types/fractionFrenzy";

const FractionFrenzy = () => {
  const [gameState, setGameState] = useState<GameState>("menu");
  const [selectedMode, setSelectedMode] = useState<GameMode>("visual-match");
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>("easy");
  const [currentQuestion, setCurrentQuestion] = useState<FractionQuestion | null>(null);
  const [userAnswer, setUserAnswer] = useState<string>("");
  const [gameStats, setGameStats] = useState<GameStats>({
    score: 0,
    questionsAnswered: 0,
    correctAnswers: 0,
    streak: 0,
    timeRemaining: 0,
    totalTime: 0
  });

  const gameModes = useMemo(() => [
    {
      id: "visual-match" as GameMode,
      title: "Visual Match",
      description: "Match fractions to their visual representations",
      icon: "🎯",
      color: "from-blue-500 to-cyan-400"
    },
    {
      id: "equivalent" as GameMode,
      title: "Equivalent Fractions",
      description: "Find equivalent fractions and simplify",
      icon: "⚖️",
      color: "from-green-500 to-emerald-400"
    },
    {
      id: "arithmetic" as GameMode,
      title: "Fraction Arithmetic",
      description: "Add, subtract, multiply and divide fractions",
      icon: "🧮",
      color: "from-purple-500 to-violet-400"
    },
    {
      id: "word-problems" as GameMode,
      title: "Word Problems",
      description: "Solve real-world fraction problems",
      icon: "📚",
      color: "from-orange-500 to-amber-400"
    }
  ], []);

  const generateQuestion = useCallback((): FractionQuestion => {
    // Simple question generation logic
    const numerator = Math.floor(Math.random() * 10) + 1;
    const denominator = Math.floor(Math.random() * 10) + numerator + 1;
    
    return {
      id: Date.now(),
      type: selectedMode,
      difficulty: selectedDifficulty,
      question: `What is ${numerator}/${denominator} in simplest form?`,
      options: [`${numerator}/${denominator}`, `${numerator/2}/${denominator/2}`, `${numerator*2}/${denominator*2}`, `${numerator+1}/${denominator+1}`],
      correctAnswer: `${numerator}/${denominator}`,
      explanation: `${numerator}/${denominator} is already in simplest form.`,
      fractionData: {
        numerator,
        denominator,
        value: numerator / denominator
      }
    };
  }, [selectedMode, selectedDifficulty]);

  const startGame = useCallback(() => {
    const timeLimit = selectedDifficulty === "easy" ? 120 : selectedDifficulty === "medium" ? 90 : 60;
    
    setGameStats({
      score: 0,
      questionsAnswered: 0,
      correctAnswers: 0,
      streak: 0,
      timeRemaining: timeLimit,
      totalTime: timeLimit
    });
    
    setCurrentQuestion(generateQuestion());
    setUserAnswer("");
    setGameState("playing");
  }, [selectedDifficulty, generateQuestion]);

  const handleAnswer = useCallback((answer: string) => {
    if (!currentQuestion) return;

    const isCorrect = answer === currentQuestion.correctAnswer;
    const points = isCorrect ? (10 + gameStats.streak * 2) : 0;
    
    setGameStats(prev => ({
      ...prev,
      score: prev.score + points,
      questionsAnswered: prev.questionsAnswered + 1,
      correctAnswers: prev.correctAnswers + (isCorrect ? 1 : 0),
      streak: isCorrect ? prev.streak + 1 : 0
    }));

    if (isCorrect) {
      toast.success(`Correct! +${points} points`, {
        description: currentQuestion.explanation
      });
    } else {
      toast.error("Incorrect!", {
        description: `The correct answer was: ${currentQuestion.correctAnswer}`
      });
    }

    // Generate next question after a short delay
    setTimeout(() => {
      setCurrentQuestion(generateQuestion());
      setUserAnswer("");
    }, 1500);
  }, [currentQuestion, gameStats.streak, generateQuestion]);

  const resetGame = useCallback(() => {
    setGameState("menu");
    setCurrentQuestion(null);
    setUserAnswer("");
    setGameStats({
      score: 0,
      questionsAnswered: 0,
      correctAnswers: 0,
      streak: 0,
      timeRemaining: 0,
      totalTime: 0
    });
  }, []);

  // Timer effect
  useEffect(() => {
    if (gameState === "playing" && gameStats.timeRemaining > 0) {
      const timer = setTimeout(() => {
        setGameStats(prev => ({
          ...prev,
          timeRemaining: prev.timeRemaining - 1
        }));
      }, 1000);
      return () => clearTimeout(timer);
    } else if (gameState === "playing" && gameStats.timeRemaining === 0) {
      setGameState("gameOver");
    }
  }, [gameState, gameStats.timeRemaining]);

  if (gameState === "menu") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-600 p-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center mb-8">
            <Link to="/">
              <Button variant="ghost" size="icon" className="text-white mr-4 hover:bg-white/10">
                <ArrowLeft />
              </Button>
            </Link>
            <h1 className="text-4xl md:text-6xl font-bold text-white">🔢 Fraction Frenzy</h1>
          </div>
          
          <div className="text-center mb-8">
            <p className="text-xl text-white/90">
              Master fractions through fun, interactive challenges!
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Game Modes */}
            <div className="lg:col-span-2">
              <Card className="glass-morphism border-white/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <Target className="text-blue-400" />
                    Choose Your Challenge
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {gameModes.map((mode) => (
                      <GameModeCard
                        key={mode.id}
                        mode={mode}
                        isSelected={selectedMode === mode.id}
                        onSelect={() => setSelectedMode(mode.id)}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Settings */}
            <div className="space-y-6">
              <DifficultySelector
                selectedDifficulty={selectedDifficulty}
                onDifficultySelect={setSelectedDifficulty}
              />
              
              <Card className="glass-morphism border-white/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="text-yellow-400" />
                    Game Rules
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <Badge className="bg-blue-500 text-white">1</Badge>
                    <p>Answer fraction questions as quickly and accurately as possible</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Badge className="bg-green-500 text-white">2</Badge>
                    <p>Build streaks for bonus points</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Badge className="bg-purple-500 text-white">3</Badge>
                    <p>Beat the timer to maximize your score</p>
                  </div>
                </CardContent>
              </Card>

              <Button
                onClick={startGame}
                className="w-full text-xl py-6 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold"
              >
                🚀 Start Frenzy!
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === "gameOver") {
    const accuracy = gameStats.questionsAnswered > 0 ? 
      Math.round((gameStats.correctAnswers / gameStats.questionsAnswered) * 100) : 0;

    return (
      <div className="min-h-screen bg-gradient-to-br from-red-500 via-purple-500 to-pink-600 p-4 flex items-center justify-center">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <div className="flex items-center justify-between mb-4">
              <Link to="/">
                <Button variant="ghost" size="icon">
                  <ArrowLeft />
                </Button>
              </Link>
              <CardTitle className="text-3xl font-bold">🎉 Frenzy Complete!</CardTitle>
              <div></div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <StatsDisplay
              score={gameStats.score}
              questionsAnswered={gameStats.questionsAnswered}
              accuracy={accuracy}
              streak={gameStats.streak}
            />
            
            <div className="text-center space-y-4">
              <p className="text-lg">
                You mastered <span className="font-bold text-purple-600">{selectedMode}</span> mode
                on <span className="font-bold text-purple-600">{selectedDifficulty}</span> difficulty!
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={startGame}
                  className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                >
                  🔄 Play Again
                </Button>
                <Button 
                  onClick={resetGame}
                  variant="outline"
                >
                  🏠 Back to Menu
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Game playing state
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
      <div className="container mx-auto max-w-4xl">
        {/* Game Header */}
        <div className="flex items-center justify-between mb-6">
          <Link to="/">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
              <ArrowLeft />
            </Button>
          </Link>
          <h1 className="text-2xl md:text-4xl font-bold text-white">🔢 Fraction Frenzy</h1>
          <Button 
            onClick={resetGame}
            variant="ghost" 
            className="text-white hover:bg-white/10"
          >
            Exit Game
          </Button>
        </div>

        {/* Stats and Timer */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <Trophy className="h-6 w-6 text-yellow-500 mx-auto mb-1" />
              <p className="text-2xl font-bold">{gameStats.score}</p>
              <p className="text-sm text-gray-600">Score</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <Target className="h-6 w-6 text-green-500 mx-auto mb-1" />
              <p className="text-2xl font-bold">{gameStats.correctAnswers}/{gameStats.questionsAnswered}</p>
              <p className="text-sm text-gray-600">Correct</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <Star className="h-6 w-6 text-purple-500 mx-auto mb-1" />
              <p className="text-2xl font-bold">{gameStats.streak}</p>
              <p className="text-sm text-gray-600">Streak</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <Timer className="h-6 w-6 text-red-500 mx-auto mb-1" />
              <p className="text-2xl font-bold">{gameStats.timeRemaining}</p>
              <p className="text-sm text-gray-600">Time Left</p>
            </CardContent>
          </Card>
        </div>

        <GameTimer timeRemaining={gameStats.timeRemaining} totalTime={gameStats.totalTime} />

        {/* Main Question Area */}
        {currentQuestion && (
          <Card className="mb-6">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <Badge className="mb-4">{selectedMode} - {selectedDifficulty}</Badge>
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  {currentQuestion.question}
                </h2>
              </div>

              {/* Fraction Visual */}
              {currentQuestion.fractionData && (
                <div className="mb-6">
                  <FractionVisual
                    numerator={currentQuestion.fractionData.numerator}
                    denominator={currentQuestion.fractionData.denominator}
                    showAnimation={true}
                  />
                </div>
              )}

              {/* Answer Options */}
              <div className="grid grid-cols-2 gap-4">
                {currentQuestion.options.map((option, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="h-16 text-xl font-bold hover:bg-purple-100"
                    onClick={() => handleAnswer(option)}
                  >
                    {option}
                  </Button>
                ))}
              </div>

              {gameStats.streak > 0 && (
                <div className="text-center mt-6">
                  <Badge className="bg-orange-500 text-white text-lg px-4 py-2">
                    🔥 {gameStats.streak} Streak!
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default FractionFrenzy;
