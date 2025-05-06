
import React from "react";
import { NumberType, OperationType, FeedbackType } from "@/types/puzzleTypes";
import Draggable from "@/components/Draggable";

interface DraggableNumberProps {
  value: NumberType | OperationType;
  id: string;
  feedback?: FeedbackType;
  isOperator?: boolean;
  disabled?: boolean;
}

const DraggableNumber: React.FC<DraggableNumberProps> = ({ 
  value, 
  id, 
  feedback,
  isOperator = false,
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

  const getValueColor = () => {
    if (disabled) return "text-gray-400";
    
    if (isOperator) {
      switch (value) {
        case "+":
          return "text-blue-500";
        case "-":
          return "text-red-500";
        case "*":
          return "text-green-500";
        case "/":
          return "text-purple-500";
        default:
          return "text-gray-700";
      }
    }
    
    // For numbers, use a sequential color scheme
    const numberColors = [
      "text-gray-800", // Not used (index 0)
      "text-indigo-600",
      "text-blue-600",
      "text-cyan-600",
      "text-teal-600", 
      "text-green-600",
      "text-amber-600",
      "text-orange-600", 
      "text-red-600",
      "text-pink-600"
    ];
    
    return numberColors[value as number] || "text-gray-700";
  };

  return (
    <Draggable id={id}>
      <div 
        className={`${getFeedbackColor()} border-2 rounded-lg p-2 md:p-3 shadow-sm flex items-center justify-center w-12 h-12 md:w-14 md:h-14 cursor-grab active:cursor-grabbing ${disabled ? 'opacity-50' : ''}`}
      >
        <span className={`text-xl md:text-2xl font-bold ${getValueColor()}`}>
          {value}
        </span>
      </div>
    </Draggable>
  );
};

export default DraggableNumber;
