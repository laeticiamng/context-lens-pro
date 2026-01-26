import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon, Plus, FileText, Glasses, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";

interface EmptyStateProps {
  type: "scripts" | "devices" | "analytics";
  onAction?: () => void;
}

const EmptyState = ({ type, onAction }: EmptyStateProps) => {
  const { language } = useLanguage();

  const emptyStates = {
    scripts: {
      icon: FileText,
      title: language === "fr" ? "Aucun script" : "No scripts yet",
      description: language === "fr" 
        ? "Créez votre premier script pour commencer à utiliser ContextLens avec vos lunettes."
        : "Create your first script to start using ContextLens with your smart glasses.",
      actionLabel: language === "fr" ? "Créer un script" : "Create Script",
      tips: language === "fr" 
        ? [
            "Les scripts peuvent être des notes de réunion, des pitchs ou des checklists",
            "Chaque ligne devient un bloc de prompt séparé",
            "Utilisez les tags pour organiser et filtrer vos scripts",
          ]
        : [
            "Scripts can be meeting notes, sales pitches, or checklists",
            "Each line becomes a separate prompt block",
            "Use tags to organize and filter your scripts",
          ],
    },
    devices: {
      icon: Glasses,
      title: language === "fr" ? "Aucun appareil connecté" : "No devices connected",
      description: language === "fr"
        ? "Connectez vos premières lunettes ou utilisez le mode téléphone."
        : "Connect your first smart glasses or use phone fallback mode.",
      actionLabel: language === "fr" ? "Ajouter un appareil" : "Add Device",
      tips: language === "fr"
        ? [
            "Compatible Even G2, Vuzix Z100 et plus",
            "Le mode téléphone fonctionne avec toutes les lunettes",
            "Appairage Bluetooth et WiFi disponible",
          ]
        : [
            "Supports Even G2, Vuzix Z100, and more",
            "Phone fallback works with any glasses",
            "Bluetooth and WiFi pairing available",
          ],
    },
    analytics: {
      icon: BarChart3,
      title: language === "fr" ? "Aucune donnée d'utilisation" : "No usage data yet",
      description: language === "fr"
        ? "Commencez à utiliser vos scripts pour voir les statistiques."
        : "Start using your scripts to see analytics and usage patterns.",
      actionLabel: null,
      tips: language === "fr"
        ? [
            "Suivez l'utilisation des scripts dans le temps",
            "Voyez quels prompts sont les plus efficaces",
            "Surveillez les stats de connexion des appareils",
          ]
        : [
            "Track script usage over time",
            "See which prompts are most effective",
            "Monitor device connection stats",
          ],
    },
  };

  const quickTipsLabel = language === "fr" ? "Astuces :" : "Quick tips:";

  const state = emptyStates[type];
  const Icon = state.icon;

  return (
    <Card className="glass-card border-border/50 border-dashed">
      <CardContent className="py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1 }}
            className="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center"
          >
            <Icon className="h-10 w-10 text-primary" />
          </motion.div>

          <div className="space-y-2">
            <h3 className="text-xl font-semibold">{state.title}</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              {state.description}
            </p>
          </div>

          {state.actionLabel && onAction && (
            <Button variant="hero" onClick={onAction}>
              <Plus className="h-4 w-4 mr-2" />
              {state.actionLabel}
            </Button>
          )}

          <div className="pt-4">
            <p className="text-xs text-muted-foreground mb-3">{quickTipsLabel}</p>
            <ul className="space-y-2 text-sm text-muted-foreground max-w-sm mx-auto">
              {state.tips.map((tip, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="flex items-start gap-2"
                >
                  <span className="text-primary">•</span>
                  <span className="text-left">{tip}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
};

export default EmptyState;
