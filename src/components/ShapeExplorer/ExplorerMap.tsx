
import React from "react";
import { Circle, Hexagon, Square, Triangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Position {
  x: number;
  y: number;
}

interface Challenge {
  id: string;
  name: string;
  type: string;
  description: string;
  completed: boolean;
  stars: number;
}

interface Island {
  id: string;
  name: string;
  description: string;
  color: string;
  position: Position;
  unlocked: boolean;
  completed: boolean;
  stars: number;
  icon: string;
  challenges: Challenge[];
}

interface ExplorerMapProps {
  islands: Island[];
  onIslandSelect: (islandId: string) => void;
}

const ExplorerMap: React.FC<ExplorerMapProps> = ({ islands, onIslandSelect }) => {
  const getIslandIcon = (icon: string, className: string) => {
    switch (icon) {
      case "hexagon":
        return <Hexagon className={className} />;
      case "triangle":
        return <Triangle className={className} />;
      case "circle":
        return <Circle className={className} />;
      case "square-dashed":
        return <Square className={className} />;
      default:
        return <Square className={className} />;
    }
  };

  return (
    <div className="relative w-full h-[500px] bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl shadow-inner overflow-hidden">
      {/* Map decorations */}
      <div className="absolute top-1/4 left-1/4 w-16 h-16 bg-blue-200 rounded-full opacity-30"></div>
      <div className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-cyan-200 rounded-full opacity-40"></div>
      <div className="absolute top-1/2 right-1/3 w-12 h-12 bg-indigo-200 rounded-full opacity-30"></div>
      
      {/* Map connections */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {islands.map((island, index) => {
          // Only draw lines between unlocked islands
          if (!island.unlocked) return null;
          
          return islands.filter(i => i.unlocked).map((otherIsland, otherIndex) => {
            // Avoid duplicate lines and self-connections
            if (otherIndex <= index) return null;
            
            // Draw connections
            return (
              <line
                key={`${island.id}-${otherIsland.id}`}
                x1={`${island.position.x}%`}
                y1={`${island.position.y}%`}
                x2={`${otherIsland.position.x}%`}
                y2={`${otherIsland.position.y}%`}
                stroke={island.completed && otherIsland.completed ? "#22c55e" : "#e2e8f0"}
                strokeWidth="3"
                strokeDasharray={island.completed && otherIsland.completed ? "0" : "5,5"}
              />
            );
          });
        })}
      </svg>
      
      {/* Islands */}
      {islands.map((island) => (
        <div
          key={island.id}
          className={cn(
            "absolute transform -translate-x-1/2 -translate-y-1/2 transition-all",
            island.unlocked ? "cursor-pointer scale-100 opacity-100" : "opacity-40 scale-90",
            island.completed ? "animate-pulse" : ""
          )}
          style={{
            left: `${island.position.x}%`,
            top: `${island.position.y}%`,
          }}
          onClick={() => island.unlocked && onIslandSelect(island.id)}
        >
          <div 
            className={cn(
              "w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center text-white transition-all",
              island.unlocked ? island.color : "bg-gray-400",
              island.unlocked && "shadow-lg hover:shadow-xl hover:scale-110"
            )}
          >
            {getIslandIcon(island.icon, "w-8 h-8 md:w-10 md:h-10")}
          </div>
          <div className={cn(
            "absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-xs md:text-sm font-bold bg-white/90 px-2 py-1 rounded-md shadow",
            island.unlocked ? "text-slate-800" : "text-slate-500"
          )}>
            {island.name}
          </div>
          
          {/* Progress indicator */}
          {island.unlocked && (
            <div className="absolute -top-1 -right-1 bg-white rounded-full w-5 h-5 flex items-center justify-center shadow">
              <div 
                className={cn(
                  "w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold",
                  island.completed ? "bg-green-500 text-white" : "bg-blue-100 text-blue-800"
                )}
              >
                {island.completed ? "✓" : `${island.stars}`}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ExplorerMap;
