import { useState, useEffect, useCallback, useRef } from 'react';
import { useAnatomyStore } from '@/stores/anatomyStore';
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
  
  const store = useAnatomyStore();
  const unloadTimersRef = useRef<Map<string, NodeJS.Timeout>>(new Map());
  const loadedZonesRef = useRef<Set<BodyZone>>(new Set());

  // Fetch all structures on mount
  useEffect(() => {
    if (!patientId) return;

    async function fetchStructures() {
      try {
        const data = await anatomyApi.getStructures(patientId!);
        setStructures(data);
      } catch (err) {
        console.error('[OrganLoader] Failed to fetch structures:', err);
      }
    }

    fetchStructures();
  }, [patientId]);

  // Load organs for a zone
  const loadZone = useCallback(async (zone: BodyZone, lod: 'high' | 'medium' | 'low' = 'medium') => {
    if (!patientId || loadedZonesRef.current.has(zone)) return;

    setIsLoading(true);
    loadedZonesRef.current.add(zone);

    const organCodes = ZONE_ORGANS[zone];
    
    for (const code of organCodes) {
      // Skip if already loaded
      if (store.loadedOrgans.has(code)) continue;

      // Find structure
      const structure = structures.find(s => s.structure_code === code);
      if (!structure) continue;

      // Mark as loading
      store.addLoadedOrgan(code, {
        structure,
        meshUrl: '',
        isLoading: true,
        loadedAt: Date.now(),
      });

      try {
        // Fetch mesh URL
        const meshUrl = await anatomyApi.getMeshUrl(patientId, code, lod);
        
        store.addLoadedOrgan(code, {
          structure,
          meshUrl,
          isLoading: false,
          loadedAt: Date.now(),
        });

        console.log(`[OrganLoader] Loaded ${code} for zone ${zone}`);
      } catch (err) {
        console.error(`[OrganLoader] Failed to load ${code}:`, err);
        store.removeLoadedOrgan(code);
      }
    }

    setIsLoading(false);
  }, [patientId, structures, store]);

  // Preload organs for a zone (low LOD)
  const preloadZone = useCallback(async (zone: BodyZone) => {
    if (!patientId) return;

    const organCodes = ZONE_ORGANS[zone];
    
    for (const code of organCodes) {
      // Skip if already loaded
      if (store.loadedOrgans.has(code)) continue;

      const structure = structures.find(s => s.structure_code === code);
      if (!structure) continue;

      try {
        // Preload with low LOD
        const meshUrl = await anatomyApi.getMeshUrl(patientId, code, 'low');
        
        store.addLoadedOrgan(code, {
          structure,
          meshUrl,
          isLoading: false,
          loadedAt: Date.now(),
        });

        console.log(`[OrganLoader] Preloaded ${code} for zone ${zone}`);
      } catch (err) {
        console.error(`[OrganLoader] Failed to preload ${code}:`, err);
      }
    }
  }, [patientId, structures, store]);

  // Unload organs for a zone
  const unloadZone = useCallback((zone: BodyZone) => {
    const organCodes = ZONE_ORGANS[zone];
    
    for (const code of organCodes) {
      // Clear any pending unload timer
      const existingTimer = unloadTimersRef.current.get(code);
      if (existingTimer) {
        clearTimeout(existingTimer);
      }

      // Set delayed unload
      const timer = setTimeout(() => {
        store.removeLoadedOrgan(code);
        unloadTimersRef.current.delete(code);
        console.log(`[OrganLoader] Unloaded ${code}`);
      }, UNLOAD_DELAY);

      unloadTimersRef.current.set(code, timer);
    }

    loadedZonesRef.current.delete(zone);
  }, [store]);

  // Get specific organ
  const getOrgan = useCallback((code: string): LoadedOrgan | undefined => {
    return store.loadedOrgans.get(code);
  }, [store.loadedOrgans]);

  // Convert Map to array for return
  const loadedOrgansArray = Array.from(store.loadedOrgans.values());

  // Cleanup on unmount
  useEffect(() => {
    return () => {
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
