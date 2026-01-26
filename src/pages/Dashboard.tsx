import { useState, useEffect } from "react";
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
  ChevronRight
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ScriptEditor from "@/components/dashboard/ScriptEditor";
import AnalyticsCharts from "@/components/dashboard/AnalyticsCharts";
import AddDeviceDialog from "@/components/dashboard/AddDeviceDialog";
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

interface Device {
  id: string;
  device_name: string;
  device_type: string;
  manufacturer: string | null;
  tier: number;
  is_connected: boolean;
  last_connected_at: string | null;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [scripts, setScripts] = useState<Script[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingScript, setEditingScript] = useState<Script | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isAddDeviceOpen, setIsAddDeviceOpen] = useState(false);
  const [loading, setLoading] = useState(true);

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

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  // Fetch data
  useEffect(() => {
    if (user) {
      fetchScripts();
      fetchDevices();
    }
  }, [user]);

  const fetchScripts = async () => {
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
  };

  const fetchDevices = async () => {
    const { data, error } = await supabase
      .from("connected_devices")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) {
      setDevices(data || []);
    }
  };

  const handleSaveScript = async (scriptData: Partial<Script>) => {
    if (editingScript) {
      // Update existing
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
      // Create new
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
    await signOut();
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
      fetchDevices();
    }
  };

  const filteredScripts = scripts.filter(s => 
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Analytics
  const totalUsage = scripts.reduce((sum, s) => sum + s.usage_count, 0);
  const activeScripts = scripts.filter(s => s.is_active).length;
  const connectedDevices = devices.filter(d => d.is_connected).length;

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
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
              <span className="text-muted-foreground">Dashboard</span>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon">
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
                    Sign Out
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
                  <p className="text-xs text-muted-foreground">Total Scripts</p>
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
                  <p className="text-xs text-muted-foreground">Active Scripts</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <Glasses className="h-5 w-5 text-emerald-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{connectedDevices}</p>
                  <p className="text-xs text-muted-foreground">Connected Devices</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <BarChart3 className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalUsage}</p>
                  <p className="text-xs text-muted-foreground">Total Usage</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="scripts" className="space-y-6">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <TabsList>
              <TabsTrigger value="scripts" className="gap-2">
                <FileText className="h-4 w-4" />
                Scripts
              </TabsTrigger>
              <TabsTrigger value="devices" className="gap-2">
                <Glasses className="h-4 w-4" />
                Devices
              </TabsTrigger>
              <TabsTrigger value="analytics" className="gap-2">
                <BarChart3 className="h-4 w-4" />
                Analytics
              </TabsTrigger>
            </TabsList>
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search scripts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-64"
                />
              </div>
              <Button variant="hero" onClick={handleNewScript}>
                <Plus className="h-4 w-4 mr-2" />
                New Script
              </Button>
            </div>
          </div>

          {/* Scripts Tab */}
          <TabsContent value="scripts" className="space-y-4">
            {filteredScripts.length === 0 ? (
              <Card className="glass-card border-border/50">
                <CardContent className="py-12 text-center">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No scripts yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Create your first script to get started with contextual prompting.
                  </p>
                  <Button variant="hero" onClick={handleNewScript}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Script
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredScripts.map((script) => (
                  <Card 
                    key={script.id} 
                    className="glass-card border-border/50 hover:border-primary/30 transition-colors cursor-pointer"
                    onClick={() => handleEditScript(script)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-base">{script.title}</CardTitle>
                          <CardDescription className="mt-1">
                            {script.content.slice(0, 60)}...
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
                            <DropdownMenuItem 
                              className="text-destructive"
                              onClick={(e) => { e.stopPropagation(); handleDeleteScript(script.id); }}
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
            )}
          </TabsContent>

          {/* Devices Tab */}
          <TabsContent value="devices" className="space-y-4">
            {devices.length === 0 ? (
              <Card className="glass-card border-border/50">
                <CardContent className="py-12 text-center">
                  <Glasses className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No devices connected</h3>
                  <p className="text-muted-foreground mb-4">
                    Connect your smart glasses to start using ContextLens.
                  </p>
                  <Button variant="hero" onClick={() => setIsAddDeviceOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Device
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {devices.map((device) => (
                  <Card key={device.id} className="glass-card border-border/50">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                          device.is_connected ? "bg-emerald-500/10" : "bg-secondary"
                        }`}>
                          {device.is_connected ? (
                            <Wifi className="h-5 w-5 text-emerald-500" />
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
                        <Badge variant={device.is_connected ? "default" : "secondary"}>
                          {device.is_connected ? "Connected" : "Offline"}
                        </Badge>
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
          <TabsContent value="analytics">
            <AnalyticsCharts scripts={scripts} devices={devices} />
          </TabsContent>
        </Tabs>
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
          <ScriptEditor
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
    </div>
  );
};

export default Dashboard;
