import { useLanguage } from "@/i18n/LanguageContext";
import InteractiveDemo from "./InteractiveDemo";

const DemoSection = () => {
  const { language } = useLanguage();

  return (
    <section id="demo" className="py-24 md:py-32 relative overflow-hidden">
      <div 
        className="absolute inset-0"
        style={{ background: "var(--gradient-hero)" }}
      />
      
      <div className="container relative z-10 px-4">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            {language === "fr" ? "Voyez " : "See "}
            <span className="text-gradient">ContextLens</span>
            {language === "fr" ? " en action" : " in Action"}
          </h2>
          <p className="text-lg text-muted-foreground">
            {language === "fr" 
              ? "Découvrez comment ContextLens transforme vos lunettes connectées en système de prompteur intelligent avec conscience contextuelle en temps réel."
              : "Watch how ContextLens transforms your smart glasses into an intelligent prompter system with real-time contextual awareness."}
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <InteractiveDemo />
        </div>
      </div>
    </section>
  );
};

export default DemoSection;
