import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Star, 
  ChevronRight, 
  TrendingUp,
  Sparkles,
  FileText
} from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

interface TipOfTheDay {
  id: string;
  titleEn: string;
  titleFr: string;
  contentEn: string;
  contentFr: string;
  category: "productivity" | "feature" | "tip";
}

const tips: TipOfTheDay[] = [
  {
    id: "1",
    titleEn: "Use keyboard shortcuts",
    titleFr: "Utilisez les raccourcis clavier",
    contentEn: "Press Cmd+K to quickly access any action - create scripts, add devices, or navigate.",
    contentFr: "Appuyez sur Cmd+K pour accéder rapidement à toute action - créer des scripts, ajouter des appareils.",
    category: "productivity",
  },
  {
    id: "2",
    titleEn: "Tag your scripts",
    titleFr: "Taguez vos scripts",
    contentEn: "Add tags to scripts for better organization and faster contextual matching.",
    contentFr: "Ajoutez des tags aux scripts pour une meilleure organisation et correspondance contextuelle.",
    category: "tip",
  },
  {
    id: "3",
    titleEn: "Phone fallback mode",
    titleFr: "Mode fallback téléphone",
    contentEn: "No smart glasses? Use phone camera + notifications for the full ContextLens experience.",
    contentFr: "Pas de lunettes connectées ? Utilisez la caméra du téléphone + notifications.",
    category: "feature",
  },
  {
    id: "4",
    titleEn: "Voice commands",
    titleFr: "Commandes vocales",
    contentEn: "Say 'Next', 'Previous', or 'Zoom [section]' to navigate hands-free during sessions.",
    contentFr: "Dites 'Suivant', 'Précédent', ou 'Zoom [section]' pour naviguer mains libres.",
    category: "feature",
  },
];

const TipOfTheDayCard = () => {
  const { language } = useLanguage();
  
  // Get a consistent tip for today
  const today = new Date().toDateString();
  const tipIndex = today.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % tips.length;
  const tip = tips[tipIndex];

  const title = language === "fr" ? tip.titleFr : tip.titleEn;
  const content = language === "fr" ? tip.contentFr : tip.contentEn;

  const categoryLabels = {
    productivity: language === "fr" ? "Productivité" : "Productivity",
    feature: language === "fr" ? "Fonctionnalité" : "Feature",
    tip: language === "fr" ? "Astuce" : "Tip",
  };

  const categoryColors = {
    productivity: "bg-violet-500/10 text-violet-500 border-violet-500/20",
    feature: "bg-primary/10 text-primary border-primary/20",
    tip: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  };

  return (
    <Card className="glass-card border-border/50 overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-400" />
            {language === "fr" ? "Astuce du jour" : "Tip of the Day"}
          </CardTitle>
          <Badge variant="outline" className={categoryColors[tip.category]}>
            {categoryLabels[tip.category]}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <h4 className="font-medium mb-2">{title}</h4>
        <p className="text-sm text-muted-foreground">{content}</p>
      </CardContent>
    </Card>
  );
};

export default TipOfTheDayCard;
