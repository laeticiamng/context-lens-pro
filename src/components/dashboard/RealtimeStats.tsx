import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { 
  TrendingUp, 
  TrendingDown, 
  Activity,
  Eye,
  Clock,
  Zap
} from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

interface RealtimeStatsProps {
  scriptsCount: number;
  activeScripts: number;
  totalUsage: number;
  connectedDevices: number;
}

const RealtimeStats = ({ 
  scriptsCount, 
  activeScripts, 
  totalUsage, 
  connectedDevices 
}: RealtimeStatsProps) => {
  const { language } = useLanguage();
  const [liveActivity, setLiveActivity] = useState(0);
  const [lastActivity, setLastActivity] = useState<Date | null>(null);

  // Simulate live activity
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveActivity(Math.floor(Math.random() * 10));
      if (Math.random() > 0.7) {
        setLastActivity(new Date());
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const t = {
    liveNow: language === "fr" ? "En direct" : "Live Now",
    activity: language === "fr" ? "Activité" : "Activity",
    promptsPerMin: language === "fr" ? "prompts/min" : "prompts/min",
    lastSync: language === "fr" ? "Dernière sync" : "Last sync",
    justNow: language === "fr" ? "À l'instant" : "Just now",
    avgSession: language === "fr" ? "Session moy." : "Avg session",
  };

  const getTimeAgo = (date: Date | null) => {
    if (!date) return "--";
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 10) return t.justNow;
    if (seconds < 60) return `${seconds}s`;
    return `${Math.floor(seconds / 60)}m`;
  };

  return (
    <Card className="glass-card border-border/50 overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
          </span>
          <span className="text-xs font-medium text-accent">{t.liveNow}</span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Live Activity */}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Activity className="h-3.5 w-3.5" />
              <span className="text-xs">{t.activity}</span>
            </div>
            <div className="flex items-baseline gap-1">
              <AnimatePresence mode="wait">
                <motion.span
                  key={liveActivity}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="text-xl font-bold"
                >
                  {liveActivity}
                </motion.span>
              </AnimatePresence>
              <span className="text-xs text-muted-foreground">{t.promptsPerMin}</span>
            </div>
          </div>

          {/* Last Sync */}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Zap className="h-3.5 w-3.5" />
              <span className="text-xs">{t.lastSync}</span>
            </div>
            <div className="text-xl font-bold">
              {getTimeAgo(lastActivity)}
            </div>
          </div>

          {/* Usage Trend */}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Eye className="h-3.5 w-3.5" />
              <span className="text-xs">{language === "fr" ? "Vues totales" : "Total views"}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold">{totalUsage}</span>
              <span className="flex items-center text-xs text-accent">
                <TrendingUp className="h-3 w-3 mr-0.5" />
                +12%
              </span>
            </div>
          </div>

          {/* Avg Session */}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              <span className="text-xs">{t.avgSession}</span>
            </div>
            <div className="text-xl font-bold">
              4m 32s
            </div>
          </div>
        </div>

        {/* Activity bar */}
        <div className="mt-4 pt-4 border-t border-border/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground">
              {language === "fr" ? "Activité aujourd'hui" : "Today's activity"}
            </span>
            <span className="text-xs font-medium">{activeScripts} {language === "fr" ? "actifs" : "active"}</span>
          </div>
          <div className="flex gap-1 h-8">
            {[...Array(24)].map((_, i) => {
              const height = Math.random() * 100;
              const isCurrent = i === new Date().getHours();
              return (
                <div
                  key={i}
                  className={`flex-1 rounded-sm transition-all ${
                    isCurrent ? "bg-primary" : "bg-secondary hover:bg-primary/50"
                  }`}
                  style={{ height: `${Math.max(height, 10)}%`, alignSelf: "flex-end" }}
                />
              );
            })}
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-[10px] text-muted-foreground">00:00</span>
            <span className="text-[10px] text-muted-foreground">12:00</span>
            <span className="text-[10px] text-muted-foreground">23:59</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RealtimeStats;
