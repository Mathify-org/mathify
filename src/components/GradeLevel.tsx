
import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { Link } from "react-router-dom";

interface Game {
  id: string;
  title: string;
  description: string;
  path: string;
}

interface GradeLevelProps {
  title: string;
  ageRange: string;
  description: string;
  games: Game[];
  gradient: string;
}

const GradeLevel: React.FC<GradeLevelProps> = ({
  title,
  ageRange,
  description,
  games,
  gradient,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isMobile = useIsMobile();
  
  return (
    <div className={`rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl ${isExpanded ? 'ring-2 ring-purple-400' : ''}`}>
      <div 
        className={`${gradient} p-6 cursor-pointer`} 
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-xl md:text-2xl font-bold text-white">{title}</h3>
            <p className="text-white/90 text-sm md:text-base">{ageRange}</p>
          </div>
          <div className="bg-white/20 p-2 rounded-full">
            {isExpanded ? <ChevronUp className="text-white" /> : <ChevronDown className="text-white" />}
          </div>
        </div>
        <p className="mt-2 text-white/80 text-sm md:text-base">{description}</p>
      </div>
      
      {isExpanded && (
        <div className="bg-white p-4 animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {games.map((game) => (
              <Link to={game.path} key={game.id} className="block">
                <div className="border border-gray-200 rounded-lg p-4 hover:bg-purple-50 transition-colors">
                  <h4 className="font-bold text-slate-800">{game.title}</h4>
                  <p className="text-slate-600 text-sm mt-1">{game.description}</p>
                  <Button 
                    variant="ghost" 
                    size={isMobile ? "sm" : "default"} 
                    className="mt-3 text-purple-600"
                  >
                    Play Now
                  </Button>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GradeLevel;
