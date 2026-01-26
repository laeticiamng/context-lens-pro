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
  const [loading, setLoading] = useState(false);

  const hasSelection = selectedIds.length > 0;
  const allSelected = selectedIds.length === totalCount && totalCount > 0;

  const handleAction = async (action: () => Promise<void>, successMessage: string) => {
    setLoading(true);
    try {
      await action();
      toast({ title: "Success", description: successMessage });
      onClearSelection();
    } catch (error) {
      toast({ title: "Error", description: "Action failed", variant: "destructive" });
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
          Select All
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
          {selectedIds.length} selected
        </Badge>
      </div>

      <div className="h-4 w-px bg-border" />

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleAction(() => onBulkActivate(selectedIds, true), "Scripts activated")}
          disabled={loading}
        >
          <Eye className="h-4 w-4 mr-1" />
          Activate
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleAction(() => onBulkActivate(selectedIds, false), "Scripts deactivated")}
          disabled={loading}
        >
          <EyeOff className="h-4 w-4 mr-1" />
          Deactivate
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleAction(() => onBulkDuplicate(selectedIds), "Scripts duplicated")}
          disabled={loading}
        >
          <Copy className="h-4 w-4 mr-1" />
          Duplicate
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
              Export Selected
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-destructive focus:text-destructive"
              onClick={() => handleAction(() => onBulkDelete(selectedIds), "Scripts deleted")}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Selected
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
        Clear
      </Button>
    </div>
  );
};

export default BulkActions;
