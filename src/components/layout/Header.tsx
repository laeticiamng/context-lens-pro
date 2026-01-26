import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Glasses } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";
import ThemeToggle from "@/components/ThemeToggle";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

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

    return () => subscription.unsubscribe();
  }, []);

  const navLinks = [
    { label: "Features", href: "#features" },
    { label: "Demo", href: "#demo" },
    { label: "Devices", href: "#devices" },
    { label: "Pipeline", href: "#pipeline" },
    { label: "Pricing", href: "#pricing" },
    { label: "Docs", href: "/docs" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
              <Glasses className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              Context<span className="text-gradient">Lens</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              link.href.startsWith("/") ? (
                <Link
                  key={link.label}
                  to={link.href}
                  className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary/50"
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary/50"
                >
                  {link.label}
                </a>
              )
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            {user ? (
              <Button variant="hero" size="sm" onClick={() => navigate("/dashboard")}>
                Dashboard
              </Button>
            ) : (
              <>
                <Button variant="ghost" size="sm" onClick={() => navigate("/auth")}>
                  Sign In
                </Button>
                <Button variant="hero" size="sm" onClick={() => navigate("/auth")}>
                  Get Early Access
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              className="p-2 text-muted-foreground hover:text-foreground"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border/50">
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                link.href.startsWith("/") ? (
                  <Link
                    key={link.label}
                    to={link.href}
                    className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary/50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ) : (
                  <a
                    key={link.label}
                    href={link.href}
                    className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary/50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                )
              ))}
              <div className="flex flex-col gap-2 pt-4 mt-2 border-t border-border/50">
                {user ? (
                  <Button variant="hero" onClick={() => navigate("/dashboard")}>
                    Dashboard
                  </Button>
                ) : (
                  <>
                    <Button variant="ghost" className="justify-start" onClick={() => navigate("/auth")}>
                      Sign In
                    </Button>
                    <Button variant="hero" onClick={() => navigate("/auth")}>
                      Get Early Access
                    </Button>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
