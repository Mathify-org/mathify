
import React, { useState, useEffect, useRef } from 'react';
import { MathProblem, AnswerMethod } from '@/types/arithmeticHero';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface AnswerInputProps {
  problems: MathProblem[];
  onCorrectAnswer: (problemId: string) => void;
  onWrongAnswer?: () => void; // Make this optional for compatibility
  answerMethod?: AnswerMethod; // Add this for compatibility with HeroChallenge
}

const AnswerInput: React.FC<AnswerInputProps> = ({ 
  problems,
  onCorrectAnswer,
  onWrongAnswer,
  answerMethod = "type" // Default to type input
}) => {
  const [answer, setAnswer] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Don't process empty answers
    if (!answer.trim()) return;
    
    // Get numerical answer
    const numericAnswer = parseInt(answer, 10);
    
    // Check if answer matches any of the active problems
    let correctProblem: MathProblem | undefined;
    
    for (const problem of problems) {
      if (problem.correctAnswer === numericAnswer) {
        correctProblem = problem;
        break;
      }
    }
    
    if (correctProblem) {
      // Correct answer!
      onCorrectAnswer(correctProblem.id);
      setAnswer('');
    } else {
      // Wrong answer
      if (onWrongAnswer) {
        onWrongAnswer();
      }
      // Visual feedback for wrong answer
      if (inputRef.current) {
        inputRef.current.classList.add('bg-red-200');
        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.classList.remove('bg-red-200');
          }
        }, 300);
      }
      setAnswer('');
    }
  };

  const handleMultipleChoiceAnswer = (problemId: string, selectedAnswer: number) => {
    const problem = problems.find(p => p.id === problemId);
    if (problem && problem.correctAnswer === selectedAnswer) {
      onCorrectAnswer(problemId);
    } else if (onWrongAnswer) {
      onWrongAnswer();
    }
  };

  // Render multiple choice buttons if that method is selected
  if (answerMethod === "multichoice") {
    return (
      <div className="w-full bg-black/40 backdrop-blur-sm p-4 rounded-t-lg">
        <div className="grid grid-cols-2 gap-2">
          {problems.slice(0, 2).map(problem => (
            <div key={problem.id} className="flex flex-col gap-2">
              <div className="text-white text-center font-bold">
                {problem.firstNumber} {problem.operation} {problem.secondNumber} = ?
              </div>
              <div className="grid grid-cols-2 gap-2">
                {problem.options?.map((option, idx) => (
                  <Button
                    key={idx}
                    onClick={() => handleMultipleChoiceAnswer(problem.id, option)}
                    variant="default"
                    size="sm"
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Default typing answer input
  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="bg-black/40 backdrop-blur-sm p-4 rounded-t-lg">
        <Input
          ref={inputRef}
          type="number"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Type your answer..."
          className="text-lg p-6 bg-white/90 text-center font-bold"
          autoComplete="off"
        />
      </div>
    </form>
  );
};

export default AnswerInput;
