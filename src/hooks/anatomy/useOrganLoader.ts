import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { anatomyApi, type AnatomicalStructure, type BodyZone } from '@/services/emotionscare/anatomyApi';
import { ZONE_ORGANS } from './useGazeZone';

export interface LoadedOrgan {
  structure: AnatomicalStructure;
  meshUrl: string;
  isLoading: boolean;
  loadedAt: number;
}

export interface UseOrganLoaderResult {
  loadedOrgans: LoadedOrgan[];
  isLoading: boolean;
  loadZone: (zone: BodyZone, lod?: 'high' | 'medium' | 'low') => Promise<void>;
  unloadZone: (zone: BodyZone) => void;
  preloadZone: (zone: BodyZone) => Promise<void>;
  getOrgan: (code: string) => LoadedOrgan | undefined;
}

// Time before unloading unused organs (30 seconds)
const UNLOAD_DELAY = 30000;

export function useOrganLoader(patientId: string | null): UseOrganLoaderResult {
  const [isLoading, setIsLoading] = useState(false);
  const [structures, setStructures] = useState<AnatomicalStructure[]>([]);
  const [loadedOrgansMap, setLoadedOrgansMap] = useState<Map<string, LoadedOrgan>>(new Map());
  
  const unloadTimersRef = useRef<Map<string, NodeJS.Timeout>>(new Map());
  const loadedZonesRef = useRef<Set<BodyZone>>(new Set());
  const isMountedRef = useRef(true);

  // Fetch all structures on mount
  useEffect(() => {
    isMountedRef.current = true;
    
    if (!patientId) return;

    async function fetchStructures() {
      try {
        console.log('[OrganLoader] Fetching structures for patient:', patientId);
        const data = await anatomyApi.getStructures(patientId!);
        if (isMountedRef.current) {
          setStructures(data);
          console.log('[OrganLoader] Loaded', data.length, 'structures');
        }
      } catch (err) {
        console.error('[OrganLoader] Failed to fetch structures:', err);
        // Continue with empty structures array - mock data will be used
      }
    }

    fetchStructures();
    
    return () => {
      isMountedRef.current = false;
    };
  }, [patientId]);

  // Load organs for a zone
  const loadZone = useCallback(async (zone: BodyZone, lod: 'high' | 'medium' | 'low' = 'medium') => {
    if (!patientId || loadedZonesRef.current.has(zone)) return;

    setIsLoading(true);
    loadedZonesRef.current.add(zone);

    const organCodes = ZONE_ORGANS[zone] || [];
    
    for (const code of organCodes) {
      // Skip if already loaded
      if (loadedOrgansMap.has(code)) continue;

      // Find structure
      const structure = structures.find(s => s.structure_code === code);
      if (!structure) continue;

      // Mark as loading
      setLoadedOrgansMap(prev => {
        const newMap = new Map(prev);
        newMap.set(code, {
          structure,
          meshUrl: '',
          isLoading: true,
          loadedAt: Date.now(),
        });
        return newMap;
      });

      try {
        // Fetch mesh URL
        const meshUrl = await anatomyApi.getMeshUrl(patientId, code, lod);
        
        if (isMountedRef.current) {
          setLoadedOrgansMap(prev => {
            const newMap = new Map(prev);
            newMap.set(code, {
              structure,
              meshUrl,
              isLoading: false,
              loadedAt: Date.now(),
            });
            return newMap;
          });
        }

        console.log(`[OrganLoader] Loaded ${code} for zone ${zone}`);
      } catch (err) {
        console.error(`[OrganLoader] Failed to load ${code}:`, err);
        if (isMountedRef.current) {
          setLoadedOrgansMap(prev => {
            const newMap = new Map(prev);
            newMap.delete(code);
            return newMap;
          });
        }
      }
    }

    if (isMountedRef.current) {
      setIsLoading(false);
    }
  }, [patientId, structures, loadedOrgansMap]);

  // Preload organs for a zone (low LOD)
  const preloadZone = useCallback(async (zone: BodyZone) => {
    if (!patientId) return;

    const organCodes = ZONE_ORGANS[zone] || [];
    
    for (const code of organCodes) {
      // Skip if already loaded
      if (loadedOrgansMap.has(code)) continue;

      const structure = structures.find(s => s.structure_code === code);
      if (!structure) continue;

      try {
        // Preload with low LOD
        const meshUrl = await anatomyApi.getMeshUrl(patientId, code, 'low');
        
        if (isMountedRef.current) {
          setLoadedOrgansMap(prev => {
            const newMap = new Map(prev);
            newMap.set(code, {
              structure,
              meshUrl,
              isLoading: false,
              loadedAt: Date.now(),
            });
            return newMap;
          });
        }

        console.log(`[OrganLoader] Preloaded ${code} for zone ${zone}`);
      } catch (err) {
        console.error(`[OrganLoader] Failed to preload ${code}:`, err);
      }
    }
  }, [patientId, structures, loadedOrgansMap]);

  // Unload organs for a zone
  const unloadZone = useCallback((zone: BodyZone) => {
    const organCodes = ZONE_ORGANS[zone] || [];
    
    for (const code of organCodes) {
      // Clear any pending unload timer
      const existingTimer = unloadTimersRef.current.get(code);
      if (existingTimer) {
        clearTimeout(existingTimer);
      }

      // Set delayed unload
      const timer = setTimeout(() => {
        if (isMountedRef.current) {
          setLoadedOrgansMap(prev => {
            const newMap = new Map(prev);
            newMap.delete(code);
            return newMap;
          });
        }
        unloadTimersRef.current.delete(code);
        console.log(`[OrganLoader] Unloaded ${code}`);
      }, UNLOAD_DELAY);

      unloadTimersRef.current.set(code, timer);
    }

    loadedZonesRef.current.delete(zone);
  }, []);

  // Get specific organ
  const getOrgan = useCallback((code: string): LoadedOrgan | undefined => {
    return loadedOrgansMap.get(code);
  }, [loadedOrgansMap]);

  // Convert Map to array for return - memoized to prevent infinite loops
  const loadedOrgansArray = useMemo(() => {
    return Array.from(loadedOrgansMap.values());
  }, [loadedOrgansMap]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      unloadTimersRef.current.forEach(timer => clearTimeout(timer));
      unloadTimersRef.current.clear();
    };
  }, []);

  return {
    loadedOrgans: loadedOrgansArray,
    isLoading,
    loadZone,
    unloadZone,
    preloadZone,
    getOrgan,
  };
}
