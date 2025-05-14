
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RotateCw, Star, HelpCircle, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import SortingChallenge from "./challenges/SortingChallenge";
import MatchingChallenge from "./challenges/MatchingChallenge";
import MeasureChallenge from "./challenges/MeasureChallenge";
import BuildChallenge from "./challenges/BuildChallenge";

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
  const [endTime, setEndTime] = useState(0);
  const [attempts, setAttempts] = useState(0);
  
  useEffect(() => {
    // Start the timer when the challenge loads
    setStartTime(Date.now());
    
    // Reset state when challenge changes
    setCompleted(false);
    setStars(0);
    setAttempts(0);
  }, [challenge.id]);
  
  const handleChallengeSuccess = () => {
    // Record end time
    const end = Date.now();
    setEndTime(end);
    
    // Calculate stars based on time and attempts
    const timeInSeconds = (end - startTime) / 1000;
    let calculatedStars = 3;
    
    // Adjust stars based on time (faster = better)
    if (timeInSeconds > 180) calculatedStars -= 1; // Over 3 minutes
    
    // Adjust stars based on attempts (fewer = better)
    if (attempts > 3) calculatedStars -= 1;
    
    // Ensure minimum of 1 star for completion
    calculatedStars = Math.max(1, calculatedStars);
    
    setStars(calculatedStars);
    setCompleted(true);
    
    // Show completion message
    toast.success(`Challenge completed!`, {
      description: `You earned ${calculatedStars} ${calculatedStars === 1 ? 'star' : 'stars'}!`,
    });
    
    // Save progress
    onComplete(calculatedStars);
  };
  
  const handleRetry = () => {
    setAttempts(prev => prev + 1);
    setCompleted(false);
  };
  
  const renderChallengeContent = () => {
    if (completed) {
      return (
        <div className="text-center py-10">
          <div className="mb-6 flex justify-center">
            {[1, 2, 3].map((i) => (
              <div key={i} className="mx-1">
                <Star 
                  size={48}
                  className={cn(
                    "transition-all",
                    i <= stars 
                      ? "text-yellow-500 fill-yellow-500 animate-bounce" 
                      : "text-gray-300"
                  )}
                  style={{
                    animationDelay: `${i * 0.2}s`,
                    animationDuration: '1s'
                  }}
                />
              </div>
            ))}
          </div>
          
          <h3 className="text-2xl font-bold mb-3 text-purple-700">
            Great job!
          </h3>
          
          <p className="text-gray-600 mb-6">
            You completed this challenge in {((endTime - startTime) / 1000).toFixed(1)} seconds
            {attempts > 1 ? ` with ${attempts} attempts` : ''}.
          </p>
          
          {/* Fun fact section */}
          <Card className="bg-indigo-50 p-4 mb-8 max-w-md mx-auto">
            <h4 className="font-bold mb-2 text-indigo-700">Fun Fact!</h4>
            <p className="text-slate-700">
              {getFunFactForChallenge(challenge.id)}
            </p>
          </Card>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={onBack} variant="outline">
              <ArrowLeft size={16} className="mr-1" />
              Back to Map
            </Button>
            <Button 
              onClick={handleRetry} 
              className="bg-gradient-to-r from-purple-600 to-pink-600"
            >
              <RotateCw size={16} className="mr-1" />
              Try Again
            </Button>
          </div>
        </div>
      );
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
      case "measure":
        return <MeasureChallenge 
          challengeId={challenge.id} 
          onSuccess={handleChallengeSuccess} 
        />;
      case "build":
        return <BuildChallenge 
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
    </div>
  );
};

// Fun facts for each challenge
const getFunFactForChallenge = (challengeId: string) => {
  const facts: Record<string, string> = {
    "poly-1": "The word 'polygon' comes from Greek, where 'poly' means 'many' and 'gon' means 'angle'.",
    "poly-2": "An equilateral triangle has three equal sides and three equal angles of 60 degrees each.",
    "poly-3": "A square is a special type of rectangle where all sides are equal in length.",
    "poly-4": "A regular polygon has all sides and angles equal, like a square or equilateral triangle.",
    "ang-1": "A full circle contains 360 degrees, which was established by ancient Babylonians!",
    "ang-2": "The right angle (90 degrees) got its name because it stands 'upright' or perpendicular.",
    "ang-3": "The angles in any triangle always sum to 180 degrees, no matter what shape the triangle is.",
    "circ-1": "The ratio of a circle's circumference to its diameter is always the same value - pi (π), approximately 3.14159.",
    "circ-2": "Ancient Egyptians used a value of 3.16 for pi when building the pyramids, which is remarkably close to the actual value!",
    "3d-1": "A cube has 6 faces, 8 vertices, and 12 edges.",
    "3d-2": "A net is a 2D pattern that can be folded to make a 3D shape.",
    "sym-1": "Butterflies and many flowers have line symmetry in their shapes.",
    "sym-2": "A square has four lines of symmetry and rotational symmetry of order 4."
  };
  
  return facts[challengeId] || "Shapes are all around us in everyday life!";
};

export default ShapeChallenge;
