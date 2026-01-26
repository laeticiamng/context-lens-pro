import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Bell, 
  Check, 
  Glasses, 
  FileText, 
  AlertTriangle,
  Info,
  X
} from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

interface Notification {
  id: string;
  type: "info" | "success" | "warning" | "device" | "script";
  titleEn: string;
  titleFr: string;
  descriptionEn: string;
  descriptionFr: string;
  timestamp: Date;
  read: boolean;
}

// Demo notifications
const initialNotifications: Notification[] = [
  {
    id: "1",
    type: "device",
    titleEn: "Device Connected",
    titleFr: "Appareil connecté",
    descriptionEn: "Even G2 is now connected and ready to use",
    descriptionFr: "Even G2 est maintenant connecté et prêt à l'emploi",
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 mins ago
    read: false,
  },
  {
    id: "2",
    type: "script",
    titleEn: "Script Synced",
    titleFr: "Script synchronisé",
    descriptionEn: "Your 'Sales Pitch' script has been synced to all devices",
    descriptionFr: "Votre script 'Pitch Commercial' a été synchronisé sur tous les appareils",
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
    read: false,
  },
  {
    id: "3",
    type: "info",
    titleEn: "New Feature Available",
    titleFr: "Nouvelle fonctionnalité disponible",
    descriptionEn: "Voice commands are now available in French",
    descriptionFr: "Les commandes vocales sont maintenant disponibles en français",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    read: true,
  },
  {
    id: "4",
    type: "warning",
    titleEn: "Device Battery Low",
    titleFr: "Batterie faible",
    descriptionEn: "Vuzix Z100 battery is at 15%",
    descriptionFr: "La batterie du Vuzix Z100 est à 15%",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    read: true,
  },
];

const NotificationsDropdown = () => {
  const { language } = useLanguage();
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [open, setOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const t = {
    title: language === "fr" ? "Notifications" : "Notifications",
    markAllRead: language === "fr" ? "Tout marquer comme lu" : "Mark all as read",
    noNotifications: language === "fr" ? "Aucune notification" : "No notifications",
    justNow: language === "fr" ? "À l'instant" : "Just now",
    minsAgo: language === "fr" ? "min" : "min ago",
    hoursAgo: language === "fr" ? "h" : "h ago",
    daysAgo: language === "fr" ? "j" : "d ago",
  };

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "device": return Glasses;
      case "script": return FileText;
      case "warning": return AlertTriangle;
      case "success": return Check;
      default: return Info;
    }
  };

  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    
    if (seconds < 60) return t.justNow;
    if (seconds < 3600) return `${Math.floor(seconds / 60)} ${t.minsAgo}`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} ${t.hoursAgo}`;
    return `${Math.floor(seconds / 86400)} ${t.daysAgo}`;
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-[10px]"
              variant="destructive"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between p-3 border-b border-border/50">
          <h4 className="font-semibold text-sm">{t.title}</h4>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={markAllAsRead}>
              {t.markAllRead}
            </Button>
          )}
        </div>

        <ScrollArea className="max-h-80">
          {notifications.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">{t.noNotifications}</p>
            </div>
          ) : (
            <div className="py-1">
              {notifications.map((notification) => {
                const Icon = getIcon(notification.type);
                const title = language === "fr" ? notification.titleFr : notification.titleEn;
                const description = language === "fr" ? notification.descriptionFr : notification.descriptionEn;

                return (
                  <div
                    key={notification.id}
                    className={`group relative p-3 hover:bg-secondary/50 transition-colors cursor-pointer ${
                      !notification.read ? "bg-primary/5" : ""
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex gap-3">
                      <div className={`p-2 rounded-lg ${
                        notification.type === "warning" 
                          ? "bg-amber-500/10 text-amber-500"
                          : notification.type === "device"
                          ? "bg-primary/10 text-primary"
                          : notification.type === "success"
                          ? "bg-accent/10 text-accent"
                          : "bg-secondary text-muted-foreground"
                      }`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className={`text-sm font-medium truncate ${
                            !notification.read ? "text-foreground" : "text-muted-foreground"
                          }`}>
                            {title}
                          </p>
                          {!notification.read && (
                            <span className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1.5" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                          {description}
                        </p>
                        <p className="text-[10px] text-muted-foreground/70 mt-1">
                          {getTimeAgo(notification.timestamp)}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity absolute top-2 right-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeNotification(notification.id);
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>

        {notifications.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <div className="p-2">
              <Button variant="ghost" size="sm" className="w-full text-xs">
                {language === "fr" ? "Voir tout" : "View all"}
              </Button>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationsDropdown;
