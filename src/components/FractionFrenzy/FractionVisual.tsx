
import React from "react";
import { cn } from "@/lib/utils";

type FractionVisualProps = {
  numerator: number;
  denominator: number;
  showAnimation?: boolean;
  size?: "small" | "medium" | "large";
  theme?: "pizza" | "pie" | "bar" | "circle";
};

const FractionVisual = ({ 
  numerator, 
  denominator, 
  showAnimation = false,
  size = "medium",
  theme = "pie"
}: FractionVisualProps) => {
  const getSize = () => {
    switch (size) {
      case "small": return "w-24 h-24";
      case "large": return "w-48 h-48";
      case "medium":
      default: return "w-32 h-32";
    }
  };

  const renderPieChart = () => {
    const percentage = (numerator / denominator) * 100;
    const strokeDasharray = `${percentage} ${100 - percentage}`;
    
    return (
      <div className={cn("relative", getSize())}>
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
          <path
            className="text-gray-200"
            stroke="currentColor"
            strokeWidth="3"
            fill="transparent"
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <path
            className={cn(
              "text-blue-500 transition-all duration-1000",
              showAnimation && "animate-pulse"
            )}
            stroke="currentColor"
            strokeWidth="3"
            strokeDasharray={strokeDasharray}
            strokeLinecap="round"
            fill="transparent"
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold">
            {numerator}/{denominator}
          </span>
        </div>
      </div>
    );
  };

  const renderBarChart = () => {
    const sections = Array.from({ length: denominator }, (_, i) => i);
    
    return (
      <div className={cn("flex flex-col gap-1", getSize())}>
        <div className="text-center text-sm font-medium mb-2">
          {numerator}/{denominator}
        </div>
        <div className="flex-1 flex flex-col gap-1">
          {sections.map((section) => (
            <div
              key={section}
              className={cn(
                "flex-1 border-2 border-gray-300 rounded transition-all duration-500",
                section < numerator ? "bg-blue-500" : "bg-gray-100",
                showAnimation && section < numerator && "animate-pulse"
              )}
            />
          ))}
        </div>
      </div>
    );
  };

  switch (theme) {
    case "bar":
      return renderBarChart();
    case "pie":
    default:
      return renderPieChart();
  }
};

export default FractionVisual;
