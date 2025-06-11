
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Users, Crown, Play, Loader2, Plus, RefreshCw, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { MultiplayerGameService } from "@/services/multiplayerGameService";
import type { GameRoom, GamePlayer } from "@/types/multiplayer";
import { toast } from "sonner";

interface MultiplayerLobbyProps {
  onJoinRoom: (roomId: string) => void;
  onCreateRoom: (roomId: string) => void;
}

const MultiplayerLobby: React.FC<MultiplayerLobbyProps> = ({ onJoinRoom, onCreateRoom }) => {
  const { user } = useAuth();
  const [availableRooms, setAvailableRooms] = useState<GameRoom[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [joining, setJoining] = useState<string | null>(null);
  const [roomName, setRoomName] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    loadAvailableRooms();
  }, []);

  const loadAvailableRooms = async () => {
    setLoading(true);
    console.log('🔄 Loading available rooms...');
    const { data, error } = await MultiplayerGameService.getAvailableRooms();
    if (error) {
      console.error('❌ Failed to load rooms:', error);
      toast.error(`Failed to load rooms: ${error.message}`);
    } else {
      console.log('✅ Loaded rooms:', data);
      setAvailableRooms(data || []);
    }
    setLoading(false);
  };

  const handleCreateRoom = async () => {
    if (!user) {
      const errorMsg = "User not authenticated - please sign in";
      console.error('❌ Create room failed:', errorMsg);
      toast.error(errorMsg);
      return;
    }

    if (!roomName.trim()) {
      const errorMsg = "Please enter a room name";
      console.error('❌ Create room failed:', errorMsg);
      toast.error(errorMsg);
      return;
    }

    console.log('🏗️ Starting room creation process...');
    console.log('User details:', { id: user.id, email: user.email });
    
    setCreating(true);
    
    try {
      const { data, error } = await MultiplayerGameService.createRoom(
        user.id,
        roomName.trim(),
        4
      );

      if (error) {
        console.error('❌ Room creation failed with error:', error);
        let errorMessage = "Failed to create room";
        
        if (error.message) {
          errorMessage += `: ${error.message}`;
        }
        
        if (error.details) {
          errorMessage += ` (Details: ${error.details})`;
        }
        
        if (error.hint) {
          errorMessage += ` (Hint: ${error.hint})`;
        }
        
        if (error.code) {
          errorMessage += ` (Code: ${error.code})`;
        }
        
        toast.error(errorMessage);
      } else if (data) {
        console.log('✅ Room created successfully:', data);
        toast.success("Room created successfully!");
        onCreateRoom(data.id);
      } else {
        console.error('❌ Room creation returned no data and no error');
        toast.error("Failed to create room: No data returned");
      }
    } catch (unexpectedError) {
      console.error('💥 Unexpected error during room creation:', unexpectedError);
      toast.error(`Unexpected error: ${unexpectedError instanceof Error ? unexpectedError.message : 'Unknown error'}`);
    }
    
    setCreating(false);
    setRoomName("");
    setShowCreateForm(false);
  };

  const handleJoinRoom = async (roomId: string) => {
    if (!user) {
      const errorMsg = "User not authenticated - please sign in";
      console.error('❌ Join room failed:', errorMsg);
      toast.error(errorMsg);
      return;
    }

    console.log('🚪 Starting join room process...');
    console.log('Join details:', { roomId, userId: user.id, email: user.email });

    setJoining(roomId);
    
    try {
      const { data, error } = await MultiplayerGameService.joinRoom(
        roomId,
        user.id,
        user.email?.split('@')[0] || 'Player'
      );

      if (error) {
        console.error('❌ Join room failed with error:', error);
        let errorMessage = "Failed to join room";
        
        if (error.message) {
          errorMessage += `: ${error.message}`;
        }
        
        toast.error(errorMessage);
      } else if (data) {
        console.log('✅ Joined room successfully:', data);
        toast.success("Joined room successfully!");
        onJoinRoom(roomId);
      } else {
        console.error('❌ Join room returned no data and no error');
        toast.error("Failed to join room: No data returned");
      }
    } catch (unexpectedError) {
      console.error('💥 Unexpected error during join room:', unexpectedError);
      toast.error(`Unexpected error: ${unexpectedError instanceof Error ? unexpectedError.message : 'Unknown error'}`);
    }
    
    setJoining(null);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">Multiplayer Lobby</h2>
        <p className="text-muted-foreground">Join an existing room or create your own</p>
        
        {/* Debug info for authenticated users */}
        {user && (
          <div className="mt-2 p-2 bg-blue-50 rounded-lg text-xs text-blue-700">
            <div className="flex items-center gap-1 justify-center">
              <AlertCircle className="h-3 w-3" />
              <span>Signed in as: {user.email} (ID: {user.id.substring(0, 8)}...)</span>
            </div>
          </div>
        )}
      </div>

      {/* Create Room Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Create New Room
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!showCreateForm ? (
            <Button 
              onClick={() => setShowCreateForm(true)} 
              className="w-full"
              variant="default"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Room
            </Button>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="roomName" className="text-sm font-medium">
                  Room Name
                </label>
                <Input
                  id="roomName"
                  placeholder="Enter room name..."
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleCreateRoom()}
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={handleCreateRoom} 
                  disabled={creating || !roomName.trim()}
                  className="flex-1"
                >
                  {creating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Create
                    </>
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowCreateForm(false);
                    setRoomName("");
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Available Rooms Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Available Rooms
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={loadAvailableRooms}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="ml-2">Loading rooms...</span>
            </div>
          ) : availableRooms.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No rooms available</p>
              <p className="text-sm">Create one to get started!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {availableRooms.map((room) => (
                <div
                  key={room.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium">{room.name}</h3>
                      {room.host_id === user?.id && (
                        <Crown className="h-4 w-4 text-yellow-500" />
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {room.current_players}/{room.max_players}
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {room.status}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleJoinRoom(room.id)}
                    disabled={joining === room.id || room.current_players >= room.max_players}
                    size="sm"
                  >
                    {joining === room.id ? (
                      <>
                        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                        Joining...
                      </>
                    ) : room.current_players >= room.max_players ? (
                      'Full'
                    ) : (
                      'Join'
                    )}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MultiplayerLobby;
