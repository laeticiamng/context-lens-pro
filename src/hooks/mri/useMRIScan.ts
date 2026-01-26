// MRI Scan Hook
// CLP-LUNETTES-IRM-2026-001

import { useState, useCallback, useEffect, useRef } from 'react';
import type {
  MRIDeviceDriver,
  ScanParameters,
  MRIFrame,
  ScanSession,
} from '@/drivers';

export interface UseMRIScanResult {
  // State
  session: ScanSession | null;
  currentFrame: MRIFrame | null;
  frames: MRIFrame[];
  progress: number;
  isScanning: boolean;
  isPaused: boolean;
  error: string | null;
  
  // Actions
  startScan: (params: ScanParameters, patientReference: string, protocolId: string) => Promise<void>;
  stopScan: () => Promise<void>;
  pauseScan: () => Promise<void>;
  resumeScan: () => Promise<void>;
  clearFrames: () => void;
}

export function useMRIScan(driver: MRIDeviceDriver | null): UseMRIScanResult {
  const [session, setSession] = useState<ScanSession | null>(null);
  const [currentFrame, setCurrentFrame] = useState<MRIFrame | null>(null);
  const [frames, setFrames] = useState<MRIFrame[]>([]);
  const [progress, setProgress] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const frameCallbackRef = useRef<((frame: MRIFrame) => void) | null>(null);

  // Frame handler
  useEffect(() => {
    if (driver && isScanning) {
      const handleFrame = (frame: MRIFrame) => {
        setCurrentFrame(frame);
        setFrames(prev => [...prev, frame]);
        setProgress((frame.sliceIndex / frame.totalSlices) * 100);

        // Update session
        setSession(prev => prev ? {
          ...prev,
          framesReceived: frame.sliceIndex + 1,
          totalFramesExpected: frame.totalSlices,
        } : null);

        // Check if scan is complete
        if (frame.sliceIndex >= frame.totalSlices - 1) {
          setIsScanning(false);
          setSession(prev => prev ? {
            ...prev,
            status: 'completed',
            completedAt: Date.now(),
          } : null);
        }
      };

      frameCallbackRef.current = handleFrame;
      driver.onFrame(handleFrame);

      return () => {
        if (frameCallbackRef.current) {
          driver.offFrame(frameCallbackRef.current);
        }
      };
    }
  }, [driver, isScanning]);

  const startScan = useCallback(async (
    params: ScanParameters,
    patientReference: string,
    protocolId: string
  ) => {
    if (!driver) {
      setError('No device connected');
      return;
    }

    if (!driver.isReady()) {
      setError('Device not ready');
      return;
    }

    setError(null);
    setFrames([]);
    setProgress(0);
    setCurrentFrame(null);

    const newSession: ScanSession = {
      id: `scan-${Date.now()}`,
      deviceId: driver.getStatus().deviceInfo?.deviceId || 'unknown',
      patientReference,
      protocolId,
      parameters: params,
      status: 'in_progress',
      startedAt: Date.now(),
      framesReceived: 0,
      totalFramesExpected: 0,
    };

    setSession(newSession);
    setIsScanning(true);

    try {
      await driver.startScan(params);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to start scan';
      setError(message);
      setIsScanning(false);
      setSession(prev => prev ? { ...prev, status: 'failed', errorMessage: message } : null);
    }
  }, [driver]);

  const stopScan = useCallback(async () => {
    if (!driver || !isScanning) return;

    try {
      await driver.stopScan();
      setIsScanning(false);
      setIsPaused(false);
      setSession(prev => prev ? {
        ...prev,
        status: 'cancelled',
        completedAt: Date.now(),
      } : null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to stop scan';
      setError(message);
    }
  }, [driver, isScanning]);

  const pauseScan = useCallback(async () => {
    if (!driver || !isScanning || isPaused) return;

    try {
      await driver.pauseScan();
      setIsPaused(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to pause scan';
      setError(message);
    }
  }, [driver, isScanning, isPaused]);

  const resumeScan = useCallback(async () => {
    if (!driver || !isScanning || !isPaused) return;

    try {
      await driver.resumeScan();
      setIsPaused(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to resume scan';
      setError(message);
    }
  }, [driver, isScanning, isPaused]);

  const clearFrames = useCallback(() => {
    setFrames([]);
    setCurrentFrame(null);
    setProgress(0);
  }, []);

  return {
    session,
    currentFrame,
    frames,
    progress,
    isScanning,
    isPaused,
    error,
    startScan,
    stopScan,
    pauseScan,
    resumeScan,
    clearFrames,
  };
}
