-- Consolidate duplicate RLS policies on contact_messages and waitlist
-- Remove duplicate SELECT denial policies and keep one clean policy

-- Drop duplicate policies on contact_messages
DROP POLICY IF EXISTS "No direct SELECT" ON public.contact_messages;
DROP POLICY IF EXISTS "Block public SELECT" ON public.contact_messages;

-- Create single clean SELECT denial policy
CREATE POLICY "contact_messages_no_public_read" 
ON public.contact_messages 
FOR SELECT 
USING (false);

-- Drop duplicate policies on waitlist
DROP POLICY IF EXISTS "No direct SELECT" ON public.waitlist;
DROP POLICY IF EXISTS "Block public SELECT" ON public.waitlist;

-- Create single clean SELECT denial policy
CREATE POLICY "waitlist_no_public_read" 
ON public.waitlist 
FOR SELECT 
USING (false);

-- Add comments for documentation
COMMENT ON POLICY "contact_messages_no_public_read" ON public.contact_messages IS 'Intentionally blocks all SELECT - contact submissions are write-only from public';
COMMENT ON POLICY "waitlist_no_public_read" ON public.waitlist IS 'Intentionally blocks all SELECT - waitlist signups are write-only from public';