import { forwardRef } from "react";
import { Link } from "react-router-dom";
import { Glasses, Github, Twitter, Linkedin, Youtube } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import NewsletterSignup from "./NewsletterSignup";

const Footer = forwardRef<HTMLElement>((_, ref) => {
  const { t, language } = useLanguage();

  const footerLinks = {
    product: [
      { label: language === "fr" ? "Fonctionnalités" : "Features", href: "#features" },
      { label: language === "fr" ? "Appareils" : "Devices", href: "#devices" },
      { label: "Pipeline", href: "#pipeline" },
      { label: language === "fr" ? "Tarifs" : "Pricing", href: "#pricing" },
    ],
    resources: [
      { label: "Documentation", href: "/docs" },
      { label: language === "fr" ? "API Interactive" : "API Docs", href: "/api-docs" },
      { label: language === "fr" ? "Guide SDK" : "SDK Guide", href: "/api-docs" },
      { label: "Blog", href: "#" },
    ],
    company: [
      { label: language === "fr" ? "À propos" : "About", href: "#" },
      { label: "Contact", href: "/contact" },
      { label: language === "fr" ? "Carrières" : "Careers", href: "#" },
      { label: language === "fr" ? "Kit presse" : "Press Kit", href: "#" },
    ],
    legal: [
      { label: language === "fr" ? "Politique de confidentialité" : "Privacy Policy", href: "/privacy" },
      { label: language === "fr" ? "Conditions d'utilisation" : "Terms of Service", href: "/terms" },
      { label: "RGPD", href: "/privacy" },
      { label: "Cookies", href: "/privacy" },
    ],
  };

  const socialLinks = [
    { 
      name: "Twitter", 
      href: "https://twitter.com/contextlens", 
      icon: Twitter 
    },
    { 
      name: "GitHub", 
      href: "https://github.com/contextlens", 
      icon: Github 
    },
    { 
      name: "LinkedIn", 
      href: "https://linkedin.com/company/contextlens", 
      icon: Linkedin 
    },
    { 
      name: "YouTube", 
      href: "https://youtube.com/@contextlens", 
      icon: Youtube 
    },
  ];

  return (
    <footer ref={ref} className="border-t border-border/50 bg-gradient-to-b from-card/50 to-background">
      <div className="container px-4 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-12 mb-12">
          {/* Brand */}
          <div className="sm:col-span-2">
            <Link to="/" className="inline-flex items-center gap-2.5 mb-4 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent transition-transform duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary/30">
                <Glasses className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold tracking-tight">
                Context<span className="text-gradient">Lens</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground mb-6 max-w-xs leading-relaxed">
              {language === "fr" 
                ? "Transformez n'importe quelles lunettes connectées en prompteur contextuel. IA, privacy-first, universel."
                : "Transform any smart glasses into a contextual prompter. AI-powered, privacy-first, universal."}
            </p>
            
            {/* Social Links */}
            <div className="flex gap-2 mb-6">
              {socialLinks.map((social) => (
                <a 
                  key={social.name}
                  href={social.href} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-all duration-200 hover:scale-110"
                  aria-label={social.name}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>

            {/* Newsletter */}
            <div className="max-w-xs">
              <NewsletterSignup variant="compact" source="footer" />
            </div>
          </div>

          {/* Links */}
          <div className="sm:col-span-1">
            <h4 className="font-semibold mb-4 text-sm text-foreground">{t.footer.product}</h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <a 
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200 link-underline"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="sm:col-span-1">
            <h4 className="font-semibold mb-4 text-sm text-foreground">{t.footer.resources}</h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  {link.href.startsWith("/") ? (
                    <Link 
                      to={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <a 
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                    >
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="sm:col-span-1">
            <h4 className="font-semibold mb-4 text-sm text-foreground">{t.footer.company}</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  {link.href.startsWith("/") ? (
                    <Link 
                      to={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <a 
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                    >
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="sm:col-span-1">
            <h4 className="font-semibold mb-4 text-sm text-foreground">{t.footer.legal}</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link 
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2026 ContextLens. {t.footer.copyright}
          </p>
          <div className="flex flex-wrap justify-center items-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span>🇪🇺</span>
              <span>{language === "fr" ? "Conforme UE" : "EU Privacy Compliant"}</span>
            </span>
            <span className="hidden sm:inline">•</span>
            <span>{language === "fr" ? "Compatible RGPD" : "GDPR Ready"}</span>
            <span className="hidden sm:inline">•</span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
              <span>{language === "fr" ? "Systèmes opérationnels" : "All systems operational"}</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = "Footer";

export default Footer;
