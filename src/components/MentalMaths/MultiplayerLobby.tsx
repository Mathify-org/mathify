
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Plus, LogIn, Clock, Trophy } from 'lucide-react';
import { multiplayerService, GameRoom } from '@/services/multiplayerService';
import { toast } from 'sonner';

interface MultiplayerLobbyProps {
  onJoinGame: (roomId: string) => void;
  onBackToMenu: () => void;
}

const MultiplayerLobby: React.FC<MultiplayerLobbyProps> = ({ onJoinGame, onBackToMenu }) => {
  const [playerName, setPlayerName] = useState('');
  const [availableRooms, setAvailableRooms] = useState<GameRoom[]>([]);
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);

  // Poll for available rooms
  useEffect(() => {
    const updateRooms = () => {
      const rooms = multiplayerService.getAvailableRooms();
      setAvailableRooms(rooms);
    };

    updateRooms();
    const interval = setInterval(updateRooms, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleCreateRoom = () => {
    if (!playerName.trim()) {
      toast.error('Please enter your name');
      return;
    }

    setIsCreatingRoom(true);
    try {
      const room = multiplayerService.createRoom(playerName.trim());
      toast.success('Room created! Waiting for another player...');
      onJoinGame(room.id);
    } catch (error) {
      toast.error('Failed to create room');
    } finally {
      setIsCreatingRoom(false);
    }
  };

  const handleJoinRoom = (roomId: string) => {
    if (!playerName.trim()) {
      toast.error('Please enter your name');
      return;
    }

    try {
      const room = multiplayerService.joinRoom(roomId, playerName.trim());
      if (room) {
        toast.success('Joined room successfully!');
        onJoinGame(roomId);
      } else {
        toast.error('Failed to join room - it may be full or no longer available');
      }
    } catch (error) {
      toast.error('Failed to join room');
    }
  };

  const getTimeAgo = (timestamp: number): string => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m ago`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E5DEFF] to-[#FEF7CD] flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-lg border-none bg-white/90">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold flex items-center justify-center gap-2">
            <Users className="h-8 w-8 text-purple-600" />
            Multiplayer Lobby
          </CardTitle>
          <CardDescription className="text-lg">
            Compete with other players in real-time math challenges!
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Player name input */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Your Name</label>
            <Input
              placeholder="Enter your name..."
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              maxLength={20}
            />
          </div>

          {/* Create room button */}
          <Button
            onClick={handleCreateRoom}
            disabled={!playerName.trim() || isCreatingRoom}
            className="w-full bg-gradient-to-r from-[#9b87f5] to-[#8B5CF6] hover:opacity-90"
            size="lg"
          >
            <Plus className="h-5 w-5 mr-2" />
            {isCreatingRoom ? 'Creating Room...' : 'Create New Room'}
          </Button>

          {/* Available rooms */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Available Rooms</h3>
              <Badge variant="secondary">
                {availableRooms.length} room{availableRooms.length !== 1 ? 's' : ''}
              </Badge>
            </div>

            {availableRooms.length === 0 ? (
              <Card className="p-6 text-center">
                <div className="text-gray-500">
                  <Clock className="h-8 w-8 mx-auto mb-2" />
                  <p>No rooms available</p>
                  <p className="text-sm">Create a room to get started!</p>
                </div>
              </Card>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {availableRooms.map((room) => (
                  <Card key={room.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium">{room.name}</h4>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            Host: {room.host.name}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Created {getTimeAgo(room.createdAt)}
                          </span>
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Trophy className="h-3 w-3" />
                            60s Challenge
                          </Badge>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleJoinRoom(room.id)}
                        disabled={!playerName.trim()}
                        size="sm"
                        variant="outline"
                      >
                        <LogIn className="h-4 w-4 mr-1" />
                        Join
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Back button */}
          <Button
            onClick={onBackToMenu}
            variant="outline"
            className="w-full"
          >
            Back to Menu
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default MultiplayerLobby;
