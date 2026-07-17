import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Planet — an interactive chapter marker used along the expedition.
 * Rotates continuously; hover accelerates spin and brightens glow.
 * Self-contained (procedural sphere + optional ring), no external assets.
 */
function PlanetMesh({
  color,
  ring,
  onHover,
}: {
  color: string;
  ring: boolean;
  onHover: (h: boolean) => void;
}) {
  const group = useRef<THREE.Group>(null!);
  const planet = useRef<THREE.Mesh>(null!);
  const [hover, setHover] = useState(false);

  useFrame((_, delta) => {
    if (planet.current) planet.current.rotation.y += delta * (hover ? 0.4 : 0.15);
    if (group.current) group.current.rotation.z += delta * (hover ? 0.25 : 0.05);
  });

  return (
    <group
      ref={group}
      onPointerOver={() => {
        setHover(true);
        onHover(true);
      }}
      onPointerOut={() => {
        setHover(false);
        onHover(false);
      }}
    >
      <mesh ref={planet}>
        <sphereGeometry args={[1, 48, 48]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hover ? 0.6 : 0.3}
          roughness={0.6}
          metalness={0.1}
        />
      </mesh>
      {ring && (
        <mesh rotation={[Math.PI / 2.2, 0, 0]}>
          <torusGeometry args={[1.6, 0.08, 16, 80]} />
          <meshBasicMaterial color={color} transparent opacity={0.5} />
        </mesh>
      )}
      {/* point light tinted to the planet's palette */}
      <pointLight color={color} intensity={hover ? 2 : 1} distance={8} />
    </group>
  );
}

export default function Planet({
  color = "#6C7CFF",
  ring = false,
  className = "",
}: {
  color?: string;
  ring?: boolean;
  className?: string;
}) {
  return (
    <div className={className}>
      <Canvas camera={{ position: [0, 0, 3.4], fov: 40 }} gl={{ alpha: true }}>
        <ambientLight intensity={0.4} />
        <PlanetMesh color={color} ring={ring} onHover={() => {}} />
      </Canvas>
    </div>
  );
}
