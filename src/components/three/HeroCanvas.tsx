import { Suspense, useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import { CityScene } from '@/components/three/CityScene';

function CameraRig({ reducedMotion }: { reducedMotion: boolean }) {
  const { camera, pointer } = useThree();
  const targetX = useRef(0);
  const targetY = useRef(0);

  useFrame((state) => {
    if (reducedMotion) return;

    // Mouse influence
    targetX.current = pointer.x * 1.5;
    targetY.current = pointer.y * 0.8;

    // Slow continuous orbit
    const t = state.clock.elapsedTime * 0.08;
    const baseRadius = 7.5;
    const camX = Math.sin(t) * baseRadius + targetX.current;
    const camZ = Math.cos(t) * baseRadius;
    const camY = 2 + targetY.current;

    camera.position.x += (camX - camera.position.x) * 0.04;
    camera.position.y += (camY - camera.position.y) * 0.04;
    camera.position.z += (camZ - camera.position.z) * 0.04;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

function SceneLights() {
  return (
    <>
      <ambientLight intensity={0.15} />
      <pointLight position={[5, 5, 5]} intensity={30} color="#22d3ee" distance={20} />
      <pointLight position={[-5, 3, -5]} intensity={20} color="#818cf8" distance={20} />
      <pointLight position={[0, -3, 3]} intensity={15} color="#a78bfa" distance={15} />
      <directionalLight position={[0, 10, 5]} intensity={0.3} color="#ffffff" />
      <spotLight
        position={[0, 8, 0]}
        angle={0.5}
        penumbra={0.8}
        intensity={10}
        color="#67e8f9"
        distance={20}
      />
    </>
  );
}

function isWebGLAvailable(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    return !!gl;
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
      camera={{ position: [0, 2, 7.5], fov: 45, near: 0.1, far: 50 }}
      dpr={dpr}
      gl={{
        antialias: !isMobile,
        alpha: true,
        powerPreference: 'high-performance',
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.0,
      }}
      style={{ background: 'transparent' }}
    >
      <SceneLights />
      <fog attach="fog" args={['#030303', 8, 18]} />
      <Suspense fallback={null}>
        <CityScene reducedMotion={reducedMotion} />
      </Suspense>
      <CameraRig reducedMotion={reducedMotion} />
      {!isMobile && (
        <EffectComposer>
          <Bloom
            intensity={0.8}
            luminanceThreshold={0.2}
            luminanceSmoothing={0.9}
            mipmapBlur
          />
          <Vignette eskil={false} offset={0.3} darkness={0.6} />
        </EffectComposer>
      )}
    </Canvas>
  );
}

function FallbackOrb() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div
        className="w-64 h-64 rounded-full"
        style={{
          background: 'radial-gradient(circle at 35% 30%, rgba(34,211,238,0.5) 0%, rgba(129,140,248,0.3) 40%, rgba(167,139,250,0.1) 70%, transparent 85%)',
          filter: 'blur(4px)',
        }}
      />
      <div
        className="absolute w-48 h-48 rounded-full border border-cyan-glow/20"
        style={{ animation: 'spin 20s linear infinite' }}
      />
    </div>
  );
}

export function HeroCanvas({ reducedMotion, isMobile }: HeroCanvasProps) {
  const [webglSupported, setWebglSupported] = useState(true);

  useEffect(() => {
    setWebglSupported(isWebGLAvailable());
  }, []);

  if (!webglSupported) {
    return <FallbackOrb />;
  }

  return <HeroCanvasInner reducedMotion={reducedMotion} isMobile={isMobile} />;
}
