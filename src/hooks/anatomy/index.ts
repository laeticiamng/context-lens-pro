// Anatomy AR Hooks
export { useBodyTracking, POSE_LANDMARKS, getBodyRegion } from './useBodyTracking';
export type { BodyLandmark, UseBodyTrackingResult } from './useBodyTracking';

export { useGazeZone, ZONE_ORGANS } from './useGazeZone';
export type { UseGazeZoneResult } from './useGazeZone';

export { useRegistration } from './useRegistration';
export type { UseRegistrationResult } from './useRegistration';

export { useOrganLoader } from './useOrganLoader';
export type { LoadedOrgan, UseOrganLoaderResult } from './useOrganLoader';

export { useAnatomyVoiceCommands } from './useAnatomyVoiceCommands';
export type { AnatomyVoiceCommand, UseAnatomyVoiceCommandsResult } from './useAnatomyVoiceCommands';
