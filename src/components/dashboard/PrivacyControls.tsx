import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  Eye, 
  Cloud, 
  Trash2,
  Download,
  Check
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/i18n/LanguageContext";

interface PrivacyControlsProps {
  onExportData: () => void;
  onDeleteData: () => void;
}

const PrivacyControls = ({ onExportData, onDeleteData }: PrivacyControlsProps) => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [settings, setSettings] = useState({
    visualAnalysisEnabled: false,
    localOnlyMode: true,
    dataRetention: "30days",
    captureIndicator: true,
    shareAnalytics: false,
  });

  const handleSettingChange = (key: keyof typeof settings, value: boolean | string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    toast({
      title: t.privacyControls.settingUpdated,
      description: t.privacyControls.settingUpdatedDesc,
    });
  };

  return (
    <div className="space-y-6">
      {/* Privacy Status Banner */}
      <Card className={`border-2 ${settings.localOnlyMode ? "border-accent/50 bg-accent/5" : "border-primary/50 bg-primary/5"}`}>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${settings.localOnlyMode ? "bg-accent/20" : "bg-primary/20"}`}>
              <Shield className={`h-5 w-5 ${settings.localOnlyMode ? "text-accent" : "text-primary"}`} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h4 className="font-medium">{t.privacyControls.privacyMode}</h4>
                <Badge variant="outline" className={settings.localOnlyMode ? "border-accent text-accent" : ""}>
                  {settings.localOnlyMode ? t.privacyControls.localOnly : t.privacyControls.cloudProcessing}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {settings.localOnlyMode 
                  ? t.privacyControls.localOnlyDesc
                  : t.privacyControls.cloudDesc}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analysis Controls */}
      <Card className="glass-card border-border/50">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Eye className="h-5 w-5 text-primary" />
            {t.privacyControls.visualAnalysis}
          </CardTitle>
          <CardDescription>
            {t.privacyControls.visualAnalysisDesc}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>{t.privacyControls.enableVisualAnalysis}</Label>
              <p className="text-sm text-muted-foreground">
                {t.privacyControls.enableVisualAnalysisDesc}
              </p>
            </div>
            <Switch
              checked={settings.visualAnalysisEnabled}
              onCheckedChange={(v) => handleSettingChange("visualAnalysisEnabled", v)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="flex items-center gap-2">
                {t.privacyControls.localOnlyProcessing}
                <Badge variant="secondary" className="text-xs">{t.privacyControls.recommended}</Badge>
              </Label>
              <p className="text-sm text-muted-foreground">
                {t.privacyControls.localOnlyProcessingDesc}
              </p>
            </div>
            <Switch
              checked={settings.localOnlyMode}
              onCheckedChange={(v) => handleSettingChange("localOnlyMode", v)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>{t.privacyControls.captureIndicator}</Label>
              <p className="text-sm text-muted-foreground">
                {t.privacyControls.captureIndicatorDesc}
              </p>
            </div>
            <Switch
              checked={settings.captureIndicator}
              onCheckedChange={(v) => handleSettingChange("captureIndicator", v)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card className="glass-card border-border/50">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Cloud className="h-5 w-5 text-primary" />
            {t.privacyControls.dataManagement}
          </CardTitle>
          <CardDescription>
            {t.privacyControls.dataManagementDesc}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>{t.privacyControls.shareAnonymousAnalytics}</Label>
              <p className="text-sm text-muted-foreground">
                {t.privacyControls.shareAnonymousAnalyticsDesc}
              </p>
            </div>
            <Switch
              checked={settings.shareAnalytics}
              onCheckedChange={(v) => handleSettingChange("shareAnalytics", v)}
            />
          </div>

          <div className="pt-4 border-t border-border/50 space-y-3">
            <Button variant="outline" className="w-full justify-start" onClick={onExportData}>
              <Download className="h-4 w-4 mr-2" />
              {t.privacyControls.exportAllData}
            </Button>
            <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive" onClick={onDeleteData}>
              <Trash2 className="h-4 w-4 mr-2" />
              {t.privacyControls.deleteAllData}
            </Button>
          </div>

          <div className="p-3 rounded-lg bg-secondary/50 flex items-start gap-2">
            <Check className="h-4 w-4 text-accent mt-0.5 shrink-0" />
            <p className="text-xs text-muted-foreground">
              {t.privacyControls.gdprNotice}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrivacyControls;