-- Fix overly permissive RLS policies

-- Drop the "FOR ALL" policies that triggered warnings
DROP POLICY IF EXISTS "Users can manage devices of their cabinet" ON public.mri_devices;
DROP POLICY IF EXISTS "Users can manage their subscription" ON public.mri_subscriptions;

-- Create specific policies for mri_devices
CREATE POLICY "Users can insert devices for their cabinet" ON public.mri_devices
  FOR INSERT WITH CHECK (
    cabinet_id IN (SELECT id FROM public.cabinets WHERE owner_id = auth.uid())
  );

CREATE POLICY "Users can update devices of their cabinet" ON public.mri_devices
  FOR UPDATE USING (
    cabinet_id IN (SELECT id FROM public.cabinets WHERE owner_id = auth.uid())
  );

CREATE POLICY "Users can delete devices of their cabinet" ON public.mri_devices
  FOR DELETE USING (
    cabinet_id IN (SELECT id FROM public.cabinets WHERE owner_id = auth.uid())
  );

-- Create specific policies for mri_subscriptions
CREATE POLICY "Users can insert their subscription" ON public.mri_subscriptions
  FOR INSERT WITH CHECK (
    cabinet_id IN (SELECT id FROM public.cabinets WHERE owner_id = auth.uid())
  );

CREATE POLICY "Users can update their subscription" ON public.mri_subscriptions
  FOR UPDATE USING (
    cabinet_id IN (SELECT id FROM public.cabinets WHERE owner_id = auth.uid())
  );