import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  RotateCcw,
  Camera,
  Brain,
  FileText,
  Glasses,
  Hand,
  Check
} from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

interface DemoStep {
  id: number;
  titleEn: string;
  titleFr: string;
  descriptionEn: string;
  descriptionFr: string;
  icon: React.ElementType;
  hudContent: string[];
  highlightColor: string;
}

const demoSteps: DemoStep[] = [
  {
    id: 1,
    titleEn: "Capture Context",
    titleFr: "Capturer le contexte",
    descriptionEn: "Camera analyzes the environment in real-time",
    descriptionFr: "La caméra analyse l'environnement en temps réel",
    icon: Camera,
    hudContent: ["Scanning environment...", "Detecting objects...", "Face detected: John Smith"],
    highlightColor: "emerald",
  },
  {
    id: 2,
    titleEn: "AI Analysis",
    titleFr: "Analyse IA",
    descriptionEn: "Vision AI processes scene and identifies context",
    descriptionFr: "L'IA vision traite la scène et identifie le contexte",
    icon: Brain,
    hudContent: ["Context: Business meeting", "Confidence: 94%", "Matching scripts..."],
    highlightColor: "violet",
  },
  {
    id: 3,
    titleEn: "Smart Matching",
    titleFr: "Correspondance intelligente",
    descriptionEn: "ContextLens matches to your relevant scripts",
    descriptionFr: "ContextLens associe à vos scripts pertinents",
    icon: FileText,
    hudContent: ["Found: Sales Pitch Q4", "Keywords: pricing, demo", "Loading prompts..."],
    highlightColor: "primary",
  },
  {
    id: 4,
    titleEn: "HUD Display",
    titleFr: "Affichage HUD",
    descriptionEn: "Prompts appear on your smart glasses",
    descriptionFr: "Les prompts apparaissent sur vos lunettes",
    icon: Glasses,
    hudContent: ["→ Opening hook ready", "→ Mention 30% discount", "→ Schedule follow-up"],
    highlightColor: "amber",
  },
  {
    id: 5,
    titleEn: "Silent Navigation",
    titleFr: "Navigation silencieuse",
    descriptionEn: "Navigate with touch gestures - no voice needed",
    descriptionFr: "Naviguez avec les gestes tactiles",
    icon: Hand,
    hudContent: ["Swipe → Next point", "Swipe ← Previous", "Double-tap to dismiss"],
    highlightColor: "cyan",
  },
];

const InteractiveDemo = () => {
  const { language } = useLanguage();
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const t = {
    title: language === "fr" ? "Démo Interactive" : "Interactive Demo",
    description: language === "fr" 
      ? "Découvrez le flux complet de ContextLens en action"
      : "Experience the complete ContextLens flow in action",
    reset: language === "fr" ? "Recommencer" : "Reset",
    complete: language === "fr" ? "Démo terminée !" : "Demo Complete!",
    tryNow: language === "fr" ? "Essayer maintenant" : "Try it now",
  };

  const step = demoSteps[activeStep];
  const isComplete = activeStep === demoSteps.length - 1 && progress === 100;

  // Auto-play logic
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (activeStep < demoSteps.length - 1) {
            setActiveStep((s) => s + 1);
            return 0;
          } else {
            setIsPlaying(false);
            return 100;
          }
        }
        return prev + 2;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isPlaying, activeStep]);

  const handleStepClick = (index: number) => {
    setActiveStep(index);
    setProgress(0);
  };

  const handleNext = () => {
    if (activeStep < demoSteps.length - 1) {
      setActiveStep((s) => s + 1);
      setProgress(0);
    }
  };

  const handlePrev = () => {
    if (activeStep > 0) {
      setActiveStep((s) => s - 1);
      setProgress(0);
    }
  };

  const handleReset = () => {
    setActiveStep(0);
    setProgress(0);
    setIsPlaying(false);
  };

  const handleTogglePlay = () => {
    if (isComplete) {
      handleReset();
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <Card className="glass-card border-border/50 overflow-hidden">
      {/* Simulated HUD Display */}
      <div className="relative aspect-video bg-gradient-to-br from-background via-secondary/30 to-background">
        {/* Glasses frame visualization */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-full max-w-md px-4">
            {/* Glasses Frame */}
            <div className="relative mx-auto w-72 h-28 border-2 border-primary/30 rounded-full bg-secondary/20 backdrop-blur-sm">
              {/* Left Lens - Active content */}
              <motion.div 
                className="absolute left-4 top-4 w-28 h-20 rounded-lg border border-primary/30 bg-background/80 overflow-hidden p-2"
                animate={{ 
                  borderColor: `hsl(var(--${step.highlightColor}))`,
                  boxShadow: `0 0 20px hsl(var(--${step.highlightColor}) / 0.3)`
                }}
                transition={{ duration: 0.3 }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="space-y-1"
                  >
                    {step.hudContent.map((line, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.2 }}
                        className="text-[8px] text-primary/90 font-mono truncate"
                      >
                        {line}
                      </motion.div>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </motion.div>
              
              {/* Right Lens - Status */}
              <motion.div 
                className="absolute right-4 top-4 w-28 h-20 rounded-lg border border-muted/30 bg-background/60 overflow-hidden p-2"
              >
                <div className="flex flex-col justify-between h-full">
                  <div className="flex items-center gap-1">
                    <step.icon className="h-3 w-3 text-primary" />
                    <span className="text-[8px] text-muted-foreground font-mono">
                      Step {step.id}/5
                    </span>
                  </div>
                  <div className="h-1 bg-secondary rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-primary"
                      animate={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="text-[7px] text-muted-foreground/70 font-mono">
                    {isPlaying ? "● LIVE" : "◯ PAUSED"}
                  </div>
                </div>
              </motion.div>
              
              {/* Bridge */}
              <div className="absolute left-1/2 -translate-x-1/2 top-8 w-10 h-10 border-t-2 border-primary/20 rounded-t-full" />
            </div>

            {/* Current step indicator */}
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mt-6"
            >
              <Badge 
                variant="outline" 
                className={`mb-2 border-${step.highlightColor}/30 text-${step.highlightColor}`}
              >
                <step.icon className="h-3 w-3 mr-1" />
                {language === "fr" ? step.titleFr : step.titleEn}
              </Badge>
              <p className="text-sm text-muted-foreground">
                {language === "fr" ? step.descriptionFr : step.descriptionEn}
              </p>
            </motion.div>
          </div>
        </div>

        {/* Play overlay when complete */}
        {isComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-background/80 flex flex-col items-center justify-center gap-4"
          >
            <div className="h-16 w-16 rounded-full bg-accent/20 flex items-center justify-center">
              <Check className="h-8 w-8 text-accent" />
            </div>
            <p className="font-semibold">{t.complete}</p>
            <Button variant="hero" size="sm" onClick={() => window.location.href = "/auth"}>
              {t.tryNow}
            </Button>
          </motion.div>
        )}
      </div>

      {/* Controls */}
      <CardContent className="p-4 border-t border-border/50">
        <div className="flex items-center gap-4">
          {/* Playback controls */}
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleReset}>
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handlePrev} disabled={activeStep === 0}>
              <SkipBack className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              onClick={handleTogglePlay}
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleNext} disabled={activeStep === demoSteps.length - 1}>
              <SkipForward className="h-4 w-4" />
            </Button>
          </div>

          {/* Progress bar */}
          <div className="flex-1">
            <div className="flex gap-1">
              {demoSteps.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => handleStepClick(i)}
                  className={`flex-1 h-1.5 rounded-full transition-all ${
                    i < activeStep 
                      ? "bg-primary" 
                      : i === activeStep 
                      ? "bg-primary/50" 
                      : "bg-secondary"
                  }`}
                >
                  {i === activeStep && (
                    <motion.div
                      className="h-full bg-primary rounded-full"
                      animate={{ width: `${progress}%` }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Step indicator */}
          <span className="text-xs text-muted-foreground tabular-nums whitespace-nowrap">
            {activeStep + 1} / {demoSteps.length}
          </span>
        </div>

        {/* Step buttons */}
        <div className="flex gap-2 mt-4">
          {demoSteps.map((s, i) => {
            const Icon = s.icon;
            return (
              <button
                key={s.id}
                onClick={() => handleStepClick(i)}
                className={`flex-1 p-2 rounded-lg border transition-all text-center ${
                  i === activeStep
                    ? "border-primary/50 bg-primary/10"
                    : "border-border/50 hover:border-border"
                }`}
              >
                <Icon className={`h-4 w-4 mx-auto mb-1 ${i === activeStep ? "text-primary" : "text-muted-foreground"}`} />
                <span className={`text-[10px] ${i === activeStep ? "text-foreground" : "text-muted-foreground"}`}>
                  {language === "fr" ? s.titleFr.split(" ")[0] : s.titleEn.split(" ")[0]}
                </span>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default InteractiveDemo;
