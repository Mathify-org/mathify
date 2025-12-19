-- Add RLS policy to allow public read of user_progress for leaderboard
CREATE POLICY "Anyone can view user progress for leaderboard"
ON public.user_progress
FOR SELECT
USING (true);