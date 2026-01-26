import { useNavigate } from "react-router-dom";
import { Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

const plans = [
  {
    name: "Free",
    priceMonthly: 0,
    priceYearly: 0,
    period: "forever",
    description: "Perfect for trying out ContextLens",
    features: [
      "10 scripts",
      "Tier 0 (phone fallback)",
      "100 analyses/month",
      "Basic analytics",
      "Community support",
    ],
    cta: "Get Started",
    variant: "glass" as const,
    highlight: false,
    popular: false,
  },
  {
    name: "Pro",
    priceMonthly: 9.99,
    priceYearly: 99,
    period: "/month",
    description: "For professionals who need more power",
    features: [
      "Unlimited scripts",
      "Tier 1-2 device support",
      "Unlimited analyses",
      "Advanced analytics",
      "Priority support",
      "Custom prompts",
      "Offline caching",
    ],
    cta: "Start Free Trial",
    variant: "hero" as const,
    highlight: true,
    popular: true,
  },
  {
    name: "Enterprise",
    priceMonthly: null,
    priceYearly: null,
    period: "",
    description: "For teams and organizations",
    features: [
      "Everything in Pro",
      "On-premise deployment",
      "SSO & SAML",
      "Custom integrations",
      "Dedicated support",
      "SLA guarantee",
      "API access",
    ],
    cta: "Contact Sales",
    variant: "glass" as const,
    highlight: false,
    popular: false,
  },
];

const PricingSection = () => {
  const navigate = useNavigate();
  const [isYearly, setIsYearly] = useState(false);

  const handlePlanClick = (planName: string) => {
    if (planName === "Free") {
      navigate("/auth");
    } else if (planName === "Enterprise") {
      navigate("/contact");
    } else {
      navigate("/auth");
    }
  };

  const getPrice = (plan: typeof plans[0]) => {
    if (plan.priceMonthly === null) return "Custom";
    if (plan.priceMonthly === 0) return "0";
    return isYearly ? Math.round(plan.priceYearly / 12).toString() : plan.priceMonthly.toString();
  };

  const getPeriod = (plan: typeof plans[0]) => {
    if (plan.priceMonthly === null) return "";
    if (plan.priceMonthly === 0) return "forever";
    return "/month";
  };

  return (
    <section id="pricing" className="py-24 md:py-32 bg-secondary/20">
      <div className="container px-4">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Simple, <span className="text-gradient">transparent</span> pricing
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Start free, upgrade when you need more. No hidden fees.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-3 p-1 rounded-full bg-secondary/50 border border-border/50">
            <span className={`px-3 py-1.5 rounded-full text-sm transition-colors ${!isYearly ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>
              Monthly
            </span>
            <Switch checked={isYearly} onCheckedChange={setIsYearly} />
            <span className={`px-3 py-1.5 rounded-full text-sm transition-colors ${isYearly ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>
              Yearly
              <span className="ml-1 text-xs text-accent">Save 17%</span>
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl overflow-hidden ${
                plan.highlight 
                  ? "glass-card-elevated border-primary/50" 
                  : "glass-card"
              }`}
            >
              {plan.highlight && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-accent" />
              )}

              {plan.popular && (
                <div className="absolute top-4 right-4">
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                    <Sparkles className="h-3 w-3" />
                    Popular
                  </span>
                </div>
              )}

              <div className="p-6">
                {/* Plan Header */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-1">
                    {getPrice(plan) !== "Custom" && (
                      <span className="text-sm text-muted-foreground">€</span>
                    )}
                    <span className="text-4xl font-bold">{getPrice(plan)}</span>
                    <span className="text-muted-foreground">{getPeriod(plan)}</span>
                  </div>
                  {isYearly && plan.priceYearly && plan.priceYearly > 0 && (
                    <p className="text-xs text-accent mt-1">
                      €{plan.priceYearly} billed annually
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
          All plans include GDPR compliance, E2E encryption, and privacy-first defaults.
        </p>
      </div>
    </section>
  );
};

export default PricingSection;
