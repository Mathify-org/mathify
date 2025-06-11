
-- First, drop the existing problematic policies
DROP POLICY IF EXISTS "Users can view players in their rooms" ON public.game_players;
DROP POLICY IF EXISTS "Users can join rooms" ON public.game_players;
DROP POLICY IF EXISTS "Users can update their own player data" ON public.game_players;
DROP POLICY IF EXISTS "Users can leave rooms" ON public.game_players;

-- Create a security definer function to check if user is in a room
CREATE OR REPLACE FUNCTION public.user_is_in_room(_room_id uuid, _user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.game_players 
    WHERE room_id = _room_id AND user_id = _user_id
  );
$$;

-- Create new RLS policies using the security definer function
CREATE POLICY "Users can view players in their rooms" 
  ON public.game_players 
  FOR SELECT 
  USING (public.user_is_in_room(room_id, auth.uid()));

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

-- Also fix the game_rooms policies to avoid similar issues
DROP POLICY IF EXISTS "Users can view all waiting rooms" ON public.game_rooms;

CREATE POLICY "Users can view all waiting rooms" 
  ON public.game_rooms 
  FOR SELECT 
  USING (
    status = 'waiting' OR 
    public.user_is_in_room(id, auth.uid())
  );
