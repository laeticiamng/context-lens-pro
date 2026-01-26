import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/i18n/LanguageContext";

interface ClinicalNote {
  id: string;
  patient_id: string;
  content: string;
  source: string;
  ar_context?: {
    view_angle?: string;
    zoom_level?: number;
    focused_region?: string;
    emotions_snapshot?: Record<string, number>;
  };
  created_at: string;
  created_by: string;
}

export const useClinicalNotes = (patientId: string | null) => {
  const { toast } = useToast();
  const { language } = useLanguage();
  const [notes, setNotes] = useState<ClinicalNote[]>([]);
  const [loading, setLoading] = useState(false);

  // For demo mode, store notes locally
  const [localNotes, setLocalNotes] = useState<ClinicalNote[]>([]);

  const addNote = async (content: string, arContext?: ClinicalNote["ar_context"]) => {
    if (!patientId) return null;
    
    const newNote: ClinicalNote = {
      id: `note-${Date.now()}`,
      patient_id: patientId,
      content,
      source: "context-lens-ar",
      ar_context: arContext,
      created_at: new Date().toISOString(),
      created_by: "current-user",
    };

    // In demo mode, store locally
    setLocalNotes(prev => [newNote, ...prev]);
    
    toast({
      title: language === "fr" ? "Note ajoutée" : "Note added",
      description: content.slice(0, 50) + (content.length > 50 ? "..." : ""),
    });

    return newNote;
  };

  const deleteNote = (noteId: string) => {
    setLocalNotes(prev => prev.filter(n => n.id !== noteId));
    toast({
      title: language === "fr" ? "Note supprimée" : "Note deleted",
    });
  };

  const exportNotes = () => {
    if (localNotes.length === 0) {
      toast({
        title: language === "fr" ? "Aucune note" : "No notes",
        description: language === "fr" ? "Aucune note à exporter" : "No notes to export",
        variant: "destructive",
      });
      return;
    }

    const exportData = {
      exportedAt: new Date().toISOString(),
      patientId,
      notes: localNotes.map(n => ({
        content: n.content,
        timestamp: n.created_at,
        arContext: n.ar_context,
      })),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `clinical-notes-${patientId}-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: language === "fr" ? "Notes exportées" : "Notes exported",
      description: `${localNotes.length} note(s)`,
    });
  };

  return {
    notes: localNotes,
    loading,
    addNote,
    deleteNote,
    exportNotes,
    notesCount: localNotes.length,
  };
};
