import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Plus, 
  FileText, 
  Glasses, 
  Settings, 
  BarChart3,
  Command,
  ArrowRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface QuickAction {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
  shortcut?: string;
  action: () => void;
}

interface QuickActionsBarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNewScript: () => void;
  onAddDevice: () => void;
}

const QuickActionsBar = ({
  open,
  onOpenChange,
  onNewScript,
  onAddDevice,
}: QuickActionsBarProps) => {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const actions: QuickAction[] = [
    {
      id: "new-script",
      label: "New Script",
      description: "Create a new prompt script",
      icon: Plus,
      shortcut: "⌘N",
      action: () => {
        onNewScript();
        onOpenChange(false);
      },
    },
    {
      id: "add-device",
      label: "Add Device",
      description: "Connect new smart glasses",
      icon: Glasses,
      shortcut: "⌘D",
      action: () => {
        onAddDevice();
        onOpenChange(false);
      },
    },
    {
      id: "scripts",
      label: "View Scripts",
      description: "Browse all your scripts",
      icon: FileText,
      action: () => {
        // Trigger scripts tab
        onOpenChange(false);
      },
    },
    {
      id: "analytics",
      label: "Analytics",
      description: "View usage statistics",
      icon: BarChart3,
      action: () => {
        // Trigger analytics tab
        onOpenChange(false);
      },
    },
    {
      id: "settings",
      label: "Settings",
      description: "Account & preferences",
      icon: Settings,
      shortcut: "⌘,",
      action: () => {
        navigate("/settings");
        onOpenChange(false);
      },
    },
  ];

  const filteredActions = actions.filter(
    (action) =>
      action.label.toLowerCase().includes(query.toLowerCase()) ||
      action.description.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (open) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < filteredActions.length - 1 ? prev + 1 : 0
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredActions.length - 1
        );
      } else if (e.key === "Enter") {
        e.preventDefault();
        filteredActions[selectedIndex]?.action();
      } else if (e.key === "Escape") {
        e.preventDefault();
        onOpenChange(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, filteredActions, selectedIndex, onOpenChange]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]">
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />
      <div className="relative w-full max-w-lg mx-4 rounded-xl border border-border/50 bg-card shadow-2xl overflow-hidden">
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 border-b border-border/50">
          <Search className="h-5 w-5 text-muted-foreground" />
          <Input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search actions..."
            className="border-0 focus-visible:ring-0 bg-transparent h-12"
          />
          <Badge variant="secondary" className="text-xs font-mono">
            <Command className="h-3 w-3 mr-1" />K
          </Badge>
        </div>

        {/* Actions List */}
        <div className="max-h-72 overflow-y-auto py-2">
          {filteredActions.length === 0 ? (
            <div className="px-4 py-8 text-center text-muted-foreground">
              No actions found for "{query}"
            </div>
          ) : (
            filteredActions.map((action, index) => (
              <button
                key={action.id}
                onClick={action.action}
                onMouseEnter={() => setSelectedIndex(index)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                  index === selectedIndex
                    ? "bg-primary/10 text-foreground"
                    : "hover:bg-secondary/50"
                }`}
              >
                <div
                  className={`h-9 w-9 rounded-lg flex items-center justify-center ${
                    index === selectedIndex
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary"
                  }`}
                >
                  <action.icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium">{action.label}</p>
                  <p className="text-sm text-muted-foreground truncate">
                    {action.description}
                  </p>
                </div>
                {action.shortcut ? (
                  <Badge variant="outline" className="text-xs font-mono">
                    {action.shortcut}
                  </Badge>
                ) : (
                  index === selectedIndex && (
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  )
                )}
              </button>
            ))
          )}
        </div>

        {/* Footer hint */}
        <div className="px-4 py-2 border-t border-border/50 text-xs text-muted-foreground flex items-center gap-4">
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-secondary">↑↓</kbd> Navigate
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-secondary">↵</kbd> Select
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-secondary">Esc</kbd> Close
          </span>
        </div>
      </div>
    </div>
  );
};

export default QuickActionsBar;
