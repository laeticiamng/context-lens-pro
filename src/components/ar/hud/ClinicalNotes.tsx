import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  StickyNote, 
  Plus, 
  Trash2, 
  Download, 
  X, 
  Send,
  Clock
} from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { useClinicalNotes } from "@/hooks/useClinicalNotes";
import { useARStore } from "@/stores/arStore";

interface ClinicalNotesProps {
  patientId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ClinicalNotes({ patientId, isOpen, onClose }: ClinicalNotesProps) {
  const { language } = useLanguage();
  const { viewAngle, zoomLevel, focusedRegion, emotions } = useARStore();
  const { notes, addNote, deleteNote, exportNotes, notesCount } = useClinicalNotes(patientId);
  const [newNote, setNewNote] = useState("");

  const t = {
    title: language === "fr" ? "Notes cliniques" : "Clinical Notes",
    placeholder: language === "fr" ? "Ajouter une note..." : "Add a note...",
    noNotes: language === "fr" ? "Aucune note" : "No notes yet",
    add: language === "fr" ? "Ajouter" : "Add",
    export: language === "fr" ? "Exporter" : "Export",
    close: language === "fr" ? "Fermer" : "Close",
    arContext: language === "fr" ? "Contexte AR" : "AR Context",
    view: language === "fr" ? "Vue" : "View",
    zoom: language === "fr" ? "Zoom" : "Zoom",
    region: language === "fr" ? "Région" : "Region",
  };

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    
    addNote(newNote, {
      view_angle: viewAngle,
      zoom_level: zoomLevel,
      focused_region: focusedRegion || undefined,
      emotions_snapshot: emotions ? {
        anxiety: emotions.anxiety,
        joy: emotions.joy,
        sadness: emotions.sadness,
        anger: emotions.anger,
        disgust: emotions.disgust,
      } : undefined,
    });
    
    setNewNote("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed left-4 bottom-32 w-80 z-50 pointer-events-auto">
      <Card className="glass-card border-border/50 backdrop-blur-xl bg-black/70 text-white">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2">
              <StickyNote className="h-4 w-4 text-primary" />
              {t.title}
              {notesCount > 0 && (
                <span className="text-xs bg-primary/20 px-1.5 py-0.5 rounded-full">
                  {notesCount}
                </span>
              )}
            </CardTitle>
            <div className="flex items-center gap-1">
              {notesCount > 0 && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7 text-white/70 hover:text-white"
                  onClick={exportNotes}
                >
                  <Download className="h-3.5 w-3.5" />
                </Button>
              )}
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7 text-white/70 hover:text-white"
                onClick={onClose}
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* New note input */}
          <div className="flex gap-2">
            <Input
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder={t.placeholder}
              className="text-sm bg-white/10 border-white/20 text-white placeholder:text-white/50"
              onKeyDown={(e) => e.key === "Enter" && handleAddNote()}
            />
            <Button 
              size="icon" 
              variant="ghost"
              className="shrink-0 text-primary hover:bg-primary/20"
              onClick={handleAddNote}
              disabled={!newNote.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>

          {/* Notes list */}
          <ScrollArea className="h-48">
            {notes.length === 0 ? (
              <div className="text-center py-6 text-white/50 text-sm">
                {t.noNotes}
              </div>
            ) : (
              <div className="space-y-2">
                {notes.map((note) => (
                  <div 
                    key={note.id}
                    className="p-2 rounded-lg bg-white/5 border border-white/10 group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm text-white/90 flex-1">{note.content}</p>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 opacity-0 group-hover:opacity-100 text-white/50 hover:text-destructive"
                        onClick={() => deleteNote(note.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-xs text-white/40">
                      <Clock className="h-3 w-3" />
                      {new Date(note.created_at).toLocaleTimeString(language === "fr" ? "fr-FR" : "en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                      {note.ar_context?.focused_region && (
                        <>
                          <span>•</span>
                          <span>{note.ar_context.focused_region}</span>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
