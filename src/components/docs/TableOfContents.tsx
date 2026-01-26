import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/i18n/LanguageContext";

interface TOCItem {
  id: string;
  title: string;
  level: number;
}

interface TableOfContentsProps {
  items: TOCItem[];
}

const TableOfContents = ({ items }: TableOfContentsProps) => {
  const { language } = useLanguage();
  const [activeId, setActiveId] = useState<string>("");

  const t = {
    onThisPage: language === "fr" ? "Sur cette page" : "On this page",
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-80px 0px -80% 0px",
        threshold: 0,
      }
    );

    items.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [items]);

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  if (items.length === 0) return null;

  return (
    <nav className="sticky top-24 space-y-1">
      <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
        {t.onThisPage}
      </p>
      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item.id}>
            <button
              onClick={() => handleClick(item.id)}
              className={cn(
                "block w-full text-left text-sm py-1.5 px-3 rounded-lg transition-colors",
                item.level === 1 ? "font-medium" : "text-muted-foreground",
                item.level === 2 && "pl-6",
                item.level === 3 && "pl-9",
                activeId === item.id
                  ? "bg-primary/10 text-primary"
                  : "hover:bg-secondary/50 hover:text-foreground"
              )}
            >
              {item.title}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default TableOfContents;
