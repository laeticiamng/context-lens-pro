import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Users, Glasses, FileText, Zap } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

interface StatItemProps {
  value: number;
  suffix?: string;
  label: string;
  delay?: number;
  icon: React.ElementType;
  color: "primary" | "accent";
}

const AnimatedNumber = ({ value, suffix = "", delay = 0 }: { value: number; suffix?: string; delay?: number }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  useEffect(() => {
    if (!isInView) return;
    
    const timer = setTimeout(() => {
      const duration = 2000;
      const steps = 60;
      const increment = value / steps;
      let current = 0;
      
      const interval = setInterval(() => {
        current += increment;
        if (current >= value) {
          setCount(value);
          clearInterval(interval);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);
      
      return () => clearInterval(interval);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [value, isInView, delay]);
  
  return (
    <span ref={ref}>
      {count.toLocaleString()}{suffix}
    </span>
  );
};

const StatItem = ({ value, suffix, label, delay, icon: Icon, color }: StatItemProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6, delay: delay ? delay / 1000 : 0 }}
      className="text-center"
    >
      <div
        className={`mx-auto mb-4 h-14 w-14 rounded-2xl flex items-center justify-center ${
          color === "primary" ? "bg-primary/10" : "bg-accent/10"
        }`}
      >
        <Icon
          className={`h-7 w-7 ${
            color === "primary" ? "text-primary" : "text-accent"
          }`}
        />
      </div>
      <p className="text-3xl md:text-4xl font-bold text-gradient mb-2">
        <AnimatedNumber value={value} suffix={suffix} delay={delay} />
      </p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </motion.div>
  );
};

const AnimatedStats = () => {
  const { t } = useLanguage();

  const stats = [
    { value: 10000, suffix: "+", label: t.stats.activeUsers, delay: 0, icon: Users, color: "primary" as const },
    { value: 50, suffix: "+", label: t.stats.deviceModels, delay: 200, icon: Glasses, color: "accent" as const },
    { value: 1000000, suffix: "+", label: t.stats.promptsDelivered, delay: 400, icon: FileText, color: "primary" as const },
    { value: 99.9, suffix: "%", label: t.stats.uptimeSla, delay: 600, icon: Zap, color: "accent" as const },
  ];
  
  return (
    <section className="py-16 border-y border-border/50 bg-secondary/20">
      <div className="container px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, i) => (
            <StatItem key={i} {...stat} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default AnimatedStats;
