import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface VisitorState {
  visitorCount: number;
  isConnected: boolean;
}

export function useRealtimeVisitors(channelName: string = "landing-visitors") {
  const [state, setState] = useState<VisitorState>({
    visitorCount: 0,
    isConnected: false,
  });

  useEffect(() => {
    // Generate a unique visitor ID for this session
    const visitorId = `visitor-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const channel = supabase.channel(channelName, {
      config: {
        presence: {
          key: visitorId,
        },
      },
    });

    channel
      .on("presence", { event: "sync" }, () => {
        const presenceState = channel.presenceState();
        const count = Object.keys(presenceState).length;
        setState({ visitorCount: count, isConnected: true });
      })
      .on("presence", { event: "join" }, ({ key, newPresences }) => {
        console.log("Visitor joined:", key, newPresences);
      })
      .on("presence", { event: "leave" }, ({ key, leftPresences }) => {
        console.log("Visitor left:", key, leftPresences);
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({
            visitor_id: visitorId,
            online_at: new Date().toISOString(),
            page: window.location.pathname,
          });
        }
      });

    return () => {
      channel.unsubscribe();
    };
  }, [channelName]);

  return state;
}
