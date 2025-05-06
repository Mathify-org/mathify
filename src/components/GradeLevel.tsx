
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
        className={`${gradient} p-4 md:p-6 cursor-pointer`} 
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg md:text-2xl font-bold text-white">{title}</h3>
            <p className="text-white/90 text-xs md:text-base">{ageRange}</p>
          </div>
          <div className="bg-white/20 p-2 rounded-full">
            {isExpanded ? <ChevronUp className="text-white h-4 w-4 md:h-5 md:w-5" /> : <ChevronDown className="text-white h-4 w-4 md:h-5 md:w-5" />}
          </div>
        </div>
        <p className="mt-2 text-white/80 text-xs md:text-base line-clamp-3">{description}</p>
      </div>
      
      {isExpanded && (
        <div className="bg-white p-3 md:p-4 animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            {games.map((game) => (
              <Link to={game.path} key={game.id} className="block">
                <div className="border border-gray-200 rounded-lg p-3 md:p-4 hover:bg-purple-50 transition-colors">
                  <h4 className="font-bold text-slate-800 text-sm md:text-base">{game.title}</h4>
                  <p className="text-slate-600 text-xs md:text-sm mt-1 line-clamp-2">{game.description}</p>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="mt-2 text-purple-600 px-2 py-1 h-auto text-xs md:text-sm"
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
