import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Code, 
  FileJson, 
  Download, 
  ExternalLink,
  Copy,
  Check,
  Terminal,
  Smartphone,
  Globe,
  Server
} from "lucide-react";
import SwaggerUIComponent from "@/components/docs/SwaggerUIComponent";
import SDKDocumentation from "@/components/docs/SDKDocumentation";

const APIDocs = () => {
  const [activeTab, setActiveTab] = useState("swagger");

  return (
    <>
      <Helmet>
        <title>API Documentation | ContextLens</title>
        <meta name="description" content="Interactive API documentation with Swagger UI and SDK guides for ContextLens platform integration." />
      </Helmet>

      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="text-center space-y-4">
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                Developer Resources
              </Badge>
              <h1 className="text-4xl font-bold tracking-tight">
                API Documentation
              </h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Explore our RESTful API with interactive documentation, SDK guides, and code examples 
                for seamless integration with ContextLens platform.
              </p>
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="glass-card border-border/50 hover:border-primary/50 transition-colors cursor-pointer">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <FileJson className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">OpenAPI Spec</p>
                    <p className="text-xs text-muted-foreground">v3.1.0</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="glass-card border-border/50 hover:border-primary/50 transition-colors cursor-pointer">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/10">
                    <Terminal className="h-5 w-5 text-emerald-500" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">REST API</p>
                    <p className="text-xs text-muted-foreground">15 endpoints</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="glass-card border-border/50 hover:border-primary/50 transition-colors cursor-pointer">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-500/10">
                    <Smartphone className="h-5 w-5 text-amber-500" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Mobile SDKs</p>
                    <p className="text-xs text-muted-foreground">iOS & Android</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="glass-card border-border/50 hover:border-primary/50 transition-colors cursor-pointer">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-violet-500/10">
                    <Globe className="h-5 w-5 text-violet-500" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">WebSocket</p>
                    <p className="text-xs text-muted-foreground">Real-time</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
                <TabsTrigger value="swagger" className="gap-2">
                  <Code className="h-4 w-4" />
                  Swagger UI
                </TabsTrigger>
                <TabsTrigger value="sdk" className="gap-2">
                  <Terminal className="h-4 w-4" />
                  SDK Docs
                </TabsTrigger>
                <TabsTrigger value="openapi" className="gap-2">
                  <FileJson className="h-4 w-4" />
                  OpenAPI
                </TabsTrigger>
              </TabsList>

              <TabsContent value="swagger" className="space-y-4">
                <SwaggerUIComponent />
              </TabsContent>

              <TabsContent value="sdk" className="space-y-4">
                <SDKDocumentation />
              </TabsContent>

              <TabsContent value="openapi" className="space-y-4">
                <OpenAPIViewer />
              </TabsContent>
            </Tabs>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

// OpenAPI Spec Viewer Component
const OpenAPIViewer = () => {
  const [copied, setCopied] = useState(false);
  const [spec, setSpec] = useState<string>("");

  useEffect(() => {
    fetch("/docs/openapi.yaml")
      .then(res => res.text())
      .then(setSpec)
      .catch(() => setSpec("# Unable to load OpenAPI specification"));
  }, []);

  const copySpec = () => {
    navigator.clipboard.writeText(spec);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadSpec = () => {
    const blob = new Blob([spec], { type: "application/x-yaml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "contextlens-openapi.yaml";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="glass-card border-border/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileJson className="h-5 w-5 text-primary" />
              OpenAPI 3.1.0 Specification
            </CardTitle>
            <CardDescription>
              Full API specification in YAML format
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={copySpec}>
              {copied ? (
                <><Check className="h-4 w-4 mr-1 text-accent" /> Copied</>
              ) : (
                <><Copy className="h-4 w-4 mr-1" /> Copy</>
              )}
            </Button>
            <Button variant="outline" size="sm" onClick={downloadSpec}>
              <Download className="h-4 w-4 mr-1" />
              Download
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] rounded-lg border border-border/50 bg-secondary/30">
          <pre className="p-4 text-xs font-mono whitespace-pre-wrap">
            {spec || "Loading..."}
          </pre>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default APIDocs;
