import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import SpaceBackground from './SpaceBackground';
import Portal from './Portal';
import { Equation, Difficulty } from '@/pages/MathWarp';

interface GameAreaProps {
  onScoreUpdate: (score: number) => void;
  onStreakUpdate: (streak: number) => void;
  onTimeUpdate: (time: number) => void;
  onLivesUpdate: (lives: number) => void;
  onGameEnd: () => void;
  onCorrectAnswersUpdate: (correct: number) => void;
  onQuestionsAnsweredUpdate: (total: number) => void;
  difficulty: Difficulty;
}

// Motivational quotes for the game
const motivationalQuotes = [
  "Math is the language of the universe!",
  "Every expert was once a beginner!",
  "Practice makes perfect!",
  "You're getting stronger with each problem!",
  "Numbers are your friends!",
  "Keep going, you're doing great!",
  "Mathematical thinking builds character!",
  "Believe in your abilities!",
  "One equation at a time!",
  "Success is the sum of small efforts!",
  "Math is all around us!",
  "Your brain is getting more powerful!",
  "Stay focused and keep calculating!",
  "Every mistake is a learning opportunity!",
  "You're on the path to mathematical mastery!"
];

const GameArea: React.FC<GameAreaProps> = ({
  onScoreUpdate,
  onStreakUpdate,
  onTimeUpdate,
  onLivesUpdate,
  onGameEnd,
  onCorrectAnswersUpdate,
  onQuestionsAnsweredUpdate,
  difficulty
}) => {
  const [currentEquation, setCurrentEquation] = useState<Equation | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [lives, setLives] = useState(3);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isWarpStreakActive, setIsWarpStreakActive] = useState(false);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [portalState, setPortalState] = useState<'closed' | 'opening' | 'open' | 'closing'>('closed');
  const [currentQuote, setCurrentQuote] = useState('');

  // Calculate progressive difficulty based on questions answered
  const getProgressiveDifficulty = useCallback(() => {
    const baseMultiplier = difficulty === 'easy' ? 1 : difficulty === 'medium' ? 1.5 : 2;
    const progressMultiplier = Math.floor(questionsAnswered / 5) * 0.5; // Increase every 5 questions
    return baseMultiplier + progressMultiplier;
  }, [difficulty, questionsAnswered]);

  // Generate random equation with progressive difficulty
  const generateEquation = useCallback((): Equation => {
    const id = Math.random().toString(36).substr(2, 9);
    const isMultiplication = Math.random() > 0.5;
    const difficultyMultiplier = getProgressiveDifficulty();
    
    let num1: number, num2: number, answer: number, question: string;
    
    if (isMultiplication) {
      if (difficulty === 'easy') {
        num1 = Math.floor(Math.random() * (6 + Math.floor(difficultyMultiplier * 3))) + 1;
        num2 = Math.floor(Math.random() * (6 + Math.floor(difficultyMultiplier * 3))) + 1;
      } else if (difficulty === 'medium') {
        num1 = Math.floor(Math.random() * (8 + Math.floor(difficultyMultiplier * 4))) + 1;
        num2 = Math.floor(Math.random() * (8 + Math.floor(difficultyMultiplier * 4))) + 1;
      } else {
        num1 = Math.floor(Math.random() * (10 + Math.floor(difficultyMultiplier * 5))) + 1;
        num2 = Math.floor(Math.random() * (10 + Math.floor(difficultyMultiplier * 5))) + 1;
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
        num2 = Math.floor(Math.random() * (6 + Math.floor(difficultyMultiplier * 2))) + 1;
        answer = Math.floor(Math.random() * (6 + Math.floor(difficultyMultiplier * 2))) + 1;
      } else if (difficulty === 'medium') {
        num2 = Math.floor(Math.random() * (8 + Math.floor(difficultyMultiplier * 3))) + 1;
        answer = Math.floor(Math.random() * (8 + Math.floor(difficultyMultiplier * 3))) + 1;
      } else {
        num2 = Math.floor(Math.random() * (10 + Math.floor(difficultyMultiplier * 4))) + 1;
        answer = Math.floor(Math.random() * (10 + Math.floor(difficultyMultiplier * 4))) + 1;
      }
      
      num1 = num2 * answer;
      
      if (Math.random() > 0.5) {
        question = `${num1} ÷ ? = ${answer}`;
        answer = num2;
      } else {
        question = `${num1} ÷ ${num2} = ?`;
      }
    }

    // Generate options with progressive difficulty range
    const options = [answer];
    const optionRange = Math.max(10, Math.floor(difficultyMultiplier * 8));
    
    while (options.length < 4) {
      const wrongAnswer = answer + Math.floor(Math.random() * optionRange) - Math.floor(optionRange / 2);
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
  }, [difficulty, getProgressiveDifficulty]);

  // Generate random quote
  const generateRandomQuote = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
    setCurrentQuote(motivationalQuotes[randomIndex]);
  }, []);

  // Initialize first equation and open portal
  useEffect(() => {
    setCurrentEquation(generateEquation());
    generateRandomQuote();
    setPortalState('opening');
    setTimeout(() => setPortalState('open'), 800);
  }, [generateEquation, generateRandomQuote]);

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
    if (!currentEquation || portalState !== 'open') return;

    const correct = selectedAnswer === currentEquation.answer;
    setIsCorrect(correct);

    if (correct) {
      const progressBonus = Math.floor(questionsAnswered / 10) * 5; // Bonus points for progress
      const newScore = score + (10 * (streak + 1)) + progressBonus;
      const newStreak = streak + 1;
      const newQuestionsAnswered = questionsAnswered + 1;
      const newCorrectAnswers = correctAnswers + 1;
      
      setScore(newScore);
      setStreak(newStreak);
      setQuestionsAnswered(newQuestionsAnswered);
      setCorrectAnswers(newCorrectAnswers);
      onScoreUpdate(newScore);
      onStreakUpdate(newStreak);
      onCorrectAnswersUpdate(newCorrectAnswers);
      onQuestionsAnsweredUpdate(newQuestionsAnswered);

      // Activate warp streak at 5+ correct answers
      if (newStreak >= 5) {
        setIsWarpStreakActive(true);
      }

      // Portal closing and opening animation
      setPortalState('closing');
      setTimeout(() => {
        setCurrentEquation(generateEquation());
        generateRandomQuote(); // Generate new quote for each question
        setIsCorrect(null);
        setPortalState('opening');
        setTimeout(() => setPortalState('open'), 800);
      }, 1000);
    } else {
      const newLives = lives - 1;
      const newQuestionsAnswered = questionsAnswered + 1;
      
      setLives(newLives);
      setStreak(0);
      setIsWarpStreakActive(false);
      setQuestionsAnswered(newQuestionsAnswered);
      onLivesUpdate(newLives);
      onStreakUpdate(0);
      onQuestionsAnsweredUpdate(newQuestionsAnswered);

      if (newLives === 0) {
        onGameEnd();
      } else {
        // Portal error state, then reset
        setTimeout(() => {
          setIsCorrect(null);
          setPortalState('opening');
          setTimeout(() => setPortalState('open'), 500);
        }, 1500);
      }
    }
  };

  return (
    <div className="relative w-full h-full overflow-hidden">
      <SpaceBackground isWarpActive={isWarpStreakActive} />
      
      <div className="relative z-10 flex flex-col items-center justify-center h-full p-4">
        {/* Motivational Quote */}
        <div className="mb-8 text-center">
          <div className={cn(
            "text-lg md:text-xl font-medium px-6 py-3 rounded-full border-2 transition-all duration-500 max-w-md mx-auto",
            isWarpStreakActive && "text-yellow-200 border-yellow-400 bg-yellow-900/30 animate-pulse",
            !isWarpStreakActive && "text-cyan-200 border-cyan-400 bg-cyan-900/30"
          )}>
            {currentQuote}
          </div>
        </div>

        {currentEquation && (
          <Portal
            equation={currentEquation}
            onAnswerSelect={handleAnswer}
            isCorrect={isCorrect}
            isWarpActive={isWarpStreakActive}
            portalState={portalState}
            progressLevel={Math.floor(questionsAnswered / 5)}
          />
        )}
      </div>
    </div>
  );
};

export default GameArea;
