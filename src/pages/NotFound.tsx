import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Glasses, Home, ArrowLeft, Search } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import SEOHead from "@/components/layout/SEOHead";

const NotFound = () => {
  const location = useLocation();
  const { language } = useLanguage();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  const t = {
    title: language === "fr" ? "Page Non Trouvée" : "Page Not Found",
    message: language === "fr" 
      ? "La page que vous recherchez n'existe pas ou a été déplacée."
      : "The page you're looking for doesn't exist or has been moved.",
    backToHome: language === "fr" ? "Retour à l'accueil" : "Back to Home",
    goBack: language === "fr" ? "Retour" : "Go Back",
    maybeYouWereLookingFor: language === "fr" ? "Vous cherchiez peut-être :" : "Maybe you were looking for:",
    dashboard: language === "fr" ? "Tableau de bord" : "Dashboard",
    documentation: "Documentation",
    contact: "Contact",
    signIn: language === "fr" ? "Connexion" : "Sign In",
  };

  return (
    <>
      <SEOHead
        title={language === "fr" ? "Page Non Trouvée - ContextLens" : "Page Not Found - ContextLens"}
        description={language === "fr" ? "Cette page n'existe pas" : "This page does not exist"}
      />
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      {/* Background effects */}
      <div 
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full opacity-30"
        style={{ background: "var(--gradient-glow)" }}
      />
      
      <div className="relative z-10 text-center px-4">
        {/* Logo */}
        <Link to="/" className="inline-flex items-center gap-2.5 mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent">
            <Glasses className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-2xl font-bold tracking-tight">
            Context<span className="text-gradient">Lens</span>
          </span>
        </Link>

        {/* 404 Display */}
        <div className="relative mb-8">
          <h1 className="text-[120px] md:text-[180px] font-bold text-primary/10 leading-none select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="glass-card rounded-2xl p-6 border-primary/30">
              <Search className="h-12 w-12 text-primary mx-auto mb-2" />
              <p className="text-lg font-medium">{t.title}</p>
            </div>
          </div>
        </div>

        {/* Message */}
        <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
          {t.message}
          <br />
          <span className="text-sm font-mono text-primary/60">{location.pathname}</span>
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button variant="hero" size="lg" asChild>
            <Link to="/">
              <Home className="h-4 w-4 mr-2" />
              {t.backToHome}
            </Link>
          </Button>
          <Button variant="glass" size="lg" onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t.goBack}
          </Button>
        </div>

        {/* Helpful links */}
        <div className="mt-12 pt-8 border-t border-border/50">
          <p className="text-sm text-muted-foreground mb-4">{t.maybeYouWereLookingFor}</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/dashboard" className="text-sm text-primary hover:underline">{t.dashboard}</Link>
            <span className="text-border">•</span>
            <Link to="/docs" className="text-sm text-primary hover:underline">{t.documentation}</Link>
            <span className="text-border">•</span>
            <Link to="/contact" className="text-sm text-primary hover:underline">{t.contact}</Link>
            <span className="text-border">•</span>
            <Link to="/auth" className="text-sm text-primary hover:underline">{t.signIn}</Link>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default NotFound;
