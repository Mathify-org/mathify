-- Add username column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN username text UNIQUE;

-- Create index for faster username lookups
CREATE INDEX idx_profiles_username ON public.profiles(username);

-- Create function to generate username from email
CREATE OR REPLACE FUNCTION public.generate_username_from_email(email_address text)
RETURNS text
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  base_username text;
  final_username text;
  counter integer := 0;
BEGIN
  -- Extract part before @ and clean it (remove special chars, keep alphanumeric and underscores)
  base_username := lower(regexp_replace(split_part(email_address, '@', 1), '[^a-zA-Z0-9]', '', 'g'));
  
  -- Ensure minimum length
  IF length(base_username) < 3 THEN
    base_username := base_username || 'user';
  END IF;
  
  -- Truncate to reasonable length
  base_username := left(base_username, 15);
  
  -- Try base username first
  final_username := base_username;
  
  -- If username exists, append numbers until we find a unique one
  WHILE EXISTS (SELECT 1 FROM public.profiles WHERE username = final_username) LOOP
    counter := counter + 1;
    final_username := base_username || counter::text;
  END LOOP;
  
  RETURN final_username;
END;
$$;

-- Update existing profiles without usernames
UPDATE public.profiles 
SET username = public.generate_username_from_email(COALESCE(email, 'user' || id::text))
WHERE username IS NULL;