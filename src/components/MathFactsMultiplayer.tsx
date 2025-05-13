
import React, { useEffect, useRef } from "react";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Trophy, Share2, List } from "lucide-react";
import confetti from "canvas-confetti";

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

type MathQuestion = {
  text: string;
  answer: number;
};

type MultiplayerProps = {
  game: MultiplayerGame;
  playerId: string;
  questions: MathQuestion[];
  currentQuestionIndex: number;
  userAnswer: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isGameComplete: boolean;
  feedback: string;
  elapsedTime: number;
  startNewGame: () => void;
  shareResults: () => void;
};

// Format time in MM:SS format
const formatTime = (milliseconds: number | null): string => {
  if (milliseconds === null) return "--:--";
  
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
};

export const MathFactsMultiplayer: React.FC<MultiplayerProps> = ({
  game,
  playerId,
  questions,
  currentQuestionIndex,
  userAnswer,
  handleInputChange,
  isGameComplete,
  feedback,
  elapsedTime,
  startNewGame,
  shareResults
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const confettiRef = useRef(false);
  
  const currentPlayer = game.players.find(p => p.id === playerId);
  const allFinished = game.players.every(p => p.isComplete);
  
  // Focus the input when component mounts
  useEffect(() => {
    if (inputRef.current && !isGameComplete) {
      inputRef.current.focus();
    }
  }, [isGameComplete]);
  
  // Trigger confetti when the game is complete and all players have finished
  useEffect(() => {
    if (isGameComplete && allFinished && !confettiRef.current) {
      // Sort players by completion time
      const sortedPlayers = [...game.players].sort((a, b) => {
        if (a.time === null) return 1;
        if (b.time === null) return -1;
        return a.time - b.time;
      });
      
      const currentPlayerRank = sortedPlayers.findIndex(p => p.id === playerId) + 1;
      
      if (currentPlayerRank === 1) {
        // Trigger colorful confetti for winner
        const colors = ["#8B5CF6", "#0EA5E9", "#F97316", "#D946EF"];
        
        const confettiSettings = {
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        };
        
        confetti({
          ...confettiSettings,
          colors: colors
        });
        
        setTimeout(() => {
          confetti({
            ...confettiSettings,
            colors: colors
          });
        }, 250);
        
        setTimeout(() => {
          confetti({
            ...confettiSettings,
            colors: colors,
            gravity: 1.2
          });
        }, 400);
        
        confettiRef.current = true;
      }
    }
  }, [isGameComplete, allFinished, game.players, playerId]);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-md mx-auto">
        <header className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
            Math Facts Race
          </h1>
          <p className="text-slate-700 mt-1">Multiplayer Game</p>
        </header>
        
        <div className="mb-6">
          <Card className="shadow-md bg-white/90 backdrop-blur mb-4">
            <CardContent className="p-4">
              <h3 className="text-sm font-medium mb-3">Player Progress</h3>
              <div className="space-y-3">
                {game.players.map(player => (
                  <div key={player.id}>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <div className="bg-indigo-200 w-6 h-6 rounded-full flex items-center justify-center mr-2 text-xs">
                          {player.username.charAt(0).toUpperCase()}
                        </div>
                        <span className={player.id === playerId ? "font-medium" : ""}>
                          {player.username} {player.id === playerId ? "(You)" : ""}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs">
                          {player.isComplete ? formatTime(player.time) : `${player.progress}/10`}
                        </span>
                      </div>
                    </div>
                    
                    <div className="relative mt-1 mb-2">
                      <Progress
                        value={(player.progress / questions.length) * 100}
                        className="h-2"
                        indicatorClassName={
                          player.id === playerId 
                            ? "bg-gradient-to-r from-indigo-500 to-violet-500" 
                            : ""
                        }
                      />
                      
                      {player.isComplete && (
                        <div 
                          className="absolute -right-1 -top-1 bg-green-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px]"
                        >
                          ✓
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card className="mb-6 shadow-lg border-0 bg-white/90 backdrop-blur">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="font-semibold text-lg">
                  {!isGameComplete ? "Race Challenge" : "Race Complete!"}
                </CardTitle>
              </div>
              <div className="text-right">
                <span className="font-mono text-xl bg-indigo-100 px-3 py-1 rounded-md">
                  {elapsedTime ? formatTime(elapsedTime) : "00:00"}
                </span>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            {!isGameComplete ? (
              <>
                <div className="mb-6 relative">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <List className="w-4 h-4 mr-2 text-indigo-600" />
                      <span className="text-sm font-medium">
                        Question {currentQuestionIndex + 1} of {questions.length}
                      </span>
                    </div>
                    <span className="text-xs font-medium">
                      {Math.floor((currentQuestionIndex / questions.length) * 100)}%
                    </span>
                  </div>
                  
                  <Progress
                    value={(currentQuestionIndex / questions.length) * 100}
                    className="h-2"
                  />
                </div>
                
                <div className="bg-indigo-50 p-5 rounded-xl text-center mb-6">
                  <p className="text-3xl font-bold mb-1">
                    {questions[currentQuestionIndex]?.text || "Loading..."}
                  </p>
                  <p className="text-sm text-slate-600">Type your answer below</p>
                </div>
                
                <Input
                  ref={inputRef}
                  type="number"
                  placeholder="Enter your answer..."
                  value={userAnswer}
                  onChange={handleInputChange}
                  className="text-center text-xl font-bold py-6"
                  inputMode="numeric"
                  autoFocus
                />
              </>
            ) : (
              <div className="text-center py-4">
                <div className="mb-6">
                  <div className="inline-flex items-center justify-center bg-indigo-100 rounded-full w-20 h-20 mb-4">
                    <Trophy className="w-10 h-10 text-indigo-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feedback}</h3>
                  <p className="text-3xl font-bold text-indigo-700 mb-1">
                    {formatTime(currentPlayer?.time || 0)}
                  </p>
                  <p className="text-slate-600 text-sm">
                    You completed all 10 questions
                  </p>
                </div>
                
                {allFinished && (
                  <div className="mb-6">
                    <h3 className="font-medium mb-3">Final Results</h3>
                    <div className="space-y-2">
                      {[...game.players]
                        .sort((a, b) => {
                          if (a.time === null) return 1;
                          if (b.time === null) return -1;
                          return a.time - b.time;
                        })
                        .map((player, index) => (
                          <div 
                            key={player.id} 
                            className={`flex items-center justify-between p-3 rounded-lg ${
                              player.id === playerId 
                                ? "bg-indigo-100 border-2 border-indigo-300" 
                                : "bg-slate-50"
                            }`}
                          >
                            <div className="flex items-center">
                              <div className={`
                                w-7 h-7 rounded-full flex items-center justify-center mr-3 text-sm font-bold
                                ${index === 0 ? "bg-yellow-200 text-yellow-800" : 
                                  index === 1 ? "bg-gray-200 text-gray-800" :
                                  index === 2 ? "bg-amber-200 text-amber-800" : "bg-slate-200 text-slate-800"}
                              `}>
                                {index + 1}
                              </div>
                              <span className="font-medium">{player.username}</span>
                              {player.id === playerId && (
                                <span className="ml-2 text-xs bg-indigo-100 px-2 py-0.5 rounded-full">
                                  You
                                </span>
                              )}
                            </div>
                            <span className="text-right font-mono">
                              {formatTime(player.time)}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
                
                <div className="flex space-x-3">
                  <Button 
                    onClick={startNewGame} 
                    className="flex-1"
                    variant="outline"
                  >
                    New Game
                  </Button>
                  <Button 
                    onClick={shareResults}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                  >
                    <Share2 className="w-4 h-4 mr-2" /> Share
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
          
          <CardFooter className={`${isGameComplete ? "hidden" : "block"} pt-0`}>
            <div className="w-full text-center">
              <p className="text-sm text-slate-600 mt-2">
                Type the answer and press Enter to continue
              </p>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
