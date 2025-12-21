-- Add is_public column to profiles for leaderboard visibility
ALTER TABLE public.profiles 
ADD COLUMN is_public boolean NOT NULL DEFAULT true;

-- Create index for faster public profile queries
CREATE INDEX idx_profiles_is_public ON public.profiles(is_public) WHERE is_public = true;

-- Update RLS policy to allow anyone to view public profiles
-- (Existing policy already allows anyone to view for leaderboard, but we should be explicit)
DROP POLICY IF EXISTS "Anyone can view profile usernames for leaderboard" ON public.profiles;

CREATE POLICY "Anyone can view public profiles" 
ON public.profiles 
FOR SELECT 
USING (is_public = true OR auth.uid() = id);

-- Ensure user_progress has proper RLS for public viewing
-- The existing "Anyone can view user progress for leaderboard" already allows this