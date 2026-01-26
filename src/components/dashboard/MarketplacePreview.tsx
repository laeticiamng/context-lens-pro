import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Store, 
  Tag, 
  Star, 
  Download,
  Users,
  Stethoscope,
  GraduationCap,
  Briefcase,
  Factory
} from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

interface MarketplaceScript {
  id: string;
  titleEn: string;
  titleFr: string;
  descriptionEn: string;
  descriptionFr: string;
  author: string;
  category: string;
  price: number | "free";
  rating: number;
  downloads: number;
  tags: string[];
}

const marketplaceScripts: MarketplaceScript[] = [
  {
    id: "1",
    titleEn: "Medical Consultation Pack",
    titleFr: "Pack Consultation Médicale",
    descriptionEn: "Complete set of prompts for patient consultations, diagnoses, and follow-ups.",
    descriptionFr: "Ensemble complet de prompts pour les consultations patients, diagnostics et suivis.",
    author: "HealthTech Pro",
    category: "Healthcare",
    price: 29.99,
    rating: 4.8,
    downloads: 1250,
    tags: ["medical", "consultation", "diagnosis"],
  },
  {
    id: "2",
    titleEn: "Sales Mastery Bundle",
    titleFr: "Pack Maîtrise Commerciale",
    descriptionEn: "Enterprise sales scripts for demos, negotiations, and closing deals.",
    descriptionFr: "Scripts de vente entreprise pour démos, négociations et closing.",
    author: "SalesForce Guru",
    category: "Business",
    price: 19.99,
    rating: 4.6,
    downloads: 3420,
    tags: ["sales", "enterprise", "closing"],
  },
  {
    id: "3",
    titleEn: "Technical Training Essentials",
    titleFr: "Essentiels Formation Technique",
    descriptionEn: "Step-by-step procedures for equipment operation and safety protocols.",
    descriptionFr: "Procédures étape par étape pour l'utilisation des équipements et protocoles de sécurité.",
    author: "TrainRight",
    category: "Training",
    price: "free",
    rating: 4.5,
    downloads: 5680,
    tags: ["training", "safety", "procedures"],
  },
  {
    id: "4",
    titleEn: "Manufacturing SOPs",
    titleFr: "SOPs Fabrication",
    descriptionEn: "Standard operating procedures for quality control and assembly lines.",
    descriptionFr: "Procédures opérationnelles standard pour le contrôle qualité et les lignes d'assemblage.",
    author: "IndustrialEdge",
    category: "Industry",
    price: 49.99,
    rating: 4.9,
    downloads: 890,
    tags: ["manufacturing", "quality", "assembly"],
  },
];

const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case "healthcare":
      return Stethoscope;
    case "business":
      return Briefcase;
    case "training":
      return GraduationCap;
    case "industry":
      return Factory;
    default:
      return Tag;
  }
};

const MarketplacePreview = () => {
  const { t, language } = useLanguage();

  return (
    <Card className="glass-card border-border/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <Store className="h-5 w-5 text-primary" />
              {t.marketplace.title}
              <Badge variant="secondary" className="ml-2">{t.marketplace.comingSoon}</Badge>
            </CardTitle>
            <CardDescription>
              {t.marketplace.description}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid sm:grid-cols-2 gap-3">
          {marketplaceScripts.map((script) => {
            const CategoryIcon = getCategoryIcon(script.category);
            const title = language === "fr" ? script.titleFr : script.titleEn;
            const description = language === "fr" ? script.descriptionFr : script.descriptionEn;
            
            return (
              <div
                key={script.id}
                className="p-4 rounded-xl bg-secondary/30 border border-border/50 hover:border-primary/30 transition-colors cursor-pointer group"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <CategoryIcon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm mb-0.5 truncate">{title}</h4>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                      {description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-0.5">
                          <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                          {script.rating}
                        </span>
                        <span className="flex items-center gap-0.5">
                          <Download className="h-3 w-3" />
                          {script.downloads.toLocaleString()}
                        </span>
                      </div>
                      <Badge 
                        variant={script.price === "free" ? "secondary" : "default"}
                        className="text-xs"
                      >
                        {script.price === "free" ? t.marketplace.free : `€${script.price}`}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 p-3 rounded-lg bg-primary/5 border border-primary/20 text-center">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-primary">{t.marketplace.creatorProgram}</span> — 
            {t.marketplace.creatorProgramDesc}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketplacePreview;
