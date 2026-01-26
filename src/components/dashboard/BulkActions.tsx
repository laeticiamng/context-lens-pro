import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  MoreHorizontal, 
  Trash2, 
  Eye, 
  EyeOff, 
  Copy, 
  Tag,
  Download,
  CheckSquare,
  Square
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/i18n/LanguageContext";

interface BulkActionsProps {
  selectedIds: string[];
  totalCount: number;
  onSelectAll: () => void;
  onClearSelection: () => void;
  onBulkDelete: (ids: string[]) => Promise<void>;
  onBulkActivate: (ids: string[], active: boolean) => Promise<void>;
  onBulkDuplicate: (ids: string[]) => Promise<void>;
  onBulkExport: (ids: string[]) => void;
}

const BulkActions = ({
  selectedIds,
  totalCount,
  onSelectAll,
  onClearSelection,
  onBulkDelete,
  onBulkActivate,
  onBulkDuplicate,
  onBulkExport,
}: BulkActionsProps) => {
  const { toast } = useToast();
  const { language } = useLanguage();
  const [loading, setLoading] = useState(false);

  const t = {
    selectAll: language === "fr" ? "Tout sélectionner" : "Select All",
    selected: language === "fr" ? "sélectionné(s)" : "selected",
    activate: language === "fr" ? "Activer" : "Activate",
    deactivate: language === "fr" ? "Désactiver" : "Deactivate",
    duplicate: language === "fr" ? "Dupliquer" : "Duplicate",
    exportSelected: language === "fr" ? "Exporter la sélection" : "Export Selected",
    deleteSelected: language === "fr" ? "Supprimer la sélection" : "Delete Selected",
    clear: language === "fr" ? "Effacer" : "Clear",
    success: language === "fr" ? "Succès" : "Success",
    error: language === "fr" ? "Erreur" : "Error",
    actionFailed: language === "fr" ? "Action échouée" : "Action failed",
    scriptsActivated: language === "fr" ? "Scripts activés" : "Scripts activated",
    scriptsDeactivated: language === "fr" ? "Scripts désactivés" : "Scripts deactivated",
    scriptsDuplicated: language === "fr" ? "Scripts dupliqués" : "Scripts duplicated",
    scriptsDeleted: language === "fr" ? "Scripts supprimés" : "Scripts deleted",
  };

  const hasSelection = selectedIds.length > 0;
  const allSelected = selectedIds.length === totalCount && totalCount > 0;

  const handleAction = async (action: () => Promise<void>, successMessage: string) => {
    setLoading(true);
    try {
      await action();
      toast({ title: t.success, description: successMessage });
      onClearSelection();
    } catch (error) {
      toast({ title: t.error, description: t.actionFailed, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (!hasSelection) {
    return (
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground"
          onClick={onSelectAll}
          disabled={totalCount === 0}
        >
          <Square className="h-4 w-4 mr-2" />
          {t.selectAll}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 p-2 rounded-lg bg-primary/5 border border-primary/20">
      <div className="flex items-center gap-2">
        <Checkbox
          checked={allSelected}
          onCheckedChange={(checked) => checked ? onSelectAll() : onClearSelection()}
        />
        <Badge variant="secondary" className="font-normal">
          {selectedIds.length} {t.selected}
        </Badge>
      </div>

      <div className="h-4 w-px bg-border" />

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleAction(() => onBulkActivate(selectedIds, true), t.scriptsActivated)}
          disabled={loading}
        >
          <Eye className="h-4 w-4 mr-1" />
          {t.activate}
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleAction(() => onBulkActivate(selectedIds, false), t.scriptsDeactivated)}
          disabled={loading}
        >
          <EyeOff className="h-4 w-4 mr-1" />
          {t.deactivate}
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleAction(() => onBulkDuplicate(selectedIds), t.scriptsDuplicated)}
          disabled={loading}
        >
          <Copy className="h-4 w-4 mr-1" />
          {t.duplicate}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" disabled={loading}>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onBulkExport(selectedIds)}>
              <Download className="h-4 w-4 mr-2" />
              {t.exportSelected}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-destructive focus:text-destructive"
              onClick={() => handleAction(() => onBulkDelete(selectedIds), t.scriptsDeleted)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {t.deleteSelected}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex-1" />

      <Button
        variant="ghost"
        size="sm"
        onClick={onClearSelection}
        className="text-muted-foreground"
      >
        {t.clear}
      </Button>
    </div>
  );
};

export default BulkActions;
