
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CheckCircle2, AlertCircle, RotateCw } from "lucide-react";
import { toast } from "sonner";

interface BuildChallengeProps {
  challengeId: string;
  onSuccess: () => void;
}

interface NetPiece {
  id: string;
  position: { x: number, y: number };
  rotation: number;
  shape: React.ReactNode;
  correctPosition: { x: number, y: number };
  correctRotation: number;
  tolerance: { position: number, rotation: number };
}

const BuildChallenge: React.FC<BuildChallengeProps> = ({ challengeId, onSuccess }) => {
  const [pieces, setPieces] = useState<NetPiece[]>(getInitialPieces(challengeId));
  const [selectedPiece, setSelectedPiece] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  
  const handlePieceSelect = (id: string) => {
    setSelectedPiece(id);
  };
  
  const handleRotate = (id: string) => {
    setPieces(pieces.map(piece => 
      piece.id === id 
        ? { ...piece, rotation: (piece.rotation + 90) % 360 }
        : piece
    ));
  };
  
  const handleMove = (direction: 'up' | 'down' | 'left' | 'right') => {
    if (!selectedPiece) return;
    
    const moveDistance = 10;
    
    setPieces(pieces.map(piece => {
      if (piece.id !== selectedPiece) return piece;
      
      const newPosition = { ...piece.position };
      
      switch (direction) {
        case 'up':
          newPosition.y -= moveDistance;
          break;
        case 'down':
          newPosition.y += moveDistance;
          break;
        case 'left':
          newPosition.x -= moveDistance;
          break;
        case 'right':
          newPosition.x += moveDistance;
          break;
      }
      
      return { ...piece, position: newPosition };
    }));
  };
  
  const handleCheck = () => {
    // Check if all pieces are in correct positions
    const allCorrect = pieces.every(piece => {
      const positionCorrect = 
        Math.abs(piece.position.x - piece.correctPosition.x) <= piece.tolerance.position &&
        Math.abs(piece.position.y - piece.correctPosition.y) <= piece.tolerance.position;
      
      const rotationCorrect = 
        piece.rotation % 360 === piece.correctRotation % 360;
      
      return positionCorrect && rotationCorrect;
    });
    
    setIsCorrect(allCorrect);
    
    if (allCorrect) {
      setTimeout(() => {
        // Show completion animation
        toast.success("Perfect! You've built the 3D shape correctly!");
        
        setTimeout(() => {
          onSuccess();
        }, 1500);
      }, 500);
    }
  };
  
  const handleReset = () => {
    setPieces(getInitialPieces(challengeId));
    setSelectedPiece(null);
    setIsCorrect(null);
  };
  
  return (
    <div className="p-4">
      <div className="mb-6 text-center">
        <h3 className="text-lg font-bold mb-2">{getChallengeTitle(challengeId)}</h3>
        <p className="text-slate-600 mb-1">{getChallengeInstructions(challengeId)}</p>
        <p className="text-sm text-slate-500">Click a piece to select it, then use the controls to move and rotate it.</p>
      </div>
      
      {/* Building area */}
      <div className="relative bg-slate-100 rounded-xl h-[300px] mb-6 overflow-hidden shadow-inner">
        {/* Target outline */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <svg width="200" height="200" viewBox="0 0 200 200" className="opacity-30">
            <rect x="50" y="50" width="100" height="100" stroke="#6366f1" strokeWidth="2" strokeDasharray="5,5" fill="none" />
          </svg>
        </div>
        
        {/* Pieces */}
        {pieces.map(piece => (
          <div
            key={piece.id}
            className={cn(
              "absolute cursor-pointer transition-shadow",
              selectedPiece === piece.id ? "shadow-lg ring-2 ring-indigo-500" : "shadow"
            )}
            style={{
              left: `${piece.position.x}px`,
              top: `${piece.position.y}px`,
              transform: `rotate(${piece.rotation}deg)`,
              transformOrigin: 'center',
            }}
            onClick={() => handlePieceSelect(piece.id)}
          >
            {piece.shape}
          </div>
        ))}
      </div>
      
      {/* Controls */}
      <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
        <div className="mb-4">
          <h4 className="font-medium mb-2">Move Selected Piece:</h4>
          <div className="grid grid-cols-3 gap-2 max-w-[200px] mx-auto">
            <div></div>
            <Button 
              size="sm" 
              onClick={() => handleMove('up')}
              disabled={!selectedPiece}
              className="bg-slate-200 hover:bg-slate-300 text-slate-800"
            >
              ↑
            </Button>
            <div></div>
            
            <Button 
              size="sm"
              onClick={() => handleMove('left')}
              disabled={!selectedPiece}
              className="bg-slate-200 hover:bg-slate-300 text-slate-800"
            >
              ←
            </Button>
            
            <Button 
              size="sm"
              onClick={() => handleMove('down')}
              disabled={!selectedPiece}
              className="bg-slate-200 hover:bg-slate-300 text-slate-800"
            >
              ↓
            </Button>
            
            <Button 
              size="sm"
              onClick={() => handleMove('right')}
              disabled={!selectedPiece}
              className="bg-slate-200 hover:bg-slate-300 text-slate-800"
            >
              →
            </Button>
          </div>
        </div>
        
        <div>
          <Button
            onClick={() => selectedPiece && handleRotate(selectedPiece)}
            disabled={!selectedPiece}
            variant="outline"
            className="w-full"
          >
            <RotateCw size={16} className="mr-2" />
            Rotate 90°
          </Button>
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
              ? "Perfect! You've built the 3D shape correctly!" 
              : "Not quite right. Keep adjusting the pieces."}
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
          {isCorrect === true ? "Correct!" : "Check Build"}
        </Button>
      </div>
    </div>
  );
};

// Challenge-specific content
const getChallengeTitle = (challengeId: string): string => {
  if (challengeId === "3d-2") {
    return "Cube Net Builder";
  }
  return "Net Builder";
};

const getChallengeInstructions = (challengeId: string): string => {
  if (challengeId === "3d-2") {
    return "Move and rotate the square pieces to form a cube net.";
  }
  return "Arrange the pieces to create a 3D shape net.";
};

// Get initial pieces for the challenge
const getInitialPieces = (challengeId: string): NetPiece[] => {
  // For cube net
  if (challengeId === "3d-2") {
    return [
      {
        id: "face1",
        position: { x: 50, y: 50 },
        rotation: 0,
        shape: (
          <div className="w-16 h-16 bg-blue-400 border-2 border-blue-600 flex items-center justify-center text-white font-bold">
            1
          </div>
        ),
        correctPosition: { x: 92, y: 92 },
        correctRotation: 0,
        tolerance: { position: 15, rotation: 0 }
      },
      {
        id: "face2",
        position: { x: 100, y: 50 },
        rotation: 0,
        shape: (
          <div className="w-16 h-16 bg-green-400 border-2 border-green-600 flex items-center justify-center text-white font-bold">
            2
          </div>
        ),
        correctPosition: { x: 92, y: 60 },
        correctRotation: 0,
        tolerance: { position: 15, rotation: 0 }
      },
      {
        id: "face3",
        position: { x: 150, y: 50 },
        rotation: 0,
        shape: (
          <div className="w-16 h-16 bg-red-400 border-2 border-red-600 flex items-center justify-center text-white font-bold">
            3
          </div>
        ),
        correctPosition: { x: 92, y: 124 },
        correctRotation: 0,
        tolerance: { position: 15, rotation: 0 }
      },
      {
        id: "face4",
        position: { x: 50, y: 100 },
        rotation: 0,
        shape: (
          <div className="w-16 h-16 bg-yellow-400 border-2 border-yellow-600 flex items-center justify-center text-white font-bold">
            4
          </div>
        ),
        correctPosition: { x: 60, y: 92 },
        correctRotation: 0,
        tolerance: { position: 15, rotation: 0 }
      },
      {
        id: "face5",
        position: { x: 100, y: 100 },
        rotation: 0,
        shape: (
          <div className="w-16 h-16 bg-purple-400 border-2 border-purple-600 flex items-center justify-center text-white font-bold">
            5
          </div>
        ),
        correctPosition: { x: 124, y: 92 },
        correctRotation: 0,
        tolerance: { position: 15, rotation: 0 }
      },
      {
        id: "face6",
        position: { x: 150, y: 100 },
        rotation: 0,
        shape: (
          <div className="w-16 h-16 bg-indigo-400 border-2 border-indigo-600 flex items-center justify-center text-white font-bold">
            6
          </div>
        ),
        correctPosition: { x: 28, y: 92 },
        correctRotation: 0,
        tolerance: { position: 15, rotation: 0 }
      }
    ];
  }
  
  // Default pieces for a simple shape
  return [
    {
      id: "piece1",
      position: { x: 50, y: 50 },
      rotation: 0,
      shape: (
        <div className="w-16 h-16 bg-blue-400 border-2 border-blue-600"></div>
      ),
      correctPosition: { x: 92, y: 92 },
      correctRotation: 0,
      tolerance: { position: 15, rotation: 0 }
    },
    {
      id: "piece2",
      position: { x: 100, y: 50 },
      rotation: 0,
      shape: (
        <div className="w-16 h-16 bg-green-400 border-2 border-green-600"></div>
      ),
      correctPosition: { x: 108, y: 92 },
      correctRotation: 0,
      tolerance: { position: 15, rotation: 0 }
    },
  ];
};

export default BuildChallenge;
