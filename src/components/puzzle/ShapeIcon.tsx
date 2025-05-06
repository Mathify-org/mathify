
import React from "react";
import { ShapeType } from "@/types/puzzleTypes";
import { Circle, Square, Triangle, Hexagon, Clock, Star } from "lucide-react";

interface ShapeIconProps {
  type: ShapeType;
  className?: string;
  size?: number;
}

const ShapeIcon: React.FC<ShapeIconProps> = ({ type, className = "", size = 24 }) => {
  switch (type) {
    case "circle":
      return <Circle className={className} size={size} />;
    case "square":
      return <Square className={className} size={size} />;
    case "triangle":
      return <Triangle className={className} size={size} />;
    case "hexagon":
      return <Hexagon className={className} size={size} />;
    case "clock":
      return <Clock className={className} size={size} />;
    case "star":
      return <Star className={className} size={size} />;
    default:
      return null;
  }
};

export default ShapeIcon;
