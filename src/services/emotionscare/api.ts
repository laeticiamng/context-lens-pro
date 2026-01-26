import { apiClient } from './client';
import type {
  Patient,
  PatientSearchResult,
  Assessment,
  BrainRegion,
  BrainMeshResponse,
  EmotionData,
  EmotionHistory,
  Note,
  ARContext,
  ReportConfig,
  ReportStatus,
  VitalSigns,
} from './types';

// ============ MOCK DATA FOR DEMO ============

const MOCK_PATIENTS: PatientSearchResult[] = [
  {
    id: 'patient-001',
    name: 'Marie Dupont',
    age: 34,
    gender: 'F',
    last_visit: '2026-01-20',
    diagnosis: 'Trouble anxieux généralisé',
  },
  {
    id: 'patient-002',
    name: 'Jean Martin',
    age: 45,
    gender: 'M',
    last_visit: '2026-01-22',
    diagnosis: 'Dépression majeure',
  },
  {
    id: 'patient-003',
    name: 'Sophie Bernard',
    age: 28,
    gender: 'F',
    last_visit: '2026-01-24',
    diagnosis: 'Trouble bipolaire type II',
  },
];

const MOCK_BRAIN_REGIONS: BrainRegion[] = [
  { id: 'amygdala', region_code: 'AMY', region_name: 'Amygdale', hemisphere: 'Bilateral', default_color: '#EF4444', position: [0.15, -0.05, 0.1] },
  { id: 'hippocampus', region_code: 'HIP', region_name: 'Hippocampe', hemisphere: 'Bilateral', default_color: '#3B82F6', position: [-0.12, -0.08, 0.05] },
  { id: 'prefrontal', region_code: 'PFC', region_name: 'Cortex Préfrontal', hemisphere: 'Bilateral', default_color: '#3B82F6', position: [0, 0.15, 0.2] },
  { id: 'insula', region_code: 'INS', region_name: 'Insula', hemisphere: 'Bilateral', default_color: '#8B5CF6', position: [0.18, 0.02, -0.05] },
  { id: 'hypothalamus', region_code: 'HYP', region_name: 'Hypothalamus', hemisphere: 'Bilateral', default_color: '#F59E0B', position: [0, -0.12, 0.08] },
  { id: 'nucleus_accumbens', region_code: 'NAC', region_name: 'Noyau Accumbens', hemisphere: 'Bilateral', default_color: '#10B981', position: [0.05, -0.02, 0.12] },
];

// ============ API SERVICE ============

export const emotionsCareApi = {
  // ============ PATIENTS ============
  
  async searchPatients(query: string): Promise<PatientSearchResult[]> {
    try {
      const data = await apiClient.get<{ patients: PatientSearchResult[] }>('/patients/search', {
        params: { q: query },
      });
      return data.patients;
    } catch {
      // Fallback to mock data
      console.log('[API] Using mock patient data');
      return MOCK_PATIENTS.filter(p => 
        p.name.toLowerCase().includes(query.toLowerCase())
      );
    }
  },

  async getPatient(patientId: string): Promise<Patient> {
    try {
      const data = await apiClient.get<Patient>(`/patients/${patientId}`);
      return data;
    } catch {
      // Fallback to mock
      const mock = MOCK_PATIENTS.find(p => p.id === patientId);
      if (mock) {
        return {
          id: mock.id,
          first_name: mock.name.split(' ')[0],
          last_name: mock.name.split(' ')[1] || '',
          date_of_birth: '1992-05-15',
          gender: mock.gender,
          diagnosis: mock.diagnosis,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
      }
      throw new Error('Patient not found');
    }
  },

  async getPatientAssessments(patientId: string): Promise<Assessment[]> {
    try {
      const data = await apiClient.get<{ assessments: Assessment[] }>(`/patients/${patientId}/assessments`);
      return data.assessments;
    } catch {
      // Mock assessments
      return [
        { id: 'assess-1', patient_id: patientId, type: 'GAD-7', score: 12, date: '2026-01-20' },
        { id: 'assess-2', patient_id: patientId, type: 'PHQ-9', score: 8, date: '2026-01-18' },
      ];
    }
  },

  // ============ BRAIN ============

  async getBrainMesh(
    patientId: string,
    options: { format?: 'gltf' | 'obj'; lod?: 'high' | 'medium' | 'low' } = {}
  ): Promise<BrainMeshResponse> {
    const { format = 'gltf', lod = 'medium' } = options;
    
    try {
      const data = await apiClient.get<BrainMeshResponse>(`/brain/${patientId}/mesh`, {
        params: { format, lod },
      });
      return data;
    } catch {
      // Return mock mesh URL
      return {
        mesh_url: '/models/brain.glb',
        format: 'gltf',
        lod,
        regions: MOCK_BRAIN_REGIONS,
        patient_id: patientId,
      };
    }
  },

  async getBrainMeshUrl(
    patientId: string,
    options: { format?: 'gltf' | 'obj'; lod?: 'high' | 'medium' | 'low' } = {}
  ): Promise<string> {
    const { format = 'gltf', lod = 'medium' } = options;
    
    try {
      return await apiClient.getMeshUrl(`/brain/${patientId}/mesh`, {
        format,
        lod,
      });
    } catch {
      return '/models/brain.glb';
    }
  },

  async getBrainRegions(patientId: string): Promise<BrainRegion[]> {
    try {
      const data = await apiClient.get<{ regions: BrainRegion[] }>(`/brain/${patientId}/regions`);
      return data.regions;
    } catch {
      return MOCK_BRAIN_REGIONS;
    }
  },

  // ============ EMOTIONS ============

  async getEmotions(patientId: string): Promise<EmotionData> {
    try {
      const data = await apiClient.get<EmotionData>(`/brain/${patientId}/emotions`);
      return data;
    } catch {
      // Generate random mock emotions
      return {
        anxiety: 0.3 + Math.random() * 0.4,
        joy: 0.2 + Math.random() * 0.3,
        sadness: 0.1 + Math.random() * 0.25,
        anger: 0.05 + Math.random() * 0.15,
        disgust: 0.02 + Math.random() * 0.1,
        timestamp: new Date().toISOString(),
      };
    }
  },

  async getEmotionHistory(
    patientId: string,
    params: { from: string; to: string; interval?: 'hour' | 'day' | 'week' }
  ): Promise<EmotionHistory> {
    try {
      const data = await apiClient.get<EmotionHistory>(`/brain/${patientId}/emotions/history`, {
        params: {
          from: params.from,
          to: params.to,
          interval: params.interval || 'day',
        },
      });
      return data;
    } catch {
      // Generate mock history
      const data: EmotionHistory['data'] = [];
      const now = new Date();
      for (let i = 7; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        data.push({
          timestamp: date.toISOString(),
          emotions: {
            anxiety: 0.3 + Math.random() * 0.4,
            joy: 0.2 + Math.random() * 0.3,
            sadness: 0.1 + Math.random() * 0.25,
            anger: 0.05 + Math.random() * 0.15,
            disgust: 0.02 + Math.random() * 0.1,
            timestamp: date.toISOString(),
          },
        });
      }
      return { data, interval: params.interval || 'day', patient_id: patientId };
    }
  },

  // ============ VITALS ============

  async getVitals(patientId: string): Promise<VitalSigns> {
    try {
      const data = await apiClient.get<VitalSigns>(`/patients/${patientId}/vitals`);
      return data;
    } catch {
      return {
        heart_rate: 65 + Math.floor(Math.random() * 25),
        stress_level: 30 + Math.floor(Math.random() * 40),
        respiratory_rate: 14 + Math.floor(Math.random() * 6),
        timestamp: new Date().toISOString(),
      };
    }
  },

  // ============ NOTES ============

  async createNote(
    patientId: string,
    content: string,
    arContext?: ARContext
  ): Promise<Note> {
    try {
      const data = await apiClient.post<Note>(`/patients/${patientId}/notes`, {
        content,
        source: 'context-lens',
        ar_context: arContext,
      });
      return data;
    } catch {
      // Return mock note
      return {
        id: `note-${Date.now()}`,
        patient_id: patientId,
        content,
        source: 'context-lens',
        ar_context: arContext,
        created_at: new Date().toISOString(),
        created_by: 'current-user',
      };
    }
  },

  async getPatientNotes(patientId: string): Promise<Note[]> {
    try {
      const data = await apiClient.get<{ notes: Note[] }>(`/patients/${patientId}/notes`);
      return data.notes;
    } catch {
      return [];
    }
  },

  // ============ REPORTS ============

  async generateReport(
    patientId: string,
    config: ReportConfig
  ): Promise<{ reportId: string }> {
    try {
      const data = await apiClient.post<{ reportId: string }>(`/brain/${patientId}/report`, config);
      return data;
    } catch {
      return { reportId: `report-${Date.now()}` };
    }
  },

  async getReportStatus(reportId: string): Promise<ReportStatus> {
    try {
      const data = await apiClient.get<ReportStatus>(`/reports/${reportId}`);
      return data;
    } catch {
      // Mock: report is always ready in demo
      return {
        id: reportId,
        status: 'ready',
        progress: 100,
        file_url: undefined, // No actual file in demo
        created_at: new Date().toISOString(),
      };
    }
  },

  async downloadReport(reportId: string): Promise<Blob | null> {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_EMOTIONSCARE_API_URL}/api/context-lens/reports/${reportId}/download`,
        {
          headers: {
            'Authorization': `Bearer ${await import('./auth').then(m => m.getAccessToken())}`,
          },
        }
      );
      
      if (response.ok) {
        return await response.blob();
      }
      return null;
    } catch {
      return null;
    }
  },
};
