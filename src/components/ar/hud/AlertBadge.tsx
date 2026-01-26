import { AlertTriangle } from 'lucide-react';

interface AlertBadgeProps {
  message: string;
  onDismiss?: () => void;
}

export function AlertBadge({ message, onDismiss }: AlertBadgeProps) {
  return (
    <div 
      className="pointer-events-auto flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/80 backdrop-blur-sm border border-red-400/50 animate-pulse cursor-pointer"
      onClick={onDismiss}
    >
      <AlertTriangle className="h-4 w-4 text-white" />
      <span className="text-sm text-white font-medium">{message}</span>
    </div>
  );
}
