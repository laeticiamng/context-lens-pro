import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  HelpCircle, 
  ExternalLink, 
  Book, 
  MessageCircle,
  FileText,
  Zap,
  ChevronRight
} from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { Link } from "react-router-dom";

interface HelpLink {
  id: string;
  titleEn: string;
  titleFr: string;
  descriptionEn: string;
  descriptionFr: string;
  icon: React.ElementType;
  href: string;
  external?: boolean;
}

const helpLinks: HelpLink[] = [
  {
    id: "docs",
    titleEn: "Documentation",
    titleFr: "Documentation",
    descriptionEn: "SDK guides and API reference",
    descriptionFr: "Guides SDK et référence API",
    icon: Book,
    href: "/docs",
  },
  {
    id: "quickstart",
    titleEn: "Quick Start Guide",
    titleFr: "Guide de démarrage rapide",
    descriptionEn: "Get started in 5 minutes",
    descriptionFr: "Démarrez en 5 minutes",
    icon: Zap,
    href: "/docs#tier-0",
  },
  {
    id: "templates",
    titleEn: "Script Templates",
    titleFr: "Modèles de scripts",
    descriptionEn: "Ready-to-use script examples",
    descriptionFr: "Exemples de scripts prêts à l'emploi",
    icon: FileText,
    href: "/docs#device-sdks",
  },
  {
    id: "contact",
    titleEn: "Contact Support",
    titleFr: "Contacter le support",
    descriptionEn: "Get help from our team",
    descriptionFr: "Obtenir l'aide de notre équipe",
    icon: MessageCircle,
    href: "/contact",
  },
];

const HelpCenter = () => {
  const { language } = useLanguage();

  const t = {
    title: language === "fr" ? "Centre d'aide" : "Help Center",
    description: language === "fr" 
      ? "Trouvez des réponses et des ressources"
      : "Find answers and resources",
    viewAll: language === "fr" ? "Voir tout" : "View all",
  };

  return (
    <Card className="glass-card border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-primary" />
              {t.title}
            </CardTitle>
            <CardDescription>{t.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {helpLinks.map((link) => {
          const Icon = link.icon;
          const title = language === "fr" ? link.titleFr : link.titleEn;
          const description = language === "fr" ? link.descriptionFr : link.descriptionEn;

          const content = (
            <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors group cursor-pointer">
              <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{title}</p>
                <p className="text-xs text-muted-foreground truncate">{description}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            </div>
          );

          return link.external ? (
            <a key={link.id} href={link.href} target="_blank" rel="noopener noreferrer">
              {content}
            </a>
          ) : (
            <Link key={link.id} to={link.href}>
              {content}
            </Link>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default HelpCenter;
