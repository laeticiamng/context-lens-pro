-- Add additional security layer for medical scan data
-- Ensure patient_reference is never exposed in SELECT without cabinet ownership check

-- Create a secure view for accessing scans with masked patient references
CREATE OR REPLACE VIEW public.secure_scans AS
SELECT 
  id,
  cabinet_id,
  device_id,
  -- Mask patient reference to show only first 3 and last 2 characters
  CASE 
    WHEN length(patient_reference) > 5 THEN
      substring(patient_reference from 1 for 3) || '***' || substring(patient_reference from length(patient_reference) - 1)
    ELSE '****'
  END as patient_reference_masked,
  protocol_id,
  status,
  started_at,
  completed_at,
  duration_seconds,
  body_zones,
  -- Only expose anomaly count, not detailed findings
  anomalies_detected,
  risk_level,
  created_at
FROM public.mri_scans;

-- Add RLS to the view
ALTER VIEW public.secure_scans SET (security_invoker = on);

-- Create function to get full patient data only for authorized users
CREATE OR REPLACE FUNCTION public.get_patient_scan_details(scan_id uuid)
RETURNS TABLE (
  id uuid,
  patient_reference text,
  findings jsonb,
  report_url text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if the user owns the cabinet that owns this scan
  IF NOT EXISTS (
    SELECT 1 FROM mri_scans s
    JOIN cabinets c ON c.id = s.cabinet_id
    WHERE s.id = scan_id AND c.owner_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Unauthorized access to scan details';
  END IF;

  RETURN QUERY
  SELECT s.id, s.patient_reference, s.findings, s.report_url
  FROM mri_scans s
  WHERE s.id = scan_id;
END;
$$;

-- Add comment for security documentation
COMMENT ON FUNCTION public.get_patient_scan_details IS 'Securely retrieves full patient scan details with ownership verification';