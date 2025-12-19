-- Add foreign key from user_progress.user_id to profiles.id
ALTER TABLE public.user_progress 
ADD CONSTRAINT fk_user_progress_profiles 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Also add RLS policy to allow public read of profiles for leaderboard
CREATE POLICY "Anyone can view profile usernames for leaderboard"
ON public.profiles
FOR SELECT
USING (true);