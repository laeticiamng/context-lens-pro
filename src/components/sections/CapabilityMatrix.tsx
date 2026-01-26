import { useState } from "react";
import { Check, X, Minus, Smartphone, Monitor, Cpu, Layers, ChevronDown, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";

const tiers = [
  {
    tier: 0,
    title: "Universal",
    subtitle: "Phone-Only Fallback",
    icon: Smartphone,
    description: "Works with ALL devices. Vision via phone camera, display via notifications or audio TTS.",
    badge: "Safety Net",
    color: "emerald",
    features: ["Phone camera capture", "Cloud AI analysis", "Push notifications", "Audio TTS output"],
    works: ["Any glasses", "Closed ecosystems", "No SDK required"],
  },
  {
    tier: 1,
    title: "Display via SDK",
    subtitle: "Native HUD Integration",
    icon: Monitor,
    description: "Push text and images directly to the HUD via official manufacturer SDK.",
    badge: "Recommended",
    color: "primary",
    features: ["Phone camera capture", "Native HUD display", "Smooth prompter UX", "No hacks required"],
    works: ["Even G2", "Vuzix Z100", "Xreal Air"],
  },
  {
    tier: 2,
    title: "On-Device Mode",
    subtitle: "Developer Access",
    icon: Cpu,
    description: "App runs directly on the glasses with potential sensor access.",
    badge: "Advanced",
    color: "violet",
    features: ["On-device compute", "Sensor integration", "Lower latency", "Developer mode"],
    works: ["Rokid (Dev Program)", "Meta Quest", "HoloLens"],
  },
  {
    tier: 3,
    title: "Vision + AR",
    subtitle: "Full Spatial Computing",
    icon: Layers,
    description: "Spatial overlays with 6DoF tracking. The ultimate AR experience.",
    badge: "Endgame",
    color: "amber",
    features: ["Spatial anchors", "6DoF tracking", "World-locked UI", "Full AR capability"],
    works: ["Apple Vision Pro", "Magic Leap 2", "Future devices"],
  },
];

const capabilities = [
  { 
    name: "Vision Input",
    description: "Camera access for context capture",
    values: ["Phone Only", "Phone Only", "Native Cam", "Native + Depth"]
  },
  { 
    name: "Display Output",
    description: "How content is rendered",
    values: ["Notif/TTS", "HUD SDK", "Native App", "Spatial UI"]
  },
  { 
    name: "Latency",
    description: "End-to-end response time",
    values: ["500-1000ms", "200-500ms", "100-200ms", "<100ms"]
  },
  { 
    name: "Offline Mode",
    description: "Works without internet",
    values: [false, false, "Partial", true]
  },
  { 
    name: "Gesture Control",
    description: "Hand/gesture input support",
    values: [false, "Basic", true, "Full 3D"]
  },
  { 
    name: "Voice Control",
    description: "Voice command support",
    values: ["Phone Mic", "Phone Mic", "Native Mic", "Native Mic"]
  },
  { 
    name: "Head Tracking",
    description: "IMU-based orientation",
    values: [false, false, "3DoF", "6DoF"]
  },
  { 
    name: "Spatial Anchors",
    description: "World-locked content",
    values: [false, false, false, true]
  },
  { 
    name: "Multi-User",
    description: "Shared AR experiences",
    values: [false, false, false, true]
  },
  { 
    name: "SDK Required",
    description: "Developer SDK needed",
    values: [false, true, true, true]
  },
];

const devices = [
  { name: "Even G2", tier: 1, manufacturer: "Even Realities", status: "Validated" },
  { name: "Vuzix Z100", tier: 1, manufacturer: "Vuzix", status: "Validated" },
  { name: "Xreal Air 2", tier: 1, manufacturer: "Xreal", status: "Testing" },
  { name: "Rokid Max", tier: 2, manufacturer: "Rokid", status: "Dev Program" },
  { name: "Meta Quest 3", tier: 2, manufacturer: "Meta", status: "Planned" },
  { name: "Apple Vision Pro", tier: 3, manufacturer: "Apple", status: "Planned" },
  { name: "Magic Leap 2", tier: 3, manufacturer: "Magic Leap", status: "Planned" },
  { name: "Ray-Ban Meta", tier: 0, manufacturer: "Meta/Ray-Ban", status: "Fallback Only" },
];

const getColorClass = (tier: number, type: 'bg' | 'text' | 'border') => {
  const colors = {
    0: { bg: 'bg-emerald-500', text: 'text-emerald-400', border: 'border-emerald-500' },
    1: { bg: 'bg-primary', text: 'text-primary', border: 'border-primary' },
    2: { bg: 'bg-violet-500', text: 'text-violet-400', border: 'border-violet-500' },
    3: { bg: 'bg-amber-500', text: 'text-amber-400', border: 'border-amber-500' },
  };
  return colors[tier as keyof typeof colors][type];
};

const CapabilityMatrix = () => {
  const { language } = useLanguage();
  const [selectedTier, setSelectedTier] = useState<number | null>(null);
  const [showMatrix, setShowMatrix] = useState(false);
  const [showDevices, setShowDevices] = useState(false);

  const renderValue = (value: string | boolean) => {
    if (value === true) return <Check className="h-4 w-4 text-emerald-400" />;
    if (value === false) return <X className="h-4 w-4 text-muted-foreground/50" />;
    if (value === "Partial") return <Minus className="h-4 w-4 text-amber-400" />;
    return <span className="text-sm">{value}</span>;
  };

  return (
    <section id="features" className="py-24 md:py-32 relative">
      <div 
        className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-30"
        style={{ background: "var(--gradient-glow)" }}
      />
      
      <div className="container relative z-10 px-4">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            {language === "fr" ? "Architecture par niveaux pour " : "Tiered Architecture for "}
            <span className="text-gradient">{language === "fr" ? "Tous les appareils" : "Every Device"}</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            {language === "fr" 
              ? "Du mode téléphone de secours à l'ancrage AR complet — ContextLens s'adapte aux capacités de vos lunettes."
              : "From basic phone-only fallback to full AR anchoring — ContextLens adapts to what your glasses can do."}
          </p>
        </div>

        {/* Tier Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto mb-12">
          {tiers.map((tier) => {
            const isSelected = selectedTier === tier.tier;
            
            return (
              <motion.button
                key={tier.tier}
                onClick={() => setSelectedTier(isSelected ? null : tier.tier)}
                className={`relative text-left p-6 rounded-2xl border-2 transition-all ${
                  isSelected 
                    ? `border-${tier.color === 'primary' ? 'primary' : tier.color + '-500'} bg-${tier.color === 'primary' ? 'primary' : tier.color + '-500'}/10`
                    : "glass-card border-border/50 hover:border-primary/30"
                }`}
                style={{
                  borderColor: isSelected ? `hsl(var(--${tier.color === 'primary' ? 'primary' : tier.color}))` : undefined,
                  backgroundColor: isSelected ? `hsl(var(--${tier.color === 'primary' ? 'primary' : tier.color}) / 0.1)` : undefined
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Tier badge */}
                <div className={`tier-badge tier-${tier.tier} mb-4`}>
                  <span className="font-bold">T{tier.tier}</span>
                  <span>{tier.badge}</span>
                </div>

                {/* Icon */}
                <div className="flex items-center gap-3 mb-3">
                  <div 
                    className={`p-2.5 rounded-xl`}
                    style={{ 
                      backgroundColor: `hsl(var(--${tier.color === 'primary' ? 'primary' : tier.color}) / 0.15)`,
                      color: `hsl(var(--${tier.color === 'primary' ? 'primary' : tier.color}))`
                    }}
                  >
                    <tier.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{tier.title}</h3>
                    <p className="text-xs text-muted-foreground">{tier.subtitle}</p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground mb-4">{tier.description}</p>

                {/* Features */}
                <ul className="space-y-1.5 mb-4">
                  {tier.features.slice(0, 3).map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-xs">
                      <Check className={`h-3 w-3 ${getColorClass(tier.tier, 'text')}`} />
                      <span className="text-foreground/80">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Works with */}
                <div className="pt-3 border-t border-border/50">
                  <p className="text-xs text-muted-foreground">
                    <span className="font-medium">Compatible:</span>{" "}
                    {tier.works.slice(0, 2).join(", ")}
                  </p>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Capability Matrix Toggle */}
        <div className="max-w-6xl mx-auto space-y-4">
          <button
            onClick={() => setShowMatrix(!showMatrix)}
            className="w-full flex items-center justify-between p-4 rounded-xl glass-card border border-border/50 hover:border-primary/30 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Info className="h-5 w-5 text-primary" />
              <span className="font-medium">{language === "fr" ? "Matrice complète des capacités" : "Full Capability Matrix"}</span>
            </div>
            <ChevronDown className={`h-5 w-5 transition-transform ${showMatrix ? "rotate-180" : ""}`} />
          </button>

          <AnimatePresence>
            {showMatrix && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="glass-card rounded-xl border border-border/50 overflow-x-auto">
                  <table className="w-full min-w-[600px]">
                    <thead>
                      <tr className="border-b border-border/50">
                        <th className="text-left p-4 font-medium text-sm">{language === "fr" ? "Capacité" : "Capability"}</th>
                        {tiers.map((tier) => (
                          <th key={tier.tier} className="p-4 text-center">
                            <span className={`tier-badge tier-${tier.tier}`}>T{tier.tier}</span>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {capabilities.map((cap, i) => (
                        <tr key={cap.name} className={i % 2 === 0 ? "bg-secondary/20" : ""}>
                          <td className="p-4">
                            <div className="font-medium text-sm">{cap.name}</div>
                            <div className="text-xs text-muted-foreground">{cap.description}</div>
                          </td>
                          {cap.values.map((value, j) => (
                            <td key={j} className="p-4 text-center">
                              {renderValue(value)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Device List Toggle */}
          <button
            onClick={() => setShowDevices(!showDevices)}
            className="w-full flex items-center justify-between p-4 rounded-xl glass-card border border-border/50 hover:border-primary/30 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Monitor className="h-5 w-5 text-accent" />
              <span className="font-medium">{language === "fr" ? "Appareils compatibles" : "Compatible Devices"}</span>
            </div>
            <ChevronDown className={`h-5 w-5 transition-transform ${showDevices ? "rotate-180" : ""}`} />
          </button>

          <AnimatePresence>
            {showDevices && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {devices.map((device) => (
                    <div 
                      key={device.name}
                      className="glass-card rounded-xl p-4 border border-border/50"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={`tier-badge tier-${device.tier} text-xs`}>T{device.tier}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          device.status === "Validated" ? "bg-emerald-500/20 text-emerald-400" :
                          device.status === "Testing" ? "bg-amber-500/20 text-amber-400" :
                          "bg-secondary text-muted-foreground"
                        }`}>
                          {device.status}
                        </span>
                      </div>
                      <h4 className="font-medium">{device.name}</h4>
                      <p className="text-xs text-muted-foreground">{device.manufacturer}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default CapabilityMatrix;
