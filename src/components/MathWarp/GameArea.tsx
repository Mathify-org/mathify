
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
  const [portalState, setPortalState] = useState<'closed' | 'opening' | 'open' | 'closing'>('closed');
  const [currentQuote, setCurrentQuote] = useState('');
  const [questionTimeLeft, setQuestionTimeLeft] = useState(3.5);
  const [questionTimer, setQuestionTimer] = useState<NodeJS.Timeout | null>(null);

  // Calculate progressive difficulty based on questions answered
  const getProgressiveDifficulty = useCallback(() => {
    const baseMultiplier = difficulty === 'easy' ? 1 : difficulty === 'medium' ? 1.5 : 2;
    const progressMultiplier = Math.floor(questionsAnswered / 5) * 0.5;
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

    const options = [answer];
    const optionRange = Math.max(10, Math.floor(difficultyMultiplier * 8));
    
    while (options.length < 4) {
      const wrongAnswer = answer + Math.floor(Math.random() * optionRange) - Math.floor(optionRange / 2);
      if (wrongAnswer > 0 && !options.includes(wrongAnswer)) {
        options.push(wrongAnswer);
      }
    }
    
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

  // Start question timer
  const startQuestionTimer = useCallback(() => {
    if (questionTimer) {
      clearInterval(questionTimer);
    }
    
    setQuestionTimeLeft(3.5);
    const timer = setInterval(() => {
      setQuestionTimeLeft(prev => {
        if (prev <= 0.1) {
          clearInterval(timer);
          // Auto-fail if time runs out
          handleTimeOut();
          return 0;
        }
        return prev - 0.1;
      });
    }, 100);
    
    setQuestionTimer(timer);
  }, [questionTimer]);

  // Handle timeout
  const handleTimeOut = () => {
    if (portalState !== 'open') return;
    
    const newLives = lives - 1;
    const newQuestionsAnswered = questionsAnswered + 1;
    
    setLives(newLives);
    setStreak(0);
    setIsWarpStreakActive(false);
    setQuestionsAnswered(newQuestionsAnswered);
    setIsCorrect(false);
    onLivesUpdate(newLives);
    onStreakUpdate(0);

    if (newLives === 0) {
      onGameEnd();
    } else {
      setTimeout(() => {
        setIsCorrect(null);
        setCurrentEquation(generateEquation());
        generateRandomQuote();
        setPortalState('opening');
        setTimeout(() => {
          setPortalState('open');
          startQuestionTimer();
        }, 800);
      }, 1500);
    }
  };

  // Initialize first equation and open portal
  useEffect(() => {
    setCurrentEquation(generateEquation());
    generateRandomQuote();
    setPortalState('opening');
    setTimeout(() => {
      setPortalState('open');
      startQuestionTimer();
    }, 800);
  }, [generateEquation, generateRandomQuote, startQuestionTimer]);

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

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (questionTimer) {
        clearInterval(questionTimer);
      }
    };
  }, [questionTimer]);

  // Handle answer selection
  const handleAnswer = (selectedAnswer: number) => {
    if (!currentEquation || portalState !== 'open') return;

    // Clear the question timer
    if (questionTimer) {
      clearInterval(questionTimer);
      setQuestionTimer(null);
    }

    const correct = selectedAnswer === currentEquation.answer;
    setIsCorrect(correct);

    if (correct) {
      const progressBonus = Math.floor(questionsAnswered / 10) * 5;
      const newScore = score + (10 * (streak + 1)) + progressBonus;
      const newStreak = streak + 1;
      const newQuestionsAnswered = questionsAnswered + 1;
      
      setScore(newScore);
      setStreak(newStreak);
      setQuestionsAnswered(newQuestionsAnswered);
      onScoreUpdate(newScore);
      onStreakUpdate(newStreak);

      if (newStreak >= 5) {
        setIsWarpStreakActive(true);
      }

      setPortalState('closing');
      setTimeout(() => {
        setCurrentEquation(generateEquation());
        generateRandomQuote();
        setIsCorrect(null);
        setPortalState('opening');
        setTimeout(() => {
          setPortalState('open');
          startQuestionTimer();
        }, 800);
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

      if (newLives === 0) {
        onGameEnd();
      } else {
        setTimeout(() => {
          setIsCorrect(null);
          setPortalState('opening');
          setTimeout(() => {
            setPortalState('open');
            startQuestionTimer();
          }, 500);
        }, 1500);
      }
    }
  };

  return (
    <div className="relative w-full h-full overflow-hidden" style={{
      background: 'linear-gradient(45deg, #0f0f23 0%, #1a1a3e 25%, #2d1b69 50%, #1a1a3e 75%, #0f0f23 100%)',
      perspective: '1000px'
    }}>
      {/* 3D Space Background with depth layers */}
      <div className="absolute inset-0" style={{ transformStyle: 'preserve-3d' }}>
        {/* Far background layer */}
        <div 
          className="absolute inset-0 opacity-30" 
          style={{ 
            transform: 'translateZ(-500px) scale(1.5)',
            background: 'radial-gradient(circle at 30% 70%, rgba(147, 51, 234, 0.3) 0%, transparent 50%), radial-gradient(circle at 70% 30%, rgba(59, 130, 246, 0.3) 0%, transparent 50%)'
          }}
        />
        
        {/* Middle layer */}
        <div 
          className="absolute inset-0 opacity-50" 
          style={{ 
            transform: 'translateZ(-200px) scale(1.2)',
            background: 'radial-gradient(circle at 20% 40%, rgba(168, 85, 247, 0.2) 0%, transparent 40%), radial-gradient(circle at 80% 60%, rgba(34, 197, 94, 0.2) 0%, transparent 40%)'
          }}
        />
        
        {/* Near layer */}
        <div 
          className="absolute inset-0 opacity-70" 
          style={{ 
            transform: 'translateZ(-50px) scale(1.1)',
            background: 'radial-gradient(circle at 60% 20%, rgba(236, 72, 153, 0.15) 0%, transparent 30%)'
          }}
        />
      </div>
      
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
            questionTimeLeft={questionTimeLeft}
          />
        )}
      </div>
    </div>
  );
};

export default GameArea;
