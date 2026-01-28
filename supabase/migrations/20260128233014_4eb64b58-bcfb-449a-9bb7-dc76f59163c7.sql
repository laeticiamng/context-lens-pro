-- Fix RLS warning for waitlist - restrict INSERT to prevent spam
-- Replace overly permissive true with rate-limiting check
DROP POLICY IF EXISTS "Anyone can join waitlist" ON public.waitlist;

CREATE POLICY "Rate limited waitlist signup" 
ON public.waitlist 
FOR INSERT 
WITH CHECK (
  -- Allow insert if no recent signup from same email in last hour
  NOT EXISTS (
    SELECT 1 FROM public.waitlist w 
    WHERE w.email = email 
    AND w.created_at > (now() - interval '1 hour')
  )
);

-- Fix contact_messages INSERT policy - add spam protection
DROP POLICY IF EXISTS "Anyone can submit contact messages" ON public.contact_messages;

CREATE POLICY "Rate limited contact messages" 
ON public.contact_messages 
FOR INSERT 
WITH CHECK (
  -- Allow insert if no message from same email in last 5 minutes
  NOT EXISTS (
    SELECT 1 FROM public.contact_messages cm 
    WHERE cm.email = email 
    AND cm.created_at > (now() - interval '5 minutes')
  )
);