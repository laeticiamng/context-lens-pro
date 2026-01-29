import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Glasses, Mail, Lock, ArrowLeft, Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
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
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t, language } = useLanguage();
  
  const isResetFlow = searchParams.get("reset") === "true";

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      const { error } = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      
      if (error) {
        toast({
          variant: "destructive",
          title: t.common.error,
          description: error.message || (language === "fr" ? "Échec de la connexion Google" : "Google sign-in failed"),
        });
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: t.common.error,
        description: language === "fr" ? "Erreur de connexion Google" : "Google sign-in error",
      });
    } finally {
      setGoogleLoading(false);
    }
  };

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
                    autoComplete="email"
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
                    autoComplete={isLogin ? "current-password" : "new-password"}
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
              
              <Button type="submit" variant="hero" className="w-full" disabled={loading || googleLoading}>
                {loading 
                  ? (language === "fr" ? "Patientez..." : "Please wait...") 
                  : isLogin ? t.auth.signIn : t.auth.signUp}
              </Button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    {language === "fr" ? "Ou continuer avec" : "Or continue with"}
                  </span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleGoogleSignIn}
                disabled={loading || googleLoading}
              >
                {googleLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                )}
                Google
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

            {/* Terms and Privacy links */}
            {!isLogin && (
              <p className="mt-4 text-center text-xs text-muted-foreground">
                {language === "fr" 
                  ? "En vous inscrivant, vous acceptez nos "
                  : "By signing up, you agree to our "}
                <a href="/terms" className="text-primary hover:underline">
                  {language === "fr" ? "Conditions d'utilisation" : "Terms of Service"}
                </a>
                {language === "fr" ? " et notre " : " and "}
                <a href="/privacy" className="text-primary hover:underline">
                  {language === "fr" ? "Politique de confidentialité" : "Privacy Policy"}
                </a>
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
    </>
  );
};

export default Auth;
