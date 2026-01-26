import { useEffect, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ARScene } from './ARScene';
import { HUDPanel } from './hud/HUDPanel';
import { useARSession } from '@/hooks/useARSession';
import { useEmotionsData } from '@/hooks/useEmotionsData';
import { useVoiceCommands } from '@/hooks/useVoiceCommands';
import { usePatientContext } from '@/hooks/usePatientContext';
import { useARStore } from '@/stores/arStore';
import { useLanguage } from '@/i18n/LanguageContext';
import { Button } from '@/components/ui/button';
import { ClinicalNotes } from './hud/ClinicalNotes';
import { Loader2, Glasses, ArrowLeft, Camera, FileText, Users, StickyNote } from 'lucide-react';
import { toast } from 'sonner';

interface ClinicalARViewProps {
  patientId?: string;
}

export function ClinicalARView({ patientId }: ClinicalARViewProps) {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [showNotes, setShowNotes] = useState(false);
  
  const { isARActive, isLoading, deviceType, startSession, endSession, isWebXRSupported } = useARSession();
  const { currentPatient, setVitalSigns } = useARStore();
  
  const { loadPatient, loadPatientByName, generateReport, mockPatients } = usePatientContext(patientId);
  const { isConnected } = useEmotionsData(currentPatient?.id || null);
  
  // Voice command handlers
  const handlePatientRequest = useCallback(async (name: string) => {
    const patient = await loadPatientByName(name);
    if (patient) {
      toast.success(language === 'fr' 
        ? `Patient ${patient.name} chargé` 
        : `Patient ${patient.name} loaded`
      );
    } else {
      toast.error(language === 'fr' 
        ? `Patient "${name}" non trouvé` 
        : `Patient "${name}" not found`
      );
    }
  }, [loadPatientByName, language]);

  const handleCapture = useCallback(() => {
    // Simulate screenshot
    toast.success(language === 'fr' ? 'Capture enregistrée' : 'Screenshot saved');
  }, [language]);

  const handleReport = useCallback(async () => {
    toast.loading(language === 'fr' ? 'Génération du rapport...' : 'Generating report...');
    const reportUrl = await generateReport();
    if (reportUrl) {
      toast.success(language === 'fr' ? 'Rapport généré' : 'Report generated');
      window.open(reportUrl, '_blank');
    } else {
      toast.info(language === 'fr' 
        ? 'Génération de rapport non disponible en mode démo' 
        : 'Report generation not available in demo mode'
      );
    }
  }, [generateReport, language]);

  const { isListening, toggleListening, isSpeechSupported } = useVoiceCommands({
    onPatientRequest: handlePatientRequest,
    onCapture: handleCapture,
    onReport: handleReport
  });

  // Start session on mount
  useEffect(() => {
    startSession();
    
    return () => {
      endSession();
    };
  }, [startSession, endSession]);

  // Load patient if provided
  useEffect(() => {
    if (patientId && isARActive) {
      loadPatient(patientId);
    }
  }, [patientId, isARActive, loadPatient]);

  // Simulate vital signs
  useEffect(() => {
    if (!isARActive || !currentPatient) return;

    const interval = setInterval(() => {
      setVitalSigns({
        heartRate: 65 + Math.floor(Math.random() * 20),
        stressLevel: 30 + Math.floor(Math.random() * 40),
        timestamp: new Date().toISOString()
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [isARActive, currentPatient, setVitalSigns]);

  // Loading state
  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="text-lg text-muted-foreground">
            {language === 'fr' ? 'Initialisation de la session AR...' : 'Initializing AR session...'}
          </p>
          <p className="text-sm text-muted-foreground/70">
            {language === 'fr' 
              ? `Appareil détecté: ${deviceType || 'Détection...'}`
              : `Device detected: ${deviceType || 'Detecting...'}`
            }
          </p>
        </div>
      </div>
    );
  }

  // Pre-session state (patient selection)
  if (!currentPatient) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background p-4">
        <div className="max-w-md w-full space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
              <Glasses className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold">
              {language === 'fr' ? 'Session AR Clinique' : 'Clinical AR Session'}
            </h1>
            <p className="text-muted-foreground">
              {language === 'fr' 
                ? 'Sélectionnez un patient pour commencer' 
                : 'Select a patient to begin'
              }
            </p>
          </div>

          {/* Device info */}
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <span className={`w-2 h-2 rounded-full ${isWebXRSupported ? 'bg-green-500' : 'bg-yellow-500'}`} />
            <span>
              {deviceType === 'quest' && 'Meta Quest'}
              {deviceType === 'hololens' && 'HoloLens'}
              {deviceType === 'smartphone' && (language === 'fr' ? 'Smartphone AR' : 'Smartphone AR')}
              {deviceType === 'desktop' && (language === 'fr' ? 'Mode Bureau (Émulateur)' : 'Desktop Mode (Emulator)')}
            </span>
          </div>

          {/* Patient list */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Users className="h-4 w-4" />
              {language === 'fr' ? 'Patients récents' : 'Recent Patients'}
            </h3>
            
            <div className="space-y-2">
              {mockPatients.map((patient) => (
                <button
                  key={patient.id}
                  onClick={() => loadPatient(patient.id)}
                  className="w-full p-4 rounded-xl border border-border bg-card hover:bg-accent/50 transition-colors text-left group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium group-hover:text-primary transition-colors">
                        {patient.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {patient.age} {language === 'fr' ? 'ans' : 'y/o'} • {patient.diagnosis}
                      </p>
                    </div>
                    <Glasses className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Voice hint */}
          {isSpeechSupported && (
            <p className="text-xs text-center text-muted-foreground">
              {language === 'fr' 
                ? 'Ou dites "Patient [nom]" pour charger un dossier' 
                : 'Or say "Patient [name]" to load a file'
              }
            </p>
          )}

          {/* Back button */}
          <Button 
            variant="ghost" 
            className="w-full" 
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {language === 'fr' ? 'Retour au tableau de bord' : 'Back to dashboard'}
          </Button>
        </div>
      </div>
    );
  }

  // Active AR session
  return (
    <div className="fixed inset-0">
      {/* 3D Scene */}
      <ARScene debug={false} />
      
      {/* HUD Overlay */}
      <HUDPanel 
        onMicToggle={toggleListening}
        isListening={isListening}
      />

      {/* Quick actions (bottom left) */}
      <div className="fixed bottom-20 left-4 flex flex-col gap-2 z-50">
        <Button
          size="sm"
          variant="secondary"
          className="backdrop-blur-sm bg-black/50 border-white/20 text-white hover:bg-black/70"
          onClick={handleCapture}
        >
          <Camera className="h-4 w-4 mr-2" />
          {language === 'fr' ? 'Capture' : 'Screenshot'}
        </Button>
        
        <Button
          size="sm"
          variant="secondary"
          className="backdrop-blur-sm bg-black/50 border-white/20 text-white hover:bg-black/70"
          onClick={handleReport}
        >
          <FileText className="h-4 w-4 mr-2" />
          {language === 'fr' ? 'Rapport' : 'Report'}
        </Button>
        
        <Button
          size="sm"
          variant="secondary"
          className="backdrop-blur-sm bg-black/50 border-white/20 text-white hover:bg-black/70"
          onClick={() => setShowNotes(prev => !prev)}
        >
          <StickyNote className="h-4 w-4 mr-2" />
          {language === 'fr' ? 'Notes' : 'Notes'}
        </Button>
      </div>

      {/* Clinical Notes Panel */}
      <ClinicalNotes 
        patientId={currentPatient?.id || null}
        isOpen={showNotes}
        onClose={() => setShowNotes(false)}
      />

      {/* Exit button */}
      <Button
        size="sm"
        variant="destructive"
        className="fixed bottom-4 left-4 z-50"
        onClick={() => navigate('/dashboard')}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        {language === 'fr' ? 'Quitter AR' : 'Exit AR'}
      </Button>

      {/* Connection status */}
      <div className="fixed bottom-4 right-4 z-50">
        <div className={`px-3 py-1 rounded-full text-xs ${
          isConnected 
            ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
            : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
        }`}>
          {isConnected 
            ? (language === 'fr' ? 'Temps réel actif' : 'Real-time active')
            : (language === 'fr' ? 'Mode démo' : 'Demo mode')
          }
        </div>
      </div>
    </div>
  );
}
