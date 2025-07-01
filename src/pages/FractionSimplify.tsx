
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Trophy, Star, Clock, CheckCircle, XCircle, RotateCcw, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import confetti from 'canvas-confetti';

type Difficulty = 'easy' | 'medium' | 'hard';
type GameState = 'menu' | 'playing' | 'finished';
type QuestionType = 'simplify' | 'add' | 'subtract';

interface Question {
  type: QuestionType;
  // For simplification
  numerator?: number;
  denominator?: number;
  simplifiedNumerator?: number;
  simplifiedDenominator?: number;
  // For addition/subtraction
  fraction1Num?: number;
  fraction1Den?: number;
  fraction2Num?: number;
  fraction2Den?: number;
  resultNum?: number;
  resultDen?: number;
  operation?: '+' | '-';
}

const FractionSimplify = () => {
  const [gameState, setGameState] = useState<GameState>('menu');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [totalTimeLeft, setTotalTimeLeft] = useState(180); // 3 minutes
  const [userNumerator, setUserNumerator] = useState('');
  const [userDenominator, setUserDenominator] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);

  const totalQuestions = 10;

  // Generate GCD function
  const gcd = (a: number, b: number): number => {
    return b === 0 ? a : gcd(b, a % b);
  };

  // Generate LCM function
  const lcm = (a: number, b: number): number => {
    return (a * b) / gcd(a, b);
  };

  // Simplify fraction
  const simplifyFraction = (num: number, den: number) => {
    const divisor = gcd(Math.abs(num), Math.abs(den));
    return {
      numerator: num / divisor,
      denominator: den / divisor
    };
  };

  // Generate questions based on difficulty and type
  const generateQuestion = (): Question => {
    const questionTypes: QuestionType[] = ['simplify', 'add', 'subtract'];
    const questionType = questionTypes[Math.floor(Math.random() * questionTypes.length)];
    
    if (questionType === 'simplify') {
      let numerator: number, denominator: number;
      
      switch (difficulty) {
        case 'easy':
          numerator = Math.floor(Math.random() * 20) + 2;
          denominator = Math.floor(Math.random() * 20) + 2;
          break;
        case 'medium':
          numerator = Math.floor(Math.random() * 50) + 5;
          denominator = Math.floor(Math.random() * 50) + 5;
          break;
        case 'hard':
          numerator = Math.floor(Math.random() * 100) + 10;
          denominator = Math.floor(Math.random() * 100) + 10;
          break;
      }

      // Ensure the fraction can be simplified
      const commonFactor = Math.floor(Math.random() * 5) + 2;
      numerator *= commonFactor;
      denominator *= commonFactor;

      const divisor = gcd(numerator, denominator);
      return {
        type: 'simplify',
        numerator,
        denominator,
        simplifiedNumerator: numerator / divisor,
        simplifiedDenominator: denominator / divisor
      };
    } else {
      // Addition or subtraction
      let f1Num: number, f1Den: number, f2Num: number, f2Den: number;
      
      switch (difficulty) {
        case 'easy':
          f1Num = Math.floor(Math.random() * 10) + 1;
          f1Den = Math.floor(Math.random() * 10) + 2;
          f2Num = Math.floor(Math.random() * 10) + 1;
          f2Den = Math.floor(Math.random() * 10) + 2;
          break;
        case 'medium':
          f1Num = Math.floor(Math.random() * 20) + 1;
          f1Den = Math.floor(Math.random() * 20) + 2;
          f2Num = Math.floor(Math.random() * 20) + 1;
          f2Den = Math.floor(Math.random() * 20) + 2;
          break;
        case 'hard':
          f1Num = Math.floor(Math.random() * 30) + 1;
          f1Den = Math.floor(Math.random() * 30) + 2;
          f2Num = Math.floor(Math.random() * 30) + 1;
          f2Den = Math.floor(Math.random() * 30) + 2;
          break;
      }

      const operation = questionType === 'add' ? '+' : '-';
      const commonDen = lcm(f1Den, f2Den);
      const adjustedF1Num = f1Num * (commonDen / f1Den);
      const adjustedF2Num = f2Num * (commonDen / f2Den);
      
      let resultNum: number;
      if (operation === '+') {
        resultNum = adjustedF1Num + adjustedF2Num;
      } else {
        resultNum = adjustedF1Num - adjustedF2Num;
        // Ensure positive result for simplicity
        if (resultNum < 0) {
          resultNum = Math.abs(resultNum);
        }
      }

      const simplified = simplifyFraction(resultNum, commonDen);

      return {
        type: questionType,
        fraction1Num: f1Num,
        fraction1Den: f1Den,
        fraction2Num: f2Num,
        fraction2Den: f2Den,
        operation,
        resultNum: simplified.numerator,
        resultDen: simplified.denominator
      };
    }
  };

  // Start game
  const startGame = (selectedDifficulty: Difficulty) => {
    setDifficulty(selectedDifficulty);
    setGameState('playing');
    setScore(0);
    setQuestionIndex(0);
    setStreak(0);
    setTimeLeft(30);
    setTotalTimeLeft(180);
    setCurrentQuestion(generateQuestion());
    setUserNumerator('');
    setUserDenominator('');
    setFeedback(null);
  };

  // Check answer
  const checkAnswer = () => {
    if (!currentQuestion || !userNumerator || !userDenominator) return;

    const userNum = parseInt(userNumerator);
    const userDen = parseInt(userDenominator);
    
    let isCorrect = false;
    
    if (currentQuestion.type === 'simplify') {
      isCorrect = userNum === currentQuestion.simplifiedNumerator && 
                  userDen === currentQuestion.simplifiedDenominator;
    } else {
      isCorrect = userNum === currentQuestion.resultNum && 
                  userDen === currentQuestion.resultDen;
    }
    
    if (isCorrect) {
      setScore(score + 1);
      setStreak(streak + 1);
      setBestStreak(Math.max(bestStreak, streak + 1));
      setFeedback('correct');
      
      // Celebration effect
      confetti({
        particleCount: 30,
        spread: 60,
        origin: { y: 0.6 }
      });
    } else {
      setStreak(0);
      setFeedback('incorrect');
    }

    setTimeout(nextQuestion, 1500);
  };

  // Next question
  const nextQuestion = () => {
    if (questionIndex + 1 >= totalQuestions || totalTimeLeft <= 0) {
      setGameState('finished');
      if (score >= 7) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    } else {
      setQuestionIndex(questionIndex + 1);
      setCurrentQuestion(generateQuestion());
      setUserNumerator('');
      setUserDenominator('');
      setFeedback(null);
      setTimeLeft(30);
    }
  };

  // Timer effects
  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0 && totalTimeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
        setTotalTimeLeft(totalTimeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && gameState === 'playing') {
      setStreak(0);
      setFeedback('incorrect');
      setTimeout(nextQuestion, 1500);
    } else if (totalTimeLeft === 0 && gameState === 'playing') {
      setGameState('finished');
    }
  }, [timeLeft, totalTimeLeft, gameState]);

  // Handle Enter key
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && gameState === 'playing' && userNumerator && userDenominator) {
        checkAnswer();
      }
    };
    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, [gameState, userNumerator, userDenominator]);

  const getDifficultyColor = (diff: Difficulty) => {
    switch (diff) {
      case 'easy': return 'from-green-400 to-emerald-500';
      case 'medium': return 'from-yellow-400 to-orange-500';
      case 'hard': return 'from-red-400 to-pink-500';
    }
  };

  const getPerformanceMessage = () => {
    const percentage = (score / totalQuestions) * 100;
    if (percentage >= 90) return "🌟 Amazing! You're a fraction master!";
    if (percentage >= 70) return "🎉 Great job! Keep practicing!";
    if (percentage >= 50) return "👍 Good effort! You're improving!";
    return "💪 Keep trying! Practice makes perfect!";
  };

  const renderQuestion = () => {
    if (!currentQuestion) return null;
    
    if (currentQuestion.type === 'simplify') {
      return (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-8 text-gray-800">Simplify this fraction:</h2>
          <div className="inline-block">
            <div className="text-6xl font-bold text-purple-600 border-b-4 border-purple-600 px-4 pb-2">
              {currentQuestion.numerator}
            </div>
            <div className="text-6xl font-bold text-purple-600 px-4 pt-2">
              {currentQuestion.denominator}
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-8 text-gray-800">
            {currentQuestion.type === 'add' ? 'Add' : 'Subtract'} these fractions:
          </h2>
          <div className="flex items-center justify-center gap-6">
            <div className="inline-block">
              <div className="text-4xl font-bold text-purple-600 border-b-4 border-purple-600 px-3 pb-1">
                {currentQuestion.fraction1Num}
              </div>
              <div className="text-4xl font-bold text-purple-600 px-3 pt-1">
                {currentQuestion.fraction1Den}
              </div>
            </div>
            <div className="text-4xl font-bold text-gray-600">
              {currentQuestion.operation}
            </div>
            <div className="inline-block">
              <div className="text-4xl font-bold text-purple-600 border-b-4 border-purple-600 px-3 pb-1">
                {currentQuestion.fraction2Num}
              </div>
              <div className="text-4xl font-bold text-purple-600 px-3 pt-1">
                {currentQuestion.fraction2Den}
              </div>
            </div>
            <div className="text-4xl font-bold text-gray-600">=</div>
            <div className="text-4xl font-bold text-gray-400">?</div>
          </div>
        </div>
      );
    }
  };

  const getCorrectAnswer = () => {
    if (!currentQuestion) return '';
    
    if (currentQuestion.type === 'simplify') {
      return `${currentQuestion.simplifiedNumerator}/${currentQuestion.simplifiedDenominator}`;
    } else {
      return `${currentQuestion.resultNum}/${currentQuestion.resultDen}`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 p-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Fraction Master
          </h1>
          <p className="text-lg text-gray-600">Master fractions and become a math hero!</p>
        </div>

        {/* Menu State */}
        {gameState === 'menu' && (
          <div className="space-y-8">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Choose Your Challenge</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {(['easy', 'medium', 'hard'] as Difficulty[]).map((diff) => (
                    <Card key={diff} className="overflow-hidden hover:scale-105 transition-transform cursor-pointer border-0 shadow-lg">
                      <div className={`h-3 bg-gradient-to-r ${getDifficultyColor(diff)}`}></div>
                      <CardContent className="p-6 text-center">
                        <h3 className="text-xl font-bold mb-2 capitalize">{diff}</h3>
                        <p className="text-gray-600 mb-4">
                          {diff === 'easy' && 'Simple fractions & operations'}
                          {diff === 'medium' && 'Medium fractions & operations'}
                          {diff === 'hard' && 'Complex fractions & operations'}
                        </p>
                        <Button 
                          onClick={() => startGame(diff)}
                          className={`w-full bg-gradient-to-r ${getDifficultyColor(diff)} hover:scale-105 transition-transform text-white font-bold py-3`}
                        >
                          Start {diff.charAt(0).toUpperCase() + diff.slice(1)}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0 shadow-xl">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">How to Play</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p>• Simplify fractions to lowest terms</p>
                    <p>• Add and subtract fractions</p>
                    <p>• 30 seconds per question</p>
                  </div>
                  <div>
                    <p>• 3 minutes total time limit</p>
                    <p>• 10 questions per game</p>
                    <p>• Build streaks for bonus points</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Playing State */}
        {gameState === 'playing' && currentQuestion && (
          <div className="space-y-6">
            {/* Game HUD */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">{score}</div>
                  <div className="text-sm text-gray-600">Score</div>
                </CardContent>
              </Card>
              <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">{questionIndex + 1}/{totalQuestions}</div>
                  <div className="text-sm text-gray-600">Question</div>
                </CardContent>
              </Card>
              <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600">{streak}</div>
                  <div className="text-sm text-gray-600">Streak</div>
                </CardContent>
              </Card>
              <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-red-600">{Math.floor(totalTimeLeft / 60)}:{(totalTimeLeft % 60).toString().padStart(2, '0')}</div>
                  <div className="text-sm text-gray-600">Time Left</div>
                </CardContent>
              </Card>
            </div>

            {/* Question Timer */}
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Clock className="h-5 w-5 text-orange-500" />
                  <span className="font-medium">Question Timer: {timeLeft}s</span>
                </div>
                <Progress value={(timeLeft / 30) * 100} className="h-2" />
              </CardContent>
            </Card>

            {/* Main Question */}
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
              <CardContent className="p-8 text-center">
                {renderQuestion()}

                {/* Answer Inputs */}
                <div className="flex items-center justify-center gap-4 mb-6">
                  <input
                    type="number"
                    value={userNumerator}
                    onChange={(e) => setUserNumerator(e.target.value)}
                    className="w-20 h-16 text-2xl font-bold text-center border-2 border-purple-300 rounded-lg focus:border-purple-500 focus:outline-none"
                    placeholder="?"
                    disabled={feedback !== null}
                  />
                  <div className="text-4xl font-bold text-gray-400">/</div>
                  <input
                    type="number"
                    value={userDenominator}
                    onChange={(e) => setUserDenominator(e.target.value)}
                    className="w-20 h-16 text-2xl font-bold text-center border-2 border-purple-300 rounded-lg focus:border-purple-500 focus:outline-none"
                    placeholder="?"
                    disabled={feedback !== null}
                  />
                </div>

                {/* Submit Button */}
                <Button
                  onClick={checkAnswer}
                  disabled={!userNumerator || !userDenominator || feedback !== null}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:scale-105 transition-transform text-white font-bold px-8 py-3 text-lg"
                >
                  Check Answer
                </Button>

                {/* Feedback */}
                {feedback && (
                  <div className={`mt-6 p-4 rounded-lg ${feedback === 'correct' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    <div className="flex items-center justify-center gap-2">
                      {feedback === 'correct' ? (
                        <>
                          <CheckCircle className="h-6 w-6" />
                          <span className="font-bold">Correct! Great job!</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-6 w-6" />
                          <span className="font-bold">
                            Incorrect. Answer: {getCorrectAnswer()}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Finished State */}
        {gameState === 'finished' && (
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-8 text-center">
              <div className="mb-6">
                <Trophy className="h-16 w-16 mx-auto text-yellow-500 mb-4" />
                <h2 className="text-3xl font-bold mb-2 text-gray-800">Game Complete!</h2>
                <p className="text-xl text-gray-600">{getPerformanceMessage()}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-6 rounded-xl">
                  <div className="text-3xl font-bold">{score}/{totalQuestions}</div>
                  <div>Final Score</div>
                </div>
                <div className="bg-gradient-to-r from-green-500 to-teal-500 text-white p-6 rounded-xl">
                  <div className="text-3xl font-bold">{bestStreak}</div>
                  <div>Best Streak</div>
                </div>
                <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6 rounded-xl">
                  <div className="text-3xl font-bold">{Math.round((score / totalQuestions) * 100)}%</div>
                  <div>Accuracy</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => startGame(difficulty)}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:scale-105 transition-transform text-white font-bold px-8 py-3"
                >
                  <RotateCcw className="h-5 w-5 mr-2" />
                  Play Again
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Back to Home */}
        <div className="text-center mt-8">
          <Link to="/" className="text-purple-600 hover:text-purple-800 font-medium">
            ← Back to Games
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FractionSimplify;
