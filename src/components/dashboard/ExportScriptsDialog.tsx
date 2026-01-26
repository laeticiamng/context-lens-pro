import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Download, FileJson, FileText, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Script {
  id: string;
  title: string;
  content: string;
  tags: string[];
  is_active: boolean;
  usage_count: number;
  created_at: string;
}

interface ExportScriptsDialogProps {
  scripts: Script[];
  trigger?: React.ReactNode;
}

const ExportScriptsDialog = ({ scripts, trigger }: ExportScriptsDialogProps) => {
  const [open, setOpen] = useState(false);
  const [exported, setExported] = useState(false);
  const { toast } = useToast();

  const exportAsJSON = () => {
    const data = scripts.map(s => ({
      title: s.title,
      content: s.content,
      tags: s.tags,
      is_active: s.is_active,
      created_at: s.created_at,
    }));

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `contextlens-scripts-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setExported(true);
    toast({ title: "Exported!", description: `${scripts.length} scripts exported as JSON.` });
    setTimeout(() => setExported(false), 2000);
  };

  const exportAsMarkdown = () => {
    let markdown = "# ContextLens Scripts Export\n\n";
    markdown += `Exported on ${new Date().toLocaleDateString()}\n\n---\n\n`;

    scripts.forEach((script, index) => {
      markdown += `## ${index + 1}. ${script.title}\n\n`;
      markdown += `**Tags:** ${script.tags.join(", ") || "None"}\n`;
      markdown += `**Status:** ${script.is_active ? "Active" : "Inactive"}\n\n`;
      markdown += "```\n" + script.content + "\n```\n\n---\n\n";
    });

    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `contextlens-scripts-${new Date().toISOString().split("T")[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setExported(true);
    toast({ title: "Exported!", description: `${scripts.length} scripts exported as Markdown.` });
    setTimeout(() => setExported(false), 2000);
  };

  const exportAsText = () => {
    let text = "CONTEXTLENS SCRIPTS EXPORT\n";
    text += "=".repeat(40) + "\n\n";

    scripts.forEach((script, index) => {
      text += `[${index + 1}] ${script.title}\n`;
      text += "-".repeat(40) + "\n";
      text += script.content + "\n\n";
      text += `Tags: ${script.tags.join(", ") || "None"}\n`;
      text += `Status: ${script.is_active ? "Active" : "Inactive"}\n`;
      text += "\n" + "=".repeat(40) + "\n\n";
    });

    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `contextlens-scripts-${new Date().toISOString().split("T")[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setExported(true);
    toast({ title: "Exported!", description: `${scripts.length} scripts exported as text.` });
    setTimeout(() => setExported(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="glass" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Export Scripts</DialogTitle>
          <DialogDescription>
            Export your {scripts.length} scripts in your preferred format.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 py-4">
          <button
            onClick={exportAsJSON}
            className="flex items-center gap-4 p-4 rounded-xl border border-border/50 hover:border-primary/30 hover:bg-secondary/30 transition-all text-left"
          >
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <FileJson className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="font-medium">JSON Format</p>
              <p className="text-sm text-muted-foreground">Best for backups and imports</p>
            </div>
            {exported && <Check className="h-5 w-5 text-accent" />}
          </button>

          <button
            onClick={exportAsMarkdown}
            className="flex items-center gap-4 p-4 rounded-xl border border-border/50 hover:border-primary/30 hover:bg-secondary/30 transition-all text-left"
          >
            <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <FileText className="h-5 w-5 text-accent" />
            </div>
            <div className="flex-1">
              <p className="font-medium">Markdown Format</p>
              <p className="text-sm text-muted-foreground">Good for documentation</p>
            </div>
          </button>

          <button
            onClick={exportAsText}
            className="flex items-center gap-4 p-4 rounded-xl border border-border/50 hover:border-primary/30 hover:bg-secondary/30 transition-all text-left"
          >
            <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <FileText className="h-5 w-5 text-amber-500" />
            </div>
            <div className="flex-1">
              <p className="font-medium">Plain Text</p>
              <p className="text-sm text-muted-foreground">Universal compatibility</p>
            </div>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExportScriptsDialog;
