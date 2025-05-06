
import React from "react";
import { ShapeType, FeedbackType } from "@/types/puzzleTypes";
import DroppableZone from "@/components/DroppableZone";
import ShapeIcon from "./ShapeIcon";

interface EquationSlotProps {
  id: string;
  shape: ShapeType | null;
  feedback?: FeedbackType;
  isOperator?: boolean;
  operatorValue?: string;
}

const EquationSlot: React.FC<EquationSlotProps> = ({ 
  id, 
  shape, 
  feedback,
  isOperator = false,
  operatorValue = ""
}) => {
  const getFeedbackColor = () => {
    if (!feedback) return "bg-gray-50 border-dashed";
    
    switch (feedback) {
      case "correct":
        return "bg-green-100 border-green-500";
      case "wrong-position":
        return "bg-yellow-100 border-yellow-500";
      case "incorrect":
        return "bg-gray-100 border-gray-300";
      default:
        return "bg-gray-50 border-dashed";
    }
  };

  const getShapeColor = () => {
    if (!shape) return "text-gray-300";
    
    switch (shape) {
      case "circle":
        return "text-pink-500";
      case "square":
        return "text-blue-500";
      case "triangle":
        return "text-green-500";
      case "hexagon":
        return "text-purple-500";
      case "clock":
        return "text-cyan-500";
      case "star":
        return "text-amber-500";
      default:
        return "text-gray-700";
    }
  };

  return (
    <DroppableZone id={id}>
      <div 
        className={`border-2 ${getFeedbackColor()} rounded-lg p-2 md:p-3 flex items-center justify-center w-12 h-12 md:w-14 md:h-14 transition-colors`}
      >
        {shape ? (
          <div className="relative">
            <ShapeIcon type={shape} className={getShapeColor()} size={28} />
            {isOperator && operatorValue && (
              <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-lg font-bold">
                {operatorValue}
              </span>
            )}
          </div>
        ) : (
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-md bg-gray-100 opacity-30"></div>
        )}
      </div>
    </DroppableZone>
  );
};

export default EquationSlot;
