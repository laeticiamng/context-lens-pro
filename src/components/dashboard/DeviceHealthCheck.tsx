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
import { useLanguage } from "@/i18n/LanguageContext";

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
  nameKey: string;
  status: "good" | "warning" | "error";
  value: string;
  valueKey: string;
  icon: React.ElementType;
}

const DeviceHealthCheck = ({ device, onClose }: DeviceHealthCheckProps) => {
  const { language } = useLanguage();
  const [checking, setChecking] = useState(false);
  const [progress, setProgress] = useState(0);
  const [metrics, setMetrics] = useState<HealthMetric[] | null>(null);

  const t = {
    healthCheck: language === "fr" ? "Diagnostic" : "Health Check",
    runningDiagnostics: language === "fr" ? "Exécution des diagnostics..." : "Running diagnostics...",
    runHealthCheckDesc: language === "fr" 
      ? "Lancez un diagnostic pour vérifier l'état de l'appareil" 
      : "Run a health check to diagnose device status",
    close: language === "fr" ? "Fermer" : "Close",
    runHealthCheck: language === "fr" ? "Lancer le diagnostic" : "Run Health Check",
    rerunCheck: language === "fr" ? "Relancer" : "Re-run Check",
    healthy: language === "fr" ? "OK" : "Healthy",
    warnings: language === "fr" ? "Avertissements" : "Warnings",
    issuesFound: language === "fr" ? "Problèmes détectés" : "Issues Found",
    connection: language === "fr" ? "Connexion" : "Connection",
    battery: language === "fr" ? "Batterie" : "Battery",
    sdkResponse: language === "fr" ? "Réponse SDK" : "SDK Response",
    firmware: language === "fr" ? "Firmware" : "Firmware",
    stable: language === "fr" ? "Stable" : "Stable",
    offline: language === "fr" ? "Hors ligne" : "Offline",
    unknown: language === "fr" ? "Inconnu" : "Unknown",
    timeout: language === "fr" ? "Timeout" : "Timeout",
    unableToCheck: language === "fr" ? "Vérification impossible" : "Unable to check",
  };

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
          { name: t.connection, nameKey: "connection", status: "good", value: t.stable, valueKey: "stable", icon: Wifi },
          { name: t.battery, nameKey: "battery", status: "good", value: "85%", valueKey: "85", icon: Battery },
          { name: t.sdkResponse, nameKey: "sdkResponse", status: "good", value: "42ms", valueKey: "42ms", icon: Activity },
          { name: t.firmware, nameKey: "firmware", status: "good", value: "v2.1.3", valueKey: "v2.1.3", icon: Cpu },
        ]
      : [
          { name: t.connection, nameKey: "connection", status: "error", value: t.offline, valueKey: "offline", icon: Wifi },
          { name: t.battery, nameKey: "battery", status: "warning", value: t.unknown, valueKey: "unknown", icon: Battery },
          { name: t.sdkResponse, nameKey: "sdkResponse", status: "error", value: t.timeout, valueKey: "timeout", icon: Activity },
          { name: t.firmware, nameKey: "firmware", status: "warning", value: t.unableToCheck, valueKey: "unableToCheck", icon: Cpu },
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
            <CardDescription>Tier {device.tier} • {t.healthCheck}</CardDescription>
          </div>
          {overallStatus && (
            <Badge className={getStatusColor(overallStatus)}>
              {overallStatus === "good" && t.healthy}
              {overallStatus === "warning" && t.warnings}
              {overallStatus === "error" && t.issuesFound}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {checking ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{t.runningDiagnostics}</span>
              <span className="font-mono">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        ) : metrics ? (
          <div className="grid grid-cols-2 gap-3">
            {metrics.map((metric) => (
              <div
                key={metric.nameKey}
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
              {t.runHealthCheckDesc}
            </p>
          </div>
        )}

        <div className="flex gap-3">
          <Button variant="ghost" className="flex-1" onClick={onClose}>
            {t.close}
          </Button>
          <Button
            variant="hero"
            className="flex-1"
            onClick={runHealthCheck}
            disabled={checking}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${checking ? "animate-spin" : ""}`} />
            {metrics ? t.rerunCheck : t.runHealthCheck}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DeviceHealthCheck;
