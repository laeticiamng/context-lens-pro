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

interface ControlMapping {
  action: string;
  icon: React.ElementType;
  description: string;
  evenG2: string;
  vuzixZ100: string;
  rokid: string;
  phone: string;
}

const controlMappings: ControlMapping[] = [
  {
    action: "NEXT",
    icon: ArrowDown,
    description: "Next block/page",
    evenG2: "Swipe ↓ touchbar",
    vuzixZ100: "Tap button",
    rokid: "Tap temple",
    phone: "Tap ▶ button",
  },
  {
    action: "PREV",
    icon: ArrowUp,
    description: "Previous block/page",
    evenG2: "Swipe ↑ touchbar",
    vuzixZ100: "Double tap",
    rokid: "Double tap",
    phone: "Tap ◀ button",
  },
  {
    action: "PIN",
    icon: Pin,
    description: "Keep on screen",
    evenG2: "Press R1 ring",
    vuzixZ100: "Long press",
    rokid: "Long press",
    phone: "Tap 📌 button",
  },
  {
    action: "UNPIN",
    icon: PinOff,
    description: "Release pinned",
    evenG2: "Press R1 ring",
    vuzixZ100: "Long press",
    rokid: "Long press",
    phone: "Tap 📌 again",
  },
  {
    action: "SPEED+",
    icon: FastForward,
    description: "Faster scroll",
    evenG2: "Slide ring →",
    vuzixZ100: "Slider in app",
    rokid: "Swipe →",
    phone: "Slider control",
  },
  {
    action: "SPEED-",
    icon: Rewind,
    description: "Slower scroll",
    evenG2: "Slide ring ←",
    vuzixZ100: "Slider in app",
    rokid: "Swipe ←",
    phone: "Slider control",
  },
  {
    action: "MODE",
    icon: LayoutGrid,
    description: "Toggle cards ⇄ continuous",
    evenG2: "Double-tap bar",
    vuzixZ100: "Toggle in app",
    rokid: "Shake gesture",
    phone: "Toggle button",
  },
];

const deviceIcons = {
  evenG2: Glasses,
  vuzixZ100: Glasses,
  rokid: Glasses,
  phone: Smartphone,
};

const UXControlsMapping = () => {
  return (
    <Card className="glass-card border-border/50">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Watch className="h-5 w-5 text-primary" />
          UX Controls Mapping
        </CardTitle>
        <CardDescription>
          Universal actions mapped to each device's input methods
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left p-3 text-sm font-medium text-muted-foreground">Action</th>
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
              {controlMappings.map((control, i) => (
                <tr 
                  key={control.action} 
                  className={`border-b border-border/30 ${i % 2 === 0 ? "bg-secondary/10" : ""}`}
                >
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <control.icon className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <span className="font-medium text-sm">{control.action}</span>
                        <p className="text-xs text-muted-foreground">{control.description}</p>
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
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 p-3 rounded-lg bg-secondary/30 text-center">
          <p className="text-xs text-muted-foreground">
            All controls work silently without voice commands. Perfect for meetings, presentations, and healthcare.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default UXControlsMapping;
