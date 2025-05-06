
import React, { useState, useEffect } from "react";
import { getTimeToNextPuzzle } from "@/utils/dailyPuzzleUtils";

const CountdownTimer: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState(getTimeToNextPuzzle());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeToNextPuzzle());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="text-center mb-4">
      <h4 className="text-lg font-medium text-gray-700">Next puzzle in:</h4>
      <p className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-orange-500">
        {timeLeft}
      </p>
    </div>
  );
};

export default CountdownTimer;
