import { useState, useCallback, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, User, Search, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AnatomyARView } from '@/components/ar/anatomy';
import SEOHead from '@/components/layout/SEOHead';
import ErrorBoundary from '@/components/ui/error-boundary';
import { useLanguage } from '@/i18n/LanguageContext';
import { usePatientSearch } from '@/hooks/emotionscare/usePatientData';

export default function VisionIRM() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [searchParams] = useSearchParams();
  
  const patientIdFromUrl = searchParams.get('patient');
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(patientIdFromUrl);
  const [selectedPatientName, setSelectedPatientName] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [networkError, setNetworkError] = useState<string | null>(null);
  
  const { results: patients, isLoading: isSearching, error: searchError } = usePatientSearch(searchQuery);

  // Handle network errors
  useEffect(() => {
    if (searchError) {
      setNetworkError(language === 'fr' 
        ? 'Erreur de connexion au serveur. Mode démo activé.'
        : 'Server connection error. Demo mode activated.');
    }
  }, [searchError, language]);

  const handleSelectPatient = useCallback((id: string, name: string) => {
    setSelectedPatientId(id);
    setSelectedPatientName(name);
    setNetworkError(null);
  }, []);

  const handleEndSession = useCallback(() => {
    setSelectedPatientId(null);
    setSelectedPatientName('');
  }, []);

  const handleDismissError = useCallback(() => {
    setNetworkError(null);
  }, []);

  const t = {
    title: language === 'fr' ? 'Vision IRM Corps Entier' : 'Full Body MRI Vision',
    subtitle: language === 'fr' 
      ? 'Visualisation anatomique 3D en réalité augmentée' 
      : '3D anatomical visualization in augmented reality',
    searchPlaceholder: language === 'fr' ? 'Rechercher un patient...' : 'Search for a patient...',
    selectPatient: language === 'fr' ? 'Sélectionner un patient' : 'Select a patient',
    noPatients: language === 'fr' ? 'Aucun patient trouvé' : 'No patients found',
    back: language === 'fr' ? 'Retour' : 'Back',
    demo: language === 'fr' ? 'Mode Démo' : 'Demo Mode',
    startDemo: language === 'fr' ? 'Démarrer la démo' : 'Start Demo',
    networkErrorTitle: language === 'fr' ? 'Mode hors-ligne' : 'Offline Mode',
    retry: language === 'fr' ? 'Réessayer' : 'Retry',
  };

  // If patient is selected, show AR view
  if (selectedPatientId) {
    return (
      <>
        <SEOHead
          title={`${t.title} - ${selectedPatientName || selectedPatientId}`}
          description={t.subtitle}
        />
        <AnatomyARView
          patientId={selectedPatientId}
          patientName={selectedPatientName}
          onSessionEnd={handleEndSession}
        />
      </>
    );
  }

  // Patient selection screen
  return (
    <ErrorBoundary>
      <SEOHead
        title={t.title}
        description={t.subtitle}
      />
      <div className="min-h-screen bg-gradient-to-b from-background to-muted">
        {/* Header */}
        <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t.back}
            </Button>
            <h1 className="text-xl font-bold">{t.title}</h1>
            <div className="w-24" /> {/* Spacer */}
          </div>
        </header>

        {/* Network Error Alert */}
        {networkError && (
          <div className="container mx-auto px-4 py-4">
            <Alert variant="default" className="border-accent/30 bg-accent/5">
              <AlertCircle className="h-4 w-4 text-accent" />
              <AlertDescription className="flex items-center justify-between">
                <span>{networkError}</span>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={handleDismissError}>
                    {language === 'fr' ? 'Fermer' : 'Dismiss'}
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
                    <RefreshCw className="w-3 h-3 mr-1" />
                    {t.retry}
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* Main Content */}
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto space-y-8">
            {/* Hero */}
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {t.title}
              </h2>
              <p className="text-muted-foreground text-lg">
                {t.subtitle}
              </p>
            </div>

            {/* Demo Mode Card */}
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  {t.demo}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {language === 'fr' 
                    ? 'Essayez la visualisation anatomique avec un patient de démonstration.'
                    : 'Try the anatomical visualization with a demo patient.'}
                </p>
                <Button 
                  className="w-full"
                  onClick={() => handleSelectPatient('demo-patient-001', 'Patient Démo')}
                >
                  {t.startDemo}
                </Button>
              </CardContent>
            </Card>

            {/* Patient Search */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  {t.selectPatient}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder={t.searchPlaceholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Search Results */}
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {isSearching && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      {language === 'fr' ? 'Recherche...' : 'Searching...'}
                    </p>
                  )}
                  
                  {patients && patients.length === 0 && searchQuery.length >= 2 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      {t.noPatients}
                    </p>
                  )}

                  {patients?.map((patient) => (
                    <button
                      key={patient.id}
                      className="w-full p-3 rounded-lg border hover:bg-muted transition-colors text-left flex items-center gap-3"
                      onClick={() => handleSelectPatient(patient.id, patient.name)}
                    >
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{patient.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {patient.age} {language === 'fr' ? 'ans' : 'y/o'} • {patient.diagnosis || '—'}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  title: language === 'fr' ? 'Body Tracking' : 'Body Tracking',
                  desc: language === 'fr' 
                    ? 'Détection automatique de la position du patient'
                    : 'Automatic patient position detection',
                },
                {
                  title: language === 'fr' ? 'Gaze Detection' : 'Gaze Detection',
                  desc: language === 'fr'
                    ? 'Chargement intelligent des organes selon le regard'
                    : 'Smart organ loading based on gaze',
                },
                {
                  title: language === 'fr' ? 'Commandes Vocales' : 'Voice Commands',
                  desc: language === 'fr'
                    ? 'Contrôle mains-libres de la visualisation'
                    : 'Hands-free visualization control',
                },
              ].map((feature, i) => (
                <Card key={i} className="bg-muted/30">
                  <CardContent className="p-4">
                    <h3 className="font-medium mb-1">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    </ErrorBoundary>
  );
}
