import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  Eye, 
  EyeOff, 
  Cloud, 
  Smartphone, 
  Trash2,
  Download,
  AlertTriangle,
  Check
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PrivacyControlsProps {
  onExportData: () => void;
  onDeleteData: () => void;
}

const PrivacyControls = ({ onExportData, onDeleteData }: PrivacyControlsProps) => {
  const { toast } = useToast();
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
      title: "Privacy Setting Updated",
      description: "Your preferences have been saved.",
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
                <h4 className="font-medium">Privacy Mode</h4>
                <Badge variant="outline" className={settings.localOnlyMode ? "border-accent text-accent" : ""}>
                  {settings.localOnlyMode ? "Local Only" : "Cloud Processing"}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {settings.localOnlyMode 
                  ? "All analysis runs on your device. No data leaves your phone."
                  : "Some analysis uses cloud AI for better accuracy."}
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
            Visual Analysis
          </CardTitle>
          <CardDescription>
            Control how ContextLens analyzes camera input
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable Visual Analysis</Label>
              <p className="text-sm text-muted-foreground">
                Allow AI to analyze camera feed for context
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
                Local-Only Processing
                <Badge variant="secondary" className="text-xs">Recommended</Badge>
              </Label>
              <p className="text-sm text-muted-foreground">
                Use on-device ML, never send images to cloud
              </p>
            </div>
            <Switch
              checked={settings.localOnlyMode}
              onCheckedChange={(v) => handleSettingChange("localOnlyMode", v)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Capture Indicator</Label>
              <p className="text-sm text-muted-foreground">
                Show visible indicator when camera is active
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
            Data Management
          </CardTitle>
          <CardDescription>
            GDPR compliant data controls
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Share Anonymous Analytics</Label>
              <p className="text-sm text-muted-foreground">
                Help improve ContextLens with usage data
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
              Export All My Data (JSON)
            </Button>
            <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive" onClick={onDeleteData}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete All My Data
            </Button>
          </div>

          <div className="p-3 rounded-lg bg-secondary/50 flex items-start gap-2">
            <Check className="h-4 w-4 text-accent mt-0.5 shrink-0" />
            <p className="text-xs text-muted-foreground">
              ContextLens complies with GDPR. You can request data export or deletion at any time. 
              We never sell your data to third parties.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrivacyControls;
