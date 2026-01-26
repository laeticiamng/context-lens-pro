import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Camera, Upload, Trash2, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/i18n/LanguageContext";

interface AvatarUploadProps {
  currentUrl: string | null;
  userId: string;
  displayName: string | null;
  onUpload: (url: string) => void;
}

const AvatarUpload = ({ currentUrl, userId, displayName, onUpload }: AvatarUploadProps) => {
  const { toast } = useToast();
  const { language } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const t = {
    profilePicture: language === "fr" ? "Photo de profil" : "Profile Picture",
    invalidFile: language === "fr" ? "Fichier invalide" : "Invalid File",
    selectImageFile: language === "fr" ? "Veuillez sélectionner une image" : "Please select an image file",
    fileTooLarge: language === "fr" ? "Fichier trop volumineux" : "File Too Large",
    selectUnder5MB: language === "fr" ? "Veuillez sélectionner une image de moins de 5 Mo" : "Please select an image under 5MB",
    avatarUpdated: language === "fr" ? "Avatar mis à jour" : "Avatar Updated",
    avatarUpdatedDesc: language === "fr" ? "Votre photo de profil a été mise à jour." : "Your profile picture has been updated.",
    uploadFailed: language === "fr" ? "Échec du téléchargement" : "Upload Failed",
    couldNotUpload: language === "fr" ? "Impossible de télécharger l'avatar" : "Could not upload avatar",
    avatarRemoved: language === "fr" ? "Avatar supprimé" : "Avatar Removed",
    avatarRemovedDesc: language === "fr" ? "Votre photo de profil a été supprimée." : "Your profile picture has been removed.",
    error: language === "fr" ? "Erreur" : "Error",
    couldNotRemove: language === "fr" ? "Impossible de supprimer l'avatar" : "Could not remove avatar",
    upload: language === "fr" ? "Télécharger" : "Upload",
    uploading: language === "fr" ? "Téléchargement..." : "Uploading...",
    fileHint: language === "fr" ? "JPG, PNG ou GIF. Max 5 Mo." : "JPG, PNG or GIF. Max 5MB.",
  };

  const getInitials = () => {
    if (displayName) {
      return displayName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
    }
    return "U";
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith("image/")) {
      toast({
        title: t.invalidFile,
        description: t.selectImageFile,
        variant: "destructive",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: t.fileTooLarge,
        description: t.selectUnder5MB,
        variant: "destructive",
      });
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to storage (if bucket exists) or use data URL
    setUploading(true);
    try {
      // For now, we'll use the data URL directly
      // In production, you'd upload to Supabase Storage
      const dataUrl = await new Promise<string>((resolve) => {
        const r = new FileReader();
        r.onloadend = () => resolve(r.result as string);
        r.readAsDataURL(file);
      });

      // Update profile with avatar URL
      const { error } = await supabase
        .from("profiles")
        .update({ 
          avatar_url: dataUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", userId);

      if (error) throw error;

      onUpload(dataUrl);
      toast({
        title: t.avatarUpdated,
        description: t.avatarUpdatedDesc,
      });
    } catch (error: any) {
      toast({
        title: t.uploadFailed,
        description: error.message || t.couldNotUpload,
        variant: "destructive",
      });
      setPreviewUrl(null);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async () => {
    setUploading(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ 
          avatar_url: null,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", userId);

      if (error) throw error;

      setPreviewUrl(null);
      onUpload("");
      toast({
        title: t.avatarRemoved,
        description: t.avatarRemovedDesc,
      });
    } catch (error: any) {
      toast({
        title: t.error,
        description: t.couldNotRemove,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const displayUrl = previewUrl || currentUrl;

  return (
    <div className="space-y-4">
      <Label>{t.profilePicture}</Label>
      
      <div className="flex items-center gap-4">
        <div className="relative group">
          <Avatar className="h-20 w-20 border-2 border-border">
            {displayUrl ? (
              <AvatarImage src={displayUrl} alt="Profile" />
            ) : null}
            <AvatarFallback className="bg-primary/10 text-primary text-xl">
              {displayUrl ? null : getInitials()}
            </AvatarFallback>
          </Avatar>
          
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-full"
          >
            <Camera className="h-6 w-6 text-white" />
          </button>
        </div>

        <div className="space-y-2">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              <Upload className="h-4 w-4 mr-2" />
              {uploading ? t.uploading : t.upload}
            </Button>
            
            {displayUrl && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRemove}
                disabled={uploading}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          <p className="text-xs text-muted-foreground">
            {t.fileHint}
          </p>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
};

export default AvatarUpload;
