-- Fix secure_scans view to inherit RLS from mri_scans
-- The view was created with security_invoker=on but needs explicit RLS

-- First, drop and recreate with proper security settings
DROP VIEW IF EXISTS public.secure_scans;

CREATE VIEW public.secure_scans
WITH (security_invoker = on) AS
SELECT 
  s.id,
  s.cabinet_id,
  s.device_id,
  -- Mask patient reference - only show first 3 and last 2 chars
  CASE 
    WHEN length(s.patient_reference) > 5 THEN
      substring(s.patient_reference from 1 for 3) || '***' || substring(s.patient_reference from length(s.patient_reference) - 1)
    ELSE '****'
  END as patient_reference_masked,
  s.protocol_id,
  s.status,
  s.started_at,
  s.completed_at,
  s.duration_seconds,
  s.body_zones,
  s.anomalies_detected,
  s.risk_level,
  s.created_at
FROM public.mri_scans s
-- This JOIN ensures the view respects cabinet ownership
INNER JOIN public.cabinets c ON c.id = s.cabinet_id AND c.owner_id = auth.uid();

-- Add comment for documentation
COMMENT ON VIEW public.secure_scans IS 'Secure view of MRI scans with masked patient references. Automatically filters to current user cabinet via JOIN.';