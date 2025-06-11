
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface IdentifyChallengeProps {
  challengeId: string;
  onSuccess: () => void;
}

interface Shape {
  id: string;
  name: string;
  svg: string;
  symmetryLines: number;
  hasSymmetry: boolean;
}

const IdentifyChallenge: React.FC<IdentifyChallengeProps> = ({ challengeId, onSuccess }) => {
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [selectedShapes, setSelectedShapes] = useState<Set<string>>(new Set());
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [showLines, setShowLines] = useState(false);
  
  useEffect(() => {
    const data = getChallenge(challengeId);
    setShapes(data);
    setSelectedShapes(new Set());
    setIsCorrect(null);
    setShowLines(false);
  }, [challengeId]);
  
  const handleShapeClick = (shapeId: string) => {
    setSelectedShapes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(shapeId)) {
        newSet.delete(shapeId);
      } else {
        newSet.add(shapeId);
      }
      return newSet;
    });
  };
  
  const handleCheck = () => {
    setAttempts(prev => prev + 1);
    
    const correctShapes = shapes.filter(shape => shape.hasSymmetry).map(s => s.id);
    const selectedArray = Array.from(selectedShapes);
    
    const correct = correctShapes.length === selectedArray.length &&
                   correctShapes.every(id => selectedArray.includes(id));
    
    setIsCorrect(correct);
    setShowLines(true);
    
    if (correct) {
      setTimeout(() => {
        onSuccess();
      }, 1500);
    }
  };
  
  const handleReset = () => {
    setSelectedShapes(new Set());
    setIsCorrect(null);
    setShowLines(false);
  };
  
  return (
    <div className="p-4">
      <div className="mb-8 text-center">
        <h3 className="text-lg font-bold mb-2">{getChallengeTitle(challengeId)}</h3>
        <p className="text-slate-600">{getChallengeInstructions(challengeId)}</p>
      </div>
      
      {/* Shapes grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
        {shapes.map(shape => (
          <div
            key={shape.id}
            onClick={() => handleShapeClick(shape.id)}
            className={cn(
              "p-6 rounded-xl border-2 cursor-pointer transition-all transform hover:scale-105",
              selectedShapes.has(shape.id)
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 bg-white hover:border-gray-300"
            )}
          >
            <div className="flex justify-center mb-3">
              <div 
                dangerouslySetInnerHTML={{ __html: shape.svg }} 
                className="w-20 h-20"
              />
            </div>
            <p className="text-center font-medium text-sm">{shape.name}</p>
            
            {showLines && shape.hasSymmetry && (
              <p className="text-center text-xs text-green-600 mt-2">
                {shape.symmetryLines} line{shape.symmetryLines !== 1 ? 's' : ''} of symmetry
              </p>
            )}
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
              ? "Perfect! You've identified all shapes with line symmetry." 
              : "Not quite right. Look carefully for shapes that can be folded in half with both sides matching exactly."}
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
    "sym-1": "Find Line Symmetry",
  };
  return titles[challengeId] || "Identify Shapes";
};

const getChallengeInstructions = (challengeId: string): string => {
  const instructions: Record<string, string> = {
    "sym-1": "Click on all shapes that have line symmetry (can be folded in half with both sides matching exactly).",
  };
  return instructions[challengeId] || "Select the correct shapes.";
};

const getChallenge = (challengeId: string): Shape[] => {
  switch(challengeId) {
    case "sym-1":
      return [
        {
          id: "square",
          name: "Square",
          hasSymmetry: true,
          symmetryLines: 4,
          svg: `<svg viewBox="0 0 100 100" width="100" height="100">
                  <rect x="20" y="20" width="60" height="60" fill="#3b82f6" stroke="#1e40af" stroke-width="2"/>
                </svg>`
        },
        {
          id: "circle",
          name: "Circle", 
          hasSymmetry: true,
          symmetryLines: 999,
          svg: `<svg viewBox="0 0 100 100" width="100" height="100">
                  <circle cx="50" cy="50" r="30" fill="#10b981" stroke="#047857" stroke-width="2"/>
                </svg>`
        },
        {
          id: "triangle",
          name: "Equilateral Triangle",
          hasSymmetry: true,
          symmetryLines: 3,
          svg: `<svg viewBox="0 0 100 100" width="100" height="100">
                  <polygon points="50,20 20,70 80,70" fill="#f59e0b" stroke="#d97706" stroke-width="2"/>
                </svg>`
        },
        {
          id: "pentagon",
          name: "Regular Pentagon",
          hasSymmetry: true,
          symmetryLines: 5,
          svg: `<svg viewBox="0 0 100 100" width="100" height="100">
                  <polygon points="50,15 72,35 65,65 35,65 28,35" fill="#8b5cf6" stroke="#7c3aed" stroke-width="2"/>
                </svg>`
        },
        {
          id: "scalene",
          name: "Scalene Triangle",
          hasSymmetry: false,
          symmetryLines: 0,
          svg: `<svg viewBox="0 0 100 100" width="100" height="100">
                  <polygon points="30,20 70,30 40,70" fill="#ef4444" stroke="#dc2626" stroke-width="2"/>
                </svg>`
        },
        {
          id: "parallelogram",
          name: "Parallelogram",
          hasSymmetry: false,
          symmetryLines: 0,
          svg: `<svg viewBox="0 0 100 100" width="100" height="100">
                  <polygon points="20,60 40,20 80,20 60,60" fill="#06b6d4" stroke="#0891b2" stroke-width="2"/>
                </svg>`
        }
      ];
    default:
      return [];
  }
};

export default IdentifyChallenge;
