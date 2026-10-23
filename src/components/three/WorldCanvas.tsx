import { Suspense, useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { WorldScene } from '@/components/three/WorldScene';

function CameraRig({ reducedMotion, scrollProgress }: { reducedMotion: boolean; scrollProgress: number }) {
  const { camera, pointer } = useThree();

  useFrame((state) => {
    if (reducedMotion) {
      camera.position.set(0, 0, 8);
      camera.lookAt(0, 0, 0);
      return;
    }

    const t = state.clock.elapsedTime * 0.05;
    const targetX = pointer.x * 1.2;
    const targetY = pointer.y * 0.6;
    const radius = 8 - scrollProgress * 2;
    const camX = Math.sin(t) * radius + targetX;
    const camZ = Math.cos(t) * radius;
    const camY = 0.5 + targetY - scrollProgress * 1;

    camera.position.x += (camX - camera.position.x) * 0.03;
    camera.position.y += (camY - camera.position.y) * 0.03;
    camera.position.z += (camZ - camera.position.z) * 0.03;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

function SceneLights() {
  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[5, 3, 5]} intensity={25} color="#22d3ee" distance={20} />
      <pointLight position={[-5, -2, -5]} intensity={20} color="#a78bfa" distance={20} />
      <pointLight position={[0, 5, 0]} intensity={15} color="#818cf8" distance={15} />
      <directionalLight position={[0, 5, 3]} intensity={0.4} />
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

interface WorldCanvasProps {
  reducedMotion: boolean;
  isMobile: boolean;
  scrollProgress: number;
}

function WorldCanvasInner({ reducedMotion, isMobile, scrollProgress }: WorldCanvasProps) {
  const dpr = isMobile ? 1 : Math.min(window.devicePixelRatio, 1.5);

  return (
    <Canvas
      camera={{ position: [0, 0.5, 8], fov: 45, near: 0.1, far: 50 }}
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
      <fog attach="fog" args={['#030303', 10, 25]} />
      <Suspense fallback={null}>
        <WorldScene reducedMotion={reducedMotion} scrollProgress={scrollProgress} />
      </Suspense>
      <CameraRig reducedMotion={reducedMotion} scrollProgress={scrollProgress} />
      {!isMobile && (
        <EffectComposer>
          <Bloom
            intensity={0.6}
            luminanceThreshold={0.25}
            luminanceSmoothing={0.9}
            mipmapBlur
          />
        </EffectComposer>
      )}
    </Canvas>
  );
}

function FallbackWorld() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="relative w-64 h-64">
        <div className="absolute inset-0 rounded-full border-2 border-cyan-glow/20 animate-spin-slow" />
        <div className="absolute inset-4 rounded-full border border-indigo-glow/20 animate-spin-slow" style={{ animationDirection: 'reverse' }} />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-lg border border-violet-glow/30" style={{ animation: 'float 6s ease-in-out infinite' }} />
        </div>
      </div>
    </div>
  );
}

export function WorldCanvas({ reducedMotion, isMobile, scrollProgress }: WorldCanvasProps) {
  const [webglSupported, setWebglSupported] = useState(true);

  useEffect(() => {
    setWebglSupported(isWebGLAvailable());
  }, []);

  if (!webglSupported) {
    return <FallbackWorld />;
  }

  return <WorldCanvasInner reducedMotion={reducedMotion} isMobile={isMobile} scrollProgress={scrollProgress} />;
}
