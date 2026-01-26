// Protocol Selector Component
// CLP-LUNETTES-IRM-2026-001

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Activity,
  Heart,
  Brain,
  Scan,
  Clock,
  ChevronRight,
} from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import type { ScreeningProtocol } from '@/hooks/mri';

interface ProtocolSelectorProps {
  protocols: ScreeningProtocol[];
  onSelectProtocol: (protocol: ScreeningProtocol) => void;
  disabled?: boolean;
}

export function ProtocolSelector({ 
  protocols, 
  onSelectProtocol,
  disabled,
}: ProtocolSelectorProps) {
  const { language } = useLanguage();

  const getProtocolIcon = (id: string) => {
    const icons: Record<string, React.ReactNode> = {
      checkup_complet: <Scan className="h-6 w-6 text-primary" />,
      cardio: <Heart className="h-6 w-6 text-red-500" />,
      neuro: <Brain className="h-6 w-6 text-pink-500" />,
      abdominal: <Activity className="h-6 w-6 text-amber-500" />,
      osteo: <Activity className="h-6 w-6 text-blue-500" />,
    };
    return icons[id] || <Scan className="h-6 w-6" />;
  };

  const getProtocolColor = (id: string) => {
    const colors: Record<string, string> = {
      checkup_complet: 'border-primary/20 hover:border-primary/50 hover:bg-primary/5',
      cardio: 'border-red-500/20 hover:border-red-500/50 hover:bg-red-500/5',
      neuro: 'border-pink-500/20 hover:border-pink-500/50 hover:bg-pink-500/5',
      abdominal: 'border-amber-500/20 hover:border-amber-500/50 hover:bg-amber-500/5',
      osteo: 'border-blue-500/20 hover:border-blue-500/50 hover:bg-blue-500/5',
    };
    return colors[id] || '';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Scan className="h-5 w-5" />
          {language === 'fr' ? 'Protocoles de dépistage' : 'Screening Protocols'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {protocols.map((protocol) => (
            <Button
              key={protocol.id}
              variant="outline"
              className={`h-auto p-4 justify-start ${getProtocolColor(protocol.id)} ${disabled ? 'opacity-50 pointer-events-none' : ''}`}
              onClick={() => onSelectProtocol(protocol)}
              disabled={disabled}
            >
              <div className="flex items-center gap-4 w-full">
                {getProtocolIcon(protocol.id)}
                
                <div className="flex-1 text-left">
                  <p className="font-semibold">
                    {language === 'fr' ? protocol.name_fr : protocol.name}
                  </p>
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {language === 'fr' ? protocol.description_fr : protocol.description}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {protocol.duration_minutes} min
                  </Badge>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </Button>
          ))}
        </div>

        {protocols.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            {language === 'fr' 
              ? 'Aucun protocole disponible' 
              : 'No protocols available'}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
