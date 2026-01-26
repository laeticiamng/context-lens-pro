import { useState, useCallback } from 'react';
import { useARStore, PatientData } from '@/stores/arStore';

const API_URL = import.meta.env.VITE_EMOTIONSCARE_API_URL || 'https://api.emotionscare.app';

interface BrainData {
  meshUrl: string;
  regions: string[];
}

// Mock patients for demo
const MOCK_PATIENTS: PatientData[] = [
  {
    id: 'patient-001',
    name: 'Marie Dupont',
    age: 34,
    gender: 'F',
    lastSession: '2026-01-20',
    diagnosis: 'Trouble anxieux généralisé'
  },
  {
    id: 'patient-002',
    name: 'Jean Martin',
    age: 45,
    gender: 'M',
    lastSession: '2026-01-22',
    diagnosis: 'Dépression majeure'
  },
  {
    id: 'patient-003',
    name: 'Sophie Bernard',
    age: 28,
    gender: 'F',
    lastSession: '2026-01-24',
    diagnosis: 'Trouble bipolaire type II'
  }
];

export function usePatientContext(patientId?: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [brain, setBrain] = useState<BrainData | null>(null);
  
  const { currentPatient, setCurrentPatient, setBrainMeshUrl } = useARStore();

  // Search patient by name
  const searchPatient = useCallback(async (query: string): Promise<PatientData[]> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Try real API first
      const response = await fetch(`${API_URL}/api/patients/search?q=${encodeURIComponent(query)}`, {
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_EMOTIONSCARE_API_KEY || ''}`
        }
      });
      
      if (response.ok) {
        return await response.json();
      }
      
      // Fallback to mock data
      return MOCK_PATIENTS.filter(p => 
        p.name.toLowerCase().includes(query.toLowerCase())
      );
    } catch (e) {
      console.log('Using mock patient data');
      return MOCK_PATIENTS.filter(p => 
        p.name.toLowerCase().includes(query.toLowerCase())
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load patient by ID
  const loadPatient = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Try real API
      const patientResponse = await fetch(`${API_URL}/api/patients/${id}`, {
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_EMOTIONSCARE_API_KEY || ''}`
        }
      });
      
      if (patientResponse.ok) {
        const patient = await patientResponse.json();
        setCurrentPatient(patient);
        
        // Load brain mesh
        const brainResponse = await fetch(`${API_URL}/api/brain/${id}/mesh`);
        if (brainResponse.ok) {
          const brainData = await brainResponse.json();
          setBrain(brainData);
          setBrainMeshUrl(brainData.meshUrl);
        }
        
        return patient;
      }
      
      // Fallback to mock
      const mockPatient = MOCK_PATIENTS.find(p => p.id === id) || MOCK_PATIENTS[0];
      setCurrentPatient(mockPatient);
      
      // Use placeholder brain
      const mockBrain: BrainData = {
        meshUrl: '/models/brain.glb',
        regions: ['amygdala', 'hippocampus', 'prefrontal', 'insula', 'hypothalamus', 'nucleus_accumbens']
      };
      setBrain(mockBrain);
      setBrainMeshUrl(mockBrain.meshUrl);
      
      return mockPatient;
    } catch (e) {
      console.log('Using mock patient');
      const mockPatient = MOCK_PATIENTS.find(p => p.id === id) || MOCK_PATIENTS[0];
      setCurrentPatient(mockPatient);
      
      const mockBrain: BrainData = {
        meshUrl: '/models/brain.glb',
        regions: ['amygdala', 'hippocampus', 'prefrontal', 'insula', 'hypothalamus', 'nucleus_accumbens']
      };
      setBrain(mockBrain);
      setBrainMeshUrl(mockBrain.meshUrl);
      
      return mockPatient;
    } finally {
      setIsLoading(false);
    }
  }, [setCurrentPatient, setBrainMeshUrl]);

  // Load by name (from voice command)
  const loadPatientByName = useCallback(async (name: string) => {
    const results = await searchPatient(name);
    if (results.length > 0) {
      return loadPatient(results[0].id);
    }
    setError(`Patient "${name}" non trouvé`);
    return null;
  }, [searchPatient, loadPatient]);

  // Add clinical note
  const addClinicalNote = useCallback(async (text: string) => {
    if (!currentPatient) return;
    
    try {
      await fetch(`${API_URL}/api/patients/${currentPatient.id}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_EMOTIONSCARE_API_KEY || ''}`
        },
        body: JSON.stringify({ text, timestamp: new Date().toISOString() })
      });
    } catch (e) {
      console.log('Note saved locally');
    }
  }, [currentPatient]);

  // Generate PDF report
  const generateReport = useCallback(async (): Promise<string | null> => {
    if (!currentPatient) return null;
    
    try {
      const response = await fetch(`${API_URL}/api/brain/${currentPatient.id}/report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_EMOTIONSCARE_API_KEY || ''}`
        }
      });
      
      if (response.ok) {
        const blob = await response.blob();
        return URL.createObjectURL(blob);
      }
      
      return null;
    } catch (e) {
      console.log('Report generation not available');
      return null;
    }
  }, [currentPatient]);

  return {
    patient: currentPatient,
    brain,
    isLoading,
    error,
    searchPatient,
    loadPatient,
    loadPatientByName,
    addClinicalNote,
    generateReport,
    mockPatients: MOCK_PATIENTS
  };
}
