import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Script {
  id: string;
  title: string;
  content: string;
  tags: string[];
  is_active: boolean;
}

export const useScriptActions = (userId: string | undefined, onRefresh: () => void) => {
  const { toast } = useToast();

  const duplicateScript = useCallback(async (script: Script) => {
    if (!userId) return;

    const { error } = await supabase.from("scripts").insert({
      user_id: userId,
      title: `${script.title} (Copy)`,
      content: script.content,
      tags: script.tags,
      is_active: false,
    });

    if (error) {
      toast({ title: "Error", description: "Failed to duplicate script", variant: "destructive" });
    } else {
      toast({ title: "Duplicated", description: "Script copied successfully" });
      onRefresh();
    }
  }, [userId, toast, onRefresh]);

  const toggleActive = useCallback(async (scriptId: string, isActive: boolean) => {
    const { error } = await supabase
      .from("scripts")
      .update({ is_active: isActive })
      .eq("id", scriptId);

    if (error) {
      toast({ title: "Error", description: "Failed to update script", variant: "destructive" });
    } else {
      toast({ title: "Updated", description: `Script ${isActive ? "activated" : "deactivated"}` });
      onRefresh();
    }
  }, [toast, onRefresh]);

  const deleteScript = useCallback(async (scriptId: string) => {
    const { error } = await supabase.from("scripts").delete().eq("id", scriptId);
    
    if (error) {
      toast({ title: "Error", description: "Failed to delete script", variant: "destructive" });
    } else {
      toast({ title: "Deleted", description: "Script removed" });
      onRefresh();
    }
  }, [toast, onRefresh]);

  const updateScript = useCallback(async (
    scriptId: string, 
    data: Partial<Pick<Script, "title" | "content" | "tags">>
  ) => {
    const { error } = await supabase
      .from("scripts")
      .update(data)
      .eq("id", scriptId);

    if (error) {
      toast({ title: "Error", description: "Failed to update script", variant: "destructive" });
      return false;
    }
    
    toast({ title: "Saved", description: "Script updated" });
    onRefresh();
    return true;
  }, [toast, onRefresh]);

  const createScript = useCallback(async (
    data: Pick<Script, "title" | "content" | "tags">
  ) => {
    if (!userId) return false;

    const { error } = await supabase.from("scripts").insert({
      user_id: userId,
      title: data.title || "Untitled Script",
      content: data.content || "",
      tags: data.tags || [],
    });

    if (error) {
      toast({ title: "Error", description: "Failed to create script", variant: "destructive" });
      return false;
    }
    
    toast({ title: "Created", description: "Script created successfully" });
    onRefresh();
    return true;
  }, [userId, toast, onRefresh]);

  return {
    duplicateScript,
    toggleActive,
    deleteScript,
    updateScript,
    createScript,
  };
};
