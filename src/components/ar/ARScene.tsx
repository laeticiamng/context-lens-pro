import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera, Stats } from '@react-three/drei';
import { BrainModel } from './brain/BrainModel';
import { EmotionOverlay } from './brain/EmotionOverlay';
import { useARStore } from '@/stores/arStore';

interface ARSceneProps {
  debug?: boolean;
}

function LoadingIndicator3D() {
  return (
    <mesh position={[0, 1.5, -2]}>
      <sphereGeometry args={[0.3, 16, 16]} />
      <meshBasicMaterial color="#6366f1" wireframe />
    </mesh>
  );
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight 
        position={[5, 5, 5]} 
        intensity={1} 
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <directionalLight 
        position={[-5, 3, -5]} 
        intensity={0.5} 
        color="#a0a0ff"
      />
      <pointLight position={[0, 2, 0]} intensity={0.5} color="#ff8080" />
    </>
  );
}

export function ARScene({ debug = false }: ARSceneProps) {
  const { showOverlay, deviceType } = useARStore();

  return (
    <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <Canvas
        shadows
        gl={{ 
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance'
        }}
        dpr={[1, 2]}
      >
        {/* Camera */}
        <PerspectiveCamera 
          makeDefault 
          position={[0, 1.5, 1]} 
          fov={75}
        />

        {/* Environment */}
        <Environment preset="night" />
        <fog attach="fog" args={['#0a0a1a', 3, 10]} />

        {/* Lights */}
        <Lights />

        {/* Main content */}
        <Suspense fallback={<LoadingIndicator3D />}>
          {/* Brain model */}
          <BrainModel position={[0, 1.5, -2]} />
          
          {/* Emotion overlay */}
          {showOverlay && (
            <EmotionOverlay brainPosition={[0, 1.5, -2]} />
          )}
        </Suspense>

        {/* Controls - only for desktop/debug */}
        {deviceType === 'desktop' && (
          <OrbitControls
            target={[0, 1.5, -2]}
            minDistance={0.5}
            maxDistance={5}
            enablePan={false}
            enableDamping
            dampingFactor={0.05}
          />
        )}

        {/* Debug stats */}
        {debug && <Stats />}
      </Canvas>

      {/* AR environment overlay effect */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Vignette effect */}
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/40" />
        
        {/* Scan lines effect (optional, for AR aesthetic) */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)'
          }}
        />
      </div>
    </div>
  );
}
