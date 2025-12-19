
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
  onCorrectAnswersUpdate: (correct: number) => void;
  onQuestionsAnsweredUpdate: (total: number) => void;
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
  onCorrectAnswersUpdate,
  onQuestionsAnsweredUpdate,
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
  const [timeLeft, setTimeLeft] = useState(10); // 10 seconds per target in classic
  const [totalTimeLeft, setTotalTimeLeft] = useState(mode === 'classic' ? 60 : Infinity); // 60 seconds total for classic
  const [isGameActive, setIsGameActive] = useState(true);
  const [correctEffect, setCorrectEffect] = useState(false);
  const [wrongEffect, setWrongEffect] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);

  // Generate target and tiles based on streak (progressive difficulty)
  const generatePuzzle = useCallback(() => {
    // Difficulty increases with streak
    const difficulty = Math.floor(streak / 3) + 1; // Every 3 streaks = harder
    const minTiles = 8 + difficulty; // Start with 8, increase to 14+
    const maxTiles = 12 + difficulty * 2; // More tiles as difficulty increases
    const tileCount = Math.floor(Math.random() * (maxTiles - minTiles + 1)) + minTiles;
    
    // Target range based on difficulty
    const minTarget = 15 + (difficulty * 5);
    const maxTarget = 35 + (difficulty * 10);
    const newTarget = Math.floor(Math.random() * (maxTarget - minTarget + 1)) + minTarget;
    
    // Generate solution first (always require 2-4 tiles)
    const minSolutionTiles = 2;
    const maxSolutionTiles = Math.min(4, 2 + Math.floor(difficulty / 2));
    const solutionTileCount = Math.floor(Math.random() * (maxSolutionTiles - minSolutionTiles + 1)) + minSolutionTiles;
    
    const solution: number[] = [];
    let remaining = newTarget;
    
    // Generate solution tiles ensuring no single tile equals target
    for (let i = 0; i < solutionTileCount - 1; i++) {
      const minValue = Math.max(1, Math.floor(remaining * 0.2));
      const maxValue = Math.min(remaining - (solutionTileCount - i - 1), Math.floor(remaining * 0.7));
      const value = Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
      solution.push(value);
      remaining -= value;
    }
    
    // Add final tile to complete the sum
    if (remaining > 0) {
      solution.push(remaining);
    }
    
    // Generate distractor tiles (ensuring none equal the target)
    const distractors: number[] = [];
    const distractorCount = tileCount - solution.length;
    
    for (let i = 0; i < distractorCount; i++) {
      let distractor;
      do {
        // Make distractors challenging but not impossible
        const range = Math.floor(newTarget * 0.8);
        distractor = Math.floor(Math.random() * range) + 1;
      } while (
        distractor === newTarget || // Never equal to target
        solution.includes(distractor) || // Don't duplicate solution tiles
        distractors.includes(distractor) // Don't duplicate distractors
      );
      distractors.push(distractor);
    }
    
    // Combine and shuffle all tiles
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
    setTimeLeft(mode === 'classic' ? 10 : 5); // 10 seconds for classic, 5 for others
  }, [streak, mode]);

  // Initialize game
  useEffect(() => {
    generatePuzzle();
  }, [generatePuzzle]);

  // Per-question timer
  useEffect(() => {
    if (isGameActive && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTimeOut();
            return mode === 'classic' ? 10 : 5; // Will be reset by generatePuzzle
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isGameActive, timeLeft, mode]);

  // Total game timer for classic mode
  useEffect(() => {
    if (mode === 'classic' && isGameActive && totalTimeLeft > 0) {
      const timer = setInterval(() => {
        setTotalTimeLeft(prev => {
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
  }, [mode, isGameActive, totalTimeLeft, onGameOver]);

  const handleTimeOut = () => {
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
    
    // Visual feedback for timeout
    setWrongEffect(true);
    setTimeout(() => setWrongEffect(false), 1000);
    
    // Generate new puzzle
    setTimeout(() => {
      generatePuzzle();
    }, 500);
  };

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
    const timeBonus = timeLeft * 5; // Bonus for speed
    const difficultyBonus = Math.floor(streak / 3) * 10; // Bonus for higher difficulty
    const totalPoints = basePoints + streakBonus + timeBonus + difficultyBonus;
    
    const newScore = score + totalPoints;
    const newStreak = streak + 1;
    const newCorrectAnswers = correctAnswers + 1;
    const newQuestionsAnswered = questionsAnswered + 1;
    
    setScore(newScore);
    setStreak(newStreak);
    setCorrectAnswers(newCorrectAnswers);
    setQuestionsAnswered(newQuestionsAnswered);
    onScoreUpdate(newScore);
    onStreakUpdate(newStreak);
    onCorrectAnswersUpdate(newCorrectAnswers);
    onQuestionsAnsweredUpdate(newQuestionsAnswered);
    
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
    const newQuestionsAnswered = questionsAnswered + 1;
    setQuestionsAnswered(newQuestionsAnswered);
    onQuestionsAnsweredUpdate(newQuestionsAnswered);
    
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
    
    // Generate new puzzle after wrong answer
    setTimeout(() => {
      generatePuzzle();
    }, 1000);
  };

  const getTargetColor = () => {
    if (correctEffect) return 'text-green-400 animate-pulse';
    if (wrongEffect) return 'text-red-400 animate-pulse';
    if (selectedSum === target) return 'text-green-400';
    if (selectedSum > target) return 'text-red-400';
    return 'text-black';
  };

  const getTimerColor = () => {
    if (timeLeft <= 2) return 'bg-red-500 animate-pulse';
    if (timeLeft <= 3) return 'bg-orange-500';
    return 'bg-green-500';
  };

  return (
    <div className="space-y-6">
      {/* Total game timer for classic mode */}
      {mode === 'classic' && (
        <GameTimer timeLeft={totalTimeLeft} />
      )}
      
      {/* Per-target timer */}
      <Card className="glass-morphism border-2 border-white/30">
        <CardContent className="p-4 text-center">
          <Badge className={`text-2xl px-6 py-3 ${getTimerColor()}`}>
            ⏰ {timeLeft}s
          </Badge>
        </CardContent>
      </Card>
      
      <TargetDisplay 
        target={target}
        selectedSum={selectedSum}
        className={getTargetColor()}
        effect={correctEffect ? 'correct' : wrongEffect ? 'wrong' : 'none'}
      />
      
      <Card className="glass-morphism border-2 border-white/30">
        <CardContent className="p-6">
          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 gap-2">
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
            <p className="text-lg text-black/80">Current Sum:</p>
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
      
      {/* Difficulty indicator */}
      <Card className="glass-morphism border-2 border-white/30">
        <CardContent className="p-3 text-center">
          <p className="text-sm text-black/80">
            Difficulty Level: {Math.floor(streak / 3) + 1} | 
            Streak: {streak} | 
            Tiles: {tiles.length}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default GameBoard;
