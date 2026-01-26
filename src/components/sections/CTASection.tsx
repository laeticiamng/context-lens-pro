import { forwardRef } from "react";
import WaitlistForm from "@/components/sections/WaitlistForm";
import { useLanguage } from "@/i18n/LanguageContext";

const CTASection = forwardRef<HTMLElement>((_, ref) => {
  const { t } = useLanguage();

  return (
    <section ref={ref} className="py-24 md:py-32 relative overflow-hidden">
      {/* Background effects */}
      <div 
        className="absolute inset-0"
        style={{ background: "var(--gradient-hero)" }}
      />
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px]"
        style={{ background: "var(--gradient-glow)" }}
      />

      <div className="container relative z-10 px-4">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-sm text-primary mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span>{t.cta.badge}</span>
          </div>

          {/* Headline */}
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            {t.cta.title}{" "}
            <span className="text-gradient">{t.cta.titleHighlight}</span> ?
          </h2>

          <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
            {t.cta.description}
          </p>

          {/* Waitlist Form */}
          <WaitlistForm source="cta" className="max-w-md mx-auto" />
        </div>
      </div>
    </section>
  );
});

CTASection.displayName = "CTASection";

export default CTASection;
