import { useState, useEffect, useCallback } from 'react';
import { useARStore } from '@/stores/arStore';

// WebXR types - using native browser types
type XRSessionMode = 'inline' | 'immersive-vr' | 'immersive-ar';


export function useARSession() {
  const [isLoading, setIsLoadingLocal] = useState(false);
  
  const { 
    isARActive, 
    deviceType,
    setARActive, 
    setLoading, 
    setDeviceType,
    resetSession
  } = useARStore();

  // Detect device type
  const detectDevice = useCallback(async () => {
    // Check for WebXR support
    if (navigator.xr) {
      try {
        const isVRSupported = await navigator.xr.isSessionSupported('immersive-vr');
        const isARSupported = await navigator.xr.isSessionSupported('immersive-ar');
        
        if (isARSupported || isVRSupported) {
          // Check user agent for specific devices
          const ua = navigator.userAgent.toLowerCase();
          if (ua.includes('quest')) {
            setDeviceType('quest');
          } else if (ua.includes('hololens')) {
            setDeviceType('hololens');
          } else {
            setDeviceType('smartphone');
          }
          return true;
        }
      } catch (e) {
        console.log('WebXR not fully supported:', e);
      }
    }
    
    // Fallback to desktop emulator
    setDeviceType('desktop');
    return false;
  }, [setDeviceType]);

  // Start AR session
  const startSession = useCallback(async () => {
    setIsLoadingLocal(true);
    setLoading(true);
    
    try {
      await detectDevice();
      
      // Simulate session startup delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setARActive(true);
      console.log('AR Session started');
    } catch (error) {
      console.error('Failed to start AR session:', error);
    } finally {
      setIsLoadingLocal(false);
      setLoading(false);
    }
  }, [detectDevice, setARActive, setLoading]);

  // End AR session
  const endSession = useCallback(async () => {
    setIsLoadingLocal(true);
    setLoading(true);
    
    try {
      // Cleanup
      resetSession();
      console.log('AR Session ended');
    } catch (error) {
      console.error('Failed to end AR session:', error);
    } finally {
      setIsLoadingLocal(false);
      setLoading(false);
    }
  }, [resetSession, setLoading]);

  // Check WebXR support on mount
  useEffect(() => {
    detectDevice();
  }, [detectDevice]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isARActive) {
        resetSession();
      }
    };
  }, [isARActive, resetSession]);

  return {
    isARActive,
    isLoading,
    deviceType,
    startSession,
    endSession,
    isWebXRSupported: !!navigator.xr
  };
}
