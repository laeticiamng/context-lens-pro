import { Check, X, ExternalLink, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DeviceCapability {
  device_id: string;
  name: string;
  manufacturer: string;
  tier: number;
  image?: string;
  has_camera: boolean;
  has_hud_api: boolean;
  sdk_status: "available" | "early_access" | "uncertain" | "closed";
  display_type: string;
  battery_hours: number;
  prescription_support: boolean;
  notes?: string;
}

const devices: DeviceCapability[] = [
  {
    device_id: "even_g2",
    name: "Even G2",
    manufacturer: "Even Realities",
    tier: 1,
    has_camera: false,
    has_hud_api: true,
    sdk_status: "early_access",
    display_type: "Monochrome Green",
    battery_hours: 48,
    prescription_support: true,
    notes: "Even Hub SDK (Flutter) — Early Access Pilot",
  },
  {
    device_id: "vuzix_z100",
    name: "Z100",
    manufacturer: "Vuzix",
    tier: 1,
    has_camera: false,
    has_hud_api: true,
    sdk_status: "available",
    display_type: "Monochrome",
    battery_hours: 12,
    prescription_support: true,
    notes: "Ultralite SDK for Android/iOS",
  },
  {
    device_id: "rokid",
    name: "AR Glasses",
    manufacturer: "Rokid",
    tier: 2,
    has_camera: true,
    has_hud_api: true,
    sdk_status: "early_access",
    display_type: "Color OLED",
    battery_hours: 5,
    prescription_support: false,
    notes: "Developer Program required — Testing needed",
  },
  {
    device_id: "rayneo_x3",
    name: "X3 Pro",
    manufacturer: "RayNeo",
    tier: 2,
    has_camera: true,
    has_hud_api: true,
    sdk_status: "uncertain",
    display_type: "Color Micro-LED",
    battery_hours: 6,
    prescription_support: false,
    notes: "Creator Mode announced — SDK status uncertain",
  },
  {
    device_id: "meta_rayban",
    name: "Ray-Ban Display",
    manufacturer: "Meta",
    tier: 0,
    has_camera: true,
    has_hud_api: false,
    sdk_status: "closed",
    display_type: "Micro-LED",
    battery_hours: 4,
    prescription_support: true,
    notes: "Closed ecosystem — Phone fallback only",
  },
];

const StatusBadge = ({ status }: { status: DeviceCapability["sdk_status"] }) => {
  const styles = {
    available: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    early_access: "bg-primary/10 text-primary border-primary/30",
    uncertain: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    closed: "bg-destructive/10 text-destructive border-destructive/30",
  };
  
  const labels = {
    available: "SDK Available",
    early_access: "Early Access",
    uncertain: "Uncertain",
    closed: "Closed",
  };

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs border ${styles[status]}`}>
      {status === "uncertain" && <AlertCircle className="h-3 w-3" />}
      {labels[status]}
    </span>
  );
};

const DevicesSection = () => {
  return (
    <section id="devices" className="py-24 md:py-32 bg-secondary/20">
      <div className="container px-4">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Device <span className="text-gradient">Compatibility Matrix</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Real capabilities, verified SDKs. We only promise what we can deliver.
          </p>
        </div>

        {/* Device Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {devices.map((device) => (
            <div
              key={device.device_id}
              className="glass-card rounded-2xl overflow-hidden group hover:border-primary/30 transition-all duration-300"
            >
              {/* Header */}
              <div className="p-6 pb-4 border-b border-border/50">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">{device.manufacturer}</p>
                    <h3 className="text-lg font-semibold">{device.name}</h3>
                  </div>
                  <span className={`tier-badge tier-${device.tier}`}>
                    Tier {device.tier}
                  </span>
                </div>
                <StatusBadge status={device.sdk_status} />
              </div>

              {/* Capabilities */}
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    {device.has_camera ? (
                      <Check className="h-4 w-4 text-accent" />
                    ) : (
                      <X className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className={device.has_camera ? "text-foreground" : "text-muted-foreground"}>
                      Camera
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {device.has_hud_api ? (
                      <Check className="h-4 w-4 text-accent" />
                    ) : (
                      <X className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className={device.has_hud_api ? "text-foreground" : "text-muted-foreground"}>
                      HUD API
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {device.prescription_support ? (
                      <Check className="h-4 w-4 text-accent" />
                    ) : (
                      <X className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className={device.prescription_support ? "text-foreground" : "text-muted-foreground"}>
                      Rx Support
                    </span>
                  </div>
                  <div className="text-muted-foreground">
                    <span className="text-foreground font-medium">{device.battery_hours}h</span> battery
                  </div>
                </div>

                <div className="pt-4 border-t border-border/50">
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    <span className="font-medium text-foreground/80">Display:</span> {device.display_type}
                  </p>
                  {device.notes && (
                    <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                      {device.notes}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">Don't see your device?</p>
          <Button variant="glass">
            Request Device Support
            <ExternalLink className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default DevicesSection;
