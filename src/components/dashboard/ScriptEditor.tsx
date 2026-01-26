import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { 
  Eye, 
  EyeOff, 
  Save, 
  X, 
  ChevronUp, 
  ChevronDown,
  Smartphone,
  Monitor,
  Type,
  AlignLeft,
  AlignCenter
} from "lucide-react";

interface Script {
  id: string;
  title: string;
  content: string;
  tags: string[];
  is_active: boolean;
}

interface ScriptEditorProps {
  script: Script | null;
  onSave: (script: Partial<Script>) => Promise<void>;
  onClose: () => void;
}

const ScriptEditor = ({ script, onSave, onClose }: ScriptEditorProps) => {
  const [title, setTitle] = useState(script?.title || "");
  const [content, setContent] = useState(script?.content || "");
  const [tags, setTags] = useState(script?.tags?.join(", ") || "");
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [previewMode, setPreviewMode] = useState<"phone" | "hud">("hud");
  const [currentLine, setCurrentLine] = useState(0);
  const [fontSize, setFontSize] = useState(16);
  const [textAlign, setTextAlign] = useState<"left" | "center">("center");

  useEffect(() => {
    if (script) {
      setTitle(script.title);
      setContent(script.content);
      setTags(script.tags?.join(", ") || "");
    }
  }, [script]);

  const lines = content.split("\n").filter(line => line.trim());
  const visibleLines = 5;
  const displayLines = lines.slice(currentLine, currentLine + visibleLines);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave({
        title,
        content,
        tags: tags.split(",").map(t => t.trim()).filter(Boolean),
      });
    } finally {
      setSaving(false);
    }
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "ArrowUp" && currentLine > 0) {
      setCurrentLine(prev => prev - 1);
    } else if (e.key === "ArrowDown" && currentLine < lines.length - visibleLines) {
      setCurrentLine(prev => prev + 1);
    }
  }, [currentLine, lines.length]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      {/* Editor Panel */}
      <div className="flex-1 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">
            {script ? "Edit Script" : "New Script"}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="e.g., Sales Pitch"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-secondary/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Script Content</Label>
            <Textarea
              id="content"
              placeholder="Enter your script content... Each line will be a separate prompt block."
              rows={12}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="bg-secondary/50 font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              {lines.length} lines • Use line breaks to separate prompt blocks
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              placeholder="e.g., sales, meeting, pitch"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="bg-secondary/50"
            />
            <div className="flex flex-wrap gap-1.5">
              {tags.split(",").map(t => t.trim()).filter(Boolean).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="hero" onClick={handleSave} disabled={saving || !title.trim()}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? "Saving..." : "Save Script"}
            </Button>
          </div>
        </div>
      </div>

      {/* Preview Panel */}
      <div className={`lg:w-96 space-y-4 ${showPreview ? "" : "lg:w-12"}`}>
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
          >
            {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {showPreview ? "Hide Preview" : ""}
          </button>

          {showPreview && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPreviewMode("phone")}
                className={`p-2 rounded-lg transition-colors ${
                  previewMode === "phone" ? "bg-primary text-primary-foreground" : "bg-secondary hover:bg-secondary/80"
                }`}
              >
                <Smartphone className="h-4 w-4" />
              </button>
              <button
                onClick={() => setPreviewMode("hud")}
                className={`p-2 rounded-lg transition-colors ${
                  previewMode === "hud" ? "bg-primary text-primary-foreground" : "bg-secondary hover:bg-secondary/80"
                }`}
              >
                <Monitor className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {showPreview && (
          <>
            {/* HUD Preview */}
            <div 
              className={`relative rounded-2xl overflow-hidden ${
                previewMode === "hud" 
                  ? "bg-black/90 aspect-[16/9] border-2 border-primary/30" 
                  : "bg-black aspect-[9/16] max-w-[200px] mx-auto border-2 border-border"
              }`}
            >
              {/* HUD Frame */}
              {previewMode === "hud" && (
                <div className="absolute inset-0 border-8 border-transparent bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />
              )}

              {/* Content */}
              <div className={`flex flex-col justify-center h-full p-4 ${
                previewMode === "phone" ? "pt-8" : ""
              }`}>
                {displayLines.length > 0 ? (
                  <div className={`space-y-1 text-${textAlign}`}>
                    {displayLines.map((line, i) => (
                      <p 
                        key={i + currentLine}
                        className={`text-white transition-all ${
                          i === Math.floor(visibleLines / 2) 
                            ? "font-semibold opacity-100" 
                            : "opacity-50"
                        }`}
                        style={{ fontSize: `${fontSize}px` }}
                      >
                        {line}
                      </p>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground text-sm">
                    Type content to preview
                  </p>
                )}
              </div>

              {/* Phone Status Bar */}
              {previewMode === "phone" && (
                <div className="absolute top-0 left-0 right-0 h-6 bg-black flex items-center justify-center">
                  <div className="w-16 h-1 bg-white/30 rounded-full" />
                </div>
              )}

              {/* Progress indicator */}
              {lines.length > 0 && (
                <div className="absolute bottom-2 right-2 text-xs text-white/50 font-mono">
                  {currentLine + 1}/{lines.length}
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentLine(Math.max(0, currentLine - 1))}
                  disabled={currentLine === 0}
                  className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 disabled:opacity-50 transition-colors"
                >
                  <ChevronUp className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setCurrentLine(Math.min(lines.length - visibleLines, currentLine + 1))}
                  disabled={currentLine >= lines.length - visibleLines}
                  className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 disabled:opacity-50 transition-colors"
                >
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setFontSize(Math.max(12, fontSize - 2))}
                  className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
                >
                  <Type className="h-3 w-3" />
                </button>
                <span className="text-xs text-muted-foreground w-8 text-center">{fontSize}</span>
                <button
                  onClick={() => setFontSize(Math.min(24, fontSize + 2))}
                  className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
                >
                  <Type className="h-4 w-4" />
                </button>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setTextAlign("left")}
                  className={`p-2 rounded-lg transition-colors ${
                    textAlign === "left" ? "bg-primary text-primary-foreground" : "bg-secondary hover:bg-secondary/80"
                  }`}
                >
                  <AlignLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setTextAlign("center")}
                  className={`p-2 rounded-lg transition-colors ${
                    textAlign === "center" ? "bg-primary text-primary-foreground" : "bg-secondary hover:bg-secondary/80"
                  }`}
                >
                  <AlignCenter className="h-4 w-4" />
                </button>
              </div>
            </div>

            <p className="text-xs text-muted-foreground text-center">
              Use ↑↓ keys to scroll • This simulates the HUD display
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default ScriptEditor;
