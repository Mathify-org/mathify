
-- Create game_rooms table
CREATE TABLE public.game_rooms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  host_id UUID REFERENCES auth.users NOT NULL,
  max_players INTEGER NOT NULL DEFAULT 4,
  current_players INTEGER NOT NULL DEFAULT 0,
  game_mode TEXT NOT NULL DEFAULT 'mental_maths',
  status TEXT NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting', 'in_progress', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create game_players table
CREATE TABLE public.game_players (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID REFERENCES public.game_rooms ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users NOT NULL,
  display_name TEXT NOT NULL,
  score INTEGER NOT NULL DEFAULT 0,
  current_answer INTEGER,
  is_ready BOOLEAN NOT NULL DEFAULT false,
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create game_questions table
CREATE TABLE public.game_questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID REFERENCES public.game_rooms ON DELETE CASCADE NOT NULL,
  question_number INTEGER NOT NULL,
  num1 INTEGER NOT NULL,
  num2 INTEGER NOT NULL,
  operation TEXT NOT NULL CHECK (operation IN ('+', '-', '*', '/')),
  correct_answer INTEGER NOT NULL,
  options INTEGER[] NOT NULL,
  time_limit INTEGER NOT NULL DEFAULT 12,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create game_answers table
CREATE TABLE public.game_answers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID REFERENCES public.game_rooms ON DELETE CASCADE NOT NULL,
  question_id UUID REFERENCES public.game_questions ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users NOT NULL,
  selected_answer INTEGER NOT NULL,
  is_correct BOOLEAN NOT NULL,
  response_time DECIMAL NOT NULL,
  answered_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.game_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_answers ENABLE ROW LEVEL SECURITY;

-- RLS Policies for game_rooms
CREATE POLICY "Users can view all waiting rooms" 
  ON public.game_rooms 
  FOR SELECT 
  USING (status = 'waiting' OR EXISTS (
    SELECT 1 FROM public.game_players 
    WHERE game_players.room_id = game_rooms.id 
    AND game_players.user_id = auth.uid()
  ));

CREATE POLICY "Users can create rooms" 
  ON public.game_rooms 
  FOR INSERT 
  WITH CHECK (auth.uid() = host_id);

CREATE POLICY "Host can update their rooms" 
  ON public.game_rooms 
  FOR UPDATE 
  USING (auth.uid() = host_id);

-- RLS Policies for game_players
CREATE POLICY "Users can view players in their rooms" 
  ON public.game_players 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.game_players gp 
    WHERE gp.room_id = game_players.room_id 
    AND gp.user_id = auth.uid()
  ));

CREATE POLICY "Users can join rooms" 
  ON public.game_players 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own player data" 
  ON public.game_players 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can leave rooms" 
  ON public.game_players 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- RLS Policies for game_questions
CREATE POLICY "Players can view questions in their rooms" 
  ON public.game_questions 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.game_players 
    WHERE game_players.room_id = game_questions.room_id 
    AND game_players.user_id = auth.uid()
  ));

CREATE POLICY "Host can create questions" 
  ON public.game_questions 
  FOR INSERT 
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.game_rooms 
    WHERE game_rooms.id = room_id 
    AND game_rooms.host_id = auth.uid()
  ));

-- RLS Policies for game_answers
CREATE POLICY "Players can view answers in their rooms" 
  ON public.game_answers 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.game_players 
    WHERE game_players.room_id = game_answers.room_id 
    AND game_players.user_id = auth.uid()
  ));

CREATE POLICY "Users can submit their own answers" 
  ON public.game_answers 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id AND EXISTS (
    SELECT 1 FROM public.game_players 
    WHERE game_players.room_id = game_answers.room_id 
    AND game_players.user_id = auth.uid()
  ));

-- Add indexes for better performance
CREATE INDEX idx_game_rooms_status ON public.game_rooms(status);
CREATE INDEX idx_game_players_room_id ON public.game_players(room_id);
CREATE INDEX idx_game_players_user_id ON public.game_players(user_id);
CREATE INDEX idx_game_questions_room_id ON public.game_questions(room_id);
CREATE INDEX idx_game_answers_room_id ON public.game_answers(room_id);
CREATE INDEX idx_game_answers_question_id ON public.game_answers(question_id);

-- Enable realtime for all multiplayer tables
ALTER TABLE public.game_rooms REPLICA IDENTITY FULL;
ALTER TABLE public.game_players REPLICA IDENTITY FULL;
ALTER TABLE public.game_questions REPLICA IDENTITY FULL;
ALTER TABLE public.game_answers REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.game_rooms;
ALTER PUBLICATION supabase_realtime ADD TABLE public.game_players;
ALTER PUBLICATION supabase_realtime ADD TABLE public.game_questions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.game_answers;
