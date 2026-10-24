import { Suspense, useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { CityScene } from '@/components/three/CityScene';

function CameraRig({ reducedMotion }: { reducedMotion: boolean }) {
  const { camera, pointer } = useThree();
  const targetPos = useRef(new THREE.Vector3(0, 1.4, 6.8));
  const lookTarget = useRef(new THREE.Vector3(0, 0, 0));

  useFrame((state, delta) => {
    if (reducedMotion) {
      camera.position.set(0, 1.2, 6.8);
      camera.lookAt(0, 0, 0);
      return;
    }

    // Continuous orbital rotation + interactive pointer parallax
    const t = state.clock.elapsedTime * 0.06;
    const baseRadius = 6.8;
    const targetX = Math.sin(t) * baseRadius + pointer.x * 2.2;
    const targetZ = Math.cos(t) * baseRadius - Math.abs(pointer.x) * 0.5;
    const targetY = 1.3 + pointer.y * 1.4;

    targetPos.current.set(targetX, targetY, targetZ);

    // Frame-rate independent exponential damping for silky movement
    camera.position.x = THREE.MathUtils.damp(camera.position.x, targetPos.current.x, 3.5, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, targetPos.current.y, 3.5, delta);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, targetPos.current.z, 3.5, delta);

    lookTarget.current.x = THREE.MathUtils.damp(lookTarget.current.x, pointer.x * 0.4, 4.0, delta);
    lookTarget.current.y = THREE.MathUtils.damp(lookTarget.current.y, pointer.y * 0.3, 4.0, delta);
    camera.lookAt(lookTarget.current.x, lookTarget.current.y, 0);
  });

  return null;
}

function StudioLighting() {
  return (
    <>
      {/* Balanced sky/ground ambient fill */}
      <hemisphereLight args={['#67e8f9', '#090d16', 1.0]} />

      {/* Warm key directional light */}
      <directionalLight
        position={[6, 9, 6]}
        intensity={1.5}
        color="#ffffff"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />

      {/* Cyberpunk rim lights */}
      <pointLight position={[-6, 3, -4]} intensity={28} color="#22d3ee" distance={18} />
      <pointLight position={[5, -2, 4]} intensity={24} color="#c084fc" distance={16} />
      <pointLight position={[0, 5, -5]} intensity={20} color="#38bdf8" distance={16} />

      {/* Central spotlight focusing on the citadel */}
      <spotLight
        position={[0, 7, 0]}
        intensity={25}
        angle={0.7}
        penumbra={0.6}
        color="#bae6fd"
        distance={18}
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

interface HeroCanvasProps {
  reducedMotion: boolean;
  isMobile: boolean;
}

function HeroCanvasInner({ reducedMotion, isMobile }: HeroCanvasProps) {
  const dpr = isMobile ? 1 : Math.min(window.devicePixelRatio, 1.5);

  return (
    <Canvas
      camera={{ position: [0, 1.4, 6.8], fov: 46, near: 0.1, far: 50 }}
      dpr={dpr}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.15,
      }}
      style={{
        width: '100%',
        height: '100%',
        background: 'transparent',
        pointerEvents: 'auto',
      }}
    >
      <StudioLighting />
      <Suspense fallback={null}>
        <CityScene reducedMotion={reducedMotion} />
      </Suspense>
      <CameraRig reducedMotion={reducedMotion} />
      {!isMobile && (
        <EffectComposer multisampling={0}>
          <Bloom
            intensity={0.45}
            luminanceThreshold={0.6}
            luminanceSmoothing={0.8}
            mipmapBlur
          />
        </EffectComposer>
      )}
    </Canvas>
  );
}

function FallbackMessage() {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center text-center p-6 text-white/50">
      <div className="w-16 h-16 rounded-2xl bg-cyan-glow/10 border border-cyan-glow/20 flex items-center justify-center text-cyan-glow mb-3">
        WebGL
      </div>
      <p className="text-sm">Hardware-accelerated WebGL is disabled or unavailable in this browser session.</p>
    </div>
  );
}

export function HeroCanvas({ reducedMotion, isMobile }: HeroCanvasProps) {
  const [webglSupported, setWebglSupported] = useState(true);

  useEffect(() => {
    setWebglSupported(isWebGLAvailable());
  }, []);

  if (!webglSupported) {
    return <FallbackMessage />;
  }

  return <HeroCanvasInner reducedMotion={reducedMotion} isMobile={isMobile} />;
}
