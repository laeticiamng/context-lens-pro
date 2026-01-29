import { useNavigate } from "react-router-dom";
import { Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";

const PricingSection = () => {
  const navigate = useNavigate();
  const [isYearly, setIsYearly] = useState(false);
  const { t, language } = useLanguage();

  const plans = [
    {
      name: t.pricing.free,
      priceMonthly: 0,
      priceYearly: 0,
      period: language === "fr" ? "gratuit" : "forever",
      description: language === "fr" ? "Parfait pour découvrir ContextLens" : "Perfect for trying out ContextLens",
      features: [
        "10 scripts",
        "Tier 0 (phone fallback)",
        language === "fr" ? "100 analyses/mois" : "100 analyses/month",
        language === "fr" ? "Analytique basique" : "Basic analytics",
        language === "fr" ? "Support communautaire" : "Community support",
      ],
      cta: t.pricing.getStarted,
      variant: "glass" as const,
      highlight: false,
      popular: false,
    },
    {
      name: t.pricing.pro,
      priceMonthly: 9.99,
      priceYearly: 99,
      period: t.pricing.perMonth,
      description: language === "fr" ? "Pour les professionnels qui ont besoin de plus" : "For professionals who need more power",
      features: [
        language === "fr" ? "Scripts illimités" : "Unlimited scripts",
        language === "fr" ? "Support appareils Tier 1-2" : "Tier 1-2 device support",
        language === "fr" ? "Analyses illimitées" : "Unlimited analyses",
        language === "fr" ? "Analytique avancée" : "Advanced analytics",
        language === "fr" ? "Support prioritaire" : "Priority support",
        language === "fr" ? "Prompts personnalisés" : "Custom prompts",
        language === "fr" ? "Cache hors ligne" : "Offline caching",
      ],
      cta: language === "fr" ? "Essai gratuit" : "Start Free Trial",
      variant: "hero" as const,
      highlight: true,
      popular: true,
    },
    {
      name: t.pricing.enterprise,
      priceMonthly: null,
      priceYearly: null,
      period: "",
      description: language === "fr" ? "Pour les équipes et organisations" : "For teams and organizations",
      features: [
        language === "fr" ? "Tout de Pro inclus" : "Everything in Pro",
        language === "fr" ? "Déploiement on-premise" : "On-premise deployment",
        "SSO & SAML",
        language === "fr" ? "Intégrations personnalisées" : "Custom integrations",
        language === "fr" ? "Support dédié" : "Dedicated support",
        language === "fr" ? "Garantie SLA" : "SLA guarantee",
        language === "fr" ? "Accès API" : "API access",
      ],
      cta: t.pricing.contactSales,
      variant: "glass" as const,
      highlight: false,
      popular: false,
    },
  ];

  const handlePlanClick = (planName: string) => {
    if (planName === t.pricing.free) {
      navigate("/auth");
    } else if (planName === t.pricing.enterprise) {
      navigate("/contact");
    } else {
      navigate("/auth");
    }
  };

  const getPrice = (plan: typeof plans[0]) => {
    if (plan.priceMonthly === null) return language === "fr" ? "Sur devis" : "Custom";
    if (plan.priceMonthly === 0) return "0";
    return isYearly ? Math.round(plan.priceYearly / 12).toString() : plan.priceMonthly.toString();
  };

  const getPeriod = (plan: typeof plans[0]) => {
    if (plan.priceMonthly === null) return "";
    if (plan.priceMonthly === 0) return plan.period;
    return t.pricing.perMonth;
  };

  return (
    <section id="pricing" className="py-24 md:py-32 bg-gradient-to-b from-secondary/20 via-background to-background">
      <div className="container px-4">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-12 section-fade-in">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            {t.pricing.title} <span className="text-gradient-animated">{t.pricing.titleHighlight}</span>
          </h2>
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            {t.pricing.description}
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-3 p-1.5 rounded-full bg-secondary/50 border border-border/50 backdrop-blur-sm">
            <span className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${!isYearly ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25" : "text-muted-foreground hover:text-foreground"}`}>
              {language === "fr" ? "Mensuel" : "Monthly"}
            </span>
            <Switch checked={isYearly} onCheckedChange={setIsYearly} />
            <span className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${isYearly ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25" : "text-muted-foreground hover:text-foreground"}`}>
              {language === "fr" ? "Annuel" : "Yearly"}
              <span className="ml-1.5 text-xs text-accent font-bold">{language === "fr" ? "-17%" : "Save 17%"}</span>
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2 ${
                plan.highlight 
                  ? "glass-card-elevated border-primary/50 shadow-xl shadow-primary/10" 
                  : "glass-card hover:border-primary/30 hover:shadow-lg"
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {plan.highlight && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-accent" />
              )}

              {plan.popular && (
                <div className="absolute top-4 right-4">
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                    <Sparkles className="h-3 w-3" />
                    {t.pricing.popular}
                  </span>
                </div>
              )}

              <div className="p-6">
                {/* Plan Header */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-1">
                    {getPrice(plan) !== "Custom" && getPrice(plan) !== "Sur devis" && (
                      <span className="text-sm text-muted-foreground">€</span>
                    )}
                    <span className="text-4xl font-bold">{getPrice(plan)}</span>
                    <span className="text-muted-foreground">{getPeriod(plan)}</span>
                  </div>
                  {isYearly && plan.priceYearly && plan.priceYearly > 0 && (
                    <p className="text-xs text-accent mt-1">
                      €{plan.priceYearly} {language === "fr" ? "facturé annuellement" : "billed annually"}
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground mt-2">
                    {plan.description}
                  </p>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm">
                      <Check className="h-4 w-4 text-accent shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Button 
                  variant={plan.variant} 
                  className="w-full"
                  onClick={() => handlePlanClick(plan.name)}
                >
                  {plan.cta}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Enterprise note */}
        <p className="text-center text-sm text-muted-foreground mt-12">
          {language === "fr" 
            ? "Tous les plans incluent la conformité RGPD, le chiffrement E2E et des paramètres de confidentialité par défaut."
            : "All plans include GDPR compliance, E2E encryption, and privacy-first defaults."}
        </p>
      </div>
    </section>
  );
};

export default PricingSection;
