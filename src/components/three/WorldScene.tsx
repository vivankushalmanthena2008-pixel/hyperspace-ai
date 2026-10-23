import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface WorldSceneProps {
  reducedMotion?: boolean;
  scrollProgress?: number;
}

function HoloCube({ position, size, color, speed, phase, reducedMotion }: {
  position: [number, number, number];
  size: number;
  color: string;
  speed: number;
  phase: number;
  reducedMotion?: boolean;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const wireRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime + phase;
    if (ref.current) {
      if (!reducedMotion) {
        ref.current.rotation.x = t * speed;
        ref.current.rotation.y = t * speed * 0.7;
        ref.current.position.y = position[1] + Math.sin(t * 0.6) * 0.3;
      }
    }
    if (wireRef.current) {
      wireRef.current.rotation.x = t * speed * 1.2;
      wireRef.current.rotation.y = t * speed * 0.9;
      if (!reducedMotion) {
        wireRef.current.position.y = position[1] + Math.sin(t * 0.6) * 0.3;
      }
    }
  });

  return (
    <group position={position}>
      <mesh ref={ref}>
        <boxGeometry args={[size, size, size]} />
        <meshPhysicalMaterial
          color={color}
          metalness={0.6}
          roughness={0.2}
          transmission={0.5}
          transparent
          opacity={0.3}
          thickness={0.5}
          toneMapped={false}
        />
      </mesh>
      <mesh ref={wireRef} scale={1.15}>
        <boxGeometry args={[size, size, size]} />
        <meshBasicMaterial color={color} wireframe transparent opacity={0.4} toneMapped={false} />
      </mesh>
    </group>
  );
}

function OrbitalRing({ radius, tubeRadius, color, speed, tilt, reducedMotion }: {
  radius: number;
  tubeRadius: number;
  color: string;
  speed: number;
  tilt: [number, number, number];
  reducedMotion?: boolean;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const satRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ref.current && !reducedMotion) {
      ref.current.rotation.z = state.clock.elapsedTime * speed;
    }
    if (satRef.current && !reducedMotion) {
      const a = state.clock.elapsedTime * speed;
      satRef.current.position.x = Math.cos(a) * radius;
      satRef.current.position.y = Math.sin(a) * radius;
    }
  });

  return (
    <group rotation={tilt}>
      <mesh ref={ref}>
        <torusGeometry args={[radius, tubeRadius, 16, 128]} />
        <meshBasicMaterial color={color} transparent opacity={0.5} toneMapped={false} />
      </mesh>
      <mesh ref={satRef}>
        <sphereGeometry args={[tubeRadius * 3, 16, 16]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
    </group>
  );
}

function Portal({ position, color, reducedMotion }: {
  position: [number, number, number];
  color: string;
  reducedMotion?: boolean;
}) {
  const innerRef = useRef<THREE.Mesh>(null);
  const outerRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (reducedMotion) return;
    const t = state.clock.elapsedTime;
    if (innerRef.current) {
      innerRef.current.rotation.z = t * 0.5;
      const s = 1 + Math.sin(t * 1.5) * 0.1;
      innerRef.current.scale.set(s, s, 1);
    }
    if (outerRef.current) {
      outerRef.current.rotation.z = -t * 0.3;
    }
  });

  return (
    <group position={position}>
      <mesh ref={outerRef}>
        <ringGeometry args={[0.45, 0.55, 64]} />
        <meshBasicMaterial color={color} transparent opacity={0.3} side={THREE.DoubleSide} toneMapped={false} />
      </mesh>
      <mesh ref={innerRef}>
        <circleGeometry args={[0.4, 64]} />
        <meshBasicMaterial color={color} transparent opacity={0.08} side={THREE.DoubleSide} toneMapped={false} />
      </mesh>
    </group>
  );
}

function Platform({ position, size, color, reducedMotion }: {
  position: [number, number, number];
  size: number;
  color: string;
  reducedMotion?: boolean;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ref.current && !reducedMotion) {
      ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.8 + position[0]) * 0.15;
      ref.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <mesh ref={ref} position={position}>
      <cylinderGeometry args={[size, size, 0.05, 32]} />
      <meshStandardMaterial
        color={color}
        metalness={0.9}
        roughness={0.15}
        emissive={color}
        emissiveIntensity={0.2}
      />
    </mesh>
  );
}

function WorldParticles() {
  const ref = useRef<THREE.Points>(null);
  const count = 150;

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 3 + Math.random() * 4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) - 1;
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.03;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#818cf8"
        transparent
        opacity={0.4}
        sizeAttenuation
        toneMapped={false}
      />
    </points>
  );
}

export function WorldScene({ reducedMotion, scrollProgress = 0 }: WorldSceneProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current && !reducedMotion) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.04 + scrollProgress * 0.5;
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Holographic cubes */}
      <HoloCube position={[-2.5, 1, 0]} size={0.7} color="#22d3ee" speed={0.5} phase={0} reducedMotion={reducedMotion} />
      <HoloCube position={[2.5, -0.5, -1]} size={0.5} color="#818cf8" speed={0.4} phase={1.5} reducedMotion={reducedMotion} />
      <HoloCube position={[0, 1.5, -2]} size={0.6} color="#a78bfa" speed={0.6} phase={3} reducedMotion={reducedMotion} />
      <HoloCube position={[-1.5, -1, 1.5]} size={0.4} color="#67e8f9" speed={0.7} phase={2} reducedMotion={reducedMotion} />
      <HoloCube position={[1.8, 0.8, 1]} size={0.45} color="#22d3ee" speed={0.45} phase={4} reducedMotion={reducedMotion} />

      {/* Orbital rings */}
      <OrbitalRing radius={2.2} tubeRadius={0.012} color="#22d3ee" speed={0.2} tilt={[Math.PI / 2.8, 0, 0]} reducedMotion={reducedMotion} />
      <OrbitalRing radius={2.8} tubeRadius={0.01} color="#818cf8" speed={-0.15} tilt={[Math.PI / 3.5, 0.5, 0.3]} reducedMotion={reducedMotion} />
      <OrbitalRing radius={1.8} tubeRadius={0.008} color="#a78bfa" speed={0.25} tilt={[Math.PI / 2, 0, Math.PI / 3]} reducedMotion={reducedMotion} />

      {/* Portals */}
      <Portal position={[-3, 0, -1.5]} color="#22d3ee" reducedMotion={reducedMotion} />
      <Portal position={[3, 0.5, -0.5]} color="#a78bfa" reducedMotion={reducedMotion} />

      {/* Platforms */}
      <Platform position={[-2, -1.5, 0.5]} size={0.4} color="#22d3ee" reducedMotion={reducedMotion} />
      <Platform position={[2, -1.5, -0.5]} size={0.5} color="#818cf8" reducedMotion={reducedMotion} />
      <Platform position={[0, -1.8, 1.5]} size={0.35} color="#a78bfa" reducedMotion={reducedMotion} />

      <WorldParticles />
    </group>
  );
}
