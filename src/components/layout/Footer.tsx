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
      { label: language === "fr" ? "Référence API" : "API Reference", href: "/docs" },
      { label: language === "fr" ? "Guide SDK" : "SDK Guide", href: "/docs" },
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
    <footer ref={ref} className="border-t border-border/50 bg-card/50">
      <div className="container px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
                <Glasses className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold tracking-tight">
                Context<span className="text-gradient">Lens</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground mb-6 max-w-xs">
              {language === "fr" 
                ? "Transformez n'importe quelles lunettes connectées en prompteur contextuel. IA, privacy-first, universel."
                : "Transform any smart glasses into a contextual prompter. AI-powered, privacy-first, universal."}
            </p>
            
            {/* Social Links */}
            <div className="flex gap-3 mb-6">
              {socialLinks.map((social) => (
                <a 
                  key={social.name}
                  href={social.href} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
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
          <div>
            <h4 className="font-semibold mb-4 text-sm">{t.footer.product}</h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <a 
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm">{t.footer.resources}</h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  {link.href.startsWith("/") ? (
                    <Link 
                      to={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <a 
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm">{t.footer.company}</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  {link.href.startsWith("/") ? (
                    <Link 
                      to={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <a 
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm">{t.footer.legal}</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link 
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
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
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>🇪🇺 {language === "fr" ? "Conforme UE" : "EU Privacy Compliant"}</span>
            <span>•</span>
            <span>{language === "fr" ? "Compatible RGPD" : "GDPR Ready"}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
              {language === "fr" ? "Tous les systèmes opérationnels" : "All systems operational"}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = "Footer";

export default Footer;
