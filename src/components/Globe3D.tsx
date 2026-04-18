import { Suspense, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Html } from "@react-three/drei";
import * as THREE from "three";

/**
 * Brutalist-Peace globe.
 * - Draggable spinny earth (low-poly, gritty palette)
 * - Planes circling, shooting lasers at NOTHING (peaceful lasers)
 * - Click globe to bump rotation; "Pet the globe" counter
 */

function Globe({ onPet }: { onPet: () => void }) {
  const ref = useRef<THREE.Mesh>(null!);
  const [hovered, setHovered] = useState(false);

  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.15;
  });

  return (
    <mesh
      ref={ref}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={(e) => {
        e.stopPropagation();
        if (ref.current) ref.current.rotation.y += 0.6;
        onPet();
      }}
    >
      <icosahedronGeometry args={[1.6, 4]} />
      <meshStandardMaterial
        color={hovered ? "#1f6b6b" : "#2a4a4a"}
        roughness={0.85}
        metalness={0.1}
        flatShading
        wireframe={false}
      />
      {/* land splotches */}
      <mesh position={[0.9, 0.4, 1.2]}>
        <sphereGeometry args={[0.45, 12, 12]} />
        <meshStandardMaterial color="#8a6a3a" flatShading roughness={1} />
      </mesh>
      <mesh position={[-1.0, -0.5, 1.0]}>
        <sphereGeometry args={[0.55, 12, 12]} />
        <meshStandardMaterial color="#7a5a2a" flatShading roughness={1} />
      </mesh>
      <mesh position={[0.2, 1.2, -1.0]}>
        <sphereGeometry args={[0.4, 12, 12]} />
        <meshStandardMaterial color="#9a7a4a" flatShading roughness={1} />
      </mesh>
    </mesh>
  );
}

function Plane({ radius, speed, offset, color }: { radius: number; speed: number; offset: number; color: string }) {
  const group = useRef<THREE.Group>(null!);
  const laser = useRef<THREE.Mesh>(null!);
  const [firing, setFiring] = useState(0);

  useFrame((state) => {
    const t = state.clock.elapsedTime * speed + offset;
    if (group.current) {
      group.current.position.x = Math.cos(t) * radius;
      group.current.position.z = Math.sin(t) * radius;
      group.current.position.y = Math.sin(t * 0.5) * 0.3;
      group.current.rotation.y = -t + Math.PI / 2;
    }
    // Pulse laser
    const pulse = (Math.sin(state.clock.elapsedTime * 4 + offset) + 1) / 2;
    setFiring(pulse);
    if (laser.current) {
      laser.current.scale.y = 0.5 + pulse * 1.5;
      (laser.current.material as THREE.MeshBasicMaterial).opacity = pulse * 0.9;
    }
  });

  return (
    <group ref={group}>
      {/* Plane body — chunky brutalist shape */}
      <mesh>
        <boxGeometry args={[0.25, 0.08, 0.5]} />
        <meshStandardMaterial color={color} flatShading />
      </mesh>
      <mesh position={[0, 0, -0.05]}>
        <boxGeometry args={[0.6, 0.04, 0.15]} />
        <meshStandardMaterial color={color} flatShading />
      </mesh>
      <mesh position={[0, 0.08, -0.18]}>
        <boxGeometry args={[0.2, 0.12, 0.08]} />
        <meshStandardMaterial color={color} flatShading />
      </mesh>
      {/* Laser beam pointing forward — peaceful laser */}
      <mesh ref={laser} position={[0, 0, 0.6]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 1.2, 6]} />
        <meshBasicMaterial color="#ff6b1a" transparent opacity={firing} />
      </mesh>
    </group>
  );
}

function Scene({ onPet }: { onPet: () => void }) {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} color="#ffd9a8" />
      <directionalLight position={[-5, -3, -5]} intensity={0.4} color="#b03030" />
      <Stars radius={50} depth={20} count={400} factor={2} fade speed={0.5} />
      <Globe onPet={onPet} />
      <Plane radius={2.6} speed={0.6} offset={0} color="#c14a14" />
      <Plane radius={2.9} speed={0.45} offset={2.1} color="#7a2222" />
      <Plane radius={2.4} speed={0.8} offset={4.2} color="#d4a017" />
      <Plane radius={3.1} speed={0.35} offset={1.0} color="#2a6868" />
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
            autoRotateSpeed={0.4}
            minPolarAngle={Math.PI / 3}
            maxPolarAngle={(2 * Math.PI) / 3}
          />
        </Suspense>
      </Canvas>

      <div className="absolute bottom-3 left-3 brutal-border bg-card px-3 py-2 brutal-shadow-sm">
        <p className="text-xs font-mono uppercase">
          🪐 Globe pets: <span className="font-display text-primary">{pets}</span>
        </p>
        <p className="text-[10px] font-mono text-muted-foreground">drag · click globe · planes shoot peaceful lasers</p>
      </div>
      <div className="absolute top-3 right-3 stamp text-[10px]">FIDGET-CERTIFIED</div>
    </div>
  );
};
