import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Monitor, 
  Clock, 
  MapPin, 
  LogOut,
  Smartphone,
  Laptop,
  AlertCircle
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/i18n/LanguageContext";

interface Session {
  id: string;
  device: string;
  browser: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
}

const SessionManagement = () => {
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(false);

  // Simulated sessions (in production, you'd fetch from an auth provider)
  useEffect(() => {
    const currentSession: Session = {
      id: "current",
      device: "Desktop",
      browser: navigator.userAgent.includes("Chrome") ? "Chrome" : 
               navigator.userAgent.includes("Firefox") ? "Firefox" : 
               navigator.userAgent.includes("Safari") ? "Safari" : "Browser",
      location: language === "fr" ? "Localisation actuelle" : "Current Location",
      lastActive: language === "fr" ? "Maintenant" : "Now",
      isCurrent: true,
    };

    // Simulate other sessions
    const mockSessions: Session[] = [
      currentSession,
      {
        id: "session-2",
        device: "Mobile",
        browser: "Safari iOS",
        location: "Paris, France",
        lastActive: language === "fr" ? "Il y a 2 heures" : "2 hours ago",
        isCurrent: false,
      },
    ];

    setSessions(mockSessions);
  }, [language]);

  const handleRevokeSession = async (sessionId: string) => {
    setLoading(true);
    // In production, you'd call your auth provider's API
    await new Promise(r => setTimeout(r, 500));
    
    setSessions(prev => prev.filter(s => s.id !== sessionId));
    toast({
      title: t.session.revoked,
      description: t.session.revokedDesc,
    });
    setLoading(false);
  };

  const handleRevokeAllOther = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 500));
    
    setSessions(prev => prev.filter(s => s.isCurrent));
    toast({
      title: t.session.allRevoked,
      description: t.session.allRevokedDesc,
    });
    setLoading(false);
  };

  const getDeviceIcon = (device: string) => {
    if (device.toLowerCase().includes("mobile")) return Smartphone;
    return Laptop;
  };

  return (
    <Card className="glass-card border-border/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <Monitor className="h-5 w-5 text-primary" />
              {t.session.title}
            </CardTitle>
            <CardDescription>
              {t.session.description}
            </CardDescription>
          </div>
          {sessions.length > 1 && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleRevokeAllOther}
              disabled={loading}
            >
              <LogOut className="h-4 w-4 mr-2" />
              {t.session.signOutOthers}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {sessions.map((session) => {
          const DeviceIcon = getDeviceIcon(session.device);
          
          return (
            <div 
              key={session.id}
              className={`flex items-center gap-4 p-3 rounded-lg ${
                session.isCurrent ? "bg-primary/5 border border-primary/20" : "bg-secondary/30"
              }`}
            >
              <div className={`p-2 rounded-lg ${session.isCurrent ? "bg-primary/10" : "bg-secondary"}`}>
                <DeviceIcon className={`h-5 w-5 ${session.isCurrent ? "text-primary" : "text-muted-foreground"}`} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{session.device}</span>
                  <span className="text-xs text-muted-foreground">• {session.browser}</span>
                  {session.isCurrent && (
                    <Badge variant="secondary" className="text-xs">{t.session.current}</Badge>
                  )}
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {session.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {session.lastActive}
                  </span>
                </div>
              </div>

              {!session.isCurrent && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleRevokeSession(session.id)}
                  disabled={loading}
                  className="text-destructive hover:text-destructive"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              )}
            </div>
          );
        })}

        <div className="pt-3 border-t border-border/50">
          <div className="flex items-start gap-2 p-3 rounded-lg bg-secondary/30">
            <AlertCircle className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
            <p className="text-xs text-muted-foreground">
              {t.session.securityTip}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SessionManagement;
