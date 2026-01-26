import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Download, 
  FileJson, 
  Shield, 
  Trash2, 
  AlertTriangle,
  Check,
  Database,
  Key,
  User,
  Loader2
} from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface GDPRCompliancePanelProps {
  userId: string;
  onExportData: () => Promise<void>;
  onDeleteData: () => Promise<void>;
}

const GDPRCompliancePanel = ({ userId, onExportData, onDeleteData }: GDPRCompliancePanelProps) => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [exportLoading, setExportLoading] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  const t = {
    title: language === "fr" ? "Conformité RGPD" : "GDPR Compliance",
    description: language === "fr" 
      ? "Gérez vos données personnelles conformément au RGPD"
      : "Manage your personal data in compliance with GDPR",
    yourRights: language === "fr" ? "Vos droits" : "Your Rights",
    rightAccess: language === "fr" ? "Droit d'accès" : "Right to Access",
    rightAccessDesc: language === "fr" 
      ? "Téléchargez une copie complète de vos données"
      : "Download a complete copy of your data",
    rightErasure: language === "fr" ? "Droit à l'effacement" : "Right to Erasure",
    rightErasureDesc: language === "fr" 
      ? "Supprimez définitivement toutes vos données"
      : "Permanently delete all your data",
    rightPortability: language === "fr" ? "Droit à la portabilité" : "Right to Portability",
    rightPortabilityDesc: language === "fr" 
      ? "Exportez vos données dans un format standard"
      : "Export your data in a standard format",
    dataCategories: language === "fr" ? "Catégories de données" : "Data Categories",
    exportData: language === "fr" ? "Exporter mes données" : "Export My Data",
    deleteData: language === "fr" ? "Supprimer mes données" : "Delete My Data",
    exporting: language === "fr" ? "Export en cours..." : "Exporting...",
    exportComplete: language === "fr" ? "Export terminé" : "Export Complete",
    lastExport: language === "fr" ? "Dernier export" : "Last export",
    never: language === "fr" ? "Jamais" : "Never",
    warning: language === "fr" 
      ? "Cette action est irréversible. Toutes vos données seront définitivement supprimées."
      : "This action is irreversible. All your data will be permanently deleted.",
  };

  const dataCategories = [
    { 
      icon: User, 
      label: language === "fr" ? "Profil utilisateur" : "User Profile",
      items: language === "fr" ? "Nom, email, avatar" : "Name, email, avatar"
    },
    { 
      icon: FileJson, 
      label: language === "fr" ? "Scripts" : "Scripts",
      items: language === "fr" ? "Contenu, tags, statistiques" : "Content, tags, statistics"
    },
    { 
      icon: Database, 
      label: language === "fr" ? "Appareils" : "Devices",
      items: language === "fr" ? "Connexions, préférences" : "Connections, preferences"
    },
    { 
      icon: Key, 
      label: language === "fr" ? "Sessions" : "Sessions",
      items: language === "fr" ? "Historique, analytics" : "History, analytics"
    },
  ];

  const handleExport = async () => {
    setExportLoading(true);
    setExportProgress(0);
    
    // Simulate progress
    const progressInterval = setInterval(() => {
      setExportProgress((p) => Math.min(p + 10, 90));
    }, 200);

    try {
      await onExportData();
      setExportProgress(100);
      toast({
        title: t.exportComplete,
        description: language === "fr" 
          ? "Vos données ont été téléchargées"
          : "Your data has been downloaded",
      });
    } catch (error) {
      toast({
        title: language === "fr" ? "Erreur" : "Error",
        description: language === "fr" 
          ? "Impossible d'exporter les données"
          : "Could not export data",
        variant: "destructive",
      });
    } finally {
      clearInterval(progressInterval);
      setExportLoading(false);
      setTimeout(() => setExportProgress(0), 2000);
    }
  };

  return (
    <Card className="glass-card border-border/50">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Shield className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-base">{t.title}</CardTitle>
            <CardDescription>{t.description}</CardDescription>
          </div>
          <Badge variant="outline" className="ml-auto border-accent/30 text-accent">
            🇪🇺 RGPD
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Data Categories */}
        <div>
          <h4 className="text-sm font-medium mb-3">{t.dataCategories}</h4>
          <div className="grid grid-cols-2 gap-2">
            {dataCategories.map((cat) => (
              <div 
                key={cat.label}
                className="flex items-center gap-2 p-2 rounded-lg bg-secondary/30"
              >
                <cat.icon className="h-4 w-4 text-muted-foreground" />
                <div className="min-w-0">
                  <p className="text-xs font-medium truncate">{cat.label}</p>
                  <p className="text-[10px] text-muted-foreground truncate">{cat.items}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Export Progress */}
        {exportLoading && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{t.exporting}</span>
              <span className="font-medium">{exportProgress}%</span>
            </div>
            <Progress value={exportProgress} className="h-2" />
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={handleExport}
            disabled={exportLoading}
          >
            {exportLoading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Download className="h-4 w-4 mr-2" />
            )}
            {t.exportData}
          </Button>
          <Button 
            variant="destructive" 
            className="flex-1"
            onClick={onDeleteData}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {t.deleteData}
          </Button>
        </div>

        {/* Warning */}
        <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 flex items-start gap-2">
          <AlertTriangle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
          <p className="text-xs text-destructive/80">{t.warning}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default GDPRCompliancePanel;
