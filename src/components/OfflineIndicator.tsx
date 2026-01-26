import { Badge } from "@/components/ui/badge";
import { Wifi, WifiOff, Cloud, CloudOff } from "lucide-react";
import { useState, useEffect } from "react";

const OfflineIndicator = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Show "back online" message briefly
      setShowBanner(true);
      setTimeout(() => setShowBanner(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowBanner(true);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!showBanner && isOnline) return null;

  return (
    <div 
      className={`fixed bottom-4 right-4 z-50 transition-all duration-300 ${
        showBanner ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <Badge 
        variant="outline"
        className={`px-4 py-2 flex items-center gap-2 shadow-lg ${
          isOnline 
            ? "bg-accent/10 border-accent text-accent" 
            : "bg-destructive/10 border-destructive text-destructive"
        }`}
      >
        {isOnline ? (
          <>
            <Cloud className="h-4 w-4" />
            <span>Back online</span>
          </>
        ) : (
          <>
            <CloudOff className="h-4 w-4" />
            <span>You're offline</span>
          </>
        )}
      </Badge>
    </div>
  );
};

export default OfflineIndicator;
