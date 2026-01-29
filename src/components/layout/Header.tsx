import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Glasses, ChevronDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useLanguage } from "@/i18n/LanguageContext";
import { SkipLink } from "@/components/layout/SkipLink";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const { t, language } = useLanguage();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    // Listen for scroll
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const mainNavLinks = [
    { label: t.nav.features, href: "#features" },
    { label: t.demo.title.split(" ")[0], href: "#demo" },
    { label: t.nav.pricing, href: "#pricing" },
  ];

  const productLinks = [
    { label: language === "fr" ? "Appareils" : "Devices", href: "#devices" },
    { label: "Pipeline", href: "#pipeline" },
    { label: "Documentation", href: "/docs" },
  ];

  const medicalLinks = [
    { label: "LUNETTES IRM", href: "/lunettes-irm" },
    { label: "Vision IRM", href: "/vision-irm" },
  ];

  return (
    <>
      <SkipLink />
      <header 
        className={`fixed top-0 left-0 right-0 z-50 border-b transition-all duration-300 ${
          isScrolled 
            ? "border-border/50 bg-background/95 backdrop-blur-xl shadow-lg shadow-background/50" 
            : "border-transparent bg-background/80 backdrop-blur-xl"
        }`} 
        role="banner"
      >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent transition-transform duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary/30">
              <Glasses className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              Context<span className="text-gradient">Lens</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {/* Main nav links */}
            {mainNavLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-all duration-200 rounded-lg hover:bg-secondary/50"
              >
                {link.label}
              </a>
            ))}

            {/* Product Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-all duration-200 rounded-lg hover:bg-secondary/50">
                {language === "fr" ? "Produit" : "Product"}
                <ChevronDown className="h-3.5 w-3.5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-48">
                {productLinks.map((link) => (
                  link.href.startsWith("/") ? (
                    <DropdownMenuItem key={link.label} asChild>
                      <Link to={link.href} className="cursor-pointer">
                        {link.label}
                      </Link>
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem key={link.label} asChild>
                      <a href={link.href} className="cursor-pointer">
                        {link.label}
                      </a>
                    </DropdownMenuItem>
                  )
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Medical Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-all duration-200 rounded-lg hover:bg-secondary/50">
                {language === "fr" ? "Médical" : "Medical"}
                <ChevronDown className="h-3.5 w-3.5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-48">
                {medicalLinks.map((link) => (
                  <DropdownMenuItem key={link.label} asChild>
                    <Link to={link.href} className="cursor-pointer">
                      {link.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <LanguageSwitcher />
            <ThemeToggle />
            {user ? (
              <Button variant="hero" size="sm" onClick={() => navigate("/dashboard")}>
                {t.nav.dashboard}
              </Button>
            ) : (
              <>
                <Button variant="ghost" size="sm" onClick={() => navigate("/auth")}>
                  {t.nav.signIn}
                </Button>
                <Button variant="hero" size="sm" onClick={() => navigate("/auth")}>
                  {t.nav.getStarted}
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeToggle />
            <button
              className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary/50"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-border/50 animate-in slide-in-from-top-2 duration-200">
            <nav className="flex flex-col gap-1">
              {/* Main links */}
              {mainNavLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="px-4 py-3 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary/50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              
              {/* Product section */}
              <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-2">
                {language === "fr" ? "Produit" : "Product"}
              </div>
              {productLinks.map((link) => (
                link.href.startsWith("/") ? (
                  <Link
                    key={link.label}
                    to={link.href}
                    className="px-4 py-3 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary/50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ) : (
                  <a
                    key={link.label}
                    href={link.href}
                    className="px-4 py-3 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary/50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                )
              ))}

              {/* Medical section */}
              <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-2">
                {language === "fr" ? "Médical" : "Medical"}
              </div>
              {medicalLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  className="px-4 py-3 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary/50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex flex-col gap-2 pt-4 mt-2 border-t border-border/50">
                {user ? (
                  <Button variant="hero" onClick={() => navigate("/dashboard")}>
                    {t.nav.dashboard}
                  </Button>
                ) : (
                  <>
                    <Button variant="ghost" className="justify-start" onClick={() => navigate("/auth")}>
                      {t.nav.signIn}
                    </Button>
                    <Button variant="hero" onClick={() => navigate("/auth")}>
                      {t.nav.getStarted}
                    </Button>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
    </>
  );
};

export default Header;
