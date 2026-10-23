import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CitySceneProps {
  reducedMotion?: boolean;
}

type Building = {
  position: [number, number, number];
  width: number;
  depth: number;
  height: number;
  color: THREE.Color;
  windows: WindowLight[];
};

type WindowLight = {
  position: [number, number, number];
  color: THREE.Color;
  intensity: number;
};

const CITY_RADIUS = 3.2;
const BUILDING_COUNT = 28;

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function generateBuildings(): Building[] {
  const rand = seededRandom(42);
  const buildings: Building[] = [];

  const palette = [
    new THREE.Color('#0a0e1a'),
    new THREE.Color('#0d1224'),
    new THREE.Color('#0a0a14'),
    new THREE.Color('#101830'),
  ];

  const windowColors = [
    new THREE.Color('#22d3ee'),
    new THREE.Color('#3b82f6'),
    new THREE.Color('#818cf8'),
    new THREE.Color('#a78bfa'),
    new THREE.Color('#67e8f9'),
  ];

  for (let i = 0; i < BUILDING_COUNT; i++) {
    const angle = (i / BUILDING_COUNT) * Math.PI * 2 + rand() * 0.3;
    const dist = 0.5 + rand() * (CITY_RADIUS - 0.8);
    const x = Math.cos(angle) * dist;
    const z = Math.sin(angle) * dist;
    const width = 0.18 + rand() * 0.28;
    const depth = 0.18 + rand() * 0.28;
    const height = 0.4 + rand() * 2.2;

    const windows: WindowLight[] = [];
    const wColor = windowColors[Math.floor(rand() * windowColors.length)];
    const rows = Math.floor(height / 0.18);
    const cols = Math.max(2, Math.floor(width / 0.08));

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (rand() > 0.55) {
          const wx = (c / (cols - 1) - 0.5) * width * 0.7;
          const wy = r * 0.18 + 0.08 - height / 2 + height * 0.5;
          windows.push({
            position: [wx, wy, depth / 2 + 0.002],
            color: wColor.clone(),
            intensity: 0.6 + rand() * 0.8,
          });
        }
      }
    }

    // Some windows on the side faces too
    if (rand() > 0.5) {
      const sideRows = Math.floor(height / 0.18);
      for (let r = 0; r < sideRows; r++) {
        if (rand() > 0.6) {
          windows.push({
            position: [width / 2 + 0.002, r * 0.18 + 0.08 - height / 2 + height * 0.5, 0],
            color: windowColors[Math.floor(rand() * windowColors.length)].clone(),
            intensity: 0.5 + rand() * 0.5,
          });
        }
      }
    }

    buildings.push({
      position: [x, height / 2 - 1.5, z],
      width,
      depth,
      height,
      color: palette[Math.floor(rand() * palette.length)],
      windows,
    });
  }

  // Central spire
  buildings.push({
    position: [0, 0.8 - 1.5, 0],
    width: 0.25,
    depth: 0.25,
    height: 3.0,
    color: new THREE.Color('#0a0a14'),
    windows: Array.from({ length: 14 }, (_, r) => ({
      position: [0, r * 0.2 + 0.1 - 1.5 + 1.5, 0.127],
      color: new THREE.Color('#22d3ee'),
      intensity: 0.8,
    })),
  });

  return buildings;
}

function Building({ building }: { building: Building }) {
  const meshRef = useRef<THREE.Mesh>(null);

  return (
    <group position={building.position}>
      <mesh ref={meshRef} castShadow receiveShadow>
        <boxGeometry args={[building.width, building.height, building.depth]} />
        <meshStandardMaterial
          color={building.color}
          metalness={0.8}
          roughness={0.3}
          emissive={building.color}
          emissiveIntensity={0.15}
        />
      </mesh>
      {/* Window lights — front face */}
      {building.windows.map((w, i) => {
        const isSide = Math.abs(w.position[2]) < 0.01;
        return (
          <mesh key={i} position={w.position} rotation={isSide ? [0, Math.PI / 2, 0] : [0, 0, 0]}>
            <planeGeometry args={[0.035, 0.06]} />
            <meshBasicMaterial
              color={w.color}
              toneMapped={false}
            />
          </mesh>
        );
      })}
    </group>
  );
}

function GroundPlane() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]} receiveShadow>
      <circleGeometry args={[CITY_RADIUS + 0.3, 64]} />
      <meshStandardMaterial
        color="#080810"
        metalness={0.9}
        roughness={0.2}
        emissive="#0a1a2a"
        emissiveIntensity={0.1}
      />
    </mesh>
  );
}

function GroundGrid() {
  const gridRef = useRef<THREE.GridHelper>(null);

  return (
    <gridHelper
      ref={gridRef}
      args={[8, 20, '#22d3ee', '#1a1a3a']}
      position={[0, -1.49, 0]}
    />
  );
}

function GlassSphere() {
  const matRef = useRef<THREE.MeshPhysicalMaterial>(null);

  return (
    <mesh>
      <sphereGeometry args={[CITY_RADIUS + 0.8, 64, 64]} />
      <meshPhysicalMaterial
        ref={matRef}
        transparent
        opacity={0.06}
        roughness={0.05}
        metalness={0.1}
        clearcoat={1}
        clearcoatRoughness={0.05}
        transmission={0.9}
        thickness={0.5}
        ior={1.5}
        envMapIntensity={1}
        color="#22d3ee"
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function FresnelSphere() {
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const vertexShader = useMemo(
    () => `
      varying vec3 vNormal;
      varying vec3 vViewDir;
      void main() {
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vNormal = normalize(normalMatrix * normal);
        vViewDir = normalize(-mvPosition.xyz);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    []
  );

  const fragmentShader = useMemo(
    () => `
      varying vec3 vNormal;
      varying vec3 vViewDir;
      uniform float uTime;
      uniform vec3 uColorA;
      uniform vec3 uColorB;
      void main() {
        float fresnel = pow(1.0 - dot(vNormal, vViewDir), 2.5);
        vec3 color = mix(uColorA, uColorB, fresnel);
        float pulse = sin(uTime * 0.5) * 0.1 + 0.9;
        gl_FragColor = vec4(color, fresnel * 0.5 * pulse);
      }
    `,
    []
  );

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColorA: { value: new THREE.Color('#22d3ee') },
      uColorB: { value: new THREE.Color('#a78bfa') },
    }),
    []
  );

  useFrame((state) => {
    if (matRef.current) {
      matRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <mesh>
      <sphereGeometry args={[CITY_RADIUS + 0.81, 64, 64]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        side={THREE.FrontSide}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

function EnergyRing({ radius, tilt, speed, color, tubeRadius = 0.015 }: {
  radius: number;
  tilt: [number, number, number];
  speed: number;
  color: string;
  tubeRadius?: number;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.z = state.clock.elapsedTime * speed;
    }
  });

  return (
    <mesh ref={ref} rotation={tilt}>
      <torusGeometry args={[radius, tubeRadius, 16, 128]} />
      <meshBasicMaterial color={color} toneMapped={false} transparent opacity={0.6} />
    </mesh>
  );
}

function FloatingParticles() {
  const ref = useRef<THREE.Points>(null);
  const count = 200;

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 2 + Math.random() * 3;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.05;
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
        size={0.04}
        color="#67e8f9"
        transparent
        opacity={0.5}
        sizeAttenuation
        toneMapped={false}
      />
    </points>
  );
}

function CentralCore() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.3;
      const s = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.08;
      ref.current.scale.setScalar(s);
    }
  });

  return (
    <mesh ref={ref} position={[0, 0, 0]}>
      <icosahedronGeometry args={[0.2, 1]} />
      <meshBasicMaterial color="#22d3ee" toneMapped={false} wireframe />
    </mesh>
  );
}

function CityGroup({ reducedMotion }: { reducedMotion?: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const buildings = useMemo(() => generateBuildings(), []);

  useFrame((state) => {
    if (groupRef.current) {
      if (reducedMotion) {
        groupRef.current.rotation.y = 0.3;
      } else {
        groupRef.current.rotation.y = state.clock.elapsedTime * 0.08;
      }
    }
  });

  return (
    <group ref={groupRef}>
      <GroundPlane />
      <GroundGrid />
      <CentralCore />
      {buildings.map((b, i) => (
        <Building key={i} building={b} />
      ))}
    </group>
  );
}

export function CityScene({ reducedMotion }: CitySceneProps) {
  return (
    <group>
      <CityGroup reducedMotion={reducedMotion} />
      <GlassSphere />
      <FresnelSphere />
      <EnergyRing
        radius={CITY_RADIUS + 1.2}
        tilt={[Math.PI / 2.5, 0, 0]}
        speed={0.15}
        color="#22d3ee"
      />
      <EnergyRing
        radius={CITY_RADIUS + 1.5}
        tilt={[Math.PI / 3, 0.5, 0.3]}
        speed={-0.1}
        color="#818cf8"
      />
      <EnergyRing
        radius={CITY_RADIUS + 1.0}
        tilt={[Math.PI / 2, 0, Math.PI / 4]}
        speed={0.2}
        color="#a78bfa"
        tubeRadius={0.01}
      />
      <FloatingParticles />
    </group>
  );
}
