
import React, { ReactNode } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Lock } from "lucide-react";
import { GameMode } from "@/types/fractionFrenzy";

type GameModeCardProps = {
  mode: {
    id: GameMode;
    title: string;
    description: string;
    icon: string;
    color: string;
  };
  isSelected: boolean;
  onSelect: () => void;
  disabled?: boolean;
  lockedMessage?: string;
};

const GameModeCard = ({
  mode,
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
          <div className={`p-3 bg-gradient-to-r ${mode.color} rounded-xl shadow-md text-2xl`}>
            {mode.icon}
          </div>
          <h3 className="text-xl font-bold">{mode.title}</h3>
        </div>
        
        <p className="text-slate-600">{mode.description}</p>
        
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
