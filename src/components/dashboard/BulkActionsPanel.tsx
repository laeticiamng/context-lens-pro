import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { 
  ChevronDown, 
  Trash2, 
  Archive,
  Tag,
  Copy,
  Download,
  Power,
  PowerOff,
  X,
  CheckSquare,
  Square
} from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Script {
  id: string;
  title: string;
  is_active: boolean;
  tags: string[];
}

interface BulkActionsPanelProps {
  scripts: Script[];
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
  onActionComplete: () => void;
}

export function BulkActionsPanel({
  scripts,
  selectedIds,
  onSelectionChange,
  onActionComplete,
}: BulkActionsPanelProps) {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const selectedCount = selectedIds.length;
  const allSelected = selectedCount === scripts.length && scripts.length > 0;
  const someSelected = selectedCount > 0 && selectedCount < scripts.length;

  const handleSelectAll = () => {
    if (allSelected) {
      onSelectionChange([]);
    } else {
      onSelectionChange(scripts.map(s => s.id));
    }
  };

  const handleBulkActivate = async (activate: boolean) => {
    setIsProcessing(true);
    try {
      const { error } = await supabase
        .from('scripts')
        .update({ is_active: activate })
        .in('id', selectedIds);

      if (error) throw error;

      toast({
        title: language === 'fr' ? 'Succès' : 'Success',
        description: language === 'fr' 
          ? `${selectedCount} scripts ${activate ? 'activés' : 'désactivés'}`
          : `${selectedCount} scripts ${activate ? 'activated' : 'deactivated'}`,
      });
      onSelectionChange([]);
      onActionComplete();
    } catch (error) {
      toast({
        title: language === 'fr' ? 'Erreur' : 'Error',
        description: language === 'fr' ? 'Échec de la mise à jour' : 'Failed to update scripts',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBulkDelete = async () => {
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('scripts')
        .delete()
        .in('id', selectedIds);

      if (error) throw error;

      toast({
        title: language === 'fr' ? 'Supprimés' : 'Deleted',
        description: language === 'fr' 
          ? `${selectedCount} scripts supprimés`
          : `${selectedCount} scripts deleted`,
      });
      onSelectionChange([]);
      onActionComplete();
    } catch (error) {
      toast({
        title: language === 'fr' ? 'Erreur' : 'Error',
        description: language === 'fr' ? 'Échec de la suppression' : 'Failed to delete scripts',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleBulkDuplicate = async () => {
    setIsProcessing(true);
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session?.user) throw new Error('Not authenticated');

      const selectedScripts = scripts.filter(s => selectedIds.includes(s.id));
      const duplicates = selectedScripts.map(s => ({
        user_id: session.session!.user.id,
        title: `${s.title} (${language === 'fr' ? 'copie' : 'copy'})`,
        content: '', // Would need to fetch actual content
        tags: s.tags,
        is_active: false,
      }));

      const { error } = await supabase
        .from('scripts')
        .insert(duplicates);

      if (error) throw error;

      toast({
        title: language === 'fr' ? 'Dupliqués' : 'Duplicated',
        description: language === 'fr' 
          ? `${selectedCount} scripts dupliqués`
          : `${selectedCount} scripts duplicated`,
      });
      onSelectionChange([]);
      onActionComplete();
    } catch (error) {
      toast({
        title: language === 'fr' ? 'Erreur' : 'Error',
        description: language === 'fr' ? 'Échec de la duplication' : 'Failed to duplicate scripts',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExportSelected = () => {
    const selectedScripts = scripts.filter(s => selectedIds.includes(s.id));
    const exportData = {
      exportedAt: new Date().toISOString(),
      scripts: selectedScripts,
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `scripts-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: language === 'fr' ? 'Exporté' : 'Exported',
      description: language === 'fr' 
        ? `${selectedCount} scripts exportés`
        : `${selectedCount} scripts exported`,
    });
  };

  if (selectedCount === 0) {
    return (
      <div className="flex items-center gap-2 p-2">
        <Checkbox
          checked={allSelected}
          onCheckedChange={handleSelectAll}
          aria-label={language === 'fr' ? 'Tout sélectionner' : 'Select all'}
        />
        <span className="text-sm text-muted-foreground">
          {language === 'fr' ? 'Sélectionner tout' : 'Select all'}
        </span>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center gap-3 p-3 bg-primary/5 border border-primary/20 rounded-lg">
        <Checkbox
          checked={allSelected}
          ref={(el) => {
            if (el) {
              (el as HTMLButtonElement & { indeterminate: boolean }).indeterminate = someSelected;
            }
          }}
          onCheckedChange={handleSelectAll}
        />
        
        <Badge variant="secondary">
          {selectedCount} {language === 'fr' ? 'sélectionné(s)' : 'selected'}
        </Badge>

        <div className="flex-1" />

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleBulkActivate(true)}
            disabled={isProcessing}
          >
            <Power className="h-4 w-4 mr-1" />
            {language === 'fr' ? 'Activer' : 'Activate'}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handleBulkActivate(false)}
            disabled={isProcessing}
          >
            <PowerOff className="h-4 w-4 mr-1" />
            {language === 'fr' ? 'Désactiver' : 'Deactivate'}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                {language === 'fr' ? 'Plus' : 'More'}
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleBulkDuplicate}>
                <Copy className="h-4 w-4 mr-2" />
                {language === 'fr' ? 'Dupliquer' : 'Duplicate'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExportSelected}>
                <Download className="h-4 w-4 mr-2" />
                {language === 'fr' ? 'Exporter' : 'Export'}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => setShowDeleteConfirm(true)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {language === 'fr' ? 'Supprimer' : 'Delete'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => onSelectionChange([])}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {language === 'fr' 
                ? `Supprimer ${selectedCount} script(s) ?`
                : `Delete ${selectedCount} script(s)?`}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {language === 'fr'
                ? 'Cette action est irréversible. Les scripts sélectionnés seront définitivement supprimés.'
                : 'This action cannot be undone. The selected scripts will be permanently deleted.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {language === 'fr' ? 'Annuler' : 'Cancel'}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
            >
              {isDeleting 
                ? (language === 'fr' ? 'Suppression...' : 'Deleting...')
                : (language === 'fr' ? 'Supprimer' : 'Delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
