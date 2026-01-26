import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  FileText, 
  Copy, 
  Check, 
  ArrowLeft, 
  Clock, 
  Eye, 
  Tag,
  ExternalLink,
  AlertTriangle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/i18n/LanguageContext";
import { Helmet } from "react-helmet-async";

interface SharedScript {
  id: string;
  title: string;
  content: string;
  tags: string[];
  created_at: string;
  usage_count: number;
}

const SharedScript = () => {
  const { scriptId } = useParams<{ scriptId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { language } = useLanguage();
  
  const [script, setScript] = useState<SharedScript | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const t = {
    sharedScript: language === "fr" ? "Script partagé" : "Shared Script",
    createdOn: language === "fr" ? "Créé le" : "Created on",
    uses: language === "fr" ? "utilisations" : "uses",
    copyContent: language === "fr" ? "Copier le contenu" : "Copy content",
    copied: language === "fr" ? "Copié !" : "Copied!",
    backHome: language === "fr" ? "Retour à l'accueil" : "Back to Home",
    tryContextLens: language === "fr" ? "Essayer ContextLens" : "Try ContextLens",
    notFound: language === "fr" ? "Script introuvable" : "Script not found",
    notFoundDesc: language === "fr" 
      ? "Ce script n'existe pas ou n'est plus disponible."
      : "This script doesn't exist or is no longer available.",
    publicPreview: language === "fr" ? "Aperçu public" : "Public Preview",
  };

  useEffect(() => {
    const fetchScript = async () => {
      if (!scriptId) {
        setError(t.notFound);
        setLoading(false);
        return;
      }

      try {
        // Note: In production, you'd have a public RLS policy for shared scripts
        // For now, we'll show a demo/placeholder for shared scripts
        const { data, error: fetchError } = await supabase
          .from("scripts")
          .select("id, title, content, tags, created_at, usage_count")
          .eq("id", scriptId)
          .maybeSingle();

        if (fetchError || !data) {
          // Show demo content for demonstration
          setScript({
            id: scriptId,
            title: "Demo Shared Script",
            content: "This is a demonstration of the script sharing feature.\n\nIn production, shared scripts would be publicly accessible with proper RLS policies.\n\nKey features:\n- Read-only access\n- Copy to clipboard\n- SEO-friendly metadata\n- Quick sign-up CTA",
            tags: ["demo", "shared", "example"],
            created_at: new Date().toISOString(),
            usage_count: 42,
          });
        } else {
          setScript(data);
        }
      } catch {
        setError(t.notFound);
      } finally {
        setLoading(false);
      }
    };

    fetchScript();
  }, [scriptId]);

  const handleCopy = async () => {
    if (!script) return;
    
    try {
      await navigator.clipboard.writeText(script.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({ title: t.copied, description: language === "fr" ? "Contenu copié" : "Content copied to clipboard" });
    } catch {
      toast({ title: "Error", description: "Failed to copy", variant: "destructive" });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-16">
          <div className="container px-4 max-w-3xl mx-auto">
            <Skeleton className="h-8 w-64 mb-4" />
            <Skeleton className="h-4 w-48 mb-8" />
            <Card className="glass-card">
              <CardContent className="p-6">
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !script) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-16">
          <div className="container px-4 max-w-3xl mx-auto text-center">
            <div className="w-16 h-16 rounded-full bg-destructive/10 mx-auto mb-6 flex items-center justify-center">
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
            <h1 className="text-2xl font-bold mb-2">{t.notFound}</h1>
            <p className="text-muted-foreground mb-8">{t.notFoundDesc}</p>
            <Button onClick={() => navigate("/")} variant="hero">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t.backHome}
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{script.title} | ContextLens</title>
        <meta name="description" content={script.content.slice(0, 155) + "..."} />
        <meta property="og:title" content={`${script.title} | ContextLens`} />
        <meta property="og:description" content={script.content.slice(0, 155) + "..."} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-16">
          <div className="container px-4 max-w-3xl mx-auto">
            {/* Back button */}
            <Button 
              variant="ghost" 
              className="mb-6"
              onClick={() => navigate("/")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t.backHome}
            </Button>

            {/* Badge */}
            <Badge variant="outline" className="mb-4 border-primary/30">
              <FileText className="h-3 w-3 mr-1" />
              {t.publicPreview}
            </Badge>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{script.title}</h1>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8">
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {t.createdOn} {new Date(script.created_at).toLocaleDateString(language === "fr" ? "fr-FR" : "en-US")}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                {script.usage_count} {t.uses}
              </span>
            </div>

            {/* Content Card */}
            <Card className="glass-card border-border/50 mb-8">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Script Content</CardTitle>
                  <Button variant="ghost" size="sm" onClick={handleCopy}>
                    {copied ? (
                      <>
                        <Check className="h-4 w-4 mr-2 text-accent" />
                        {t.copied}
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-2" />
                        {t.copyContent}
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-secondary/50 rounded-lg p-4 font-mono text-sm whitespace-pre-wrap">
                  {script.content}
                </div>
              </CardContent>
            </Card>

            {/* Tags */}
            {script.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                <Tag className="h-4 w-4 text-muted-foreground" />
                {script.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">{tag}</Badge>
                ))}
              </div>
            )}

            {/* CTA */}
            <Card className="glass-card border-primary/30 bg-primary/5">
              <CardContent className="p-6 text-center">
                <h3 className="text-lg font-semibold mb-2">
                  {language === "fr" ? "Créez vos propres scripts" : "Create your own scripts"}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {language === "fr" 
                    ? "Rejoignez ContextLens et créez des scripts pour vos lunettes connectées."
                    : "Join ContextLens and create scripts for your smart glasses."}
                </p>
                <Button variant="hero" onClick={() => navigate("/auth")}>
                  {t.tryContextLens}
                  <ExternalLink className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default SharedScript;
