import { useEffect, useCallback, useRef } from 'react';
import { useARStore, ViewAngle } from '@/stores/arStore';

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  lang: string;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
  onstart: () => void;
}

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  length: number;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

// Command patterns (FR/EN)
const COMMANDS = {
  // Navigation
  zoom: /^zoom\s+(.+)$/i,
  zoomEn: /^zoom\s+(.+)$/i,
  view: /^vue\s+(axiale|sagittale|coronale)$/i,
  viewEn: /^view\s+(axial|sagittal|coronal)$/i,
  reset: /^reset$/i,
  resetFr: /^réinitialiser$/i,
  
  // Data
  history: /^historique\s+(\d+)\s+jours?$/i,
  historyEn: /^history\s+(\d+)\s+days?$/i,
  
  // Patient
  patient: /^patient\s+(.+)$/i,
  
  // Notes
  note: /^note\s*:\s*(.+)$/i,
  
  // Export
  capture: /^capture$/i,
  report: /^(générer|generer)\s+rapport$/i,
  reportEn: /^generate\s+report$/i,
  
  // Toggle
  overlay: /^(afficher|masquer)\s+overlay$/i,
  overlayEn: /^(show|hide)\s+overlay$/i,
  
  // Activation
  activate: /^(hey\s+lens|ok\s+lens)$/i,
};

export type CommandType = 
  | 'zoom' 
  | 'view' 
  | 'reset' 
  | 'history' 
  | 'patient' 
  | 'note' 
  | 'capture' 
  | 'report' 
  | 'overlay'
  | 'activate';

export interface CommandResult {
  type: CommandType;
  args: string[];
  raw: string;
}

interface UseVoiceCommandsOptions {
  onCommand?: (result: CommandResult) => void;
  onPatientRequest?: (name: string) => void;
  onCapture?: () => void;
  onReport?: () => void;
}

export function useVoiceCommands(options: UseVoiceCommandsOptions = {}) {
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  
  const {
    isListening,
    voiceLanguage,
    setListening,
    setLastCommand,
    setFocusedRegion,
    setViewAngle,
    setZoomLevel,
    toggleOverlay,
    addNote
  } = useARStore();

  const processCommand = useCallback((transcript: string): CommandResult | null => {
    const text = transcript.toLowerCase().trim();
    
    // Check all command patterns
    for (const [cmdName, regex] of Object.entries(COMMANDS)) {
      const match = text.match(regex);
      if (match) {
        const baseCmd = cmdName.replace('Fr', '').replace('En', '') as CommandType;
        return {
          type: baseCmd,
          args: match.slice(1),
          raw: text
        };
      }
    }
    
    return null;
  }, []);

  const executeCommand = useCallback((result: CommandResult) => {
    console.log('Executing command:', result);
    setLastCommand(result.raw);
    
    switch (result.type) {
      case 'zoom':
        const region = result.args[0];
        setFocusedRegion(region);
        setZoomLevel(2);
        break;
        
      case 'view':
        const angleMap: Record<string, ViewAngle> = {
          'axiale': 'axial',
          'axial': 'axial',
          'sagittale': 'sagittal',
          'sagittal': 'sagittal',
          'coronale': 'coronal',
          'coronal': 'coronal'
        };
        setViewAngle(angleMap[result.args[0]] || 'default');
        break;
        
      case 'reset':
        setFocusedRegion(null);
        setZoomLevel(1);
        setViewAngle('default');
        break;
        
      case 'patient':
        options.onPatientRequest?.(result.args[0]);
        break;
        
      case 'note':
        addNote({ text: result.args[0] });
        break;
        
      case 'capture':
        options.onCapture?.();
        break;
        
      case 'report':
        options.onReport?.();
        break;
        
      case 'overlay':
        toggleOverlay();
        break;
    }
    
    options.onCommand?.(result);
  }, [setLastCommand, setFocusedRegion, setZoomLevel, setViewAngle, addNote, toggleOverlay, options]);

  const startListening = useCallback(() => {
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognitionAPI) {
      console.error('Speech Recognition not supported');
      return;
    }
    
    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = true;
    recognition.lang = voiceLanguage;
    recognition.interimResults = false;
    
    recognition.onstart = () => {
      console.log('Voice recognition started');
      setListening(true);
    };
    
    recognition.onresult = (event) => {
      const lastResult = event.results[event.results.length - 1];
      if (lastResult.isFinal) {
        const transcript = lastResult[0].transcript;
        console.log('Transcript:', transcript);
        
        const command = processCommand(transcript);
        if (command) {
          executeCommand(command);
        }
      }
    };
    
    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      if (event.error !== 'no-speech') {
        setListening(false);
      }
    };
    
    recognition.onend = () => {
      console.log('Voice recognition ended');
      // Auto-restart if still supposed to be listening
      if (isListening) {
        recognition.start();
      }
    };
    
    recognition.start();
    recognitionRef.current = recognition;
  }, [voiceLanguage, isListening, setListening, processCommand, executeCommand]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setListening(false);
  }, [setListening]);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  return {
    isListening,
    startListening,
    stopListening,
    toggleListening,
    isSpeechSupported: !!(window.SpeechRecognition || window.webkitSpeechRecognition)
  };
}
