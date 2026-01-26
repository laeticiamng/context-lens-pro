import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Share2, Link, Mail, MessageCircle, Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/i18n/LanguageContext";

interface ShareButtonProps {
  scriptId: string;
  scriptTitle: string;
  scriptContent?: string;
  variant?: "ghost" | "outline" | "default";
  size?: "sm" | "default" | "lg" | "icon";
}

const ShareButton = ({ 
  scriptId, 
  scriptTitle, 
  scriptContent = "",
  variant = "ghost",
  size = "sm" 
}: ShareButtonProps) => {
  const { toast } = useToast();
  const { language } = useLanguage();
  const [copied, setCopied] = useState(false);
  
  const shareUrl = `${window.location.origin}/shared/${scriptId}`;
  const shareText = `Check out this script: ${scriptTitle}`;
  
  const t = {
    share: language === "fr" ? "Partager" : "Share",
    copyLink: language === "fr" ? "Copier le lien" : "Copy Link",
    copied: language === "fr" ? "Copié !" : "Copied!",
    email: language === "fr" ? "Par email" : "Email",
    whatsapp: "WhatsApp",
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({ title: t.copied, description: shareUrl });
    } catch {
      toast({ title: "Error", description: "Failed to copy", variant: "destructive" });
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: scriptTitle,
          text: shareText,
          url: shareUrl,
        });
      } catch (error: any) {
        if (error.name !== "AbortError") {
          handleCopyLink();
        }
      }
    } else {
      handleCopyLink();
    }
  };

  const handleEmailShare = () => {
    const subject = encodeURIComponent(`ContextLens Script: ${scriptTitle}`);
    const body = encodeURIComponent(`${shareText}\n\n${shareUrl}\n\n---\n${scriptContent.slice(0, 500)}`);
    window.open(`mailto:?subject=${subject}&body=${body}`, "_blank");
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(`${shareText}\n${shareUrl}`);
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size}>
          <Share2 className="h-4 w-4 mr-1" />
          {t.share}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={handleCopyLink}>
          {copied ? (
            <>
              <Check className="h-4 w-4 mr-2 text-accent" />
              {t.copied}
            </>
          ) : (
            <>
              <Link className="h-4 w-4 mr-2" />
              {t.copyLink}
            </>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleEmailShare}>
          <Mail className="h-4 w-4 mr-2" />
          {t.email}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleWhatsAppShare}>
          <MessageCircle className="h-4 w-4 mr-2" />
          {t.whatsapp}
        </DropdownMenuItem>
        {navigator.share && (
          <DropdownMenuItem onClick={handleNativeShare}>
            <Share2 className="h-4 w-4 mr-2" />
            {language === "fr" ? "Plus d'options..." : "More options..."}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ShareButton;
