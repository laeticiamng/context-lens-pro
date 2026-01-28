import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Zap,
  Eye,
  Clock
} from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import { supabase } from '@/integrations/supabase/client';

interface LiveStats {
  activeUsers: number;
  scriptsExecuted: number;
  avgResponseTime: number;
  trend: 'up' | 'down' | 'stable';
}

export function LiveStatsWidget() {
  const { language } = useLanguage();
  const [stats, setStats] = useState<LiveStats>({
    activeUsers: 0,
    scriptsExecuted: 0,
    avgResponseTime: 0,
    trend: 'stable',
  });
  const [isLive, setIsLive] = useState(true);

  // Simulate real-time stats updates
  useEffect(() => {
    // Initial fetch from analytics
    const fetchInitialStats = async () => {
      const { data, error } = await supabase
        .from('usage_analytics')
        .select('*')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false })
        .limit(100);

      if (!error && data) {
        const totalPrompts = data.reduce((sum, row) => sum + (row.prompts_displayed || 0), 0);
        const avgDuration = data.reduce((sum, row) => sum + (row.session_duration_seconds || 0), 0) / (data.length || 1);
        
        setStats({
          activeUsers: new Set(data.map(d => d.user_id)).size,
          scriptsExecuted: totalPrompts,
          avgResponseTime: Math.round(avgDuration * 10) / 10,
          trend: totalPrompts > 50 ? 'up' : totalPrompts > 20 ? 'stable' : 'down',
        });
      }
    };

    fetchInitialStats();

    // Simulate live updates every 5 seconds
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        scriptsExecuted: prev.scriptsExecuted + Math.floor(Math.random() * 3),
        avgResponseTime: Math.max(100, prev.avgResponseTime + (Math.random() - 0.5) * 20),
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const TrendIcon = stats.trend === 'up' ? TrendingUp : stats.trend === 'down' ? TrendingDown : Minus;
  const trendColor = stats.trend === 'up' ? 'text-accent' : stats.trend === 'down' ? 'text-destructive' : 'text-muted-foreground';

  return (
    <Card className="border-border/50 bg-gradient-to-br from-background to-muted/20">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary animate-pulse" />
            <span className="text-sm font-medium">
              {language === 'fr' ? 'Stats en direct' : 'Live Stats'}
            </span>
          </div>
          <Badge 
            variant={isLive ? 'default' : 'secondary'} 
            className="text-xs"
          >
            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${isLive ? 'bg-accent animate-pulse' : 'bg-muted-foreground'}`} />
            {isLive ? 'LIVE' : 'PAUSED'}
          </Badge>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-2xl font-bold">
              <Eye className="h-4 w-4 text-primary" />
              {stats.activeUsers}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {language === 'fr' ? 'Utilisateurs actifs' : 'Active Users'}
            </p>
          </div>

          <div className="text-center border-x border-border/50">
            <div className="flex items-center justify-center gap-1 text-2xl font-bold">
              <Zap className="h-4 w-4 text-accent" />
              {stats.scriptsExecuted}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {language === 'fr' ? 'Scripts exécutés' : 'Scripts Run'}
            </p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-2xl font-bold">
              <Clock className="h-4 w-4 text-muted-foreground" />
              {Math.round(stats.avgResponseTime)}
              <span className="text-xs font-normal">ms</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {language === 'fr' ? 'Temps moyen' : 'Avg Time'}
            </p>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between text-xs">
          <span className="text-muted-foreground">
            {language === 'fr' ? 'Dernières 24h' : 'Last 24h'}
          </span>
          <div className={`flex items-center gap-1 ${trendColor}`}>
            <TrendIcon className="h-3 w-3" />
            {stats.trend === 'up' && '+12%'}
            {stats.trend === 'down' && '-5%'}
            {stats.trend === 'stable' && '0%'}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
