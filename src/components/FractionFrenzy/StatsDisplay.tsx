
import React from "react";
import { GameStats } from "@/types/fractionFrenzy";
import { Trophy, Star, Medal } from "lucide-react";

type StatsDisplayProps = {
  stats: GameStats;
};

const StatsDisplay = ({ stats }: StatsDisplayProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Your Stats</h2>
      
      <div className="grid gap-4 md:grid-cols-3">
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-4 rounded-lg border border-amber-100">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="h-5 w-5 text-amber-500" />
            <h3 className="font-medium">Best Score</h3>
          </div>
          <p className="text-2xl font-bold text-amber-700">{stats.bestFrenzyScore}</p>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg border border-green-100">
          <div className="flex items-center gap-2 mb-2">
            <Star className="h-5 w-5 text-green-500" />
            <h3 className="font-medium">Total Correct</h3>
          </div>
          <p className="text-2xl font-bold text-green-700">{stats.totalCorrect}</p>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-4 rounded-lg border border-purple-100">
          <div className="flex items-center gap-2 mb-2">
            <Medal className="h-5 w-5 text-purple-500" />
            <h3 className="font-medium">Longest Streak</h3>
          </div>
          <p className="text-2xl font-bold text-purple-700">{stats.longestStreak}</p>
        </div>
      </div>
      
      {stats.survivalModeUnlocked && (
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-3 rounded-lg mt-4">
          <p className="font-medium">🎉 Survival Mode Unlocked!</p>
        </div>
      )}
    </div>
  );
};

export default StatsDisplay;
