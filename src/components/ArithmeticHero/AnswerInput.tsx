
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MathProblem } from '@/types/arithmeticHero';
import { gameService } from '@/services/arithmeticHero/gameService';

interface AnswerInputProps {
  problems: MathProblem[];
  onCorrectAnswer: (id: string) => void;
  onWrongAnswer: () => void;
}

const AnswerInput: React.FC<AnswerInputProps> = ({ 
  problems, 
  onCorrectAnswer,
  onWrongAnswer
}) => {
  const [inputValue, setInputValue] = useState('');
  const [showMultiChoice, setShowMultiChoice] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState<MathProblem | null>(null);
  const [options, setOptions] = useState<number[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Handle screen size for appropriate input method
  useEffect(() => {
    const handleResize = () => {
      setShowMultiChoice(window.innerWidth < 768);
    };
    
    // Initial check
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Select lowest problem (closest to ground) for focus
  useEffect(() => {
    if (problems.length > 0) {
      // Sort by y position (higher y is closer to ground)
      const sorted = [...problems].sort((a, b) => b.position.y - a.position.y);
      const lowest = sorted[0];
      
      setSelectedProblem(lowest);
      
      // Generate multiple choice options for selected problem
      if (lowest && showMultiChoice) {
        const newOptions = gameService.generateOptions(lowest.correctAnswer, 4);
        setOptions(newOptions);
      }
    } else {
      setSelectedProblem(null);
    }
  }, [problems, showMultiChoice]);
  
  // Focus input field when available
  useEffect(() => {
    if (!showMultiChoice && inputRef.current) {
      inputRef.current.focus();
    }
  }, [selectedProblem, showMultiChoice]);
  
  // Handle typed answer submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProblem || inputValue.trim() === '') return;
    
    const userAnswer = parseInt(inputValue);
    if (isNaN(userAnswer)) return;
    
    if (userAnswer === selectedProblem.correctAnswer) {
      onCorrectAnswer(selectedProblem.id);
      setInputValue('');
    } else {
      onWrongAnswer();
      setInputValue('');
    }
  };
  
  // Handle multiple choice selection
  const handleOptionSelect = (option: number) => {
    if (!selectedProblem) return;
    
    if (option === selectedProblem.correctAnswer) {
      onCorrectAnswer(selectedProblem.id);
    } else {
      onWrongAnswer();
    }
  };

  // Get operation symbol for display
  const getOperationSymbol = (operation: string) => {
    switch (operation) {
      case "+": return "+";
      case "-": return "-";
      case "×": return "×";
      case "÷": return "÷";
      default: return operation;
    }
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
      {selectedProblem ? (
        <div className="flex flex-col items-center">
          <div className="mb-3 text-center">
            <span className="text-white text-sm md:text-base opacity-80">Solve:</span>
            <div className="text-xl md:text-2xl font-bold text-white">
              {selectedProblem.firstNumber} {getOperationSymbol(selectedProblem.operation)} {selectedProblem.secondNumber} = ?
            </div>
          </div>
          
          {showMultiChoice ? (
            // Multiple choice input (mobile)
            <div className="grid grid-cols-2 gap-2 w-full max-w-sm">
              {options.map((option, index) => (
                <Button
                  key={index}
                  variant="outline" 
                  className="bg-white/20 hover:bg-white/40 text-lg font-bold h-14"
                  onClick={() => handleOptionSelect(option)}
                >
                  {option}
                </Button>
              ))}
            </div>
          ) : (
            // Text input field (desktop)
            <form onSubmit={handleSubmit} className="flex gap-2 w-full max-w-sm">
              <Input
                ref={inputRef}
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type answer here..."
                className="bg-white/20 text-white placeholder:text-white/50 border-white/30 focus-visible:ring-blue-500 focus-visible:ring-offset-0 text-lg h-12"
                autoComplete="off"
              />
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 h-12">
                Zap!
              </Button>
            </form>
          )}
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-white opacity-70"
        >
          Waiting for equations...
        </motion.div>
      )}
    </div>
  );
};

export default AnswerInput;
