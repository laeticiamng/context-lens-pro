// Chipiron SQUID MRI Driver
// CLP-LUNETTES-IRM-2026-001
// Driver for Chipiron ultra-low field SQUID MRI systems

import type {
  MRIDeviceDriver,
  DeviceConfig,
  DeviceStatus,
  DeviceCapabilities,
  ScanParameters,
  MRIFrame,
  ConnectionStatus,
} from '../types/mri-driver.types';

// Chipiron-specific types
interface ChipironCryostatStatus {
  temperature: number; // Kelvin
  pressure: number; // mbar
  heliumLevel: number; // percentage
  status: 'normal' | 'warning' | 'critical';
}

interface ChipironDeviceInfo {
  serialNumber: string;
  firmwareVersion: string;
  lastCalibration: string;
  operatingHours: number;
}

/**
 * ChipironDriver - Implementation for Chipiron SQUID-based ultra-low field MRI
 * 
 * Note: This is a reference implementation. Actual SDK integration requires
 * the Chipiron SDK which is obtained through partnership agreement.
 */
export class ChipironDriver implements MRIDeviceDriver {
  private config: DeviceConfig | null = null;
  private status: DeviceStatus;
  private cryostatStatus: ChipironCryostatStatus | null = null;
  private isScanning = false;
  private frameCallbacks: Set<(frame: MRIFrame) => void> = new Set();
  private statusCallbacks: Set<(status: DeviceStatus) => void> = new Set();
  private errorCallbacks: Set<(error: Error) => void> = new Set();
  private wsConnection: WebSocket | null = null;

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

    try {
      // In production, this would connect to the Chipiron SDK
      // For now, we simulate the connection
      
      // Step 1: Establish WebSocket connection
      await this.establishConnection(config);

      // Step 2: Check cryostat status
      await this.checkCryostatStatus();

      // Step 3: Verify magnet ready
      await this.verifyMagnetReady();

      this.status = {
        connected: true,
        status: 'connected',
        deviceInfo: this.getCapabilities(),
        temperature: this.cryostatStatus?.temperature,
        magnetReady: true,
        lastHeartbeat: Date.now(),
        timestamp: Date.now(),
      };

      this.notifyStatusChange();
      return this.status;

    } catch (error) {
      this.updateStatus('error');
      this.status.errorMessage = error instanceof Error ? error.message : 'Connection failed';
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (this.isScanning) {
      await this.stopScan();
    }
    
    if (this.wsConnection) {
      this.wsConnection.close();
      this.wsConnection = null;
    }

    this.updateStatus('disconnected');
    this.config = null;
  }

  getStatus(): DeviceStatus {
    return { ...this.status };
  }

  getCapabilities(): DeviceCapabilities {
    return {
      deviceId: this.config?.deviceId || 'chipiron-001',
      deviceType: 'chipiron_squid',
      manufacturer: 'Chipiron',
      model: 'SQUID ULF-MRI',
      fieldStrength: { min: 5, max: 50 }, // Ultra-low field in mT
      supportedSequences: ['T1', 'T2', 'PD'],
      supportedBodyParts: ['head', 'thorax', 'abdomen', 'pelvis', 'upper_limb', 'lower_limb'],
      maxResolution: { x: 2, y: 2, z: 3 },
      resolutions: {
        low: { x: 4, y: 4, z: 6 },
        medium: { x: 3, y: 3, z: 4 },
        high: { x: 2, y: 2, z: 3 },
      },
      realTimeStreaming: true,
      maxScanDuration: 1200, // 20 minutes
      warmupTime: 300, // 5 minutes for SQUID cooling
      coolingRequired: true,
    };
  }

  isReady(): boolean {
    return (
      this.status.connected &&
      this.status.magnetReady === true &&
      this.cryostatStatus?.status === 'normal'
    );
  }

  async startScan(params: ScanParameters): Promise<void> {
    if (!this.isReady()) {
      throw new Error('Chipiron device not ready. Check cryostat status.');
    }

    if (this.isScanning) {
      throw new Error('Scan already in progress');
    }

    // Validate parameters against device capabilities
    this.validateScanParameters(params);

    this.isScanning = true;

    // In production: Send scan command to Chipiron SDK
    // this.sdk.startAcquisition(this.convertToChipironParams(params));

    console.log('[Chipiron] Starting scan with params:', params);
  }

  async stopScan(): Promise<void> {
    // In production: this.sdk.stopAcquisition();
    this.isScanning = false;
    console.log('[Chipiron] Scan stopped');
  }

  async pauseScan(): Promise<void> {
    // In production: this.sdk.pauseAcquisition();
    console.log('[Chipiron] Scan paused');
  }

  async resumeScan(): Promise<void> {
    // In production: this.sdk.resumeAcquisition();
    console.log('[Chipiron] Scan resumed');
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

  // Chipiron-specific methods

  async getCryostatStatus(): Promise<ChipironCryostatStatus | null> {
    return this.cryostatStatus;
  }

  async requestMaintenance(): Promise<void> {
    // In production: Contact Chipiron maintenance API
    console.log('[Chipiron] Maintenance request submitted');
  }

  // Private methods

  private async establishConnection(config: DeviceConfig): Promise<void> {
    // Simulate connection establishment
    await this.delay(1000);
    
    // In production:
    // this.wsConnection = new WebSocket(`ws://${config.ipAddress}:${config.port || 8080}`);
    // await this.waitForConnection();
  }

  private async checkCryostatStatus(): Promise<void> {
    // Simulate cryostat check
    await this.delay(500);
    
    this.cryostatStatus = {
      temperature: 4.2, // Liquid helium temperature
      pressure: 1013,
      heliumLevel: 85,
      status: 'normal',
    };

    if (this.cryostatStatus.temperature > 4.5) {
      throw new Error(`Cryostat temperature too high: ${this.cryostatStatus.temperature}K`);
    }
  }

  private async verifyMagnetReady(): Promise<void> {
    // Simulate magnet verification
    await this.delay(300);
    
    // In production: Check SQUID sensor status
  }

  private validateScanParameters(params: ScanParameters): void {
    const caps = this.getCapabilities();

    if (!caps.supportedSequences.includes(params.sequenceType)) {
      throw new Error(`Sequence type ${params.sequenceType} not supported by Chipiron`);
    }

    if (!caps.supportedBodyParts.includes(params.bodyPart)) {
      throw new Error(`Body part ${params.bodyPart} not supported by Chipiron`);
    }

    if (params.duration > caps.maxScanDuration) {
      throw new Error(`Scan duration exceeds maximum of ${caps.maxScanDuration} seconds`);
    }
  }

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
}
