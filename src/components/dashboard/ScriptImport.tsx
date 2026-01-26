import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, FileJson, FileText, AlertCircle, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/i18n/LanguageContext";

interface ImportedScript {
  title: string;
  content: string;
  tags: string[];
}

interface ScriptImportProps {
  onImport: (scripts: ImportedScript[]) => Promise<void>;
}

const ScriptImport = ({ onImport }: ScriptImportProps) => {
  const { t, language } = useLanguage();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [jsonInput, setJsonInput] = useState("");
  const [markdownInput, setMarkdownInput] = useState("");
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const parseJSON = (input: string): ImportedScript[] => {
    const parsed = JSON.parse(input);
    const scripts = Array.isArray(parsed) ? parsed : [parsed];
    
    return scripts.map((s: any) => ({
      title: s.title || (language === "fr" ? "Import sans titre" : "Untitled Import"),
      content: s.content || "",
      tags: Array.isArray(s.tags) ? s.tags : [],
    }));
  };

  const parseMarkdown = (input: string): ImportedScript[] => {
    const scripts: ImportedScript[] = [];
    const sections = input.split(/^#\s+/m).filter(Boolean);

    sections.forEach((section) => {
      const lines = section.split("\n");
      const title = lines[0]?.trim() || (language === "fr" ? "Sans titre" : "Untitled");
      const content = lines.slice(1).join("\n").trim();
      
      // Extract tags from content (look for #tag patterns)
      const tagMatches = content.match(/#(\w+)/g);
      const tags = tagMatches ? tagMatches.map(t => t.slice(1)) : [];
      
      if (content) {
        scripts.push({ title, content, tags });
      }
    });

    return scripts;
  };

  const handleImport = async (type: "json" | "markdown") => {
    setError("");
    setLoading(true);

    try {
      const input = type === "json" ? jsonInput : markdownInput;
      const scripts = type === "json" ? parseJSON(input) : parseMarkdown(input);

      if (scripts.length === 0) {
        throw new Error(language === "fr" ? "Aucun script valide trouvé" : "No valid scripts found");
      }

      await onImport(scripts);
      toast({
        title: t.scriptImport.success,
        description: t.scriptImport.successDesc.replace("{count}", scripts.length.toString()),
      });
      setOpen(false);
      setJsonInput("");
      setMarkdownInput("");
    } catch (err: any) {
      setError(err.message || (language === "fr" ? "Échec de l'analyse" : "Failed to parse input"));
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (file.name.endsWith(".json")) {
        setJsonInput(content);
      } else {
        setMarkdownInput(content);
      }
    };
    reader.readAsText(file);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Upload className="h-4 w-4 mr-2" />
          {t.common.import}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t.scriptImport.title}</DialogTitle>
          <DialogDescription>
            {t.scriptImport.description}
          </DialogDescription>
        </DialogHeader>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json,.md,.txt"
          className="hidden"
          onChange={handleFileUpload}
        />

        <Tabs defaultValue="json" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="json" className="gap-2">
              <FileJson className="h-4 w-4" />
              JSON
            </TabsTrigger>
            <TabsTrigger value="markdown" className="gap-2">
              <FileText className="h-4 w-4" />
              Markdown
            </TabsTrigger>
          </TabsList>

          <TabsContent value="json" className="space-y-4">
            <div className="space-y-2">
              <Label>{t.scriptImport.jsonData}</Label>
              <Textarea
                placeholder={`[
  {
    "title": "Sales Pitch",
    "content": "Opening line...\\nNext point...",
    "tags": ["sales", "meeting"]
  }
]`}
                rows={8}
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                className="font-mono text-sm"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                {t.scriptImport.uploadFile}
              </Button>
              <Button
                variant="hero"
                size="sm"
                onClick={() => handleImport("json")}
                disabled={!jsonInput.trim() || loading}
              >
                {loading ? t.scriptImport.importing : t.scriptImport.importJson}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="markdown" className="space-y-4">
            <div className="space-y-2">
              <Label>{t.scriptImport.markdownContent}</Label>
              <Textarea
                placeholder={`# Sales Pitch
Opening line with value proposition
Key benefits...
Call to action

# Meeting Notes #work #important
Agenda item 1
Agenda item 2`}
                rows={8}
                value={markdownInput}
                onChange={(e) => setMarkdownInput(e.target.value)}
                className="font-mono text-sm"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                {t.scriptImport.uploadFile}
              </Button>
              <Button
                variant="hero"
                size="sm"
                onClick={() => handleImport("markdown")}
                disabled={!markdownInput.trim() || loading}
              >
                {loading ? t.scriptImport.importing : t.scriptImport.importMarkdown}
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        {error && (
          <div className="flex items-center gap-2 text-destructive text-sm">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ScriptImport;
