import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import CapabilityMatrix from "@/components/sections/CapabilityMatrix";
import DevicesSection from "@/components/sections/DevicesSection";
import InteractivePipeline from "@/components/sections/InteractivePipeline";
import PricingSection from "@/components/sections/PricingSection";
import CTASection from "@/components/sections/CTASection";
import DemoSection from "@/components/sections/DemoSection";
import FAQSection from "@/components/sections/FAQSection";
import StatsSection from "@/components/sections/StatsSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <HeroSection />
        <StatsSection />
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
  );
};

export default Index;
