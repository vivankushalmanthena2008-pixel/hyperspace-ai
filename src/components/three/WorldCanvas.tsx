import { Suspense, useRef, useEffect, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { CityScene } from '@/components/three/CityScene';
import { Eye, Pause, Play, Compass, Layers, Sparkles } from 'lucide-react';
import { audioService } from '@/services/audioService';

interface WorldCanvasProps {
  reducedMotion: boolean;
  isMobile: boolean;
  scrollProgress: number;
}

type CameraPreset = 'isometric' | 'skyline' | 'topdown';

function CameraController({
  preset,
  isRotating,
  reducedMotion,
}: {
  preset: CameraPreset;
  isRotating: boolean;
  reducedMotion: boolean;
}) {
  const controlsRef = useRef<React.ElementRef<typeof OrbitControls>>(null);
  const { camera } = useThree();

  useEffect(() => {
    if (!controlsRef.current) return;

    if (preset === 'isometric') {
      camera.position.set(4.6, 2.8, 5.2);
      controlsRef.current.target.set(0, -0.2, 0);
    } else if (preset === 'skyline') {
      camera.position.set(0, 0.2, 5.0);
      controlsRef.current.target.set(0, 0.1, 0);
    } else if (preset === 'topdown') {
      camera.position.set(0, 7.2, 0.8);
      controlsRef.current.target.set(0, 0, 0);
    }
    controlsRef.current.update();
  }, [preset, camera]);

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.06}
      autoRotate={isRotating && !reducedMotion}
      autoRotateSpeed={0.8}
      minDistance={3.8}
      maxDistance={12.0}
      maxPolarAngle={Math.PI / 1.85}
      minPolarAngle={Math.PI / 8}
      enablePan={false}
    />
  );
}

function WorldLighting() {
  return (
    <>
      <hemisphereLight args={['#67e8f9', '#090d16', 0.9]} />
      <directionalLight position={[7, 10, 6]} intensity={1.5} color="#ffffff" castShadow />
      <pointLight position={[-7, 5, -5]} intensity={35} color="#22d3ee" distance={22} />
      <pointLight position={[6, -2, 5]} intensity={30} color="#c084fc" distance={20} />
      <pointLight position={[0, 7, -6]} intensity={25} color="#38bdf8" distance={20} />
      <spotLight
        position={[0, 9, 0]}
        intensity={30}
        angle={0.7}
        penumbra={0.65}
        color="#bae6fd"
        distance={22}
      />
    </>
  );
}

function isWebGLAvailable(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl2') || canvas.getContext('webgl'))
    );
  } catch {
    return false;
  }
}

export function WorldCanvas({ reducedMotion, isMobile }: WorldCanvasProps) {
  const [webglSupported, setWebglSupported] = useState(true);
  const [preset, setPreset] = useState<CameraPreset>('isometric');
  const [isRotating, setIsRotating] = useState(true);
  const [wireframeMode, setWireframeMode] = useState(false);

  useEffect(() => {
    setWebglSupported(isWebGLAvailable());
  }, []);

  if (!webglSupported) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-center p-6 text-white/50">
        <p className="text-sm">Hardware-accelerated WebGL is disabled or unavailable.</p>
      </div>
    );
  }

  const dpr = isMobile ? 1 : Math.min(window.devicePixelRatio, 1.5);

  const handlePreset = (p: CameraPreset) => {
    audioService.playSelectSound();
    setPreset(p);
  };

  const handleToggleRotate = () => {
    audioService.playToggleSound();
    setIsRotating(!isRotating);
  };

  const handleToggleWireframe = () => {
    audioService.playToggleSound();
    setWireframeMode(!wireframeMode);
  };

  return (
    <div className="relative w-full h-full rounded-3xl overflow-hidden border border-white/10 bg-base-950/80 shadow-2xl">
      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [5.5, 3.8, 6.5], fov: 45, near: 0.1, far: 50 }}
        dpr={dpr}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
        }}
        style={{ width: '100%', height: '100%', background: 'transparent' }}
      >
        <WorldLighting />
        <Suspense fallback={null}>
          <CityScene reducedMotion={reducedMotion} wireframeMode={wireframeMode} />
        </Suspense>
        <CameraController
          preset={preset}
          isRotating={isRotating}
          reducedMotion={reducedMotion}
        />
        {!isMobile && (
          <EffectComposer multisampling={0}>
            <Bloom
              intensity={0.4}
              luminanceThreshold={0.65}
              luminanceSmoothing={0.8}
              mipmapBlur
            />
          </EffectComposer>
        )}
      </Canvas>

      {/* Floating Interactive 3D Control Dock */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 p-1.5 rounded-2xl bg-base-900/90 border border-white/10 shadow-2xl backdrop-blur-xl max-w-[94vw] overflow-x-auto no-scrollbar">
        {/* Preset views */}
        <div className="flex items-center gap-1 border-r border-white/10 pr-2 mr-1">
          <button
            onClick={() => handlePreset('isometric')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 ${
              preset === 'isometric'
                ? 'bg-cyan-glow/20 text-cyan-glow border border-cyan-glow/40 shadow-sm'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
            title="Isometric Orbit Camera View"
          >
            <Compass className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Orbit View</span>
          </button>
          <button
            onClick={() => handlePreset('skyline')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 ${
              preset === 'skyline'
                ? 'bg-cyan-glow/20 text-cyan-glow border border-cyan-glow/40 shadow-sm'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
            title="Skyline Low-Angle View"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Skyline</span>
          </button>
          <button
            onClick={() => handlePreset('topdown')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 ${
              preset === 'topdown'
                ? 'bg-cyan-glow/20 text-cyan-glow border border-cyan-glow/40 shadow-sm'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
            title="Top-Down Plan View"
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Top-Down</span>
          </button>
        </div>

        {/* Rotation toggle */}
        <button
          onClick={handleToggleRotate}
          className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 ${
            isRotating
              ? 'bg-white/10 text-white'
              : 'text-white/50 hover:text-white hover:bg-white/5'
          }`}
          title={isRotating ? 'Pause Continuous Rotation' : 'Resume Continuous Rotation'}
        >
          {isRotating ? (
            <>
              <Pause className="w-3.5 h-3.5 text-cyan-glow" />
              <span className="hidden sm:inline">Pause</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 text-cyan-glow" />
              <span className="hidden sm:inline">Rotate</span>
            </>
          )}
        </button>

        {/* Wireframe Hologram toggle */}
        <button
          onClick={handleToggleWireframe}
          className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 ${
            wireframeMode
              ? 'bg-violet-glow/20 text-violet-glow border border-violet-glow/40'
              : 'text-white/50 hover:text-white hover:bg-white/5'
          }`}
          title="Toggle Hologram Wireframe Mode"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{wireframeMode ? 'Wireframe' : 'Solid'}</span>
        </button>
      </div>

      {/* Helpful Hint Overlay */}
      <div className="absolute top-4 left-4 z-20 pointer-events-none hidden sm:block">
        <div className="px-3 py-1.5 rounded-xl bg-base-950/70 border border-white/10 text-[11px] text-white/50 font-mono flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-glow" />
          <span>Click & Drag to rotate 360° · Scroll to zoom</span>
        </div>
      </div>
    </div>
  );
}
