
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Check, X, Zap, Shield } from 'lucide-react';
import { gameService, levels, generateNumberWithDigits } from '@/services/additionHero/gameService';
import { MathProblem } from '@/types/additionHero';
import ZapEffect from './ZapEffect';

interface PracticeModeProps {
  level: number;
  onExit: () => void;
}

const PracticeMode: React.FC<PracticeModeProps> = ({ level, onExit }) => {
  const [currentProblem, setCurrentProblem] = useState<MathProblem | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [streak, setStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [showZap, setShowZap] = useState(false);
  const [digitOptions, setDigitOptions] = useState({
    first: { min: 1, max: 2 },
    second: { min: 1, max: 1 }
  });
  
  // Get level config
  const levelConfig = levels.find(l => l.id === level) || levels[0];
  
  // Load initial problem
  useEffect(() => {
    generateNewProblem();
  }, [level, digitOptions]);
  
  // Generate a new problem
  const generateNewProblem = () => {
    // Use the digit options to create numbers with specific digit counts
    const firstNumber = generateNumberWithDigits(
      digitOptions.first.min, 
      digitOptions.first.max
    );
    
    const secondNumber = generateNumberWithDigits(
      digitOptions.second.min, 
      digitOptions.second.max
    );
    
    setCurrentProblem({
      id: `practice-${Date.now()}`,
      firstNumber,
      secondNumber,
      operation: '+',
      correctAnswer: firstNumber + secondNumber,
      position: { x: 50, y: 50 },
      speed: 0,
      isSolved: false
    });
    
    setUserAnswer('');
    setIsCorrect(null);
  };
  
  // Check the answer
  const checkAnswer = () => {
    if (!currentProblem || userAnswer === '') return;
    
    const answer = parseInt(userAnswer);
    const isAnswerCorrect = answer === currentProblem.correctAnswer;
    
    setIsCorrect(isAnswerCorrect);
    
    if (isAnswerCorrect) {
      setCorrectCount(prev => prev + 1);
      setStreak(prev => prev + 1);
      gameService.updateLongestStreak(streak + 1);
      gameService.updateTotalCorrectAnswers(1);
      
      // Show zap effect
      setShowZap(true);
      setTimeout(() => {
        setShowZap(false);
      }, 1000);
      
      // Generate new problem after a short delay
      setTimeout(() => {
        generateNewProblem();
      }, 1200);
    } else {
      setStreak(0);
    }
  };
  
  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserAnswer(e.target.value);
    setIsCorrect(null);
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    checkAnswer();
  };
  
  // Handle digit options changes
  const increaseDigits = (type: 'first' | 'second') => {
    setDigitOptions(prev => {
      const newOptions = { ...prev };
      if (type === 'first') {
        newOptions.first.max = Math.min(newOptions.first.max + 1, 3);
      } else {
        newOptions.second.max = Math.min(newOptions.second.max + 1, 3);
      }
      return newOptions;
    });
  };
  
  const decreaseDigits = (type: 'first' | 'second') => {
    setDigitOptions(prev => {
      const newOptions = { ...prev };
      if (type === 'first') {
        newOptions.first.max = Math.max(newOptions.first.max - 1, 1);
      } else {
        newOptions.second.max = Math.max(newOptions.second.max - 1, 1);
      }
      return newOptions;
    });
  };

  return (
    <div className="bg-gradient-to-r from-green-800 to-emerald-700 rounded-lg p-6 max-w-2xl mx-auto shadow-xl">
      <div className="mb-6 text-center">
        <h2 className="text-3xl font-bold">Practice Mode</h2>
        <p className="text-green-100">Take your time and master your skills</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
          <h3 className="font-semibold mb-3">Problem Settings</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-1">First Number:</label>
              <div className="flex items-center space-x-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => decreaseDigits('first')}
                  disabled={digitOptions.first.max <= 1}
                  className="bg-white/20"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="bg-white/20 px-3 py-1 rounded text-center flex-grow">
                  {digitOptions.first.max === 1 ? "1 digit" : `${digitOptions.first.max} digits`}
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => increaseDigits('first')}
                  disabled={digitOptions.first.max >= 3}
                  className="bg-white/20"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm mb-1">Second Number:</label>
              <div className="flex items-center space-x-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => decreaseDigits('second')}
                  disabled={digitOptions.second.max <= 1}
                  className="bg-white/20"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="bg-white/20 px-3 py-1 rounded text-center flex-grow">
                  {digitOptions.second.max === 1 ? "1 digit" : `${digitOptions.second.max} digits`}
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => increaseDigits('second')}
                  disabled={digitOptions.second.max >= 3}
                  className="bg-white/20"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="pt-2">
              <Button 
                onClick={generateNewProblem}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                New Problem
              </Button>
            </div>
          </div>
        </div>
        
        <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
          <div className="text-center mb-4">
            <div className="text-sm mb-1">Current Problem:</div>
            {currentProblem && (
              <div className="text-3xl font-bold">
                {currentProblem.firstNumber} + {currentProblem.secondNumber} = ?
              </div>
            )}
          </div>
          
          <form onSubmit={handleSubmit} className="mb-4">
            <div className="relative">
              <input
                type="number"
                value={userAnswer}
                onChange={handleInputChange}
                className="w-full py-2 px-4 text-xl text-center bg-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
                placeholder="Type your answer"
              />
              
              {isCorrect !== null && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  {isCorrect ? (
                    <Check className="h-6 w-6 text-green-400" />
                  ) : (
                    <X className="h-6 w-6 text-red-400" />
                  )}
                </div>
              )}
            </div>
            
            <div className="mt-3">
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={userAnswer === ''}
              >
                <Zap className="mr-2 h-5 w-5" />
                Check Answer
              </Button>
            </div>
          </form>
          
          {isCorrect === false && (
            <div className="text-center bg-red-900/30 p-2 rounded-lg">
              <div className="text-sm opacity-80">Correct answer:</div>
              <div className="font-bold">{currentProblem?.correctAnswer}</div>
            </div>
          )}
          
          {showZap && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <ZapEffect x={50} y={50} streak={streak} />
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-6 bg-black/20 rounded-lg p-4 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <div>
            <div className="text-sm opacity-70">Correct</div>
            <div className="text-xl font-bold">{correctCount}</div>
          </div>
          
          <div>
            <div className="text-sm opacity-70">Streak</div>
            <div className="flex items-center">
              <span className="text-xl font-bold">{streak}</span>
              {streak >= 5 && <Zap className="ml-1 h-4 w-4 text-yellow-400" />}
            </div>
          </div>
        </div>
        
        <Button
          variant="outline"
          onClick={onExit}
          className="bg-white/20"
        >
          Exit Practice
        </Button>
      </div>
    </div>
  );
};

export default PracticeMode;
