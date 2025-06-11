
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface LabelingChallengeProps {
  challengeId: string;
  onSuccess: () => void;
}

interface Label {
  id: string;
  text: string;
  position: { x: number; y: number };
  isCorrect: boolean;
}

interface LabelOption {
  id: string;
  text: string;
}

const LabelingChallenge: React.FC<LabelingChallengeProps> = ({ challengeId, onSuccess }) => {
  const [placedLabels, setPlacedLabels] = useState<Record<string, string>>({});
  const [availableLabels, setAvailableLabels] = useState<LabelOption[]>([]);
  const [targetLabels, setTargetLabels] = useState<Label[]>([]);
  const [draggingLabel, setDraggingLabel] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [attempts, setAttempts] = useState(0);
  
  useEffect(() => {
    const data = getChallenge(challengeId);
    setAvailableLabels(data.options);
    setTargetLabels(data.targets);
    setPlacedLabels({});
    setIsCorrect(null);
  }, [challengeId]);
  
  const handleDragStart = (labelId: string) => {
    setDraggingLabel(labelId);
  };
  
  const handleDrop = (targetId: string) => {
    if (draggingLabel) {
      setPlacedLabels(prev => ({
        ...prev,
        [targetId]: draggingLabel
      }));
      setDraggingLabel(null);
    }
  };
  
  const handleCheck = () => {
    setAttempts(prev => prev + 1);
    
    const allLabelsPlaced = targetLabels.every(target => placedLabels[target.id]);
    
    if (!allLabelsPlaced) {
      toast.error("Please place all labels before checking");
      return;
    }
    
    let correct = true;
    targetLabels.forEach(target => {
      const placedLabel = availableLabels.find(label => label.id === placedLabels[target.id]);
      if (!placedLabel || !target.isCorrect) {
        if (target.text !== placedLabel?.text) {
          correct = false;
        }
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
    setPlacedLabels({});
    setIsCorrect(null);
  };
  
  const getUnusedLabels = () => {
    const usedIds = Object.values(placedLabels);
    return availableLabels.filter(label => !usedIds.includes(label.id));
  };
  
  return (
    <div className="p-4">
      <div className="mb-8 text-center">
        <h3 className="text-lg font-bold mb-2">{getChallengeTitle(challengeId)}</h3>
        <p className="text-slate-600">{getChallengeInstructions(challengeId)}</p>
      </div>
      
      {/* Circle diagram */}
      <div className="flex justify-center mb-8">
        <div className="relative">
          <svg width="300" height="300" viewBox="0 0 300 300">
            {/* Circle */}
            <circle
              cx="150"
              cy="150"
              r="100"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="3"
            />
            
            {/* Radius line */}
            <line
              x1="150"
              y1="150"
              x2="250"
              y2="150"
              stroke="#ef4444"
              strokeWidth="2"
            />
            
            {/* Diameter line */}
            <line
              x1="70"
              y1="150"
              x2="230"
              y2="150"
              stroke="#10b981"
              strokeWidth="2"
            />
            
            {/* Center point */}
            <circle cx="150" cy="150" r="3" fill="#6366f1" />
            
            {/* Label drop zones */}
            {targetLabels.map(target => (
              <g key={target.id}>
                <rect
                  x={target.position.x - 30}
                  y={target.position.y - 10}
                  width="60"
                  height="20"
                  fill={placedLabels[target.id] ? "#f3f4f6" : "#ffffff"}
                  stroke="#d1d5db"
                  strokeWidth="1"
                  rx="4"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleDrop(target.id)}
                  className="cursor-pointer"
                />
                <text
                  x={target.position.x}
                  y={target.position.y + 5}
                  textAnchor="middle"
                  fontSize="12"
                  fill="#374151"
                >
                  {placedLabels[target.id] 
                    ? availableLabels.find(l => l.id === placedLabels[target.id])?.text
                    : "Drop here"
                  }
                </text>
              </g>
            ))}
          </svg>
        </div>
      </div>
      
      {/* Available labels */}
      <div className="mb-6">
        <h4 className="font-bold mb-3 text-center">Drag the labels to the correct positions:</h4>
        <div className="flex flex-wrap justify-center gap-3">
          {getUnusedLabels().map(label => (
            <div
              key={label.id}
              draggable
              onDragStart={() => handleDragStart(label.id)}
              className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg cursor-grab hover:bg-blue-200 transition-colors"
            >
              {label.text}
            </div>
          ))}
        </div>
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
              ? "Perfect! You've correctly labeled all parts of the circle." 
              : "Not quite right. Try again!"}
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
    "circ-1": "Label the Circle",
  };
  return titles[challengeId] || "Label the Shape";
};

const getChallengeInstructions = (challengeId: string): string => {
  const instructions: Record<string, string> = {
    "circ-1": "Drag the correct labels to identify the parts of this circle.",
  };
  return instructions[challengeId] || "Label the parts of the shape.";
};

const getChallenge = (challengeId: string) => {
  switch(challengeId) {
    case "circ-1":
      return {
        options: [
          { id: "radius", text: "Radius" },
          { id: "diameter", text: "Diameter" },
          { id: "center", text: "Center" },
          { id: "circumference", text: "Circumference" }
        ],
        targets: [
          { id: "t1", text: "Radius", position: { x: 200, y: 120 }, isCorrect: true },
          { id: "t2", text: "Diameter", position: { x: 150, y: 100 }, isCorrect: true },
          { id: "t3", text: "Center", position: { x: 150, y: 180 }, isCorrect: true },
          { id: "t4", text: "Circumference", position: { x: 100, y: 200 }, isCorrect: true }
        ]
      };
    default:
      return {
        options: [
          { id: "opt1", text: "Option 1" },
          { id: "opt2", text: "Option 2" }
        ],
        targets: [
          { id: "t1", text: "Target", position: { x: 150, y: 150 }, isCorrect: true }
        ]
      };
  }
};

export default LabelingChallenge;
