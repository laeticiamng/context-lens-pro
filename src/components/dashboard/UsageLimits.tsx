import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { 
  FileText, 
  Eye, 
  Glasses, 
  Zap,
  ArrowRight,
  Crown
} from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

interface UsageLimitsProps {
  scriptsCount: number;
  scriptsLimit: number;
  analysesUsed: number;
  analysesLimit: number;
  devicesCount: number;
  devicesLimit: number;
  plan: "free" | "pro" | "enterprise";
}

const UsageLimits = ({
  scriptsCount,
  scriptsLimit,
  analysesUsed,
  analysesLimit,
  devicesCount,
  devicesLimit,
  plan,
}: UsageLimitsProps) => {
  const navigate = useNavigate();
  const { language } = useLanguage();

  const t = {
    usageThisMonth: language === "fr" ? "Utilisation ce mois" : "Usage This Month",
    reachedLimits: language === "fr" 
      ? "Vous avez atteint vos limites. Passez à un plan supérieur."
      : "You've reached your plan limits. Upgrade to continue.",
    approachingLimits: language === "fr"
      ? "Vous approchez de vos limites."
      : "You're approaching your plan limits.",
    trackUsage: language === "fr" ? "Suivez votre utilisation" : "Track your usage and limits",
    scripts: "Scripts",
    aiAnalyses: language === "fr" ? "Analyses IA" : "AI Analyses",
    devices: language === "fr" ? "Appareils" : "Devices",
    upgradeToPro: language === "fr" ? "Passer à Pro" : "Upgrade to Pro",
    limitsReset: language === "fr" 
      ? "Les limites sont réinitialisées le 1er de chaque mois"
      : "Limits reset on the 1st of each month",
    plan: "Plan",
  };

  const scriptsPercent = Math.min((scriptsCount / scriptsLimit) * 100, 100);
  const analysesPercent = Math.min((analysesUsed / analysesLimit) * 100, 100);
  const devicesPercent = Math.min((devicesCount / devicesLimit) * 100, 100);

  const isNearLimit = scriptsPercent >= 80 || analysesPercent >= 80;
  const isAtLimit = scriptsPercent >= 100 || analysesPercent >= 100;

  const planConfig = {
    free: { label: language === "fr" ? "Gratuit" : "Free", color: "bg-secondary", textColor: "text-muted-foreground" },
    pro: { label: "Pro", color: "bg-primary", textColor: "text-primary" },
    enterprise: { label: "Enterprise", color: "bg-amber-500", textColor: "text-amber-500" },
  };

  return (
    <Card className="glass-card border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" />
            {t.usageThisMonth}
          </CardTitle>
          <Badge 
            variant="outline" 
            className={`${planConfig[plan].textColor} border-current`}
          >
            {plan === "enterprise" && <Crown className="h-3 w-3 mr-1" />}
            {planConfig[plan].label}
          </Badge>
        </div>
        <CardDescription>
          {isAtLimit 
            ? t.reachedLimits
            : isNearLimit
            ? t.approachingLimits
            : t.trackUsage
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Scripts */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-muted-foreground">
              <FileText className="h-4 w-4" />
              {t.scripts}
            </span>
            <span className={scriptsPercent >= 100 ? "text-destructive font-medium" : ""}>
              {scriptsCount} / {scriptsLimit === Infinity ? "∞" : scriptsLimit}
            </span>
          </div>
          <Progress 
            value={scriptsPercent} 
            className={`h-2 ${scriptsPercent >= 100 ? "[&>div]:bg-destructive" : scriptsPercent >= 80 ? "[&>div]:bg-amber-500" : ""}`}
          />
        </div>

        {/* Analyses */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-muted-foreground">
              <Eye className="h-4 w-4" />
              {t.aiAnalyses}
            </span>
            <span className={analysesPercent >= 100 ? "text-destructive font-medium" : ""}>
              {analysesUsed} / {analysesLimit === Infinity ? "∞" : analysesLimit}
            </span>
          </div>
          <Progress 
            value={analysesPercent} 
            className={`h-2 ${analysesPercent >= 100 ? "[&>div]:bg-destructive" : analysesPercent >= 80 ? "[&>div]:bg-amber-500" : ""}`}
          />
        </div>

        {/* Devices */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-muted-foreground">
              <Glasses className="h-4 w-4" />
              {t.devices}
            </span>
            <span className={devicesPercent >= 100 ? "text-destructive font-medium" : ""}>
              {devicesCount} / {devicesLimit === Infinity ? "∞" : devicesLimit}
            </span>
          </div>
          <Progress 
            value={devicesPercent} 
            className={`h-2 ${devicesPercent >= 100 ? "[&>div]:bg-destructive" : devicesPercent >= 80 ? "[&>div]:bg-amber-500" : ""}`}
          />
        </div>

        {/* Upgrade CTA */}
        {plan === "free" && (
          <div className="pt-3 border-t border-border/50">
            <Button 
              variant="hero" 
              size="sm" 
              className="w-full"
              onClick={() => navigate("/#pricing")}
            >
              {t.upgradeToPro}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )}

        {/* Resets info */}
        <p className="text-xs text-muted-foreground text-center">
          {t.limitsReset}
        </p>
      </CardContent>
    </Card>
  );
};

export default UsageLimits;
