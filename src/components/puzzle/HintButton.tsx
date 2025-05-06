
import React from "react";
import { Button } from "@/components/ui/button";
import { LightbulbIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface HintButtonProps {
  hintsUsed: number;
  maxHints: number;
  onUseHint: () => void;
}

const HintButton: React.FC<HintButtonProps> = ({
  hintsUsed,
  maxHints,
  onUseHint
}) => {
  const { toast } = useToast();
  
  const handleUseHint = () => {
    if (hintsUsed < maxHints) {
      onUseHint();
    } else {
      toast({
        title: "No hints left",
        description: "You've used all your hints for today's puzzle.",
      });
    }
  };

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={handleUseHint}
      disabled={hintsUsed >= maxHints}
      className="flex items-center gap-2 text-amber-600 border-amber-300"
    >
      <LightbulbIcon size={16} />
      Hint {hintsUsed}/{maxHints}
    </Button>
  );
};

export default HintButton;
