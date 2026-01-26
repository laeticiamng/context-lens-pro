import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { translations, Language, TranslationKeys } from "./translations";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationKeys;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Detect browser/system language
const detectLanguage = (): Language => {
  // Check localStorage first
  const stored = localStorage.getItem("contextlens-language");
  if (stored === "en" || stored === "fr") {
    return stored;
  }

  // Detect from browser
  const browserLang = navigator.language || (navigator as any).userLanguage || "en";
  
  // Check if French
  if (browserLang.startsWith("fr")) {
    return "fr";
  }

  // Default to English for non-French locales
  return "en";
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(detectLanguage);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("contextlens-language", lang);
    // Update HTML lang attribute
    document.documentElement.lang = lang;
  };

  useEffect(() => {
    // Set initial lang attribute
    document.documentElement.lang = language;
  }, [language]);

  const value: LanguageContextType = {
    language,
    setLanguage,
    t: translations[language],
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
