import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon, Plus, FileText, Glasses, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";

interface EmptyStateProps {
  type: "scripts" | "devices" | "analytics";
  onAction?: () => void;
}

const emptyStates = {
  scripts: {
    icon: FileText,
    title: "No scripts yet",
    description: "Create your first script to start using ContextLens with your smart glasses.",
    actionLabel: "Create Script",
    tips: [
      "Scripts can be meeting notes, sales pitches, or checklists",
      "Each line becomes a separate prompt block",
      "Use tags to organize and filter your scripts",
    ],
  },
  devices: {
    icon: Glasses,
    title: "No devices connected",
    description: "Connect your first smart glasses or use phone fallback mode.",
    actionLabel: "Add Device",
    tips: [
      "Supports Even G2, Vuzix Z100, and more",
      "Phone fallback works with any glasses",
      "Bluetooth and WiFi pairing available",
    ],
  },
  analytics: {
    icon: BarChart3,
    title: "No usage data yet",
    description: "Start using your scripts to see analytics and usage patterns.",
    actionLabel: null,
    tips: [
      "Track script usage over time",
      "See which prompts are most effective",
      "Monitor device connection stats",
    ],
  },
};

const EmptyState = ({ type, onAction }: EmptyStateProps) => {
  const state = emptyStates[type];
  const Icon = state.icon;

  return (
    <Card className="glass-card border-border/50 border-dashed">
      <CardContent className="py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1 }}
            className="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center"
          >
            <Icon className="h-10 w-10 text-primary" />
          </motion.div>

          <div className="space-y-2">
            <h3 className="text-xl font-semibold">{state.title}</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              {state.description}
            </p>
          </div>

          {state.actionLabel && onAction && (
            <Button variant="hero" onClick={onAction}>
              <Plus className="h-4 w-4 mr-2" />
              {state.actionLabel}
            </Button>
          )}

          <div className="pt-4">
            <p className="text-xs text-muted-foreground mb-3">Quick tips:</p>
            <ul className="space-y-2 text-sm text-muted-foreground max-w-sm mx-auto">
              {state.tips.map((tip, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="flex items-start gap-2"
                >
                  <span className="text-primary">•</span>
                  <span className="text-left">{tip}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
};

export default EmptyState;
