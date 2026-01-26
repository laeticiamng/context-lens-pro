import { Smartphone, Monitor, Cpu, Layers } from "lucide-react";

const tiers = [
  {
    tier: 0,
    title: "Universal (Phone-Only)",
    icon: Smartphone,
    description: "Works with ALL devices. Vision via phone camera, display via notifications or audio TTS.",
    features: ["Phone camera capture", "Cloud AI analysis", "Push notifications", "Audio TTS output"],
    badge: "Safety Net",
    works: "Any glasses, even closed ecosystems",
  },
  {
    tier: 1,
    title: "Display via SDK",
    icon: Monitor,
    description: "Push text and images directly to the HUD via official manufacturer SDK.",
    features: ["Phone camera capture", "Native HUD display", "Smooth prompter UX", "No hacks required"],
    badge: "Recommended",
    works: "Even G2, Vuzix Z100",
  },
  {
    tier: 2,
    title: "On-Device Mode",
    icon: Cpu,
    description: "App runs directly on the glasses with potential sensor access.",
    features: ["On-device compute", "Sensor integration", "Lower latency", "Developer mode"],
    badge: "Advanced",
    works: "Rokid (Developer Program)",
  },
  {
    tier: 3,
    title: "Vision + AR Anchoring",
    icon: Layers,
    description: "Spatial overlays with 6DoF tracking. The ultimate AR experience.",
    features: ["Spatial anchors", "6DoF tracking", "World-locked UI", "Full AR capability"],
    badge: "Endgame",
    works: "Future validated devices",
  },
];

const TierSection = () => {
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
            Tiered architecture for{" "}
            <span className="text-gradient">every device</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            From basic phone-only fallback to full AR anchoring — ContextLens adapts 
            to what your glasses can do.
          </p>
        </div>

        {/* Tier Cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {tiers.map((tier, index) => (
            <div
              key={tier.tier}
              className="glass-card-elevated rounded-2xl p-6 relative overflow-hidden group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Tier badge */}
              <div className={`tier-badge tier-${tier.tier} mb-4`}>
                <span className="font-bold">T{tier.tier}</span>
                <span>{tier.badge}</span>
              </div>

              {/* Icon */}
              <div className="flex items-center gap-4 mb-4">
                <div className={`p-3 rounded-xl bg-tier-${tier.tier}/10 text-tier-${tier.tier}`}
                  style={{ 
                    backgroundColor: `hsl(var(--${tier.tier === 0 ? 'accent' : tier.tier === 1 ? 'primary' : tier.tier === 2 ? '262 83% 58%' : '38 92% 50%'}) / 0.1)`,
                    color: tier.tier === 0 ? 'hsl(var(--accent))' : tier.tier === 1 ? 'hsl(var(--primary))' : tier.tier === 2 ? 'hsl(262 83% 58%)' : 'hsl(38 92% 50%)'
                  }}
                >
                  <tier.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold">{tier.title}</h3>
              </div>

              {/* Description */}
              <p className="text-muted-foreground mb-6">{tier.description}</p>

              {/* Features */}
              <ul className="space-y-2 mb-6">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Works with */}
              <div className="pt-4 border-t border-border/50">
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium text-foreground/70">Works with:</span>{" "}
                  {tier.works}
                </p>
              </div>

              {/* Hover glow */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ 
                  background: `radial-gradient(circle at 50% 50%, ${
                    tier.tier === 0 ? 'hsl(var(--accent) / 0.05)' : 
                    tier.tier === 1 ? 'hsl(var(--primary) / 0.05)' : 
                    tier.tier === 2 ? 'hsl(262 83% 58% / 0.05)' : 
                    'hsl(38 92% 50% / 0.05)'
                  }, transparent 70%)`
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TierSection;
