// Script Preview Mode Component
// Shows how script will appear on HUD

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { 
  Eye, 
  Play, 
  Pause, 
  ChevronLeft, 
  ChevronRight,
  Glasses,
  Smartphone,
  Monitor
} from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';

interface ScriptPreviewModeProps {
  content: string;
  title: string;
}

type DeviceMode = 'glasses' | 'phone' | 'desktop';

export function ScriptPreviewMode({ content, title }: ScriptPreviewModeProps) {
  const { language } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentBlock, setCurrentBlock] = useState(0);
  const [scrollSpeed, setScrollSpeed] = useState(50);
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('glasses');

  // Split content into blocks (paragraphs or lines)
  const blocks = content.split(/\n\n+/).filter(Boolean);
  const totalBlocks = blocks.length;

  const t = {
    preview: language === 'fr' ? 'Aperçu HUD' : 'HUD Preview',
    block: language === 'fr' ? 'Bloc' : 'Block',
    speed: language === 'fr' ? 'Vitesse' : 'Speed',
    slow: language === 'fr' ? 'Lent' : 'Slow',
    fast: language === 'fr' ? 'Rapide' : 'Fast',
    glasses: language === 'fr' ? 'Lunettes' : 'Glasses',
    phone: language === 'fr' ? 'Téléphone' : 'Phone',
    desktop: language === 'fr' ? 'Bureau' : 'Desktop',
  };

  const deviceConfig = {
    glasses: {
      width: 'max-w-sm',
      height: 'h-32',
      fontSize: 'text-sm',
      icon: Glasses,
    },
    phone: {
      width: 'max-w-xs',
      height: 'h-48',
      fontSize: 'text-base',
      icon: Smartphone,
    },
    desktop: {
      width: 'max-w-md',
      height: 'h-64',
      fontSize: 'text-lg',
      icon: Monitor,
    },
  };

  const config = deviceConfig[deviceMode];

  const handlePrev = () => {
    setCurrentBlock((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentBlock((prev) => Math.min(totalBlocks - 1, prev + 1));
  };

  return (
    <Card className="glass-card border-primary/20 bg-primary/5">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Eye className="h-4 w-4 text-primary" />
            {t.preview}
          </CardTitle>
          <Badge variant="outline">
            {t.block} {currentBlock + 1}/{totalBlocks}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Device Mode Selector */}
        <div className="flex items-center justify-center gap-2">
          {(['glasses', 'phone', 'desktop'] as DeviceMode[]).map((mode) => {
            const Icon = deviceConfig[mode].icon;
            return (
              <Button
                key={mode}
                variant={deviceMode === mode ? 'default' : 'outline'}
                size="sm"
                onClick={() => setDeviceMode(mode)}
                className="gap-1.5"
              >
                <Icon className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{t[mode]}</span>
              </Button>
            );
          })}
        </div>

        {/* HUD Simulation */}
        <div className={`${config.width} mx-auto`}>
          <div 
            className={`${config.height} rounded-xl bg-gradient-to-br from-secondary to-muted border border-primary/20 flex items-center justify-center p-4 relative overflow-hidden`}
          >
            {/* Simulated HUD frame */}
            <div className="absolute inset-2 border border-primary/20 rounded-lg" />
            
            {/* Content */}
            <div className="relative z-10 text-center">
              <div className="flex items-center gap-2 mb-2 justify-center">
                <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                <span className="text-xs text-primary font-mono uppercase">
                  {title}
                </span>
              </div>
              <p className={`${config.fontSize} text-foreground/90 leading-relaxed line-clamp-3`}>
                {blocks[currentBlock] || '...'}
              </p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePrev}
            disabled={currentBlock === 0}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <Button
            variant={isPlaying ? 'default' : 'outline'}
            size="icon"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            onClick={handleNext}
            disabled={currentBlock === totalBlocks - 1}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Speed Control */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{t.slow}</span>
            <span>{t.speed}: {scrollSpeed}%</span>
            <span>{t.fast}</span>
          </div>
          <Slider
            value={[scrollSpeed]}
            onValueChange={([value]) => setScrollSpeed(value)}
            min={10}
            max={100}
            step={10}
            className="w-full"
          />
        </div>
      </CardContent>
    </Card>
  );
}
