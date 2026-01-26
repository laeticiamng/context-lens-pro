// Mock MRI Driver for Development and Testing
// CLP-LUNETTES-IRM-2026-001

import type {
  MRIDeviceDriver,
  DeviceConfig,
  DeviceStatus,
  DeviceCapabilities,
  ScanParameters,
  MRIFrame,
  ConnectionStatus,
} from '../types/mri-driver.types';

export class MockMRIDriver implements MRIDeviceDriver {
  private config: DeviceConfig | null = null;
  private status: DeviceStatus;
  private isScanning = false;
  private scanInterval: ReturnType<typeof setInterval> | null = null;
  private frameCallbacks: Set<(frame: MRIFrame) => void> = new Set();
  private statusCallbacks: Set<(status: DeviceStatus) => void> = new Set();
  private errorCallbacks: Set<(error: Error) => void> = new Set();
  private currentSlice = 0;
  private totalSlices = 100;

  constructor() {
    this.status = {
      connected: false,
      status: 'disconnected',
      timestamp: Date.now(),
    };
  }

  async connect(config: DeviceConfig): Promise<DeviceStatus> {
    this.config = config;
    this.updateStatus('connecting');

    // Simulate connection delay
    await this.delay(500);

    this.status = {
      connected: true,
      status: 'connected',
      deviceInfo: this.getCapabilities(),
      temperature: 4.2, // Simulated cryostat temperature (Kelvin)
      magnetReady: true,
      lastHeartbeat: Date.now(),
      timestamp: Date.now(),
    };

    this.notifyStatusChange();
    return this.status;
  }

  async disconnect(): Promise<void> {
    if (this.isScanning) {
      await this.stopScan();
    }
    this.updateStatus('disconnected');
    this.config = null;
  }

  getStatus(): DeviceStatus {
    return { ...this.status };
  }

  getCapabilities(): DeviceCapabilities {
    return {
      deviceId: this.config?.deviceId || 'mock-device-001',
      deviceType: 'mock',
      manufacturer: 'Context-Lens-Pro',
      model: 'MockMRI Simulator v1.0',
      fieldStrength: { min: 5, max: 100 },
      supportedSequences: ['T1', 'T2', 'FLAIR', 'DWI', 'PD'],
      supportedBodyParts: ['head', 'thorax', 'abdomen', 'pelvis', 'upper_limb', 'lower_limb', 'spine', 'full_body'],
      maxResolution: { x: 1, y: 1, z: 1 },
      resolutions: {
        low: { x: 3, y: 3, z: 5 },
        medium: { x: 2, y: 2, z: 3 },
        high: { x: 1, y: 1, z: 1 },
      },
      realTimeStreaming: true,
      maxScanDuration: 1800,
      warmupTime: 0,
      coolingRequired: false,
    };
  }

  isReady(): boolean {
    return this.status.connected && this.status.magnetReady === true;
  }

  async startScan(params: ScanParameters): Promise<void> {
    if (!this.isReady()) {
      throw new Error('Device not ready for scanning');
    }

    if (this.isScanning) {
      throw new Error('Scan already in progress');
    }

    this.isScanning = true;
    this.currentSlice = 0;
    this.totalSlices = this.calculateTotalSlices(params);

    // Start streaming frames
    const frameInterval = (params.duration * 1000) / this.totalSlices;
    
    this.scanInterval = setInterval(() => {
      if (this.currentSlice >= this.totalSlices) {
        this.stopScan();
        return;
      }

      const frame = this.generateMockFrame(params, this.currentSlice);
      this.frameCallbacks.forEach(cb => cb(frame));
      this.currentSlice++;
    }, Math.max(frameInterval, 50)); // Minimum 50ms between frames
  }

  async stopScan(): Promise<void> {
    if (this.scanInterval) {
      clearInterval(this.scanInterval);
      this.scanInterval = null;
    }
    this.isScanning = false;
    this.currentSlice = 0;
  }

  async pauseScan(): Promise<void> {
    if (this.scanInterval) {
      clearInterval(this.scanInterval);
      this.scanInterval = null;
    }
  }

  async resumeScan(): Promise<void> {
    // Resume would restart from current slice
    // Simplified for mock
  }

  onFrame(callback: (frame: MRIFrame) => void): void {
    this.frameCallbacks.add(callback);
  }

  offFrame(callback: (frame: MRIFrame) => void): void {
    this.frameCallbacks.delete(callback);
  }

  onStatusChange(callback: (status: DeviceStatus) => void): void {
    this.statusCallbacks.add(callback);
  }

  onError(callback: (error: Error) => void): void {
    this.errorCallbacks.add(callback);
  }

  // Private methods

  private updateStatus(status: ConnectionStatus): void {
    this.status = {
      ...this.status,
      connected: status === 'connected',
      status,
      timestamp: Date.now(),
    };
    this.notifyStatusChange();
  }

  private notifyStatusChange(): void {
    this.statusCallbacks.forEach(cb => cb(this.status));
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private calculateTotalSlices(params: ScanParameters): number {
    const baseCounts: Record<string, number> = {
      head: 50,
      thorax: 80,
      abdomen: 60,
      pelvis: 40,
      upper_limb: 30,
      lower_limb: 40,
      spine: 70,
      full_body: 150,
    };

    const resolutionMultiplier: Record<string, number> = {
      low: 0.5,
      medium: 1,
      high: 2,
    };

    return Math.round(
      (baseCounts[params.bodyPart] || 50) * 
      (resolutionMultiplier[params.resolution] || 1)
    );
  }

  private generateMockFrame(params: ScanParameters, sliceIndex: number): MRIFrame {
    const dimensions = this.getSliceDimensions(params.bodyPart);
    const dataSize = dimensions.x * dimensions.y;
    const data = new Float32Array(dataSize);

    // Generate simple gradient pattern for visualization
    for (let i = 0; i < dataSize; i++) {
      const x = i % dimensions.x;
      const y = Math.floor(i / dimensions.x);
      const cx = dimensions.x / 2;
      const cy = dimensions.y / 2;
      const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
      const maxDist = Math.sqrt(cx ** 2 + cy ** 2);
      
      // Create elliptical body-like shape with noise
      const normalized = dist / maxDist;
      const bodyShape = normalized < 0.7 ? 1 - normalized / 0.7 : 0;
      const noise = Math.random() * 0.1;
      data[i] = Math.max(0, Math.min(1, bodyShape + noise));
    }

    return {
      id: `frame-${Date.now()}-${sliceIndex}`,
      timestamp: Date.now(),
      sequenceType: params.sequenceType,
      dimensions: { ...dimensions, z: 1 },
      voxelSize: this.getVoxelSize(params.resolution),
      data,
      metadata: {
        fieldStrength: 64, // mT
        acquisitionTime: 100,
        snr: 25 + Math.random() * 10,
        deviceId: this.config?.deviceId || 'mock-device-001',
        deviceType: 'mock',
        patientPosition: 'supine',
        sliceLocation: sliceIndex,
        echoTime: params.sequenceType === 'T2' ? 90 : 10,
        repetitionTime: params.sequenceType === 'T1' ? 500 : 3000,
      },
      sliceIndex,
      totalSlices: this.totalSlices,
    };
  }

  private getSliceDimensions(bodyPart: string): { x: number; y: number } {
    const dimensions: Record<string, { x: number; y: number }> = {
      head: { x: 256, y: 256 },
      thorax: { x: 320, y: 320 },
      abdomen: { x: 320, y: 320 },
      pelvis: { x: 256, y: 256 },
      upper_limb: { x: 192, y: 192 },
      lower_limb: { x: 192, y: 192 },
      spine: { x: 256, y: 128 },
      full_body: { x: 256, y: 512 },
    };
    return dimensions[bodyPart] || { x: 256, y: 256 };
  }

  private getVoxelSize(resolution: string): { x: number; y: number; z: number } {
    const sizes: Record<string, { x: number; y: number; z: number }> = {
      low: { x: 3, y: 3, z: 5 },
      medium: { x: 2, y: 2, z: 3 },
      high: { x: 1, y: 1, z: 1 },
    };
    return sizes[resolution] || sizes.medium;
  }
}
