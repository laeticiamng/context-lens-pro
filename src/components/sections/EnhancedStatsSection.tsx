import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Users, 
  Glasses, 
  Zap, 
  Clock,
  TrendingUp,
  Award
} from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

interface StatItem {
  id: string;
  icon: React.ElementType;
  valueEn: string;
  valueFr: string;
  labelEn: string;
  labelFr: string;
  prefix?: string;
  suffix?: string;
  color: string;
}

const stats: StatItem[] = [
  {
    id: "users",
    icon: Users,
    valueEn: "10,000+",
    valueFr: "10 000+",
    labelEn: "Active Users",
    labelFr: "Utilisateurs actifs",
    color: "primary",
  },
  {
    id: "devices",
    icon: Glasses,
    valueEn: "15+",
    valueFr: "15+",
    labelEn: "Device Models",
    labelFr: "Modèles d'appareils",
    color: "violet",
  },
  {
    id: "prompts",
    icon: Zap,
    valueEn: "5M+",
    valueFr: "5M+",
    labelEn: "Prompts Delivered",
    labelFr: "Prompts délivrés",
    color: "amber",
  },
  {
    id: "uptime",
    icon: Clock,
    valueEn: "99.9%",
    valueFr: "99,9%",
    labelEn: "Uptime SLA",
    labelFr: "SLA de disponibilité",
    color: "emerald",
  },
];

const AnimatedCounter = ({ 
  value, 
  prefix = "", 
  suffix = "",
  inView 
}: { 
  value: string; 
  prefix?: string; 
  suffix?: string;
  inView: boolean;
}) => {
  const [displayValue, setDisplayValue] = useState("0");
  
  useEffect(() => {
    if (!inView) return;
    
    // Extract numeric part
    const numericMatch = value.match(/[\d.,]+/);
    if (!numericMatch) {
      setDisplayValue(value);
      return;
    }

    const numericValue = parseFloat(numericMatch[0].replace(/[,\s]/g, "").replace(",", "."));
    const nonNumericSuffix = value.replace(numericMatch[0], "");
    
    const duration = 2000;
    const steps = 60;
    const stepTime = duration / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentValue = numericValue * easeOut;
      
      if (numericValue >= 1000) {
        setDisplayValue(Math.floor(currentValue).toLocaleString() + nonNumericSuffix);
      } else if (numericValue < 100) {
        setDisplayValue(currentValue.toFixed(1).replace(".", ",") + nonNumericSuffix);
      } else {
        setDisplayValue(Math.floor(currentValue) + nonNumericSuffix);
      }
      
      if (currentStep >= steps) {
        clearInterval(timer);
        setDisplayValue(value);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [value, inView]);

  return (
    <span className="tabular-nums">
      {prefix}{displayValue}{suffix}
    </span>
  );
};

const EnhancedStatsSection = () => {
  const { language } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5" />
      
      <div className="container px-4 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const value = language === "fr" ? stat.valueFr : stat.valueEn;
            const label = language === "fr" ? stat.labelFr : stat.labelEn;

            return (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Card className="glass-card border-border/50 h-full">
                  <CardContent className="p-6 text-center">
                    <div className={`mx-auto w-12 h-12 rounded-xl bg-${stat.color === "primary" ? "primary" : stat.color + "-500"}/10 flex items-center justify-center mb-4`}>
                      <Icon className={`h-6 w-6 text-${stat.color === "primary" ? "primary" : stat.color + "-500"}`} />
                    </div>
                    <p className="text-3xl md:text-4xl font-bold mb-1">
                      <AnimatedCounter 
                        value={value} 
                        prefix={stat.prefix}
                        suffix={stat.suffix}
                        inView={isInView}
                      />
                    </p>
                    <p className="text-sm text-muted-foreground">{label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          <Badge variant="outline" className="gap-1.5 px-3 py-1.5">
            <Award className="h-3.5 w-3.5 text-primary" />
            {language === "fr" ? "Top 10 AR Startups 2025" : "Top 10 AR Startups 2025"}
          </Badge>
          <Badge variant="outline" className="gap-1.5 px-3 py-1.5">
            <TrendingUp className="h-3.5 w-3.5 text-accent" />
            {language === "fr" ? "Croissance +300% YoY" : "+300% YoY Growth"}
          </Badge>
          <Badge variant="outline" className="gap-1.5 px-3 py-1.5">
            🇪🇺 {language === "fr" ? "Conforme RGPD" : "GDPR Compliant"}
          </Badge>
        </div>
      </div>
    </section>
  );
};

export default EnhancedStatsSection;
