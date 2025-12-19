
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Brain, Lightbulb, CheckCircle, XCircle, Home, Play, Trophy, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import GameCompletionHandler from '@/components/GameCompletionHandler';

interface Question {
  id: number;
  question: string;
  correctAnswer: boolean;
  explanation: string;
}

interface GameStats {
  currentQuestion: number;
  score: number;
  correctAnswers: number;
}

const MathIntuition = () => {
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'finished'>('menu');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [stats, setStats] = useState<GameStats>({ currentQuestion: 1, score: 0, correctAnswers: 0 });
  const [showResult, setShowResult] = useState(false);
  const [lastAnswer, setLastAnswer] = useState<boolean | null>(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showCompletionHandler, setShowCompletionHandler] = useState(false);
  const gameStartTime = useRef<number>(Date.now());

  const questions: Question[] = [
    {
      id: 1,
      question: "If you have 10 apples and eat 3, do you have more than 5 apples left?",
      correctAnswer: true,
      explanation: "10 - 3 = 7, and 7 is greater than 5!"
    },
    {
      id: 2,
      question: "Is it possible to have half of an apple?",
      correctAnswer: true,
      explanation: "Yes! You can cut an apple in half to get two equal pieces."
    },
    {
      id: 3,
      question: "If you walk 100 steps forward and then 100 steps backward, are you at the same place you started?",
      correctAnswer: true,
      explanation: "Yes! Forward and backward movements cancel each other out."
    },
    {
      id: 4,
      question: "Can you measure the length of your room with your feet?",
      correctAnswer: true,
      explanation: "Yes! You can count how many of your foot lengths fit across the room."
    },
    {
      id: 5,
      question: "If a pizza is cut into 8 slices and you eat 4 slices, did you eat more than half?",
      correctAnswer: false,
      explanation: "You ate exactly half! 4 out of 8 slices equals one half."
    },
    {
      id: 6,
      question: "Is zero a number?",
      correctAnswer: true,
      explanation: "Yes! Zero represents 'nothing' but it's still a very important number."
    },
    {
      id: 7,
      question: "If you have 5 fingers on each hand, do you have 12 fingers in total?",
      correctAnswer: false,
      explanation: "You have 10 fingers total! 5 + 5 = 10, not 12."
    },
    {
      id: 8,
      question: "Can you make a square using 3 sticks?",
      correctAnswer: false,
      explanation: "No! A square needs 4 equal sides, so you need 4 sticks."
    },
    {
      id: 9,
      question: "If you save $1 every day for a week, will you have $7?",
      correctAnswer: true,
      explanation: "Yes! 7 days × $1 per day = $7 total."
    },
    {
      id: 10,
      question: "Is a circle round?",
      correctAnswer: true,
      explanation: "Yes! A circle is perfectly round with no corners or edges."
    },
    {
      id: 11,
      question: "If you split 6 cookies equally between 3 friends, does each friend get 3 cookies?",
      correctAnswer: false,
      explanation: "Each friend gets 2 cookies! 6 ÷ 3 = 2."
    },
    {
      id: 12,
      question: "Can you count higher than 100?",
      correctAnswer: true,
      explanation: "Yes! Numbers go on forever - 101, 102, 103, and so on!"
    },
    {
      id: 13,
      question: "If it's 3 o'clock now, will it be 5 o'clock in 3 hours?",
      correctAnswer: false,
      explanation: "It will be 6 o'clock! 3 + 3 = 6."
    },
    {
      id: 14,
      question: "Does a triangle have more sides than a circle?",
      correctAnswer: true,
      explanation: "A triangle has 3 sides, while a circle has no straight sides at all!"
    },
    {
      id: 15,
      question: "If you flip a coin, are there exactly 2 possible outcomes?",
      correctAnswer: true,
      explanation: "Yes! A coin can land on either heads or tails - that's 2 outcomes."
    },
    {
      id: 16,
      question: "Can you have negative candy?",
      correctAnswer: false,
      explanation: "You can't have negative physical objects like candy, but you can owe candy!"
    },
    {
      id: 17,
      question: "If you arrange 12 chairs in 3 equal rows, will each row have 4 chairs?",
      correctAnswer: true,
      explanation: "Yes! 12 ÷ 3 = 4 chairs per row."
    },
    {
      id: 18,
      question: "Is the number 8 bigger than the number 5?",
      correctAnswer: true,
      explanation: "Yes! 8 comes after 5 when counting, so 8 is bigger."
    },
    {
      id: 19,
      question: "Can you make a pattern with just one color?",
      correctAnswer: true,
      explanation: "Yes! You can make patterns with shapes, sizes, or arrangements using one color."
    },
    {
      id: 20,
      question: "If you have 2 groups of 5 stickers each, do you have 10 stickers total?",
      correctAnswer: true,
      explanation: "Yes! 2 × 5 = 10 stickers in total."
    }
  ];

  const handleAnswer = (answer: boolean) => {
    const currentQuestion = questions[currentQuestionIndex];
    const correct = answer === currentQuestion.correctAnswer;
    
    setLastAnswer(answer);
    setIsCorrect(correct);
    setShowResult(true);
    
    if (correct) {
      setStats(prev => ({ 
        ...prev, 
        score: prev.score + 5,
        correctAnswers: prev.correctAnswers + 1 
      }));
      
      // Trigger success animation
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setStats(prev => ({ ...prev, currentQuestion: prev.currentQuestion + 1 }));
      setShowResult(false);
      setLastAnswer(null);
    } else {
      setGameState('finished');
      if (stats.correctAnswers >= 15) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    }
  };

  const startGame = () => {
    setGameState('playing');
    setCurrentQuestionIndex(0);
    setStats({ currentQuestion: 1, score: 0, correctAnswers: 0 });
    setShowResult(false);
    setLastAnswer(null);
    setShowCompletionHandler(false);
    gameStartTime.current = Date.now();
  };

  const resetGame = () => {
    setGameState('menu');
    setCurrentQuestionIndex(0);
    setStats({ currentQuestion: 1, score: 0, correctAnswers: 0 });
    setShowResult(false);
    setLastAnswer(null);
    setShowCompletionHandler(false);
  };

  if (gameState === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 p-2 sm:p-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-4 sm:mb-8">
            <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="w-12 h-12 sm:w-20 sm:h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-lg">
                <Brain className="h-6 w-6 sm:h-10 sm:w-10 text-white" />
              </div>
              <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Math Intuition
              </h1>
            </div>
            <p className="text-lg sm:text-xl md:text-2xl text-slate-600 mb-4 sm:mb-8 px-2">
              Test your mathematical thinking with fun yes/no questions!
            </p>
          </div>

          <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm mb-4 sm:mb-8 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-1">
              <div className="bg-white rounded-lg p-4 sm:p-8">
                <div className="text-center">
                  <Lightbulb className="h-12 w-12 sm:h-16 sm:w-16 text-purple-600 mx-auto mb-3 sm:mb-4" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-purple-700 mb-3 sm:mb-4">How It Works</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
                    <div className="bg-gradient-to-br from-purple-100 to-pink-100 p-3 sm:p-4 rounded-lg">
                      <div className="text-xl sm:text-2xl font-bold text-purple-600 mb-1 sm:mb-2">20</div>
                      <div className="text-sm sm:text-base text-purple-700 font-medium">Questions</div>
                      <div className="text-xs sm:text-sm text-slate-600">Fun math situations</div>
                    </div>
                    <div className="bg-gradient-to-br from-pink-100 to-purple-100 p-3 sm:p-4 rounded-lg">
                      <div className="text-xl sm:text-2xl font-bold text-pink-600 mb-1 sm:mb-2">Yes/No</div>
                      <div className="text-sm sm:text-base text-pink-700 font-medium">Answers Only</div>
                      <div className="text-xs sm:text-sm text-slate-600">Simple choices</div>
                    </div>
                    <div className="bg-gradient-to-br from-indigo-100 to-purple-100 p-3 sm:p-4 rounded-lg">
                      <div className="text-xl sm:text-2xl font-bold text-indigo-600 mb-1 sm:mb-2">Learn</div>
                      <div className="text-sm sm:text-base text-indigo-700 font-medium">Every Answer</div>
                      <div className="text-xs sm:text-sm text-slate-600">Instant explanations</div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-yellow-100 to-orange-100 p-3 sm:p-4 rounded-lg mb-4 sm:mb-6">
                    <p className="text-sm sm:text-base text-orange-700 font-medium">
                      💡 No calculations needed - just use your math intuition!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <div className="text-center space-y-3 sm:space-y-4">
            <Button
              onClick={startGame}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 px-8 sm:px-12 py-4 sm:py-6 text-lg sm:text-2xl font-bold rounded-xl sm:rounded-2xl shadow-xl transform hover:scale-105 transition-all w-full sm:w-auto"
            >
              <Play className="mr-2 sm:mr-3 h-6 w-6 sm:h-8 sm:w-8" />
              Start Test
            </Button>
            
            <div>
              <Link to="/">
                <Button variant="outline" size="lg" className="mx-2 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg w-full sm:w-auto">
                  <Home className="mr-2 h-5 w-5 sm:h-6 sm:w-6" />
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
    const percentage = Math.round((stats.correctAnswers / questions.length) * 100);

    if (showCompletionHandler) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 p-2 sm:p-4">
          <div className="container mx-auto max-w-2xl">
            <GameCompletionHandler
              gameId="math-intuition"
              gameName="Math Intuition"
              score={stats.score}
              correctAnswers={stats.correctAnswers}
              totalQuestions={questions.length}
              timeSpentSeconds={Math.round((Date.now() - gameStartTime.current) / 1000)}
              difficulty="medium"
              onPlayAgain={() => {
                setShowCompletionHandler(false);
                startGame();
              }}
              onClose={() => {
                setShowCompletionHandler(false);
                resetGame();
              }}
            />
          </div>
        </div>
      );
    }

    let message = "";
    let color = "";
    
    if (percentage >= 90) {
      message = "Outstanding! You're a math genius! 🌟";
      color = "from-yellow-400 to-orange-500";
    } else if (percentage >= 75) {
      message = "Excellent work! Great math intuition! 🎉";
      color = "from-green-400 to-emerald-500";
    } else if (percentage >= 60) {
      message = "Good job! Keep practicing! 👍";
      color = "from-blue-400 to-indigo-500";
    } else {
      message = "Nice try! Practice makes perfect! 💪";
      color = "from-purple-400 to-pink-500";
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 p-2 sm:p-4">
        <div className="container mx-auto max-w-2xl text-center">
          <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm overflow-hidden">
            <div className={`bg-gradient-to-r ${color} p-1`}>
              <div className="bg-white rounded-lg p-4 sm:p-8">
                <div className={`w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-r ${color} rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6`}>
                  <Trophy className="h-8 w-8 sm:h-12 sm:w-12 text-white" />
                </div>
                
                <h1 className="text-2xl sm:text-4xl font-bold text-slate-800 mb-2">Test Complete!</h1>
                <p className="text-lg sm:text-xl text-slate-600 mb-4 sm:mb-6 px-2">{message}</p>
                
                <div className="grid grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
                  <div className={`bg-gradient-to-r ${color.replace('to', 'to-opacity-20')} p-4 sm:p-6 rounded-xl`}>
                    <div className="text-2xl sm:text-4xl font-bold text-slate-800">{stats.correctAnswers}</div>
                    <div className="text-sm sm:text-base text-slate-600">Correct Answers</div>
                    <div className="text-xs sm:text-sm text-slate-500">out of {questions.length}</div>
                  </div>
                  <div className={`bg-gradient-to-r ${color.replace('to', 'to-opacity-20')} p-4 sm:p-6 rounded-xl`}>
                    <div className="text-2xl sm:text-4xl font-bold text-slate-800">{percentage}%</div>
                    <div className="text-sm sm:text-base text-slate-600">Accuracy</div>
                    <div className="text-xs sm:text-sm text-slate-500">Score</div>
                  </div>
                </div>
                
                <div className="space-y-3 sm:space-y-4">
                  <Button
                    onClick={() => setShowCompletionHandler(true)}
                    size="lg"
                    className={`bg-gradient-to-r ${color} hover:opacity-90 text-white border-0 px-6 sm:px-8 py-3 font-bold rounded-xl w-full sm:w-auto`}
                  >
                    View Results & XP
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 p-2 sm:p-4">
      <div className="container mx-auto max-w-4xl">
        {/* Progress Header */}
        <div className="mb-4 sm:mb-6">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="text-xs sm:text-sm font-medium text-slate-600">
              Question {stats.currentQuestion} of {questions.length}
            </div>
            <div className="text-xs sm:text-sm font-medium text-slate-600">
              Score: {stats.score}
            </div>
          </div>
          <Progress 
            value={(stats.currentQuestion / questions.length) * 100} 
            className="h-2 sm:h-3"
            indicatorClassName="bg-gradient-to-r from-purple-500 to-pink-500"
          />
        </div>

        {/* Question Card */}
        <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm mb-4 sm:mb-6 overflow-hidden">
          {!showResult ? (
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-1">
              <div className="bg-white rounded-lg p-4 sm:p-8 md:p-12">
                <div className="text-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                    <Brain className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                  </div>
                  
                  <h2 className="text-lg sm:text-2xl md:text-3xl font-bold text-slate-800 mb-6 sm:mb-8 leading-relaxed px-2">
                    {currentQuestion.question}
                  </h2>
                  
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
                    <Button
                      onClick={() => handleAnswer(true)}
                      size="lg"
                      className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white border-0 px-8 sm:px-12 py-4 sm:py-6 text-lg sm:text-xl font-bold rounded-xl sm:rounded-2xl shadow-lg transform hover:scale-105 transition-all w-full sm:w-auto"
                    >
                      <CheckCircle className="mr-2 sm:mr-3 h-6 w-6 sm:h-8 sm:w-8" />
                      YES
                    </Button>
                    
                    <Button
                      onClick={() => handleAnswer(false)}
                      size="lg"
                      className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white border-0 px-8 sm:px-12 py-4 sm:py-6 text-lg sm:text-xl font-bold rounded-xl sm:rounded-2xl shadow-lg transform hover:scale-105 transition-all w-full sm:w-auto"
                    >
                      <XCircle className="mr-2 sm:mr-3 h-6 w-6 sm:h-8 sm:w-8" />
                      NO
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className={`bg-gradient-to-r ${isCorrect ? 'from-green-500 to-emerald-600' : 'from-red-500 to-pink-600'} p-1`}>
              <div className="bg-white rounded-lg p-4 sm:p-8 md:p-12">
                <div className="text-center">
                  <div className={`w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r ${isCorrect ? 'from-green-500 to-emerald-600' : 'from-red-500 to-pink-600'} rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 animate-bounce`}>
                    {isCorrect ? <CheckCircle className="h-8 w-8 sm:h-10 sm:w-10 text-white" /> : <XCircle className="h-8 w-8 sm:h-10 sm:w-10 text-white" />}
                  </div>
                  
                  <h3 className={`text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                    {isCorrect ? 'Correct!' : 'Not quite!'}
                  </h3>
                  
                  <div className="bg-gradient-to-r from-blue-100 to-indigo-100 p-4 sm:p-6 rounded-xl mb-4 sm:mb-6">
                    <p className="text-base sm:text-lg text-slate-700 font-medium">
                      {currentQuestion.explanation}
                    </p>
                  </div>
                  
                  <Button
                    onClick={nextQuestion}
                    size="lg"
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-bold rounded-xl w-full sm:w-auto"
                  >
                    {currentQuestionIndex === questions.length - 1 ? 'See Results' : 'Next Question'}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Controls */}
        <div className="text-center">
          <Link to="/">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              <Home className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MathIntuition;
