
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface MeasureChallengeProps {
  challengeId: string;
  onSuccess: () => void;
}

interface AngleQuestion {
  id: string;
  svg: React.ReactNode;
  correctAngle: number;
  tolerance: number;
}

const MeasureChallenge: React.FC<MeasureChallengeProps> = ({ challengeId, onSuccess }) => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<Record<string, boolean>>({});
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  
  const questions = getQuestions(challengeId);
  
  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers({
      ...answers,
      [questionId]: value
    });
  };
  
  const handleCheck = () => {
    // Check if all questions are answered
    if (Object.keys(answers).length < questions.length) {
      toast.error("Please answer all questions");
      return;
    }
    
    // Check answers
    const newFeedback: Record<string, boolean> = {};
    let allCorrect = true;
    
    questions.forEach(question => {
      const answer = parseInt(answers[question.id], 10);
      if (isNaN(answer)) {
        newFeedback[question.id] = false;
        allCorrect = false;
        return;
      }
      
      const isAnswerCorrect = Math.abs(answer - question.correctAngle) <= question.tolerance;
      newFeedback[question.id] = isAnswerCorrect;
      
      if (!isAnswerCorrect) {
        allCorrect = false;
      }
    });
    
    setFeedback(newFeedback);
    setIsCorrect(allCorrect);
    
    if (allCorrect) {
      setTimeout(() => {
        onSuccess();
      }, 1500);
    }
  };
  
  const handleReset = () => {
    setAnswers({});
    setFeedback({});
    setIsCorrect(null);
  };
  
  return (
    <div className="p-4">
      <div className="mb-8 text-center">
        <h3 className="text-lg font-bold mb-2">{getChallengeTitle(challengeId)}</h3>
        <p className="text-slate-600">{getChallengeInstructions(challengeId)}</p>
      </div>
      
      {/* Questions */}
      <div className="space-y-8 mb-8">
        {questions.map((question, index) => (
          <div key={question.id} className="bg-white p-4 rounded-xl shadow-sm border">
            <h4 className="font-bold mb-3">Question {index + 1}</h4>
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="flex-1 flex justify-center">
                {question.svg}
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estimate this angle (in degrees):
                </label>
                <div className="flex items-center">
                  <Input
                    type="number"
                    value={answers[question.id] || ""}
                    onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                    className={cn(
                      feedback[question.id] === true && "border-green-500 ring-green-200",
                      feedback[question.id] === false && "border-red-500 ring-red-200"
                    )}
                    placeholder="Enter degrees"
                  />
                  <span className="ml-2">°</span>
                  
                  {feedback[question.id] !== undefined && (
                    <div className="ml-2">
                      {feedback[question.id] ? (
                        <CheckCircle2 className="text-green-600" size={20} />
                      ) : (
                        <AlertCircle className="text-red-600" size={20} />
                      )}
                    </div>
                  )}
                </div>
                
                {feedback[question.id] === false && (
                  <p className="text-sm text-red-600 mt-1">
                    Try again! The angle is between {question.correctAngle - question.tolerance}° 
                    and {question.correctAngle + question.tolerance}°
                  </p>
                )}
              </div>
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
              ? "Great job! All your angle estimates are correct." 
              : "Some of your answers are not within the acceptable range. Try again!"}
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
          {isCorrect === true ? "Correct!" : "Check Answers"}
        </Button>
      </div>
    </div>
  );
};

// Challenge-specific content
const getChallengeTitle = (challengeId: string): string => {
  return "Angle Hunter";
};

const getChallengeInstructions = (challengeId: string): string => {
  return "Estimate each angle in degrees. Your answer needs to be within 5 degrees of the actual value.";
};

// Get questions for the challenge
const getQuestions = (challengeId: string): AngleQuestion[] => {
  return [
    {
      id: "q1",
      svg: (
        <svg width="150" height="150" viewBox="0 0 150 150">
          <path d="M 30 120 L 30 30 L 120 30" stroke="#3b82f6" strokeWidth="4" fill="none" />
          <text x="60" y="65" fontSize="12" fill="#3b82f6">Interior angle</text>
          <circle cx="30" cy="30" r="3" fill="#3b82f6" />
        </svg>
      ),
      correctAngle: 90,
      tolerance: 5
    },
    {
      id: "q2",
      svg: (
        <svg width="150" height="150" viewBox="0 0 150 150">
          <path d="M 30 75 L 120 30 L 120 120" stroke="#10b981" strokeWidth="4" fill="none" />
          <text x="85" y="75" fontSize="12" fill="#10b981">Interior angle</text>
          <circle cx="120" cy="75" r="3" fill="#10b981" />
        </svg>
      ),
      correctAngle: 45,
      tolerance: 5
    },
    {
      id: "q3",
      svg: (
        <svg width="150" height="150" viewBox="0 0 150 150">
          <path d="M 30 30 L 120 75 L 30 120" stroke="#8b5cf6" strokeWidth="4" fill="none" />
          <text x="55" y="85" fontSize="12" fill="#8b5cf6">Interior angle</text>
          <circle cx="30" cy="75" r="3" fill="#8b5cf6" />
        </svg>
      ),
      correctAngle: 135,
      tolerance: 5
    }
  ];
};

export default MeasureChallenge;
