
import { supabase } from "@/integrations/supabase/client";
import type { GameRoom, GamePlayer, GameQuestion, GameAnswer } from "@/types/multiplayer";

export class MultiplayerGameService {
  // Room management
  static async createRoom(hostId: string, roomName: string, maxPlayers: number = 4): Promise<{ data: GameRoom | null; error: any }> {
    const { data, error } = await supabase
      .from('game_rooms')
      .insert({
        name: roomName,
        host_id: hostId,
        max_players: maxPlayers,
        current_players: 1,
        game_mode: 'mental_maths',
        status: 'waiting'
      })
      .select()
      .single();

    if (data && !error) {
      // Add host as first player
      await this.joinRoom(data.id, hostId);
    }

    return { data, error };
  }

  static async joinRoom(roomId: string, userId: string, displayName?: string): Promise<{ data: GamePlayer | null; error: any }> {
    // Check if room exists and has space
    const { data: room, error: roomError } = await supabase
      .from('game_rooms')
      .select('*')
      .eq('id', roomId)
      .eq('status', 'waiting')
      .single();

    if (roomError || !room) {
      return { data: null, error: roomError || new Error('Room not found') };
    }

    if (room.current_players >= room.max_players) {
      return { data: null, error: new Error('Room is full') };
    }

    // Add player to room
    const { data: player, error: playerError } = await supabase
      .from('game_players')
      .insert({
        room_id: roomId,
        user_id: userId,
        display_name: displayName || 'Player',
        score: 0,
        is_ready: false
      })
      .select()
      .single();

    if (player && !playerError) {
      // Update room player count
      await supabase
        .from('game_rooms')
        .update({ current_players: room.current_players + 1 })
        .eq('id', roomId);
    }

    return { data: player, error: playerError };
  }

  static async leaveRoom(roomId: string, userId: string): Promise<{ error: any }> {
    const { error: playerError } = await supabase
      .from('game_players')
      .delete()
      .eq('room_id', roomId)
      .eq('user_id', userId);

    if (!playerError) {
      // Update room player count
      const { data: room } = await supabase
        .from('game_rooms')
        .select('current_players, host_id')
        .eq('id', roomId)
        .single();

      if (room) {
        const newPlayerCount = room.current_players - 1;
        
        if (newPlayerCount === 0) {
          // Delete empty room
          await supabase.from('game_rooms').delete().eq('id', roomId);
        } else {
          // Update player count
          await supabase
            .from('game_rooms')
            .update({ current_players: newPlayerCount })
            .eq('id', roomId);

          // If host left, assign new host
          if (room.host_id === userId) {
            const { data: newHost } = await supabase
              .from('game_players')
              .select('user_id')
              .eq('room_id', roomId)
              .limit(1)
              .single();

            if (newHost) {
              await supabase
                .from('game_rooms')
                .update({ host_id: newHost.user_id })
                .eq('id', roomId);
            }
          }
        }
      }
    }

    return { error: playerError };
  }

  static async getAvailableRooms(): Promise<{ data: GameRoom[] | null; error: any }> {
    const { data, error } = await supabase
      .from('game_rooms')
      .select('*')
      .eq('status', 'waiting')
      .lt('current_players', supabase.raw('max_players'))
      .order('created_at', { ascending: false });

    return { data, error };
  }

  static async getRoomPlayers(roomId: string): Promise<{ data: GamePlayer[] | null; error: any }> {
    const { data, error } = await supabase
      .from('game_players')
      .select('*')
      .eq('room_id', roomId)
      .order('joined_at', { ascending: true });

    return { data, error };
  }

  // Game management
  static async startGame(roomId: string, hostId: string): Promise<{ error: any }> {
    // Verify host permission
    const { data: room, error: roomError } = await supabase
      .from('game_rooms')
      .select('host_id')
      .eq('id', roomId)
      .single();

    if (roomError || room?.host_id !== hostId) {
      return { error: new Error('Only the host can start the game') };
    }

    // Update room status
    const { error } = await supabase
      .from('game_rooms')
      .update({ status: 'in_progress' })
      .eq('id', roomId);

    return { error };
  }

  static async createQuestion(roomId: string, questionNumber: number): Promise<{ data: GameQuestion | null; error: any }> {
    const operations = ['+', '-', '*', '/'] as const;
    const operation = operations[Math.floor(Math.random() * operations.length)];
    
    let num1: number, num2: number, answer: number;
    
    switch (operation) {
      case '+':
        num1 = Math.floor(Math.random() * 50) + 1;
        num2 = Math.floor(Math.random() * 50) + 1;
        answer = num1 + num2;
        break;
      case '-':
        num1 = Math.floor(Math.random() * 50) + 20;
        num2 = Math.floor(Math.random() * num1);
        answer = num1 - num2;
        break;
      case '*':
        num1 = Math.floor(Math.random() * 12) + 1;
        num2 = Math.floor(Math.random() * 12) + 1;
        answer = num1 * num2;
        break;
      case '/':
        num2 = Math.floor(Math.random() * 11) + 2;
        answer = Math.floor(Math.random() * 12) + 1;
        num1 = num2 * answer;
        break;
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
    
    const shuffledOptions = options.sort(() => Math.random() - 0.5);

    const { data, error } = await supabase
      .from('game_questions')
      .insert({
        room_id: roomId,
        question_number: questionNumber,
        num1,
        num2,
        operation,
        correct_answer: answer,
        options: shuffledOptions,
        time_limit: 12
      })
      .select()
      .single();

    return { data, error };
  }

  static async submitAnswer(roomId: string, questionId: string, userId: string, selectedAnswer: number, responseTime: number): Promise<{ data: GameAnswer | null; error: any }> {
    // Get correct answer
    const { data: question } = await supabase
      .from('game_questions')
      .select('correct_answer')
      .eq('id', questionId)
      .single();

    const isCorrect = question ? selectedAnswer === question.correct_answer : false;

    const { data, error } = await supabase
      .from('game_answers')
      .insert({
        room_id: roomId,
        question_id: questionId,
        user_id: userId,
        selected_answer: selectedAnswer,
        is_correct: isCorrect,
        response_time: responseTime
      })
      .select()
      .single();

    // Update player score if correct
    if (isCorrect && !error) {
      await supabase
        .from('game_players')
        .update({ 
          score: supabase.raw('score + 1'),
          current_answer: selectedAnswer 
        })
        .eq('room_id', roomId)
        .eq('user_id', userId);
    } else if (!error) {
      await supabase
        .from('game_players')
        .update({ current_answer: selectedAnswer })
        .eq('room_id', roomId)
        .eq('user_id', userId);
    }

    return { data, error };
  }

  // Real-time subscriptions
  static subscribeToRoom(roomId: string, onUpdate: (payload: any) => void) {
    return supabase
      .channel(`room-${roomId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'game_rooms',
        filter: `id=eq.${roomId}`
      }, onUpdate)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'game_players',
        filter: `room_id=eq.${roomId}`
      }, onUpdate)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'game_questions',
        filter: `room_id=eq.${roomId}`
      }, onUpdate)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'game_answers',
        filter: `room_id=eq.${roomId}`
      }, onUpdate)
      .subscribe();
  }
}
