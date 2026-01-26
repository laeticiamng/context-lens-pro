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
import type { User as SupabaseUser } from "@supabase/supabase-js";
import PrivacyControls from "@/components/dashboard/PrivacyControls";
import PasswordChangeDialog from "@/components/settings/PasswordChangeDialog";
import SessionManagement from "@/components/settings/SessionManagement";
import AvatarUpload from "@/components/settings/AvatarUpload";
import SettingsSkeleton from "@/components/settings/SettingsSkeleton";
import APIKeyManager from "@/components/settings/APIKeyManager";
import ErrorBoundary from "@/components/ui/error-boundary";

const Settings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
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
      toast({ title: "Error", description: "Failed to save preferences", variant: "destructive" });
    } else {
      toast({ title: "Saved", description: "Notification preferences updated" });
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
      toast({ title: "Error", description: "Failed to save profile", variant: "destructive" });
    } else {
      toast({ title: "Saved", description: "Profile updated successfully" });
    }
    
    setSaving(false);
  };

  const copyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ title: "Copied", description: "API key copied to clipboard" });
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
              <span className="text-muted-foreground">Settings</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">Manage your account, privacy, and preferences</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 max-w-2xl">
            <TabsTrigger value="profile" className="gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Alerts</span>
            </TabsTrigger>
            <TabsTrigger value="api" className="gap-2">
              <Key className="h-4 w-4" />
              <span className="hidden sm:inline">API</span>
            </TabsTrigger>
            <TabsTrigger value="billing" className="gap-2">
              <CreditCard className="h-4 w-4" />
              <span className="hidden sm:inline">Billing</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card className="glass-card border-border/50">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal details and avatar</CardDescription>
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
                  <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input
                    id="displayName"
                    placeholder="Your name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                  />
                </div>

                <Button variant="hero" onClick={handleSaveProfile} disabled={saving}>
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card className="glass-card border-border/50">
              <CardHeader>
                <CardTitle>Password</CardTitle>
                <CardDescription>Change your account password</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" onClick={() => setShowPasswordDialog(true)}>
                  <Lock className="h-4 w-4 mr-2" />
                  Change Password
                </Button>
              </CardContent>
            </Card>

            <SessionManagement />
            
            <PrivacyControls 
              onExportData={handleExportData}
              onDeleteData={handleDeleteData}
            />
          </TabsContent>

          <TabsContent value="notifications">
            <Card className="glass-card border-border/50">
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Choose how you want to be notified</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive updates via email</p>
                  </div>
                  <Switch
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Browser push notifications</p>
                  </div>
                  <Switch
                    checked={pushNotifications}
                    onCheckedChange={setPushNotifications}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Weekly Digest</Label>
                    <p className="text-sm text-muted-foreground">Weekly summary of activity</p>
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
                  {savingNotifications ? "Saving..." : "Save Preferences"}
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
            <Card className="glass-card border-border/50">
              <CardHeader>
                <CardTitle>Subscription & Billing</CardTitle>
                <CardDescription>Manage your plan and payment methods</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 rounded-lg bg-secondary/50 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">Free Plan</h4>
                      <Badge variant="secondary">Current</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">10 scripts, 100 analyses/month</p>
                  </div>
                  <Button variant="hero" onClick={() => navigate("/#pricing")}>
                    Upgrade
                  </Button>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">Usage This Month</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 rounded-lg bg-secondary/30">
                      <p className="text-2xl font-bold text-primary">3/10</p>
                      <p className="text-xs text-muted-foreground">Scripts created</p>
                    </div>
                    <div className="p-3 rounded-lg bg-secondary/30">
                      <p className="text-2xl font-bold text-accent">24/100</p>
                      <p className="text-xs text-muted-foreground">Analyses used</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-border/50">
                  <p className="text-sm text-muted-foreground">
                    Need more? <a href="/#pricing" className="text-primary hover:underline">Compare plans</a> or{" "}
                    <a href="mailto:sales@contextlens.io" className="text-primary hover:underline">contact sales</a> for Enterprise.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <PasswordChangeDialog 
        open={showPasswordDialog} 
        onOpenChange={setShowPasswordDialog} 
      />
    </div>
  );
};

export default Settings;
