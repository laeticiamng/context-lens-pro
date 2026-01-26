import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowUp, 
  ArrowDown, 
  Pin, 
  PinOff, 
  FastForward, 
  Rewind,
  LayoutGrid,
  Smartphone,
  Watch,
  Glasses
} from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

interface ControlMapping {
  actionKey: keyof typeof actionTranslations;
  icon: React.ElementType;
  evenG2: string;
  vuzixZ100: string;
  rokid: string;
  phone: string;
}

const actionTranslations = {
  next: { en: "NEXT", fr: "SUIVANT" },
  prev: { en: "PREV", fr: "PRÉCÉD." },
  pin: { en: "PIN", fr: "ÉPINGLER" },
  unpin: { en: "UNPIN", fr: "DÉSÉPINGLER" },
  speedUp: { en: "SPEED+", fr: "VITESSE+" },
  speedDown: { en: "SPEED-", fr: "VITESSE-" },
  mode: { en: "MODE", fr: "MODE" },
};

const descriptionTranslations = {
  next: { en: "Next block/page", fr: "Bloc/page suivant" },
  prev: { en: "Previous block/page", fr: "Bloc/page précédent" },
  pin: { en: "Keep on screen", fr: "Garder à l'écran" },
  unpin: { en: "Release pinned", fr: "Libérer l'épingle" },
  speedUp: { en: "Faster scroll", fr: "Défilement plus rapide" },
  speedDown: { en: "Slower scroll", fr: "Défilement plus lent" },
  mode: { en: "Toggle cards ⇄ continuous", fr: "Basculer cartes ⇄ continu" },
};

const controlMappings: ControlMapping[] = [
  {
    actionKey: "next",
    icon: ArrowDown,
    evenG2: "Swipe ↓ touchbar",
    vuzixZ100: "Tap button",
    rokid: "Tap temple",
    phone: "Tap ▶ button",
  },
  {
    actionKey: "prev",
    icon: ArrowUp,
    evenG2: "Swipe ↑ touchbar",
    vuzixZ100: "Double tap",
    rokid: "Double tap",
    phone: "Tap ◀ button",
  },
  {
    actionKey: "pin",
    icon: Pin,
    evenG2: "Press R1 ring",
    vuzixZ100: "Long press",
    rokid: "Long press",
    phone: "Tap 📌 button",
  },
  {
    actionKey: "unpin",
    icon: PinOff,
    evenG2: "Press R1 ring",
    vuzixZ100: "Long press",
    rokid: "Long press",
    phone: "Tap 📌 again",
  },
  {
    actionKey: "speedUp",
    icon: FastForward,
    evenG2: "Slide ring →",
    vuzixZ100: "Slider in app",
    rokid: "Swipe →",
    phone: "Slider control",
  },
  {
    actionKey: "speedDown",
    icon: Rewind,
    evenG2: "Slide ring ←",
    vuzixZ100: "Slider in app",
    rokid: "Swipe ←",
    phone: "Slider control",
  },
  {
    actionKey: "mode",
    icon: LayoutGrid,
    evenG2: "Double-tap bar",
    vuzixZ100: "Toggle in app",
    rokid: "Shake gesture",
    phone: "Toggle button",
  },
];

const UXControlsMapping = () => {
  const { t, language } = useLanguage();

  return (
    <Card className="glass-card border-border/50">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Watch className="h-5 w-5 text-primary" />
          {t.uxControls.title}
        </CardTitle>
        <CardDescription>
          {t.uxControls.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left p-3 text-sm font-medium text-muted-foreground">{t.uxControls.action}</th>
                <th className="text-center p-3">
                  <div className="flex items-center justify-center gap-1.5">
                    <Glasses className="h-4 w-4 text-primary" />
                    <span className="text-sm">Even G2</span>
                  </div>
                </th>
                <th className="text-center p-3">
                  <div className="flex items-center justify-center gap-1.5">
                    <Glasses className="h-4 w-4 text-accent" />
                    <span className="text-sm">Vuzix Z100</span>
                  </div>
                </th>
                <th className="text-center p-3">
                  <div className="flex items-center justify-center gap-1.5">
                    <Glasses className="h-4 w-4 text-violet-400" />
                    <span className="text-sm">Rokid</span>
                  </div>
                </th>
                <th className="text-center p-3">
                  <div className="flex items-center justify-center gap-1.5">
                    <Smartphone className="h-4 w-4 text-emerald-400" />
                    <span className="text-sm">Phone</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {controlMappings.map((control, i) => {
                const actionName = actionTranslations[control.actionKey][language];
                const description = descriptionTranslations[control.actionKey][language];
                
                return (
                  <tr 
                    key={control.actionKey} 
                    className={`border-b border-border/30 ${i % 2 === 0 ? "bg-secondary/10" : ""}`}
                  >
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                          <control.icon className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <span className="font-medium text-sm">{actionName}</span>
                          <p className="text-xs text-muted-foreground">{description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-center">
                      <Badge variant="secondary" className="text-xs font-normal">
                        {control.evenG2}
                      </Badge>
                    </td>
                    <td className="p-3 text-center">
                      <Badge variant="secondary" className="text-xs font-normal">
                        {control.vuzixZ100}
                      </Badge>
                    </td>
                    <td className="p-3 text-center">
                      <Badge variant="secondary" className="text-xs font-normal">
                        {control.rokid}
                      </Badge>
                    </td>
                    <td className="p-3 text-center">
                      <Badge variant="secondary" className="text-xs font-normal">
                        {control.phone}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-4 p-3 rounded-lg bg-secondary/30 text-center">
          <p className="text-xs text-muted-foreground">
            {t.uxControls.silentNote}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default UXControlsMapping;
