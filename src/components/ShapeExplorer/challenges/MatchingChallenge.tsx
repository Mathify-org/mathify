
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface MatchingChallengeProps {
  challengeId: string;
  onSuccess: () => void;
}

interface MatchItem {
  id: string;
  content: React.ReactNode;
  matchId: string;
}

const MatchingChallenge: React.FC<MatchingChallengeProps> = ({ challengeId, onSuccess }) => {
  const [leftItems, setLeftItems] = useState<MatchItem[]>([]);
  const [rightItems, setRightItems] = useState<MatchItem[]>([]);
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  
  useEffect(() => {
    const challenge = getChallengeData(challengeId);
    setLeftItems(challenge.leftItems);
    setRightItems(challenge.rightItems);
    setMatches({});
  }, [challengeId]);
  
  const handleLeftSelect = (id: string) => {
    // If this item is already matched, do nothing
    if (Object.keys(matches).includes(id)) return;
    
    setSelectedLeft(id);
    
    // If right is already selected, make a match
    if (selectedRight) {
      makeMatch(id, selectedRight);
    }
  };
  
  const handleRightSelect = (id: string) => {
    // If this item is already matched, do nothing
    if (Object.values(matches).includes(id)) return;
    
    setSelectedRight(id);
    
    // If left is already selected, make a match
    if (selectedLeft) {
      makeMatch(selectedLeft, id);
    }
  };
  
  const makeMatch = (leftId: string, rightId: string) => {
    setMatches(prev => ({
      ...prev,
      [leftId]: rightId
    }));
    
    setSelectedLeft(null);
    setSelectedRight(null);
    
    // Check if all items are matched
    if (Object.keys(matches).length === leftItems.length - 1) {
      // Wait a moment to show the last match before checking
      setTimeout(() => {
        checkMatches();
      }, 500);
    }
  };
  
  const checkMatches = () => {
    // Check if all matches are correct
    const allCorrect = leftItems.every(item => {
      const matchedRightId = matches[item.id];
      if (!matchedRightId) return false;
      
      const matchedRightItem = rightItems.find(r => r.id === matchedRightId);
      if (!matchedRightItem) return false;
      
      return item.matchId === matchedRightItem.id;
    });
    
    setIsCorrect(allCorrect);
    
    if (allCorrect) {
      setTimeout(() => {
        onSuccess();
      }, 1500);
    }
  };
  
  const handleCheck = () => {
    if (Object.keys(matches).length < leftItems.length) {
      toast.error("Please match all items before checking");
      return;
    }
    
    checkMatches();
  };
  
  const handleReset = () => {
    setMatches({});
    setSelectedLeft(null);
    setSelectedRight(null);
    setIsCorrect(null);
  };
  
  const renderMatchLine = (leftId: string, rightId: string) => {
    const leftItem = leftItems.find(item => item.id === leftId);
    const rightItem = rightItems.find(item => item.id === rightId);
    
    if (!leftItem || !rightItem) return null;
    
    // Find if this match is correct
    const isMatchCorrect = leftItem.matchId === rightItem.id;
    
    return (
      <svg 
        key={`${leftId}-${rightId}`} 
        className="absolute top-0 left-0 w-full h-full pointer-events-none z-10"
        style={{ overflow: 'visible' }}
      >
        <line 
          x1="100%" 
          y1="0%" 
          x2="0%" 
          y2="0%" 
          stroke={isCorrect === null ? "#6366f1" : (isMatchCorrect ? "#22c55e" : "#ef4444")}
          strokeWidth="2"
          strokeDasharray={isCorrect === null ? "5,5" : "0"} 
          className="transition-all duration-300"
        />
      </svg>
    );
  };
  
  return (
    <div className="p-4">
      <div className="mb-8 text-center">
        <h3 className="text-lg font-bold mb-2">{getChallengeTitle(challengeId)}</h3>
        <p className="text-slate-600">{getChallengeInstructions(challengeId)}</p>
      </div>
      
      {/* Matching area */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        {/* Left column */}
        <div className="space-y-4">
          {leftItems.map(item => {
            const isMatched = Object.keys(matches).includes(item.id);
            const isSelected = selectedLeft === item.id;
            
            return (
              <div
                key={item.id}
                onClick={() => !isMatched && handleLeftSelect(item.id)}
                className={cn(
                  "p-4 rounded-lg border-2 transition-all relative",
                  isMatched ? "bg-slate-100 border-slate-300" : 
                  isSelected ? "bg-indigo-100 border-indigo-500" : 
                  "bg-white border-slate-200 hover:border-indigo-300 cursor-pointer"
                )}
              >
                {typeof item.content === 'string' ? (
                  <p className="text-center">{item.content}</p>
                ) : (
                  item.content
                )}
                
                {isMatched && (
                  <div className="absolute right-0 top-0 transform translate-x-1/2 -translate-y-1/2">
                    {renderMatchLine(item.id, matches[item.id])}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        {/* Right column */}
        <div className="space-y-4">
          {rightItems.map(item => {
            const isMatched = Object.values(matches).includes(item.id);
            const isSelected = selectedRight === item.id;
            
            return (
              <div
                key={item.id}
                onClick={() => !isMatched && handleRightSelect(item.id)}
                className={cn(
                  "p-4 rounded-lg border-2 transition-all",
                  isMatched ? "bg-slate-100 border-slate-300" : 
                  isSelected ? "bg-indigo-100 border-indigo-500" : 
                  "bg-white border-slate-200 hover:border-indigo-300 cursor-pointer"
                )}
              >
                {typeof item.content === 'string' ? (
                  <p className="text-center">{item.content}</p>
                ) : (
                  item.content
                )}
              </div>
            );
          })}
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
              ? "Great job! All matches are correct." 
              : "Some matches are incorrect. Try again!"}
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
          disabled={isCorrect === true || Object.keys(matches).length < leftItems.length}
          className={cn(
            "text-white",
            isCorrect === true
              ? "bg-green-500 hover:bg-green-600"
              : "bg-purple-600 hover:bg-purple-700"
          )}
        >
          {isCorrect === true ? "Correct!" : "Check Matches"}
        </Button>
      </div>
    </div>
  );
};

// Challenge-specific content
const getChallengeTitle = (challengeId: string): string => {
  const titles: Record<string, string> = {
    "poly-2": "Polygon Corners",
    "ang-1": "Types of Angles",
    "3d-1": "3D Shapes and Properties",
    "sym-1": "Line Symmetry",
  };
  return titles[challengeId] || "Match the Items";
};

const getChallengeInstructions = (challengeId: string): string => {
  const instructions: Record<string, string> = {
    "poly-2": "Match each shape with its correct number of vertices (corners).",
    "ang-1": "Match each angle with its correct name.",
    "3d-1": "Match 3D shapes with their correct properties.",
    "sym-1": "Match shapes with their line(s) of symmetry.",
  };
  return instructions[challengeId] || "Click an item on each side to create a match.";
};

// Get challenge data based on ID
const getChallengeData = (challengeId: string) => {
  let leftItems: MatchItem[] = [];
  let rightItems: MatchItem[] = [];
  
  switch(challengeId) {
    case "poly-2":
      leftItems = [
        {
          id: "s1",
          content: (
            <div className="flex justify-center">
              <svg width="60" height="60" viewBox="0 0 60 60">
                <polygon 
                  points="30,5 55,30 30,55 5,30" 
                  fill="#4f46e5"
                  stroke="#4338ca"
                  strokeWidth="2"
                />
                {/* Dots at vertices */}
                <circle cx="30" cy="5" r="3" fill="#f97316" />
                <circle cx="55" cy="30" r="3" fill="#f97316" />
                <circle cx="30" cy="55" r="3" fill="#f97316" />
                <circle cx="5" cy="30" r="3" fill="#f97316" />
              </svg>
            </div>
          ),
          matchId: "v4"
        },
        {
          id: "s2",
          content: (
            <div className="flex justify-center">
              <svg width="60" height="60" viewBox="0 0 60 60">
                <polygon 
                  points="30,5 50,20 40,50 20,50 10,20" 
                  fill="#2dd4bf"
                  stroke="#0d9488"
                  strokeWidth="2"
                />
                {/* Dots at vertices */}
                <circle cx="30" cy="5" r="3" fill="#f97316" />
                <circle cx="50" cy="20" r="3" fill="#f97316" />
                <circle cx="40" cy="50" r="3" fill="#f97316" />
                <circle cx="20" cy="50" r="3" fill="#f97316" />
                <circle cx="10" cy="20" r="3" fill="#f97316" />
              </svg>
            </div>
          ),
          matchId: "v5"
        },
        {
          id: "s3",
          content: (
            <div className="flex justify-center">
              <svg width="60" height="60" viewBox="0 0 60 60">
                <polygon 
                  points="30,5 55,15 55,45 30,55 5,45 5,15" 
                  fill="#a855f7"
                  stroke="#9333ea"
                  strokeWidth="2"
                />
                {/* Dots at vertices */}
                <circle cx="30" cy="5" r="3" fill="#f97316" />
                <circle cx="55" cy="15" r="3" fill="#f97316" />
                <circle cx="55" cy="45" r="3" fill="#f97316" />
                <circle cx="30" cy="55" r="3" fill="#f97316" />
                <circle cx="5" cy="45" r="3" fill="#f97316" />
                <circle cx="5" cy="15" r="3" fill="#f97316" />
              </svg>
            </div>
          ),
          matchId: "v6"
        },
        {
          id: "s4",
          content: (
            <div className="flex justify-center">
              <svg width="60" height="60" viewBox="0 0 60 60">
                <polygon 
                  points="30,5 45,15 50,35 35,50 15,50 10,35 15,15" 
                  fill="#ec4899"
                  stroke="#db2777"
                  strokeWidth="2"
                />
                {/* Dots at vertices */}
                <circle cx="30" cy="5" r="3" fill="#f97316" />
                <circle cx="45" cy="15" r="3" fill="#f97316" />
                <circle cx="50" cy="35" r="3" fill="#f97316" />
                <circle cx="35" cy="50" r="3" fill="#f97316" />
                <circle cx="15" cy="50" r="3" fill="#f97316" />
                <circle cx="10" cy="35" r="3" fill="#f97316" />
                <circle cx="15" cy="15" r="3" fill="#f97316" />
              </svg>
            </div>
          ),
          matchId: "v7"
        },
      ];
      rightItems = [
        { id: "v4", content: "4 vertices", matchId: "s1" },
        { id: "v5", content: "5 vertices", matchId: "s2" },
        { id: "v6", content: "6 vertices", matchId: "s3" },
        { id: "v7", content: "7 vertices", matchId: "s4" },
      ];
      break;
      
    case "ang-1":
      leftItems = [
        {
          id: "a1",
          content: (
            <div className="flex justify-center">
              <svg width="60" height="60" viewBox="0 0 60 60">
                <path d="M 10 50 L 10 10 L 50 10" stroke="blue" strokeWidth="3" fill="none" />
                <text x="25" y="25" fontSize="10" fill="blue">Interior angle</text>
                <circle cx="10" cy="10" r="3" fill="blue" />
              </svg>
            </div>
          ),
          matchId: "ang1"
        },
        {
          id: "a2",
          content: (
            <div className="flex justify-center">
              <svg width="60" height="60" viewBox="0 0 60 60">
                <path d="M 10 30 L 50 10 L 50 50" stroke="green" strokeWidth="3" fill="none" />
                <text x="30" y="30" fontSize="10" fill="green">Interior angle</text>
                <circle cx="50" cy="30" r="3" fill="green" />
              </svg>
            </div>
          ),
          matchId: "ang2"
        },
        {
          id: "a3",
          content: (
            <div className="flex justify-center">
              <svg width="60" height="60" viewBox="0 0 60 60">
                <path d="M 10 10 L 50 30 L 10 50" stroke="purple" strokeWidth="3" fill="none" />
                <text x="20" y="35" fontSize="10" fill="purple">Interior angle</text>
                <circle cx="10" cy="30" r="3" fill="purple" />
              </svg>
            </div>
          ),
          matchId: "ang3"
        },
      ];
      rightItems = [
        { id: "ang1", content: "Right Angle (90°)", matchId: "a1" },
        { id: "ang2", content: "Acute Angle (< 90°)", matchId: "a2" },
        { id: "ang3", content: "Obtuse Angle (> 90°)", matchId: "a3" },
      ];
      break;
      
    case "3d-1":
      leftItems = [
        {
          id: "3d1",
          content: (
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-blue-500 rounded"></div>
            </div>
          ),
          matchId: "shape1"
        },
        {
          id: "3d2",
          content: (
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-green-500 rounded-full"></div>
            </div>
          ),
          matchId: "shape2"
        },
        {
          id: "3d3",
          content: (
            <div className="flex justify-center">
              <div className="w-0 h-0 border-l-[30px] border-r-[30px] border-b-[60px] 
                border-l-transparent border-r-transparent border-b-purple-500"></div>
            </div>
          ),
          matchId: "shape3"
        },
      ];
      rightItems = [
        { id: "shape1", content: "Cube: 6 faces, 8 vertices, 12 edges", matchId: "3d1" },
        { id: "shape2", content: "Sphere: 1 face, 0 vertices, 0 edges", matchId: "3d2" },
        { id: "shape3", content: "Pyramid: 5 faces, 5 vertices, 8 edges", matchId: "3d3" },
      ];
      break;
      
    default:
      // Default matching challenge
      leftItems = [
        { id: "l1", content: "Item 1", matchId: "r1" },
        { id: "l2", content: "Item 2", matchId: "r2" },
        { id: "l3", content: "Item 3", matchId: "r3" },
      ];
      rightItems = [
        { id: "r1", content: "Match 1", matchId: "l1" },
        { id: "r2", content: "Match 2", matchId: "l2" },
        { id: "r3", content: "Match 3", matchId: "l3" },
      ];
  }
  
  // Shuffle the right items
  const shuffledRight = [...rightItems].sort(() => Math.random() - 0.5);
  
  return { leftItems, rightItems: shuffledRight };
};

export default MatchingChallenge;
