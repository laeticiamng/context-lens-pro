// Cabinet Management Hook
// CLP-LUNETTES-IRM-2026-001

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';

export interface Cabinet {
  id: string;
  name: string;
  owner_id: string;
  address: string | null;
  city: string | null;
  postal_code: string | null;
  country: string | null;
  phone: string | null;
  email: string | null;
  siret: string | null;
  created_at: string;
  updated_at: string;
}

export interface MRIDevice {
  id: string;
  cabinet_id: string;
  device_type: string;
  serial_number: string;
  manufacturer: string;
  model: string;
  firmware_version: string | null;
  ip_address: string | null;
  status: string;
  last_seen_at: string | null;
  last_maintenance_at: string | null;
  next_maintenance_at: string | null;
  capabilities: Record<string, unknown>;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface MRISubscription {
  id: string;
  cabinet_id: string;
  plan_id: string;
  status: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  current_period_start: string;
  current_period_end: string;
  scans_this_period: number;
  scans_limit: number | null;
  glasses_included: number;
  created_at: string;
  updated_at: string;
}

export interface MRIScan {
  id: string;
  cabinet_id: string;
  device_id: string | null;
  patient_reference: string;
  protocol_id: string;
  status: string;
  duration_seconds: number | null;
  body_zones: string[];
  findings: Record<string, unknown>;
  anomalies_detected: number;
  risk_level: string | null;
  report_url: string | null;
  metadata: Record<string, unknown>;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
}

export interface ScreeningProtocol {
  id: string;
  name: string;
  name_fr: string;
  duration_minutes: number;
  body_zones: string[];
  description: string | null;
  description_fr: string | null;
  sequence_types: string[];
  targets: string[];
  is_active: boolean;
  created_at: string;
}

export function useCabinet() {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch cabinet
  const { data: cabinet, isLoading: isLoadingCabinet, error: cabinetError } = useQuery({
    queryKey: ['cabinet', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('cabinets')
        .select('*')
        .eq('owner_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('[useCabinet] Failed to fetch cabinet:', error);
        throw error;
      }
      return data as Cabinet | null;
    },
    enabled: !!user,
    retry: 2,
  });

  // Fetch MRI devices
  const { data: devices = [], isLoading: isLoadingDevices, error: devicesError } = useQuery({
    queryKey: ['mri-devices', cabinet?.id],
    queryFn: async () => {
      if (!cabinet) return [];
      
      const { data, error } = await supabase
        .from('mri_devices')
        .select('*')
        .eq('cabinet_id', cabinet.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('[useCabinet] Failed to fetch devices:', error);
        throw error;
      }
      return data as MRIDevice[];
    },
    enabled: !!cabinet,
    retry: 2,
  });

  // Fetch subscription
  const { data: subscription, isLoading: isLoadingSubscription } = useQuery({
    queryKey: ['mri-subscription', cabinet?.id],
    queryFn: async () => {
      if (!cabinet) return null;
      
      const { data, error } = await supabase
        .from('mri_subscriptions')
        .select('*')
        .eq('cabinet_id', cabinet.id)
        .maybeSingle();

      if (error) throw error;
      return data as MRISubscription | null;
    },
    enabled: !!cabinet,
  });

  // Fetch scans
  const { data: scans = [], isLoading: isLoadingScans } = useQuery({
    queryKey: ['mri-scans', cabinet?.id],
    queryFn: async () => {
      if (!cabinet) return [];
      
      const { data, error } = await supabase
        .from('mri_scans')
        .select('*')
        .eq('cabinet_id', cabinet.id)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      return data as MRIScan[];
    },
    enabled: !!cabinet,
  });

  // Fetch screening protocols
  const { data: protocols = [] } = useQuery({
    queryKey: ['screening-protocols'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('screening_protocols')
        .select('*')
        .eq('is_active', true)
        .order('duration_minutes', { ascending: true });

      if (error) throw error;
      return data as ScreeningProtocol[];
    },
  });

  // Create cabinet mutation
  const createCabinet = useMutation({
    mutationFn: async (cabinetData: { name: string; address?: string; city?: string; postal_code?: string; country?: string; phone?: string; email?: string; siret?: string }) => {
      if (!user) throw new Error('Not authenticated');

      const insertData = {
        name: cabinetData.name,
        owner_id: user.id,
        address: cabinetData.address,
        city: cabinetData.city,
        postal_code: cabinetData.postal_code,
        country: cabinetData.country || 'FR',
        phone: cabinetData.phone,
        email: cabinetData.email,
        siret: cabinetData.siret,
      };

      const { data, error } = await supabase
        .from('cabinets')
        .insert(insertData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cabinet'] });
    },
  });

  // Update cabinet mutation
  const updateCabinet = useMutation({
    mutationFn: async (cabinetData: Partial<Cabinet>) => {
      if (!cabinet) throw new Error('No cabinet found');

      const { data, error } = await supabase
        .from('cabinets')
        .update(cabinetData)
        .eq('id', cabinet.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cabinet'] });
    },
  });

  // Add device mutation
  const addDevice = useMutation({
    mutationFn: async (deviceData: { 
      serial_number: string; 
      manufacturer: string; 
      model: string; 
      device_type?: string; 
      firmware_version?: string;
      ip_address?: string;
    }) => {
      if (!cabinet) throw new Error('No cabinet found');

      const insertData = {
        cabinet_id: cabinet.id,
        serial_number: deviceData.serial_number,
        manufacturer: deviceData.manufacturer,
        model: deviceData.model,
        device_type: deviceData.device_type || 'chipiron_squid',
        firmware_version: deviceData.firmware_version,
        ip_address: deviceData.ip_address,
      };

      const { data, error } = await supabase
        .from('mri_devices')
        .insert(insertData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mri-devices'] });
    },
  });

  // Create scan mutation with validation
  const createScan = useMutation({
    mutationFn: async (scanData: Partial<MRIScan>) => {
      if (!cabinet) throw new Error('No cabinet found');
      
      // Validate required fields
      if (!scanData.patient_reference || scanData.patient_reference.trim().length < 3) {
        throw new Error('Patient reference is required (min 3 characters)');
      }
      if (!scanData.protocol_id || scanData.protocol_id.trim().length === 0) {
        throw new Error('Protocol ID is required');
      }

      console.log('[useCabinet] Creating scan:', { 
        patient_reference: scanData.patient_reference, 
        protocol_id: scanData.protocol_id 
      });

      const { data, error } = await supabase
        .from('mri_scans')
        .insert({
          cabinet_id: cabinet.id,
          patient_reference: scanData.patient_reference.trim(),
          protocol_id: scanData.protocol_id,
          device_id: scanData.device_id ?? null,
        })
        .select()
        .single();

      if (error) {
        console.error('[useCabinet] Failed to create scan:', error);
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mri-scans'] });
    },
  });

  // Update scan mutation
  const updateScan = useMutation({
    mutationFn: async ({ id, status, duration_seconds, completed_at, anomalies_detected, risk_level, report_url }: { 
      id: string; 
      status?: string;
      duration_seconds?: number;
      completed_at?: string;
      anomalies_detected?: number;
      risk_level?: string;
      report_url?: string;
    }) => {
      const { data, error } = await supabase
        .from('mri_scans')
        .update({
          status,
          duration_seconds,
          completed_at,
          anomalies_detected,
          risk_level,
          report_url,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mri-scans'] });
    },
  });

  // Statistics
  const todayScans = scans.filter(s => {
    const scanDate = new Date(s.created_at).toDateString();
    const today = new Date().toDateString();
    return scanDate === today;
  });

  const monthlyStats = {
    totalScans: scans.filter(s => {
      const scanDate = new Date(s.created_at);
      const now = new Date();
      return scanDate.getMonth() === now.getMonth() && scanDate.getFullYear() === now.getFullYear();
    }).length,
    anomaliesDetected: scans.reduce((acc, s) => acc + s.anomalies_detected, 0),
    avgDuration: scans.length > 0
      ? Math.round(scans.reduce((acc, s) => acc + (s.duration_seconds || 0), 0) / scans.length)
      : 0,
  };

  return {
    // Data
    user,
    cabinet,
    devices,
    subscription,
    scans,
    protocols,
    todayScans,
    monthlyStats,
    
    // Loading states
    isLoading: isLoadingCabinet || isLoadingDevices || isLoadingSubscription || isLoadingScans,
    isLoadingCabinet,
    isLoadingDevices,
    isLoadingSubscription,
    isLoadingScans,
    
    // Mutations
    createCabinet,
    updateCabinet,
    addDevice,
    createScan,
    updateScan,
  };
}
