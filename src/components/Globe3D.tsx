import { Suspense, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Html, Sphere } from "@react-three/drei";
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

function Plane({ radius, speed, offset, color }: { radius: number; speed: number; offset: number; color: string }) {
  const group = useRef<THREE.Group>(null!);
  const laser = useRef<THREE.Mesh>(null!);
  const trail = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const t = state.clock.elapsedTime * speed + offset;
    if (group.current) {
      group.current.position.x = Math.cos(t) * radius;
      group.current.position.z = Math.sin(t) * radius;
      group.current.position.y = Math.sin(t * 0.5) * 0.4;
      group.current.rotation.y = -t + Math.PI / 2;
      group.current.rotation.z = Math.sin(t * 2) * 0.08;
    }
    const pulse = (Math.sin(state.clock.elapsedTime * 5 + offset) + 1) / 2;
    if (laser.current) {
      laser.current.scale.y = 0.6 + pulse * 1.6;
      (laser.current.material as THREE.MeshBasicMaterial).opacity = pulse * 0.95;
    }
    if (trail.current) {
      (trail.current.material as THREE.MeshBasicMaterial).opacity = 0.25 + pulse * 0.25;
    }
  });

  return (
    <group ref={group}>
      {/* Fuselage — higher poly cylinder */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.07, 0.05, 0.55, 16]} />
        <meshStandardMaterial color={color} metalness={0.4} roughness={0.4} />
      </mesh>
      {/* Nose cone */}
      <mesh position={[0, 0, 0.32]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.07, 0.18, 16]} />
        <meshStandardMaterial color={color} metalness={0.5} roughness={0.3} />
      </mesh>
      {/* Wings */}
      <mesh position={[0, 0, -0.02]}>
        <boxGeometry args={[0.7, 0.03, 0.18]} />
        <meshStandardMaterial color={color} metalness={0.3} roughness={0.5} />
      </mesh>
      {/* Tail fin */}
      <mesh position={[0, 0.1, -0.22]}>
        <boxGeometry args={[0.03, 0.16, 0.12]} />
        <meshStandardMaterial color={color} metalness={0.3} roughness={0.5} />
      </mesh>
      {/* Tail wings */}
      <mesh position={[0, 0, -0.22]}>
        <boxGeometry args={[0.28, 0.025, 0.1]} />
        <meshStandardMaterial color={color} metalness={0.3} roughness={0.5} />
      </mesh>
      {/* Cockpit dome */}
      <mesh position={[0, 0.05, 0.05]}>
        <sphereGeometry args={[0.06, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#cdeaff" metalness={0.6} roughness={0.1} />
      </mesh>
      {/* Peaceful coral laser beam */}
      <mesh ref={laser} position={[0, 0, 0.85]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.018, 0.018, 1.4, 12]} />
        <meshBasicMaterial color="#FF7F6E" transparent opacity={0.9} />
      </mesh>
      {/* Laser glow halo */}
      <mesh ref={trail} position={[0, 0, 0.85]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 1.4, 12]} />
        <meshBasicMaterial color="#FF7F6E" transparent opacity={0.3} />
      </mesh>
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
      <Plane radius={2.6} speed={0.6} offset={0} color="#0E5DBA" />
      <Plane radius={2.9} speed={0.45} offset={2.1} color="#FF7F6E" />
      <Plane radius={2.4} speed={0.8} offset={4.2} color="#F0B33A" />
      <Plane radius={3.1} speed={0.35} offset={1.0} color="#ffffff" />
      <Plane radius={2.7} speed={0.55} offset={3.4} color="#0E5DBA" />
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
          🌍 Globe pets: <span className="font-display text-primary">{pets}</span>
        </p>
        <p className="text-[10px] font-mono text-muted-foreground">drag · click · planes shoot peaceful coral lasers</p>
      </div>
      <div className="absolute top-3 right-3 stamp text-[10px]">UN-ADJACENT · OFFICIAL-ISH</div>
    </div>
  );
};
