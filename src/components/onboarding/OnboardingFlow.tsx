import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Glasses, 
  FileText, 
  Smartphone, 
  ArrowRight, 
  Check,
  Sparkles,
  Shield,
  Zap
} from "lucide-react";

interface OnboardingFlowProps {
  onComplete: () => void;
  onSkip: () => void;
}

const steps = [
  {
    id: "welcome",
    title: "Welcome to ContextLens",
    description: "Transform your smart glasses into an intelligent contextual prompter",
    icon: Sparkles,
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground">
          ContextLens uses AI to analyze your surroundings and display relevant information 
          directly on your smart glasses - or fallback to your phone.
        </p>
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 rounded-lg bg-secondary/50 text-center">
            <Glasses className="h-6 w-6 mx-auto mb-2 text-primary" />
            <p className="text-xs">10+ Devices</p>
          </div>
          <div className="p-3 rounded-lg bg-secondary/50 text-center">
            <FileText className="h-6 w-6 mx-auto mb-2 text-accent" />
            <p className="text-xs">Unlimited Scripts</p>
          </div>
          <div className="p-3 rounded-lg bg-secondary/50 text-center">
            <Zap className="h-6 w-6 mx-auto mb-2 text-amber-400" />
            <p className="text-xs">Real-time AI</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "scripts",
    title: "Create Your First Script",
    description: "Scripts are the content you want to display contextually",
    icon: FileText,
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground">
          A script can be meeting notes, sales pitches, procedure checklists, or any content
          you need at the right moment.
        </p>
        <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
          <h4 className="font-medium mb-2">Example: Sales Pitch</h4>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>• Opening hook and value proposition</li>
            <li>• Key features and benefits</li>
            <li>• Handling common objections</li>
            <li>• Call to action</li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    id: "devices",
    title: "Connect Your Device",
    description: "Pair your smart glasses or use phone fallback",
    icon: Smartphone,
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground">
          ContextLens works with multiple tiers of devices - from basic phone notifications
          to full AR spatial computing.
        </p>
        <div className="space-y-2">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <span className="tier-badge tier-0">T0</span>
            <span className="text-sm">Phone Fallback - Works with everything</span>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/10 border border-primary/20">
            <span className="tier-badge tier-1">T1</span>
            <span className="text-sm">Even G2, Vuzix Z100 - HUD Display</span>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-violet-500/10 border border-violet-500/20">
            <span className="tier-badge tier-2">T2</span>
            <span className="text-sm">Rokid, RayNeo - On-Device Mode</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "privacy",
    title: "Privacy First",
    description: "Your data is secure and GDPR compliant",
    icon: Shield,
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground">
          We take privacy seriously. All visual analysis is opt-in, and no video is stored by default.
        </p>
        <ul className="space-y-2">
          <li className="flex items-center gap-2 text-sm">
            <Check className="h-4 w-4 text-accent" />
            Explicit opt-in for visual analysis
          </li>
          <li className="flex items-center gap-2 text-sm">
            <Check className="h-4 w-4 text-accent" />
            End-to-end encryption for all data
          </li>
          <li className="flex items-center gap-2 text-sm">
            <Check className="h-4 w-4 text-accent" />
            Local-only analysis mode available
          </li>
          <li className="flex items-center gap-2 text-sm">
            <Check className="h-4 w-4 text-accent" />
            GDPR compliant with full data export
          </li>
        </ul>
      </div>
    ),
  },
];

const OnboardingFlow = ({ onComplete, onSkip }: OnboardingFlowProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  
  const isLastStep = currentStep === steps.length - 1;
  const step = steps[currentStep];

  const handleNext = () => {
    if (isLastStep) {
      onComplete();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl flex items-center justify-center p-4">
      <Card className="glass-card-elevated max-w-lg w-full">
        <CardHeader className="text-center">
          {/* Progress dots */}
          <div className="flex justify-center gap-2 mb-4">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-2 rounded-full transition-all ${
                  i === currentStep 
                    ? "w-8 bg-primary" 
                    : i < currentStep 
                    ? "w-2 bg-primary/50" 
                    : "w-2 bg-secondary"
                }`}
              />
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-2"
            >
              <div className="mx-auto h-14 w-14 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4">
                <step.icon className="h-7 w-7 text-primary-foreground" />
              </div>
              <CardTitle className="text-xl">{step.title}</CardTitle>
              <CardDescription>{step.description}</CardDescription>
            </motion.div>
          </AnimatePresence>
        </CardHeader>

        <CardContent className="space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {step.content}
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-between pt-4">
            <Button variant="ghost" onClick={currentStep === 0 ? onSkip : handlePrev}>
              {currentStep === 0 ? "Skip" : "Back"}
            </Button>
            <Button variant="hero" onClick={handleNext}>
              {isLastStep ? "Get Started" : "Continue"}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OnboardingFlow;
