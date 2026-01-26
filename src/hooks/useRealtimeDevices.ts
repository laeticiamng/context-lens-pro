import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { RealtimeChannel } from "@supabase/supabase-js";

interface Device {
  id: string;
  device_name: string;
  device_type: string;
  manufacturer: string | null;
  tier: number;
  is_connected: boolean;
  last_connected_at: string | null;
}

export const useRealtimeDevices = (userId: string | undefined) => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!userId) return;

    let channel: RealtimeChannel;

    const fetchDevices = async () => {
      const { data, error } = await supabase
        .from("connected_devices")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        toast({ title: "Error", description: "Failed to load devices", variant: "destructive" });
      } else {
        setDevices(data || []);
      }
      setLoading(false);
    };

    fetchDevices();

    // Subscribe to realtime changes
    channel = supabase
      .channel('devices-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'connected_devices',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setDevices(prev => [payload.new as Device, ...prev]);
            toast({ title: "Device Added", description: `${(payload.new as Device).device_name} connected` });
          } else if (payload.eventType === 'UPDATE') {
            setDevices(prev => prev.map(d => 
              d.id === payload.new.id ? payload.new as Device : d
            ));
          } else if (payload.eventType === 'DELETE') {
            setDevices(prev => prev.filter(d => d.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      channel?.unsubscribe();
    };
  }, [userId, toast]);

  const refreshDevices = async () => {
    if (!userId) return;
    const { data } = await supabase
      .from("connected_devices")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setDevices(data);
  };

  return { devices, loading, refreshDevices, setDevices };
};
