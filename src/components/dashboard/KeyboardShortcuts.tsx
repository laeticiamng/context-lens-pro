import { useEffect, useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Keyboard } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

interface ShortcutGroup {
  title: string;
  shortcuts: {
    keys: string[];
    description: string;
  }[];
}

interface KeyboardShortcutsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const KeyboardShortcuts = ({ open, onOpenChange }: KeyboardShortcutsProps) => {
  const { language } = useLanguage();

  const t = {
    title: language === "fr" ? "Raccourcis clavier" : "Keyboard Shortcuts",
    description: language === "fr" 
      ? "Accélérez votre workflow avec ces raccourcis" 
      : "Speed up your workflow with these keyboard shortcuts",
    pressAnytime: language === "fr"
      ? "Appuyez sur"
      : "Press",
    toShow: language === "fr"
      ? "à tout moment pour afficher cette fenêtre"
      : "anytime to show this dialog",
  };

  const shortcutGroups: ShortcutGroup[] = [
    {
      title: "Navigation",
      shortcuts: [
        { keys: ["⌘", "K"], description: language === "fr" ? "Ouvrir la palette de commandes" : "Open command palette" },
        { keys: ["⌘", "/"], description: language === "fr" ? "Afficher les raccourcis" : "Show keyboard shortcuts" },
        { keys: ["⌘", "1"], description: language === "fr" ? "Aller aux Scripts" : "Go to Scripts" },
        { keys: ["⌘", "2"], description: language === "fr" ? "Aller aux Appareils" : "Go to Devices" },
        { keys: ["⌘", "3"], description: language === "fr" ? "Aller aux Analytiques" : "Go to Analytics" },
      ],
    },
    {
      title: "Scripts",
      shortcuts: [
        { keys: ["⌘", "N"], description: language === "fr" ? "Créer un nouveau script" : "Create new script" },
        { keys: ["⌘", "S"], description: language === "fr" ? "Sauvegarder le script" : "Save current script" },
        { keys: ["⌘", "D"], description: language === "fr" ? "Dupliquer le script" : "Duplicate script" },
        { keys: ["Delete"], description: language === "fr" ? "Supprimer le script sélectionné" : "Delete selected script" },
        { keys: ["⌘", "F"], description: language === "fr" ? "Rechercher des scripts" : "Search scripts" },
      ],
    },
    {
      title: language === "fr" ? "Prévisualisation" : "Preview",
      shortcuts: [
        { keys: ["↑"], description: language === "fr" ? "Ligne précédente" : "Previous line" },
        { keys: ["↓"], description: language === "fr" ? "Ligne suivante" : "Next line" },
        { keys: ["+"], description: language === "fr" ? "Augmenter la taille" : "Increase font size" },
        { keys: ["-"], description: language === "fr" ? "Diminuer la taille" : "Decrease font size" },
        { keys: ["Space"], description: language === "fr" ? "Basculer le mode aperçu" : "Toggle preview mode" },
      ],
    },
    {
      title: language === "fr" ? "Général" : "General",
      shortcuts: [
        { keys: ["Esc"], description: language === "fr" ? "Fermer / Annuler" : "Close dialog / Cancel" },
        { keys: ["⌘", "Z"], description: language === "fr" ? "Annuler" : "Undo" },
        { keys: ["⌘", "⇧", "Z"], description: language === "fr" ? "Rétablir" : "Redo" },
        { keys: ["⌘", "E"], description: language === "fr" ? "Exporter les scripts" : "Export scripts" },
      ],
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="h-5 w-5 text-primary" />
            {t.title}
          </DialogTitle>
          <DialogDescription>
            {t.description}
          </DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6 mt-4">
          {shortcutGroups.map((group) => (
            <div key={group.title}>
              <h4 className="text-sm font-medium text-muted-foreground mb-3">
                {group.title}
              </h4>
              <div className="space-y-2">
                {group.shortcuts.map((shortcut, i) => (
                  <div 
                    key={i} 
                    className="flex items-center justify-between py-1.5"
                  >
                    <span className="text-sm">{shortcut.description}</span>
                    <div className="flex items-center gap-1">
                      {shortcut.keys.map((key, j) => (
                        <kbd
                          key={j}
                          className="px-2 py-1 text-xs font-mono bg-secondary rounded border border-border"
                        >
                          {key}
                        </kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 p-3 rounded-lg bg-secondary/50 text-center">
          <p className="text-xs text-muted-foreground">
            {t.pressAnytime} <kbd className="px-1.5 py-0.5 text-xs font-mono bg-background rounded border">⌘</kbd> + <kbd className="px-1.5 py-0.5 text-xs font-mono bg-background rounded border">/</kbd> {t.toShow}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Hook to listen for keyboard shortcut
export const useKeyboardShortcuts = () => {
  const [showShortcuts, setShowShortcuts] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + /
      if ((e.metaKey || e.ctrlKey) && e.key === "/") {
        e.preventDefault();
        setShowShortcuts(prev => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return { showShortcuts, setShowShortcuts };
};

export default KeyboardShortcuts;
