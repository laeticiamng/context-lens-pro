import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  CheckCircle, 
  Circle, 
  Glasses, 
  FileText, 
  Smartphone,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/i18n/LanguageContext";

interface GettingStartedProps {
  scriptsCount: number;
  devicesCount: number;
  hasConnectedDevice: boolean;
  onAddScript: () => void;
  onAddDevice: () => void;
}

const GettingStarted = ({ 
  scriptsCount, 
  devicesCount, 
  hasConnectedDevice,
  onAddScript,
  onAddDevice
}: GettingStartedProps) => {
  const { language } = useLanguage();

  const steps = [
    {
      id: "account",
      titleEn: "Create account",
      titleFr: "Créer un compte",
      descriptionEn: "Sign up for ContextLens",
      descriptionFr: "S'inscrire à ContextLens",
      icon: Sparkles,
      completed: true,
    },
    {
      id: "script",
      titleEn: "Create first script",
      titleFr: "Créer un premier script",
      descriptionEn: "Add your talking points",
      descriptionFr: "Ajouter vos points clés",
      icon: FileText,
      completed: scriptsCount > 0,
      action: onAddScript,
    },
    {
      id: "device",
      titleEn: "Connect a device",
      titleFr: "Connecter un appareil",
      descriptionEn: "Pair your smart glasses or phone",
      descriptionFr: "Appairez vos lunettes ou téléphone",
      icon: Glasses,
      completed: devicesCount > 0,
      action: onAddDevice,
    },
    {
      id: "test",
      titleEn: "Test your setup",
      titleFr: "Tester votre configuration",
      descriptionEn: "Run your first AR session",
      descriptionFr: "Lancer votre première session AR",
      icon: Smartphone,
      completed: hasConnectedDevice && scriptsCount > 0,
    },
  ];

  const completedCount = steps.filter((s) => s.completed).length;
  const progress = (completedCount / steps.length) * 100;
  const isComplete = completedCount === steps.length;

  const t = {
    title: language === "fr" ? "Démarrage" : "Getting Started",
    description: language === "fr" 
      ? `${completedCount}/${steps.length} étapes complétées`
      : `${completedCount}/${steps.length} steps completed`,
    complete: language === "fr" ? "Configuration terminée !" : "Setup complete!",
    startSession: language === "fr" ? "Démarrer une session" : "Start session",
  };

  if (isComplete) {
    return null; // Hide when complete
  }

  return (
    <Card className="glass-card border-primary/20 bg-primary/5">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base">{t.title}</CardTitle>
            <CardDescription>{t.description}</CardDescription>
          </div>
          <Badge variant="outline" className="border-primary/30">
            {Math.round(progress)}%
          </Badge>
        </div>
        <Progress value={progress} className="h-1.5 mt-2" />
      </CardHeader>
      <CardContent className="space-y-3">
        {steps.map((step) => {
          const Icon = step.icon;
          const title = language === "fr" ? step.titleFr : step.titleEn;
          const description = language === "fr" ? step.descriptionFr : step.descriptionEn;

          return (
            <div
              key={step.id}
              className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                step.completed 
                  ? "bg-accent/10" 
                  : "bg-secondary/30 hover:bg-secondary/50 cursor-pointer"
              }`}
              onClick={!step.completed && step.action ? step.action : undefined}
            >
              <div className={`p-2 rounded-lg ${
                step.completed 
                  ? "bg-accent/20 text-accent" 
                  : "bg-primary/10 text-primary"
              }`}>
                {step.completed ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <Icon className="h-4 w-4" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`font-medium text-sm ${
                  step.completed ? "text-muted-foreground line-through" : ""
                }`}>
                  {title}
                </p>
                <p className="text-xs text-muted-foreground">{description}</p>
              </div>
              {!step.completed && step.action && (
                <ArrowRight className="h-4 w-4 text-primary" />
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default GettingStarted;
