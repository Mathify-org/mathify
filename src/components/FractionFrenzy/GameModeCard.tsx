
import React, { ReactNode } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Lock } from "lucide-react";

type GameModeCardProps = {
  title: string;
  icon: ReactNode;
  description: string;
  onClick: () => void;
  disabled?: boolean;
  lockedMessage?: string;
};

const GameModeCard = ({
  title,
  icon,
  description,
  onClick,
  disabled = false,
  lockedMessage,
}: GameModeCardProps) => {
  return (
    <Card className={cn(
      "overflow-hidden transition-all duration-300 hover:shadow-xl", 
      disabled ? "opacity-80" : "hover:scale-105"
    )}>
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white rounded-xl shadow-md">
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
      
      <CardFooter className="p-6 pt-0">
        <Button 
          className="w-full"
          onClick={onClick}
          disabled={disabled}
        >
          {disabled ? "Locked" : "Play"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default GameModeCard;
