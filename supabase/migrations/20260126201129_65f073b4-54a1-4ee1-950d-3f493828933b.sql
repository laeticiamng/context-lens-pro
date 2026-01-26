-- LUNETTES IRM Platform Database Schema
-- CLP-LUNETTES-IRM-2026-001

-- Cabinets médicaux
CREATE TABLE public.cabinets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  address TEXT,
  city TEXT,
  postal_code TEXT,
  country TEXT DEFAULT 'FR',
  phone TEXT,
  email TEXT,
  siret TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.cabinets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own cabinet" ON public.cabinets
  FOR SELECT USING (auth.uid() = owner_id);

CREATE POLICY "Users can create their own cabinet" ON public.cabinets
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update their own cabinet" ON public.cabinets
  FOR UPDATE USING (auth.uid() = owner_id);

-- MRI Devices
CREATE TABLE public.mri_devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cabinet_id UUID REFERENCES public.cabinets(id) ON DELETE CASCADE NOT NULL,
  device_type TEXT NOT NULL DEFAULT 'chipiron_squid', -- 'chipiron_squid', 'kyoto_opm', 'hyperfine', 'mock'
  serial_number TEXT UNIQUE NOT NULL,
  manufacturer TEXT NOT NULL,
  model TEXT NOT NULL,
  firmware_version TEXT,
  ip_address INET,
  status TEXT DEFAULT 'offline', -- 'online', 'offline', 'maintenance', 'error'
  last_seen_at TIMESTAMPTZ,
  last_maintenance_at TIMESTAMPTZ,
  next_maintenance_at TIMESTAMPTZ,
  capabilities JSONB DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.mri_devices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view devices of their cabinet" ON public.mri_devices
  FOR SELECT USING (
    cabinet_id IN (SELECT id FROM public.cabinets WHERE owner_id = auth.uid())
  );

CREATE POLICY "Users can manage devices of their cabinet" ON public.mri_devices
  FOR ALL USING (
    cabinet_id IN (SELECT id FROM public.cabinets WHERE owner_id = auth.uid())
  );

-- Subscriptions
CREATE TABLE public.mri_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cabinet_id UUID REFERENCES public.cabinets(id) ON DELETE CASCADE NOT NULL,
  plan_id TEXT NOT NULL DEFAULT 'starter', -- 'starter', 'pro', 'clinic'
  status TEXT DEFAULT 'active', -- 'active', 'past_due', 'cancelled', 'trialing'
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  current_period_start TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  current_period_end TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '1 month'),
  scans_this_period INTEGER DEFAULT 0,
  scans_limit INTEGER DEFAULT 50, -- NULL = unlimited
  glasses_included INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.mri_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their subscription" ON public.mri_subscriptions
  FOR SELECT USING (
    cabinet_id IN (SELECT id FROM public.cabinets WHERE owner_id = auth.uid())
  );

CREATE POLICY "Users can manage their subscription" ON public.mri_subscriptions
  FOR ALL USING (
    cabinet_id IN (SELECT id FROM public.cabinets WHERE owner_id = auth.uid())
  );

-- MRI Scans
CREATE TABLE public.mri_scans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cabinet_id UUID REFERENCES public.cabinets(id) ON DELETE CASCADE NOT NULL,
  device_id UUID REFERENCES public.mri_devices(id) ON DELETE SET NULL,
  patient_reference TEXT NOT NULL, -- Anonymized patient identifier
  protocol_id TEXT NOT NULL, -- 'checkup_complet', 'cardio', 'neuro', 'abdominal', 'osteo'
  status TEXT DEFAULT 'pending', -- 'pending', 'in_progress', 'completed', 'failed'
  duration_seconds INTEGER,
  body_zones TEXT[] DEFAULT '{}',
  findings JSONB DEFAULT '{}',
  anomalies_detected INTEGER DEFAULT 0,
  risk_level TEXT, -- 'low', 'medium', 'high', 'critical'
  report_url TEXT,
  metadata JSONB DEFAULT '{}',
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.mri_scans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view scans of their cabinet" ON public.mri_scans
  FOR SELECT USING (
    cabinet_id IN (SELECT id FROM public.cabinets WHERE owner_id = auth.uid())
  );

CREATE POLICY "Users can create scans for their cabinet" ON public.mri_scans
  FOR INSERT WITH CHECK (
    cabinet_id IN (SELECT id FROM public.cabinets WHERE owner_id = auth.uid())
  );

CREATE POLICY "Users can update scans of their cabinet" ON public.mri_scans
  FOR UPDATE USING (
    cabinet_id IN (SELECT id FROM public.cabinets WHERE owner_id = auth.uid())
  );

-- Screening Protocols
CREATE TABLE public.screening_protocols (
  id TEXT PRIMARY KEY, -- 'checkup_complet', 'cardio', 'neuro', 'abdominal', 'osteo'
  name TEXT NOT NULL,
  name_fr TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL,
  body_zones TEXT[] NOT NULL,
  description TEXT,
  description_fr TEXT,
  sequence_types TEXT[] DEFAULT '{}', -- 'T1', 'T2', 'FLAIR', 'DWI'
  targets TEXT[] DEFAULT '{}', -- What to detect
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.screening_protocols ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view protocols" ON public.screening_protocols
  FOR SELECT USING (true);

-- Insert default protocols
INSERT INTO public.screening_protocols (id, name, name_fr, duration_minutes, body_zones, description, description_fr, sequence_types, targets) VALUES
  ('checkup_complet', 'Complete Check-up', 'Check-up complet', 15, ARRAY['head', 'thorax', 'abdomen', 'pelvis'], 'Full body screening for tumors and anomalies', 'Dépistage corps entier pour tumeurs et anomalies', ARRAY['T1', 'T2', 'FLAIR'], ARRAY['tumors', 'anomalies', 'organ_size']),
  ('cardio', 'Cardiovascular', 'Cardio-vasculaire', 8, ARRAY['thorax'], 'Heart, aorta and vessel examination', 'Examen du cœur, aorte et vaisseaux', ARRAY['T1', 'T2'], ARRAY['heart', 'aorta', 'vessels', 'valve_function']),
  ('neuro', 'Neurological', 'Neurologique', 10, ARRAY['head'], 'Brain, stroke and tumor detection', 'Cerveau, détection AVC et tumeurs', ARRAY['T1', 'T2', 'FLAIR', 'DWI'], ARRAY['brain', 'stroke', 'tumors', 'white_matter']),
  ('abdominal', 'Abdominal', 'Abdominal', 8, ARRAY['abdomen'], 'Liver, kidneys and pancreas examination', 'Examen du foie, reins et pancréas', ARRAY['T1', 'T2'], ARRAY['liver', 'kidneys', 'pancreas', 'spleen']),
  ('osteo', 'Osteoarticular', 'Ostéo-articulaire', 5, ARRAY['upper_limb', 'lower_limb'], 'Joint and bone examination', 'Examen des articulations et os', ARRAY['T1', 'PD'], ARRAY['joints', 'bones', 'cartilage', 'ligaments']);

-- Triggers for updated_at
CREATE TRIGGER update_cabinets_updated_at
  BEFORE UPDATE ON public.cabinets
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_mri_devices_updated_at
  BEFORE UPDATE ON public.mri_devices
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_mri_subscriptions_updated_at
  BEFORE UPDATE ON public.mri_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();