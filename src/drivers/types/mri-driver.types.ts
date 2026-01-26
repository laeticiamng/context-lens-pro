// Universal MRI Driver Types
// CLP-LUNETTES-IRM-2026-001

// ============ CORE TYPES ============

export type MRIDeviceType = 'chipiron_squid' | 'kyoto_opm' | 'hyperfine' | 'mock';

export type SequenceType = 'T1' | 'T2' | 'FLAIR' | 'DWI' | 'PD' | 'custom';

export type PatientPosition = 'supine' | 'prone' | 'left_lateral' | 'right_lateral';

export type BodyPart = 'head' | 'thorax' | 'abdomen' | 'pelvis' | 'upper_limb' | 'lower_limb' | 'spine' | 'full_body';

export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error' | 'maintenance';

export interface Vector3D {
  x: number;
  y: number;
  z: number;
}

// ============ MRI FRAME ============

export interface MRIFrameMetadata {
  fieldStrength: number; // in mT
  acquisitionTime: number; // in ms
  snr: number; // Signal-to-Noise Ratio
  deviceId: string;
  deviceType: MRIDeviceType;
  patientPosition: PatientPosition;
  sliceLocation?: number;
  echoTime?: number;
  repetitionTime?: number;
  flipAngle?: number;
  bandwidth?: number;
}

export interface MRIFrame {
  id: string;
  timestamp: number;
  sequenceType: SequenceType;
  dimensions: Vector3D;
  voxelSize: Vector3D; // in mm
  data: Float32Array; // Normalized intensities 0-1
  metadata: MRIFrameMetadata;
  sliceIndex: number;
  totalSlices: number;
}

// ============ DEVICE CAPABILITIES ============

export interface FieldStrengthRange {
  min: number; // mT
  max: number; // mT
}

export interface ResolutionCapability {
  low: Vector3D; // mm per voxel
  medium: Vector3D;
  high: Vector3D;
}

export interface DeviceCapabilities {
  deviceId: string;
  deviceType: MRIDeviceType;
  manufacturer: string;
  model: string;
  fieldStrength: FieldStrengthRange;
  supportedSequences: SequenceType[];
  supportedBodyParts: BodyPart[];
  maxResolution: Vector3D;
  resolutions: ResolutionCapability;
  realTimeStreaming: boolean;
  maxScanDuration: number; // seconds
  warmupTime: number; // seconds
  coolingRequired: boolean;
}

// ============ SCAN PARAMETERS ============

export interface ScanParameters {
  bodyPart: BodyPart;
  sequenceType: SequenceType;
  resolution: 'low' | 'medium' | 'high';
  duration: number; // seconds
  realTimeStream: boolean;
  contrast?: boolean;
  fatSuppression?: boolean;
  echoTime?: number;
  repetitionTime?: number;
}

// ============ DEVICE CONFIG ============

export interface DeviceConfig {
  deviceId: string;
  deviceType: MRIDeviceType;
  ipAddress: string;
  port?: number;
  apiKey?: string;
  timeout?: number; // ms
  retryAttempts?: number;
}

// ============ DEVICE STATUS ============

export interface DeviceStatus {
  connected: boolean;
  status: ConnectionStatus;
  deviceInfo?: DeviceCapabilities;
  temperature?: number; // for cryostat monitoring (Kelvin)
  magnetReady?: boolean;
  lastHeartbeat?: number;
  errorMessage?: string;
  timestamp: number;
}

// ============ DISCOVERED DEVICE ============

export interface DiscoveredDevice {
  deviceId: string;
  deviceType: MRIDeviceType;
  manufacturer: string;
  model: string;
  ipAddress: string;
  port: number;
  serialNumber: string;
  firmwareVersion: string;
  discoveredAt: number;
}

// ============ DRIVER INTERFACE ============

export interface MRIDeviceDriver {
  // Connection management
  connect(config: DeviceConfig): Promise<DeviceStatus>;
  disconnect(): Promise<void>;
  getStatus(): DeviceStatus;
  
  // Capabilities
  getCapabilities(): DeviceCapabilities;
  isReady(): boolean;
  
  // Scanning
  startScan(params: ScanParameters): Promise<void>;
  stopScan(): Promise<void>;
  pauseScan(): Promise<void>;
  resumeScan(): Promise<void>;
  
  // Frame streaming
  onFrame(callback: (frame: MRIFrame) => void): void;
  offFrame(callback: (frame: MRIFrame) => void): void;
  
  // Events
  onStatusChange(callback: (status: DeviceStatus) => void): void;
  onError(callback: (error: Error) => void): void;
}

// ============ SCAN SESSION ============

export interface ScanSession {
  id: string;
  deviceId: string;
  patientReference: string;
  protocolId: string;
  parameters: ScanParameters;
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'cancelled';
  startedAt?: number;
  completedAt?: number;
  framesReceived: number;
  totalFramesExpected: number;
  errorMessage?: string;
}

// ============ RECONSTRUCTION ============

export interface ReconstructionConfig {
  isoValue: number;
  smoothing: number;
  decimation: number;
  colorMapping: 'anatomical' | 'grayscale' | 'heatmap';
  maxDimensions: Vector3D;
}

export interface ReconstructionUpdate {
  meshData: ArrayBuffer | null;
  segmentation: SegmentationResult | null;
  completionPercentage: number;
  qualityScore: number;
  timestamp: number;
}

export interface SegmentationResult {
  structures: SegmentedStructure[];
  confidence: number;
  processingTime: number;
}

export interface SegmentedStructure {
  id: string;
  name: string;
  nameFr: string;
  category: string;
  color: string;
  volume: number; // ml
  meshUrl?: string;
  anomalies: StructureAnomaly[];
}

export interface StructureAnomaly {
  id: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  descriptionFr: string;
  position: Vector3D;
  size: number; // mm
}
