import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Smartphone, 
  Glasses, 
  Cpu, 
  Layers,
  Check,
  ArrowRight,
  Zap,
  Eye,
  Camera,
  Wifi
} from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { Link } from "react-router-dom";

interface TierCardProps {
  tier: number;
  icon: React.ElementType;
  devices: string[];
  features: string[];
  color: string;
  isPopular?: boolean;
}

const tiers: TierCardProps[] = [
  {
    tier: 0,
    icon: Smartphone,
    devices: ["Ray-Ban Meta", "Any glasses", "Phone fallback"],
    features: ["Push notifications", "TTS output", "Phone camera"],
    color: "emerald",
  },
  {
    tier: 1,
    icon: Glasses,
    devices: ["Even G2", "Vuzix Z100", "Xreal Air 2"],
    features: ["Native HUD display", "SDK integration", "Gesture control"],
    color: "primary",
    isPopular: true,
  },
  {
    tier: 2,
    icon: Cpu,
    devices: ["Rokid", "Meta Quest 3", "HoloLens 2"],
    features: ["On-device compute", "Native camera", "Low latency"],
    color: "violet",
  },
  {
    tier: 3,
    icon: Layers,
    devices: ["Vision Pro", "Magic Leap 2", "Future AR"],
    features: ["Spatial anchors", "6DoF tracking", "World-lock AR"],
    color: "amber",
  },
];

const TierCard = ({ tier, icon: Icon, devices, features, color, isPopular }: TierCardProps) => {
  const { language } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: tier * 0.1 }}
    >
      <Card className={`glass-card border-border/50 h-full relative overflow-hidden ${
        isPopular ? "border-primary/50 shadow-lg shadow-primary/10" : ""
      }`}>
        {isPopular && (
          <div className="absolute top-0 right-0">
            <Badge className="rounded-none rounded-bl-lg bg-primary text-primary-foreground">
              {language === "fr" ? "Populaire" : "Popular"}
            </Badge>
          </div>
        )}
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div 
              className={`p-3 rounded-xl bg-${color === "primary" ? "primary" : color + "-500"}/10`}
              style={{ color: color === "primary" ? "hsl(var(--primary))" : undefined }}
            >
              <Icon className="h-6 w-6" />
            </div>
            <div>
              <Badge className={`tier-badge tier-${tier}`}>Tier {tier}</Badge>
            </div>
          </div>

          <h3 className="font-semibold mb-1">
            {tier === 0 && (language === "fr" ? "Mode Universel" : "Universal Fallback")}
            {tier === 1 && (language === "fr" ? "Affichage SDK" : "Display via SDK")}
            {tier === 2 && (language === "fr" ? "Mode Embarqué" : "On-Device Mode")}
            {tier === 3 && "Vision + AR"}
          </h3>

          <p className="text-sm text-muted-foreground mb-4">
            {tier === 0 && (language === "fr" ? "Fonctionne avec n'importe quel appareil" : "Works with any device")}
            {tier === 1 && (language === "fr" ? "Push vers le HUD via SDK officiel" : "Push to HUD via official SDK")}
            {tier === 2 && (language === "fr" ? "App embarquée avec accès capteurs" : "On-device app with sensor access")}
            {tier === 3 && (language === "fr" ? "Calcul spatial et AR complet" : "Full spatial computing and AR")}
          </p>

          <div className="space-y-3 mb-4">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase mb-2">
                {language === "fr" ? "Appareils" : "Devices"}
              </p>
              <div className="flex flex-wrap gap-1">
                {devices.map((device) => (
                  <span 
                    key={device}
                    className="px-2 py-0.5 rounded-full bg-secondary text-xs"
                  >
                    {device}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase mb-2">
                {language === "fr" ? "Fonctionnalités" : "Features"}
              </p>
              <ul className="space-y-1">
                {features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <Check className="h-3.5 w-3.5 text-accent" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <Link to={`/docs#tier-${tier}`}>
            <Button variant="ghost" size="sm" className="w-full">
              {language === "fr" ? "Voir la documentation" : "View Documentation"}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const EnhancedTierSection = () => {
  const { language } = useLanguage();

  return (
    <section id="tiers" className="py-24 md:py-32 relative overflow-hidden">
      <div className="container px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <Badge variant="outline" className="mb-4 border-primary/30 text-primary">
            <Zap className="h-3 w-3 mr-1" />
            {language === "fr" ? "Compatibilité universelle" : "Universal Compatibility"}
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            {language === "fr" ? "Tous les appareils, " : "Every Device, "}
            <span className="text-gradient">
              {language === "fr" ? "une seule plateforme" : "One Platform"}
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            {language === "fr" 
              ? "Du mode téléphone fallback au calcul spatial AR complet. ContextLens s'adapte à votre matériel."
              : "From phone fallback mode to full AR spatial computing. ContextLens adapts to your hardware."}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tiers.map((tier) => (
            <TierCard key={tier.tier} {...tier} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default EnhancedTierSection;
