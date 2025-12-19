import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import SortingChallenge from "./challenges/SortingChallenge";
import MatchingChallenge from "./challenges/MatchingChallenge";
import LabelingChallenge from "./challenges/LabelingChallenge";
import CalculateChallenge from "./challenges/CalculateChallenge";
import IdentifyChallenge from "./challenges/IdentifyChallenge";
import RotateChallenge from "./challenges/RotateChallenge";
import GameCompletionHandler from "@/components/GameCompletionHandler";

interface Challenge {
  id: string;
  name: string;
  type: string;
  description: string;
  completed: boolean;
  stars: number;
}

interface ShapeChallengeProps {
  challenge: Challenge;
  onComplete: (stars: number) => void;
  onBack: () => void;
}

const ShapeChallenge: React.FC<ShapeChallengeProps> = ({ challenge, onComplete, onBack }) => {
  const [stars, setStars] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [showCompletionHandler, setShowCompletionHandler] = useState(false);
  const gameStartTime = useRef<number>(Date.now());
  
  useEffect(() => {
    // Start the timer when the challenge loads
    setStartTime(Date.now());
    gameStartTime.current = Date.now();
    
    // Reset state when challenge changes
    setCompleted(false);
    setStars(0);
    setAttempts(0);
    setShowCompletionHandler(false);
  }, [challenge.id]);
  
  const handleChallengeSuccess = () => {
    // Calculate stars based on time and attempts
    const timeInSeconds = (Date.now() - startTime) / 1000;
    let calculatedStars = 3;
    
    // Adjust stars based on time (faster = better)
    if (timeInSeconds > 180) calculatedStars -= 1; // Over 3 minutes
    
    // Adjust stars based on attempts (fewer = better)
    if (attempts > 3) calculatedStars -= 1;
    
    // Ensure minimum of 1 star for completion
    calculatedStars = Math.max(1, calculatedStars);
    
    setStars(calculatedStars);
    setCompleted(true);
    setShowCompletionHandler(true);
    
    // Show completion message
    toast.success(`Challenge completed!`, {
      description: `You earned ${calculatedStars} ${calculatedStars === 1 ? 'star' : 'stars'}!`,
    });
  };
  
  const handleCompletionClose = () => {
    setShowCompletionHandler(false);
    // Save progress and go back
    onComplete(stars);
    onBack();
  };
  
  const handlePlayAgain = () => {
    setShowCompletionHandler(false);
    setCompleted(false);
    setStars(0);
    setAttempts(prev => prev + 1);
    setStartTime(Date.now());
    gameStartTime.current = Date.now();
  };
  
  const renderChallengeContent = () => {
    // Don't show custom completion screen - GameCompletionHandler handles it
    if (completed && !showCompletionHandler) {
      // Just show a simple waiting state
      return null;
    }
    
    // Render the appropriate challenge based on type
    switch (challenge.type) {
      case "sort":
        return <SortingChallenge 
          challengeId={challenge.id} 
          onSuccess={handleChallengeSuccess} 
        />;
      case "match":
        return <MatchingChallenge 
          challengeId={challenge.id} 
          onSuccess={handleChallengeSuccess} 
        />;
      case "label":
        return <LabelingChallenge 
          challengeId={challenge.id} 
          onSuccess={handleChallengeSuccess} 
        />;
      case "calculate":
        return <CalculateChallenge 
          challengeId={challenge.id} 
          onSuccess={handleChallengeSuccess} 
        />;
      case "identify":
        return <IdentifyChallenge 
          challengeId={challenge.id} 
          onSuccess={handleChallengeSuccess} 
        />;
      case "rotate":
        return <RotateChallenge 
          challengeId={challenge.id} 
          onSuccess={handleChallengeSuccess} 
        />;
      default:
        return (
          <div className="text-center py-10">
            <p className="text-gray-600">
              This challenge type is coming soon!
            </p>
            <Button onClick={onBack} className="mt-4">
              Back to Map
            </Button>
          </div>
        );
    }
  };
  
  return (
    <div className="bg-white rounded-2xl shadow-xl p-4 md:p-6">
      <div className="mb-6">
        <h2 className="text-xl md:text-2xl font-bold mb-2 text-purple-700">{challenge.name}</h2>
        <p className="text-slate-600">{challenge.description}</p>
      </div>
      
      {renderChallengeContent()}
      
      {/* Global Progress Tracking Modal */}
      {showCompletionHandler && (
        <GameCompletionHandler
          gameId="shape-explorer"
          gameName={`Shape Explorer - ${challenge.name}`}
          score={stars * 10}
          correctAnswers={1}
          totalQuestions={1}
          timeSpentSeconds={Math.round((Date.now() - gameStartTime.current) / 1000)}
          difficulty={challenge.type}
          onClose={handleCompletionClose}
          onPlayAgain={handlePlayAgain}
        />
      )}
    </div>
  );
};

export default ShapeChallenge;
