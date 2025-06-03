
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Lock } from "lucide-react";
import { GameMode } from "@/types/fractionFrenzy";

type GameModeCardProps = {
  id: GameMode;
  title: string;
  description: string;
  icon: string;
  color: string;
  isSelected: boolean;
  onSelect: () => void;
  disabled?: boolean;
  lockedMessage?: string;
};

const GameModeCard = ({
  id,
  title,
  description,
  icon,
  color,
  isSelected,
  onSelect,
  disabled = false,
  lockedMessage,
}: GameModeCardProps) => {
  return (
    <Card className={cn(
      "overflow-hidden transition-all duration-300 hover:shadow-xl cursor-pointer",
      isSelected && "ring-2 ring-blue-500", 
      disabled ? "opacity-80" : "hover:scale-105"
    )} onClick={onSelect}>
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center gap-4">
          <div className={`p-3 bg-gradient-to-r ${color} rounded-xl shadow-md text-2xl`}>
            {icon}
          </div>
          <h3 className="text-xl font-bold">{title}</h3>
        </div>
        
        <p className="text-slate-600">{description}</p>
        
        {disabled && lockedMessage && (
          <div className="flex items-center gap-2 text-amber-600">
            <Lock className="h-4 w-4" />
            <span className="text-sm">{lockedMessage}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GameModeCard;
