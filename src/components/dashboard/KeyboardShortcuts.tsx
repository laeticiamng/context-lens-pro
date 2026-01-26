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

interface ShortcutGroup {
  title: string;
  shortcuts: {
    keys: string[];
    description: string;
  }[];
}

const shortcutGroups: ShortcutGroup[] = [
  {
    title: "Navigation",
    shortcuts: [
      { keys: ["⌘", "K"], description: "Open command palette" },
      { keys: ["⌘", "/"], description: "Show keyboard shortcuts" },
      { keys: ["⌘", "1"], description: "Go to Scripts" },
      { keys: ["⌘", "2"], description: "Go to Devices" },
      { keys: ["⌘", "3"], description: "Go to Analytics" },
    ],
  },
  {
    title: "Scripts",
    shortcuts: [
      { keys: ["⌘", "N"], description: "Create new script" },
      { keys: ["⌘", "S"], description: "Save current script" },
      { keys: ["⌘", "D"], description: "Duplicate script" },
      { keys: ["Delete"], description: "Delete selected script" },
      { keys: ["⌘", "F"], description: "Search scripts" },
    ],
  },
  {
    title: "Preview",
    shortcuts: [
      { keys: ["↑"], description: "Previous line" },
      { keys: ["↓"], description: "Next line" },
      { keys: ["+"], description: "Increase font size" },
      { keys: ["-"], description: "Decrease font size" },
      { keys: ["Space"], description: "Toggle preview mode" },
    ],
  },
  {
    title: "General",
    shortcuts: [
      { keys: ["Esc"], description: "Close dialog / Cancel" },
      { keys: ["⌘", "Z"], description: "Undo" },
      { keys: ["⌘", "⇧", "Z"], description: "Redo" },
      { keys: ["⌘", "E"], description: "Export scripts" },
    ],
  },
];

interface KeyboardShortcutsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const KeyboardShortcuts = ({ open, onOpenChange }: KeyboardShortcutsProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="h-5 w-5 text-primary" />
            Keyboard Shortcuts
          </DialogTitle>
          <DialogDescription>
            Speed up your workflow with these keyboard shortcuts
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
            Press <kbd className="px-1.5 py-0.5 text-xs font-mono bg-background rounded border">⌘</kbd> + <kbd className="px-1.5 py-0.5 text-xs font-mono bg-background rounded border">/</kbd> anytime to show this dialog
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
