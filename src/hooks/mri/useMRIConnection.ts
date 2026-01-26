// MRI Connection Hook
// CLP-LUNETTES-IRM-2026-001

import { useState, useCallback, useEffect, useRef } from 'react';
import {
  MRIDriverRegistry,
  type MRIDeviceDriver,
  type DeviceConfig,
  type DeviceStatus,
  type DiscoveredDevice,
} from '@/drivers';

export interface UseMRIConnectionResult {
  // State
  driver: MRIDeviceDriver | null;
  status: DeviceStatus | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  discoveredDevices: DiscoveredDevice[];
  
  // Actions
  connect: (config: DeviceConfig) => Promise<void>;
  disconnect: () => Promise<void>;
  discoverDevices: () => Promise<void>;
  createMockDevice: () => Promise<void>;
  
  // Discovery state
  isDiscovering: boolean;
}

export function useMRIConnection(): UseMRIConnectionResult {
  const [driver, setDriver] = useState<MRIDeviceDriver | null>(null);
  const [status, setStatus] = useState<DeviceStatus | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [discoveredDevices, setDiscoveredDevices] = useState<DiscoveredDevice[]>([]);
  const [isDiscovering, setIsDiscovering] = useState(false);
  
  const statusCallbackRef = useRef<((status: DeviceStatus) => void) | null>(null);

  // Status change handler
  useEffect(() => {
    if (driver) {
      const handleStatus = (newStatus: DeviceStatus) => {
        setStatus(newStatus);
        if (newStatus.status === 'error') {
          setError(newStatus.errorMessage || 'Connection error');
        }
      };
      
      statusCallbackRef.current = handleStatus;
      driver.onStatusChange(handleStatus);
      
      return () => {
        if (statusCallbackRef.current) {
          // Note: In a real implementation, we'd call driver.offStatusChange
        }
      };
    }
  }, [driver]);

  const connect = useCallback(async (config: DeviceConfig) => {
    setIsConnecting(true);
    setError(null);

    try {
      const newDriver = await MRIDriverRegistry.createDriver(config);
      const connectionStatus = await newDriver.connect(config);
      
      setDriver(newDriver);
      setStatus(connectionStatus);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to connect';
      setError(message);
      throw err;
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnect = useCallback(async () => {
    if (driver) {
      try {
        await driver.disconnect();
        setDriver(null);
        setStatus(null);
        setError(null);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to disconnect';
        setError(message);
      }
    }
  }, [driver]);

  const discoverDevices = useCallback(async () => {
    setIsDiscovering(true);
    try {
      const devices = await MRIDriverRegistry.discoverDevices();
      setDiscoveredDevices(devices);
    } catch (err) {
      console.error('Device discovery failed:', err);
    } finally {
      setIsDiscovering(false);
    }
  }, []);

  const createMockDevice = useCallback(async () => {
    setIsConnecting(true);
    setError(null);

    try {
      const { driver: mockDriver, config } = await MRIDriverRegistry.createMockDevice();
      setDriver(mockDriver);
      setStatus(mockDriver.getStatus());
      console.log('[useMRIConnection] Mock device created:', config.deviceId);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create mock device';
      setError(message);
    } finally {
      setIsConnecting(false);
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (driver) {
        driver.disconnect().catch(console.error);
      }
    };
  }, [driver]);

  return {
    driver,
    status,
    isConnected: status?.connected ?? false,
    isConnecting,
    error,
    discoveredDevices,
    connect,
    disconnect,
    discoverDevices,
    createMockDevice,
    isDiscovering,
  };
}
