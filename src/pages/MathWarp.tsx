
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Rocket, Zap } from 'lucide-react';
import GameArea from '@/components/MathWarp/GameArea';
import GameHUD from '@/components/MathWarp/GameHUD';
import GameMenu from '@/components/MathWarp/GameMenu';
import GameOver from '@/components/MathWarp/GameOver';

export type GameState = 'menu' | 'playing' | 'gameOver';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Equation {
  id: string;
  question: string;
  answer: number;
  options: number[];
  type: 'multiplication' | 'division';
}

const MathWarp = () => {
  const [gameState, setGameState] = useState<GameState>('menu');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [lives, setLives] = useState(3);

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setStreak(0);
    setTimeLeft(60);
    setLives(3);
  };

  const endGame = () => {
    setGameState('gameOver');
  };

  const backToMenu = () => {
    setGameState('menu');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-black overflow-hidden">
      {/* Header */}
      <div className="relative z-10 p-4">
        <div className="flex items-center justify-between">
          <Link to="/">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
              <ArrowLeft />
            </Button>
          </Link>
          {gameState !== 'menu' && (
            <GameHUD 
              score={score}
              streak={streak}
              timeLeft={timeLeft}
              lives={lives}
            />
          )}
          <div></div>
        </div>
      </div>

      {/* Game Content */}
      <div className="relative h-screen">
        {gameState === 'menu' && (
          <GameMenu onStartGame={startGame} />
        )}
        
        {gameState === 'playing' && (
          <GameArea
            onScoreUpdate={setScore}
            onStreakUpdate={setStreak}
            onTimeUpdate={setTimeLeft}
            onLivesUpdate={setLives}
            onGameEnd={endGame}
            difficulty={difficulty}
          />
        )}
        
        {gameState === 'gameOver' && (
          <GameOver
            score={score}
            streak={streak}
            onPlayAgain={startGame}
            onBackToMenu={backToMenu}
          />
        )}
      </div>
    </div>
  );
};

export default MathWarp;
