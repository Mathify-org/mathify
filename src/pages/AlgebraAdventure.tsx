
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Star, Trophy, Zap, Heart, Calculator } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type GameMode = 'findX' | 'balance' | 'substitute';
type GameState = 'menu' | 'playing' | 'gameOver';
type Difficulty = 'easy' | 'medium' | 'hard';

interface Problem {
  equation: string;
  answer: number;
  choices: number[];
  explanation: string;
}

const AlgebraAdventure = () => {
  const [gameState, setGameState] = useState<GameState>('menu');
  const [gameMode, setGameMode] = useState<GameMode>('findX');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [currentProblem, setCurrentProblem] = useState<Problem | null>(null);
  const [streak, setStreak] = useState(0);
  const [level, setLevel] = useState(1);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isAnswering, setIsAnswering] = useState(false);
  const { toast } = useToast();

  const generateProblem = (): Problem => {
    let equation = '';
    let answer = 0;
    let explanation = '';
    
    if (gameMode === 'findX') {
      const a = Math.floor(Math.random() * 10) + 1;
      const b = Math.floor(Math.random() * 20) + 1;
      answer = Math.floor(Math.random() * 15) + 1;
      const result = a * answer + b;
      
      equation = `${a}x + ${b} = ${result}`;
      explanation = `To solve: ${equation}, subtract ${b} from both sides to get ${a}x = ${result - b}, then divide by ${a}`;
    } else if (gameMode === 'balance') {
      const left = Math.floor(Math.random() * 10) + 1;
      const right = Math.floor(Math.random() * 10) + 1;
      answer = left + right;
      equation = `${left} + x = ${answer + right}`;
      explanation = `To balance the equation, x must equal ${answer}`;
    } else {
      const x = Math.floor(Math.random() * 8) + 1;
      const coefficient = Math.floor(Math.random() * 5) + 2;
      answer = coefficient * x;
      equation = `${coefficient}x when x = ${x}`;
      explanation = `Substitute x = ${x} into ${coefficient}x to get ${coefficient} × ${x} = ${answer}`;
    }

    const wrongAnswers = [];
    while (wrongAnswers.length < 3) {
      const wrong = answer + (Math.floor(Math.random() * 10) - 5);
      if (wrong !== answer && wrong > 0 && !wrongAnswers.includes(wrong)) {
        wrongAnswers.push(wrong);
      }
    }

    const choices = [answer, ...wrongAnswers].sort(() => Math.random() - 0.5);
    
    return { equation, answer, choices, explanation };
  };

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setLives(3);
    setStreak(0);
    setLevel(1);
    setTimeLeft(30);
    setCurrentProblem(generateProblem());
  };

  const handleAnswer = (selectedAnswer: number) => {
    if (isAnswering) return;
    setIsAnswering(true);

    if (selectedAnswer === currentProblem?.answer) {
      const points = (difficulty === 'easy' ? 10 : difficulty === 'medium' ? 20 : 30) * (streak + 1);
      setScore(prev => prev + points);
      setStreak(prev => prev + 1);
      
      if (streak > 0 && streak % 5 === 0) {
        setLevel(prev => prev + 1);
        toast({
          title: "🎉 Level Up!",
          description: `You've reached level ${level + 1}!`,
        });
      }

      toast({
        title: "✨ Correct!",
        description: `+${points} points! ${currentProblem?.explanation}`,
      });
    } else {
      setLives(prev => prev - 1);
      setStreak(0);
      toast({
        title: "❌ Not quite right",
        description: currentProblem?.explanation,
        variant: "destructive",
      });
    }

    setTimeout(() => {
      if (lives <= 1 && selectedAnswer !== currentProblem?.answer) {
        setGameState('gameOver');
      } else {
        setCurrentProblem(generateProblem());
        setTimeLeft(30);
      }
      setIsAnswering(false);
    }, 2000);
  };

  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && gameState === 'playing') {
      setLives(prev => prev - 1);
      setStreak(0);
      if (lives <= 1) {
        setGameState('gameOver');
      } else {
        setCurrentProblem(generateProblem());
        setTimeLeft(30);
      }
    }
  }, [timeLeft, gameState, lives]);

  if (gameState === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center mb-8">
            <Link to="/">
              <Button variant="ghost" size="icon" className="text-white mr-4 hover:bg-white/10">
                <ArrowLeft />
              </Button>
            </Link>
            <h1 className="text-4xl md:text-6xl font-bold text-white">
              🧮 Algebra Adventure
            </h1>
          </div>
          
          <div className="text-center mb-8">
            <p className="text-xl text-white/90">
              Master basic algebra with fun, colorful challenges! Perfect for ages 8-14
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="glass-morphism border-2 border-white/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Calculator className="text-blue-400" />
                  Game Mode
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={() => setGameMode('findX')}
                  variant={gameMode === 'findX' ? 'default' : 'outline'}
                  className="w-full"
                >
                  🔍 Find X
                </Button>
                <Button
                  onClick={() => setGameMode('balance')}
                  variant={gameMode === 'balance' ? 'default' : 'outline'}
                  className="w-full"
                >
                  ⚖️ Balance Equations
                </Button>
                <Button
                  onClick={() => setGameMode('substitute')}
                  variant={gameMode === 'substitute' ? 'default' : 'outline'}
                  className="w-full"
                >
                  🔄 Substitution
                </Button>
              </CardContent>
            </Card>

            <Card className="glass-morphism border-2 border-white/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Zap className="text-yellow-400" />
                  Difficulty
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={() => setDifficulty('easy')}
                  variant={difficulty === 'easy' ? 'default' : 'outline'}
                  className="w-full"
                >
                  🌱 Easy
                </Button>
                <Button
                  onClick={() => setDifficulty('medium')}
                  variant={difficulty === 'medium' ? 'default' : 'outline'}
                  className="w-full"
                >
                  🔥 Medium
                </Button>
                <Button
                  onClick={() => setDifficulty('hard')}
                  variant={difficulty === 'hard' ? 'default' : 'outline'}
                  className="w-full"
                >
                  💎 Hard
                </Button>
              </CardContent>
            </Card>

            <Card className="glass-morphism border-2 border-white/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Star className="text-yellow-400" />
                  How to Play
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <Badge className="bg-blue-500 text-white">1</Badge>
                  <p>Look at the algebra equation or expression</p>
                </div>
                <div className="flex items-start gap-2">
                  <Badge className="bg-green-500 text-white">2</Badge>
                  <p>Choose the correct answer from the options</p>
                </div>
                <div className="flex items-start gap-2">
                  <Badge className="bg-purple-500 text-white">3</Badge>
                  <p>Build streaks for bonus points!</p>
                </div>
                <div className="flex items-start gap-2">
                  <Badge className="bg-orange-500 text-white">⏰</Badge>
                  <p>Answer within 30 seconds or lose a life!</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <Button
              onClick={startGame}
              className="text-2xl py-6 px-12 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              🚀 Start Adventure!
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'gameOver') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-600 via-purple-600 to-blue-600 p-4 flex items-center justify-center">
        <Card className="glass-morphism border-2 border-white/30 max-w-md w-full">
          <CardHeader className="text-center">
            <div className="flex items-center justify-between mb-4">
              <Link to="/">
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                  <ArrowLeft />
                </Button>
              </Link>
              <CardTitle className="text-4xl mb-4">
                🏆 Adventure Complete!
              </CardTitle>
              <div></div>
            </div>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="space-y-2">
              <p className="text-3xl font-bold text-yellow-400">Final Score: {score}</p>
              <p className="text-xl">Best Streak: {streak}</p>
              <p className="text-lg">Level Reached: {level}</p>
              <Badge className="text-lg px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500">
                {difficulty.toUpperCase()} Mode
              </Badge>
            </div>
            <div className="space-y-3">
              <Button
                onClick={startGame}
                className="w-full text-xl py-4 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold"
              >
                🔄 Play Again
              </Button>
              <Button
                onClick={() => setGameState('menu')}
                variant="outline"
                className="w-full text-lg py-3"
              >
                🏠 Main Menu
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-500 via-blue-500 to-purple-600 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Link to="/">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
              <ArrowLeft />
            </Button>
          </Link>
          <h1 className="text-2xl md:text-4xl font-bold text-white">🧮 Algebra Adventure</h1>
          <div></div>
        </div>
        
        {/* Game Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Card className="glass-morphism border border-white/30">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-400">{score}</div>
              <div className="text-sm text-white/80">Score</div>
            </CardContent>
          </Card>
          <Card className="glass-morphism border border-white/30">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-400 flex items-center justify-center gap-1">
                {Array.from({ length: lives }, (_, i) => (
                  <Heart key={i} className="h-5 w-5 fill-current" />
                ))}
              </div>
              <div className="text-sm text-white/80">Lives</div>
            </CardContent>
          </Card>
          <Card className="glass-morphism border border-white/30">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-400">{streak}</div>
              <div className="text-sm text-white/80">Streak</div>
            </CardContent>
          </Card>
          <Card className="glass-morphism border border-white/30">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-400">{level}</div>
              <div className="text-sm text-white/80">Level</div>
            </CardContent>
          </Card>
          <Card className="glass-morphism border border-white/30">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-cyan-400">{timeLeft}s</div>
              <div className="text-sm text-white/80">Time</div>
            </CardContent>
          </Card>
        </div>

        {/* Problem Display */}
        {currentProblem && (
          <Card className="glass-morphism border-2 border-white/30 mb-8">
            <CardContent className="p-8 text-center">
              <div className="mb-6">
                <Badge className="mb-4 text-lg px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500">
                  {gameMode === 'findX' ? 'Find X' : gameMode === 'balance' ? 'Balance' : 'Substitute'}
                </Badge>
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                  {currentProblem.equation}
                </h2>
                {gameMode === 'substitute' && (
                  <p className="text-xl text-white/90">What is the value?</p>
                )}
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {currentProblem.choices.map((choice, index) => (
                  <Button
                    key={index}
                    onClick={() => handleAnswer(choice)}
                    disabled={isAnswering}
                    className={`text-xl py-8 font-bold transition-all duration-200 transform hover:scale-105 ${
                      isAnswering && choice === currentProblem.answer
                        ? 'bg-green-500 hover:bg-green-500'
                        : isAnswering && choice !== currentProblem.answer
                        ? 'bg-red-500 hover:bg-red-500'
                        : 'bg-gradient-to-r from-white/20 to-white/30 hover:from-white/30 hover:to-white/40'
                    }`}
                  >
                    {choice}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AlgebraAdventure;
