import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";

interface StatItemProps {
  value: number;
  suffix?: string;
  label: string;
  delay?: number;
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

const StatItem = ({ value, suffix, label, delay }: StatItemProps) => {
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
      <p className="text-4xl md:text-5xl font-bold text-gradient mb-2">
        <AnimatedNumber value={value} suffix={suffix} delay={delay} />
      </p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </motion.div>
  );
};

const AnimatedStats = () => {
  const stats = [
    { value: 10000, suffix: "+", label: "Active Users", delay: 0 },
    { value: 50, suffix: "+", label: "Device Models", delay: 200 },
    { value: 1000000, suffix: "+", label: "Prompts Delivered", delay: 400 },
    { value: 99.9, suffix: "%", label: "Uptime SLA", delay: 600 },
  ];
  
  return (
    <section className="py-16 border-y border-border/50">
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
