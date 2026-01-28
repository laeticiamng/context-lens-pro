-- Fix security vulnerabilities for cabinets, contact_messages, and waitlist tables

-- 1. CABINETS: Ensure only authenticated cabinet owners can read their own data
DROP POLICY IF EXISTS "Cabinet owners can view their cabinets" ON public.cabinets;
CREATE POLICY "Cabinet owners can view their cabinets" 
ON public.cabinets 
FOR SELECT 
USING (auth.uid() = owner_id);

-- Ensure no public access at all
DROP POLICY IF EXISTS "Public can view cabinets" ON public.cabinets;

-- 2. CONTACT_MESSAGES: Ensure table is strictly write-only for public
-- Keep existing insert policy but ensure no reads
DROP POLICY IF EXISTS "Anyone can submit contact" ON public.contact_messages;
CREATE POLICY "Anyone can submit contact" 
ON public.contact_messages 
FOR INSERT 
WITH CHECK (true);

-- Explicitly block all reads for non-service roles
DROP POLICY IF EXISTS "No direct SELECT" ON public.contact_messages;
CREATE POLICY "No direct SELECT" 
ON public.contact_messages 
FOR SELECT 
USING (false);

-- 3. WAITLIST: Same pattern - write-only for public
DROP POLICY IF EXISTS "Anyone can join waitlist" ON public.waitlist;
CREATE POLICY "Anyone can join waitlist" 
ON public.waitlist 
FOR INSERT 
WITH CHECK (true);

DROP POLICY IF EXISTS "No direct SELECT" ON public.waitlist;
CREATE POLICY "No direct SELECT" 
ON public.waitlist 
FOR SELECT 
USING (false);

-- 4. Ensure RLS is enabled on all these tables
ALTER TABLE public.cabinets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;