
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertCircle, RotateCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface RotateChallengeProps {
  challengeId: string;
  onSuccess: () => void;
}

interface Shape {
  id: string;
  name: string;
  svg: string;
  rotationalOrder: number;
  hasRotationalSymmetry: boolean;
}

const RotateChallenge: React.FC<RotateChallengeProps> = ({ challengeId, onSuccess }) => {
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [rotations, setRotations] = useState<Record<string, number>>({});
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [attempts, setAttempts] = useState(0);
  
  useEffect(() => {
    const data = getChallenge(challengeId);
    setShapes(data);
    setRotations({});
    setSelectedAnswers({});
    setIsCorrect(null);
  }, [challengeId]);
  
  const handleRotate = (shapeId: string) => {
    setRotations(prev => ({
      ...prev,
      [shapeId]: ((prev[shapeId] || 0) + 90) % 360
    }));
  };
  
  const handleAnswerSelect = (shapeId: string, order: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [shapeId]: order
    }));
  };
  
  const handleCheck = () => {
    setAttempts(prev => prev + 1);
    
    const allAnswered = shapes.every(shape => selectedAnswers[shape.id] !== undefined);
    
    if (!allAnswered) {
      toast.error("Please select the rotational order for all shapes");
      return;
    }
    
    let correct = true;
    shapes.forEach(shape => {
      if (selectedAnswers[shape.id] !== shape.rotationalOrder) {
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
    setRotations({});
    setSelectedAnswers({});
    setIsCorrect(null);
  };
  
  return (
    <div className="p-4">
      <div className="mb-8 text-center">
        <h3 className="text-lg font-bold mb-2">{getChallengeTitle(challengeId)}</h3>
        <p className="text-slate-600">{getChallengeInstructions(challengeId)}</p>
      </div>
      
      {/* Shapes grid */}
      <div className="space-y-8 mb-8">
        {shapes.map(shape => (
          <div key={shape.id} className="bg-slate-50 p-6 rounded-xl">
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Shape display */}
              <div className="flex flex-col items-center">
                <div 
                  className="w-24 h-24 transition-transform duration-300"
                  style={{ transform: `rotate(${rotations[shape.id] || 0}deg)` }}
                  dangerouslySetInnerHTML={{ __html: shape.svg }}
                />
                <p className="font-medium text-sm mt-2">{shape.name}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRotate(shape.id)}
                  className="mt-2"
                >
                  <RotateCw className="w-4 h-4 mr-1" />
                  Rotate
                </Button>
              </div>
              
              {/* Answer options */}
              <div className="flex-1">
                <p className="font-medium mb-3">How many times does it look the same during one full rotation?</p>
                <div className="flex gap-2 flex-wrap">
                  {[1, 2, 3, 4, 5, 6].map(order => (
                    <Button
                      key={order}
                      variant={selectedAnswers[shape.id] === order ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleAnswerSelect(shape.id, order)}
                      className={cn(
                        selectedAnswers[shape.id] === order && "bg-blue-600 text-white"
                      )}
                    >
                      {order}
                    </Button>
                  ))}
                </div>
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
              ? "Excellent! You've correctly identified the rotational symmetry of all shapes." 
              : "Not quite right. Try rotating each shape and count how many times it looks identical during one full turn."}
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
    "sym-2": "Rotational Symmetry",
  };
  return titles[challengeId] || "Rotate and Identify";
};

const getChallengeInstructions = (challengeId: string): string => {
  const instructions: Record<string, string> = {
    "sym-2": "Use the rotate button to turn each shape. Count how many times the shape looks exactly the same during one complete 360° rotation.",
  };
  return instructions[challengeId] || "Identify the rotational symmetry.";
};

const getChallenge = (challengeId: string): Shape[] => {
  switch(challengeId) {
    case "sym-2":
      return [
        {
          id: "square",
          name: "Square",
          rotationalOrder: 4,
          hasRotationalSymmetry: true,
          svg: `<svg viewBox="0 0 100 100" width="100" height="100">
                  <rect x="20" y="20" width="60" height="60" fill="#3b82f6" stroke="#1e40af" stroke-width="2"/>
                  <circle cx="35" cy="35" r="3" fill="#1e40af"/>
                </svg>`
        },
        {
          id: "triangle",
          name: "Equilateral Triangle", 
          rotationalOrder: 3,
          hasRotationalSymmetry: true,
          svg: `<svg viewBox="0 0 100 100" width="100" height="100">
                  <polygon points="50,20 20,70 80,70" fill="#10b981" stroke="#047857" stroke-width="2"/>
                  <circle cx="50" cy="30" r="3" fill="#047857"/>
                </svg>`
        },
        {
          id: "rectangle",
          name: "Rectangle",
          rotationalOrder: 2,
          hasRotationalSymmetry: true,
          svg: `<svg viewBox="0 0 100 100" width="100" height="100">
                  <rect x="15" y="30" width="70" height="40" fill="#f59e0b" stroke="#d97706" stroke-width="2"/>
                  <circle cx="25" cy="40" r="3" fill="#d97706"/>
                </svg>`
        }
      ];
    default:
      return [];
  }
};

export default RotateChallenge;
