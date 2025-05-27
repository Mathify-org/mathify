
// Types for multiplayer functionality
export interface GameRoom {
  id: string;
  name: string;
  host: Player;
  guest?: Player;
  status: 'waiting' | 'playing' | 'finished';
  gameStartTime?: number;
  gameDuration: number; // 60 seconds
  createdAt: number;
}

export interface Player {
  id: string;
  name: string;
  score: number;
  answeredQuestions: number;
  isReady: boolean;
  lastUpdate: number;
}

export interface MultiplayerGameState {
  currentQuestion: number;
  totalQuestions: number;
  timeRemaining: number;
  players: Player[];
}

class MultiplayerService {
  private readonly ROOMS_KEY = 'mathify_multiplayer_rooms';
  private readonly PLAYER_ID_KEY = 'mathify_player_id';
  private readonly POLL_INTERVAL = 1000; // Poll every second
  
  // Generate unique IDs
  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
  
  // Get player ID (create if doesn't exist)
  getPlayerId(): string {
    let playerId = localStorage.getItem(this.PLAYER_ID_KEY);
    if (!playerId) {
      playerId = this.generateId();
      localStorage.setItem(this.PLAYER_ID_KEY, playerId);
    }
    return playerId;
  }
  
  // Get all rooms from localStorage
  private getRooms(): GameRoom[] {
    const rooms = localStorage.getItem(this.ROOMS_KEY);
    return rooms ? JSON.parse(rooms) : [];
  }
  
  // Save rooms to localStorage
  private saveRooms(rooms: GameRoom[]): void {
    localStorage.setItem(this.ROOMS_KEY, JSON.stringify(rooms));
  }
  
  // Clean up old rooms (older than 10 minutes)
  private cleanupRooms(): void {
    const rooms = this.getRooms();
    const now = Date.now();
    const validRooms = rooms.filter(room => now - room.createdAt < 10 * 60 * 1000);
    this.saveRooms(validRooms);
  }
  
  // Create a new game room
  createRoom(hostName: string): GameRoom {
    this.cleanupRooms();
    
    const playerId = this.getPlayerId();
    const room: GameRoom = {
      id: this.generateId(),
      name: `${hostName}'s Room`,
      host: {
        id: playerId,
        name: hostName,
        score: 0,
        answeredQuestions: 0,
        isReady: true,
        lastUpdate: Date.now()
      },
      status: 'waiting',
      gameDuration: 60,
      createdAt: Date.now()
    };
    
    const rooms = this.getRooms();
    rooms.push(room);
    this.saveRooms(rooms);
    
    return room;
  }
  
  // Get available rooms
  getAvailableRooms(): GameRoom[] {
    this.cleanupRooms();
    return this.getRooms().filter(room => room.status === 'waiting' && !room.guest);
  }
  
  // Join a room
  joinRoom(roomId: string, playerName: string): GameRoom | null {
    const rooms = this.getRooms();
    const roomIndex = rooms.findIndex(room => room.id === roomId);
    
    if (roomIndex === -1) return null;
    
    const room = rooms[roomIndex];
    if (room.guest || room.status !== 'waiting') return null;
    
    const playerId = this.getPlayerId();
    room.guest = {
      id: playerId,
      name: playerName,
      score: 0,
      answeredQuestions: 0,
      isReady: true,
      lastUpdate: Date.now()
    };
    
    this.saveRooms(rooms);
    return room;
  }
  
  // Get room by ID
  getRoom(roomId: string): GameRoom | null {
    const rooms = this.getRooms();
    return rooms.find(room => room.id === roomId) || null;
  }
  
  // Update player score
  updatePlayerScore(roomId: string, score: number, answeredQuestions: number): void {
    const rooms = this.getRooms();
    const roomIndex = rooms.findIndex(room => room.id === roomId);
    
    if (roomIndex === -1) return;
    
    const room = rooms[roomIndex];
    const playerId = this.getPlayerId();
    
    if (room.host.id === playerId) {
      room.host.score = score;
      room.host.answeredQuestions = answeredQuestions;
      room.host.lastUpdate = Date.now();
    } else if (room.guest && room.guest.id === playerId) {
      room.guest.score = score;
      room.guest.answeredQuestions = answeredQuestions;
      room.guest.lastUpdate = Date.now();
    }
    
    this.saveRooms(rooms);
  }
  
  // Start game
  startGame(roomId: string): void {
    const rooms = this.getRooms();
    const roomIndex = rooms.findIndex(room => room.id === roomId);
    
    if (roomIndex === -1) return;
    
    rooms[roomIndex].status = 'playing';
    rooms[roomIndex].gameStartTime = Date.now();
    this.saveRooms(rooms);
  }
  
  // End game
  endGame(roomId: string): void {
    const rooms = this.getRooms();
    const roomIndex = rooms.findIndex(room => room.id === roomId);
    
    if (roomIndex === -1) return;
    
    rooms[roomIndex].status = 'finished';
    this.saveRooms(rooms);
  }
  
  // Leave room
  leaveRoom(roomId: string): void {
    const rooms = this.getRooms();
    const roomIndex = rooms.findIndex(room => room.id === roomId);
    
    if (roomIndex === -1) return;
    
    const playerId = this.getPlayerId();
    const room = rooms[roomIndex];
    
    if (room.host.id === playerId) {
      // Host left, remove the room
      rooms.splice(roomIndex, 1);
    } else if (room.guest && room.guest.id === playerId) {
      // Guest left, remove guest
      delete room.guest;
      room.status = 'waiting';
    }
    
    this.saveRooms(rooms);
  }
}

export const multiplayerService = new MultiplayerService();
