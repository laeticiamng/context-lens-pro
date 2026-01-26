import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const Breadcrumbs = () => {
  const location = useLocation();
  const { language } = useLanguage();
  const pathnames = location.pathname.split("/").filter((x) => x);

  const routeLabels: Record<string, string> = {
    dashboard: language === "fr" ? "Tableau de bord" : "Dashboard",
    settings: language === "fr" ? "Paramètres" : "Settings",
    docs: "Documentation",
    auth: language === "fr" ? "Connexion" : "Sign In",
    privacy: language === "fr" ? "Politique de confidentialité" : "Privacy Policy",
    terms: language === "fr" ? "Conditions d'utilisation" : "Terms of Service",
    contact: "Contact",
  };

  // Don't show breadcrumbs on home page
  if (pathnames.length === 0) return null;

  return (
    <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
      <Link
        to="/"
        className="flex items-center gap-1 hover:text-foreground transition-colors"
      >
        <Home className="h-4 w-4" />
        <span className="sr-only">{language === "fr" ? "Accueil" : "Home"}</span>
      </Link>

      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
        const isLast = index === pathnames.length - 1;
        const label = routeLabels[name] || name.charAt(0).toUpperCase() + name.slice(1);

        return (
          <div key={name} className="flex items-center gap-2">
            <ChevronRight className="h-4 w-4" />
            {isLast ? (
              <span className="text-foreground font-medium">{label}</span>
            ) : (
              <Link
                to={routeTo}
                className="hover:text-foreground transition-colors"
              >
                {label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;
