import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Camera, Upload, Trash2, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AvatarUploadProps {
  currentUrl: string | null;
  userId: string;
  displayName: string | null;
  onUpload: (url: string) => void;
}

const AvatarUpload = ({ currentUrl, userId, displayName, onUpload }: AvatarUploadProps) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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
        title: "Invalid File",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please select an image under 5MB",
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
        title: "Avatar Updated",
        description: "Your profile picture has been updated.",
      });
    } catch (error: any) {
      toast({
        title: "Upload Failed",
        description: error.message || "Could not upload avatar",
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
        title: "Avatar Removed",
        description: "Your profile picture has been removed.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Could not remove avatar",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const displayUrl = previewUrl || currentUrl;

  return (
    <div className="space-y-4">
      <Label>Profile Picture</Label>
      
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
              {uploading ? "Uploading..." : "Upload"}
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
            JPG, PNG or GIF. Max 5MB.
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
