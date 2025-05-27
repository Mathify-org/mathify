
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Users, Trophy, Clock, ArrowLeft, Crown } from 'lucide-react';
import { multiplayerService, GameRoom, Player } from '@/services/multiplayerService';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';

interface MultiplayerGameProps {
  roomId: string;
  onGameEnd: () => void;
  onLeaveRoom: () => void;
}

type Operation = "+" | "-" | "*" | "/";
type Problem = {
  num1: number;
  num2: number;
  operation: Operation;
  answer: number;
  options: number[];
};

const MultiplayerGame: React.FC<MultiplayerGameProps> = ({ roomId, onGameEnd, onLeaveRoom }) => {
  const [room, setRoom] = useState<GameRoom | null>(null);
  const [gameState, setGameState] = useState<"waiting" | "countdown" | "playing" | "finished">("waiting");
  const [currentProblem, setCurrentProblem] = useState<Problem | null>(null);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [countdown, setCountdown] = useState(3);
  const gameTimerRef = useRef<NodeJS.Timeout | null>(null);
  const pollTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  const playerId = multiplayerService.getPlayerId();

  // Poll for room updates
  useEffect(() => {
    const pollRoom = () => {
      const updatedRoom = multiplayerService.getRoom(roomId);
      if (updatedRoom) {
        setRoom(updatedRoom);
        
        // Auto-start game when both players are ready
        if (updatedRoom.status === 'waiting' && updatedRoom.guest && gameState === 'waiting') {
          startCountdown();
        }
      } else {
        toast.error('Room no longer exists');
        onLeaveRoom();
      }
    };

    pollRoom();
    pollTimerRef.current = setInterval(pollRoom, 1000);
    
    return () => {
      if (pollTimerRef.current) clearInterval(pollTimerRef.current);
    };
  }, [roomId, gameState]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (gameTimerRef.current) clearInterval(gameTimerRef.current);
      if (pollTimerRef.current) clearInterval(pollTimerRef.current);
    };
  }, []);

  const startCountdown = () => {
    setGameState("countdown");
    let count = 3;
    setCountdown(count);
    
    const countdownInterval = setInterval(() => {
      count--;
      setCountdown(count);
      
      if (count <= 0) {
        clearInterval(countdownInterval);
        startGame();
      }
    }, 1000);
  };

  const startGame = () => {
    setGameState("playing");
    setTimeLeft(60);
    multiplayerService.startGame(roomId);
    nextQuestion();
    
    // Start game timer
    gameTimerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const generateProblem = (): Problem => {
    const operations: Operation[] = ["+", "-", "*", "/"];
    const operation = operations[Math.floor(Math.random() * operations.length)];
    
    let num1, num2, answer;
    
    switch (operation) {
      case "+":
        num1 = Math.floor(Math.random() * 50) + 1;
        num2 = Math.floor(Math.random() * 50) + 1;
        answer = num1 + num2;
        break;
      case "-":
        num1 = Math.floor(Math.random() * 50) + 20;
        num2 = Math.floor(Math.random() * num1);
        answer = num1 - num2;
        break;
      case "*":
        num1 = Math.floor(Math.random() * 12) + 1;
        num2 = Math.floor(Math.random() * 12) + 1;
        answer = num1 * num2;
        break;
      case "/":
        num2 = Math.floor(Math.random() * 11) + 2;
        answer = Math.floor(Math.random() * 12) + 1;
        num1 = num2 * answer;
        break;
      default:
        num1 = 1;
        num2 = 1;
        answer = 2;
    }
    
    // Generate options
    const options = [answer];
    while (options.length < 4) {
      const offset = Math.floor(Math.random() * 20) - 10;
      const option = answer + (offset === 0 ? 1 : offset);
      if (option > 0 && !options.includes(option)) {
        options.push(option);
      }
    }
    
    return { num1, num2, operation, answer, options: options.sort(() => Math.random() - 0.5) };
  };

  const nextQuestion = () => {
    const problem = generateProblem();
    setCurrentProblem(problem);
  };

  const handleAnswer = (selectedAnswer: number) => {
    if (!currentProblem || gameState !== "playing") return;
    
    const isCorrect = selectedAnswer === currentProblem.answer;
    const newAnsweredQuestions = answeredQuestions + 1;
    const newScore = isCorrect ? score + 10 : score;
    
    setScore(newScore);
    setAnsweredQuestions(newAnsweredQuestions);
    
    // Update score in room
    multiplayerService.updatePlayerScore(roomId, newScore, newAnsweredQuestions);
    
    if (isCorrect) {
      toast.success("Correct! +10 points");
    } else {
      toast.error(`Wrong! Answer was ${currentProblem.answer}`);
    }
    
    // Next question after short delay
    setTimeout(() => {
      nextQuestion();
    }, 1000);
  };

  const endGame = () => {
    setGameState("finished");
    if (gameTimerRef.current) clearInterval(gameTimerRef.current);
    multiplayerService.endGame(roomId);
    
    // Check if we won
    if (room) {
      const opponent = room.host.id === playerId ? room.guest : room.host;
      if (opponent && score > opponent.score) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    }
  };

  const handleLeaveRoom = () => {
    multiplayerService.leaveRoom(roomId);
    onLeaveRoom();
  };

  if (!room) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  const opponent = room.host.id === playerId ? room.guest : room.host;
  const isHost = room.host.id === playerId;

  if (gameState === "waiting") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#E5DEFF] to-[#FEF7CD] flex flex-col items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg border-none bg-white/90">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Users className="h-6 w-6" />
              Waiting for Players
            </CardTitle>
            <CardDescription>Room: {room.name}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                <span className="font-medium">{room.host.name}</span>
                {isHost && <Crown className="h-4 w-4 text-yellow-500" />}
                <Badge variant="secondary">Host</Badge>
              </div>
              {opponent ? (
                <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                  <span className="font-medium">{opponent.name}</span>
                  <Badge variant="secondary">Guest</Badge>
                </div>
              ) : (
                <div className="p-2 bg-gray-50 rounded text-center text-gray-500">
                  Waiting for another player...
                </div>
              )}
            </div>
            
            {opponent && (
              <div className="text-center text-green-600 font-medium">
                Starting game soon...
              </div>
            )}
            
            <Button onClick={handleLeaveRoom} variant="outline" className="w-full">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Leave Room
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (gameState === "countdown") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#E5DEFF] to-[#FEF7CD] flex items-center justify-center">
        <div className="text-center">
          <div className="text-8xl font-bold text-purple-600 mb-4">
            {countdown > 0 ? countdown : "GO!"}
          </div>
          <p className="text-xl text-gray-600">Get ready to compete!</p>
        </div>
      </div>
    );
  }

  if (gameState === "finished") {
    const myScore = score;
    const opponentScore = opponent?.score || 0;
    const winner = myScore > opponentScore ? "You Win!" : myScore < opponentScore ? "You Lost!" : "It's a Tie!";
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#E5DEFF] to-[#FEF7CD] flex flex-col items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg border-none bg-white/90">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">{winner}</CardTitle>
            <CardDescription>Game Over</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className={`flex items-center justify-between p-3 rounded ${myScore >= opponentScore ? 'bg-green-50 border-2 border-green-200' : 'bg-gray-50'}`}>
                <span className="font-medium">You</span>
                <div className="text-right">
                  <div className="text-lg font-bold">{myScore} pts</div>
                  <div className="text-sm text-gray-600">{answeredQuestions} questions</div>
                </div>
              </div>
              {opponent && (
                <div className={`flex items-center justify-between p-3 rounded ${opponentScore > myScore ? 'bg-green-50 border-2 border-green-200' : 'bg-gray-50'}`}>
                  <span className="font-medium">{opponent.name}</span>
                  <div className="text-right">
                    <div className="text-lg font-bold">{opponentScore} pts</div>
                    <div className="text-sm text-gray-600">{opponent.answeredQuestions} questions</div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex gap-2">
              <Button onClick={onGameEnd} className="flex-1">
                Play Again
              </Button>
              <Button onClick={handleLeaveRoom} variant="outline" className="flex-1">
                Leave Room
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E5DEFF] to-[#FEF7CD] flex flex-col p-4">
      {/* Game HUD */}
      <div className="flex justify-between items-center mb-4">
        <Card className="p-3">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span className="font-bold text-lg">{timeLeft}s</span>
          </div>
        </Card>
        
        <div className="flex gap-4">
          <Card className="p-3 text-center">
            <div className="text-sm text-gray-600">You</div>
            <div className="font-bold text-lg">{score}</div>
          </Card>
          {opponent && (
            <Card className="p-3 text-center">
              <div className="text-sm text-gray-600">{opponent.name}</div>
              <div className="font-bold text-lg">{opponent.score}</div>
            </Card>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-6">
        <Progress value={(timeLeft / 60) * 100} className="h-2" />
      </div>

      {/* Current problem */}
      {currentProblem && (
        <Card className="flex-1 flex flex-col items-center justify-center">
          <CardContent className="text-center p-8">
            <div className="text-4xl font-bold mb-8">
              {currentProblem.num1} {currentProblem.operation} {currentProblem.num2} = ?
            </div>
            
            <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
              {currentProblem.options.map((option, index) => (
                <Button
                  key={index}
                  onClick={() => handleAnswer(option)}
                  className="h-16 text-xl font-bold"
                  variant="outline"
                >
                  {option}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MultiplayerGame;
