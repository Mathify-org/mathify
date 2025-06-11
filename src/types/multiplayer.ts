
export interface GameRoom {
  id: string;
  name: string;
  host_id: string;
  max_players: number;
  current_players: number;
  game_mode: string; // Changed from literal type to string
  status: string; // Changed from literal type to string
  created_at: string;
  updated_at: string;
}

export interface GamePlayer {
  id: string;
  room_id: string;
  user_id: string;
  display_name: string;
  score: number;
  current_answer: number | null;
  is_ready: boolean;
  joined_at: string;
}

export interface GameQuestion {
  id: string;
  room_id: string;
  question_number: number;
  num1: number;
  num2: number;
  operation: string; // Changed from literal type to string
  correct_answer: number;
  options: number[];
  time_limit: number;
  created_at: string;
}

export interface GameAnswer {
  id: string;
  room_id: string;
  question_id: string;
  user_id: string;
  selected_answer: number;
  is_correct: boolean;
  response_time: number;
  answered_at: string;
}

export interface MultiplayerGameState {
  room: GameRoom | null;
  players: GamePlayer[];
  currentQuestion: GameQuestion | null;
  answers: GameAnswer[];
  timeLeft: number;
  questionNumber: number;
  totalQuestions: number;
}
