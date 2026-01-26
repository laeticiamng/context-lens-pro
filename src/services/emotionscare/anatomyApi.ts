import { apiClient } from './client';

// ============ ANATOMY TYPES ============

export type BodyZone = 'head' | 'thorax' | 'abdomen' | 'pelvis' | 'upper_limb' | 'lower_limb';

export type OrganSystem = 'cardio' | 'pulmo' | 'digestive' | 'nervous' | 'skeletal' | 'muscular';

export interface AnatomicalStructure {
  id: string;
  structure_code: string;
  structure_name: string;
  structure_category: OrganSystem;
  body_zone: BodyZone;
  laterality: 'left' | 'right' | 'bilateral' | 'center';
  volume_ml?: number;
  default_color: string;
  mesh_url?: string;
  opacity?: number;
}

export interface AnatomyLandmark {
  landmark_code: string;
  landmark_name: string;
  position: [number, number, number];
  confidence: number;
}

export interface PatientScan {
  id: string;
  patient_id: string;
  scan_date: string;
  modality: 'IRM' | 'CT' | 'PET';
  body_coverage: BodyZone[];
  structures_count: number;
}

export interface OrganInfo {
  structure: AnatomicalStructure;
  anomalies: AnatomyAnomaly[];
  measurements: Record<string, number>;
  notes?: string;
}

export interface AnatomyAnomaly {
  id: string;
  type: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
  location: [number, number, number];
}

// ============ MOCK DATA ============

const MOCK_STRUCTURES: AnatomicalStructure[] = [
  // Head
  { id: 'brain', structure_code: 'BRAIN', structure_name: 'Cerveau / Brain', structure_category: 'nervous', body_zone: 'head', laterality: 'bilateral', volume_ml: 1400, default_color: '#F472B6', opacity: 0.8 },
  { id: 'skull', structure_code: 'SKULL', structure_name: 'Crâne / Skull', structure_category: 'skeletal', body_zone: 'head', laterality: 'bilateral', default_color: '#E5E7EB', opacity: 0.3 },
  
  // Thorax
  { id: 'heart', structure_code: 'HEART', structure_name: 'Cœur / Heart', structure_category: 'cardio', body_zone: 'thorax', laterality: 'center', volume_ml: 320, default_color: '#EF4444', opacity: 0.9 },
  { id: 'lung_left', structure_code: 'LUNG_L', structure_name: 'Poumon G. / Left Lung', structure_category: 'pulmo', body_zone: 'thorax', laterality: 'left', volume_ml: 2500, default_color: '#FDA4AF', opacity: 0.7 },
  { id: 'lung_right', structure_code: 'LUNG_R', structure_name: 'Poumon D. / Right Lung', structure_category: 'pulmo', body_zone: 'thorax', laterality: 'right', volume_ml: 2800, default_color: '#FDA4AF', opacity: 0.7 },
  { id: 'aorta', structure_code: 'AORTA', structure_name: 'Aorte / Aorta', structure_category: 'cardio', body_zone: 'thorax', laterality: 'center', default_color: '#DC2626', opacity: 0.9 },
  { id: 'ribs', structure_code: 'RIBS', structure_name: 'Côtes / Ribs', structure_category: 'skeletal', body_zone: 'thorax', laterality: 'bilateral', default_color: '#E5E7EB', opacity: 0.3 },
  
  // Abdomen
  { id: 'liver', structure_code: 'LIVER', structure_name: 'Foie / Liver', structure_category: 'digestive', body_zone: 'abdomen', laterality: 'right', volume_ml: 1500, default_color: '#92400E', opacity: 0.85 },
  { id: 'spleen', structure_code: 'SPLEEN', structure_name: 'Rate / Spleen', structure_category: 'digestive', body_zone: 'abdomen', laterality: 'left', volume_ml: 150, default_color: '#7C3AED', opacity: 0.85 },
  { id: 'stomach', structure_code: 'STOMACH', structure_name: 'Estomac / Stomach', structure_category: 'digestive', body_zone: 'abdomen', laterality: 'center', volume_ml: 1000, default_color: '#F59E0B', opacity: 0.8 },
  { id: 'kidney_left', structure_code: 'KIDNEY_L', structure_name: 'Rein G. / Left Kidney', structure_category: 'digestive', body_zone: 'abdomen', laterality: 'left', volume_ml: 150, default_color: '#B91C1C', opacity: 0.85 },
  { id: 'kidney_right', structure_code: 'KIDNEY_R', structure_name: 'Rein D. / Right Kidney', structure_category: 'digestive', body_zone: 'abdomen', laterality: 'right', volume_ml: 150, default_color: '#B91C1C', opacity: 0.85 },
  
  // Pelvis
  { id: 'bladder', structure_code: 'BLADDER', structure_name: 'Vessie / Bladder', structure_category: 'digestive', body_zone: 'pelvis', laterality: 'center', volume_ml: 400, default_color: '#FBBF24', opacity: 0.75 },
  { id: 'pelvis_bone', structure_code: 'PELVIS', structure_name: 'Bassin / Pelvis', structure_category: 'skeletal', body_zone: 'pelvis', laterality: 'bilateral', default_color: '#E5E7EB', opacity: 0.3 },
];

const MOCK_LANDMARKS: AnatomyLandmark[] = [
  { landmark_code: 'nose', landmark_name: 'Nez', position: [0, 0.4, 0.1], confidence: 0.95 },
  { landmark_code: 'left_shoulder', landmark_name: 'Épaule Gauche', position: [-0.2, 0.2, 0], confidence: 0.92 },
  { landmark_code: 'right_shoulder', landmark_name: 'Épaule Droite', position: [0.2, 0.2, 0], confidence: 0.93 },
  { landmark_code: 'left_hip', landmark_name: 'Hanche Gauche', position: [-0.15, -0.2, 0], confidence: 0.88 },
  { landmark_code: 'right_hip', landmark_name: 'Hanche Droite', position: [0.15, -0.2, 0], confidence: 0.89 },
  { landmark_code: 'sternum', landmark_name: 'Sternum', position: [0, 0.1, 0.05], confidence: 0.91 },
];

// ============ API SERVICE ============

export const anatomyApi = {
  // Get available structures for a patient
  async getStructures(patientId: string, zone?: BodyZone): Promise<AnatomicalStructure[]> {
    try {
      const data = await apiClient.get<{ structures: AnatomicalStructure[] }>(
        `/anatomy/${patientId}/structures`,
        { params: zone ? { zone } : undefined }
      );
      return data.structures;
    } catch {
      console.log('[AnatomyAPI] Using mock structures');
      return zone 
        ? MOCK_STRUCTURES.filter(s => s.body_zone === zone)
        : MOCK_STRUCTURES;
    }
  },

  // Get mesh URL for a structure
  async getMeshUrl(
    patientId: string,
    structureCode: string,
    lod: 'high' | 'medium' | 'low' = 'medium'
  ): Promise<string> {
    try {
      const data = await apiClient.get<{ mesh_url: string }>(
        `/anatomy/${patientId}/mesh/${structureCode}`,
        { params: { lod } }
      );
      return data.mesh_url;
    } catch {
      // Return placeholder mesh URL
      return `/models/anatomy/${structureCode.toLowerCase()}.glb`;
    }
  },

  // Get registration landmarks from scan
  async getLandmarks(patientId: string): Promise<{ landmarks: AnatomyLandmark[] }> {
    try {
      const data = await apiClient.get<{ landmarks: AnatomyLandmark[] }>(
        `/anatomy/${patientId}/landmarks`
      );
      return data;
    } catch {
      console.log('[AnatomyAPI] Using mock landmarks');
      return { landmarks: MOCK_LANDMARKS };
    }
  },

  // Get patient scans
  async getScans(patientId: string): Promise<PatientScan[]> {
    try {
      const data = await apiClient.get<{ scans: PatientScan[] }>(
        `/anatomy/${patientId}/scans`
      );
      return data.scans;
    } catch {
      return [{
        id: 'scan-mock-001',
        patient_id: patientId,
        scan_date: '2026-01-15',
        modality: 'IRM',
        body_coverage: ['head', 'thorax', 'abdomen', 'pelvis'],
        structures_count: MOCK_STRUCTURES.length,
      }];
    }
  },

  // Get organ info with anomalies
  async getOrganInfo(patientId: string, structureCode: string): Promise<OrganInfo> {
    try {
      const data = await apiClient.get<OrganInfo>(
        `/anatomy/${patientId}/organ/${structureCode}`
      );
      return data;
    } catch {
      const structure = MOCK_STRUCTURES.find(s => s.structure_code === structureCode);
      return {
        structure: structure || MOCK_STRUCTURES[0],
        anomalies: [],
        measurements: {
          volume_ml: structure?.volume_ml || 0,
        },
      };
    }
  },

  // Compare two scans
  async compareScan(
    patientId: string,
    scanId1: string,
    scanId2: string
  ): Promise<{ differences: Array<{ structure_code: string; volume_change: number; description: string }> }> {
    try {
      const data = await apiClient.get<{ differences: Array<{ structure_code: string; volume_change: number; description: string }> }>(
        `/anatomy/${patientId}/compare`,
        { params: { scan1: scanId1, scan2: scanId2 } }
      );
      return data;
    } catch {
      return { differences: [] };
    }
  },

  // Get structures by system
  async getBySystem(patientId: string, system: OrganSystem): Promise<AnatomicalStructure[]> {
    try {
      const data = await apiClient.get<{ structures: AnatomicalStructure[] }>(
        `/anatomy/${patientId}/system/${system}`
      );
      return data.structures;
    } catch {
      return MOCK_STRUCTURES.filter(s => s.structure_category === system);
    }
  },
};
