import React from "react";
import { cn } from "@/lib/utils";
import { FractionData, Theme } from "@/types/fractionFrenzy";

type FractionVisualProps = {
  fraction: FractionData | null;
  theme: Theme;
  size?: "small" | "medium" | "large";
};

const FractionVisual = ({ fraction, theme, size = "medium" }: FractionVisualProps) => {
  if (!fraction) return null;
  
  const { numerator, denominator } = fraction;
  
  // Size classes
  const sizeClasses = {
    small: "w-16 h-16",
    medium: "w-28 h-28 md:w-32 md:h-32",
    large: "w-36 h-36 md:w-40 md:h-40"
  };
  
  // Create a grid of cells based on the theme
  const renderFractionVisual = () => {
    switch (theme) {
      case "pizza":
        return renderPizzaSlices();
      case "pie":
        return renderPieChart(); 
      case "chocolate":
        return renderChocolateBar();
      case "liquid":
        return renderLiquidCup();
      case "grid":
      default:
        return renderGrid();
    }
  };
  
  // Pizza visualization - removed pepperoni dots
  const renderPizzaSlices = () => {
    const slices = [];
    const sliceAngle = 360 / denominator;
    
    for (let i = 0; i < denominator; i++) {
      const startAngle = i * sliceAngle;
      const endAngle = (i + 1) * sliceAngle;
      const isHighlighted = i < numerator;
      
      const startRad = (startAngle - 90) * Math.PI / 180;
      const endRad = (endAngle - 90) * Math.PI / 180;
      
      const x1 = 50 + 40 * Math.cos(startRad);
      const y1 = 50 + 40 * Math.sin(startRad);
      const x2 = 50 + 40 * Math.cos(endRad);
      const y2 = 50 + 40 * Math.sin(endRad);
      
      const largeArc = sliceAngle > 180 ? 1 : 0;
      
      slices.push(
        <path
          key={i}
          d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`}
          fill={isHighlighted ? "#f97316" : "#fed7aa"}
          stroke="#783f04"
          strokeWidth="1"
        />
      );
    }
    
    return (
      <svg viewBox="0 0 100 100" className={cn("rounded-full", sizeClasses[size])}>
        <circle cx="50" cy="50" r="45" fill="#fef3c7" stroke="#783f04" strokeWidth="1" />
        {slices}
      </svg>
    );
  };
  
  // Pie chart visualization - Removing unnecessary dots
  const renderPieChart = () => {
    const slices = [];
    const sliceAngle = 360 / denominator;
    
    for (let i = 0; i < denominator; i++) {
      const startAngle = i * sliceAngle;
      const endAngle = (i + 1) * sliceAngle;
      const isHighlighted = i < numerator;
      
      const startRad = (startAngle - 90) * Math.PI / 180;
      const endRad = (endAngle - 90) * Math.PI / 180;
      
      const x1 = 50 + 40 * Math.cos(startRad);
      const y1 = 50 + 40 * Math.sin(startRad);
      const x2 = 50 + 40 * Math.cos(endRad);
      const y2 = 50 + 40 * Math.sin(endRad);
      
      const largeArc = sliceAngle > 180 ? 1 : 0;
      
      slices.push(
        <path
          key={i}
          d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`}
          fill={isHighlighted ? "#9333ea" : "#e9d5ff"}
          stroke="#4c1d95"
          strokeWidth="1"
        />
      );
    }
    
    return (
      <svg viewBox="0 0 100 100" className={cn("rounded-full", sizeClasses[size])}>
        <circle cx="50" cy="50" r="45" fill="#f5f3ff" stroke="#4c1d95" strokeWidth="1" />
        {slices}
      </svg>
    );
  };
  
  // Chocolate bar visualization
  const renderChocolateBar = () => {
    const rows = Math.ceil(Math.sqrt(denominator));
    const cols = Math.ceil(denominator / rows);
    const cellWidth = 90 / cols;
    const cellHeight = 90 / rows;
    
    const cells = [];
    let count = 0;
    
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (count < denominator) {
          const isHighlighted = count < numerator;
          
          cells.push(
            <rect
              key={`${i}-${j}`}
              x={5 + j * cellWidth}
              y={5 + i * cellHeight}
              width={cellWidth - 2}
              height={cellHeight - 2}
              fill={isHighlighted ? "#854d0e" : "#d4a276"}
              stroke="#422006"
              strokeWidth="1"
              rx="2"
              ry="2"
            />
          );
          count++;
        }
      }
    }
    
    return (
      <svg viewBox="0 0 100 100" className={cn(sizeClasses[size])}>
        <rect x="3" y="3" width="94" height="94" fill="#422006" rx="4" ry="4" />
        {cells}
      </svg>
    );
  };
  
  // Liquid cup visualization
  const renderLiquidCup = () => {
    const cupHeight = 80;
    const liquidHeight = (numerator / denominator) * cupHeight;
    const gradientId = `liquid-gradient-${numerator}-${denominator}`;
    
    return (
      <svg viewBox="0 0 100 100" className={cn(sizeClasses[size])}>
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
        </defs>
        
        {/* Cup */}
        <path
          d="M 20 20 L 30 90 L 70 90 L 80 20 Z"
          fill="none"
          stroke="#94a3b8"
          strokeWidth="2"
        />
        
        {/* Cup divisions */}
        {[...Array(denominator)].map((_, i) => {
          const y = 90 - (i + 1) * (cupHeight / denominator);
          return (
            <line
              key={i}
              x1="30"
              y1={y}
              x2="70"
              y2={y}
              stroke="#94a3b8"
              strokeWidth="1"
              strokeDasharray="2"
            />
          );
        })}
        
        {/* Liquid */}
        <path
          d={`M 30 90 L 30 ${90 - liquidHeight} L 70 ${90 - liquidHeight} L 70 90 Z`}
          fill={`url(#${gradientId})`}
          opacity="0.8"
        />
        
        {/* Glass highlights */}
        <path
          d="M 30 30 L 33 33 L 33 87 L 30 90"
          fill="white"
          opacity="0.3"
        />
      </svg>
    );
  };
  
  // Grid visualization
  const renderGrid = () => {
    const rows = Math.ceil(Math.sqrt(denominator));
    const cols = Math.ceil(denominator / rows);
    const cellWidth = 90 / cols;
    const cellHeight = 90 / rows;
    
    const cells = [];
    let count = 0;
    
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (count < denominator) {
          const isHighlighted = count < numerator;
          
          cells.push(
            <rect
              key={`${i}-${j}`}
              x={5 + j * cellWidth}
              y={5 + i * cellHeight}
              width={cellWidth - 2}
              height={cellHeight - 2}
              fill={isHighlighted ? "#4f46e5" : "#e0e7ff"}
              stroke="#312e81"
              strokeWidth="0.5"
              rx="2"
              ry="2"
            />
          );
          count++;
        }
      }
    }
    
    return (
      <svg viewBox="0 0 100 100" className={cn("border border-slate-300 rounded-lg", sizeClasses[size])}>
        <rect x="0" y="0" width="100" height="100" fill="#f8fafc" />
        {cells}
      </svg>
    );
  };
  
  return renderFractionVisual();
};

export default FractionVisual;
