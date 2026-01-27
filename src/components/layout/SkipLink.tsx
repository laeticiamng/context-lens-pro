// Skip Navigation Link for Accessibility
// Allows keyboard users to skip to main content

import { useLanguage } from '@/i18n/LanguageContext';

interface SkipLinkProps {
  targetId?: string;
}

export function SkipLink({ targetId = 'main-content' }: SkipLinkProps) {
  const { language } = useLanguage();
  
  const text = language === 'fr' ? 'Aller au contenu principal' : 'Skip to main content';
  
  return (
    <a
      href={`#${targetId}`}
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
    >
      {text}
    </a>
  );
}
