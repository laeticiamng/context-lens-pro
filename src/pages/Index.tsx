import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SEOHead from "@/components/layout/SEOHead";
import HeroSection from "@/components/sections/HeroSection";
import CapabilityMatrix from "@/components/sections/CapabilityMatrix";
import DevicesSection from "@/components/sections/DevicesSection";
import InteractivePipeline from "@/components/sections/InteractivePipeline";
import PricingSection from "@/components/sections/PricingSection";
import CTASection from "@/components/sections/CTASection";
import DemoSection from "@/components/sections/DemoSection";
import FAQSection from "@/components/sections/FAQSection";
import AnimatedStats from "@/components/sections/AnimatedStats";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import PartnerLogos from "@/components/sections/PartnerLogos";
import ErrorBoundary from "@/components/ui/error-boundary";
import { useLanguage } from "@/i18n/LanguageContext";

const Index = () => {
  const { language } = useLanguage();
  
  return (
    <ErrorBoundary>
      <SEOHead 
        title={language === "fr" ? "ContextLens - Scripts pour Lunettes Connectées" : "ContextLens - Scripts for Smart Glasses"}
        description={language === "fr" 
          ? "Créez et gérez vos scripts pour lunettes connectées. Compatible Even G2, Vuzix Z100, Rokid et plus."
          : "Create and manage scripts for smart glasses. Compatible with Even G2, Vuzix Z100, Rokid and more."}
      />
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <main>
          <HeroSection />
          <PartnerLogos />
          <AnimatedStats />
          <DemoSection />
          <CapabilityMatrix />
          <DevicesSection />
          <InteractivePipeline />
          <TestimonialsSection />
          <PricingSection />
          <FAQSection />
          <CTASection />
        </main>
        <Footer />
      </div>
    </ErrorBoundary>
  );
};

export default Index;
