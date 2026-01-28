// Account Deletion Dialog with proper confirmation flow
// Replaces window.confirm with accessible dialog

import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, AlertTriangle } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';

interface AccountDeletionDialogProps {
  userEmail: string;
  onConfirmDelete: () => Promise<void>;
}

export function AccountDeletionDialog({ userEmail, onConfirmDelete }: AccountDeletionDialogProps) {
  const { language } = useLanguage();
  const [confirmText, setConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [open, setOpen] = useState(false);

  const confirmPhrase = language === 'fr' ? 'SUPPRIMER' : 'DELETE';
  const isConfirmed = confirmText.toUpperCase() === confirmPhrase;

  const t = {
    trigger: language === 'fr' ? 'Supprimer mon compte' : 'Delete my account',
    title: language === 'fr' ? 'Supprimer votre compte ?' : 'Delete your account?',
    description: language === 'fr' 
      ? 'Cette action est irréversible. Toutes vos données seront supprimées définitivement, incluant :'
      : 'This action cannot be undone. All your data will be permanently deleted, including:',
    dataList: language === 'fr' 
      ? ['Tous vos scripts', 'Tous vos appareils connectés', 'Votre historique d\'utilisation', 'Votre profil et préférences']
      : ['All your scripts', 'All connected devices', 'Your usage history', 'Your profile and preferences'],
    confirmLabel: language === 'fr' 
      ? `Tapez "${confirmPhrase}" pour confirmer`
      : `Type "${confirmPhrase}" to confirm`,
    cancel: language === 'fr' ? 'Annuler' : 'Cancel',
    delete: language === 'fr' ? 'Supprimer définitivement' : 'Delete permanently',
    deleting: language === 'fr' ? 'Suppression...' : 'Deleting...',
  };

  const handleDelete = async () => {
    if (!isConfirmed) return;
    setIsDeleting(true);
    try {
      await onConfirmDelete();
      setOpen(false);
    } catch (error) {
      console.error('Deletion failed:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="w-full sm:w-auto">
          <Trash2 className="h-4 w-4 mr-2" />
          {t.trigger}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-full bg-destructive/10">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <AlertDialogTitle>{t.title}</AlertDialogTitle>
          </div>
          <AlertDialogDescription asChild>
            <div className="space-y-4">
              <p>{t.description}</p>
              <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
                {t.dataList.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
              <p className="text-sm font-medium text-foreground">
                {language === 'fr' ? 'Compte: ' : 'Account: '}
                <span className="text-destructive">{userEmail}</span>
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="py-4 space-y-2">
          <Label htmlFor="confirm-delete">{t.confirmLabel}</Label>
          <Input
            id="confirm-delete"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder={confirmPhrase}
            className={confirmText && !isConfirmed ? 'border-destructive' : ''}
            autoComplete="off"
          />
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>
            {t.cancel}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={!isConfirmed || isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? t.deleting : t.delete}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
