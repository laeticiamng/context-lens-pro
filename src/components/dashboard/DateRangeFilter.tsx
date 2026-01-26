import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarIcon, ChevronDown } from "lucide-react";
import { format, subDays, startOfWeek, startOfMonth, subMonths } from "date-fns";
import { fr, enUS } from "date-fns/locale";
import { useLanguage } from "@/i18n/LanguageContext";

type DateRange = {
  from: Date;
  to: Date;
};

type PresetKey = "7d" | "30d" | "90d" | "custom";

interface DateRangeFilterProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
}

const DateRangeFilter = ({ value, onChange }: DateRangeFilterProps) => {
  const { language } = useLanguage();
  const [activePreset, setActivePreset] = useState<PresetKey>("7d");
  const [isOpen, setIsOpen] = useState(false);

  const locale = language === "fr" ? fr : enUS;

  const presets: { key: PresetKey; label: string }[] = [
    { key: "7d", label: language === "fr" ? "7 derniers jours" : "Last 7 days" },
    { key: "30d", label: language === "fr" ? "30 derniers jours" : "Last 30 days" },
    { key: "90d", label: language === "fr" ? "90 derniers jours" : "Last 90 days" },
    { key: "custom", label: language === "fr" ? "Période personnalisée" : "Custom range" },
  ];

  const t = {
    apply: language === "fr" ? "Appliquer" : "Apply",
  };

  const handlePresetClick = (key: PresetKey) => {
    setActivePreset(key);
    const today = new Date();

    switch (key) {
      case "7d":
        onChange({ from: subDays(today, 7), to: today });
        setIsOpen(false);
        break;
      case "30d":
        onChange({ from: subDays(today, 30), to: today });
        setIsOpen(false);
        break;
      case "90d":
        onChange({ from: subDays(today, 90), to: today });
        setIsOpen(false);
        break;
      case "custom":
        // Keep popover open for calendar selection
        break;
    }
  };

  const formatDateRange = () => {
    if (activePreset !== "custom") {
      return presets.find((p) => p.key === activePreset)?.label;
    }
    return `${format(value.from, "d MMM", { locale })} - ${format(value.to, "d MMM yyyy", { locale })}`;
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="gap-2">
          <CalendarIcon className="h-4 w-4" />
          <span>{formatDateRange()}</span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="end">
        <div className="flex">
          {/* Presets sidebar */}
          <div className="border-r border-border p-2 space-y-1">
            {presets.map((preset) => (
              <button
                key={preset.key}
                onClick={() => handlePresetClick(preset.key)}
                className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                  activePreset === preset.key
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-secondary"
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Calendar */}
          {activePreset === "custom" && (
            <div className="p-3">
              <Calendar
                mode="range"
                selected={{ from: value.from, to: value.to }}
                onSelect={(range) => {
                  if (range?.from && range?.to) {
                    onChange({ from: range.from, to: range.to });
                  }
                }}
                numberOfMonths={2}
                disabled={{ after: new Date() }}
                locale={locale}
              />
              <div className="flex justify-end mt-2">
                <Button size="sm" onClick={() => setIsOpen(false)}>
                  {t.apply}
                </Button>
              </div>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default DateRangeFilter;
