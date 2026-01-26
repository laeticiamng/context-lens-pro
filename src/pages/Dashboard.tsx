import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Glasses, 
  FileText, 
  Plus, 
  MoreVertical, 
  Search, 
  Wifi, 
  WifiOff,
  BarChart3,
  Clock,
  Eye,
  Edit,
  Trash2,
  LogOut,
  Settings,
  ChevronRight,
  Filter,
  Keyboard,
  Sparkles,
  Copy,
  Command,
  Upload,
  Brain,
  Share2,
  Activity
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useRealtimeDevices } from "@/hooks/useRealtimeDevices";
import { useOnboarding } from "@/hooks/useOnboarding";
import { useScriptActions } from "@/hooks/useScriptActions";
import { useKeyboardShortcuts } from "@/components/dashboard/KeyboardShortcuts";
import { useLanguage } from "@/i18n/LanguageContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ScriptEditorWithTemplates from "@/components/dashboard/ScriptEditorWithTemplates";
import AnalyticsWithDateRange from "@/components/dashboard/AnalyticsWithDateRange";
import AddDeviceDialog from "@/components/dashboard/AddDeviceDialog";
import ExportScriptsDialog from "@/components/dashboard/ExportScriptsDialog";
import KeyboardShortcuts from "@/components/dashboard/KeyboardShortcuts";
import UsageLimits from "@/components/dashboard/UsageLimits";
import OnboardingFlow from "@/components/onboarding/OnboardingFlow";
import ConfirmDialog from "@/components/dashboard/ConfirmDialog";
import QuickActionsBar from "@/components/dashboard/QuickActionsBar";
import MarketplacePreview from "@/components/dashboard/MarketplacePreview";
import UXControlsMapping from "@/components/dashboard/UXControlsMapping";
import EmptyState from "@/components/dashboard/EmptyState";
import ScriptImport from "@/components/dashboard/ScriptImport";
import Pagination from "@/components/dashboard/Pagination";
import DashboardSkeleton from "@/components/dashboard/DashboardSkeleton";
import ShareButton from "@/components/dashboard/ShareButton";
import DeviceHealthCheck from "@/components/dashboard/DeviceHealthCheck";
import NotificationsDropdown from "@/components/dashboard/NotificationsDropdown";
import RealtimeStats from "@/components/dashboard/RealtimeStats";
import GettingStarted from "@/components/dashboard/GettingStarted";
import TipOfTheDayCard from "@/components/dashboard/TipOfTheDayCard";
import HelpCenter from "@/components/dashboard/HelpCenter";
import HighlightText from "@/components/ui/highlight-text";
import ErrorBoundary from "@/components/ui/error-boundary";
import SEOHead from "@/components/layout/SEOHead";
import type { User } from "@supabase/supabase-js";

interface Script {
  id: string;
  title: string;
  content: string;
  tags: string[];
  is_active: boolean;
  usage_count: number;
  last_used_at: string | null;
  created_at: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t, language } = useLanguage();
  
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [scripts, setScripts] = useState<Script[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [tagFilter, setTagFilter] = useState<string>("all");
  const [editingScript, setEditingScript] = useState<Script | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isAddDeviceOpen, setIsAddDeviceOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: "script" | "device"; id: string; name: string } | null>(null);
  const [healthCheckDevice, setHealthCheckDevice] = useState<typeof devices[0] | null>(null);

  // Hooks
  const { devices, loading: devicesLoading, refreshDevices } = useRealtimeDevices(user?.id);
  const { showOnboarding, completeOnboarding, skipOnboarding } = useOnboarding();
  const { showShortcuts, setShowShortcuts } = useKeyboardShortcuts();

  // Fetch scripts function for useScriptActions
  const fetchScripts = useCallback(async () => {
    const { data, error } = await supabase
      .from("scripts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({ title: "Error", description: "Failed to load scripts", variant: "destructive" });
    } else {
      setScripts(data || []);
    }
    setLoading(false);
  }, [toast]);

  const { duplicateScript, toggleActive, deleteScript } = useScriptActions(user?.id, fetchScripts);

  // Quick actions keyboard shortcut (Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setShowQuickActions(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Auth state
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setAuthLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  // Fetch scripts on user change
  useEffect(() => {
    if (user) {
      fetchScripts();
    }
  }, [user, fetchScripts]);

  const handleSaveScript = async (scriptData: Partial<Script>) => {
    if (editingScript) {
      const { error } = await supabase
        .from("scripts")
        .update({
          title: scriptData.title,
          content: scriptData.content,
          tags: scriptData.tags,
        })
        .eq("id", editingScript.id);

      if (error) {
        toast({ title: "Error", description: "Failed to update script", variant: "destructive" });
      } else {
        toast({ title: "Success", description: "Script updated" });
        setIsEditorOpen(false);
        setEditingScript(null);
        fetchScripts();
      }
    } else {
      const { error } = await supabase.from("scripts").insert({
        user_id: user?.id as string,
        title: scriptData.title || "",
        content: scriptData.content || "",
        tags: scriptData.tags || [],
      });

      if (error) {
        toast({ title: "Error", description: "Failed to create script", variant: "destructive" });
      } else {
        toast({ title: "Success", description: "Script created" });
        setIsEditorOpen(false);
        fetchScripts();
      }
    }
  };

  const handleDeleteScript = async (id: string) => {
    const { error } = await supabase.from("scripts").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: "Failed to delete script", variant: "destructive" });
    } else {
      toast({ title: "Deleted", description: "Script removed" });
      fetchScripts();
    }
  };

  const handleEditScript = (script: Script) => {
    setEditingScript(script);
    setIsEditorOpen(true);
  };

  const handleNewScript = () => {
    setEditingScript(null);
    setIsEditorOpen(true);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const handleAddDevice = async (deviceData: {
    device_name: string;
    device_type: string;
    manufacturer: string;
    tier: number;
  }) => {
    const { error } = await supabase.from("connected_devices").insert({
      user_id: user?.id as string,
      device_name: deviceData.device_name,
      device_type: deviceData.device_type,
      manufacturer: deviceData.manufacturer,
      tier: deviceData.tier,
      is_connected: true,
    });

    if (error) {
      toast({ title: "Error", description: "Failed to add device", variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Device added successfully" });
      refreshDevices();
    }
  };

  const handleToggleActive = async (scriptId: string, isActive: boolean) => {
    const { error } = await supabase
      .from("scripts")
      .update({ is_active: isActive })
      .eq("id", scriptId);

    if (error) {
      toast({ title: "Error", description: "Failed to update script", variant: "destructive" });
    } else {
      toast({ title: "Updated", description: `Script ${isActive ? "activated" : "deactivated"}` });
      fetchScripts();
    }
  };

  const handleToggleDeviceConnection = async (deviceId: string, isConnected: boolean) => {
    const { error } = await supabase
      .from("connected_devices")
      .update({ is_connected: isConnected, last_connected_at: isConnected ? new Date().toISOString() : null })
      .eq("id", deviceId);

    if (error) {
      toast({ title: "Error", description: "Failed to update device", variant: "destructive" });
    } else {
      toast({ title: "Updated", description: `Device ${isConnected ? "connected" : "disconnected"}` });
      refreshDevices();
    }
  };

  const handleDeleteDevice = async (deviceId: string) => {
    const { error } = await supabase.from("connected_devices").delete().eq("id", deviceId);
    if (error) {
      toast({ title: "Error", description: "Failed to remove device", variant: "destructive" });
    } else {
      toast({ title: "Removed", description: "Device removed" });
      refreshDevices();
    }
  };

  // Get all unique tags for filter
  const allTags = [...new Set(scripts.flatMap(s => s.tags))].filter(Boolean);

  const filteredScripts = useMemo(() => scripts.filter(s => {
    const matchesSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = tagFilter === "all" || s.tags.includes(tagFilter);
    return matchesSearch && matchesTag;
  }), [scripts, searchQuery, tagFilter]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;
  const totalPages = Math.ceil(filteredScripts.length / pageSize);
  const paginatedScripts = useMemo(() => 
    filteredScripts.slice((currentPage - 1) * pageSize, currentPage * pageSize),
  [filteredScripts, currentPage, pageSize]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, tagFilter]);

  // Import handler
  const handleImportScripts = async (importedScripts: { title: string; content: string; tags: string[] }[]) => {
    if (!user) return;
    
    const scriptsToInsert = importedScripts.map(s => ({
      user_id: user.id,
      title: s.title,
      content: s.content,
      tags: s.tags,
    }));

    const { error } = await supabase.from("scripts").insert(scriptsToInsert);
    if (error) {
      toast({ title: "Error", description: "Failed to import scripts", variant: "destructive" });
    } else {
      fetchScripts();
    }
  };

  // Analytics
  const totalUsage = scripts.reduce((sum, s) => sum + s.usage_count, 0);
  const activeScripts = scripts.filter(s => s.is_active).length;
  const connectedDevices = devices.filter(d => d.is_connected).length;

  if (authLoading || loading) {
    return <DashboardSkeleton />;
  }

  return (
    <>
      <SEOHead
        title={language === "fr" ? "Tableau de bord - ContextLens" : "Dashboard - ContextLens"}
        description={language === "fr" ? "Gérez vos scripts et appareils connectés" : "Manage your scripts and connected devices"}
      />
    <div className="min-h-screen bg-background">
      {/* Onboarding Flow */}
      {showOnboarding && (
        <OnboardingFlow 
          onComplete={completeOnboarding} 
          onSkip={skipOnboarding} 
        />
      )}

      {/* Keyboard Shortcuts Dialog */}
      <KeyboardShortcuts open={showShortcuts} onOpenChange={setShowShortcuts} />

      {/* Quick Actions (Cmd+K) */}
      <QuickActionsBar
        open={showQuickActions}
        onOpenChange={setShowQuickActions}
        onNewScript={handleNewScript}
        onAddDevice={() => setIsAddDeviceOpen(true)}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={!!deleteConfirm}
        onOpenChange={(open) => !open && setDeleteConfirm(null)}
        title={language === "fr" 
          ? `Supprimer ${deleteConfirm?.type === "script" ? "le script" : "l'appareil"} ?`
          : `Delete ${deleteConfirm?.type === "script" ? "Script" : "Device"}?`}
        description={language === "fr"
          ? `Êtes-vous sûr de vouloir supprimer "${deleteConfirm?.name}" ? Cette action est irréversible.`
          : `Are you sure you want to delete "${deleteConfirm?.name}"? This action cannot be undone.`}
        confirmLabel={t.common.delete}
        variant="destructive"
        onConfirm={() => {
          if (deleteConfirm?.type === "script") {
            deleteScript(deleteConfirm.id);
          } else if (deleteConfirm?.type === "device") {
            handleDeleteDevice(deleteConfirm.id);
          }
          setDeleteConfirm(null);
        }}
      />

      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container px-4">
          <div className="flex h-16 items-center justify-between">
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
              <span className="text-muted-foreground">{t.dashboard.title}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <NotificationsDropdown />
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setShowShortcuts(true)}
                title={language === "fr" ? "Raccourcis clavier (⌘/)" : "Keyboard shortcuts (⌘/)"}
              >
                <Keyboard className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => navigate("/settings")}>
                <Settings className="h-5 w-5" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">
                        {user?.email?.[0].toUpperCase()}
                      </span>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem className="text-muted-foreground">
                    {user?.email}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="h-4 w-4 mr-2" />
                    {language === "fr" ? "Déconnexion" : "Sign Out"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <main className="container px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="glass-card border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{scripts.length}</p>
                  <p className="text-xs text-muted-foreground">{t.dashboard.totalScripts}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Eye className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{activeScripts}</p>
                  <p className="text-xs text-muted-foreground">{t.dashboard.activeScripts}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Glasses className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{connectedDevices}</p>
                  <p className="text-xs text-muted-foreground">{t.dashboard.connectedDevices}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <BarChart3 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalUsage}</p>
                  <p className="text-xs text-muted-foreground">{t.dashboard.totalUsage}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Left Column - Usage Limits + AR Access */}
          <div className="lg:col-span-1 space-y-6">
            <UsageLimits
              scriptsCount={scripts.length}
              scriptsLimit={10}
              analysesUsed={totalUsage}
              analysesLimit={100}
              devicesCount={devices.length}
              devicesLimit={3}
              plan="free"
            />
            
            {/* Clinical AR Access Card */}
            <Card className="glass-card border-border/50 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />
              <CardContent className="p-4 relative">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <Brain className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">{t.clinicalAR.title}</h3>
                    <p className="text-xs text-muted-foreground">
                      {language === "fr" ? "Module AR Médical" : "Medical AR Module"}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mb-3">
                  {t.clinicalAR.description}
                </p>
                <Button 
                  variant="hero" 
                  size="sm" 
                  className="w-full"
                  onClick={() => navigate("/clinical-ar")}
                >
                  <Glasses className="h-4 w-4 mr-2" />
                  {t.clinicalAR.startSession}
                </Button>
              </CardContent>
            </Card>
            
            {/* Vision IRM Access Card */}
            <Card className="glass-card border-border/50 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/30 to-primary/5" />
              <CardContent className="p-4 relative">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-secondary-foreground/80 to-primary flex items-center justify-center">
                    <Activity className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">
                      {language === "fr" ? "Vision IRM" : "MRI Vision"}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {language === "fr" ? "Anatomie 3D AR" : "3D AR Anatomy"}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mb-3">
                  {language === "fr" 
                    ? "Visualisation anatomique corps entier en réalité augmentée"
                    : "Full body anatomical visualization in augmented reality"}
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => navigate("/vision-irm")}
                >
                  <Activity className="h-4 w-4 mr-2" />
                  {language === "fr" ? "Ouvrir Vision IRM" : "Open MRI Vision"}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="scripts" className="space-y-6">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <TabsList>
                  <TabsTrigger value="scripts" className="gap-2">
                    <FileText className="h-4 w-4" />
                    {t.dashboard.scripts}
                  </TabsTrigger>
                  <TabsTrigger value="devices" className="gap-2">
                    <Glasses className="h-4 w-4" />
                    {t.dashboard.devices}
                  </TabsTrigger>
                  <TabsTrigger value="analytics" className="gap-2">
                    <BarChart3 className="h-4 w-4" />
                    {t.dashboard.analytics}
                  </TabsTrigger>
                </TabsList>
                
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder={t.dashboard.searchScripts}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 w-48 lg:w-64"
                    />
                  </div>
                  
                  {allTags.length > 0 && (
                    <Select value={tagFilter} onValueChange={setTagFilter}>
                      <SelectTrigger className="w-36">
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue placeholder={language === "fr" ? "Filtrer" : "Filter by tag"} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{language === "fr" ? "Tous les tags" : "All Tags"}</SelectItem>
                        {allTags.map((tag) => (
                          <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  
                  {scripts.length > 0 && (
                    <ExportScriptsDialog scripts={scripts} />
                  )}
                  
                  <ScriptImport onImport={handleImportScripts} />
                  
                  <Button variant="hero" onClick={handleNewScript}>
                    <Plus className="h-4 w-4 mr-2" />
                    {t.dashboard.newScript}
                  </Button>
                </div>
              </div>

              {/* Scripts Tab */}
              <TabsContent value="scripts" className="space-y-4">
                {scripts.length === 0 ? (
                  <EmptyState type="scripts" onAction={handleNewScript} />
                ) : filteredScripts.length === 0 ? (
                  <Card className="glass-card border-border/50">
                    <CardContent className="py-12 text-center">
                      <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">
                        {language === "fr" ? "Aucun script correspondant" : "No matching scripts"}
                      </h3>
                      <p className="text-muted-foreground">
                        {language === "fr" ? "Essayez d'ajuster votre recherche ou vos filtres." : "Try adjusting your search or filter criteria."}
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <>
                    <div className="grid md:grid-cols-2 gap-4">
                      {paginatedScripts.map((script) => (
                        <Card 
                          key={script.id} 
                          className="glass-card border-border/50 hover:border-primary/30 transition-colors cursor-pointer"
                          onClick={() => handleEditScript(script)}
                        >
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                              <div>
                                <CardTitle className="text-base">
                                  <HighlightText text={script.title} highlight={searchQuery} />
                                </CardTitle>
                                <CardDescription className="mt-1">
                                  <HighlightText 
                                    text={script.content.slice(0, 60) + "..."} 
                                    highlight={searchQuery} 
                                  />
                                </CardDescription>
                              </div>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleEditScript(script); }}>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); duplicateScript(script); }}>
                                    <Copy className="h-4 w-4 mr-2" />
                                    Duplicate
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleToggleActive(script.id, !script.is_active); }}>
                                    <Eye className="h-4 w-4 mr-2" />
                                    {script.is_active ? "Deactivate" : "Activate"}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                                    <Share2 className="h-4 w-4 mr-2" />
                                    <ShareButton 
                                      scriptId={script.id} 
                                      scriptTitle={script.title} 
                                      scriptContent={script.content}
                                      variant="ghost"
                                      size="sm"
                                    />
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem 
                                    className="text-destructive focus:text-destructive"
                                    onClick={(e) => { e.stopPropagation(); setDeleteConfirm({ type: "script", id: script.id, name: script.title }); }}
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="flex flex-wrap gap-1.5 mb-3">
                              {script.tags.map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                              {script.is_active && (
                                <Badge className="bg-accent/10 text-accent border-accent/20 text-xs">
                                  <Sparkles className="h-3 w-3 mr-1" />
                                  Active
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Eye className="h-3 w-3" />
                                {script.usage_count} uses
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {new Date(script.created_at).toLocaleDateString()}
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    
                    {totalPages > 1 && (
                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                        pageSize={pageSize}
                        totalItems={filteredScripts.length}
                      />
                    )}
                  </>
                )}
              </TabsContent>


              {/* Devices Tab */}
              <TabsContent value="devices" className="space-y-4">
                {devices.length === 0 ? (
                  <EmptyState type="devices" onAction={() => setIsAddDeviceOpen(true)} />
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    {devices.map((device) => (
                      <Card key={device.id} className="glass-card border-border/50">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                              device.is_connected ? "bg-accent/10" : "bg-secondary"
                            }`}>
                              {device.is_connected ? (
                                <Wifi className="h-5 w-5 text-accent" />
                              ) : (
                                <WifiOff className="h-5 w-5 text-muted-foreground" />
                              )}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium">{device.device_name}</h4>
                              <p className="text-sm text-muted-foreground">
                                {device.manufacturer} • Tier {device.tier}
                              </p>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleToggleDeviceConnection(device.id, !device.is_connected)}>
                                  {device.is_connected ? (
                                    <>
                                      <WifiOff className="h-4 w-4 mr-2" />
                                      Disconnect
                                    </>
                                  ) : (
                                    <>
                                      <Wifi className="h-4 w-4 mr-2" />
                                      Reconnect
                                    </>
                                  )}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setHealthCheckDevice(device)}>
                                  <Activity className="h-4 w-4 mr-2" />
                                  {language === "fr" ? "Diagnostic" : "Health Check"}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  className="text-destructive"
                                  onClick={() => setDeleteConfirm({ type: "device", id: device.id, name: device.device_name })}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Remove
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    {/* Add device button */}
                    <Card 
                      className="glass-card border-border/50 border-dashed hover:border-primary/50 cursor-pointer transition-colors"
                      onClick={() => setIsAddDeviceOpen(true)}
                    >
                      <CardContent className="p-4 flex items-center justify-center h-full min-h-[80px]">
                        <div className="text-center">
                          <Plus className="h-6 w-6 mx-auto text-muted-foreground mb-1" />
                          <span className="text-sm text-muted-foreground">Add Device</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </TabsContent>

              {/* Analytics Tab */}
              <TabsContent value="analytics" className="space-y-6">
                <AnalyticsWithDateRange scripts={scripts} devices={devices} userId={user?.id} />
                
                {/* UX Controls Mapping */}
                <UXControlsMapping />
                
                {/* Marketplace Preview */}
                <MarketplacePreview />
              </TabsContent>
            </Tabs>
          </div>
        </div>
        
        {/* Bottom Row - Additional Widgets */}
        <div className="grid lg:grid-cols-3 gap-6 mt-8">
          {/* Getting Started */}
          <GettingStarted
            scriptsCount={scripts.length}
            devicesCount={devices.length}
            hasConnectedDevice={connectedDevices > 0}
            onAddScript={handleNewScript}
            onAddDevice={() => setIsAddDeviceOpen(true)}
          />
          
          {/* Tip of the Day */}
          <TipOfTheDayCard />
          
          {/* Help Center */}
          <HelpCenter />
        </div>
      </main>

      {/* Script Editor Dialog */}
      <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="sr-only">
            <DialogTitle>{editingScript ? "Edit Script" : "New Script"}</DialogTitle>
            <DialogDescription>
              {editingScript ? "Edit your script content and settings." : "Create a new script for your prompter."}
            </DialogDescription>
          </DialogHeader>
          <ScriptEditorWithTemplates
            script={editingScript}
            onSave={handleSaveScript}
            onClose={() => {
              setIsEditorOpen(false);
              setEditingScript(null);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Add Device Dialog */}
      <AddDeviceDialog
        open={isAddDeviceOpen}
        onOpenChange={setIsAddDeviceOpen}
        onDeviceAdded={handleAddDevice}
      />

      {/* Device Health Check Dialog */}
      {healthCheckDevice && (
        <Dialog open={!!healthCheckDevice} onOpenChange={(open) => !open && setHealthCheckDevice(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader className="sr-only">
              <DialogTitle>{language === "fr" ? "Diagnostic appareil" : "Device Health Check"}</DialogTitle>
              <DialogDescription>
                {language === "fr" ? "Vérifiez l'état de votre appareil" : "Check your device status"}
              </DialogDescription>
            </DialogHeader>
            <DeviceHealthCheck 
              device={healthCheckDevice}
              onClose={() => setHealthCheckDevice(null)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
    </>
  );
};

export default Dashboard;
