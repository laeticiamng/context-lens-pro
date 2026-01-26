import { useToast } from "@/hooks/use-toast";

interface UseShareScriptOptions {
  baseUrl?: string;
}

export const useShareScript = (options: UseShareScriptOptions = {}) => {
  const { toast } = useToast();
  const baseUrl = options.baseUrl || window.location.origin;

  const shareScript = async (script: { id: string; title: string; content: string }) => {
    const shareUrl = `${baseUrl}/shared/${script.id}`;
    const shareData = {
      title: `ContextLens Script: ${script.title}`,
      text: script.content.slice(0, 100) + "...",
      url: shareUrl,
    };

    // Try native share API first
    if (navigator.share && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        toast({ title: "Shared", description: "Script shared successfully" });
        return true;
      } catch (error: any) {
        if (error.name !== "AbortError") {
          // Fall through to clipboard
        }
      }
    }

    // Fallback to clipboard
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast({ 
        title: "Link copied", 
        description: "Share URL copied to clipboard" 
      });
      return true;
    } catch {
      toast({
        title: "Error",
        description: "Could not share or copy link",
        variant: "destructive",
      });
      return false;
    }
  };

  const copyScriptContent = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      toast({ title: "Copied", description: "Script content copied to clipboard" });
      return true;
    } catch {
      toast({ title: "Error", description: "Failed to copy", variant: "destructive" });
      return false;
    }
  };

  return { shareScript, copyScriptContent };
};
