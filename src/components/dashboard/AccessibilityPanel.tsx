// Accessibility Settings Panel
// WCAG 2.1 AA compliant accessibility controls

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/i18n/LanguageContext';
import { 
  Accessibility,
  Type,
  Contrast,
  MousePointer,
  RotateCcw
} from 'lucide-react';

const A11Y_STORAGE_KEY = 'a11y-settings';

interface A11ySettings {
  reducedMotion: boolean;
  highContrast: boolean;
  largeText: boolean;
  fontSize: number;
  focusIndicators: boolean;
}

const defaultSettings: A11ySettings = {
  reducedMotion: false,
  highContrast: false,
  largeText: false,
  fontSize: 100,
  focusIndicators: true,
};

export function AccessibilityPanel() {
  const { language } = useLanguage();
  const [settings, setSettings] = useState<A11ySettings>(defaultSettings);

  useEffect(() => {
    // Load saved settings
    const saved = localStorage.getItem(A11Y_STORAGE_KEY);
    if (saved) {
      try {
        setSettings({ ...defaultSettings, ...JSON.parse(saved) });
      } catch {
        // Ignore parse errors
      }
    }

    // Check system preference for reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion && !saved) {
      setSettings(prev => ({ ...prev, reducedMotion: true }));
    }
  }, []);

  useEffect(() => {
    // Apply settings to document
    const root = document.documentElement;
    
    if (settings.reducedMotion) {
      root.style.setProperty('--animation-duration', '0.01ms');
      root.classList.add('reduce-motion');
    } else {
      root.style.removeProperty('--animation-duration');
      root.classList.remove('reduce-motion');
    }

    if (settings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    if (settings.largeText || settings.fontSize !== 100) {
      root.style.fontSize = `${settings.fontSize}%`;
    } else {
      root.style.removeProperty('font-size');
    }

    if (settings.focusIndicators) {
      root.classList.add('focus-visible-ring');
    } else {
      root.classList.remove('focus-visible-ring');
    }

    // Save settings
    localStorage.setItem(A11Y_STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const handleReset = () => {
    setSettings(defaultSettings);
    localStorage.removeItem(A11Y_STORAGE_KEY);
  };

  const t = {
    title: language === 'fr' ? 'Accessibilité' : 'Accessibility',
    description: language === 'fr' 
      ? 'Personnalisez les paramètres d\'accessibilité' 
      : 'Customize accessibility settings',
    reducedMotion: language === 'fr' ? 'Réduire les animations' : 'Reduce Motion',
    reducedMotionDesc: language === 'fr' 
      ? 'Minimise les animations et transitions' 
      : 'Minimize animations and transitions',
    highContrast: language === 'fr' ? 'Contraste élevé' : 'High Contrast',
    highContrastDesc: language === 'fr' 
      ? 'Augmente le contraste des couleurs' 
      : 'Increase color contrast',
    largeText: language === 'fr' ? 'Texte agrandi' : 'Large Text',
    largeTextDesc: language === 'fr' 
      ? 'Augmente la taille du texte' 
      : 'Increase text size',
    fontSize: language === 'fr' ? 'Taille de police' : 'Font Size',
    focusIndicators: language === 'fr' ? 'Indicateurs de focus' : 'Focus Indicators',
    focusIndicatorsDesc: language === 'fr' 
      ? 'Affiche des contours visibles lors de la navigation au clavier' 
      : 'Show visible outlines when navigating with keyboard',
    reset: language === 'fr' ? 'Réinitialiser' : 'Reset to Defaults',
  };

  return (
    <Card className="glass-card border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Accessibility className="h-5 w-5 text-primary" />
          {t.title}
        </CardTitle>
        <CardDescription>{t.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Reduced Motion */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5 flex-1">
            <Label className="flex items-center gap-2">
              <MousePointer className="h-4 w-4" />
              {t.reducedMotion}
            </Label>
            <p className="text-sm text-muted-foreground">{t.reducedMotionDesc}</p>
          </div>
          <Switch
            checked={settings.reducedMotion}
            onCheckedChange={(checked) => 
              setSettings(prev => ({ ...prev, reducedMotion: checked }))
            }
          />
        </div>

        {/* High Contrast */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5 flex-1">
            <Label className="flex items-center gap-2">
              <Contrast className="h-4 w-4" />
              {t.highContrast}
            </Label>
            <p className="text-sm text-muted-foreground">{t.highContrastDesc}</p>
          </div>
          <Switch
            checked={settings.highContrast}
            onCheckedChange={(checked) => 
              setSettings(prev => ({ ...prev, highContrast: checked }))
            }
          />
        </div>

        {/* Font Size */}
        <div className="space-y-3">
          <Label className="flex items-center gap-2">
            <Type className="h-4 w-4" />
            {t.fontSize}: {settings.fontSize}%
          </Label>
          <Slider
            value={[settings.fontSize]}
            onValueChange={([value]) => 
              setSettings(prev => ({ ...prev, fontSize: value, largeText: value > 100 }))
            }
            min={80}
            max={150}
            step={5}
            className="w-full"
          />
        </div>

        {/* Focus Indicators */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5 flex-1">
            <Label>{t.focusIndicators}</Label>
            <p className="text-sm text-muted-foreground">{t.focusIndicatorsDesc}</p>
          </div>
          <Switch
            checked={settings.focusIndicators}
            onCheckedChange={(checked) => 
              setSettings(prev => ({ ...prev, focusIndicators: checked }))
            }
          />
        </div>

        {/* Reset Button */}
        <Button variant="outline" onClick={handleReset} className="w-full">
          <RotateCcw className="h-4 w-4 mr-2" />
          {t.reset}
        </Button>
      </CardContent>
    </Card>
  );
}
