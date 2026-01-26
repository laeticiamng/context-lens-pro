import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Copy, Check, Eye, EyeOff, RefreshCw, Key, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/i18n/LanguageContext";

interface APIKeyManagerProps {
  userId: string;
}

const APIKeyManager = ({ userId }: APIKeyManagerProps) => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showRegenerateDialog, setShowRegenerateDialog] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  
  // Generate a deterministic but secure-looking key from user ID
  const [keyVersion, setKeyVersion] = useState(1);
  const apiKey = `cl_live_${userId.slice(0, 8)}${keyVersion}${userId.slice(-8)}`;

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ title: t.apiKey.copied, description: t.apiKey.copiedDesc });
  };

  const handleRegenerate = async () => {
    setRegenerating(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setKeyVersion(prev => prev + 1);
    setShowRegenerateDialog(false);
    setRegenerating(false);
    
    toast({
      title: t.apiKey.regenerated,
      description: t.apiKey.regeneratedDesc,
    });
  };

  return (
    <>
      <Card className="glass-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            {t.apiKey.title}
          </CardTitle>
          <CardDescription>
            {t.apiKey.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>{t.apiKey.yourApiKey}</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  value={showKey ? apiKey : "•".repeat(apiKey.length)}
                  readOnly
                  className="font-mono text-sm pr-20"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-10 top-1/2 -translate-y-1/2 h-7 w-7"
                  onClick={() => setShowKey(!showKey)}
                >
                  {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                  onClick={copyToClipboard}
                >
                  {copied ? <Check className="h-4 w-4 text-accent" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              {t.apiKey.keepSecret}
            </p>
          </div>

          <div className="p-4 rounded-lg bg-secondary/50">
            <h4 className="font-medium mb-2">{t.apiKey.quickStart}</h4>
            <pre className="text-xs text-muted-foreground overflow-x-auto">
{`const contextLens = new ContextLens({
  apiKey: '${showKey ? apiKey : "YOUR_API_KEY"}',
});`}
            </pre>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setShowRegenerateDialog(true)}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              {t.apiKey.regenerateKey}
            </Button>
          </div>

          <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-amber-500">{t.apiKey.securityNotice}</p>
                <p className="text-muted-foreground mt-1">
                  {t.apiKey.securityNoticeDesc}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showRegenerateDialog} onOpenChange={setShowRegenerateDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t.apiKey.regenerateTitle}</AlertDialogTitle>
            <AlertDialogDescription>
              {t.apiKey.regenerateDesc}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t.common.cancel}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRegenerate}
              disabled={regenerating}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {regenerating ? t.apiKey.regenerating : t.apiKey.regenerateKey}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default APIKeyManager;
