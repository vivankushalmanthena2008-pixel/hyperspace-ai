import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CitySceneProps {
  reducedMotion?: boolean;
  interactive?: boolean;
  wireframeMode?: boolean;
}

type BuildingSpec = {
  position: [number, number, number];
  width: number;
  depth: number;
  height: number;
  bodyColor: THREE.Color;
  roofType: 'spire' | 'stepped' | 'helipad' | 'antenna' | 'crown';
  accentColor: THREE.Color;
  windows: WindowSpec[];
};

type WindowSpec = {
  position: [number, number, number];
  size: [number, number];
  color: THREE.Color;
  isSide?: boolean;
};

const CITY_RADIUS = 2.45;
const SPHERE_RADIUS = 3.18;
const GROUND_Y = -0.92;
const BUILDING_COUNT = 44;

// Deterministic random generator for reproducible metropolis layout
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function generateMetropolis(): BuildingSpec[] {
  const rand = seededRandom(2026);
  const buildings: BuildingSpec[] = [];

  const buildingTones = [
    new THREE.Color('#1e293b'), // slate-800
    new THREE.Color('#0f172a'), // slate-900
    new THREE.Color('#141d2e'), // deep navy
    new THREE.Color('#1a1e36'), // midnight metal
    new THREE.Color('#22283e'), // gunmetal
  ];

  const windowPalette = [
    new THREE.Color('#22d3ee'), // cyan glow
    new THREE.Color('#38bdf8'), // sky blue
    new THREE.Color('#818cf8'), // indigo
    new THREE.Color('#c084fc'), // violet
    new THREE.Color('#34d399'), // emerald
    new THREE.Color('#fbbf24'), // amber
  ];

  for (let i = 0; i < BUILDING_COUNT; i++) {
    const angle = (i / BUILDING_COUNT) * Math.PI * 2 + (rand() - 0.5) * 0.35;
    // Radial distribution: dense ring at 0.55 - 2.25
    const dist = 0.58 + rand() * (CITY_RADIUS - 0.68);
    const x = Math.cos(angle) * dist;
    const z = Math.sin(angle) * dist;

    // Heights peak around middle radius (1.3), framing the central spire
    const heightDistFactor = 1 - Math.abs(dist - 1.3) / 1.5;
    const height = 0.55 + heightDistFactor * 1.6 + rand() * 0.7;
    const width = 0.18 + rand() * 0.22;
    const depth = 0.18 + rand() * 0.22;

    const roofTypes: BuildingSpec['roofType'][] = [
      'spire',
      'stepped',
      'helipad',
      'antenna',
      'crown',
    ];
    const roofType = roofTypes[Math.floor(rand() * roofTypes.length)];
    const accent = windowPalette[Math.floor(rand() * windowPalette.length)];

    const windows: WindowSpec[] = [];
    const rows = Math.floor(height / 0.16);
    const cols = Math.max(2, Math.floor(width / 0.07));

    // Front/Back window matrix
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (rand() > 0.45) {
          const wx = (c / (cols - 1) - 0.5) * width * 0.72;
          const wy = r * 0.16 + 0.08 - height / 2;
          const wColor = rand() > 0.8 ? windowPalette[Math.floor(rand() * windowPalette.length)] : accent;
          windows.push({
            position: [wx, wy, depth / 2 + 0.003],
            size: [0.035, 0.055],
            color: wColor,
            isSide: false,
          });
        }
      }
    }

    // Side window matrix
    const sideCols = Math.max(2, Math.floor(depth / 0.07));
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < sideCols; c++) {
        if (rand() > 0.55) {
          const wz = (c / (sideCols - 1) - 0.5) * depth * 0.72;
          const wy = r * 0.16 + 0.08 - height / 2;
          windows.push({
            position: [width / 2 + 0.003, wy, wz],
            size: [0.035, 0.055],
            color: accent,
            isSide: true,
          });
        }
      }
    }

    buildings.push({
      position: [x, GROUND_Y + height / 2, z],
      width,
      depth,
      height,
      bodyColor: buildingTones[Math.floor(rand() * buildingTones.length)],
      roofType,
      accentColor: accent,
      windows,
    });
  }

  return buildings;
}

function BuildingMesh({ spec, wireframe }: { spec: BuildingSpec; wireframe?: boolean }) {
  const roofY = spec.height / 2;

  return (
    <group position={spec.position}>
      {/* Primary Tower Body */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[spec.width, spec.height, spec.depth]} />
        <meshStandardMaterial
          color={spec.bodyColor}
          metalness={0.75}
          roughness={0.3}
          wireframe={wireframe}
        />
      </mesh>

      {/* Illuminated Rooftop Cornice / Bevel Trim */}
      <mesh position={[0, roofY + 0.01, 0]}>
        <boxGeometry args={[spec.width * 1.04, 0.025, spec.depth * 1.04]} />
        <meshBasicMaterial color={spec.accentColor} toneMapped={false} />
      </mesh>

      {/* Roof Architectural Feature */}
      {spec.roofType === 'spire' && (
        <group position={[0, roofY + 0.22, 0]}>
          <mesh>
            <coneGeometry args={[spec.width * 0.35, 0.45, 4]} />
            <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.3, 0]}>
            <sphereGeometry args={[0.025, 12, 12]} />
            <meshBasicMaterial color={spec.accentColor} toneMapped={false} />
          </mesh>
        </group>
      )}

      {spec.roofType === 'antenna' && (
        <group position={[0, roofY + 0.2, 0]}>
          <mesh>
            <cylinderGeometry args={[0.007, 0.007, 0.4, 8]} />
            <meshBasicMaterial color="#ffffff" toneMapped={false} />
          </mesh>
          <mesh position={[0, 0.21, 0]}>
            <sphereGeometry args={[0.02, 12, 12]} />
            <meshBasicMaterial color="#ef4444" toneMapped={false} />
          </mesh>
        </group>
      )}

      {spec.roofType === 'stepped' && (
        <group position={[0, roofY + 0.1, 0]}>
          <mesh>
            <boxGeometry args={[spec.width * 0.65, 0.2, spec.depth * 0.65]} />
            <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.11, 0]}>
            <boxGeometry args={[spec.width * 0.35, 0.06, spec.depth * 0.35]} />
            <meshBasicMaterial color={spec.accentColor} toneMapped={false} />
          </mesh>
        </group>
      )}

      {spec.roofType === 'helipad' && (
        <group position={[0, roofY + 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <mesh>
            <circleGeometry args={[spec.width * 0.42, 24]} />
            <meshBasicMaterial color={spec.accentColor} toneMapped={false} transparent opacity={0.8} />
          </mesh>
          <mesh position={[0, 0, 0.002]}>
            <ringGeometry args={[spec.width * 0.35, spec.width * 0.4, 24]} />
            <meshBasicMaterial color="#ffffff" toneMapped={false} />
          </mesh>
        </group>
      )}

      {spec.roofType === 'crown' && (
        <group position={[0, roofY + 0.06, 0]}>
          <mesh>
            <cylinderGeometry args={[spec.width * 0.45, spec.width * 0.38, 0.12, 6]} />
            <meshStandardMaterial color="#0f172a" metalness={0.85} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.07, 0]}>
            <torusGeometry args={[spec.width * 0.35, 0.012, 8, 24]} />
            <meshBasicMaterial color={spec.accentColor} toneMapped={false} />
          </mesh>
        </group>
      )}

      {/* Windows — Glowing Emissive Plates */}
      {!wireframe &&
        spec.windows.map((w, i) => (
          <mesh
            key={i}
            position={w.position}
            rotation={w.isSide ? [0, Math.PI / 2, 0] : [0, 0, 0]}
          >
            <planeGeometry args={w.size} />
            <meshBasicMaterial color={w.color} toneMapped={false} />
          </mesh>
        ))}
    </group>
  );
}

function CentralCitadelSpire({ reducedMotion }: { reducedMotion?: boolean }) {
  const crystalRef = useRef<THREE.Mesh>(null);
  const orbitalPylonRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (reducedMotion) return;
    const t = state.clock.elapsedTime;
    if (crystalRef.current) {
      crystalRef.current.rotation.y = t * 1.1;
      crystalRef.current.rotation.z = Math.sin(t * 1.6) * 0.12;
      crystalRef.current.position.y = 2.05 + Math.sin(t * 2.2) * 0.05;
    }
    if (orbitalPylonRef.current) {
      orbitalPylonRef.current.rotation.y = -t * 0.6;
    }
  });

  return (
    <group position={[0, GROUND_Y, 0]}>
      {/* Tiered Citadel Base */}
      <mesh position={[0, 0.08, 0]}>
        <cylinderGeometry args={[0.55, 0.72, 0.16, 16]} />
        <meshStandardMaterial color="#0f172a" metalness={0.85} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.18, 0]}>
        <cylinderGeometry args={[0.42, 0.52, 0.04, 16]} />
        <meshBasicMaterial color="#22d3ee" toneMapped={false} />
      </mesh>

      {/* Main Spire Tower Body */}
      <mesh position={[0, 0.95, 0]} castShadow>
        <cylinderGeometry args={[0.18, 0.38, 1.7, 8]} />
        <meshStandardMaterial
          color="#1e293b"
          metalness={0.9}
          roughness={0.2}
          emissive="#0e7490"
          emissiveIntensity={0.35}
        />
      </mesh>

      {/* Vertical Energy Conduits running up the spire */}
      {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((ang, i) => (
        <mesh
          key={i}
          position={[Math.cos(ang) * 0.26, 0.95, Math.sin(ang) * 0.26]}
        >
          <cylinderGeometry args={[0.012, 0.012, 1.65, 8]} />
          <meshBasicMaterial color="#22d3ee" toneMapped={false} />
        </mesh>
      ))}

      {/* Mid-tower Observation Deck */}
      <mesh position={[0, 1.45, 0]}>
        <cylinderGeometry args={[0.32, 0.32, 0.08, 16]} />
        <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.15} />
      </mesh>
      <mesh position={[0, 1.45, 0]}>
        <cylinderGeometry args={[0.33, 0.33, 0.025, 16]} />
        <meshBasicMaterial color="#38bdf8" toneMapped={false} />
      </mesh>

      {/* Floating Rotating Energy Crystal at Apex */}
      <mesh ref={crystalRef} position={[0, 2.05, 0]}>
        <octahedronGeometry args={[0.16, 0]} />
        <meshStandardMaterial
          color="#67e8f9"
          emissive="#22d3ee"
          emissiveIntensity={3.5}
          roughness={0.1}
          metalness={0.6}
          toneMapped={false}
        />
      </mesh>

      {/* Orbiting Satellite Rings around Spire */}
      <group ref={orbitalPylonRef} position={[0, 1.25, 0]}>
        <mesh rotation={[Math.PI / 2.3, 0, 0]}>
          <torusGeometry args={[0.45, 0.015, 12, 48]} />
          <meshBasicMaterial color="#c084fc" toneMapped={false} transparent opacity={0.85} />
        </mesh>
        <mesh position={[0.45, 0, 0]}>
          <sphereGeometry args={[0.035, 12, 12]} />
          <meshBasicMaterial color="#22d3ee" toneMapped={false} />
        </mesh>
      </group>
    </group>
  );
}

function HighwayRingsAndDrones({ reducedMotion }: { reducedMotion?: boolean }) {
  const innerRingRef = useRef<THREE.Mesh>(null);
  const outerRingRef = useRef<THREE.Mesh>(null);
  const drone1Ref = useRef<THREE.Mesh>(null);
  const drone2Ref = useRef<THREE.Mesh>(null);
  const drone3Ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (reducedMotion) return;
    const t = state.clock.elapsedTime;
    if (innerRingRef.current) innerRingRef.current.rotation.z = t * 0.08;
    if (outerRingRef.current) outerRingRef.current.rotation.z = -t * 0.06;

    // Moving transit skycars along concentric aerial highways
    if (drone1Ref.current) {
      const a1 = t * 0.75;
      drone1Ref.current.position.set(Math.cos(a1) * 1.1, 0.04, Math.sin(a1) * 1.1);
    }
    if (drone2Ref.current) {
      const a2 = -t * 0.55 + 1.8;
      drone2Ref.current.position.set(Math.cos(a2) * 1.9, 0.04, Math.sin(a2) * 1.9);
    }
    if (drone3Ref.current) {
      const a3 = t * 0.45 + 3.2;
      drone3Ref.current.position.set(Math.cos(a3) * 1.95, 0.05, Math.sin(a3) * 1.95);
    }
  });

  return (
    <group position={[0, GROUND_Y + 0.04, 0]}>
      {/* Inner circular highway */}
      <mesh ref={innerRingRef} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.05, 1.15, 64]} />
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.75} toneMapped={false} />
      </mesh>

      {/* Outer circular highway */}
      <mesh ref={outerRingRef} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.85, 1.98, 64]} />
        <meshBasicMaterial color="#818cf8" transparent opacity={0.65} toneMapped={false} />
      </mesh>

      {/* Radial Maglev Cross Bridges connecting districts */}
      {[0, Math.PI / 4, Math.PI / 2, (3 * Math.PI) / 4].map((ang, i) => (
        <mesh key={i} position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, ang]}>
          <planeGeometry args={[0.05, CITY_RADIUS * 2]} />
          <meshBasicMaterial color="#22d3ee" transparent opacity={0.35} toneMapped={false} />
        </mesh>
      ))}

      {/* Moving Skycar / Transit Drones */}
      <mesh ref={drone1Ref}>
        <boxGeometry args={[0.07, 0.025, 0.035]} />
        <meshBasicMaterial color="#fbbf24" toneMapped={false} />
      </mesh>
      <mesh ref={drone2Ref}>
        <boxGeometry args={[0.08, 0.025, 0.035]} />
        <meshBasicMaterial color="#22d3ee" toneMapped={false} />
      </mesh>
      <mesh ref={drone3Ref}>
        <boxGeometry args={[0.07, 0.025, 0.035]} />
        <meshBasicMaterial color="#f472b6" toneMapped={false} />
      </mesh>
    </group>
  );
}

/**
 * Upper Metropolis Ground Disc + Lower Technological Biosphere Under-Chassis
 * Fills the bottom dome of the sphere with a glowing anti-gravity power core!
 */
function BiospherePlatform() {
  const coreRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (coreRef.current) {
      const t = state.clock.elapsedTime;
      const s = 1 + Math.sin(t * 2.5) * 0.06;
      coreRef.current.scale.set(s, s, s);
    }
  });

  return (
    <group position={[0, GROUND_Y, 0]}>
      {/* 1. Main City Ground Surface */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[CITY_RADIUS, 64]} />
        <meshStandardMaterial
          color="#0f172a"
          metalness={0.9}
          roughness={0.25}
          emissive="#0a1224"
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Glowing Outer Rim of Platform */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
        <ringGeometry args={[CITY_RADIUS - 0.06, CITY_RADIUS, 64]} />
        <meshBasicMaterial color="#22d3ee" toneMapped={false} />
      </mesh>

      {/* Concentric Circuit Grid Lines */}
      {[0.6, 1.4, 2.1].map((rad, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.003, 0]}>
          <ringGeometry args={[rad - 0.01, rad + 0.01, 64]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.4} toneMapped={false} />
        </mesh>
      ))}

      {/* 2. Lower Inverted Under-Chassis (Stepped downward hull filling bottom hemisphere) */}
      <mesh position={[0, -0.2, 0]}>
        <cylinderGeometry args={[CITY_RADIUS, CITY_RADIUS * 0.85, 0.4, 32]} />
        <meshStandardMaterial color="#090d16" metalness={0.95} roughness={0.2} />
      </mesh>
      <mesh position={[0, -0.42, 0]}>
        <torusGeometry args={[CITY_RADIUS * 0.84, 0.02, 12, 64]} />
        <meshBasicMaterial color="#38bdf8" toneMapped={false} />
      </mesh>

      <mesh position={[0, -0.58, 0]}>
        <cylinderGeometry args={[CITY_RADIUS * 0.82, CITY_RADIUS * 0.6, 0.4, 32]} />
        <meshStandardMaterial color="#060911" metalness={0.95} roughness={0.2} />
      </mesh>
      <mesh position={[0, -0.8, 0]}>
        <torusGeometry args={[CITY_RADIUS * 0.58, 0.02, 12, 64]} />
        <meshBasicMaterial color="#818cf8" toneMapped={false} />
      </mesh>

      <mesh position={[0, -0.98, 0]}>
        <cylinderGeometry args={[CITY_RADIUS * 0.56, CITY_RADIUS * 0.32, 0.4, 32]} />
        <meshStandardMaterial color="#090d16" metalness={0.95} roughness={0.2} />
      </mesh>

      {/* Anti-Gravity Radiant Reactor Core at lowest apex */}
      <mesh ref={coreRef} position={[0, -1.35, 0]}>
        <sphereGeometry args={[0.28, 24, 24]} />
        <meshStandardMaterial
          color="#22d3ee"
          emissive="#22d3ee"
          emissiveIntensity={4.0}
          roughness={0.1}
          metalness={0.8}
          toneMapped={false}
        />
      </mesh>

      {/* Radiant Structural Keels / Heat Fins (6 radial fins) */}
      {[0, Math.PI / 3, (2 * Math.PI) / 3, Math.PI, (4 * Math.PI) / 3, (5 * Math.PI) / 3].map((ang, i) => (
        <group key={i} rotation={[0, ang, 0]} position={[0, -0.65, 0]}>
          <mesh position={[CITY_RADIUS * 0.52, 0, 0]}>
            <boxGeometry args={[CITY_RADIUS * 0.45, 0.85, 0.04]} />
            <meshStandardMaterial color="#1e293b" metalness={0.85} roughness={0.25} />
          </mesh>
          <mesh position={[CITY_RADIUS * 0.52, 0, 0.025]}>
            <planeGeometry args={[CITY_RADIUS * 0.35, 0.02]} />
            <meshBasicMaterial color="#22d3ee" toneMapped={false} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/**
 * Transparent Glass Sphere Enclosure
 * Built with depthWrite: false, side: FrontSide, and renderOrder: 10
 * so the entire interior 3D city remains crystal clear and 100% visible!
 */
function TransparentGlassSphere({ reducedMotion }: { reducedMotion?: boolean }) {
  const sphereRef = useRef<THREE.Mesh>(null);
  const auraRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (reducedMotion) return;
    const t = state.clock.elapsedTime;
    if (sphereRef.current) {
      sphereRef.current.rotation.y = t * 0.02;
    }
    if (auraRef.current) {
      const s = 1 + Math.sin(t * 1.2) * 0.008;
      auraRef.current.scale.set(s, s, s);
    }
  });

  return (
    <group>
      {/* 1. Transparent Glass Sphere Shell */}
      <mesh ref={sphereRef} renderOrder={10}>
        <sphereGeometry args={[SPHERE_RADIUS, 64, 64]} />
        <meshPhysicalMaterial
          transparent
          opacity={0.22}
          roughness={0.06}
          metalness={0.15}
          clearcoat={1.0}
          clearcoatRoughness={0.06}
          color="#bae6fd"
          depthWrite={false}
          side={THREE.FrontSide}
        />
      </mesh>

      {/* 2. Glass Specular Edge Ring / Rim Glow */}
      <mesh ref={auraRef} renderOrder={11}>
        <sphereGeometry args={[SPHERE_RADIUS + 0.02, 64, 64]} />
        <meshBasicMaterial
          color="#22d3ee"
          transparent
          opacity={0.15}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

/**
 * Orbital Rings with Satellite Beacons
 */
function OrbitalRings({ reducedMotion }: { reducedMotion?: boolean }) {
  const ring1 = useRef<THREE.Group>(null);
  const ring2 = useRef<THREE.Group>(null);
  const ring3 = useRef<THREE.Group>(null);
  const probe1 = useRef<THREE.Mesh>(null);
  const probe2 = useRef<THREE.Mesh>(null);

  const radius1 = SPHERE_RADIUS + 0.35;
  const radius2 = SPHERE_RADIUS + 0.72;
  const radius3 = SPHERE_RADIUS + 1.1;

  useFrame((state) => {
    if (reducedMotion) return;
    const t = state.clock.elapsedTime;

    if (ring1.current) ring1.current.rotation.z = t * 0.15;
    if (ring2.current) ring2.current.rotation.z = -t * 0.12;
    if (ring3.current) ring3.current.rotation.z = t * 0.18;

    if (probe1.current) {
      const a1 = t * 0.65;
      probe1.current.position.set(Math.cos(a1) * radius1, Math.sin(a1) * radius1, 0);
    }
    if (probe2.current) {
      const a2 = -t * 0.5 + 1.5;
      probe2.current.position.set(Math.cos(a2) * radius2, Math.sin(a2) * radius2, 0);
    }
  });

  return (
    <group>
      {/* Orbital Ring 1 (Cyan) */}
      <group ref={ring1} rotation={[Math.PI / 2.7, 0.2, 0]}>
        <mesh>
          <torusGeometry args={[radius1, 0.018, 16, 128]} />
          <meshBasicMaterial color="#22d3ee" transparent opacity={0.7} toneMapped={false} />
        </mesh>
        <mesh ref={probe1}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshBasicMaterial color="#67e8f9" toneMapped={false} />
        </mesh>
      </group>

      {/* Orbital Ring 2 (Violet) */}
      <group ref={ring2} rotation={[Math.PI / 3.4, -0.4, 0.35]}>
        <mesh>
          <torusGeometry args={[radius2, 0.016, 16, 128]} />
          <meshBasicMaterial color="#a78bfa" transparent opacity={0.6} toneMapped={false} />
        </mesh>
        <mesh ref={probe2}>
          <sphereGeometry args={[0.055, 16, 16]} />
          <meshBasicMaterial color="#c084fc" toneMapped={false} />
        </mesh>
      </group>

      {/* Orbital Ring 3 (Electric Azure) */}
      <group ref={ring3} rotation={[Math.PI / 2.1, 0.5, -0.2]}>
        <mesh>
          <torusGeometry args={[radius3, 0.012, 16, 128]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.5} toneMapped={false} />
        </mesh>
      </group>
    </group>
  );
}

/**
 * Ambient Swirling Energy Particles
 */
function CityParticleField({ count = 220 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 0.8 + Math.random() * (SPHERE_RADIUS + 0.8);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.9;
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, [count]);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.035;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.045}
        color="#38bdf8"
        transparent
        opacity={0.7}
        sizeAttenuation
        toneMapped={false}
      />
    </points>
  );
}

/**
 * Master Metropolis CityScene:
 * City rotates inside the transparent glass sphere, while the entire sphere floats gently.
 */
export function CityScene({ reducedMotion, wireframeMode }: CitySceneProps) {
  const cityRotateGroupRef = useRef<THREE.Group>(null);
  const wholeSphereFloatGroupRef = useRef<THREE.Group>(null);
  const buildings = useMemo(() => generateMetropolis(), []);

  useFrame((state, delta) => {
    if (reducedMotion) return;

    // 1. Continuous smooth rotation of the city & biosphere inside the sphere
    if (cityRotateGroupRef.current) {
      cityRotateGroupRef.current.rotation.y += delta * 0.1;
    }

    // 2. Gentle breathing float of the entire sphere
    if (wholeSphereFloatGroupRef.current) {
      wholeSphereFloatGroupRef.current.position.y =
        Math.sin(state.clock.elapsedTime * 0.7) * 0.08;
    }
  });

  return (
    <group ref={wholeSphereFloatGroupRef}>
      {/* A. Interior Biosphere & City Group (Rotates continuously on Y) */}
      <group ref={cityRotateGroupRef}>
        <BiospherePlatform />
        <HighwayRingsAndDrones reducedMotion={reducedMotion} />
        <CentralCitadelSpire reducedMotion={reducedMotion} />
        {buildings.map((b, i) => (
          <BuildingMesh key={i} spec={b} wireframe={wireframeMode} />
        ))}
      </group>

      {/* B. Transparent Glass Sphere Enclosure */}
      <TransparentGlassSphere reducedMotion={reducedMotion} />

      {/* C. Outer Orbital Energy Rings */}
      <OrbitalRings reducedMotion={reducedMotion} />

      {/* D. Swirling Energy Particles */}
      <CityParticleField />
    </group>
  );
}
