// Script Version History Component
// Tracks changes to scripts for rollback capability

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { History, RotateCcw, Eye, Clock } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';

export interface ScriptVersion {
  id: string;
  timestamp: Date;
  content: string;
  title: string;
  changeType: 'create' | 'edit' | 'restore';
}

interface ScriptVersionHistoryProps {
  versions: ScriptVersion[];
  currentContent: string;
  onRestore: (version: ScriptVersion) => void;
}

export function ScriptVersionHistory({ 
  versions, 
  currentContent, 
  onRestore 
}: ScriptVersionHistoryProps) {
  const { language } = useLanguage();
  const [previewVersion, setPreviewVersion] = useState<ScriptVersion | null>(null);

  const t = {
    title: language === 'fr' ? 'Historique des versions' : 'Version History',
    description: language === 'fr' 
      ? 'Consultez et restaurez les versions précédentes'
      : 'View and restore previous versions',
    restore: language === 'fr' ? 'Restaurer' : 'Restore',
    preview: language === 'fr' ? 'Aperçu' : 'Preview',
    current: language === 'fr' ? 'Actuelle' : 'Current',
    created: language === 'fr' ? 'Créé' : 'Created',
    edited: language === 'fr' ? 'Modifié' : 'Edited',
    restored: language === 'fr' ? 'Restauré' : 'Restored',
    noVersions: language === 'fr' ? 'Aucun historique' : 'No history available',
  };

  const getChangeLabel = (type: ScriptVersion['changeType']) => {
    switch (type) {
      case 'create': return t.created;
      case 'edit': return t.edited;
      case 'restore': return t.restored;
    }
  };

  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    
    if (seconds < 60) return language === 'fr' ? 'à l\'instant' : 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} ${language === 'fr' ? 'min' : 'min ago'}`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} ${language === 'fr' ? 'h' : 'h ago'}`;
    return `${Math.floor(seconds / 86400)} ${language === 'fr' ? 'j' : 'd ago'}`;
  };

  if (versions.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <History className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">{t.noVersions}</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <History className="h-4 w-4" />
        <span>{t.title}</span>
        <Badge variant="secondary" className="ml-auto">
          {versions.length}
        </Badge>
      </div>

      <ScrollArea className="h-64">
        <div className="space-y-2">
          {versions.map((version, index) => (
            <div
              key={version.id}
              className={`p-3 rounded-lg border transition-colors ${
                index === 0 
                  ? 'bg-primary/5 border-primary/20' 
                  : 'bg-secondary/30 border-border/50 hover:bg-secondary/50'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm truncate">
                      {version.title}
                    </span>
                    {index === 0 && (
                      <Badge variant="outline" className="text-xs">
                        {t.current}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{getTimeAgo(version.timestamp)}</span>
                    <span>•</span>
                    <span>{getChangeLabel(version.changeType)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2"
                        onClick={() => setPreviewVersion(version)}
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>{t.preview}: {version.title}</DialogTitle>
                        <DialogDescription>
                          {getChangeLabel(version.changeType)} • {version.timestamp.toLocaleString()}
                        </DialogDescription>
                      </DialogHeader>
                      <pre className="bg-secondary/50 p-4 rounded-lg overflow-auto max-h-96 text-sm">
                        {version.content}
                      </pre>
                    </DialogContent>
                  </Dialog>

                  {index > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-primary hover:text-primary"
                      onClick={() => onRestore(version)}
                    >
                      <RotateCcw className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
