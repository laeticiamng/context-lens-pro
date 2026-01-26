import { useState, useCallback, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, X, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";

interface SearchResult {
  id: string;
  title: string;
  section: string;
  content: string;
  tier?: number;
}

interface DocSearchProps {
  onResultClick: (sectionId: string) => void;
}

const DocSearch = ({ onResultClick }: DocSearchProps) => {
  const { language } = useLanguage();
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const t = {
    searchPlaceholder: language === "fr" ? "Rechercher dans la documentation..." : "Search documentation...",
    noResults: language === "fr" ? "Aucun résultat pour" : "No results found for",
  };

  const searchableContent: SearchResult[] = useMemo(() => [
    {
      id: "tier-0",
      title: language === "fr" ? "Tier 0 — Mode Universel" : "Tier 0 — Universal Fallback",
      section: language === "fr" ? "Documentation Tier" : "Tier Documentation",
      content: language === "fr" 
        ? "Fonctionne avec TOUS les appareils. Utilise la caméra du téléphone et les notifications push ou TTS. Ray-Ban Meta, lunettes sans SDK."
        : "Works with ANY device. Uses phone camera for vision and push notifications or TTS for output. Ray-Ban Meta, Any glasses without SDK.",
      tier: 0,
    },
    {
      id: "tier-1",
      title: language === "fr" ? "Tier 1 — Affichage SDK" : "Tier 1 — Display via SDK",
      section: language === "fr" ? "Documentation Tier" : "Tier Documentation",
      content: language === "fr"
        ? "Affichage de texte et images sur le HUD via SDK officiel. Even G2, Vuzix Z100, Xreal Air 2."
        : "Push text and images directly to the HUD via official manufacturer SDK. Even G2, Vuzix Z100, Xreal Air 2.",
      tier: 1,
    },
    {
      id: "tier-2",
      title: language === "fr" ? "Tier 2 — Mode Embarqué" : "Tier 2 — On-Device Mode",
      section: language === "fr" ? "Documentation Tier" : "Tier Documentation",
      content: language === "fr"
        ? "L'app tourne directement sur les lunettes avec accès aux capteurs et latence réduite. Rokid, Meta Quest 3, HoloLens 2."
        : "App runs directly on the glasses with native sensor access and lower latency. Rokid, Meta Quest 3, HoloLens 2.",
      tier: 2,
    },
    {
      id: "tier-3",
      title: "Tier 3 — Vision + AR",
      section: language === "fr" ? "Documentation Tier" : "Tier Documentation",
      content: language === "fr"
        ? "Calcul spatial complet avec suivi 6DoF et overlays AR ancrés. Apple Vision Pro, Magic Leap 2."
        : "Full spatial computing with 6DoF tracking and world-locked AR overlays. Apple Vision Pro, Magic Leap 2.",
      tier: 3,
    },
    {
      id: "even-g2",
      title: language === "fr" ? "Intégration Even G2" : "Even G2 Integration",
      section: "SDK",
      content: language === "fr"
        ? "Intégration Flutter SDK pour lunettes Even G2. Batterie 48h, résolution 640×350, FOV 27.5°, compatible prescription."
        : "Flutter SDK integration for Even G2 glasses. 48h battery, 640×350 resolution, 27.5° FOV, prescription compatible.",
    },
    {
      id: "vuzix-z100",
      title: language === "fr" ? "Intégration Vuzix Z100" : "Vuzix Z100 Integration",
      section: "SDK",
      content: language === "fr"
        ? "SDK Blade 2.0 pour Vuzix Z100. Basé Android, écran MicroOLED, reconnaissance gestuelle."
        : "Blade 2.0 SDK for Vuzix Z100. Android-based, MicroOLED display, gesture recognition.",
    },
    {
      id: "api-endpoints",
      title: language === "fr" ? "Endpoints API REST" : "REST API Endpoints",
      section: language === "fr" ? "Référence API" : "API Reference",
      content: language === "fr"
        ? "Documentation complète de l'API REST incluant authentification, CRUD scripts, gestion appareils et analytique."
        : "Complete REST API documentation including authentication, scripts CRUD, devices management, and analytics.",
    },
    {
      id: "authentication",
      title: language === "fr" ? "Authentification" : "Authentication",
      section: language === "fr" ? "Démarrage" : "Getting Started",
      content: language === "fr"
        ? "Authentification par clé API, utilisation du Bearer token, bonnes pratiques de stockage sécurisé."
        : "API key authentication, Bearer token usage, secure key storage best practices.",
    },
  ], [language]);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    
    const lowerQuery = query.toLowerCase();
    return searchableContent.filter(
      item =>
        item.title.toLowerCase().includes(lowerQuery) ||
        item.content.toLowerCase().includes(lowerQuery) ||
        item.section.toLowerCase().includes(lowerQuery)
    ).slice(0, 5);
  }, [query, searchableContent]);

  const handleResultClick = useCallback((result: SearchResult) => {
    onResultClick(result.id);
    setQuery("");
    setIsFocused(false);
  }, [onResultClick]);

  const highlightMatch = (text: string) => {
    if (!query.trim()) return text;
    const regex = new RegExp(`(${query})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="bg-primary/20 text-primary rounded px-0.5">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder={t.searchPlaceholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          className="pl-10 pr-10 bg-secondary/50"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isFocused && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full mt-2 left-0 right-0 z-50 bg-card border border-border rounded-xl shadow-lg overflow-hidden"
          >
            <div className="max-h-80 overflow-y-auto">
              {results.map((result) => (
                <button
                  key={result.id}
                  onClick={() => handleResultClick(result)}
                  className="w-full text-left p-4 hover:bg-secondary/50 transition-colors border-b border-border/50 last:border-0"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-sm truncate">
                          {highlightMatch(result.title)}
                        </h4>
                        {result.tier !== undefined && (
                          <Badge className={`tier-badge tier-${result.tier} text-xs`}>
                            T{result.tier}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {highlightMatch(result.content)}
                      </p>
                      <p className="text-xs text-primary mt-1">{result.section}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-1" />
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isFocused && query && results.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-full mt-2 left-0 right-0 z-50 bg-card border border-border rounded-xl shadow-lg p-4"
        >
          <p className="text-sm text-muted-foreground text-center">
            {t.noResults} "{query}"
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default DocSearch;
