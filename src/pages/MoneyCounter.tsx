
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Trophy, Star, Clock, CheckCircle, XCircle, RotateCcw, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';
import confetti from 'canvas-confetti';

type Difficulty = 'easy' | 'medium' | 'hard';
type GameState = 'menu' | 'playing' | 'finished';
type QuestionType = 'countCoins' | 'makeChange' | 'addMoney' | 'compareMoney';

interface Coin {
  value: number;
  name: string;
  color: string;
  count: number;
}

interface Question {
  type: QuestionType;
  question: string;
  answer: number;
  coins?: Coin[];
  options?: number[];
}

const MoneyCounter = () => {
  const [gameState, setGameState] = useState<GameState>('menu');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [totalTimeLeft, setTotalTimeLeft] = useState(180);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);

  const totalQuestions = 10;

  const coinTypes = [
    { value: 1, name: 'penny', color: 'bg-amber-600' },
    { value: 5, name: 'nickel', color: 'bg-gray-400' },
    { value: 10, name: 'dime', color: 'bg-gray-300' },
    { value: 25, name: 'quarter', color: 'bg-gray-200' },
    { value: 100, name: 'dollar', color: 'bg-green-500' }
  ];

  const formatMoney = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  const generateQuestion = (): Question => {
    const questionTypes: QuestionType[] = ['countCoins', 'makeChange', 'addMoney', 'compareMoney'];
    const questionType = questionTypes[Math.floor(Math.random() * questionTypes.length)];
    
    switch (questionType) {
      case 'countCoins':
        const coins: Coin[] = [];
        let totalValue = 0;
        
        if (difficulty === 'easy') {
          // Use only pennies and nickels for easy mode
          const pennies = Math.floor(Math.random() * 10) + 1;
          const nickels = Math.floor(Math.random() * 5);
          
          if (pennies > 0) coins.push({ value: 1, name: 'penny', color: 'bg-amber-600', count: pennies });
          if (nickels > 0) coins.push({ value: 5, name: 'nickel', color: 'bg-gray-400', count: nickels });
          
          totalValue = pennies + nickels * 5;
        } else if (difficulty === 'medium') {
          // Use pennies, nickels, and dimes
          const pennies = Math.floor(Math.random() * 8);
          const nickels = Math.floor(Math.random() * 4);
          const dimes = Math.floor(Math.random() * 3);
          
          if (pennies > 0) coins.push({ value: 1, name: 'penny', color: 'bg-amber-600', count: pennies });
          if (nickels > 0) coins.push({ value: 5, name: 'nickel', color: 'bg-gray-400', count: nickels });
          if (dimes > 0) coins.push({ value: 10, name: 'dime', color: 'bg-gray-300', count: dimes });
          
          totalValue = pennies + nickels * 5 + dimes * 10;
        } else {
          // Use all coin types for hard mode
          const pennies = Math.floor(Math.random() * 6);
          const nickels = Math.floor(Math.random() * 3);
          const dimes = Math.floor(Math.random() * 3);
          const quarters = Math.floor(Math.random() * 4);
          const dollars = Math.floor(Math.random() * 2);
          
          if (pennies > 0) coins.push({ value: 1, name: 'penny', color: 'bg-amber-600', count: pennies });
          if (nickels > 0) coins.push({ value: 5, name: 'nickel', color: 'bg-gray-400', count: nickels });
          if (dimes > 0) coins.push({ value: 10, name: 'dime', color: 'bg-gray-300', count: dimes });
          if (quarters > 0) coins.push({ value: 25, name: 'quarter', color: 'bg-gray-200', count: quarters });
          if (dollars > 0) coins.push({ value: 100, name: 'dollar', color: 'bg-green-500', count: dollars });
          
          totalValue = pennies + nickels * 5 + dimes * 10 + quarters * 25 + dollars * 100;
        }
        
        return {
          type: 'countCoins',
          question: 'How much money is shown?',
          answer: totalValue,
          coins,
          options: difficulty !== 'hard' ? [
            totalValue,
            totalValue + 5,
            totalValue - 5,
            totalValue + 10
          ].filter(val => val >= 0).sort(() => Math.random() - 0.5) : undefined
        };

      case 'makeChange':
        const itemCost = difficulty === 'easy' ? 
          Math.floor(Math.random() * 50) + 10 :
          Math.floor(Math.random() * 200) + 25;
        const paidAmount = itemCost + (difficulty === 'easy' ? 
          [5, 10, 25][Math.floor(Math.random() * 3)] :
          Math.floor(Math.random() * 100) + 25);
        const change = paidAmount - itemCost;
        
        return {
          type: 'makeChange',
          question: `If an item costs ${formatMoney(itemCost)} and you pay ${formatMoney(paidAmount)}, how much change do you get?`,
          answer: change,
          options: difficulty !== 'hard' ? [
            change,
            change + 5,
            change - 5,
            change + 10
          ].filter(val => val >= 0).sort(() => Math.random() - 0.5) : undefined
        };

      case 'addMoney':
        const amount1 = difficulty === 'easy' ? 
          Math.floor(Math.random() * 50) + 5 :
          Math.floor(Math.random() * 150) + 10;
        const amount2 = difficulty === 'easy' ? 
          Math.floor(Math.random() * 50) + 5 :
          Math.floor(Math.random() * 150) + 10;
        const sum = amount1 + amount2;
        
        return {
          type: 'addMoney',
          question: `What is ${formatMoney(amount1)} + ${formatMoney(amount2)}?`,
          answer: sum,
          options: difficulty !== 'hard' ? [
            sum,
            sum + 25,
            sum - 25,
            sum + 50
          ].filter(val => val >= 0).sort(() => Math.random() - 0.5) : undefined
        };

      case 'compareMoney':
        const money1 = Math.floor(Math.random() * 200) + 25;
        const money2 = Math.floor(Math.random() * 200) + 25;
        const difference = Math.abs(money1 - money2);
        
        return {
          type: 'compareMoney',
          question: `What is the difference between ${formatMoney(money1)} and ${formatMoney(money2)}?`,
          answer: difference,
          options: [
            difference,
            difference + 25,
            difference - 25,
            difference + 50
          ].filter(val => val >= 0).sort(() => Math.random() - 0.5)
        };

      default:
        return generateQuestion();
    }
  };

  const startGame = (selectedDifficulty: Difficulty) => {
    setDifficulty(selectedDifficulty);
    setGameState('playing');
    setScore(0);
    setQuestionIndex(0);
    setStreak(0);
    setTimeLeft(60);
    setTotalTimeLeft(180);
    setCurrentQuestion(generateQuestion());
    setUserAnswer('');
    setFeedback(null);
  };

  const checkAnswer = () => {
    if (!currentQuestion || !userAnswer) return;

    // Parse user answer as dollars and convert to cents for comparison
    const userValueInCents = Math.round(parseFloat(userAnswer) * 100);
    const correctValueInCents = currentQuestion.answer;
    
    const isCorrect = userValueInCents === correctValueInCents;
    
    if (isCorrect) {
      setScore(score + 1);
      setStreak(streak + 1);
      setBestStreak(Math.max(bestStreak, streak + 1));
      setFeedback('correct');
      
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

  const selectAnswer = (value: number) => {
    // Store the dollar value directly as string for display
    setUserAnswer((value / 100).toFixed(2));
  };

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
      setUserAnswer('');
      setFeedback(null);
      setTimeLeft(60);
    }
  };

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

  const getDifficultyColor = (diff: Difficulty) => {
    switch (diff) {
      case 'easy': return 'from-green-400 to-emerald-500';
      case 'medium': return 'from-yellow-400 to-orange-500';
      case 'hard': return 'from-red-400 to-pink-500';
    }
  };

  const getPerformanceMessage = () => {
    const percentage = (score / totalQuestions) * 100;
    if (percentage >= 90) return "💰 Amazing! You're a money master!";
    if (percentage >= 70) return "💵 Great job! Keep practicing!";
    if (percentage >= 50) return "🪙 Good effort! You're improving!";
    return "💸 Keep trying! Practice makes perfect!";
  };

  const renderCoins = () => {
    if (!currentQuestion || !currentQuestion.coins) return null;
    
    return (
      <div className="mb-6">
        <div className="flex flex-wrap gap-2 justify-center">
          {currentQuestion.coins.map((coin, coinIndex) => (
            <div key={coinIndex} className="text-center">
              <div className="flex flex-wrap gap-1 justify-center mb-2">
                {[...Array(coin.count)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-12 h-12 rounded-full ${coin.color} border-2 border-gray-700 flex items-center justify-center text-white font-bold text-xs shadow-lg`}
                  >
                    {coin.value === 100 ? '$1' : `${coin.value}¢`}
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-600">
                {coin.count} {coin.name}{coin.count > 1 ? (coin.name === 'penny' ? 'ies' : 's') : ''}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-emerald-50 to-teal-100 p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4">
            Money Counter
          </h1>
          <p className="text-lg text-gray-600">Learn to count money like a pro!</p>
        </div>

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
                          {diff === 'easy' && 'Simple coins: pennies and nickels'}
                          {diff === 'medium' && 'More coins: pennies, nickels, and dimes'}
                          {diff === 'hard' && 'All coins and bills with complex problems'}
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

            <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 shadow-xl">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">How to Play</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p>• Count coins and bills</p>
                    <p>• Calculate change</p>
                    <p>• Add and subtract money</p>
                  </div>
                  <div>
                    <p>• Compare amounts</p>
                    <p>• 60 seconds per question</p>
                    <p>• Build streaks for bonus points</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {gameState === 'playing' && currentQuestion && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">{score}</div>
                  <div className="text-sm text-gray-600">Score</div>
                </CardContent>
              </Card>
              <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-emerald-600">{questionIndex + 1}/{totalQuestions}</div>
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

            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Clock className="h-5 w-5 text-orange-500" />
                  <span className="font-medium">Question Timer: {timeLeft}s</span>
                </div>
                <Progress value={(timeLeft / 60) * 100} className="h-2" />
              </CardContent>
            </Card>

            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
              <CardContent className="p-8 text-center">
                <h2 className="text-xl font-bold mb-6 text-gray-800">{currentQuestion.question}</h2>
                
                {renderCoins()}
                
                {currentQuestion.options ? (
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {currentQuestion.options.map((option, index) => (
                      <Button
                        key={index}
                        onClick={() => selectAnswer(option)}
                        variant={parseFloat(userAnswer) === option / 100 ? "default" : "outline"}
                        className={`p-4 text-lg ${parseFloat(userAnswer) === option / 100 ? 'bg-green-600 text-white' : 'hover:bg-green-50'}`}
                        disabled={feedback !== null}
                      >
                        {formatMoney(option)}
                      </Button>
                    ))}
                  </div>
                ) : (
                  <div className="mb-6">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <DollarSign className="h-6 w-6 text-green-600" />
                      <input
                        type="number"
                        step="0.01"
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        className="w-32 h-16 text-2xl font-bold text-center border-2 border-green-300 rounded-lg focus:border-green-500 focus:outline-none"
                        placeholder="0.00"
                        disabled={feedback !== null}
                      />
                    </div>
                    <p className="text-sm text-gray-600">Enter amount in dollars (e.g., 1.25)</p>
                  </div>
                )}

                <Button
                  onClick={checkAnswer}
                  disabled={!userAnswer || feedback !== null}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:scale-105 transition-transform text-white font-bold px-8 py-3 text-lg"
                >
                  Check Answer
                </Button>

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
                            Incorrect. Answer: {formatMoney(currentQuestion.answer)}
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

        {gameState === 'finished' && (
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-8 text-center">
              <div className="mb-6">
                <Trophy className="h-16 w-16 mx-auto text-yellow-500 mb-4" />
                <h2 className="text-3xl font-bold mb-2 text-gray-800">Game Complete!</h2>
                <p className="text-xl text-gray-600">{getPerformanceMessage()}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-6 rounded-xl">
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
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:scale-105 transition-transform text-white font-bold px-8 py-3"
                >
                  <RotateCcw className="h-5 w-5 mr-2" />
                  Play Again
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="text-center mt-8">
          <Link to="/" className="text-green-600 hover:text-green-800 font-medium">
            ← Back to Games
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MoneyCounter;
