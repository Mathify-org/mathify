
import React from "react";
import { Trophy, Star, Medal } from "lucide-react";

type StatsDisplayProps = {
  score: number;
  questionsAnswered: number;
  accuracy: number;
  streak: number;
};

const StatsDisplay = ({ score, questionsAnswered, accuracy, streak }: StatsDisplayProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Game Results</h2>
      
      <div className="grid gap-4 md:grid-cols-2">
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-4 rounded-lg border border-amber-100">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="h-5 w-5 text-amber-500" />
            <h3 className="font-medium">Final Score</h3>
          </div>
          <p className="text-2xl font-bold text-amber-700">{score}</p>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg border border-green-100">
          <div className="flex items-center gap-2 mb-2">
            <Star className="h-5 w-5 text-green-500" />
            <h3 className="font-medium">Accuracy</h3>
          </div>
          <p className="text-2xl font-bold text-green-700">{accuracy}%</p>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-4 rounded-lg border border-purple-100">
          <div className="flex items-center gap-2 mb-2">
            <Medal className="h-5 w-5 text-purple-500" />
            <h3 className="font-medium">Questions</h3>
          </div>
          <p className="text-2xl font-bold text-purple-700">{questionsAnswered}</p>
        </div>
        
        <div className="bg-gradient-to-br from-red-50 to-pink-50 p-4 rounded-lg border border-red-100">
          <div className="flex items-center gap-2 mb-2">
            <Star className="h-5 w-5 text-red-500" />
            <h3 className="font-medium">Best Streak</h3>
          </div>
          <p className="text-2xl font-bold text-red-700">{streak}</p>
        </div>
      </div>
    </div>
  );
};

export default StatsDisplay;
