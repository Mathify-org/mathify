
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Play, Trophy, Clock } from 'lucide-react';
import { GameMode, Difficulty, GameStats, FractionQuestion, GameState } from '@/types/fractionFrenzy';
import GameModeCard from '@/components/FractionFrenzy/GameModeCard';
import DifficultySelector from '@/components/FractionFrenzy/DifficultySelector';
import StatsDisplay from '@/components/FractionFrenzy/StatsDisplay';
import FractionVisual from '@/components/FractionFrenzy/FractionVisual';
import GameTimer from '@/components/FractionFrenzy/GameTimer';
import GameCompletionHandler from '@/components/GameCompletionHandler';

const FractionFrenzy = () => {
  const [gameState, setGameState] = useState<GameState>('menu');
  const [selectedMode, setSelectedMode] = useState<GameMode>('visual-match');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('easy');
  const [currentQuestion, setCurrentQuestion] = useState<FractionQuestion | null>(null);
  const [showCompletionHandler, setShowCompletionHandler] = useState(false);
  const [gameStartTime, setGameStartTime] = useState<number>(Date.now());
  const [gameStats, setGameStats] = useState<GameStats>({
    score: 0,
    questionsAnswered: 0,
    correctAnswers: 0,
    streak: 0,
    timeRemaining: 60,
    totalTime: 60,
    bestFrenzyScore: 0,
    totalCorrect: 0,
    longestStreak: 0,
    currentStreak: 0,
    averageResponseTime: 0,
    gamesPlayed: 0,
    survivalModeUnlocked: false,
    selectedTheme: 'pie'
  });

  const gameModes = {
    'visual-match': { id: 'visual-match' as GameMode, title: 'Visual Match', description: 'Match fractions to visual representations', icon: '👁️', color: 'from-blue-400 to-blue-600' },
    'equivalent': { id: 'equivalent' as GameMode, title: 'Equivalent Fractions', description: 'Find equivalent fractions', icon: '⚖️', color: 'from-green-400 to-green-600' },
    'comparison': { id: 'comparison' as GameMode, title: 'Compare Fractions', description: 'Determine which fraction is larger', icon: '📊', color: 'from-purple-400 to-purple-600' },
    'arithmetic': { id: 'arithmetic' as GameMode, title: 'Fraction Math', description: 'Add, subtract, multiply, and divide', icon: '🧮', color: 'from-red-400 to-red-600' }
  };

  const generateQuestion = (): FractionQuestion => {
    const id = Math.random().toString(36).substr(2, 9);
    
    if (selectedMode === 'visual-match') {
      const numerator = Math.floor(Math.random() * 8) + 1;
      const denominator = Math.floor(Math.random() * 8) + numerator;
      return {
        id,
        type: 'visual-match',
        numerator,
        denominator,
        question: `Which visual represents ${numerator}/${denominator}?`,
        options: [`${numerator}/${denominator}`, `${numerator + 1}/${denominator}`, `${numerator}/${denominator + 1}`, `${numerator - 1}/${denominator}`],
        correctAnswer: `${numerator}/${denominator}`
      };
    }
    
    return {
      id,
      type: 'visual-match',
      numerator: 1,
      denominator: 2,
      question: 'Sample question',
      options: ['1/2', '1/3', '1/4', '1/5'],
      correctAnswer: '1/2'
    };
  };

  const startGame = () => {
    const initialTime = selectedDifficulty === 'easy' ? 90 : selectedDifficulty === 'medium' ? 60 : 45;
    
    setGameStats({
      score: 0,
      questionsAnswered: 0,
      correctAnswers: 0,
      streak: 0,
      timeRemaining: initialTime,
      totalTime: initialTime,
      bestFrenzyScore: gameStats.bestFrenzyScore,
      totalCorrect: gameStats.totalCorrect,
      longestStreak: gameStats.longestStreak,
      currentStreak: 0,
      averageResponseTime: gameStats.averageResponseTime,
      gamesPlayed: gameStats.gamesPlayed + 1,
      survivalModeUnlocked: gameStats.survivalModeUnlocked,
      selectedTheme: gameStats.selectedTheme
    });
    
    setCurrentQuestion(generateQuestion());
    setGameState('playing');
    setShowCompletionHandler(false);
    setGameStartTime(Date.now());
  };

  const handleAnswer = (answer: string) => {
    if (!currentQuestion) return;

    const isCorrect = answer === currentQuestion.correctAnswer;
    const points = isCorrect ? (10 * (gameStats.streak + 1)) : 0;

    if (isCorrect && gameStats.streak > gameStats.longestStreak) {
      // Update longest streak if current streak will be longer
    }

    setGameStats(prev => ({
      score: prev.score + points,
      questionsAnswered: prev.questionsAnswered + 1,
      correctAnswers: prev.correctAnswers + (isCorrect ? 1 : 0),
      streak: isCorrect ? prev.streak + 1 : 0,
      timeRemaining: prev.timeRemaining,
      totalTime: prev.totalTime,
      bestFrenzyScore: prev.bestFrenzyScore,
      totalCorrect: prev.totalCorrect + (isCorrect ? 1 : 0),
      longestStreak: isCorrect && prev.streak + 1 > prev.longestStreak ? prev.streak + 1 : prev.longestStreak,
      currentStreak: isCorrect ? prev.streak + 1 : 0,
      averageResponseTime: prev.averageResponseTime,
      gamesPlayed: prev.gamesPlayed,
      survivalModeUnlocked: prev.survivalModeUnlocked,
      selectedTheme: prev.selectedTheme
    }));

    // Generate next question after a short delay
    setTimeout(() => {
      setCurrentQuestion(generateQuestion());
    }, 1000);
  };

  const handleTimeUp = () => {
    setGameState('gameOver');
    setShowCompletionHandler(true);
  };

  useEffect(() => {
    if (gameState === 'playing' && gameStats.timeRemaining > 0) {
      const timer = setTimeout(() => {
        setGameStats(prev => ({
          ...prev,
          timeRemaining: prev.timeRemaining - 1
        }));
      }, 1000);

      if (gameStats.timeRemaining === 1) {
        handleTimeUp();
      }

      return () => clearTimeout(timer);
    }
  }, [gameState, gameStats.timeRemaining]);

  const backToMenu = () => {
    setGameState('menu');
    setCurrentQuestion(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Link to="/">
          <Button variant="ghost" size="icon" className="hover:bg-purple-100">
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </Link>
        <h1 className="text-4xl font-bold text-center text-purple-800">
          Fraction Frenzy
        </h1>
        <div className="w-10" /> {/* Spacer for center alignment */}
      </div>

      {/* Menu Screen */}
      {gameState === 'menu' && (
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Game Mode Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center text-purple-700">
                Choose Your Challenge
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.values(gameModes).map((mode) => (
                  <GameModeCard
                    key={mode.id}
                    id={mode.id}
                    title={mode.title}
                    description={mode.description}
                    icon={mode.icon}
                    color={mode.color}
                    isSelected={selectedMode === mode.id}
                    onSelect={() => setSelectedMode(mode.id)}
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Difficulty Selection */}
          <DifficultySelector
            difficulty={selectedDifficulty}
            onDifficultySelect={setSelectedDifficulty}
          />

          {/* Start Game Button */}
          <div className="text-center">
            <Button
              onClick={startGame}
              size="lg"
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-4 text-xl"
            >
              <Play className="mr-2 h-6 w-6" />
              Start Frenzy!
            </Button>
          </div>
        </div>
      )}

      {/* Game Screen */}
      {gameState === 'playing' && currentQuestion && (
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Game HUD */}
          <div className="flex justify-between items-center bg-white/80 backdrop-blur rounded-lg p-4">
            <StatsDisplay
              stats={{
                score: gameStats.score,
                questionsAnswered: gameStats.questionsAnswered,
                accuracy: gameStats.questionsAnswered > 0 ? (gameStats.correctAnswers / gameStats.questionsAnswered) * 100 : 0,
                streak: gameStats.streak
              }}
            />
            <GameTimer timeRemaining={gameStats.timeRemaining} totalTime={gameStats.totalTime} />
          </div>

          {/* Question Display */}
          <Card className="bg-white/90 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-2xl text-center text-purple-700">
                {currentQuestion.question}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Answer Options */}
              <div className="grid grid-cols-2 gap-4">
                {currentQuestion.options.map((option, index) => (
                  <Button
                    key={index}
                    onClick={() => handleAnswer(option)}
                    variant="outline"
                    className="h-16 text-lg hover:bg-purple-50 hover:border-purple-300"
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Game Over Screen */}
      {gameState === 'gameOver' && (
        <div className="max-w-2xl mx-auto space-y-6">
          <Card className="bg-white/90 backdrop-blur">
            <CardHeader className="text-center">
              <div className="mx-auto w-20 h-20 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center mb-4">
                <Trophy className="h-10 w-10 text-white" />
              </div>
              <CardTitle className="text-3xl text-purple-800">
                Frenzy Complete!
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Final Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-purple-600">{gameStats.score}</div>
                  <div className="text-sm text-purple-500">Final Score</div>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-green-600">
                    {gameStats.questionsAnswered > 0 ? Math.round((gameStats.correctAnswers / gameStats.questionsAnswered) * 100) : 0}%
                  </div>
                  <div className="text-sm text-green-500">Accuracy</div>
                </div>
                <div className="bg-yellow-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-yellow-600">{gameStats.streak}</div>
                  <div className="text-sm text-yellow-500">Best Streak</div>
                </div>
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-blue-600">{gameStats.timeRemaining}</div>
                  <div className="text-sm text-blue-500">Time Left</div>
                </div>
              </div>

              {/* Time Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Time Used</span>
                  <span>{Math.floor((gameStats.totalTime - gameStats.timeRemaining) / 60)}:{((gameStats.totalTime - gameStats.timeRemaining) % 60).toString().padStart(2, '0')}</span>
                </div>
              </div>

              {/* Visual Representation */}
              {currentQuestion && (
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-4 text-purple-700">Last Question Preview</h3>
                  <FractionVisual
                    numerator={currentQuestion.numerator}
                    denominator={currentQuestion.denominator}
                    showAnimation={false}
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4 justify-center">
                {gameStats.streak >= 5 && (
                  <Button
                    onClick={startGame}
                    className="bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-white"
                  >
                    <Trophy className="mr-2 h-4 w-4" />
                    Challenge Mode!
                  </Button>
                )}
                <Button
                  onClick={startGame}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                >
                  <Play className="mr-2 h-4 w-4" />
                  Play Again
                </Button>
                <Button
                  onClick={backToMenu}
                  variant="outline"
                  className="border-purple-300 text-purple-600 hover:bg-purple-50"
                >
                  Back to Menu
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* Progress Tracking Modal */}
      {showCompletionHandler && (
        <GameCompletionHandler
          gameId="fraction-frenzy"
          gameName="Fraction Frenzy"
          score={gameStats.score}
          correctAnswers={gameStats.correctAnswers}
          totalQuestions={gameStats.questionsAnswered}
          timeSpentSeconds={Math.round((Date.now() - gameStartTime) / 1000)}
          difficulty={selectedDifficulty}
          onClose={() => setShowCompletionHandler(false)}
          onPlayAgain={startGame}
        />
      )}
    </div>
  );
};

export default FractionFrenzy;
