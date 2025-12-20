-- Add marketing email preference column to profiles table
-- This allows registered users to opt out of marketing emails while still receiving transactional emails

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS marketing_emails_enabled BOOLEAN NOT NULL DEFAULT true;

-- Add comment for documentation
COMMENT ON COLUMN public.profiles.marketing_emails_enabled IS 'Whether the user has opted in to receive marketing/promotional emails. Transactional emails are always sent regardless of this setting.';