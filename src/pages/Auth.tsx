import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Glasses, Mail, Lock, ArrowLeft, Eye, EyeOff, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/i18n/LanguageContext";
import ForgotPasswordDialog from "@/components/auth/ForgotPasswordDialog";
import PasswordStrengthMeter from "@/components/auth/PasswordStrengthMeter";
import SEOHead from "@/components/layout/SEOHead";
import { signUpSchema, signInSchema } from "@/lib/validations";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t, language } = useLanguage();
  
  const isResetFlow = searchParams.get("reset") === "true";

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        navigate("/dashboard");
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        navigate("/dashboard");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    // Validate form data
    const schema = isLogin ? signInSchema : signUpSchema;
    const result = schema.safeParse({ email, password });
    
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }
    
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (error) throw error;
        toast({ 
          title: language === "fr" ? "Bon retour !" : "Welcome back!", 
          description: language === "fr" ? "Vous êtes connecté." : "You've been signed in successfully." 
        });
      } else {
        const { error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
          },
        });
        if (error) throw error;
        toast({ 
          title: language === "fr" ? "Compte créé !" : "Account created!", 
          description: language === "fr" ? "Bienvenue sur ContextLens." : "Welcome to ContextLens." 
        });
      }
    } catch (error: any) {
      let message = error.message;
      if (error.message.includes("User already registered")) {
        message = language === "fr" 
          ? "Cet email est déjà enregistré. Essayez de vous connecter."
          : "This email is already registered. Try signing in instead.";
      } else if (error.message.includes("Invalid login credentials")) {
        message = language === "fr"
          ? "Email ou mot de passe invalide. Veuillez réessayer."
          : "Invalid email or password. Please try again.";
      }
      toast({ title: t.common.error, description: message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEOHead
        title={language === "fr" ? (isLogin ? "Connexion" : "Inscription") + " - ContextLens" : (isLogin ? "Sign In" : "Sign Up") + " - ContextLens"}
        description={language === "fr" ? "Accédez à votre compte ContextLens" : "Access your ContextLens account"}
      />
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
      
      <div className="relative z-10 w-full max-w-md">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t.auth.backToHome}
        </Button>

        <Card className="glass-card border-border/50">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent">
              <Glasses className="h-6 w-6 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl">
              {isLogin ? t.auth.welcomeBack : t.auth.createAccount}
            </CardTitle>
            <CardDescription>
              {isLogin ? t.auth.signInDesc : t.auth.signUpDesc}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{t.auth.email}</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`pl-10 ${errors.email ? "border-destructive" : ""}`}
                    required
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.email}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">{t.auth.password}</Label>
                  {isLogin && <ForgotPasswordDialog />}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`pl-10 pr-10 ${errors.password ? "border-destructive" : ""}`}
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.password}
                  </p>
                )}
                {!isLogin && password && <PasswordStrengthMeter password={password} />}
              </div>
              
              {isLogin && (
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked === true)}
                  />
                  <Label
                    htmlFor="remember"
                    className="text-sm text-muted-foreground cursor-pointer"
                  >
                    {t.auth.rememberMe}
                  </Label>
                </div>
              )}
              
              <Button type="submit" variant="hero" className="w-full" disabled={loading}>
                {loading 
                  ? (language === "fr" ? "Patientez..." : "Please wait...") 
                  : isLogin ? t.auth.signIn : t.auth.signUp}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">
                {isLogin ? t.auth.noAccount : t.auth.haveAccount}{" "}
              </span>
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary hover:underline font-medium"
              >
                {isLogin 
                  ? (language === "fr" ? "S'inscrire" : "Sign up") 
                  : (language === "fr" ? "Se connecter" : "Sign in")}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </>
  );
};

export default Auth;
