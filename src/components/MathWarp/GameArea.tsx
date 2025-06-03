
import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import SpaceBackground from './SpaceBackground';
import Portal from './Portal';
import Spaceship from './Spaceship';
import { Equation, Difficulty } from '@/pages/MathWarp';

interface GameAreaProps {
  onScoreUpdate: (score: number) => void;
  onStreakUpdate: (streak: number) => void;
  onTimeUpdate: (time: number) => void;
  onLivesUpdate: (lives: number) => void;
  onGameEnd: () => void;
  difficulty: Difficulty;
}

const GameArea: React.FC<GameAreaProps> = ({
  onScoreUpdate,
  onStreakUpdate,
  onTimeUpdate,
  onLivesUpdate,
  onGameEnd,
  difficulty
}) => {
  const [currentEquation, setCurrentEquation] = useState<Equation | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [lives, setLives] = useState(3);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isWarpStreakActive, setIsWarpStreakActive] = useState(false);

  // Generate random equation based on difficulty
  const generateEquation = useCallback((): Equation => {
    const id = Math.random().toString(36).substr(2, 9);
    const isMultiplication = Math.random() > 0.5;
    
    let num1: number, num2: number, answer: number, question: string;
    
    if (isMultiplication) {
      if (difficulty === 'easy') {
        num1 = Math.floor(Math.random() * 9) + 1;
        num2 = Math.floor(Math.random() * 9) + 1;
      } else if (difficulty === 'medium') {
        num1 = Math.floor(Math.random() * 12) + 1;
        num2 = Math.floor(Math.random() * 12) + 1;
      } else {
        num1 = Math.floor(Math.random() * 15) + 1;
        num2 = Math.floor(Math.random() * 15) + 1;
      }
      
      answer = num1 * num2;
      
      if (Math.random() > 0.5) {
        question = `${num1} × ? = ${answer}`;
        answer = num2;
      } else {
        question = `? × ${num2} = ${answer}`;
        answer = num1;
      }
    } else {
      // Division
      if (difficulty === 'easy') {
        num2 = Math.floor(Math.random() * 9) + 1;
        answer = Math.floor(Math.random() * 9) + 1;
      } else if (difficulty === 'medium') {
        num2 = Math.floor(Math.random() * 12) + 1;
        answer = Math.floor(Math.random() * 12) + 1;
      } else {
        num2 = Math.floor(Math.random() * 15) + 1;
        answer = Math.floor(Math.random() * 15) + 1;
      }
      
      num1 = num2 * answer;
      
      if (Math.random() > 0.5) {
        question = `${num1} ÷ ? = ${answer}`;
        answer = num2;
      } else {
        question = `${num1} ÷ ${num2} = ?`;
      }
    }

    // Generate options
    const options = [answer];
    while (options.length < 4) {
      const wrongAnswer = answer + Math.floor(Math.random() * 20) - 10;
      if (wrongAnswer > 0 && !options.includes(wrongAnswer)) {
        options.push(wrongAnswer);
      }
    }
    
    // Shuffle options
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }

    return {
      id,
      question,
      answer,
      options,
      type: isMultiplication ? 'multiplication' : 'division'
    };
  }, [difficulty]);

  // Initialize first equation
  useEffect(() => {
    setCurrentEquation(generateEquation());
  }, [generateEquation]);

  // Game timer
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => {
        const newTime = timeLeft - 1;
        setTimeLeft(newTime);
        onTimeUpdate(newTime);
        
        if (newTime === 0) {
          onGameEnd();
        }
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [timeLeft, onTimeUpdate, onGameEnd]);

  // Handle answer selection
  const handleAnswer = (selectedAnswer: number) => {
    if (!currentEquation) return;

    const correct = selectedAnswer === currentEquation.answer;
    setIsCorrect(correct);

    if (correct) {
      const newScore = score + (10 * (streak + 1));
      const newStreak = streak + 1;
      
      setScore(newScore);
      setStreak(newStreak);
      onScoreUpdate(newScore);
      onStreakUpdate(newStreak);

      // Activate warp streak at 5+ correct answers
      if (newStreak >= 5) {
        setIsWarpStreakActive(true);
      }

      // Generate next equation after a short delay
      setTimeout(() => {
        setCurrentEquation(generateEquation());
        setIsCorrect(null);
      }, 1000);
    } else {
      const newLives = lives - 1;
      setLives(newLives);
      setStreak(0);
      setIsWarpStreakActive(false);
      onLivesUpdate(newLives);
      onStreakUpdate(0);

      if (newLives === 0) {
        onGameEnd();
      } else {
        // Reset after error animation
        setTimeout(() => {
          setIsCorrect(null);
        }, 1000);
      }
    }
  };

  return (
    <div className="relative w-full h-full overflow-hidden">
      <SpaceBackground isWarpActive={isWarpStreakActive} />
      
      <div className="relative z-10 flex flex-col items-center justify-center h-full p-4">
        {currentEquation && (
          <Portal
            equation={currentEquation}
            onAnswerSelect={handleAnswer}
            isCorrect={isCorrect}
            isWarpActive={isWarpStreakActive}
          />
        )}
        
        <Spaceship isCorrect={isCorrect} isWarpActive={isWarpStreakActive} />
      </div>
    </div>
  );
};

export default GameArea;
