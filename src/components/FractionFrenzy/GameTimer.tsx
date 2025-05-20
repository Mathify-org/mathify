
import React from "react";
import { cn } from "@/lib/utils";

type GameTimerProps = {
  timeRemaining: number;
  totalTime: number;
};

const GameTimer = ({ timeRemaining, totalTime }: GameTimerProps) => {
  const percentage = (timeRemaining / totalTime) * 100;
  
  let timerColor = "bg-green-500";
  if (percentage < 50) timerColor = "bg-amber-500";
  if (percentage < 20) timerColor = "bg-red-500";
  
  return (
    <div className="flex items-center gap-2">
      <div className="w-20 md:w-32 h-2 md:h-3 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={cn("h-full transition-all duration-1000", timerColor)}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-sm font-medium">{timeRemaining}s</span>
    </div>
  );
};

export default GameTimer;
