
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface CalculateChallengeProps {
  challengeId: string;
  onSuccess: () => void;
}

interface Problem {
  question: string;
  answer: number;
  unit: string;
  radius?: number;
  diameter?: number;
}

const CalculateChallenge: React.FC<CalculateChallengeProps> = ({ challengeId, onSuccess }) => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [attempts, setAttempts] = useState(0);
  
  useEffect(() => {
    const data = getChallenge(challengeId);
    setProblems(data);
    setAnswers({});
    setIsCorrect(null);
  }, [challengeId]);
  
  const handleAnswerChange = (index: number, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [index]: value
    }));
  };
  
  const handleCheck = () => {
    setAttempts(prev => prev + 1);
    
    const allAnswered = problems.every((_, index) => answers[index] && answers[index].trim() !== '');
    
    if (!allAnswered) {
      toast.error("Please answer all questions before checking");
      return;
    }
    
    let correct = true;
    problems.forEach((problem, index) => {
      const userAnswer = parseFloat(answers[index]);
      if (Math.abs(userAnswer - problem.answer) > 0.1) {
        correct = false;
      }
    });
    
    setIsCorrect(correct);
    
    if (correct) {
      setTimeout(() => {
        onSuccess();
      }, 1500);
    }
  };
  
  const handleReset = () => {
    setAnswers({});
    setIsCorrect(null);
  };
  
  return (
    <div className="p-4">
      <div className="mb-8 text-center">
        <h3 className="text-lg font-bold mb-2">{getChallengeTitle(challengeId)}</h3>
        <p className="text-slate-600">{getChallengeInstructions(challengeId)}</p>
      </div>
      
      {/* Problems */}
      <div className="space-y-6 mb-8">
        {problems.map((problem, index) => (
          <div key={index} className="bg-slate-50 p-6 rounded-xl">
            <div className="flex items-center justify-center mb-4">
              {problem.radius && (
                <svg width="200" height="200" viewBox="0 0 200 200">
                  <circle
                    cx="100"
                    cy="100"
                    r={problem.radius * 10}
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="2"
                  />
                  <line
                    x1="100"
                    y1="100"
                    x2={100 + problem.radius * 10}
                    y2="100"
                    stroke="#ef4444"
                    strokeWidth="2"
                  />
                  <text x="110" y="95" fontSize="12" fill="#374151">
                    {problem.radius} cm
                  </text>
                  <circle cx="100" cy="100" r="2" fill="#6366f1" />
                </svg>
              )}
            </div>
            
            <p className="text-lg mb-4 text-center">{problem.question}</p>
            
            <div className="flex items-center justify-center gap-2">
              <Input
                type="number"
                step="0.1"
                placeholder="Enter answer"
                value={answers[index] || ''}
                onChange={(e) => handleAnswerChange(index, e.target.value)}
                className="w-32 text-center"
              />
              <span className="text-slate-600">{problem.unit}</span>
            </div>
          </div>
        ))}
      </div>
      
      {/* Feedback area */}
      {isCorrect !== null && (
        <div className={cn(
          "p-3 rounded-lg mb-4 flex items-center",
          isCorrect ? "bg-green-100" : "bg-red-100"
        )}>
          {isCorrect ? (
            <CheckCircle2 className="text-green-600 mr-2" size={20} />
          ) : (
            <AlertCircle className="text-red-600 mr-2" size={20} />
          )}
          <p className={isCorrect ? "text-green-800" : "text-red-800"}>
            {isCorrect 
              ? "Excellent! All your calculations are correct." 
              : "Not quite right. Check your calculations and try again!"}
          </p>
        </div>
      )}
      
      {/* Actions */}
      <div className="flex justify-center gap-3">
        <Button 
          variant="outline"
          onClick={handleReset}
          className="border-slate-300"
        >
          Reset
        </Button>
        <Button 
          onClick={handleCheck}
          disabled={isCorrect === true}
          className={cn(
            "text-white",
            isCorrect === true
              ? "bg-green-500 hover:bg-green-600"
              : "bg-purple-600 hover:bg-purple-700"
          )}
        >
          {isCorrect === true ? "Correct!" : "Check Answer"}
        </Button>
      </div>
    </div>
  );
};

const getChallengeTitle = (challengeId: string): string => {
  const titles: Record<string, string> = {
    "circ-2": "Circle Calculations",
  };
  return titles[challengeId] || "Calculate";
};

const getChallengeInstructions = (challengeId: string): string => {
  const instructions: Record<string, string> = {
    "circ-2": "Use the formula π × radius² to calculate the area, and 2 × π × radius for circumference. Use π = 3.14",
  };
  return instructions[challengeId] || "Solve the problems.";
};

const getChallenge = (challengeId: string): Problem[] => {
  switch(challengeId) {
    case "circ-2":
      return [
        {
          question: "What is the area of this circle?",
          radius: 5,
          answer: 78.5,
          unit: "cm²"
        },
        {
          question: "What is the circumference of this circle?", 
          radius: 3,
          answer: 18.84,
          unit: "cm"
        }
      ];
    default:
      return [
        {
          question: "Sample question",
          answer: 10,
          unit: "units"
        }
      ];
  }
};

export default CalculateChallenge;
