import { Users } from "lucide-react";
import { useRealtimeVisitors } from "@/hooks/useRealtimeVisitors";
import { cn } from "@/lib/utils";

interface VisitorCounterProps {
  className?: string;
}

export function VisitorCounter({ className }: VisitorCounterProps) {
  const { visitorCount, isConnected } = useRealtimeVisitors();

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 px-3 py-1.5 rounded-full",
        "bg-accent/10 border border-accent/30",
        "text-sm font-medium text-accent",
        "animate-fade-in",
        className
      )}
    >
      <div className="relative flex items-center justify-center">
        <Users className="h-4 w-4" />
        {isConnected && (
          <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-accent animate-pulse" />
        )}
      </div>
      <span>
        <span className="font-bold tabular-nums">{visitorCount}</span>
        {" "}
        <span className="text-muted-foreground hidden sm:inline">
          {visitorCount === 1 ? "visiteur en ligne" : "visiteurs en ligne"}
        </span>
      </span>
    </div>
  );
}
