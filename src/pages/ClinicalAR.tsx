import { useParams } from 'react-router-dom';
import { ClinicalARView } from '@/components/ar/ClinicalARView';
import ErrorBoundary from '@/components/ui/error-boundary';
import SEOHead from '@/components/layout/SEOHead';
import { useLanguage } from '@/i18n/LanguageContext';

export default function ClinicalAR() {
  const { patientId } = useParams<{ patientId?: string }>();
  const { language } = useLanguage();

  return (
    <ErrorBoundary>
      <SEOHead
        title={language === 'fr' ? 'Session AR Clinique - ContextLens' : 'Clinical AR Session - ContextLens'}
        description={language === 'fr' 
          ? 'Visualisation émotionnelle et cérébrale en réalité augmentée' 
          : 'Emotional and brain visualization in augmented reality'}
      />
      <ClinicalARView patientId={patientId} />
    </ErrorBoundary>
  );
}
