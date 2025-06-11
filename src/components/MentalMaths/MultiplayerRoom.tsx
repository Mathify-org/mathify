
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Users, Crown, Play, LogOut, Timer, Trophy } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { MultiplayerGameService } from "@/services/multiplayerGameService";
import type { GameRoom, GamePlayer, GameQuestion, MultiplayerGameState } from "@/types/multiplayer";
import { toast } from "sonner";
import confetti from "canvas-confetti";

interface MultiplayerRoomProps {
  roomId: string;
  onLeaveRoom: () => void;
  onGameComplete: (finalScores: GamePlayer[]) => void;
}

const MultiplayerRoom: React.FC<MultiplayerRoomProps> = ({ roomId, onLeaveRoom, onGameComplete }) => {
  const { user } = useAuth();
  const [gameState, setGameState] = useState<MultiplayerGameState>({
    room: null,
    players: [],
    currentQuestion: null,
    answers: [],
    timeLeft: 12,
    questionNumber: 0,
    totalQuestions: 10
  });
  const [userAnswer, setUserAnswer] = useState<number | null>(null);
  const [gameStartTime, setGameStartTime] = useState<number>(0);
  const [channel, setChannel] = useState<any>(null);

  useEffect(() => {
    loadRoomData();
    setupRealtimeSubscription();

    return () => {
      if (channel) {
        channel.unsubscribe();
      }
    };
  }, [roomId]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (gameState.room?.status === 'in_progress' && gameState.timeLeft > 0 && !userAnswer) {
      timer = setInterval(() => {
        setGameState(prev => ({
          ...prev,
          timeLeft: Math.max(0, prev.timeLeft - 0.1)
        }));
      }, 100);
    } else if (gameState.timeLeft <= 0 && gameState.currentQuestion && !userAnswer) {
      // Auto-submit timeout
      handleAnswer(-1); // Invalid answer
    }

    return () => clearInterval(timer);
  }, [gameState.timeLeft, gameState.room?.status, userAnswer]);

  const loadRoomData = async () => {
    try {
      // Load room info
      const { data: room, error: roomError } = await supabase
        .from('game_rooms')
        .select('*')
        .eq('id', roomId)
        .single();

      if (roomError) throw roomError;

      // Load players
      const { data: players, error: playersError } = await MultiplayerGameService.getRoomPlayers(roomId);
      if (playersError) throw playersError;

      setGameState(prev => ({
        ...prev,
        room,
        players: players || []
      }));

      // If game is in progress, load current question
      if (room?.status === 'in_progress') {
        loadCurrentQuestion();
      }
    } catch (error) {
      toast.error("Failed to load room data");
      console.error(error);
    }
  };

  const loadCurrentQuestion = async () => {
    const { data: question, error } = await supabase
      .from('game_questions')
      .select('*')
      .eq('room_id', roomId)
      .order('question_number', { ascending: false })
      .limit(1)
      .single();

    if (question && !error) {
      setGameState(prev => ({
        ...prev,
        currentQuestion: question,
        questionNumber: question.question_number,
        timeLeft: question.time_limit
      }));
      setUserAnswer(null);
    }
  };

  const setupRealtimeSubscription = () => {
    const newChannel = MultiplayerGameService.subscribeToRoom(roomId, handleRealtimeUpdate);
    setChannel(newChannel);
  };

  const handleRealtimeUpdate = async (payload: any) => {
    console.log('Realtime update:', payload);
    
    // Reload room data on any change
    await loadRoomData();
    
    // If new question was created, load it
    if (payload.table === 'game_questions' && payload.eventType === 'INSERT') {
      await loadCurrentQuestion();
    }
  };

  const handleStartGame = async () => {
    if (!user || !gameState.room || gameState.room.host_id !== user.id) {
      toast.error("Only the host can start the game");
      return;
    }

    const { error } = await MultiplayerGameService.startGame(roomId, user.id);
    if (error) {
      toast.error("Failed to start game");
      console.error(error);
    } else {
      setGameStartTime(Date.now());
      // Create first question
      await createNextQuestion(1);
    }
  };

  const createNextQuestion = async (questionNumber: number) => {
    const { data, error } = await MultiplayerGameService.createQuestion(roomId, questionNumber);
    if (error) {
      toast.error("Failed to create question");
      console.error(error);
    }
    // Question will be loaded via realtime subscription
  };

  const handleAnswer = async (selectedAnswer: number) => {
    if (!user || !gameState.currentQuestion || userAnswer !== null) return;

    setUserAnswer(selectedAnswer);
    const responseTime = (Date.now() - gameStartTime) / 1000;

    const { error } = await MultiplayerGameService.submitAnswer(
      roomId,
      gameState.currentQuestion.id,
      user.id,
      selectedAnswer,
      responseTime
    );

    if (error) {
      toast.error("Failed to submit answer");
      console.error(error);
    }

    // Check if all players have answered
    setTimeout(async () => {
      const { data: answers } = await supabase
        .from('game_answers')
        .select('user_id')
        .eq('question_id', gameState.currentQuestion?.id);

      if (answers && answers.length === gameState.players.length) {
        // All players answered, move to next question
        if (gameState.questionNumber < gameState.totalQuestions) {
          setTimeout(() => {
            createNextQuestion(gameState.questionNumber + 1);
          }, 2000);
        } else {
          // Game complete
          setTimeout(() => {
            endGame();
          }, 2000);
        }
      }
    }, 1000);
  };

  const endGame = async () => {
    // Update room status
    await supabase
      .from('game_rooms')
      .update({ status: 'completed' })
      .eq('id', roomId);

    // Show confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#9b87f5', '#7E69AB', '#6E59A5']
    });

    onGameComplete(gameState.players);
  };

  const handleLeaveRoom = async () => {
    if (!user) return;

    const { error } = await MultiplayerGameService.leaveRoom(roomId, user.id);
    if (error) {
      toast.error("Failed to leave room");
      console.error(error);
    } else {
      onLeaveRoom();
    }
  };

  const isHost = user && gameState.room && gameState.room.host_id === user.id;
  const canStart = isHost && gameState.room?.status === 'waiting' && gameState.players.length >= 2;

  return (
    <div className="space-y-6">
      {/* Room Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                {gameState.room?.name}
                {isHost && <Crown className="h-5 w-5 text-yellow-500" />}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {gameState.room?.status === 'waiting' ? 'Waiting for players...' : 
                 gameState.room?.status === 'in_progress' ? 'Game in progress' : 'Game completed'}
              </p>
            </div>
            <Button variant="outline" onClick={handleLeaveRoom}>
              <LogOut className="h-4 w-4 mr-2" />
              Leave
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Players List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Players ({gameState.players.length}/{gameState.room?.max_players})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {gameState.players.map((player) => (
              <div key={player.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{player.display_name}</span>
                  {player.user_id === gameState.room?.host_id && (
                    <Crown className="h-4 w-4 text-yellow-500" />
                  )}
                  {player.user_id === user?.id && (
                    <Badge variant="secondary" className="text-xs">You</Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{player.score} points</Badge>
                  {player.current_answer !== null && gameState.room?.status === 'in_progress' && (
                    <Badge variant="default" className="text-xs">Answered</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Game Area */}
      {gameState.room?.status === 'waiting' && (
        <Card>
          <CardContent className="text-center py-8">
            <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">Waiting for more players</h3>
            <p className="text-muted-foreground mb-4">
              You need at least 2 players to start the game
            </p>
            {canStart && (
              <Button onClick={handleStartGame} size="lg">
                <Play className="h-4 w-4 mr-2" />
                Start Game
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {gameState.room?.status === 'in_progress' && gameState.currentQuestion && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>
                Question {gameState.questionNumber} of {gameState.totalQuestions}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Timer className="h-4 w-4" />
                <span className="text-sm font-medium">
                  {Math.ceil(gameState.timeLeft)}s
                </span>
              </div>
            </div>
            <Progress 
              value={(gameState.timeLeft / gameState.currentQuestion.time_limit) * 100} 
              className="w-full"
            />
          </CardHeader>
          <CardContent>
            <div className="text-center mb-6">
              <div className="text-4xl font-bold mb-4">
                {gameState.currentQuestion.num1} {gameState.currentQuestion.operation} {gameState.currentQuestion.num2} = ?
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {gameState.currentQuestion.options.map((option, index) => (
                <Button
                  key={index}
                  onClick={() => handleAnswer(option)}
                  disabled={userAnswer !== null}
                  variant={userAnswer === option ? "default" : "outline"}
                  className="h-16 text-xl"
                >
                  {option}
                </Button>
              ))}
            </div>

            {userAnswer !== null && (
              <div className="text-center mt-4">
                <p className="text-sm text-muted-foreground">
                  Answer submitted! Waiting for other players...
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {gameState.room?.status === 'completed' && (
        <Card>
          <CardContent className="text-center py-8">
            <Trophy className="h-12 w-12 mx-auto mb-4 text-yellow-500" />
            <h3 className="text-lg font-medium mb-4">Game Complete!</h3>
            <div className="space-y-2">
              {gameState.players
                .sort((a, b) => b.score - a.score)
                .map((player, index) => (
                  <div key={player.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span>#{index + 1} {player.display_name}</span>
                    <span className="font-bold">{player.score} points</span>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MultiplayerRoom;
