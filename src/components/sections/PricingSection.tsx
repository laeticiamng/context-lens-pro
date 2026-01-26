import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Free",
    price: "0",
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
  },
  {
    name: "Pro",
    price: "9.99",
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
  },
  {
    name: "Enterprise",
    price: "Custom",
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
  },
];

const PricingSection = () => {
  return (
    <section id="pricing" className="py-24 md:py-32 bg-secondary/20">
      <div className="container px-4">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Simple, <span className="text-gradient">transparent</span> pricing
          </h2>
          <p className="text-lg text-muted-foreground">
            Start free, upgrade when you need more. No hidden fees.
          </p>
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

              <div className="p-6">
                {/* Plan Header */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-1">
                    {plan.price !== "Custom" && (
                      <span className="text-sm text-muted-foreground">€</span>
                    )}
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
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
