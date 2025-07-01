import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Trophy, Star, Clock, CheckCircle, XCircle, RotateCcw, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import confetti from 'canvas-confetti';

type Difficulty = 'easy' | 'medium' | 'hard';
type GameState = 'menu' | 'playing' | 'finished';
type QuestionType = 'timeConversion' | 'elapsedTime' | 'timeComparison' | 'dateArithmetic';

interface Question {
  type: QuestionType;
  question: string;
  answer: string;
  options?: string[];
}

const TimeMaster = () => {
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

  const formatTime = (hours: number, minutes: number, format12Hour = false) => {
    if (format12Hour) {
      const period = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
      return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
    }
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const generateQuestion = (): Question => {
    const questionTypes: QuestionType[] = ['timeConversion', 'elapsedTime', 'timeComparison', 'dateArithmetic'];
    const questionType = questionTypes[Math.floor(Math.random() * questionTypes.length)];
    
    switch (questionType) {
      case 'timeConversion':
        if (difficulty === 'easy') {
          const hours = Math.floor(Math.random() * 5) + 1;
          const minutes = hours * 60;
          return {
            type: 'timeConversion',
            question: `How many minutes are in ${hours} hour${hours > 1 ? 's' : ''}?`,
            answer: minutes.toString(),
            options: [
              minutes.toString(),
              (minutes + 10).toString(),
              (minutes - 10).toString(),
              (minutes + 30).toString()
            ].sort(() => Math.random() - 0.5)
          };
        } else if (difficulty === 'medium') {
          const totalMinutes = (Math.floor(Math.random() * 4) + 2) * 60 + (Math.floor(Math.random() * 6) * 10);
          const hours = Math.floor(totalMinutes / 60);
          const mins = totalMinutes % 60;
          return {
            type: 'timeConversion',
            question: `Convert ${totalMinutes} minutes to hours and minutes.`,
            answer: mins === 0 ? `${hours} hours` : `${hours} hours ${mins} minutes`,
            options: [
              mins === 0 ? `${hours} hours` : `${hours} hours ${mins} minutes`,
              mins === 0 ? `${hours + 1} hours` : `${hours + 1} hours ${mins} minutes`,
              mins === 0 ? `${hours} hours 30 minutes` : `${hours} hours ${mins + 10} minutes`,
              mins === 0 ? `${hours - 1} hours` : `${hours - 1} hours ${mins} minutes`
            ].sort(() => Math.random() - 0.5)
          };
        } else {
          const days = Math.floor(Math.random() * 7) + 3;
          const hours = days * 24;
          return {
            type: 'timeConversion',
            question: `How many hours are in ${days} days?`,
            answer: hours.toString()
          };
        }

      case 'elapsedTime':
        const startHour = Math.floor(Math.random() * 10) + 1;
        const startMin = difficulty === 'easy' ? 0 : Math.floor(Math.random() * 60);
        const elapsed = difficulty === 'easy' ? 
          Math.floor(Math.random() * 3) + 1 :
          Math.floor(Math.random() * 4) + 1;
        
        const endHour = startHour + elapsed;
        const endMin = startMin;
        
        return {
          type: 'elapsedTime',
          question: `If you start at ${formatTime(startHour, startMin, true)} and wait ${elapsed} hour${elapsed > 1 ? 's' : ''}, what time will it be?`,
          answer: formatTime(endHour > 12 ? endHour - 12 : endHour, endMin, true),
          options: difficulty !== 'hard' ? [
            formatTime(endHour > 12 ? endHour - 12 : endHour, endMin, true),
            formatTime(endHour > 12 ? endHour - 11 : endHour + 1, endMin, true),
            formatTime(endHour > 12 ? endHour - 13 : endHour - 1, endMin, true),
            formatTime(endHour > 12 ? endHour - 10 : endHour + 2, endMin, true)
          ].sort(() => Math.random() - 0.5) : undefined
        };

      case 'timeComparison':
        const time1Hours = Math.floor(Math.random() * 12) + 1;
        const time1Minutes = Math.floor(Math.random() * 60);
        const time2Hours = Math.floor(Math.random() * 12) + 1;
        const time2Minutes = Math.floor(Math.random() * 60);
        
        const time1Total = time1Hours * 60 + time1Minutes;
        const time2Total = time2Hours * 60 + time2Minutes;
        
        let comparison = '';
        if (time1Total > time2Total) comparison = formatTime(time1Hours, time1Minutes, true);
        else if (time2Total > time1Total) comparison = formatTime(time2Hours, time2Minutes, true);
        else comparison = 'They are the same';
        
        return {
          type: 'timeComparison',
          question: `Which time is later: ${formatTime(time1Hours, time1Minutes, true)} or ${formatTime(time2Hours, time2Minutes, true)}?`,
          answer: comparison,
          options: [
            formatTime(time1Hours, time1Minutes, true),
            formatTime(time2Hours, time2Minutes, true),
            'They are the same'
          ]
        };

      case 'dateArithmetic':
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        const currentDay = Math.floor(Math.random() * 7);
        const addDays = difficulty === 'easy' ? 
          Math.floor(Math.random() * 3) + 1 :
          Math.floor(Math.random() * 10) + 1;
        
        const resultDay = (currentDay + addDays) % 7;
        
        return {
          type: 'dateArithmetic',
          question: `If today is ${days[currentDay]}, what day will it be in ${addDays} day${addDays > 1 ? 's' : ''}?`,
          answer: days[resultDay],
          options: difficulty !== 'hard' ? [
            days[resultDay],
            days[(resultDay + 1) % 7],
            days[(resultDay + 2) % 7],
            days[(resultDay - 1 + 7) % 7]
          ].sort(() => Math.random() - 0.5) : undefined
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

    const isCorrect = userAnswer.toLowerCase().trim() === currentQuestion.answer.toLowerCase().trim();
    
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
    if (percentage >= 90) return "🕐 Amazing! You're a time master!";
    if (percentage >= 70) return "⏰ Great job! Keep practicing!";
    if (percentage >= 50) return "🕒 Good effort! You're improving!";
    return "⏱️ Keep trying! Practice makes perfect!";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-cyan-50 to-indigo-100 p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Time Master
          </h1>
          <p className="text-lg text-gray-600">Master time and dates like a pro!</p>
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
                          {diff === 'easy' && 'Simple time conversions and basic calculations'}
                          {diff === 'medium' && 'More complex time problems and comparisons'}
                          {diff === 'hard' && 'Advanced time arithmetic and conversions'}
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

            <Card className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-0 shadow-xl">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">How to Play</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p>• Convert between time units</p>
                    <p>• Calculate elapsed time</p>
                    <p>• Compare different times</p>
                  </div>
                  <div>
                    <p>• Work with dates and days</p>
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
                  <div className="text-2xl font-bold text-blue-600">{score}</div>
                  <div className="text-sm text-gray-600">Score</div>
                </CardContent>
              </Card>
              <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-indigo-600">{questionIndex + 1}/{totalQuestions}</div>
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
                
                {currentQuestion.options ? (
                  <div className="grid grid-cols-1 gap-3 mb-6">
                    {currentQuestion.options.map((option, index) => (
                      <Button
                        key={index}
                        onClick={() => setUserAnswer(option)}
                        variant={userAnswer === option ? "default" : "outline"}
                        className={`p-4 text-lg ${userAnswer === option ? 'bg-blue-600 text-white' : 'hover:bg-blue-50'}`}
                        disabled={feedback !== null}
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                ) : (
                  <div className="mb-6">
                    <input
                      type="text"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      className="w-full max-w-xs h-16 text-2xl font-bold text-center border-2 border-blue-300 rounded-lg focus:border-blue-500 focus:outline-none"
                      placeholder="Your answer"
                      disabled={feedback !== null}
                    />
                  </div>
                )}

                <Button
                  onClick={checkAnswer}
                  disabled={!userAnswer || feedback !== null}
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:scale-105 transition-transform text-white font-bold px-8 py-3 text-lg"
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
                            Incorrect. Answer: {currentQuestion.answer}
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
                <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-6 rounded-xl">
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
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:scale-105 transition-transform text-white font-bold px-8 py-3"
                >
                  <RotateCcw className="h-5 w-5 mr-2" />
                  Play Again
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="text-center mt-8">
          <Link to="/" className="text-blue-600 hover:text-blue-800 font-medium">
            ← Back to Games
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TimeMaster;
