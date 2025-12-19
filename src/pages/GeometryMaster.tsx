import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Square, 
  Circle, 
  Triangle, 
  Hexagon, 
  Box,
  Trophy,
  Clock,
  Target,
  Zap,
  Star,
  RotateCcw,
  Home,
  Play,
  Pause
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import confetti from 'canvas-confetti';
import GameCompletionHandler from '@/components/GameCompletionHandler';

interface Question {
  id: number;
  shape: string;
  type: 'area' | 'perimeter' | 'volume';
  dimensions: { [key: string]: number };
  answer: number;
  unit: string;
  formula: string;
}

interface GameStats {
  score: number;
  streak: number;
  bestStreak: number;
  questionsAnswered: number;
  correctAnswers: number;
  timeRemaining: number;
  questionTimeRemaining: number;
}

const GeometryMaster = () => {
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'paused' | 'finished'>('menu');
  const [difficulty, setDifficulty] = useState<'extraEasy' | 'easy' | 'medium' | 'hard'>('easy');
  const [includeVolume, setIncludeVolume] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [showCompletionHandler, setShowCompletionHandler] = useState(false);
  const gameStartTime = useRef<number>(Date.now());
  const [stats, setStats] = useState<GameStats>({
    score: 0,
    streak: 0,
    bestStreak: 0,
    questionsAnswered: 0,
    correctAnswers: 0,
    timeRemaining: 600, // 10 minutes
    questionTimeRemaining: 60
  });
  const { toast } = useToast();

  // Timer effects
  useEffect(() => {
    if (gameState === 'playing') {
      const gameTimer = setInterval(() => {
        setStats(prev => {
          if (prev.timeRemaining <= 1) {
            setGameState('finished');
            setShowCompletionHandler(true);
            return prev;
          }
          return { ...prev, timeRemaining: prev.timeRemaining - 1 };
        });
      }, 1000);

      const questionTimer = setInterval(() => {
        setStats(prev => {
          if (prev.questionTimeRemaining <= 1) {
            handleTimeout();
            return prev;
          }
          return { ...prev, questionTimeRemaining: prev.questionTimeRemaining - 1 };
        });
      }, 1000);

      return () => {
        clearInterval(gameTimer);
        clearInterval(questionTimer);
      };
    }
  }, [gameState]);

  const generateQuestion = useCallback((): Question => {
    let shapes: string[];
    
    if (difficulty === 'extraEasy') {
      shapes = ['square', 'rectangle', 'triangle'];
    } else {
      shapes = includeVolume 
        ? ['square', 'rectangle', 'circle', 'triangle', 'parallelogram', 'trapezoid', 'hexagon', 'cube', 'sphere', 'cylinder']
        : ['square', 'rectangle', 'circle', 'triangle', 'parallelogram', 'trapezoid', 'hexagon'];
    }
    
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    const types = shape.includes('cube') || shape.includes('sphere') || shape.includes('cylinder') 
      ? ['volume'] 
      : ['area', 'perimeter'];
    const type = types[Math.floor(Math.random() * types.length)] as 'area' | 'perimeter' | 'volume';
    
    const getDifficultyRange = () => {
      switch (difficulty) {
        case 'extraEasy': return { min: 2, max: 6 };
        case 'easy': return { min: 2, max: 10 };
        case 'medium': return { min: 5, max: 20 };
        case 'hard': return { min: 10, max: 50 };
        default: return { min: 2, max: 10 };
      }
    };

    const range = getDifficultyRange();
    const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

    let dimensions: { [key: string]: number } = {};
    let answer: number = 0;
    let unit: string = '';
    let formula: string = '';

    switch (shape) {
      case 'square':
        dimensions.side = randomInt(range.min, range.max);
        if (type === 'area') {
          answer = dimensions.side * dimensions.side;
          unit = 'units²';
          formula = 'side²';
        } else {
          answer = 4 * dimensions.side;
          unit = 'units';
          formula = '4 × side';
        }
        break;
        
      case 'rectangle':
        dimensions.length = randomInt(range.min, range.max);
        dimensions.width = randomInt(range.min, range.max);
        if (type === 'area') {
          answer = dimensions.length * dimensions.width;
          unit = 'units²';
          formula = 'length × width';
        } else {
          answer = 2 * (dimensions.length + dimensions.width);
          unit = 'units';
          formula = '2 × (length + width)';
        }
        break;
        
      case 'circle':
        dimensions.radius = randomInt(range.min, range.max);
        if (type === 'area') {
          answer = Math.round(Math.PI * dimensions.radius * dimensions.radius * 100) / 100;
          unit = 'units²';
          formula = 'π × radius²';
        } else {
          answer = Math.round(2 * Math.PI * dimensions.radius * 100) / 100;
          unit = 'units';
          formula = '2 × π × radius';
        }
        break;
        
      case 'triangle':
        if (type === 'area') {
          dimensions.base = randomInt(range.min, range.max);
          dimensions.height = randomInt(range.min, range.max);
          answer = (dimensions.base * dimensions.height) / 2;
          unit = 'units²';
          formula = '½ × base × height';
        } else {
          // For perimeter, just give three sides
          dimensions.side1 = randomInt(range.min, range.max);
          dimensions.side2 = randomInt(range.min, range.max);
          dimensions.side3 = randomInt(range.min, range.max);
          answer = dimensions.side1 + dimensions.side2 + dimensions.side3;
          unit = 'units';
          formula = 'side1 + side2 + side3';
        }
        break;
        
      case 'parallelogram':
        if (type === 'area') {
          dimensions.base = randomInt(range.min, range.max);
          dimensions.height = randomInt(range.min, range.max);
          answer = dimensions.base * dimensions.height;
          unit = 'units²';
          formula = 'base × height';
        } else {
          dimensions.side1 = randomInt(range.min, range.max);
          dimensions.side2 = randomInt(range.min, range.max);
          answer = 2 * (dimensions.side1 + dimensions.side2);
          unit = 'units';
          formula = '2 × (side1 + side2)';
        }
        break;
        
      case 'trapezoid':
        if (type === 'area') {
          dimensions.base1 = randomInt(range.min, range.max);
          dimensions.base2 = randomInt(range.min, range.max);
          dimensions.height = randomInt(range.min, range.max);
          answer = ((dimensions.base1 + dimensions.base2) * dimensions.height) / 2;
          unit = 'units²';
          formula = '½ × (base1 + base2) × height';
        } else {
          dimensions.side1 = randomInt(range.min, range.max);
          dimensions.side2 = randomInt(range.min, range.max);
          dimensions.side3 = randomInt(range.min, range.max);
          dimensions.side4 = randomInt(range.min, range.max);
          answer = dimensions.side1 + dimensions.side2 + dimensions.side3 + dimensions.side4;
          unit = 'units';
          formula = 'side1 + side2 + side3 + side4';
        }
        break;
        
      case 'hexagon':
        dimensions.side = randomInt(range.min, range.max);
        if (type === 'area') {
          answer = Math.round((3 * Math.sqrt(3) / 2) * dimensions.side * dimensions.side * 100) / 100;
          unit = 'units²';
          formula = '(3√3/2) × side²';
        } else {
          answer = 6 * dimensions.side;
          unit = 'units';
          formula = '6 × side';
        }
        break;
        
      case 'cube':
        dimensions.side = randomInt(range.min, range.max);
        answer = dimensions.side * dimensions.side * dimensions.side;
        unit = 'units³';
        formula = 'side³';
        break;
        
      case 'sphere':
        dimensions.radius = randomInt(range.min, range.max);
        answer = Math.round((4/3) * Math.PI * Math.pow(dimensions.radius, 3) * 100) / 100;
        unit = 'units³';
        formula = '⁴⁄₃ × π × radius³';
        break;
        
      case 'cylinder':
        dimensions.radius = randomInt(range.min, range.max);
        dimensions.height = randomInt(range.min, range.max);
        answer = Math.round(Math.PI * dimensions.radius * dimensions.radius * dimensions.height * 100) / 100;
        unit = 'units³';
        formula = 'π × radius² × height';
        break;
    }

    return {
      id: Date.now(),
      shape,
      type,
      dimensions,
      answer,
      unit,
      formula
    };
  }, [difficulty, includeVolume]);

  const startGame = () => {
    setGameState('playing');
    setShowCompletionHandler(false);
    gameStartTime.current = Date.now();
    setStats({
      score: 0,
      streak: 0,
      bestStreak: 0,
      questionsAnswered: 0,
      correctAnswers: 0,
      timeRemaining: 600,
      questionTimeRemaining: 60
    });
    setCurrentQuestion(generateQuestion());
    setUserAnswer('');
  };

  const nextQuestion = () => {
    setCurrentQuestion(generateQuestion());
    setUserAnswer('');
    setStats(prev => ({ ...prev, questionTimeRemaining: 60 }));
  };

  const handleTimeout = () => {
    setStats(prev => ({
      ...prev,
      questionsAnswered: prev.questionsAnswered + 1,
      streak: 0
    }));
    
    toast({
      title: "Time's up!",
      description: `The answer was ${currentQuestion?.answer} ${currentQuestion?.unit}`,
      variant: "destructive"
    });
    
    nextQuestion();
  };

  const checkAnswer = () => {
    if (!currentQuestion || !userAnswer.trim()) return;
    
    const userNum = parseFloat(userAnswer);
    const isCorrect = Math.abs(userNum - currentQuestion.answer) < 0.01;
    
    if (isCorrect) {
      const streakBonus = stats.streak >= 5 ? 50 : stats.streak >= 3 ? 25 : 0;
      const timeBonus = Math.floor(stats.questionTimeRemaining / 10) * 5;
      const points = 100 + streakBonus + timeBonus;
      
      setStats(prev => ({
        ...prev,
        score: prev.score + points,
        streak: prev.streak + 1,
        bestStreak: Math.max(prev.bestStreak, prev.streak + 1),
        questionsAnswered: prev.questionsAnswered + 1,
        correctAnswers: prev.correctAnswers + 1
      }));
      
      if (stats.streak + 1 >= 5) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
      
      toast({
        title: "Correct! 🎉",
        description: `+${points} points! (${stats.streak + 1} streak)`,
      });
    } else {
      setStats(prev => ({
        ...prev,
        questionsAnswered: prev.questionsAnswered + 1,
        streak: 0
      }));
      
      toast({
        title: "Not quite right",
        description: `The answer was ${currentQuestion.answer} ${currentQuestion.unit}`,
        variant: "destructive"
      });
    }
    
    nextQuestion();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && gameState === 'playing') {
      checkAnswer();
    }
  };

  const getShapeIcon = (shape: string) => {
    switch (shape) {
      case 'square': return <Square className="h-8 w-8" />;
      case 'rectangle': return <Square className="h-8 w-8" />;
      case 'circle': return <Circle className="h-8 w-8" />;
      case 'triangle': return <Triangle className="h-8 w-8" />;
      case 'cube': return <Box className="h-8 w-8" />;
      case 'sphere': return <Circle className="h-8 w-8" />;
      case 'cylinder': return <Box className="h-8 w-8" />;
      default: return <Hexagon className="h-8 w-8" />;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getAccuracy = () => {
    return stats.questionsAnswered > 0 ? Math.round((stats.correctAnswers / stats.questionsAnswered) * 100) : 0;
  };

  if (gameState === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <Target className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Geometry Master
              </h1>
            </div>
            <p className="text-xl text-slate-600 mb-8">Master area, perimeter, and volume calculations!</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-4 text-indigo-700">Difficulty Level</h2>
                <div className="space-y-3">
                  {[
                    { level: 'extraEasy', label: 'Extra Easy', desc: 'Squares, rectangles, triangles only (2-6)', color: 'from-emerald-400 to-green-500' },
                    { level: 'easy', label: 'Easy', desc: 'Small numbers (2-10)', color: 'from-green-400 to-emerald-500' },
                    { level: 'medium', label: 'Medium', desc: 'Medium numbers (5-20)', color: 'from-yellow-400 to-orange-500' },
                    { level: 'hard', label: 'Hard', desc: 'Large numbers (10-50)', color: 'from-red-400 to-pink-500' }
                  ].map(({ level, label, desc, color }) => (
                    <Button
                      key={level}
                      onClick={() => setDifficulty(level as any)}
                      variant={difficulty === level ? "default" : "outline"}
                      className={`w-full p-4 h-auto ${difficulty === level 
                        ? `bg-gradient-to-r ${color} text-white border-0` 
                        : 'hover:bg-gradient-to-r hover:' + color + ' hover:text-white'
                      }`}
                    >
                      <div className="text-left w-full">
                        <div className="font-bold">{label}</div>
                        <div className="text-sm opacity-90">{desc}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-4 text-purple-700">Game Options</h2>
                <div className="space-y-4">
                  <Button
                    onClick={() => setIncludeVolume(!includeVolume)}
                    variant={includeVolume ? "default" : "outline"}
                    disabled={difficulty === 'extraEasy'}
                    className={`w-full p-4 h-auto ${includeVolume 
                      ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white border-0' 
                      : 'hover:bg-gradient-to-r hover:from-purple-500 hover:to-indigo-600 hover:text-white'
                    } ${difficulty === 'extraEasy' ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="text-left">
                        <div className="font-bold">Include Volume</div>
                        <div className="text-sm opacity-90">
                          {difficulty === 'extraEasy' ? 'Not available in Extra Easy mode' : '3D shapes: cubes, spheres, cylinders'}
                        </div>
                      </div>
                      <Box className="h-6 w-6" />
                    </div>
                  </Button>

                  <div className="bg-gradient-to-r from-indigo-100 to-purple-100 p-4 rounded-lg">
                    <h3 className="font-bold text-indigo-700 mb-2">Game Rules:</h3>
                    <ul className="text-sm text-slate-600 space-y-1">
                      <li>• 10 minutes total game time</li>
                      <li>• 60 seconds per question</li>
                      <li>• Build streaks for bonus points</li>
                      <li>• Time bonus for quick answers</li>
                      {difficulty === 'extraEasy' && (
                        <li className="text-emerald-600 font-medium">• Perfect for beginners: basic shapes only!</li>
                      )}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center space-y-4">
            <Button
              onClick={startGame}
              size="lg"
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-0 px-8 py-4 text-xl font-bold rounded-xl shadow-lg"
            >
              <Play className="mr-2 h-6 w-6" />
              Start Game
            </Button>
            
            <div>
              <Link to="/">
                <Button variant="outline" size="lg" className="mx-2">
                  <Home className="mr-2 h-5 w-5" />
                  Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'finished') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4">
        <div className="container mx-auto max-w-2xl text-center">
          <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="w-24 h-24 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trophy className="h-12 w-12 text-white" />
              </div>
              
              <h1 className="text-4xl font-bold text-slate-800 mb-2">Game Complete!</h1>
              <p className="text-xl text-slate-600 mb-8">Well done on your geometry skills!</p>
              
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="bg-gradient-to-r from-blue-100 to-indigo-100 p-4 rounded-lg">
                  <div className="text-3xl font-bold text-indigo-600">{stats.score}</div>
                  <div className="text-sm text-slate-600">Final Score</div>
                </div>
                <div className="bg-gradient-to-r from-green-100 to-emerald-100 p-4 rounded-lg">
                  <div className="text-3xl font-bold text-emerald-600">{getAccuracy()}%</div>
                  <div className="text-sm text-slate-600">Accuracy</div>
                </div>
                <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-4 rounded-lg">
                  <div className="text-3xl font-bold text-purple-600">{stats.bestStreak}</div>
                  <div className="text-sm text-slate-600">Best Streak</div>
                </div>
                <div className="bg-gradient-to-r from-orange-100 to-red-100 p-4 rounded-lg">
                  <div className="text-3xl font-bold text-orange-600">{stats.correctAnswers}/{stats.questionsAnswered}</div>
                  <div className="text-sm text-slate-600">Correct Answers</div>
                </div>
              </div>
              
              <div className="space-y-4">
                <Button
                  onClick={startGame}
                  size="lg"
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-0 px-8 py-3 font-bold rounded-xl"
                >
                  <RotateCcw className="mr-2 h-5 w-5" />
                  Play Again
                </Button>
                
                <div>
                  <Link to="/">
                    <Button variant="outline" size="lg">
                      <Home className="mr-2 h-5 w-5" />
                      Back to Home
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Progress Tracking Modal */}
        {showCompletionHandler && (
          <GameCompletionHandler
            gameId="geometry-master"
            gameName="Geometry Master"
            score={stats.score}
            correctAnswers={stats.correctAnswers}
            totalQuestions={stats.questionsAnswered}
            timeSpentSeconds={Math.round((Date.now() - gameStartTime.current) / 1000)}
            difficulty={difficulty}
            onClose={() => setShowCompletionHandler(false)}
            onPlayAgain={startGame}
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-indigo-600">{stats.score}</div>
              <div className="text-sm text-slate-600">Score</div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-1">
                <Zap className="h-5 w-5 text-yellow-500" />
                <span className="text-2xl font-bold text-yellow-600">{stats.streak}</span>
              </div>
              <div className="text-sm text-slate-600">Streak</div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-1">
                <Clock className="h-5 w-5 text-blue-500" />
                <span className="text-2xl font-bold text-blue-600">{formatTime(stats.timeRemaining)}</span>
              </div>
              <div className="text-sm text-slate-600">Game Time</div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{getAccuracy()}%</div>
              <div className="text-sm text-slate-600">Accuracy</div>
            </CardContent>
          </Card>
        </div>

        {/* Question Time Progress */}
        <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-600">Question Time</span>
              <span className="text-sm font-bold text-slate-700">{stats.questionTimeRemaining}s</span>
            </div>
            <Progress 
              value={(stats.questionTimeRemaining / 60) * 100} 
              className="h-2"
              indicatorClassName={`transition-all ${
                stats.questionTimeRemaining <= 10 
                  ? 'bg-red-500' 
                  : stats.questionTimeRemaining <= 20 
                    ? 'bg-yellow-500' 
                    : 'bg-green-500'
              }`}
            />
          </CardContent>
        </Card>

        {/* Main Question Card */}
        {currentQuestion && (
          <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm mb-6">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white">
                    {getShapeIcon(currentQuestion.shape)}
                  </div>
                  <div className="text-left">
                    <h2 className="text-3xl font-bold text-slate-800 capitalize">
                      {currentQuestion.shape} {currentQuestion.type}
                    </h2>
                    <Badge variant="outline" className="mt-1">
                      Formula: {currentQuestion.formula}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-indigo-100 to-purple-100 p-6 rounded-xl mb-6">
                <h3 className="text-xl font-bold text-indigo-700 mb-3">Given Dimensions:</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries(currentQuestion.dimensions).map(([key, value]) => (
                    <div key={key} className="bg-white p-3 rounded-lg text-center">
                      <div className="text-sm text-slate-600 capitalize">{key}</div>
                      <div className="text-xl font-bold text-indigo-600">{value}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-center">
                <p className="text-xl font-medium text-slate-700 mb-4">
                  Calculate the {currentQuestion.type} of this {currentQuestion.shape}:
                </p>
                
                <div className="flex items-center justify-center gap-4 mb-6">
                  <Input
                    type="number"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter your answer"
                    className="text-center text-xl font-bold w-48 h-12"
                    step="0.01"
                  />
                  <span className="text-lg font-medium text-slate-600">
                    {currentQuestion.unit}
                  </span>
                </div>

                <Button
                  onClick={checkAnswer}
                  disabled={!userAnswer.trim()}
                  size="lg"
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-0 px-8 py-3 font-bold rounded-xl"
                >
                  Submit Answer
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Controls */}
        <div className="text-center space-x-4">
          <Button
            onClick={() => setGameState('paused')}
            variant="outline"
            size="lg"
          >
            <Pause className="mr-2 h-5 w-5" />
            Pause
          </Button>
          
          <Link to="/">
            <Button variant="outline" size="lg">
              <Home className="mr-2 h-5 w-5" />
              Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GeometryMaster;
