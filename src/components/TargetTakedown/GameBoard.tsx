
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GameMode } from '@/pages/TargetTakedown';
import NumberTile from './NumberTile';
import TargetDisplay from './TargetDisplay';
import GameTimer from './GameTimer';

interface GameBoardProps {
  mode: GameMode;
  onScoreUpdate: (score: number) => void;
  onLivesUpdate: (lives: number) => void;
  onStreakUpdate: (streak: number) => void;
  onLevelUpdate: (level: number) => void;
  onGameOver: () => void;
  onPause: () => void;
}

interface NumberTileData {
  id: number;
  value: number;
  selected: boolean;
  correct: boolean;
}

const GameBoard = ({
  mode,
  onScoreUpdate,
  onLivesUpdate,
  onStreakUpdate,
  onLevelUpdate,
  onGameOver,
  onPause
}: GameBoardProps) => {
  const [target, setTarget] = useState(0);
  const [tiles, setTiles] = useState<NumberTileData[]>([]);
  const [selectedSum, setSelectedSum] = useState(0);
  const [selectedTiles, setSelectedTiles] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(mode === 'survival' ? 3 : Infinity);
  const [streak, setStreak] = useState(0);
  const [level, setLevel] = useState(1);
  const [timeLeft, setTimeLeft] = useState(mode === 'classic' ? 60 : Infinity);
  const [isGameActive, setIsGameActive] = useState(true);
  const [correctEffect, setCorrectEffect] = useState(false);
  const [wrongEffect, setWrongEffect] = useState(false);

  // Generate target and tiles based on level
  const generatePuzzle = useCallback(() => {
    const minTarget = Math.max(5, level * 2);
    const maxTarget = Math.min(50, level * 8 + 15);
    const newTarget = Math.floor(Math.random() * (maxTarget - minTarget + 1)) + minTarget;
    
    // Generate solution first
    const maxTiles = Math.min(3, Math.floor(level / 3) + 2);
    const solutionCount = Math.floor(Math.random() * maxTiles) + 1;
    const solution: number[] = [];
    let remaining = newTarget;
    
    for (let i = 0; i < solutionCount - 1; i++) {
      const maxValue = Math.min(remaining - (solutionCount - i - 1), Math.floor(newTarget * 0.7));
      const value = Math.floor(Math.random() * maxValue) + 1;
      solution.push(value);
      remaining -= value;
    }
    solution.push(remaining);
    
    // Add distractor tiles
    const distractors: number[] = [];
    const distractorCount = Math.floor(Math.random() * 4) + 3;
    
    for (let i = 0; i < distractorCount; i++) {
      const distractor = Math.floor(Math.random() * (newTarget * 0.8)) + 1;
      if (!solution.includes(distractor)) {
        distractors.push(distractor);
      }
    }
    
    // Combine and shuffle
    const allNumbers = [...solution, ...distractors];
    const shuffled = allNumbers.sort(() => Math.random() - 0.5);
    
    const newTiles: NumberTileData[] = shuffled.map((value, index) => ({
      id: index,
      value,
      selected: false,
      correct: false
    }));
    
    setTarget(newTarget);
    setTiles(newTiles);
    setSelectedSum(0);
    setSelectedTiles([]);
  }, [level]);

  // Initialize game
  useEffect(() => {
    generatePuzzle();
  }, [generatePuzzle]);

  // Timer logic
  useEffect(() => {
    if (mode === 'classic' && isGameActive && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsGameActive(false);
            onGameOver();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [mode, isGameActive, timeLeft, onGameOver]);

  // Handle tile selection
  const handleTileClick = (tileId: number) => {
    if (!isGameActive) return;
    
    const tile = tiles.find(t => t.id === tileId);
    if (!tile) return;
    
    if (tile.selected) {
      // Deselect tile
      setSelectedTiles(prev => prev.filter(id => id !== tileId));
      setSelectedSum(prev => prev - tile.value);
      setTiles(prev => prev.map(t => 
        t.id === tileId ? { ...t, selected: false } : t
      ));
    } else {
      // Select tile
      const newSum = selectedSum + tile.value;
      
      if (newSum <= target) {
        setSelectedTiles(prev => [...prev, tileId]);
        setSelectedSum(newSum);
        setTiles(prev => prev.map(t => 
          t.id === tileId ? { ...t, selected: true } : t
        ));
        
        // Check if target is hit
        if (newSum === target) {
          handleCorrectAnswer();
        }
      } else if (newSum > target) {
        // Wrong answer - exceeded target
        handleWrongAnswer();
      }
    }
  };

  const handleCorrectAnswer = () => {
    const basePoints = target;
    const streakBonus = streak >= 5 ? Math.floor(basePoints * 0.5) : 0;
    const levelBonus = Math.floor(level * 10);
    const totalPoints = basePoints + streakBonus + levelBonus;
    
    const newScore = score + totalPoints;
    const newStreak = streak + 1;
    
    setScore(newScore);
    setStreak(newStreak);
    onScoreUpdate(newScore);
    onStreakUpdate(newStreak);
    
    // Level up every 5 correct answers
    if (newStreak % 5 === 0) {
      const newLevel = level + 1;
      setLevel(newLevel);
      onLevelUpdate(newLevel);
    }
    
    // Visual feedback
    setCorrectEffect(true);
    setTimeout(() => setCorrectEffect(false), 1000);
    
    // Generate new puzzle
    setTimeout(() => {
      generatePuzzle();
    }, 500);
  };

  const handleWrongAnswer = () => {
    if (mode !== 'chill') {
      const newLives = lives - 1;
      setLives(newLives);
      onLivesUpdate(newLives);
      
      if (newLives <= 0) {
        setIsGameActive(false);
        onGameOver();
        return;
      }
    }
    
    setStreak(0);
    onStreakUpdate(0);
    
    // Visual feedback
    setWrongEffect(true);
    setTimeout(() => setWrongEffect(false), 1000);
    
    // Reset selection
    setSelectedTiles([]);
    setSelectedSum(0);
    setTiles(prev => prev.map(t => ({ ...t, selected: false })));
  };

  const getTargetColor = () => {
    if (correctEffect) return 'text-green-400 animate-pulse';
    if (wrongEffect) return 'text-red-400 animate-pulse';
    if (selectedSum === target) return 'text-green-400';
    if (selectedSum > target) return 'text-red-400';
    return 'text-white';
  };

  return (
    <div className="space-y-6">
      {mode === 'classic' && (
        <GameTimer timeLeft={timeLeft} />
      )}
      
      <TargetDisplay 
        target={target}
        selectedSum={selectedSum}
        className={getTargetColor()}
        effect={correctEffect ? 'correct' : wrongEffect ? 'wrong' : 'none'}
      />
      
      <Card className="glass-morphism border-2 border-white/30">
        <CardContent className="p-6">
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
            {tiles.map((tile) => (
              <NumberTile
                key={tile.id}
                value={tile.value}
                selected={tile.selected}
                onClick={() => handleTileClick(tile.id)}
                disabled={!isGameActive}
              />
            ))}
          </div>
        </CardContent>
      </Card>
      
      {selectedSum > 0 && (
        <Card className="glass-morphism border-2 border-white/30">
          <CardContent className="p-4 text-center">
            <p className="text-lg text-white/80">Current Sum:</p>
            <p className={`text-4xl font-bold ${getTargetColor()}`}>
              {selectedSum}
            </p>
            {selectedSum === target && (
              <Badge className="bg-green-500 text-white mt-2 animate-bounce">
                🎯 Target Hit!
              </Badge>
            )}
            {selectedSum > target && (
              <Badge className="bg-red-500 text-white mt-2 animate-pulse">
                ❌ Too High!
              </Badge>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GameBoard;
