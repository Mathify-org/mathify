
-- Update the "Users can join rooms" policy to be more permissive for inserts
-- This allows users to insert themselves into any room (not just rooms they're already in)
DROP POLICY IF EXISTS "Users can join rooms" ON public.game_players;

CREATE POLICY "Users can join rooms" 
  ON public.game_players 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- The SELECT policy can remain the same since it only affects viewing, not inserting
