import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import DateRangeFilter from "./DateRangeFilter";
import { supabase } from "@/integrations/supabase/client";

interface Script {
  id: string;
  title: string;
  usage_count: number;
  created_at: string;
  is_active: boolean;
  tags: string[];
}

interface Device {
  id: string;
  device_name: string;
  tier: number;
  is_connected: boolean;
  last_connected_at: string | null;
}

interface AnalyticsData {
  date: string;
  usage: number;
  prompts: number;
}

interface AnalyticsWithDateRangeProps {
  scripts: Script[];
  devices: Device[];
  userId?: string;
}

const COLORS = {
  primary: "hsl(199 89% 48%)",
  accent: "hsl(172 66% 50%)",
  tier0: "hsl(160 84% 39%)",
  tier1: "hsl(199 89% 48%)",
  tier2: "hsl(262 83% 58%)",
  tier3: "hsl(38 92% 50%)",
  muted: "hsl(215 20% 55%)",
};

const AnalyticsWithDateRange = ({ scripts, devices, userId }: AnalyticsWithDateRangeProps) => {
  const [dateRange, setDateRange] = useState({
    from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    to: new Date(),
  });
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData[]>([]);
  const [loading, setLoading] = useState(false);

  const generateMockData = (): AnalyticsData[] => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const totalUsage = scripts.reduce((sum, s) => sum + s.usage_count, 0);
    
    return days.map((day) => ({
      date: day,
      usage: Math.floor((totalUsage / 7) * (0.5 + Math.random())),
      prompts: Math.floor(Math.random() * 50 + 20),
    }));
  };

  // Fetch real analytics data
  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!userId || !dateRange.from || !dateRange.to) return;
      
      setLoading(true);
      const { data, error } = await supabase
        .from("usage_analytics")
        .select("*")
        .eq("user_id", userId)
        .gte("created_at", dateRange.from.toISOString())
        .lte("created_at", dateRange.to.toISOString())
        .order("created_at", { ascending: true });

      if (!error && data) {
        // Group by date
        const grouped: Record<string, { usage: number; prompts: number }> = {};
        data.forEach((item) => {
          const date = new Date(item.created_at).toLocaleDateString("en-US", { weekday: "short" });
          if (!grouped[date]) {
            grouped[date] = { usage: 0, prompts: 0 };
          }
          grouped[date].usage += item.session_duration_seconds || 0;
          grouped[date].prompts += item.prompts_displayed || 0;
        });

        const formatted = Object.entries(grouped).map(([name, values]) => ({
          date: name,
          usage: Math.round(values.usage / 60), // Convert to minutes
          prompts: values.prompts,
        }));

        setAnalyticsData(formatted.length > 0 ? formatted : generateMockData());
      } else {
        setAnalyticsData(generateMockData());
      }
      setLoading(false);
    };

    fetchAnalytics();
  }, [userId, dateRange, scripts]);

  // Top scripts by usage
  const topScripts = useMemo(() => {
    return [...scripts]
      .sort((a, b) => b.usage_count - a.usage_count)
      .slice(0, 5)
      .map(s => ({
        name: s.title.slice(0, 15) + (s.title.length > 15 ? "..." : ""),
        usage: s.usage_count,
      }));
  }, [scripts]);

  // Device tier distribution
  const tierDistribution = useMemo(() => {
    const tiers = [
      { name: "T0 - Universal", value: 0, color: COLORS.tier0 },
      { name: "T1 - SDK", value: 0, color: COLORS.tier1 },
      { name: "T2 - On-Device", value: 0, color: COLORS.tier2 },
      { name: "T3 - AR", value: 0, color: COLORS.tier3 },
    ];
    
    devices.forEach(d => {
      if (tiers[d.tier]) {
        tiers[d.tier].value += 1;
      }
    });
    
    // Add sample data if no devices
    if (devices.length === 0) {
      tiers[0].value = 2;
      tiers[1].value = 3;
    }
    
    return tiers.filter(t => t.value > 0);
  }, [devices]);

  // Tag cloud data
  const tagData = useMemo(() => {
    const tagCounts: Record<string, number> = {};
    scripts.forEach(s => {
      s.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });
    
    return Object.entries(tagCounts)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  }, [scripts]);

  const totalUsage = scripts.reduce((sum, s) => sum + s.usage_count, 0);
  const avgPerScript = scripts.length > 0 ? Math.round(totalUsage / scripts.length) : 0;
  const activeRate = scripts.length > 0 
    ? Math.round((scripts.filter(s => s.is_active).length / scripts.length) * 100) 
    : 0;

  return (
    <div className="space-y-6">
      {/* Date Range Filter */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Analytics Overview</h3>
        <DateRangeFilter
          value={dateRange}
          onChange={(range) => setDateRange(range)}
        />
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="glass-card border-border/50">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-primary">{totalUsage}</p>
            <p className="text-xs text-muted-foreground">Total Prompts Displayed</p>
          </CardContent>
        </Card>
        <Card className="glass-card border-border/50">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-accent">{avgPerScript}</p>
            <p className="text-xs text-muted-foreground">Avg Usage per Script</p>
          </CardContent>
        </Card>
        <Card className="glass-card border-border/50">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-accent">{activeRate}%</p>
            <p className="text-xs text-muted-foreground">Active Scripts Rate</p>
          </CardContent>
        </Card>
        <Card className="glass-card border-border/50">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-primary">{devices.filter(d => d.is_connected).length}</p>
            <p className="text-xs text-muted-foreground">Connected Devices</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Usage Trend */}
        <Card className="glass-card border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Usage Trend</CardTitle>
            <CardDescription>Prompts displayed over selected period</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              {loading ? (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  Loading...
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analyticsData}>
                    <defs>
                      <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="date" 
                      stroke="hsl(var(--muted-foreground))" 
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))" 
                      fontSize={12}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "hsl(var(--card))", 
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px"
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="prompts"
                      stroke={COLORS.primary}
                      fillOpacity={1}
                      fill="url(#colorUsage)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Top Scripts */}
        <Card className="glass-card border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Top Scripts</CardTitle>
            <CardDescription>Most used scripts by prompt count</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              {topScripts.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topScripts} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis 
                      type="category" 
                      dataKey="name" 
                      stroke="hsl(var(--muted-foreground))" 
                      fontSize={11}
                      width={80}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "hsl(var(--card))", 
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px"
                      }}
                    />
                    <Bar 
                      dataKey="usage" 
                      fill={COLORS.accent}
                      radius={[0, 4, 4, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  No script data yet
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Second Row */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Device Distribution */}
        <Card className="glass-card border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Device Tiers</CardTitle>
            <CardDescription>Distribution by capability level</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={tierDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {tierDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--card))", 
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px"
                    }}
                  />
                  <Legend 
                    wrapperStyle={{ fontSize: "11px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Tag Cloud */}
        <Card className="glass-card border-border/50 md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Popular Tags</CardTitle>
            <CardDescription>Most used content categories</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-48 flex flex-wrap items-center justify-center gap-2 p-4">
              {tagData.length > 0 ? (
                tagData.map(({ tag, count }) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 rounded-full bg-secondary text-foreground/80 transition-transform hover:scale-105"
                    style={{
                      fontSize: `${Math.min(18, 12 + count * 2)}px`,
                      opacity: 0.5 + (count / (tagData[0]?.count || 1)) * 0.5
                    }}
                  >
                    {tag}
                  </span>
                ))
              ) : (
                <div className="text-muted-foreground text-sm">
                  Add tags to your scripts to see analytics
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsWithDateRange;
