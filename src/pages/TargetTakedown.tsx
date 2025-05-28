
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowUp, Star, Flame } from 'lucide-react';
import GameBoard from '@/components/TargetTakedown/GameBoard';
import GameStats from '@/components/TargetTakedown/GameStats';
import ModeSelector from '@/components/TargetTakedown/ModeSelector';
import DifficultyBadge from '@/components/TargetTakedown/DifficultyBadge';

export type GameMode = 'classic' | 'survival' | 'chill';
export type GameState = 'menu' | 'playing' | 'paused' | 'gameOver';

const TargetTakedown = () => {
  const [gameState, setGameState] = useState<GameState>('menu');
  const [selectedMode, setSelectedMode] = useState<GameMode>('classic');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [streak, setStreak] = useState(0);
  const [level, setLevel] = useState(1);

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setLives(selectedMode === 'survival' ? 3 : Infinity);
    setStreak(0);
    setLevel(1);
  };

  const handleGameOver = () => {
    setGameState('gameOver');
  };

  const resetGame = () => {
    setGameState('menu');
  };

  if (gameState === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-6xl font-bold text-white mb-4 animate-bounce">
              🎯 Target Takedown
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Tap numbers to hit the target! Ultra-fun math for ages 8-14
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="glass-morphism border-2 border-white/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Star className="text-yellow-400" />
                  Choose Your Mode
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ModeSelector 
                  selectedMode={selectedMode}
                  onModeSelect={setSelectedMode}
                />
                <Button
                  onClick={startGame}
                  className="w-full mt-6 text-xl py-6 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  🚀 START GAME
                </Button>
              </CardContent>
            </Card>

            <Card className="glass-morphism border-2 border-white/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Flame className="text-orange-400" />
                  How to Play
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Badge className="bg-blue-500 text-white">1</Badge>
                  <p>A target number appears at the top</p>
                </div>
                <div className="flex items-start gap-3">
                  <Badge className="bg-blue-500 text-white">2</Badge>
                  <p>Tap number tiles that add up to the target</p>
                </div>
                <div className="flex items-start gap-3">
                  <Badge className="bg-blue-500 text-white">3</Badge>
                  <p>Hit the target to zap it and score points!</p>
                </div>
                <div className="flex items-start gap-3">
                  <Badge className="bg-orange-500 text-white">⚡</Badge>
                  <p>Build streaks for bonus points and flame effects!</p>
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
      <div className="min-h-screen bg-gradient-to-br from-red-600 via-purple-600 to-blue-600 p-4 flex items-center justify-center">
        <Card className="glass-morphism border-2 border-white/30 max-w-md w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-4xl mb-4">
              {selectedMode === 'survival' ? '💀 Game Over!' : '⏰ Time\'s Up!'}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="space-y-2">
              <p className="text-3xl font-bold text-yellow-400">Final Score: {score}</p>
              <p className="text-xl">Best Streak: {streak}</p>
              <p className="text-lg">Level Reached: {level}</p>
            </div>
            <div className="space-y-3">
              <Button
                onClick={startGame}
                className="w-full text-xl py-4 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold"
              >
                🔄 Play Again
              </Button>
              <Button
                onClick={resetGame}
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-4">
      <div className="max-w-6xl mx-auto">
        <GameStats
          score={score}
          lives={lives}
          streak={streak}
          level={level}
          mode={selectedMode}
        />
        <GameBoard
          mode={selectedMode}
          onScoreUpdate={setScore}
          onLivesUpdate={setLives}
          onStreakUpdate={setStreak}
          onLevelUpdate={setLevel}
          onGameOver={handleGameOver}
          onPause={() => setGameState('paused')}
        />
      </div>
    </div>
  );
};

export default TargetTakedown;
