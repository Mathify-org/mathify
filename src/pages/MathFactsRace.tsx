
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Trophy, Target, Clock, Zap } from 'lucide-react';
import { toast } from 'sonner';
import GameCompletionHandler from '@/components/GameCompletionHandler';

interface Question {
  id: number;
  question: string;
  answer: number;
  userAnswer?: number;
  isCorrect?: boolean;
  timeSpent?: number;
}

interface GameStats {
  score: number;
  streak: number;
  questionsAnswered: number;
  timeRemaining: number;
  accuracy: number;
}

const MathFactsRace = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameMode, setGameMode] = useState<'addition' | 'subtraction' | 'multiplication' | 'division' | 'mixed'>('addition');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [userInput, setUserInput] = useState('');
  const [gameStats, setGameStats] = useState<GameStats>({
    score: 0,
    streak: 0,
    questionsAnswered: 0,
    timeRemaining: 60,
    accuracy: 0
  });
  const [gameOver, setGameOver] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [showCompletionHandler, setShowCompletionHandler] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const gameStartTime = useRef<number>(Date.now());

  // Generate a random question based on mode and difficulty
  const generateQuestion = (): Question => {
    const getDifficultyRange = () => {
      switch (difficulty) {
        case 'easy': return { min: 1, max: 10 };
        case 'medium': return { min: 5, max: 20 };
        case 'hard': return { min: 10, max: 50 };
      }
    };

    const { min, max } = getDifficultyRange();
    const a = Math.floor(Math.random() * (max - min + 1)) + min;
    const b = Math.floor(Math.random() * (max - min + 1)) + min;

    const modes = gameMode === 'mixed' ? ['addition', 'subtraction', 'multiplication', 'division'] : [gameMode];
    const selectedMode = modes[Math.floor(Math.random() * modes.length)];

    let question: string;
    let answer: number;

    switch (selectedMode) {
      case 'addition':
        question = `${a} + ${b}`;
        answer = a + b;
        break;
      case 'subtraction':
        question = `${Math.max(a, b)} - ${Math.min(a, b)}`;
        answer = Math.max(a, b) - Math.min(a, b);
        break;
      case 'multiplication':
        const smallA = Math.floor(Math.random() * 12) + 1;
        const smallB = Math.floor(Math.random() * 12) + 1;
        question = `${smallA} × ${smallB}`;
        answer = smallA * smallB;
        break;
      case 'division':
        const divisor = Math.floor(Math.random() * 10) + 2;
        const quotient = Math.floor(Math.random() * 10) + 1;
        const dividend = divisor * quotient;
        question = `${dividend} ÷ ${divisor}`;
        answer = quotient;
        break;
      default:
        question = `${a} + ${b}`;
        answer = a + b;
    }

    return {
      id: Date.now(),
      question,
      answer
    };
  };

  // Start the game
  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setShowCompletionHandler(false);
    setCorrectAnswers(0);
    gameStartTime.current = Date.now();
    setGameStats({
      score: 0,
      streak: 0,
      questionsAnswered: 0,
      timeRemaining: 60,
      accuracy: 0
    });
    setQuestions([]);
    setCurrentQuestion(generateQuestion());
    setUserInput('');
  };

  // Handle answer submission
  const submitAnswer = () => {
    if (!currentQuestion || userInput === '') return;

    const userAnswer = parseInt(userInput);
    const isCorrect = userAnswer === currentQuestion.answer;
    
    const updatedQuestion: Question = {
      ...currentQuestion,
      userAnswer,
      isCorrect
    };

    setQuestions(prev => [...prev, updatedQuestion]);

    if (isCorrect) {
      const points = 10 + (gameStats.streak * 2);
      setCorrectAnswers(prev => prev + 1);
      setGameStats(prev => ({
        ...prev,
        score: prev.score + points,
        streak: prev.streak + 1,
        questionsAnswered: prev.questionsAnswered + 1,
        accuracy: Math.round(((prev.questionsAnswered * prev.accuracy + 100) / (prev.questionsAnswered + 1)))
      }));
      
      toast.success(`Correct! +${points} points`, {
        duration: 1000,
      });
    } else {
      setGameStats(prev => ({
        ...prev,
        streak: 0,
        questionsAnswered: prev.questionsAnswered + 1,
        accuracy: Math.round(((prev.questionsAnswered * prev.accuracy) / (prev.questionsAnswered + 1)))
      }));
      
      toast.error(`Wrong! The answer was ${currentQuestion.answer}`, {
        duration: 2000,
      });
    }

    // Generate next question
    setCurrentQuestion(generateQuestion());
    setUserInput('');
  };

  // Handle key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      submitAnswer();
    }
  };

  // Game timer
  useEffect(() => {
    if (gameStarted && !gameOver && gameStats.timeRemaining > 0) {
      const timer = setTimeout(() => {
        setGameStats(prev => ({
          ...prev,
          timeRemaining: prev.timeRemaining - 1
        }));
      }, 1000);
      return () => clearTimeout(timer);
    } else if (gameStats.timeRemaining === 0 && gameStarted) {
      setGameOver(true);
      setGameStarted(false);
      setShowCompletionHandler(true);
    }
  }, [gameStarted, gameOver, gameStats.timeRemaining]);

  if (gameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-4 flex items-center justify-center">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <div className="flex items-center justify-between mb-4">
              <Link to="/">
                <Button variant="ghost" size="icon">
                  <ArrowLeft />
                </Button>
              </Link>
              <CardTitle className="text-3xl font-bold">🏁 Race Complete!</CardTitle>
              <div></div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <Trophy className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                <p className="text-2xl font-bold">{gameStats.score}</p>
                <p className="text-sm text-gray-600">Final Score</p>
              </div>
              <div className="text-center">
                <Target className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <p className="text-2xl font-bold">{gameStats.questionsAnswered}</p>
                <p className="text-sm text-gray-600">Questions</p>
              </div>
              <div className="text-center">
                <Zap className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                <p className="text-2xl font-bold">{gameStats.accuracy}%</p>
                <p className="text-sm text-gray-600">Accuracy</p>
              </div>
              <div className="text-center">
                <Clock className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <p className="text-2xl font-bold">{Math.max(0, gameStats.streak)}</p>
                <p className="text-sm text-gray-600">Best Streak</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={startGame} className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600">
                🚀 Race Again
              </Button>
              <Link to="/">
                <Button variant="outline" className="w-full sm:w-auto">
                  🏠 Back to Games
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
        
        {/* Progress Tracking Modal */}
        {showCompletionHandler && (
          <GameCompletionHandler
            gameId="math-facts-race"
            gameName="Math Facts Race"
            score={gameStats.score}
            correctAnswers={correctAnswers}
            totalQuestions={gameStats.questionsAnswered}
            timeSpentSeconds={Math.round((Date.now() - gameStartTime.current) / 1000)}
            difficulty={difficulty}
            onClose={() => setShowCompletionHandler(false)}
            onPlayAgain={startGame}
          />
        )}
      </div>
    );
  }

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-4">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-center mb-8">
            <Link to="/">
              <Button variant="ghost" size="icon" className="text-white mr-4 hover:bg-white/10">
                <ArrowLeft />
              </Button>
            </Link>
            <h1 className="text-4xl md:text-6xl font-bold text-white">🏎️ Math Facts Race</h1>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 justify-items-center md:justify-items-stretch">
            <Card className="w-full max-w-md md:max-w-none">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="text-blue-500" />
                  Choose Game Mode
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { id: 'addition', name: 'Addition', icon: '➕', desc: 'Practice adding numbers' },
                  { id: 'subtraction', name: 'Subtraction', icon: '➖', desc: 'Practice subtracting numbers' },
                  { id: 'multiplication', name: 'Multiplication', icon: '✖️', desc: 'Practice times tables' },
                  { id: 'division', name: 'Division', icon: '➗', desc: 'Practice dividing numbers' },
                  { id: 'mixed', name: 'Mixed Mode', icon: '🎲', desc: 'Random mix of all operations' }
                ].map((mode) => (
                  <Button
                    key={mode.id}
                    variant={gameMode === mode.id ? "default" : "outline"}
                    className="w-full justify-start h-auto p-4"
                    onClick={() => setGameMode(mode.id as any)}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{mode.icon}</span>
                      <div className="text-left">
                        <div className="font-bold">{mode.name}</div>
                        <div className="text-sm opacity-70">{mode.desc}</div>
                      </div>
                    </div>
                  </Button>
                ))}
              </CardContent>
            </Card>

            <Card className="w-full max-w-md md:max-w-none">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="text-purple-500" />
                  Choose Difficulty
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { id: 'easy', name: 'Easy', range: '1-10', color: 'bg-green-500' },
                  { id: 'medium', name: 'Medium', range: '5-20', color: 'bg-yellow-500' },
                  { id: 'hard', name: 'Hard', range: '10-50', color: 'bg-red-500' }
                ].map((diff) => (
                  <Button
                    key={diff.id}
                    variant={difficulty === diff.id ? "default" : "outline"}
                    className="w-full justify-start h-auto p-4"
                    onClick={() => setDifficulty(diff.id as any)}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full ${diff.color}`}></div>
                      <div className="text-left">
                        <div className="font-bold">{diff.name}</div>
                        <div className="text-sm opacity-70">Numbers {diff.range}</div>
                      </div>
                    </div>
                  </Button>
                ))}
                
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-bold mb-2">🏁 Race Rules:</h3>
                  <ul className="text-sm space-y-1">
                    <li>• Answer as many questions as you can in 60 seconds</li>
                    <li>• Build streaks for bonus points</li>
                    <li>• Press Enter or click Submit to answer</li>
                    <li>• Aim for speed and accuracy!</li>
                  </ul>
                </div>
                
                <Button
                  onClick={startGame}
                  className="w-full text-xl py-6 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                >
                  🚀 Start Race!
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 p-4">
      <div className="container mx-auto max-w-4xl">
        {/* Game Header */}
        <div className="flex items-center justify-between mb-6">
          <Link to="/">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
              <ArrowLeft />
            </Button>
          </Link>
          <h1 className="text-2xl md:text-4xl font-bold text-white">🏎️ Math Facts Race</h1>
          <div></div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <Trophy className="h-6 w-6 text-yellow-500 mx-auto mb-1" />
              <p className="text-2xl font-bold">{gameStats.score}</p>
              <p className="text-sm text-gray-600">Score</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <Zap className="h-6 w-6 text-purple-500 mx-auto mb-1" />
              <p className="text-2xl font-bold">{gameStats.streak}</p>
              <p className="text-sm text-gray-600">Streak</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <Target className="h-6 w-6 text-green-500 mx-auto mb-1" />
              <p className="text-2xl font-bold">{gameStats.accuracy}%</p>
              <p className="text-sm text-gray-600">Accuracy</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <Clock className="h-6 w-6 text-red-500 mx-auto mb-1" />
              <p className="text-2xl font-bold">{gameStats.timeRemaining}</p>
              <p className="text-sm text-gray-600">Time Left</p>
            </CardContent>
          </Card>
        </div>

        {/* Progress Bar */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Time Remaining</span>
              <span className="text-sm text-gray-600">{gameStats.timeRemaining}s</span>
            </div>
            <Progress value={(gameStats.timeRemaining / 60) * 100} className="h-3" />
          </CardContent>
        </Card>

        {/* Main Question Area */}
        <Card className="mb-6">
          <CardContent className="p-8 text-center">
            {currentQuestion && (
              <>
                <div className="mb-6">
                  <p className="text-sm text-gray-600 mb-2">Question #{gameStats.questionsAnswered + 1}</p>
                  <p className="text-4xl md:text-6xl font-bold text-purple-700 mb-6">
                    {currentQuestion.question} = ?
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <input
                    type="number"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="text-2xl md:text-3xl text-center p-4 border-2 border-purple-300 rounded-lg w-40 focus:outline-none focus:border-purple-500"
                    placeholder="?"
                    autoFocus
                  />
                  <Button
                    onClick={submitAnswer}
                    disabled={userInput === ''}
                    className="px-8 py-4 text-xl bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                  >
                    Submit ⚡
                  </Button>
                </div>
                
                {gameStats.streak > 0 && (
                  <div className="mt-4">
                    <Badge className="bg-orange-500 text-white text-lg px-4 py-2">
                      🔥 {gameStats.streak} Streak! 
                    </Badge>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Game Mode Info */}
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex justify-center items-center gap-4 text-sm text-gray-600">
              <Badge variant="outline">{gameMode.charAt(0).toUpperCase() + gameMode.slice(1)}</Badge>
              <Badge variant="outline">{difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}</Badge>
              <span>Questions Answered: {gameStats.questionsAnswered}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MathFactsRace;
