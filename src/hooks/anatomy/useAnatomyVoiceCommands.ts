import { useCallback, useEffect, useRef } from 'react';
import { useAnatomyStore } from '@/stores/anatomyStore';
import type { BodyZone, OrganSystem } from '@/services/emotionscare/anatomyApi';

export interface AnatomyVoiceCommand {
  pattern: RegExp;
  patternFr: RegExp;
  action: string;
  handler: (matches: RegExpMatchArray) => void;
}

export interface UseAnatomyVoiceCommandsResult {
  isListening: boolean;
  lastCommand: string | null;
  processCommand: (transcript: string) => boolean;
  startListening: () => void;
  stopListening: () => void;
}

// Organ name mappings (FR/EN)
const ORGAN_NAMES: Record<string, string> = {
  // French
  'cerveau': 'BRAIN',
  'crâne': 'SKULL',
  'cœur': 'HEART',
  'coeur': 'HEART',
  'poumon': 'LUNG_L',
  'poumons': 'LUNG_L',
  'poumon gauche': 'LUNG_L',
  'poumon droit': 'LUNG_R',
  'aorte': 'AORTA',
  'côtes': 'RIBS',
  'foie': 'LIVER',
  'rate': 'SPLEEN',
  'estomac': 'STOMACH',
  'rein': 'KIDNEY_L',
  'reins': 'KIDNEY_L',
  'rein gauche': 'KIDNEY_L',
  'rein droit': 'KIDNEY_R',
  'vessie': 'BLADDER',
  'bassin': 'PELVIS',
  
  // English
  'brain': 'BRAIN',
  'skull': 'SKULL',
  'heart': 'HEART',
  'lung': 'LUNG_L',
  'lungs': 'LUNG_L',
  'left lung': 'LUNG_L',
  'right lung': 'LUNG_R',
  'aorta': 'AORTA',
  'ribs': 'RIBS',
  'liver': 'LIVER',
  'spleen': 'SPLEEN',
  'stomach': 'STOMACH',
  'kidney': 'KIDNEY_L',
  'kidneys': 'KIDNEY_L',
  'left kidney': 'KIDNEY_L',
  'right kidney': 'KIDNEY_R',
  'bladder': 'BLADDER',
  'pelvis': 'PELVIS',
};

// System name mappings
const SYSTEM_NAMES: Record<string, OrganSystem> = {
  // French
  'cardio': 'cardio',
  'cardiovasculaire': 'cardio',
  'pulmonaire': 'pulmo',
  'pulmo': 'pulmo',
  'respiratoire': 'pulmo',
  'digestif': 'digestive',
  'digestive': 'digestive',
  'nerveux': 'nervous',
  'squelettique': 'skeletal',
  'osseux': 'skeletal',
  'musculaire': 'muscular',
  
  // English
  'cardiovascular': 'cardio',
  'cardiac': 'cardio',
  'pulmonary': 'pulmo',
  'respiratory': 'pulmo',
  'nervous': 'nervous',
  'skeletal': 'skeletal',
  'muscular': 'muscular',
};

// Zone name mappings
const ZONE_NAMES: Record<string, BodyZone> = {
  // French
  'tête': 'head',
  'thorax': 'thorax',
  'abdomen': 'abdomen',
  'bassin': 'pelvis',
  'bras': 'upper_limb',
  'jambe': 'lower_limb',
  
  // English
  'head': 'head',
  'chest': 'thorax',
  'pelvis': 'pelvis',
  'arm': 'upper_limb',
  'leg': 'lower_limb',
};

export function useAnatomyVoiceCommands(): UseAnatomyVoiceCommandsResult {
  const store = useAnatomyStore();
  const recognitionRef = useRef<any>(null);
  const lastCommandRef = useRef<string | null>(null);

  // Helper to find organ code from name
  const findOrganCode = (name: string): string | null => {
    const normalized = name.toLowerCase().trim();
    return ORGAN_NAMES[normalized] || null;
  };

  // Helper to find system from name
  const findSystem = (name: string): OrganSystem | null => {
    const normalized = name.toLowerCase().trim();
    return SYSTEM_NAMES[normalized] || null;
  };

  // Helper to find zone from name
  const findZone = (name: string): BodyZone | null => {
    const normalized = name.toLowerCase().trim();
    return ZONE_NAMES[normalized] || null;
  };

  // Process voice command
  const processCommand = useCallback((transcript: string): boolean => {
    const normalized = transcript.toLowerCase().trim();
    lastCommandRef.current = normalized;
    
    console.log('[VoiceCommand] Processing:', normalized);

    // ZOOM / FOCUS commands
    const zoomMatch = normalized.match(/(?:zoom|focus|focuser|zoomer)\s+(?:sur\s+)?(?:le\s+|la\s+|l')?(.+)/i);
    if (zoomMatch) {
      const organCode = findOrganCode(zoomMatch[1]);
      if (organCode) {
        store.setFocusedOrgan(organCode);
        store.setViewMode('isolated');
        console.log('[VoiceCommand] Focused on:', organCode);
        return true;
      }
    }

    // ISOLATE commands
    const isolateMatch = normalized.match(/(?:isoler|isolate|isole)\s+(?:le\s+|la\s+|l')?(.+)/i);
    if (isolateMatch) {
      const organCode = findOrganCode(isolateMatch[1]);
      if (organCode) {
        store.showAllOrgans();
        store.loadedOrgans.forEach((_, code) => {
          if (code !== organCode) {
            store.hideOrgan(code);
          }
        });
        store.setFocusedOrgan(organCode);
        console.log('[VoiceCommand] Isolated:', organCode);
        return true;
      }
    }

    // HIDE commands
    const hideMatch = normalized.match(/(?:masquer|hide|cacher)\s+(?:le\s+|la\s+|l')?(.+)/i);
    if (hideMatch) {
      const organCode = findOrganCode(hideMatch[1]);
      if (organCode) {
        store.hideOrgan(organCode);
        console.log('[VoiceCommand] Hidden:', organCode);
        return true;
      }
    }

    // SHOW ALL commands
    if (normalized.match(/(?:afficher tout|show all|tout afficher|montrer tout)/i)) {
      store.showAllOrgans();
      store.setActiveSystem(null);
      store.setFocusedOrgan(null);
      store.setViewMode('overlay');
      console.log('[VoiceCommand] Showing all');
      return true;
    }

    // SYSTEM FILTER commands
    const systemMatch = normalized.match(/(?:système|system|filtre)\s+(.+)/i);
    if (systemMatch) {
      const system = findSystem(systemMatch[1]);
      if (system) {
        store.setActiveSystem(system);
        console.log('[VoiceCommand] Filtered by system:', system);
        return true;
      }
    }

    // SLICE VIEW commands
    if (normalized.match(/(?:coupe|slice|vue)\s+(?:axiale|axial)/i)) {
      store.setSliceView('axial');
      console.log('[VoiceCommand] Axial slice view');
      return true;
    }
    if (normalized.match(/(?:coupe|slice|vue)\s+(?:sagittale|sagittal)/i)) {
      store.setSliceView('sagittal');
      console.log('[VoiceCommand] Sagittal slice view');
      return true;
    }
    if (normalized.match(/(?:coupe|slice|vue)\s+(?:coronale|coronal)/i)) {
      store.setSliceView('coronal');
      console.log('[VoiceCommand] Coronal slice view');
      return true;
    }

    // OPACITY commands
    const opacityMatch = normalized.match(/(?:opacité|opacity)\s+(\d+)/i);
    if (opacityMatch) {
      const opacity = parseInt(opacityMatch[1]) / 100;
      store.setGlobalOpacity(opacity);
      console.log('[VoiceCommand] Opacity set to:', opacity);
      return true;
    }

    // RECALIBRATE commands
    if (normalized.match(/(?:recalibrer|recalibrate|calibrer|calibrate)/i)) {
      store.setCalibration(false, 0);
      console.log('[VoiceCommand] Recalibrating...');
      return true;
    }

    // EXTERNAL VIEW commands
    if (normalized.match(/(?:vue externe|external view|normal view|vue normale)/i)) {
      store.setViewMode('overlay');
      store.showAllOrgans();
      store.setSliceView('none');
      console.log('[VoiceCommand] External view');
      return true;
    }

    // ZONE commands
    const zoneMatch = normalized.match(/(?:zone|voir|see)\s+(.+)/i);
    if (zoneMatch) {
      const zone = findZone(zoneMatch[1]);
      if (zone) {
        store.setCurrentZone(zone, []);
        console.log('[VoiceCommand] Zone set to:', zone);
        return true;
      }
    }

    // WHAT IS THIS? commands
    if (normalized.match(/(?:qu'est-ce que c'est|what is this|c'est quoi|what's this)/i)) {
      // This would trigger info display for focused organ
      console.log('[VoiceCommand] Info request for focused organ');
      return true;
    }

    console.log('[VoiceCommand] Command not recognized:', normalized);
    return false;
  }, [store]);

  // Start listening
  const startListening = useCallback(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.warn('[VoiceCommand] Speech recognition not supported');
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'fr-FR';

    recognition.onresult = (event: any) => {
      const last = event.results.length - 1;
      const transcript = event.results[last][0].transcript;
      processCommand(transcript);
    };

    recognition.onerror = (event: any) => {
      console.error('[VoiceCommand] Error:', event.error);
    };

    recognition.onend = () => {
      // Auto-restart if not intentionally stopped
      if (recognitionRef.current) {
        recognition.start();
      }
    };

    recognition.start();
    recognitionRef.current = recognition;
    console.log('[VoiceCommand] Started listening');
  }, [processCommand]);

  // Stop listening
  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
      console.log('[VoiceCommand] Stopped listening');
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopListening();
    };
  }, [stopListening]);

  return {
    isListening: !!recognitionRef.current,
    lastCommand: lastCommandRef.current,
    processCommand,
    startListening,
    stopListening,
  };
}
