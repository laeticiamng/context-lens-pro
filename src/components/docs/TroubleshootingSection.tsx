import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  HelpCircle, 
  Zap, 
  Shield, 
  Wifi, 
  Eye, 
  Bug,
  ExternalLink,
  MessageCircle
} from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { Link } from "react-router-dom";

interface TroubleshootingItem {
  id: string;
  questionEn: string;
  questionFr: string;
  answerEn: string;
  answerFr: string;
  category: "connection" | "display" | "privacy" | "performance";
}

const troubleshootingItems: TroubleshootingItem[] = [
  {
    id: "no-display",
    questionEn: "My smart glasses don't display the prompts",
    questionFr: "Mes lunettes n'affichent pas les prompts",
    answerEn: "1. Ensure your glasses are properly paired via Bluetooth.\n2. Check that the ContextLens app has display permissions.\n3. Verify your glasses firmware is up to date.\n4. Try disconnecting and reconnecting the device.",
    answerFr: "1. Vérifiez que vos lunettes sont bien appairées via Bluetooth.\n2. Vérifiez que l'app ContextLens a les permissions d'affichage.\n3. Mettez à jour le firmware de vos lunettes.\n4. Essayez de déconnecter et reconnecter l'appareil.",
    category: "display",
  },
  {
    id: "connection-drops",
    questionEn: "Connection keeps dropping during sessions",
    questionFr: "La connexion se coupe pendant les sessions",
    answerEn: "1. Keep your phone within Bluetooth range (10m max).\n2. Disable battery optimization for ContextLens.\n3. Close other Bluetooth-intensive apps.\n4. Check for signal interference from other devices.",
    answerFr: "1. Gardez votre téléphone à portée Bluetooth (10m max).\n2. Désactivez l'optimisation batterie pour ContextLens.\n3. Fermez les autres apps utilisant le Bluetooth.\n4. Vérifiez les interférences avec d'autres appareils.",
    category: "connection",
  },
  {
    id: "slow-prompts",
    questionEn: "Prompts are slow to appear or laggy",
    questionFr: "Les prompts sont lents ou saccadés",
    answerEn: "1. Reduce the number of active scripts.\n2. Shorten individual prompt lines (under 50 chars recommended).\n3. Switch to 'lite' mode for older devices.\n4. Clear the app cache in settings.",
    answerFr: "1. Réduisez le nombre de scripts actifs.\n2. Raccourcissez les lignes de prompt (moins de 50 caractères recommandés).\n3. Passez en mode 'lite' pour les appareils anciens.\n4. Videz le cache de l'app dans les paramètres.",
    category: "performance",
  },
  {
    id: "privacy-mode",
    questionEn: "How do I enable local-only analysis?",
    questionFr: "Comment activer l'analyse locale uniquement ?",
    answerEn: "Go to Settings > Privacy Controls > Enable 'Local Analysis Mode'. This keeps all visual processing on your device without sending data to our servers. Note: Some AI features may be limited.",
    answerFr: "Allez dans Paramètres > Contrôles de confidentialité > Activez 'Mode analyse locale'. Cela garde tout le traitement visuel sur votre appareil sans envoyer de données à nos serveurs. Note : Certaines fonctionnalités IA peuvent être limitées.",
    category: "privacy",
  },
  {
    id: "camera-access",
    questionEn: "Camera isn't capturing context",
    questionFr: "La caméra ne capture pas le contexte",
    answerEn: "1. Grant camera permissions to ContextLens.\n2. For phone fallback, ensure the phone camera is unobstructed.\n3. Good lighting improves context detection.\n4. Restart the app if camera freezes.",
    answerFr: "1. Accordez les permissions caméra à ContextLens.\n2. Pour le mode téléphone, assurez-vous que la caméra n'est pas obstruée.\n3. Un bon éclairage améliore la détection du contexte.\n4. Redémarrez l'app si la caméra se fige.",
    category: "display",
  },
  {
    id: "battery-drain",
    questionEn: "App drains my phone/glasses battery quickly",
    questionFr: "L'app vide rapidement la batterie",
    answerEn: "1. Lower the capture frequency in settings.\n2. Disable continuous context mode when not needed.\n3. Use scheduled sessions instead of always-on.\n4. Enable battery saver mode in the app.",
    answerFr: "1. Réduisez la fréquence de capture dans les paramètres.\n2. Désactivez le mode contexte continu quand non nécessaire.\n3. Utilisez des sessions programmées au lieu du mode permanent.\n4. Activez le mode économie d'énergie dans l'app.",
    category: "performance",
  },
];

const categoryIcons = {
  connection: Wifi,
  display: Eye,
  privacy: Shield,
  performance: Zap,
};

const categoryLabels = {
  connection: { en: "Connection", fr: "Connexion" },
  display: { en: "Display", fr: "Affichage" },
  privacy: { en: "Privacy", fr: "Confidentialité" },
  performance: { en: "Performance", fr: "Performance" },
};

const TroubleshootingSection = () => {
  const { language } = useLanguage();

  const t = {
    title: language === "fr" ? "Dépannage" : "Troubleshooting",
    description: language === "fr" 
      ? "Solutions aux problèmes courants"
      : "Solutions to common issues",
    stillNeedHelp: language === "fr" ? "Besoin d'aide ?" : "Still need help?",
    contactSupport: language === "fr" ? "Contacter le support" : "Contact Support",
  };

  return (
    <section id="troubleshooting" className="scroll-mt-24">
      <Card className="glass-card border-border/50">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-amber-500/10 text-amber-500">
              <Bug className="h-6 w-6" />
            </div>
            <div>
              <CardTitle>{t.title}</CardTitle>
              <CardDescription>{t.description}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Accordion type="single" collapsible className="w-full">
            {troubleshootingItems.map((item) => {
              const Icon = categoryIcons[item.category];
              const question = language === "fr" ? item.questionFr : item.questionEn;
              const answer = language === "fr" ? item.answerFr : item.answerEn;
              const categoryLabel = categoryLabels[item.category][language === "fr" ? "fr" : "en"];

              return (
                <AccordionItem key={item.id} value={item.id}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3 text-left">
                      <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span className="flex-1">{question}</span>
                      <Badge variant="outline" className="ml-2 shrink-0">
                        {categoryLabel}
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="pl-7 whitespace-pre-line text-muted-foreground">
                      {answer}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>

          <div className="pt-4 border-t border-border/50 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{t.stillNeedHelp}</p>
            <Link to="/contact">
              <Button variant="outline" size="sm">
                <MessageCircle className="h-4 w-4 mr-2" />
                {t.contactSupport}
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default TroubleshootingSection;
