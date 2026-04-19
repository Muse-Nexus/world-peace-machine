import { Suspense, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Html, Sphere, Text } from "@react-three/drei";
import * as THREE from "three";

/**
 * v.2 Globe — UN-official-looking, high-poly, more detailed.
 * - Smooth ocean sphere (UN blue) with atmosphere glow
 * - Procedural continents (coral/mustard splotches)
 * - Cloud shell, slowly drifting
 * - Higher-poly chunky planes circling, peaceful coral lasers
 * - Pet counter
 */

function Atmosphere() {
  return (
    <mesh scale={1.18}>
      <sphereGeometry args={[1.6, 64, 64]} />
      <meshBasicMaterial color="#4a9fff" transparent opacity={0.08} side={THREE.BackSide} />
    </mesh>
  );
}

function Continents() {
  // A constellation of small spheres on the ocean's surface to suggest landmasses.
  const blobs = useMemo(() => {
    const items: { pos: [number, number, number]; r: number; color: string }[] = [];
    const colors = ["#FF7F6E", "#E66B5C", "#F0B33A", "#FF8E80"]; // living coral + mustard
    const seed = [
      [0.9, 0.6, 1.1], [0.4, 0.9, 1.2], [1.3, 0.2, 0.7],
      [-0.9, 0.5, 1.1], [-1.2, -0.2, 0.9], [-0.5, -0.9, 1.1],
      [0.3, -1.0, 1.0], [1.0, -0.7, 0.8],
      [-1.3, 0.7, -0.4], [0.5, 1.2, -0.7], [1.0, 0.9, -0.6],
      [-0.6, -0.7, -1.2], [0.7, -1.1, -0.6], [-1.1, -0.9, -0.4],
      [0.2, 1.4, 0.4], [-1.4, 0.1, 0.4],
    ];
    seed.forEach((p, i) => {
      const v = new THREE.Vector3(...(p as [number, number, number])).normalize().multiplyScalar(1.61);
      items.push({
        pos: [v.x, v.y, v.z],
        r: 0.12 + (i % 4) * 0.05,
        color: colors[i % colors.length],
      });
    });
    return items;
  }, []);

  return (
    <group>
      {blobs.map((b, i) => (
        <mesh key={i} position={b.pos}>
          <sphereGeometry args={[b.r, 24, 24]} />
          <meshStandardMaterial color={b.color} roughness={0.9} flatShading />
        </mesh>
      ))}
    </group>
  );
}

function Clouds() {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((_, dt) => { if (ref.current) ref.current.rotation.y += dt * 0.04; });
  return (
    <mesh ref={ref} scale={1.04}>
      <sphereGeometry args={[1.6, 48, 48]} />
      <meshStandardMaterial
        color="#ffffff"
        transparent
        opacity={0.18}
        roughness={1}
        depthWrite={false}
      />
    </mesh>
  );
}

function Globe({ onPet }: { onPet: () => void }) {
  const ref = useRef<THREE.Mesh>(null!);
  const [hovered, setHovered] = useState(false);

  useFrame((_, dt) => { if (ref.current) ref.current.rotation.y += dt * 0.12; });

  return (
    <group
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={(e) => {
        e.stopPropagation();
        if (ref.current) ref.current.rotation.y += 0.6;
        onPet();
      }}
    >
      <mesh ref={ref}>
        <Sphere args={[1.6, 96, 96]}>
          <meshStandardMaterial
            color={hovered ? "#1a6fd6" : "#0E5DBA"}
            roughness={0.55}
            metalness={0.1}
          />
        </Sphere>
        <Continents />
        <Clouds />
      </mesh>
      <Atmosphere />
    </group>
  );
}

// A single 3D flower made of a center + petals
function Flower({ color = "#FF7F6E", scale = 1 }: { color?: string; scale?: number }) {
  const petals = 6;
  return (
    <group scale={scale}>
      {Array.from({ length: petals }).map((_, i) => {
        const a = (i / petals) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(a) * 0.06, Math.sin(a) * 0.06, 0]}>
            <sphereGeometry args={[0.05, 10, 10]} />
            <meshStandardMaterial color={color} roughness={0.7} />
          </mesh>
        );
      })}
      <mesh>
        <sphereGeometry args={[0.045, 12, 12]} />
        <meshStandardMaterial color="#F0B33A" roughness={0.6} />
      </mesh>
    </group>
  );
}

// Stream of flowers shot from the plane's nose, looping in short blasts
function FlowerStream({ colors }: { colors: string[] }) {
  const COUNT = 5;
  const refs = useRef<(THREE.Group | null)[]>([]);
  const flowers = useMemo(
    () => Array.from({ length: COUNT }).map((_, i) => ({
      color: colors[i % colors.length],
      offset: i / COUNT,
    })),
    [colors]
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    flowers.forEach((f, i) => {
      const g = refs.current[i];
      if (!g) return;
      // Each flower cycles 0..1 over ~1.2s, staggered. Short blast feel.
      const cycle = ((t * 0.85 + f.offset) % 1);
      const dist = cycle * 2.2; // travels forward
      g.position.set(0, 0, 0.5 + dist);
      const fade = Math.sin(cycle * Math.PI); // fade in & out
      g.scale.setScalar(0.6 + cycle * 0.8);
      g.rotation.z = cycle * Math.PI * 2;
      g.visible = fade > 0.05;
      g.traverse((child) => {
        const m = (child as THREE.Mesh).material as THREE.MeshStandardMaterial | undefined;
        if (m && "opacity" in m) {
          m.transparent = true;
          m.opacity = fade;
        }
      });
    });
  });

  return (
    <>
      {flowers.map((f, i) => (
        <group key={i} ref={(el) => (refs.current[i] = el)}>
          <Flower color={f.color} />
        </group>
      ))}
    </>
  );
}

function Plane({ radius, speed, offset, color, flowerColors }: { radius: number; speed: number; offset: number; color: string; flowerColors: string[] }) {
  const group = useRef<THREE.Group>(null!);

  useFrame((state) => {
    const t = state.clock.elapsedTime * speed + offset;
    if (group.current) {
      group.current.position.x = Math.cos(t) * radius;
      group.current.position.z = Math.sin(t) * radius;
      group.current.position.y = Math.sin(t * 0.5) * 0.4;
      group.current.rotation.y = -t + Math.PI / 2;
      group.current.rotation.z = Math.sin(t * 2) * 0.08;
    }
  });

  return (
    <group ref={group}>
      {/* Fuselage */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.07, 0.05, 0.55, 16]} />
        <meshStandardMaterial color={color} metalness={0.4} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0, 0.32]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.07, 0.18, 16]} />
        <meshStandardMaterial color={color} metalness={0.5} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0, -0.02]}>
        <boxGeometry args={[0.7, 0.03, 0.18]} />
        <meshStandardMaterial color={color} metalness={0.3} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.1, -0.22]}>
        <boxGeometry args={[0.03, 0.16, 0.12]} />
        <meshStandardMaterial color={color} metalness={0.3} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0, -0.22]}>
        <boxGeometry args={[0.28, 0.025, 0.1]} />
        <meshStandardMaterial color={color} metalness={0.3} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.05, 0.05]}>
        <sphereGeometry args={[0.06, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#cdeaff" metalness={0.6} roughness={0.1} />
      </mesh>
      {/* Flowers shot from the nose */}
      <FlowerStream colors={flowerColors} />
    </group>
  );
}

// Banner-towing plane that loops across the sky
function BannerPlane() {
  const group = useRef<THREE.Group>(null!);
  const radius = 3.6;
  const speed = 0.25;
  const yLevel = 1.8;

  useFrame((state) => {
    const t = state.clock.elapsedTime * speed;
    if (group.current) {
      group.current.position.x = Math.cos(t) * radius;
      group.current.position.z = Math.sin(t) * radius;
      group.current.position.y = yLevel + Math.sin(t * 1.2) * 0.15;
      group.current.rotation.y = -t + Math.PI / 2;
    }
  });

  return (
    <group ref={group}>
      {/* Plane body */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.08, 0.06, 0.6, 16]} />
        <meshStandardMaterial color="#F0B33A" metalness={0.4} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0, 0.35]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.08, 0.2, 16]} />
        <meshStandardMaterial color="#F0B33A" metalness={0.5} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0, -0.02]}>
        <boxGeometry args={[0.8, 0.035, 0.2]} />
        <meshStandardMaterial color="#F0B33A" metalness={0.3} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.12, -0.25]}>
        <boxGeometry args={[0.035, 0.18, 0.13]} />
        <meshStandardMaterial color="#F0B33A" metalness={0.3} roughness={0.5} />
      </mesh>
      {/* Tow rope */}
      <mesh position={[0, 0, -0.7]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.005, 0.005, 0.6, 6]} />
        <meshBasicMaterial color="#222" />
      </mesh>
      {/* Banner */}
      <group position={[0, 0, -1.6]}>
        <mesh>
          <planeGeometry args={[1.6, 0.32]} />
          <meshStandardMaterial color="#ffffff" side={THREE.DoubleSide} roughness={0.9} />
        </mesh>
        <Text
          position={[0, 0, 0.01]}
          fontSize={0.12}
          color="#0E5DBA"
          anchorX="center"
          anchorY="middle"
          maxWidth={1.5}
          textAlign="center"
        >
          NOW WITH 118% LESS NUKES
        </Text>
        <Text
          position={[0, 0, -0.01]}
          rotation={[0, Math.PI, 0]}
          fontSize={0.12}
          color="#0E5DBA"
          anchorX="center"
          anchorY="middle"
          maxWidth={1.5}
          textAlign="center"
        >
          NOW WITH 118% LESS NUKES
        </Text>
      </group>
      {/* Banner plane also shoots flowers */}
      <FlowerStream colors={["#FF7F6E", "#F0B33A", "#ffffff"]} />
    </group>
  );
}

function Scene({ onPet }: { onPet: () => void }) {
  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight position={[5, 5, 5]} intensity={1.4} color="#ffffff" />
      <directionalLight position={[-5, -3, -5]} intensity={0.5} color="#FF7F6E" />
      <Stars radius={60} depth={30} count={800} factor={2.5} fade speed={0.4} />
      <Globe onPet={onPet} />
      <Plane radius={2.6} speed={0.6} offset={0} color="#0E5DBA" flowerColors={["#FF7F6E", "#F0B33A"]} />
      <Plane radius={2.9} speed={0.45} offset={2.1} color="#FF7F6E" flowerColors={["#ffffff", "#F0B33A"]} />
      <Plane radius={2.4} speed={0.8} offset={4.2} color="#F0B33A" flowerColors={["#FF7F6E", "#ffffff"]} />
      <Plane radius={3.1} speed={0.35} offset={1.0} color="#ffffff" flowerColors={["#FF7F6E", "#0E5DBA"]} />
      <Plane radius={2.7} speed={0.55} offset={3.4} color="#0E5DBA" flowerColors={["#FF7F6E", "#F0B33A"]} />
      <BannerPlane />
    </>
  );
}

export const Globe3D = () => {
  const [pets, setPets] = useState(0);

  return (
    <div className="relative w-full h-full">
      <Canvas camera={{ position: [0, 0.5, 5.5], fov: 55 }} dpr={[1, 2]}>
        <Suspense fallback={<Html center><p className="font-mono text-foreground">loading peace…</p></Html>}>
          <Scene onPet={() => setPets((p) => p + 1)} />
          <OrbitControls
            enablePan={false}
            enableZoom={false}
            autoRotate
            autoRotateSpeed={0.3}
            minPolarAngle={Math.PI / 3}
            maxPolarAngle={(2 * Math.PI) / 3}
          />
        </Suspense>
      </Canvas>

      <div className="absolute bottom-3 left-3 official-border bg-card px-3 py-2 official-shadow-sm">
        <p className="text-xs font-mono uppercase">
          🌍 TIMES PEOPLE TOUCHED MY GLOBE: <span className="font-display text-primary">{pets}</span>
        </p>
        <p className="text-[10px] font-mono text-muted-foreground">drag · click · planes shoot peaceful coral lasers</p>
      </div>
      <div className="absolute top-3 right-3 stamp text-[10px]">UN-ADJACENT · OFFICIAL-ISH</div>
    </div>
  );
};
