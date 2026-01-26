import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Glasses, Smartphone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";

const HeroSection = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();

  const scrollToDemo = () => {
    const demoSection = document.getElementById("demo");
    if (demoSection) {
      demoSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background effects */}
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-[0.02]" />
      <div 
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full"
        style={{ background: "var(--gradient-glow)" }}
      />
      <div 
        className="absolute bottom-0 left-0 right-0 h-1/2"
        style={{ background: "linear-gradient(to top, hsl(var(--background)), transparent)" }}
      />
      
      <div className="container relative z-10 px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="animate-fade-up inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-sm text-primary mb-8">
            <Sparkles className="h-4 w-4" />
            <span>{t.hero.badge}</span>
          </div>

          {/* Headline */}
          <h1 className="animate-fade-up delay-100 text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 text-balance">
            {t.hero.title}{" "}
            <span className="text-gradient">{t.hero.titleHighlight}</span>
          </h1>

          {/* Subheadline */}
          <p className="animate-fade-up delay-200 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 text-balance">
            {t.hero.description}
          </p>

          {/* CTA Buttons */}
          <div className="animate-fade-up delay-300 flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button variant="hero" size="xl" onClick={() => navigate("/auth")}>
              {t.hero.cta}
              <ArrowRight className="h-5 w-5" />
            </Button>
            <Button variant="heroOutline" size="xl" onClick={scrollToDemo}>
              {t.hero.secondaryCta}
            </Button>
          </div>

          {/* Device compatibility hint */}
          <div className="animate-fade-up delay-400 flex flex-col items-center gap-4">
            <p className="text-sm text-muted-foreground">
              {t.partners.compatible.split(" ").slice(0, 2).join(" ")}
            </p>
            <div className="flex items-center gap-6 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Glasses className="h-5 w-5" />
                <span className="text-sm">Even G2</span>
              </div>
              <div className="h-4 w-px bg-border" />
              <div className="flex items-center gap-2">
                <Glasses className="h-5 w-5" />
                <span className="text-sm">Vuzix Z100</span>
              </div>
              <div className="h-4 w-px bg-border" />
              <div className="flex items-center gap-2">
                <Smartphone className="h-5 w-5" />
                <span className="text-sm">
                  {language === "fr" ? "Tout téléphone" : "Any Phone"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Visual - Floating glasses mockup */}
        <div className="relative mt-16 md:mt-24 max-w-5xl mx-auto">
          <div className="animate-float glass-card-elevated rounded-2xl p-1 animate-pulse-glow">
            <div className="aspect-[16/9] rounded-xl bg-gradient-to-br from-secondary to-muted flex items-center justify-center overflow-hidden">
              <div className="relative w-full h-full flex items-center justify-center">
                {/* Simulated HUD display */}
                <div className="absolute inset-8 border border-primary/20 rounded-xl" />
                <div className="absolute top-12 left-12 right-12">
                  <div className="glass-card rounded-lg p-4 max-w-md">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                      <span className="text-xs text-primary font-mono">CONTEXT DETECTED</span>
                    </div>
                    <p className="text-sm text-foreground/90 leading-relaxed">
                      "Welcome the client with their name and mention the Q3 results..."
                    </p>
                    <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                      <span>Script: Sales Meeting</span>
                      <span>•</span>
                      <span>Block 1/5</span>
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-12 right-12">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="flex gap-1">
                      <span className="px-2 py-1 rounded bg-secondary/50 border border-border/50">←</span>
                      <span className="px-2 py-1 rounded bg-secondary/50 border border-border/50">→</span>
                    </div>
                    <span>Navigate</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
