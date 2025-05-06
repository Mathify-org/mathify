
import React from "react";
import { ShapeType, FeedbackType } from "@/types/puzzleTypes";
import ShapeIcon from "./ShapeIcon";
import Draggable from "@/components/Draggable";

interface DraggableShapeProps {
  type: ShapeType;
  id: string;
  feedback?: FeedbackType;
  isOperator?: boolean;
  operatorValue?: string;
  disabled?: boolean;
}

const DraggableShape: React.FC<DraggableShapeProps> = ({ 
  type, 
  id, 
  feedback,
  isOperator = false,
  operatorValue = "",
  disabled = false
}) => {
  const getFeedbackColor = () => {
    if (!feedback) return "bg-white";
    
    switch (feedback) {
      case "correct":
        return "bg-green-100 border-green-500 text-green-700";
      case "wrong-position":
        return "bg-yellow-100 border-yellow-500 text-yellow-700";
      case "incorrect":
        return "bg-gray-100 border-gray-300 text-gray-500";
      default:
        return "bg-white";
    }
  };

  const getShapeColor = () => {
    if (disabled) return "text-gray-400";
    
    switch (type) {
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
    <Draggable id={id}>
      <div 
        className={`${getFeedbackColor()} border-2 rounded-lg p-2 md:p-3 shadow-sm flex items-center justify-center w-12 h-12 md:w-14 md:h-14 cursor-grab active:cursor-grabbing ${disabled ? 'opacity-50' : ''}`}
      >
        <div className="relative">
          <ShapeIcon type={type} className={`${getShapeColor()}`} size={28} />
          {isOperator && operatorValue && (
            <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-lg font-bold">
              {operatorValue}
            </span>
          )}
        </div>
      </div>
    </Draggable>
  );
};

export default DraggableShape;
