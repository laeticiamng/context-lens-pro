import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, ArrowRight, Check, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/i18n/LanguageContext";

interface NewsletterSignupProps {
  variant?: "default" | "compact" | "inline";
  source?: string;
}

const NewsletterSignup = ({ variant = "default", source = "newsletter" }: NewsletterSignupProps) => {
  const { toast } = useToast();
  const { language } = useLanguage();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const t = {
    title: language === "fr" ? "Restez informé" : "Stay Updated",
    description: language === "fr" 
      ? "Recevez les dernières nouvelles et mises à jour de ContextLens"
      : "Get the latest news and updates from ContextLens",
    placeholder: language === "fr" ? "Votre email" : "Your email",
    button: language === "fr" ? "S'inscrire" : "Subscribe",
    success: language === "fr" ? "Inscrit !" : "Subscribed!",
    successDesc: language === "fr" 
      ? "Vous recevrez nos prochaines actualités"
      : "You'll receive our upcoming news",
    error: language === "fr" ? "Erreur" : "Error",
    errorDesc: language === "fr" 
      ? "Impossible de s'inscrire. Réessayez."
      : "Could not subscribe. Please try again.",
    alreadySubscribed: language === "fr"
      ? "Cet email est déjà inscrit"
      : "This email is already subscribed",
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);

    try {
      const { error } = await supabase
        .from("waitlist")
        .insert({ 
          email: email.trim().toLowerCase(),
          source 
        });

      if (error) {
        if (error.code === "23505") {
          toast({ title: t.success, description: t.alreadySubscribed });
        } else {
          throw error;
        }
      } else {
        toast({ title: t.success, description: t.successDesc });
        setSuccess(true);
        setEmail("");
      }
    } catch {
      toast({ 
        title: t.error, 
        description: t.errorDesc, 
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex items-center gap-2 text-accent">
        <Check className="h-5 w-5" />
        <span className="text-sm font-medium">{t.success}</span>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          type="email"
          placeholder={t.placeholder}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-9 w-48"
          required
        />
        <Button type="submit" size="sm" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
        </Button>
      </form>
    );
  }

  if (variant === "inline") {
    return (
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="email"
            placeholder={t.placeholder}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10"
            required
          />
        </div>
        <Button type="submit" variant="hero" disabled={loading}>
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              {t.button}
              <ArrowRight className="h-4 w-4 ml-2" />
            </>
          )}
        </Button>
      </form>
    );
  }

  // Default variant
  return (
    <div className="space-y-3">
      <div>
        <h4 className="font-semibold text-sm">{t.title}</h4>
        <p className="text-xs text-muted-foreground">{t.description}</p>
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          type="email"
          placeholder={t.placeholder}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1"
          required
        />
        <Button type="submit" disabled={loading}>
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ArrowRight className="h-4 w-4" />
          )}
        </Button>
      </form>
    </div>
  );
};

export default NewsletterSignup;
