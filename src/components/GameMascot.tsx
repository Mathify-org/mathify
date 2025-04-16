
import { Worm } from "lucide-react";

interface GameMascotProps {
  message: string;
}

const GameMascot = ({ message }: GameMascotProps) => {
  return (
    <div className="flex items-center gap-4 p-4 bg-accent rounded-lg animate-bounce">
      <Worm className="h-12 w-12 text-soil" />
      <div className="text-lg font-bold">{message}</div>
    </div>
  );
};

export default GameMascot;
