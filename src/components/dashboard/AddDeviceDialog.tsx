import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Bluetooth, 
  Wifi, 
  Search, 
  Check, 
  X, 
  Loader2, 
  Glasses,
  Smartphone,
  AlertCircle,
  ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface DeviceSpec {
  id: string;
  name: string;
  manufacturer: string;
  tier: number;
  hasCamera: boolean;
  hasHudApi: boolean;
  connectionType: "bluetooth" | "wifi" | "both";
}

const knownDevices: DeviceSpec[] = [
  { id: "even_g2", name: "Even G2", manufacturer: "Even Realities", tier: 1, hasCamera: false, hasHudApi: true, connectionType: "bluetooth" },
  { id: "vuzix_z100", name: "Vuzix Z100", manufacturer: "Vuzix", tier: 1, hasCamera: false, hasHudApi: true, connectionType: "bluetooth" },
  { id: "xreal_air2", name: "Xreal Air 2", manufacturer: "Xreal", tier: 1, hasCamera: false, hasHudApi: true, connectionType: "bluetooth" },
  { id: "rokid_max", name: "Rokid Max", manufacturer: "Rokid", tier: 2, hasCamera: true, hasHudApi: true, connectionType: "wifi" },
  { id: "meta_quest3", name: "Meta Quest 3", manufacturer: "Meta", tier: 2, hasCamera: true, hasHudApi: true, connectionType: "wifi" },
  { id: "rayban_meta", name: "Ray-Ban Meta", manufacturer: "Meta/Ray-Ban", tier: 0, hasCamera: true, hasHudApi: false, connectionType: "bluetooth" },
];

type Step = "select" | "scanning" | "found" | "pairing" | "detecting" | "success" | "manual";

interface DiscoveredDevice {
  name: string;
  address: string;
  signal: number;
  type: "bluetooth" | "wifi";
}

interface AddDeviceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeviceAdded: (device: {
    device_name: string;
    device_type: string;
    manufacturer: string;
    tier: number;
  }) => void;
}

const AddDeviceDialog = ({ open, onOpenChange, onDeviceAdded }: AddDeviceDialogProps) => {
  const [step, setStep] = useState<Step>("select");
  const [connectionType, setConnectionType] = useState<"bluetooth" | "wifi">("bluetooth");
  const [discoveredDevices, setDiscoveredDevices] = useState<DiscoveredDevice[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<DiscoveredDevice | null>(null);
  const [detectedSpec, setDetectedSpec] = useState<DeviceSpec | null>(null);
  const [manualDevice, setManualDevice] = useState({ name: "", type: "", manufacturer: "" });
  const [pairingProgress, setPairingProgress] = useState(0);

  // Reset on open
  useEffect(() => {
    if (open) {
      setStep("select");
      setDiscoveredDevices([]);
      setSelectedDevice(null);
      setDetectedSpec(null);
      setPairingProgress(0);
    }
  }, [open]);

  // Simulate scanning
  const startScanning = () => {
    setStep("scanning");
    setDiscoveredDevices([]);

    // Simulate finding devices over time
    const mockDevices: DiscoveredDevice[] = [
      { name: "Even G2 - A3F2", address: "00:1A:7D:DA:71:13", signal: 85, type: "bluetooth" },
      { name: "Vuzix Z100", address: "00:1A:7D:DA:71:14", signal: 72, type: "bluetooth" },
      { name: "Unknown BT Device", address: "00:1A:7D:DA:71:15", signal: 45, type: "bluetooth" },
    ];

    const wifiDevices: DiscoveredDevice[] = [
      { name: "Rokid-Max-5G", address: "192.168.1.42", signal: 92, type: "wifi" },
      { name: "Quest3-Living", address: "192.168.1.55", signal: 78, type: "wifi" },
    ];

    const devices = connectionType === "bluetooth" ? mockDevices : wifiDevices;

    setTimeout(() => {
      setDiscoveredDevices(devices.slice(0, 1));
    }, 800);

    setTimeout(() => {
      setDiscoveredDevices(devices.slice(0, 2));
    }, 1500);

    setTimeout(() => {
      setDiscoveredDevices(devices);
      setStep("found");
    }, 2200);
  };

  // Simulate pairing
  const startPairing = (device: DiscoveredDevice) => {
    setSelectedDevice(device);
    setStep("pairing");
    setPairingProgress(0);

    const interval = setInterval(() => {
      setPairingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          detectTier(device);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  // Simulate tier detection
  const detectTier = (device: DiscoveredDevice) => {
    setStep("detecting");

    setTimeout(() => {
      // Match against known devices
      const match = knownDevices.find(d => 
        device.name.toLowerCase().includes(d.name.toLowerCase().split(" ")[0])
      );

      if (match) {
        setDetectedSpec(match);
      } else {
        // Unknown device defaults to Tier 0
        setDetectedSpec({
          id: "unknown",
          name: device.name,
          manufacturer: "Unknown",
          tier: 0,
          hasCamera: false,
          hasHudApi: false,
          connectionType: connectionType,
        });
      }

      setStep("success");
    }, 1500);
  };

  const handleConfirm = () => {
    if (detectedSpec && selectedDevice) {
      onDeviceAdded({
        device_name: selectedDevice.name,
        device_type: detectedSpec.id,
        manufacturer: detectedSpec.manufacturer,
        tier: detectedSpec.tier,
      });
      onOpenChange(false);
    }
  };

  const handleManualAdd = () => {
    if (manualDevice.name && manualDevice.type) {
      const spec = knownDevices.find(d => d.id === manualDevice.type);
      onDeviceAdded({
        device_name: manualDevice.name,
        device_type: manualDevice.type,
        manufacturer: spec?.manufacturer || manualDevice.manufacturer || "Unknown",
        tier: spec?.tier || 0,
      });
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Glasses className="h-5 w-5 text-primary" />
            Add Device
          </DialogTitle>
          <DialogDescription>
            Connect your smart glasses via Bluetooth or WiFi
          </DialogDescription>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {/* Step 1: Select connection type */}
          {step === "select" && (
            <motion.div
              key="select"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setConnectionType("bluetooth")}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    connectionType === "bluetooth"
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <Bluetooth className={`h-8 w-8 mx-auto mb-2 ${connectionType === "bluetooth" ? "text-primary" : "text-muted-foreground"}`} />
                  <p className="font-medium">Bluetooth</p>
                  <p className="text-xs text-muted-foreground">Even G2, Vuzix, Xreal</p>
                </button>
                <button
                  onClick={() => setConnectionType("wifi")}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    connectionType === "wifi"
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <Wifi className={`h-8 w-8 mx-auto mb-2 ${connectionType === "wifi" ? "text-primary" : "text-muted-foreground"}`} />
                  <p className="font-medium">WiFi</p>
                  <p className="text-xs text-muted-foreground">Rokid, Quest, HoloLens</p>
                </button>
              </div>

              <div className="flex gap-3">
                <Button variant="ghost" className="flex-1" onClick={() => setStep("manual")}>
                  Manual Setup
                </Button>
                <Button variant="hero" className="flex-1" onClick={startScanning}>
                  <Search className="h-4 w-4 mr-2" />
                  Scan for Devices
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Scanning */}
          {step === "scanning" && (
            <motion.div
              key="scanning"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="py-8 text-center"
            >
              <div className="relative w-24 h-24 mx-auto mb-4">
                <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
                <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                {connectionType === "bluetooth" ? (
                  <Bluetooth className="absolute inset-0 m-auto h-10 w-10 text-primary" />
                ) : (
                  <Wifi className="absolute inset-0 m-auto h-10 w-10 text-primary" />
                )}
              </div>
              <p className="font-medium">Scanning for devices...</p>
              <p className="text-sm text-muted-foreground">Make sure your glasses are powered on</p>

              {discoveredDevices.length > 0 && (
                <div className="mt-4 space-y-2">
                  {discoveredDevices.map((device, i) => (
                    <motion.div
                      key={device.address}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-2 p-2 rounded-lg bg-secondary/50"
                    >
                      <div className="h-2 w-2 rounded-full bg-accent" />
                      <span className="text-sm">{device.name}</span>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Step 3: Found devices */}
          {step === "found" && (
            <motion.div
              key="found"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3"
            >
              <p className="text-sm text-muted-foreground">
                Found {discoveredDevices.length} device{discoveredDevices.length !== 1 ? "s" : ""}
              </p>

              {discoveredDevices.map((device) => (
                <button
                  key={device.address}
                  onClick={() => startPairing(device)}
                  className="w-full flex items-center gap-3 p-4 rounded-xl border border-border hover:border-primary/50 hover:bg-primary/5 transition-all text-left"
                >
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    {device.type === "bluetooth" ? (
                      <Bluetooth className="h-5 w-5 text-primary" />
                    ) : (
                      <Wifi className="h-5 w-5 text-primary" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{device.name}</p>
                    <p className="text-xs text-muted-foreground">{device.address}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4].map((bar) => (
                        <div
                          key={bar}
                          className={`w-1 rounded-full ${
                            device.signal >= bar * 25
                              ? "bg-accent"
                              : "bg-muted"
                          }`}
                          style={{ height: `${bar * 4 + 4}px` }}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{device.signal}%</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </button>
              ))}

              <Button variant="ghost" className="w-full" onClick={startScanning}>
                Scan Again
              </Button>
            </motion.div>
          )}

          {/* Step 4: Pairing */}
          {step === "pairing" && (
            <motion.div
              key="pairing"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="py-8 text-center"
            >
              <div className="relative w-24 h-24 mx-auto mb-4">
                <svg className="w-full h-full -rotate-90">
                  <circle
                    cx="48"
                    cy="48"
                    r="42"
                    fill="none"
                    stroke="hsl(var(--border))"
                    strokeWidth="8"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="42"
                    fill="none"
                    stroke="hsl(var(--primary))"
                    strokeWidth="8"
                    strokeDasharray={`${pairingProgress * 2.64} 264`}
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-lg font-bold">
                  {pairingProgress}%
                </span>
              </div>
              <p className="font-medium">Pairing with {selectedDevice?.name}</p>
              <p className="text-sm text-muted-foreground">Please wait...</p>
            </motion.div>
          )}

          {/* Step 5: Detecting tier */}
          {step === "detecting" && (
            <motion.div
              key="detecting"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="py-8 text-center"
            >
              <Loader2 className="h-12 w-12 mx-auto mb-4 text-primary animate-spin" />
              <p className="font-medium">Detecting device capabilities...</p>
              <p className="text-sm text-muted-foreground">Analyzing SDK compatibility & features</p>
            </motion.div>
          )}

          {/* Step 6: Success */}
          {step === "success" && detectedSpec && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="text-center py-4">
                <div className="w-16 h-16 rounded-full bg-accent/10 mx-auto mb-4 flex items-center justify-center">
                  <Check className="h-8 w-8 text-accent" />
                </div>
                <p className="text-lg font-semibold">Device Detected!</p>
              </div>

              <div className="p-4 rounded-xl bg-secondary/50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Device</span>
                  <span className="font-medium">{selectedDevice?.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Manufacturer</span>
                  <span className="font-medium">{detectedSpec.manufacturer}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Tier</span>
                  <Badge className={`tier-badge tier-${detectedSpec.tier}`}>
                    Tier {detectedSpec.tier}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Camera</span>
                  {detectedSpec.hasCamera ? (
                    <Check className="h-4 w-4 text-accent" />
                  ) : (
                    <X className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">HUD API</span>
                  {detectedSpec.hasHudApi ? (
                    <Check className="h-4 w-4 text-accent" />
                  ) : (
                    <X className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
              </div>

              {detectedSpec.tier === 0 && (
                <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
                  <AlertCircle className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />
                  <p className="text-xs text-amber-200">
                    This device will use phone fallback mode (notifications/TTS) as it doesn't have an open SDK.
                  </p>
                </div>
              )}

              <div className="flex gap-3">
                <Button variant="ghost" className="flex-1" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button variant="hero" className="flex-1" onClick={handleConfirm}>
                  Add Device
                </Button>
              </div>
            </motion.div>
          )}

          {/* Manual Setup */}
          {step === "manual" && (
            <motion.div
              key="manual"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="device-name">Device Name</Label>
                  <Input
                    id="device-name"
                    placeholder="e.g., My Even G2"
                    value={manualDevice.name}
                    onChange={(e) => setManualDevice({ ...manualDevice, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="device-type">Device Type</Label>
                  <Select
                    value={manualDevice.type}
                    onValueChange={(value) => setManualDevice({ ...manualDevice, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select device type" />
                    </SelectTrigger>
                    <SelectContent>
                      {knownDevices.map((device) => (
                        <SelectItem key={device.id} value={device.id}>
                          <div className="flex items-center gap-2">
                            <span>{device.manufacturer} {device.name}</span>
                            <Badge variant="outline" className="text-xs">T{device.tier}</Badge>
                          </div>
                        </SelectItem>
                      ))}
                      <SelectItem value="other">Other / Unknown</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {manualDevice.type === "other" && (
                  <div className="space-y-2">
                    <Label htmlFor="manufacturer">Manufacturer</Label>
                    <Input
                      id="manufacturer"
                      placeholder="e.g., Acme Corp"
                      value={manualDevice.manufacturer}
                      onChange={(e) => setManualDevice({ ...manualDevice, manufacturer: e.target.value })}
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <Button variant="ghost" className="flex-1" onClick={() => setStep("select")}>
                  Back
                </Button>
                <Button 
                  variant="hero" 
                  className="flex-1" 
                  onClick={handleManualAdd}
                  disabled={!manualDevice.name || !manualDevice.type}
                >
                  Add Device
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

export default AddDeviceDialog;
