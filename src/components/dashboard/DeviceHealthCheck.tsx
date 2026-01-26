import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Activity, 
  Wifi, 
  Battery, 
  Cpu, 
  Check, 
  X, 
  AlertTriangle,
  RefreshCw,
  Glasses
} from "lucide-react";

interface Device {
  id: string;
  device_name: string;
  device_type: string;
  tier: number;
  is_connected: boolean;
}

interface DeviceHealthCheckProps {
  device: Device;
  onClose: () => void;
}

interface HealthMetric {
  name: string;
  status: "good" | "warning" | "error";
  value: string;
  icon: React.ElementType;
}

const DeviceHealthCheck = ({ device, onClose }: DeviceHealthCheckProps) => {
  const [checking, setChecking] = useState(false);
  const [progress, setProgress] = useState(0);
  const [metrics, setMetrics] = useState<HealthMetric[] | null>(null);

  const runHealthCheck = async () => {
    setChecking(true);
    setProgress(0);
    setMetrics(null);

    // Simulate health check progress
    const steps = [20, 45, 70, 90, 100];
    for (const step of steps) {
      await new Promise((r) => setTimeout(r, 400));
      setProgress(step);
    }

    // Simulate results based on connection status
    const simulatedMetrics: HealthMetric[] = device.is_connected
      ? [
          { name: "Connection", status: "good", value: "Stable", icon: Wifi },
          { name: "Battery", status: "good", value: "85%", icon: Battery },
          { name: "SDK Response", status: "good", value: "42ms", icon: Activity },
          { name: "Firmware", status: "good", value: "v2.1.3", icon: Cpu },
        ]
      : [
          { name: "Connection", status: "error", value: "Offline", icon: Wifi },
          { name: "Battery", status: "warning", value: "Unknown", icon: Battery },
          { name: "SDK Response", status: "error", value: "Timeout", icon: Activity },
          { name: "Firmware", status: "warning", value: "Unable to check", icon: Cpu },
        ];

    setMetrics(simulatedMetrics);
    setChecking(false);
  };

  const getStatusIcon = (status: HealthMetric["status"]) => {
    switch (status) {
      case "good":
        return <Check className="h-4 w-4 text-accent" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-primary" />;
      case "error":
        return <X className="h-4 w-4 text-destructive" />;
    }
  };

  const getStatusColor = (status: HealthMetric["status"]) => {
    switch (status) {
      case "good":
        return "bg-accent/10 text-accent border-accent/30";
      case "warning":
        return "bg-primary/10 text-primary border-primary/30";
      case "error":
        return "bg-destructive/10 text-destructive border-destructive/30";
    }
  };

  const overallStatus = metrics
    ? metrics.some((m) => m.status === "error")
      ? "error"
      : metrics.some((m) => m.status === "warning")
      ? "warning"
      : "good"
    : null;

  return (
    <Card className="glass-card border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Glasses className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-base">{device.device_name}</CardTitle>
            <CardDescription>Tier {device.tier} • Health Check</CardDescription>
          </div>
          {overallStatus && (
            <Badge className={getStatusColor(overallStatus)}>
              {overallStatus === "good" && "Healthy"}
              {overallStatus === "warning" && "Warnings"}
              {overallStatus === "error" && "Issues Found"}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {checking ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Running diagnostics...</span>
              <span className="font-mono">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        ) : metrics ? (
          <div className="grid grid-cols-2 gap-3">
            {metrics.map((metric) => (
              <div
                key={metric.name}
                className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30"
              >
                <metric.icon className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">{metric.name}</p>
                  <p className="text-sm font-medium truncate">{metric.value}</p>
                </div>
                {getStatusIcon(metric.status)}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4">
            <Activity className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              Run a health check to diagnose device status
            </p>
          </div>
        )}

        <div className="flex gap-3">
          <Button variant="ghost" className="flex-1" onClick={onClose}>
            Close
          </Button>
          <Button
            variant="hero"
            className="flex-1"
            onClick={runHealthCheck}
            disabled={checking}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${checking ? "animate-spin" : ""}`} />
            {metrics ? "Re-run Check" : "Run Health Check"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DeviceHealthCheck;
