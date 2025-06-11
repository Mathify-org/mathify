import { supabase } from "@/integrations/supabase/client";
import type { GameRoom, GamePlayer, GameQuestion, GameAnswer } from "@/types/multiplayer";

export class MultiplayerGameService {
  // Room management
  static async createRoom(hostId: string, roomName: string, maxPlayers: number = 4): Promise<{ data: GameRoom | null; error: any }> {
    console.log('🏗️ Creating room with params:', { hostId, roomName, maxPlayers });
    
    try {
      // First check if user is authenticated
      const { data: { user } } = await supabase.auth.getUser();
      console.log('👤 Current user:', user?.id);
      
      if (!user) {
        const authError = new Error('User not authenticated');
        console.error('❌ Authentication error:', authError);
        return { data: null, error: authError };
      }

      if (user.id !== hostId) {
        const mismatchError = new Error(`User ID mismatch: authenticated user ${user.id} vs provided hostId ${hostId}`);
        console.error('❌ User ID mismatch:', mismatchError);
        return { data: null, error: mismatchError };
      }

      console.log('🔄 Inserting room into database...');
      const { data, error } = await supabase
        .from('game_rooms')
        .insert({
          name: roomName,
          host_id: hostId,
          max_players: maxPlayers,
          current_players: 0, // Start with 0, will increment when host joins
          game_mode: 'mental_maths',
          status: 'waiting'
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Database insert error:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        return { data: null, error };
      }

      console.log('✅ Room created successfully:', data);

      if (data) {
        console.log('👥 Adding host as first player...');
        // Use a more direct approach for adding the host
        const { data: playerData, error: playerError } = await supabase
          .from('game_players')
          .insert({
            room_id: data.id,
            user_id: hostId,
            display_name: 'Host',
            score: 0,
            is_ready: false
          })
          .select()
          .single();
        
        if (playerError) {
          console.error('❌ Failed to add host as player:', playerError);
          // Try to clean up the room if adding the host failed
          await supabase.from('game_rooms').delete().eq('id', data.id);
          return { data: null, error: new Error(`Room created but failed to add host: ${playerError.message}`) };
        }
        
        console.log('✅ Host added as player successfully:', playerData);
        
        // Update room player count
        const { error: updateError } = await supabase
          .from('game_rooms')
          .update({ current_players: 1 })
          .eq('id', data.id);

        if (updateError) {
          console.error('⚠️ Failed to update player count:', updateError);
        } else {
          console.log('✅ Room player count updated to 1');
        }
      }

      return { data: data as GameRoom, error };
    } catch (unexpectedError) {
      console.error('💥 Unexpected error in createRoom:', unexpectedError);
      return { data: null, error: unexpectedError };
    }
  }

  static async joinRoom(roomId: string, userId: string, displayName?: string): Promise<{ data: GamePlayer | null; error: any }> {
    console.log('🚪 Joining room with params:', { roomId, userId, displayName });
    
    try {
      // Check if room exists and has space
      console.log('🔍 Checking room availability...');
      const { data: room, error: roomError } = await supabase
        .from('game_rooms')
        .select('*')
        .eq('id', roomId)
        .eq('status', 'waiting')
        .single();

      if (roomError) {
        console.error('❌ Room query error:', roomError);
        return { data: null, error: roomError };
      }

      if (!room) {
        const notFoundError = new Error('Room not found or not available');
        console.error('❌ Room not found:', notFoundError);
        return { data: null, error: notFoundError };
      }

      console.log('📊 Room details:', room);

      if (room.current_players >= room.max_players) {
        const fullError = new Error('Room is full');
        console.error('❌ Room is full:', fullError);
        return { data: null, error: fullError };
      }

      // Check if user is already in the room
      console.log('🔍 Checking if user already in room...');
      const { data: existingPlayer } = await supabase
        .from('game_players')
        .select('*')
        .eq('room_id', roomId)
        .eq('user_id', userId)
        .single();

      if (existingPlayer) {
        console.log('✅ User already in room:', existingPlayer);
        return { data: existingPlayer as GamePlayer, error: null };
      }

      // Add player to room
      console.log('➕ Adding player to room...');
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

      if (playerError) {
        console.error('❌ Player insert error:', playerError);
        return { data: null, error: playerError };
      }

      console.log('✅ Player added successfully:', player);

      if (player) {
        // Update room player count
        console.log('🔄 Updating room player count...');
        const { error: updateError } = await supabase
          .from('game_rooms')
          .update({ current_players: room.current_players + 1 })
          .eq('id', roomId);

        if (updateError) {
          console.error('⚠️ Failed to update player count (player still added):', updateError);
        } else {
          console.log('✅ Room player count updated');
        }
      }

      return { data: player as GamePlayer, error: playerError };
    } catch (unexpectedError) {
      console.error('💥 Unexpected error in joinRoom:', unexpectedError);
      return { data: null, error: unexpectedError };
    }
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
    // Fixed query - removed the problematic .lt() filter with column comparison
    const { data, error } = await supabase
      .from('game_rooms')
      .select('*')
      .eq('status', 'waiting')
      .order('created_at', { ascending: false });

    // Filter out full rooms in JavaScript instead of SQL to avoid the column reference issue
    if (data && !error) {
      const availableRooms = data.filter(room => room.current_players < room.max_players);
      return { data: availableRooms as GameRoom[], error };
    }

    return { data: data as GameRoom[], error };
  }

  static async getRoomPlayers(roomId: string): Promise<{ data: GamePlayer[] | null; error: any }> {
    const { data, error } = await supabase
      .from('game_players')
      .select('*')
      .eq('room_id', roomId)
      .order('joined_at', { ascending: true });

    return { data: data as GamePlayer[], error };
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

    return { data: data as GameQuestion, error };
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
      // Get current score and increment it
      const { data: currentPlayer } = await supabase
        .from('game_players')
        .select('score')
        .eq('room_id', roomId)
        .eq('user_id', userId)
        .single();

      if (currentPlayer) {
        await supabase
          .from('game_players')
          .update({ 
            score: currentPlayer.score + 1,
            current_answer: selectedAnswer 
          })
          .eq('room_id', roomId)
          .eq('user_id', userId);
      }
    } else if (!error) {
      await supabase
        .from('game_players')
        .update({ current_answer: selectedAnswer })
        .eq('room_id', roomId)
        .eq('user_id', userId);
    }

    return { data: data as GameAnswer, error };
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
