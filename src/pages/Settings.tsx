import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  Glasses, 
  User, 
  Bell, 
  Shield, 
  CreditCard, 
  Key,
  ChevronRight,
  ArrowLeft,
  Save,
  Copy,
  Check,
  Eye,
  EyeOff,
  Lock
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/i18n/LanguageContext";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import PrivacyControls from "@/components/dashboard/PrivacyControls";
import PasswordChangeDialog from "@/components/settings/PasswordChangeDialog";
import SessionManagement from "@/components/settings/SessionManagement";
import AvatarUpload from "@/components/settings/AvatarUpload";
import SettingsSkeleton from "@/components/settings/SettingsSkeleton";
import APIKeyManager from "@/components/settings/APIKeyManager";
import BillingTab from "@/components/settings/BillingTab";
import GDPRCompliancePanel from "@/components/settings/GDPRCompliancePanel";
import ErrorBoundary from "@/components/ui/error-boundary";
import SEOHead from "@/components/layout/SEOHead";

const Settings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t, language } = useLanguage();
  
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  
  // Profile state
  const [displayName, setDisplayName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  
  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [savingNotifications, setSavingNotifications] = useState(false);

  // API Key (mock)
  const apiKey = "cl_live_" + (user?.id?.slice(0, 16) || "xxxxxxxxxxxx");

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        navigate("/auth");
        return;
      }
      setUser(session.user);
      
      // Fetch profile with notification preferences
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", session.user.id)
        .maybeSingle();
        
      if (profile) {
        setDisplayName(profile.display_name || "");
        setAvatarUrl(profile.avatar_url || "");
        // Load notification preferences
        const prefs = profile.notification_preferences as any;
        if (prefs) {
          setEmailNotifications(prefs.email ?? true);
          setPushNotifications(prefs.push ?? false);
          setWeeklyDigest(prefs.weekly_digest ?? true);
        }
      }
      
      setLoading(false);
    };
    
    fetchUser();
  }, [navigate]);

  const handleSaveNotifications = async () => {
    if (!user) return;
    setSavingNotifications(true);
    
    const { error } = await supabase
      .from("profiles")
      .update({
        notification_preferences: {
          email: emailNotifications,
          push: pushNotifications,
          weekly_digest: weeklyDigest,
        },
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user.id);
      
    if (error) {
      toast({ 
        title: t.common.error, 
        description: language === "fr" ? "Échec de la sauvegarde" : "Failed to save preferences", 
        variant: "destructive" 
      });
    } else {
      toast({ 
        title: language === "fr" ? "Enregistré" : "Saved", 
        description: language === "fr" ? "Préférences de notification mises à jour" : "Notification preferences updated" 
      });
    }
    
    setSavingNotifications(false);
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    setSaving(true);
    
    const { error } = await supabase
      .from("profiles")
      .upsert({
        user_id: user.id,
        display_name: displayName,
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString(),
      }, { onConflict: "user_id" });
      
    if (error) {
      toast({ 
        title: t.common.error, 
        description: language === "fr" ? "Échec de la sauvegarde du profil" : "Failed to save profile", 
        variant: "destructive" 
      });
    } else {
      toast({ 
        title: language === "fr" ? "Enregistré" : "Saved", 
        description: language === "fr" ? "Profil mis à jour" : "Profile updated successfully" 
      });
    }
    
    setSaving(false);
  };

  const copyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ 
      title: language === "fr" ? "Copié" : "Copied", 
      description: language === "fr" ? "Clé API copiée" : "API key copied to clipboard" 
    });
  };

  const handleExportData = async () => {
    // Export all user data as JSON
    const { data: scripts } = await supabase.from("scripts").select("*");
    const { data: devices } = await supabase.from("connected_devices").select("*");
    const { data: analytics } = await supabase.from("usage_analytics").select("*");
    const { data: profile } = await supabase.from("profiles").select("*").eq("user_id", user?.id).maybeSingle();
    
    const exportData = {
      exportedAt: new Date().toISOString(),
      exportVersion: "1.0",
      user: {
        email: user?.email,
        id: user?.id,
        createdAt: user?.created_at,
      },
      profile,
      scripts: scripts?.map(s => ({
        ...s,
        // Ensure content is fully included
        content: s.content,
      })),
      devices,
      analytics,
      summary: {
        totalScripts: scripts?.length || 0,
        totalDevices: devices?.length || 0,
        totalAnalytics: analytics?.length || 0,
      }
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `contextlens-full-export-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({ title: "Export Complete", description: `Exported ${scripts?.length || 0} scripts, ${devices?.length || 0} devices, and usage data.` });
  };

  const handleDeleteData = async () => {
    if (!user) return;
    
    // Show confirmation with real deletion
    const confirmed = window.confirm(
      "Are you sure you want to delete ALL your data? This action cannot be undone. " +
      "All scripts, devices, and analytics will be permanently deleted."
    );
    
    if (!confirmed) return;
    
    try {
      // Delete all user data
      await supabase.from("usage_analytics").delete().eq("user_id", user.id);
      await supabase.from("scripts").delete().eq("user_id", user.id);
      await supabase.from("connected_devices").delete().eq("user_id", user.id);
      await supabase.from("profiles").delete().eq("user_id", user.id);
      
      toast({ 
        title: "Data Deleted", 
        description: "All your data has been permanently deleted." 
      });
      
      // Sign out after deletion
      await supabase.auth.signOut();
      navigate("/");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete some data. Please contact support.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <SettingsSkeleton />;
  }

  return (
    <ErrorBoundary>
    <SEOHead
      title={language === "fr" ? "Paramètres - ContextLens" : "Settings - ContextLens"}
      description={language === "fr" ? "Gérez votre profil, sécurité et préférences" : "Manage your profile, security and preferences"}
    />
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container px-4">
          <div className="flex h-16 items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-4">
              <a href="/" className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
                  <Glasses className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold tracking-tight">
                  Context<span className="text-gradient">Lens</span>
                </span>
              </a>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">
                {language === "fr" ? "Paramètres" : "Settings"}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="container px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">{t.settings.title}</h1>
          <p className="text-muted-foreground">{t.settings.description}</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 max-w-2xl">
            <TabsTrigger value="profile" className="gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">{t.settings.profile}</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">{t.settings.security}</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">{t.settings.notifications}</span>
            </TabsTrigger>
            <TabsTrigger value="api" className="gap-2">
              <Key className="h-4 w-4" />
              <span className="hidden sm:inline">{t.settings.api}</span>
            </TabsTrigger>
            <TabsTrigger value="billing" className="gap-2">
              <CreditCard className="h-4 w-4" />
              <span className="hidden sm:inline">{t.settings.billing}</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card className="glass-card border-border/50">
              <CardHeader>
                <CardTitle>{language === "fr" ? "Informations du profil" : "Profile Information"}</CardTitle>
                <CardDescription>{language === "fr" ? "Modifiez vos informations personnelles et avatar" : "Update your personal details and avatar"}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {user && (
                  <AvatarUpload
                    currentUrl={avatarUrl}
                    userId={user.id}
                    displayName={displayName}
                    onUpload={setAvatarUrl}
                  />
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={user?.email || ""}
                    disabled
                    className="bg-secondary/50"
                  />
                  <p className="text-xs text-muted-foreground">
                    {language === "fr" ? "L'email ne peut pas être modifié" : "Email cannot be changed"}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="displayName">{language === "fr" ? "Nom d'affichage" : "Display Name"}</Label>
                  <Input
                    id="displayName"
                    placeholder={language === "fr" ? "Votre nom" : "Your name"}
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                  />
                </div>

                <Button variant="hero" onClick={handleSaveProfile} disabled={saving}>
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? t.settings.saving : t.settings.save}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card className="glass-card border-border/50">
              <CardHeader>
                <CardTitle>{language === "fr" ? "Mot de passe" : "Password"}</CardTitle>
                <CardDescription>{language === "fr" ? "Modifier le mot de passe de votre compte" : "Change your account password"}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" onClick={() => setShowPasswordDialog(true)}>
                  <Lock className="h-4 w-4 mr-2" />
                  {language === "fr" ? "Modifier le mot de passe" : "Change Password"}
                </Button>
              </CardContent>
            </Card>

            <SessionManagement />
            
            {user && (
              <GDPRCompliancePanel
                userId={user.id}
                onExportData={handleExportData}
                onDeleteData={handleDeleteData}
              />
            )}
            
            <PrivacyControls 
              onExportData={handleExportData}
              onDeleteData={handleDeleteData}
            />
          </TabsContent>

          <TabsContent value="notifications">
            <Card className="glass-card border-border/50">
              <CardHeader>
                <CardTitle>{language === "fr" ? "Préférences de notification" : "Notification Preferences"}</CardTitle>
                <CardDescription>{language === "fr" ? "Choisissez comment vous souhaitez être notifié" : "Choose how you want to be notified"}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>{language === "fr" ? "Notifications email" : "Email Notifications"}</Label>
                    <p className="text-sm text-muted-foreground">
                      {language === "fr" ? "Recevoir les mises à jour par email" : "Receive updates via email"}
                    </p>
                  </div>
                  <Switch
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>{language === "fr" ? "Notifications push" : "Push Notifications"}</Label>
                    <p className="text-sm text-muted-foreground">
                      {language === "fr" ? "Notifications push navigateur" : "Browser push notifications"}
                    </p>
                  </div>
                  <Switch
                    checked={pushNotifications}
                    onCheckedChange={setPushNotifications}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>{language === "fr" ? "Résumé hebdomadaire" : "Weekly Digest"}</Label>
                    <p className="text-sm text-muted-foreground">
                      {language === "fr" ? "Résumé hebdomadaire de l'activité" : "Weekly summary of activity"}
                    </p>
                  </div>
                  <Switch
                    checked={weeklyDigest}
                    onCheckedChange={setWeeklyDigest}
                  />
                </div>

                <Button 
                  variant="hero" 
                  onClick={handleSaveNotifications}
                  disabled={savingNotifications}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {savingNotifications ? t.settings.saving : t.settings.save}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* API Tab */}
          <TabsContent value="api">
            {user && <APIKeyManager userId={user.id} />}
          </TabsContent>

          {/* Billing Tab */}
          <TabsContent value="billing">
            <BillingTab currentPlan="free" />
          </TabsContent>
        </Tabs>
      </main>

      <PasswordChangeDialog 
        open={showPasswordDialog} 
        onOpenChange={setShowPasswordDialog} 
      />
    </div>
    </ErrorBoundary>
  );
};

export default Settings;
