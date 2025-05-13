
import React, { useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Users, Link, Clock } from "lucide-react";
import { toast } from "sonner";

// Types
type Player = {
  id: string;
  username: string;
  progress: number;
  time: number | null;
  isComplete: boolean;
};

type MultiplayerGame = {
  gameId: string;
  hostId: string;
  players: Player[];
  maxPlayers: number;
  questions: any[];
  isStarted: boolean;
  startTime: number | null;
};

type WaitingRoomProps = {
  game: MultiplayerGame;
  playerId: string;
  onStart: () => void;
  countdown: number;
  isCountingDown: boolean;
};

export const MathFactsWaitingRoom: React.FC<WaitingRoomProps> = ({ 
  game, 
  playerId, 
  onStart, 
  countdown, 
  isCountingDown 
}) => {
  const isHost = game.hostId === playerId;
  const shareableUrl = `${window.location.origin}/math-facts/${game.gameId}`;
  
  // Simulate players joining
  useEffect(() => {
    if (!isHost && game.players.length < game.maxPlayers) {
      const joinInterval = setInterval(() => {
        if (game.players.length < game.maxPlayers && Math.random() > 0.6) {
          const simNames = ["Alex", "Sam", "Jordan", "Taylor", "Riley", "Casey"];
          const randomName = simNames[Math.floor(Math.random() * simNames.length)];
          
          // Add a simulated player
          game.players.push({
            id: `sim-${Math.random().toString(36).substring(2, 7)}`,
            username: randomName,
            progress: 0,
            time: null,
            isComplete: false
          });
          
          toast.info(`${randomName} joined the game`);
        }
      }, 2000);
      
      return () => clearInterval(joinInterval);
    }
    
    return () => {};
  }, [game, isHost]);
  
  const copyGameLink = () => {
    navigator.clipboard.writeText(shareableUrl).then(() => {
      toast.success("Game link copied to clipboard!");
    }).catch(() => {
      toast.error("Could not copy game link");
    });
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-md mx-auto">
        <header className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
            Math Facts Race
          </h1>
          <p className="text-slate-700 mt-2">Multiplayer Game</p>
        </header>
        
        <Card className="mb-6 shadow-lg border-0 bg-white/90 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Waiting Room</span>
              <span className="text-sm bg-indigo-100 px-3 py-1 rounded-md">
                Game ID: {game.gameId}
              </span>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {isCountingDown ? (
              <div className="text-center py-6">
                <div className="animate-pulse inline-flex items-center justify-center bg-indigo-100 rounded-full w-24 h-24 mb-4">
                  <p className="text-4xl font-bold text-indigo-600">{countdown}</p>
                </div>
                <h3 className="text-xl font-bold mb-2">Starting game...</h3>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Users className="w-5 h-5 text-indigo-600 mr-2" />
                    <p className="font-medium">
                      Players {game.players.length} / {game.maxPlayers}
                    </p>
                  </div>
                  
                  <Progress 
                    value={(game.players.length / game.maxPlayers) * 100}
                    className="w-20 h-2"
                  />
                </div>
                
                <ul className="space-y-2">
                  {game.players.map(player => (
                    <li 
                      key={player.id} 
                      className="flex items-center justify-between bg-indigo-50 rounded-lg p-3"
                    >
                      <div className="flex items-center">
                        <div className="bg-indigo-200 w-8 h-8 rounded-full flex items-center justify-center mr-3">
                          {player.username.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium">
                          {player.username} {player.id === game.hostId && "(Host)"}
                          {player.id === playerId && player.id !== game.hostId && "(You)"}
                        </span>
                      </div>
                      {player.id === playerId && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                          You
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
                
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                  <h4 className="text-sm font-medium mb-2 flex items-center">
                    <Link className="w-4 h-4 mr-1" /> Game Link
                  </h4>
                  <div className="flex space-x-2">
                    <div className="bg-white px-3 py-2 rounded border flex-1 text-sm truncate">
                      {shareableUrl}
                    </div>
                    <Button size="sm" onClick={copyGameLink} className="bg-indigo-600">
                      Copy
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
          
          <CardFooter className="flex justify-between">
            {isHost && !isCountingDown && game.players.length >= 2 && (
              <Button 
                onClick={onStart}
                className="w-full bg-indigo-600 hover:bg-indigo-700"
              >
                <Clock className="w-4 h-4 mr-2" />
                Start Game
              </Button>
            )}
            
            {isHost && !isCountingDown && game.players.length < 2 && (
              <div className="w-full text-center text-slate-600 text-sm">
                <p>Waiting for more players to join...</p>
              </div>
            )}
            
            {!isHost && !isCountingDown && (
              <div className="w-full text-center text-slate-600 text-sm">
                <p>Waiting for host to start the game...</p>
              </div>
            )}
            
            {isCountingDown && (
              <div className="w-full text-center text-slate-600 text-sm">
                <p>Get ready!</p>
              </div>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
