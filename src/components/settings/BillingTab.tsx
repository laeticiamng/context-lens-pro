import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  CreditCard, 
  Check, 
  ArrowRight,
  Sparkles,
  Shield,
  Zap
} from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { useNavigate } from "react-router-dom";

interface BillingTabProps {
  currentPlan?: "free" | "pro" | "enterprise";
}

const BillingTab = ({ currentPlan = "free" }: BillingTabProps) => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<string | null>(null);
  
  const t = {
    title: language === "fr" ? "Abonnement et facturation" : "Subscription & Billing",
    description: language === "fr" 
      ? "Gérez votre plan et vos méthodes de paiement" 
      : "Manage your plan and payment methods",
    currentPlan: language === "fr" ? "Plan actuel" : "Current Plan",
    free: language === "fr" ? "Gratuit" : "Free",
    pro: "Pro",
    enterprise: "Enterprise",
    upgradeTitle: language === "fr" ? "Passez à Pro" : "Upgrade to Pro",
    upgradeDesc: language === "fr" 
      ? "Débloquez toutes les fonctionnalités avec le plan Pro" 
      : "Unlock all features with the Pro plan",
    perMonth: language === "fr" ? "/mois" : "/month",
    features: {
      unlimited: language === "fr" ? "Scripts illimités" : "Unlimited scripts",
      tier12: language === "fr" ? "Appareils Tier 1-2" : "Tier 1-2 devices",
      analytics: language === "fr" ? "Analytique avancée" : "Advanced analytics",
      priority: language === "fr" ? "Support prioritaire" : "Priority support",
      offline: language === "fr" ? "Mode hors ligne" : "Offline mode",
    },
    upgrade: language === "fr" ? "Passer à Pro" : "Upgrade to Pro",
    contactSales: language === "fr" ? "Contacter les ventes" : "Contact Sales",
    paymentMethods: language === "fr" ? "Moyens de paiement" : "Payment Methods",
    noPayment: language === "fr" 
      ? "Aucun moyen de paiement configuré" 
      : "No payment methods configured",
    addPayment: language === "fr" ? "Ajouter un moyen de paiement" : "Add payment method",
    billingHistory: language === "fr" ? "Historique de facturation" : "Billing History",
    noBilling: language === "fr" 
      ? "Aucune facture pour le moment" 
      : "No billing history yet",
    comingSoon: language === "fr" ? "Bientôt disponible" : "Coming Soon",
    stripeIntegration: language === "fr" 
      ? "L'intégration Stripe sera bientôt disponible pour les paiements sécurisés."
      : "Stripe integration coming soon for secure payments.",
  };

  const handleUpgrade = async (plan: string) => {
    setLoading(plan);
    
    // TODO: Implement Stripe checkout when integration is ready
    // For now, show coming soon message
    setTimeout(() => {
      setLoading(null);
    }, 1000);
  };

  const proFeatures = [
    t.features.unlimited,
    t.features.tier12,
    t.features.analytics,
    t.features.priority,
    t.features.offline,
  ];

  return (
    <div className="space-y-6">
      {/* Current Plan */}
      <Card className="glass-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            {t.currentPlan}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                {currentPlan === "free" && <Zap className="h-5 w-5 text-primary" />}
                {currentPlan === "pro" && <Sparkles className="h-5 w-5 text-primary" />}
                {currentPlan === "enterprise" && <Shield className="h-5 w-5 text-primary" />}
              </div>
              <div>
                <h4 className="font-semibold">
                  {currentPlan === "free" && t.free}
                  {currentPlan === "pro" && t.pro}
                  {currentPlan === "enterprise" && t.enterprise}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {currentPlan === "free" && (language === "fr" ? "10 scripts, Tier 0" : "10 scripts, Tier 0")}
                  {currentPlan === "pro" && (language === "fr" ? "Scripts illimités, Tier 1-2" : "Unlimited scripts, Tier 1-2")}
                  {currentPlan === "enterprise" && (language === "fr" ? "Tout inclus + support dédié" : "Everything + dedicated support")}
                </p>
              </div>
            </div>
            <Badge variant={currentPlan === "free" ? "secondary" : "default"}>
              {language === "fr" ? "Actif" : "Active"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Upgrade Card (show if on free plan) */}
      {currentPlan === "free" && (
        <Card className="glass-card border-primary/30 bg-primary/5 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-accent" />
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <CardTitle>{t.upgradeTitle}</CardTitle>
              <Badge className="ml-auto bg-primary/10 text-primary border-primary/20">
                {t.comingSoon}
              </Badge>
            </div>
            <CardDescription>{t.upgradeDesc}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold">€9.99</span>
              <span className="text-muted-foreground">{t.perMonth}</span>
            </div>
            
            <ul className="space-y-2">
              {proFeatures.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-accent" />
                  {feature}
                </li>
              ))}
            </ul>

            <Button 
              variant="hero" 
              className="w-full"
              onClick={() => handleUpgrade("pro")}
              disabled={loading === "pro"}
            >
              {loading === "pro" ? (
                language === "fr" ? "Chargement..." : "Loading..."
              ) : (
                <>
                  {t.upgrade}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
            
            <p className="text-xs text-center text-muted-foreground">
              {t.stripeIntegration}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Payment Methods */}
      <Card className="glass-card border-border/50">
        <CardHeader>
          <CardTitle>{t.paymentMethods}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <CreditCard className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground mb-4">{t.noPayment}</p>
            <Button variant="outline" disabled>
              {t.addPayment}
              <Badge variant="secondary" className="ml-2 text-xs">{t.comingSoon}</Badge>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Billing History */}
      <Card className="glass-card border-border/50">
        <CardHeader>
          <CardTitle>{t.billingHistory}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <p className="text-muted-foreground">{t.noBilling}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BillingTab;
