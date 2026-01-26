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
import { useLanguage } from "@/i18n/LanguageContext";

interface OnboardingFlowProps {
  onComplete: () => void;
  onSkip: () => void;
}

const OnboardingFlow = ({ onComplete, onSkip }: OnboardingFlowProps) => {
  const { language } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);

  const t = {
    skip: language === "fr" ? "Passer" : "Skip",
    back: language === "fr" ? "Retour" : "Back",
    continue: language === "fr" ? "Continuer" : "Continue",
    getStarted: language === "fr" ? "Commencer" : "Get Started",
    devices: language === "fr" ? "10+ Appareils" : "10+ Devices",
    unlimitedScripts: language === "fr" ? "Scripts illimités" : "Unlimited Scripts",
    realtimeAI: language === "fr" ? "IA temps réel" : "Real-time AI",
  };

  const steps = [
    {
      id: "welcome",
      title: language === "fr" ? "Bienvenue sur ContextLens" : "Welcome to ContextLens",
      description: language === "fr" 
        ? "Transformez vos lunettes connectées en prompteur contextuel intelligent"
        : "Transform your smart glasses into an intelligent contextual prompter",
      icon: Sparkles,
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            {language === "fr"
              ? "ContextLens utilise l'IA pour analyser votre environnement et afficher des informations pertinentes directement sur vos lunettes - ou en fallback sur votre téléphone."
              : "ContextLens uses AI to analyze your surroundings and display relevant information directly on your smart glasses - or fallback to your phone."}
          </p>
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-lg bg-secondary/50 text-center">
              <Glasses className="h-6 w-6 mx-auto mb-2 text-primary" />
              <p className="text-xs">{t.devices}</p>
            </div>
            <div className="p-3 rounded-lg bg-secondary/50 text-center">
              <FileText className="h-6 w-6 mx-auto mb-2 text-accent" />
              <p className="text-xs">{t.unlimitedScripts}</p>
            </div>
            <div className="p-3 rounded-lg bg-secondary/50 text-center">
              <Zap className="h-6 w-6 mx-auto mb-2 text-amber-400" />
              <p className="text-xs">{t.realtimeAI}</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "scripts",
      title: language === "fr" ? "Créez votre premier script" : "Create Your First Script",
      description: language === "fr"
        ? "Les scripts sont le contenu que vous voulez afficher contextuellement"
        : "Scripts are the content you want to display contextually",
      icon: FileText,
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            {language === "fr"
              ? "Un script peut être des notes de réunion, des pitchs commerciaux, des checklists de procédures, ou tout contenu dont vous avez besoin au bon moment."
              : "A script can be meeting notes, sales pitches, procedure checklists, or any content you need at the right moment."}
          </p>
          <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
            <h4 className="font-medium mb-2">
              {language === "fr" ? "Exemple : Pitch commercial" : "Example: Sales Pitch"}
            </h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• {language === "fr" ? "Accroche et proposition de valeur" : "Opening hook and value proposition"}</li>
              <li>• {language === "fr" ? "Fonctionnalités clés et avantages" : "Key features and benefits"}</li>
              <li>• {language === "fr" ? "Réponses aux objections courantes" : "Handling common objections"}</li>
              <li>• {language === "fr" ? "Appel à l'action" : "Call to action"}</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: "devices",
      title: language === "fr" ? "Connectez votre appareil" : "Connect Your Device",
      description: language === "fr"
        ? "Appairez vos lunettes ou utilisez le mode téléphone"
        : "Pair your smart glasses or use phone fallback",
      icon: Smartphone,
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            {language === "fr"
              ? "ContextLens fonctionne avec plusieurs niveaux d'appareils - des simples notifications téléphone au calcul spatial AR complet."
              : "ContextLens works with multiple tiers of devices - from basic phone notifications to full AR spatial computing."}
          </p>
          <div className="space-y-2">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <span className="tier-badge tier-0">T0</span>
              <span className="text-sm">
                {language === "fr" ? "Mode Téléphone - Fonctionne avec tout" : "Phone Fallback - Works with everything"}
              </span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/10 border border-primary/20">
              <span className="tier-badge tier-1">T1</span>
              <span className="text-sm">Even G2, Vuzix Z100 - {language === "fr" ? "Affichage HUD" : "HUD Display"}</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-violet-500/10 border border-violet-500/20">
              <span className="tier-badge tier-2">T2</span>
              <span className="text-sm">Rokid, RayNeo - {language === "fr" ? "Mode Embarqué" : "On-Device Mode"}</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "privacy",
      title: language === "fr" ? "Confidentialité d'abord" : "Privacy First",
      description: language === "fr"
        ? "Vos données sont sécurisées et conformes RGPD"
        : "Your data is secure and GDPR compliant",
      icon: Shield,
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            {language === "fr"
              ? "Nous prenons la confidentialité au sérieux. Toute analyse visuelle est opt-in, et aucune vidéo n'est stockée par défaut."
              : "We take privacy seriously. All visual analysis is opt-in, and no video is stored by default."}
          </p>
          <ul className="space-y-2">
            <li className="flex items-center gap-2 text-sm">
              <Check className="h-4 w-4 text-accent" />
              {language === "fr" ? "Opt-in explicite pour l'analyse visuelle" : "Explicit opt-in for visual analysis"}
            </li>
            <li className="flex items-center gap-2 text-sm">
              <Check className="h-4 w-4 text-accent" />
              {language === "fr" ? "Chiffrement de bout en bout" : "End-to-end encryption for all data"}
            </li>
            <li className="flex items-center gap-2 text-sm">
              <Check className="h-4 w-4 text-accent" />
              {language === "fr" ? "Mode analyse locale disponible" : "Local-only analysis mode available"}
            </li>
            <li className="flex items-center gap-2 text-sm">
              <Check className="h-4 w-4 text-accent" />
              {language === "fr" ? "Conforme RGPD avec export complet" : "GDPR compliant with full data export"}
            </li>
          </ul>
        </div>
      ),
    },
  ];
  
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
              {currentStep === 0 ? t.skip : t.back}
            </Button>
            <Button variant="hero" onClick={handleNext}>
              {isLastStep ? t.getStarted : t.continue}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OnboardingFlow;
