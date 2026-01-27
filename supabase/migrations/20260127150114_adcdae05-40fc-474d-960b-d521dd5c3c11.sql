-- SECURITY FIX: Restrict SELECT on contact_messages to prevent data exposure
-- Only authenticated admins should be able to read contact messages
-- For now, explicitly deny SELECT for all users (admin dashboard would require separate table/view)
CREATE POLICY "No direct SELECT on contact_messages" 
ON public.contact_messages 
FOR SELECT 
USING (false);

-- SECURITY FIX: Restrict SELECT on waitlist to prevent email harvesting
-- Only authenticated admins should be able to read waitlist emails
CREATE POLICY "No direct SELECT on waitlist" 
ON public.waitlist 
FOR SELECT 
USING (false);

-- Note: The existing INSERT policies with (true) are intentional for public forms
-- They allow anonymous users to submit contact messages and join waitlist
-- This is the expected behavior for these public-facing forms