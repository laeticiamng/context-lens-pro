import { Suspense, useEffect, useCallback, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Grid } from '@react-three/drei';
import { 
  useBodyTracking, 
  useGazeZone, 
  useRegistration, 
  useOrganLoader,
  useAnatomyVoiceCommands 
} from '@/hooks/anatomy';
import { useAnatomyStore } from '@/stores/anatomyStore';
import { AnatomyOverlay } from './AnatomyOverlay';
import { AnatomyHUD } from './AnatomyHUD';
import { BodyTracker } from './BodyTracker';
import { Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/i18n/LanguageContext';
import type { BodyZone } from '@/services/emotionscare/anatomyApi';

interface AnatomyARViewProps {
  patientId: string;
  patientName?: string;
  onSessionEnd?: () => void;
}

function LoadingIndicator() {
  return (
    <mesh position={[0, 1, 0]}>
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshStandardMaterial color="#3b82f6" wireframe />
    </mesh>
  );
}

function NoPatientBanner({ language }: { language: string }) {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
      <Alert variant="destructive" className="bg-destructive/90 backdrop-blur-sm">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>
          {language === 'fr' ? 'Patient non détecté' : 'Patient not detected'}
        </AlertTitle>
        <AlertDescription>
          {language === 'fr' 
            ? 'Positionnez le patient face à la caméra pour activer le tracking.'
            : 'Position the patient facing the camera to activate tracking.'}
        </AlertDescription>
      </Alert>
    </div>
  );
}

function CalibratingIndicator({ quality, language }: { quality: number; language: string }) {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
      <div className="bg-background/90 backdrop-blur-sm rounded-lg p-6 flex flex-col items-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-lg font-medium">
          {language === 'fr' ? 'Calibration en cours...' : 'Calibrating...'}
        </p>
        <div className="w-48 h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${quality * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export function AnatomyARView({ patientId, patientName, onSessionEnd }: AnatomyARViewProps) {
  const { language } = useLanguage();
  const store = useAnatomyStore();
  const [showBodyTracker, setShowBodyTracker] = useState(false);
  
  // Initialize patient in store
  useEffect(() => {
    store.setPatientId(patientId);
    return () => {
      store.reset();
    };
  }, [patientId, store]);
  
  // Body tracking
  const {
    bodyLandmarks,
    isTracking,
    trackingConfidence,
    startTracking,
    stopTracking,
  } = useBodyTracking();
  
  // Gaze zone detection
  const {
    currentZone,
    gazePoint,
    adjacentZones,
    setManualZone,
  } = useGazeZone(bodyLandmarks);
  
  // Registration (3D alignment)
  const {
    transformMatrix,
    isCalibrated,
    calibrationQuality,
    recalibrate,
    isCalibrating,
  } = useRegistration(patientId, bodyLandmarks);
  
  // Organ loading
  const {
    loadedOrgans,
    isLoading: isLoadingOrgans,
    loadZone,
    preloadZone,
  } = useOrganLoader(patientId);
  
  // Voice commands
  const {
    isListening,
    startListening,
    stopListening,
    processCommand,
  } = useAnatomyVoiceCommands();

  // Start tracking on mount
  useEffect(() => {
    startTracking();
    return () => {
      stopTracking();
    };
  }, [startTracking, stopTracking]);

  // Load organs when zone changes
  useEffect(() => {
    if (!currentZone) return;
    
    // Load current zone with high LOD
    loadZone(currentZone, 'high');
    
    // Preload adjacent zones with low LOD
    adjacentZones.forEach(zone => {
      preloadZone(zone);
    });
  }, [currentZone, adjacentZones, loadZone, preloadZone]);

  // Zone selection handler
  const handleZoneSelect = useCallback((zone: BodyZone) => {
    setManualZone(zone);
  }, [setManualZone]);

  // Voice toggle handler
  const handleVoiceToggle = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  return (
    <div className="relative w-full h-screen bg-black">
      {/* 3D Canvas */}
      <Canvas className="w-full h-full">
        <PerspectiveCamera makeDefault position={[0, 1.5, 3]} />
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          target={[0, 1, 0]}
          maxDistance={5}
          minDistance={1}
        />
        
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={0.6} castShadow />
        <directionalLight position={[-5, 3, -5]} intensity={0.3} />
        
        <Suspense fallback={<LoadingIndicator />}>
          {/* Environment */}
          <Environment preset="studio" />
          
          {/* Grid for spatial reference */}
          <Grid
            position={[0, 0, 0]}
            args={[10, 10]}
            cellSize={0.5}
            cellThickness={0.5}
            cellColor="#6b7280"
            sectionSize={2}
            sectionThickness={1}
            sectionColor="#374151"
            fadeDistance={10}
            infiniteGrid
          />
          
          {/* Body tracker visualization (for debugging) */}
          {showBodyTracker && (
            <BodyTracker 
              landmarks={bodyLandmarks} 
              visible={isTracking}
              color="#00ff00"
            />
          )}
          
          {/* Anatomy overlay */}
          {isCalibrated && (
            <AnatomyOverlay
              organs={loadedOrgans}
              transformMatrix={transformMatrix}
            />
          )}
        </Suspense>
      </Canvas>
      
      {/* HUD Overlay */}
      <AnatomyHUD
        patientId={patientId}
        patientName={patientName}
        currentZone={currentZone}
        loadedOrgans={loadedOrgans}
        focusedOrgan={store.focusedOrgan}
        isCalibrated={isCalibrated}
        calibrationQuality={calibrationQuality}
        isVoiceActive={isListening}
        onRecalibrate={recalibrate}
        onToggleVoice={handleVoiceToggle}
        onZoneSelect={handleZoneSelect}
      />
      
      {/* Status indicators */}
      {!isTracking && <NoPatientBanner language={language} />}
      {isTracking && isCalibrating && (
        <CalibratingIndicator quality={calibrationQuality} language={language} />
      )}
      
      {/* Debug controls */}
      <div className="absolute bottom-20 right-4 flex flex-col gap-2 pointer-events-auto">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowBodyTracker(!showBodyTracker)}
          className="bg-background/80"
        >
          {showBodyTracker ? 'Hide Skeleton' : 'Show Skeleton'}
        </Button>
        {onSessionEnd && (
          <Button
            variant="destructive"
            size="sm"
            onClick={onSessionEnd}
          >
            {language === 'fr' ? 'Terminer' : 'End Session'}
          </Button>
        )}
      </div>
    </div>
  );
}
