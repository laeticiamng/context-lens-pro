import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { 
  MoreVertical, 
  Edit, 
  Eye, 
  Trash2, 
  Copy, 
  Clock, 
  Sparkles,
  Play,
  Share2
} from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

interface Script {
  id: string;
  title: string;
  content: string;
  tags: string[];
  is_active: boolean;
  usage_count: number;
  created_at: string;
}

interface ScriptPreviewCardProps {
  script: Script;
  searchQuery?: string;
  onEdit: () => void;
  onDelete: () => void;
  onToggleActive: () => void;
  onDuplicate: () => void;
  onShare?: () => void;
}

const highlightText = (text: string, query: string) => {
  if (!query.trim()) return text;
  
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);
  
  return parts.map((part, i) => 
    regex.test(part) ? (
      <mark key={i} className="bg-primary/30 text-foreground rounded px-0.5">
        {part}
      </mark>
    ) : (
      part
    )
  );
};

const ScriptPreviewCard = ({
  script,
  searchQuery = "",
  onEdit,
  onDelete,
  onToggleActive,
  onDuplicate,
  onShare,
}: ScriptPreviewCardProps) => {
  const previewLines = script.content.split("\n").slice(0, 3);
  const { language } = useLanguage();

  const labels = {
    edit: language === "fr" ? "Modifier" : "Edit",
    duplicate: language === "fr" ? "Dupliquer" : "Duplicate",
    deactivate: language === "fr" ? "Désactiver" : "Deactivate",
    activate: language === "fr" ? "Activer" : "Activate",
    share: language === "fr" ? "Partager" : "Share",
    delete: language === "fr" ? "Supprimer" : "Delete",
    uses: language === "fr" ? "utilisations" : "uses",
    active: language === "fr" ? "Actif" : "Active",
  };

  return (
    <Card 
      className="glass-card border-border/50 hover:border-primary/30 transition-all group cursor-pointer"
      onClick={onEdit}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base truncate">
              {highlightText(script.title, searchQuery)}
            </CardTitle>
            <CardDescription className="mt-1 line-clamp-1">
              {highlightText(script.content.slice(0, 80), searchQuery)}...
            </CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(); }}>
                <Edit className="h-4 w-4 mr-2" />
                {labels.edit}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onDuplicate(); }}>
                <Copy className="h-4 w-4 mr-2" />
                {labels.duplicate}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onToggleActive(); }}>
                {script.is_active ? (
                  <>
                    <Eye className="h-4 w-4 mr-2" />
                    {labels.deactivate}
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    {labels.activate}
                  </>
                )}
              </DropdownMenuItem>
              {onShare && (
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onShare(); }}>
                  <Share2 className="h-4 w-4 mr-2" />
                  {labels.share}
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-destructive focus:text-destructive"
                onClick={(e) => { e.stopPropagation(); onDelete(); }}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {labels.delete}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Preview Lines */}
        <div className="p-2 rounded-lg bg-secondary/30 font-mono text-xs space-y-0.5 max-h-16 overflow-hidden">
          {previewLines.map((line, i) => (
            <p key={i} className="text-muted-foreground truncate">
              {line || <span className="text-muted-foreground/50">...</span>}
            </p>
          ))}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {script.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {script.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{script.tags.length - 3}
            </Badge>
          )}
          {script.is_active && (
            <Badge className="bg-accent/10 text-accent border-accent/20 text-xs ml-auto">
              <Sparkles className="h-3 w-3 mr-1" />
              {labels.active}
            </Badge>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t border-border/30">
          <span className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            {script.usage_count} {labels.uses}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {new Date(script.created_at).toLocaleDateString()}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScriptPreviewCard;
