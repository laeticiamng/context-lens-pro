// MRI Driver Registry & Factory
// CLP-LUNETTES-IRM-2026-001

import type {
  MRIDeviceDriver,
  MRIDeviceType,
  DeviceConfig,
  DiscoveredDevice,
} from './types/mri-driver.types';
import { MockMRIDriver } from './mock/mock-driver';
import { ChipironDriver } from './chipiron/chipiron-driver';
import { KyotoOPMDriver } from './kyoto-opm/kyoto-opm-driver';

// Driver constructor type
type DriverConstructor = new () => MRIDeviceDriver;

/**
 * MRIDriverRegistry - Central registry for all MRI device drivers
 * 
 * Provides:
 * - Dynamic driver registration
 * - Factory pattern for driver instantiation
 * - Network discovery for compatible devices
 * - Singleton instance management
 */
class MRIDriverRegistryClass {
  private drivers: Map<MRIDeviceType, DriverConstructor> = new Map();
  private instances: Map<string, MRIDeviceDriver> = new Map();

  constructor() {
    // Register built-in drivers
    this.registerBuiltInDrivers();
  }

  private registerBuiltInDrivers(): void {
    this.register('mock', MockMRIDriver);
    this.register('chipiron_squid', ChipironDriver);
    this.register('kyoto_opm', KyotoOPMDriver);
    // Future: this.register('hyperfine', HyperfineDriver);
  }

  /**
   * Register a new driver type
   */
  register(type: MRIDeviceType, driverClass: DriverConstructor): void {
    this.drivers.set(type, driverClass);
    console.log(`[MRIDriverRegistry] Registered driver: ${type}`);
  }

  /**
   * Unregister a driver type
   */
  unregister(type: MRIDeviceType): void {
    this.drivers.delete(type);
  }

  /**
   * Get list of registered driver types
   */
  getRegisteredTypes(): MRIDeviceType[] {
    return Array.from(this.drivers.keys());
  }

  /**
   * Check if a driver type is registered
   */
  isRegistered(type: MRIDeviceType): boolean {
    return this.drivers.has(type);
  }

  /**
   * Create a new driver instance
   */
  async createDriver(config: DeviceConfig): Promise<MRIDeviceDriver> {
    const DriverClass = this.drivers.get(config.deviceType);
    
    if (!DriverClass) {
      throw new Error(`No driver registered for device type: ${config.deviceType}`);
    }

    // Check if instance already exists
    const existingInstance = this.instances.get(config.deviceId);
    if (existingInstance) {
      console.log(`[MRIDriverRegistry] Returning existing instance for: ${config.deviceId}`);
      return existingInstance;
    }

    // Create new instance
    const driver = new DriverClass();
    this.instances.set(config.deviceId, driver);
    
    console.log(`[MRIDriverRegistry] Created new driver instance: ${config.deviceType} (${config.deviceId})`);
    
    return driver;
  }

  /**
   * Get an existing driver instance
   */
  getInstance(deviceId: string): MRIDeviceDriver | undefined {
    return this.instances.get(deviceId);
  }

  /**
   * Remove a driver instance
   */
  async removeInstance(deviceId: string): Promise<void> {
    const instance = this.instances.get(deviceId);
    if (instance) {
      await instance.disconnect();
      this.instances.delete(deviceId);
      console.log(`[MRIDriverRegistry] Removed driver instance: ${deviceId}`);
    }
  }

  /**
   * Discover devices on the local network
   * Uses mDNS/Bonjour for device discovery
   */
  async discoverDevices(): Promise<DiscoveredDevice[]> {
    const discovered: DiscoveredDevice[] = [];

    // Scan for Chipiron devices
    const chipironDevices = await this.scanForChipiron();
    discovered.push(...chipironDevices);

    // Future: Scan for other manufacturers
    // const hyperfineDevices = await this.scanForHyperfine();
    // discovered.push(...hyperfineDevices);

    return discovered;
  }

  /**
   * Scan for Chipiron devices on the network
   */
  private async scanForChipiron(): Promise<DiscoveredDevice[]> {
    // In production, this would use mDNS to discover Chipiron devices
    // For now, return empty array (no simulation in discovery)
    
    console.log('[MRIDriverRegistry] Scanning for Chipiron devices...');
    
    // Simulated delay for network scan
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In production:
    // return await mdnsDiscovery.query('_chipiron-mri._tcp.local');
    
    return [];
  }

  /**
   * Create a mock device for testing
   */
  async createMockDevice(deviceId?: string): Promise<{
    driver: MRIDeviceDriver;
    config: DeviceConfig;
  }> {
    const config: DeviceConfig = {
      deviceId: deviceId || `mock-${Date.now()}`,
      deviceType: 'mock',
      ipAddress: '127.0.0.1',
      port: 8080,
    };

    const driver = await this.createDriver(config);
    await driver.connect(config);

    return { driver, config };
  }

  /**
   * Get all active driver instances
   */
  getActiveInstances(): Map<string, MRIDeviceDriver> {
    return new Map(this.instances);
  }

  /**
   * Disconnect all active drivers
   */
  async disconnectAll(): Promise<void> {
    const disconnectPromises = Array.from(this.instances.entries()).map(
      async ([deviceId, driver]) => {
        try {
          await driver.disconnect();
          console.log(`[MRIDriverRegistry] Disconnected: ${deviceId}`);
        } catch (error) {
          console.error(`[MRIDriverRegistry] Error disconnecting ${deviceId}:`, error);
        }
      }
    );

    await Promise.all(disconnectPromises);
    this.instances.clear();
  }
}

// Singleton instance
export const MRIDriverRegistry = new MRIDriverRegistryClass();

// Export for direct imports
export { MRIDriverRegistryClass };
