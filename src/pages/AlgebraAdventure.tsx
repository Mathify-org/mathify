import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Star, Trophy, Zap, Heart, Calculator, Sparkles, Target } from 'lucide-react';
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

interface Particle {
  id: number;
  x: number;
  y: number;
  dx: number;
  dy: number;
  life: number;
  color: string;
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
  const [particles, setParticles] = useState<Particle[]>([]);
  const [showCorrectAnimation, setShowCorrectAnimation] = useState(false);
  const [showWrongAnimation, setShowWrongAnimation] = useState(false);
  const [comboMultiplier, setComboMultiplier] = useState(1);
  const { toast } = useToast();

  // Particle system for visual effects
  const createParticles = (x: number, y: number, color: string, count: number = 10) => {
    const newParticles = Array.from({ length: count }, (_, i) => ({
      id: Date.now() + i,
      x,
      y,
      dx: (Math.random() - 0.5) * 4,
      dy: (Math.random() - 0.5) * 4,
      life: 1,
      color
    }));
    setParticles(prev => [...prev, ...newParticles]);
  };

  // Update particles
  useEffect(() => {
    const interval = setInterval(() => {
      setParticles(prev => prev
        .map(p => ({
          ...p,
          x: p.x + p.dx,
          y: p.y + p.dy,
          life: p.life - 0.02
        }))
        .filter(p => p.life > 0)
      );
    }, 16);
    return () => clearInterval(interval);
  }, []);

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
    setComboMultiplier(1);
    setCurrentProblem(generateProblem());
  };

  const handleAnswer = (selectedAnswer: number, event: React.MouseEvent) => {
    if (isAnswering) return;
    setIsAnswering(true);

    const rect = (event.target as HTMLElement).getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    if (selectedAnswer === currentProblem?.answer) {
      const basePoints = (difficulty === 'easy' ? 10 : difficulty === 'medium' ? 20 : 30);
      const streakBonus = Math.floor(streak / 3);
      const timeBonus = Math.floor(timeLeft / 3);
      const points = (basePoints + streakBonus + timeBonus) * comboMultiplier;
      
      setScore(prev => prev + points);
      setStreak(prev => prev + 1);
      setShowCorrectAnimation(true);
      
      // Create success particles
      createParticles(x, y, '#22c55e', 15);
      
      // Increase combo multiplier
      if (streak > 0 && streak % 3 === 0) {
        setComboMultiplier(prev => Math.min(prev + 0.5, 3));
      }
      
      if (streak > 0 && streak % 5 === 0) {
        setLevel(prev => prev + 1);
        createParticles(window.innerWidth / 2, window.innerHeight / 2, '#fbbf24', 30);
        toast({
          title: "🎉 Level Up!",
          description: `You've reached level ${level + 1}! Combo multiplier: ${comboMultiplier}x`,
        });
      }

      toast({
        title: "✨ Correct!",
        description: `+${points} points! ${currentProblem?.explanation}`,
      });
    } else {
      setLives(prev => prev - 1);
      setStreak(0);
      setComboMultiplier(1);
      setShowWrongAnimation(true);
      
      // Create failure particles
      createParticles(x, y, '#ef4444', 10);
      
      toast({
        title: "❌ Not quite right",
        description: currentProblem?.explanation,
        variant: "destructive",
      });
    }

    setTimeout(() => {
      setShowCorrectAnimation(false);
      setShowWrongAnimation(false);
      
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
      setComboMultiplier(1);
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
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-4 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(255,255,255,0.05)_0%,transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.03)_0%,transparent_50%)]"></div>
        
        <div className="max-w-6xl mx-auto relative z-10 md:pt-16">
          <div className="flex items-center mb-6 md:mb-8">
            <Link to="/">
              <Button variant="ghost" size="icon" className="text-white mr-4 hover:bg-white/10 border border-white/20">
                <ArrowLeft />
              </Button>
            </Link>
            <h1 className="text-3xl md:text-6xl font-bold text-white drop-shadow-2xl">
              🧮 Algebra Adventure
            </h1>
          </div>
          
          <div className="text-center mb-6 md:mb-8">
            <p className="text-lg md:text-xl text-gray-300 drop-shadow-lg">
              Master basic algebra with fun, interactive challenges! Perfect for ages 8-14
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
            <Card className="bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl hover:bg-white/15 transition-all duration-300 hover:scale-105">
              <CardHeader className="p-4 md:p-6">
                <CardTitle className="flex items-center gap-2 text-lg md:text-xl text-white">
                  <Calculator className="text-blue-400" />
                  Game Mode
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 md:space-y-3 p-4 md:p-6 pt-0">
                <Button
                  onClick={() => {
                    console.log('Setting game mode to findX');
                    setGameMode('findX');
                  }}
                  variant="outline"
                  className={`w-full transition-all duration-200 cursor-pointer text-sm md:text-base py-2 md:py-3 ${
                    gameMode === 'findX' 
                      ? 'bg-blue-500 text-white border-blue-500 hover:bg-blue-600' 
                      : 'bg-white/90 text-black border-gray-300 hover:bg-white hover:border-gray-400'
                  }`}
                >
                  🔍 Find X
                </Button>
                <Button
                  onClick={() => {
                    console.log('Setting game mode to balance');
                    setGameMode('balance');
                  }}
                  variant="outline"
                  className={`w-full transition-all duration-200 cursor-pointer text-sm md:text-base py-2 md:py-3 ${
                    gameMode === 'balance' 
                      ? 'bg-blue-500 text-white border-blue-500 hover:bg-blue-600' 
                      : 'bg-white/90 text-black border-gray-300 hover:bg-white hover:border-gray-400'
                  }`}
                >
                  ⚖️ Balance Equations
                </Button>
                <Button
                  onClick={() => {
                    console.log('Setting game mode to substitute');
                    setGameMode('substitute');
                  }}
                  variant="outline"
                  className={`w-full transition-all duration-200 cursor-pointer text-sm md:text-base py-2 md:py-3 ${
                    gameMode === 'substitute' 
                      ? 'bg-blue-500 text-white border-blue-500 hover:bg-blue-600' 
                      : 'bg-white/90 text-black border-gray-300 hover:bg-white hover:border-gray-400'
                  }`}
                >
                  🔄 Substitution
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl hover:bg-white/15 transition-all duration-300 hover:scale-105">
              <CardHeader className="p-4 md:p-6">
                <CardTitle className="flex items-center gap-2 text-lg md:text-xl text-white">
                  <Zap className="text-yellow-400" />
                  Difficulty
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 md:space-y-3 p-4 md:p-6 pt-0">
                <Button
                  onClick={() => {
                    console.log('Setting difficulty to easy');
                    setDifficulty('easy');
                  }}
                  variant="outline"
                  className={`w-full transition-all duration-200 cursor-pointer text-sm md:text-base py-2 md:py-3 ${
                    difficulty === 'easy' 
                      ? 'bg-green-500 text-white border-green-500 hover:bg-green-600' 
                      : 'bg-white/90 text-black border-gray-300 hover:bg-white hover:border-gray-400'
                  }`}
                >
                  🌱 Easy
                </Button>
                <Button
                  onClick={() => {
                    console.log('Setting difficulty to medium');
                    setDifficulty('medium');
                  }}
                  variant="outline"
                  className={`w-full transition-all duration-200 cursor-pointer text-sm md:text-base py-2 md:py-3 ${
                    difficulty === 'medium' 
                      ? 'bg-orange-500 text-white border-orange-500 hover:bg-orange-600' 
                      : 'bg-white/90 text-black border-gray-300 hover:bg-white hover:border-gray-400'
                  }`}
                >
                  🔥 Medium
                </Button>
                <Button
                  onClick={() => {
                    console.log('Setting difficulty to hard');
                    setDifficulty('hard');
                  }}
                  variant="outline"
                  className={`w-full transition-all duration-200 cursor-pointer text-sm md:text-base py-2 md:py-3 ${
                    difficulty === 'hard' 
                      ? 'bg-red-500 text-white border-red-500 hover:bg-red-600' 
                      : 'bg-white/90 text-black border-gray-300 hover:bg-white hover:border-gray-400'
                  }`}
                >
                  💎 Hard
                </Button>
              </CardContent>
            </Card>

            {/* How to Play card - hidden on mobile, will be shown below start button */}
            <Card className="hidden md:block bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl hover:bg-white/15 transition-all duration-300 hover:scale-105">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl text-white">
                  <Star className="text-yellow-400" />
                  How to Play
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <Badge className="bg-blue-500 text-white">1</Badge>
                  <p className="text-gray-300">Look at the algebra equation or expression</p>
                </div>
                <div className="flex items-start gap-2">
                  <Badge className="bg-green-500 text-white">2</Badge>
                  <p className="text-gray-300">Choose the correct answer from the options</p>
                </div>
                <div className="flex items-start gap-2">
                  <Badge className="bg-purple-500 text-white">3</Badge>
                  <p className="text-gray-300">Build streaks for bonus points!</p>
                </div>
                <div className="flex items-start gap-2">
                  <Badge className="bg-orange-500 text-white">⏰</Badge>
                  <p className="text-gray-300">Answer within 30 seconds or lose a life!</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Start button - mobile first, desktop second */}
          <div className="text-center mb-6">
            <Button
              onClick={startGame}
              className="text-lg md:text-2xl py-4 md:py-6 px-8 md:px-12 bg-white text-black hover:bg-gray-200 font-bold shadow-2xl transform hover:scale-110 transition-all duration-300 border-2 border-white/30"
            >
              🚀 Start Adventure!
            </Button>
          </div>

          {/* How to Play card - mobile only, shown after start button */}
          <div className="md:hidden">
            <Card className="bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl hover:bg-white/15 transition-all duration-300">
              <CardHeader className="p-4">
                <CardTitle className="flex items-center gap-2 text-lg text-white">
                  <Star className="text-yellow-400" />
                  How to Play
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm p-4 pt-0">
                <div className="flex items-start gap-2">
                  <Badge className="bg-blue-500 text-white text-xs">1</Badge>
                  <p className="text-gray-300">Look at the algebra equation or expression</p>
                </div>
                <div className="flex items-start gap-2">
                  <Badge className="bg-green-500 text-white text-xs">2</Badge>
                  <p className="text-gray-300">Choose the correct answer from the options</p>
                </div>
                <div className="flex items-start gap-2">
                  <Badge className="bg-purple-500 text-white text-xs">3</Badge>
                  <p className="text-gray-300">Build streaks for bonus points!</p>
                </div>
                <div className="flex items-start gap-2">
                  <Badge className="bg-orange-500 text-white text-xs">⏰</Badge>
                  <p className="text-gray-300">Answer within 30 seconds or lose a life!</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'gameOver') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-4 flex items-center justify-center relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.05)_0%,transparent_70%)]"></div>
        
        <Card className="bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl max-w-md w-full">
          <CardHeader className="text-center">
            <div className="flex items-center justify-between mb-4">
              <Link to="/">
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 border border-white/20">
                  <ArrowLeft />
                </Button>
              </Link>
              <CardTitle className="text-4xl mb-4 text-white">
                🏆 Adventure Complete!
              </CardTitle>
              <div></div>
            </div>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="space-y-2">
              <p className="text-3xl font-bold text-yellow-400 drop-shadow-lg">Final Score: {score}</p>
              <p className="text-xl text-gray-300">Best Streak: {streak}</p>
              <p className="text-lg text-gray-300">Level Reached: {level}</p>
              <Badge className="text-lg px-4 py-2 bg-white text-black">
                {difficulty.toUpperCase()} Mode
              </Badge>
            </div>
            <div className="space-y-3">
              <Button
                onClick={startGame}
                className="w-full text-xl py-4 bg-white text-black hover:bg-gray-200 font-bold transition-all duration-200 hover:scale-105"
              >
                🔄 Play Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-4 relative overflow-hidden">
      {/* Particles */}
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute w-2 h-2 rounded-full pointer-events-none"
          style={{
            left: particle.x,
            top: particle.y,
            backgroundColor: particle.color,
            opacity: particle.life,
            transform: `scale(${particle.life})`,
          }}
        />
      ))}
      
      {/* Success/Failure animations */}
      {showCorrectAnimation && (
        <div className="absolute inset-0 bg-green-500/20 animate-pulse pointer-events-none" />
      )}
      {showWrongAnimation && (
        <div className="absolute inset-0 bg-red-500/20 animate-pulse pointer-events-none" />
      )}
      
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(255,255,255,0.03)_0%,transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.02)_0%,transparent_50%)]"></div>
      
      <div className="max-w-4xl mx-auto relative z-10 md:pt-16">
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <Link to="/">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 border border-white/20">
              <ArrowLeft />
            </Button>
          </Link>
          <h1 className="text-xl md:text-4xl font-bold text-white drop-shadow-2xl">🧮 Algebra Adventure</h1>
          <div></div>
        </div>
        
        {/* Game Stats */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-4 mb-6 md:mb-8">
          <Card className="bg-white/10 backdrop-blur-md border border-white/20 shadow-xl">
            <CardContent className="p-2 md:p-4 text-center">
              <div className="text-lg md:text-2xl font-bold text-yellow-400 drop-shadow-lg">{score}</div>
              <div className="text-xs md:text-sm text-gray-300">Score</div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur-md border border-white/20 shadow-xl">
            <CardContent className="p-2 md:p-4 text-center">
              <div className="text-lg md:text-2xl font-bold text-red-400 flex items-center justify-center gap-1">
                {Array.from({ length: lives }, (_, i) => (
                  <Heart key={i} className="h-3 w-3 md:h-5 md:w-5 fill-current animate-pulse" />
                ))}
              </div>
              <div className="text-xs md:text-sm text-gray-300">Lives</div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur-md border border-white/20 shadow-xl">
            <CardContent className="p-2 md:p-4 text-center">
              <div className="text-lg md:text-2xl font-bold text-orange-400 drop-shadow-lg">{streak}</div>
              <div className="text-xs md:text-sm text-gray-300">Streak</div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur-md border border-white/20 shadow-xl">
            <CardContent className="p-2 md:p-4 text-center">
              <div className="text-lg md:text-2xl font-bold text-purple-400 drop-shadow-lg">{level}</div>
              <div className="text-xs md:text-sm text-gray-300">Level</div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur-md border border-white/20 shadow-xl">
            <CardContent className="p-2 md:p-4 text-center">
              <div className={`text-lg md:text-2xl font-bold drop-shadow-lg ${timeLeft <= 10 ? 'text-red-400 animate-pulse' : 'text-cyan-400'}`}>
                {timeLeft}s
              </div>
              <div className="text-xs md:text-sm text-gray-300">Time</div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur-md border border-white/20 shadow-xl">
            <CardContent className="p-2 md:p-4 text-center">
              <div className="text-lg md:text-xl font-bold text-green-400 drop-shadow-lg flex items-center justify-center gap-1">
                {comboMultiplier}x
                {comboMultiplier > 1 && <Sparkles className="h-3 w-3 md:h-4 md:w-4" />}
              </div>
              <div className="text-xs md:text-sm text-gray-300">Combo</div>
            </CardContent>
          </Card>
        </div>

        {/* Problem Display */}
        {currentProblem && (
          <Card className="bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl mb-6 md:mb-8 hover:bg-white/15 transition-all duration-300">
            <CardContent className="p-4 md:p-8 text-center">
              <div className="mb-4 md:mb-6">
                <Badge className="mb-2 md:mb-4 text-sm md:text-lg px-3 md:px-4 py-1 md:py-2 bg-white text-black">
                  {gameMode === 'findX' ? 'Find X' : gameMode === 'balance' ? 'Balance' : 'Substitute'}
                </Badge>
                <h2 className="text-2xl md:text-5xl font-bold text-white mb-2 md:mb-4 drop-shadow-2xl font-mono">
                  {currentProblem.equation}
                </h2>
                {gameMode === 'substitute' && (
                  <p className="text-lg md:text-xl text-gray-300">What is the value?</p>
                )}
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
                {currentProblem.choices.map((choice, index) => (
                  <Button
                    key={index}
                    onClick={(e) => handleAnswer(choice, e)}
                    disabled={isAnswering}
                    className={`text-lg md:text-xl py-4 md:py-8 font-bold transition-all duration-300 transform hover:scale-110 border-2 ${
                      isAnswering && choice === currentProblem.answer
                        ? 'bg-green-500 hover:bg-green-500 border-green-400 text-white shadow-2xl'
                        : isAnswering && choice !== currentProblem.answer
                        ? 'bg-red-500 hover:bg-red-500 border-red-400 text-white'
                        : 'bg-white/20 hover:bg-white/30 border-white/30 text-white backdrop-blur-sm shadow-xl hover:shadow-2xl'
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
