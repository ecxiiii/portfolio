import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { ContactShadows, OrbitControls, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { Keycap } from './Keycap';
import { techStack } from '../data/techStack';

const SPACING = 1.2;
const BASE_W = 5.8;
const BASE_D = 5.8;
const BASE_H = 0.32;

export function KeyboardScene({ activeName, onActivate }) {
  const spotRef = useRef(null);
  const spotTargetRef = useRef(new THREE.Object3D());
  const haloRef = useRef(null);

  // Per-frame: cursor-tracking spotlight + breathing RGB halo
  useFrame((state) => {
    const { pointer, clock } = state;

    if (spotRef.current) {
      const targetX = pointer.x * 3.5;
      const targetZ = -pointer.y * 2.5 + 0.5;
      spotRef.current.position.x += (targetX - spotRef.current.position.x) * 0.08;
      spotRef.current.position.z += (targetZ - spotRef.current.position.z) * 0.08;
      spotTargetRef.current.position.x += (pointer.x * 2 - spotTargetRef.current.position.x) * 0.08;
      spotTargetRef.current.position.z += (-pointer.y * 1.5 - spotTargetRef.current.position.z) * 0.08;
    }

    // Underglow breathes in opacity — RGB "heartbeat"
    if (haloRef.current) {
      const t = clock.elapsedTime;
      haloRef.current.material.opacity = 0.35 + Math.sin(t * 1.4) * 0.12;
    }
  });

  return (
    <>
      {/* Free-orbit controls — user can rotate 360° around Y, polar constrained */}
      <OrbitControls
        makeDefault
        enablePan={false}
        enableZoom={false}
        autoRotate
        autoRotateSpeed={0.55}
        minPolarAngle={Math.PI * 0.18}
        maxPolarAngle={Math.PI * 0.52}
        enableDamping
        dampingFactor={0.08}
      />

      {/* Two-tone hemisphere fill — cool sky over dark ground */}
      <hemisphereLight args={['#4a5f7a', '#0a0a0c', 0.9]} />
      <ambientLight intensity={0.3} />

      {/* Key light */}
      <directionalLight
        position={[5, 9, 5]}
        intensity={2.6}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-7}
        shadow-camera-right={7}
        shadow-camera-top={7}
        shadow-camera-bottom={-7}
        shadow-camera-near={0.5}
        shadow-camera-far={25}
        shadow-bias={-0.0005}
      />

      {/* Cursor-tracking emerald spotlight */}
      <primitive object={spotTargetRef.current} />
      <spotLight
        ref={spotRef}
        position={[0, 6, 1]}
        target={spotTargetRef.current}
        angle={0.55}
        penumbra={0.75}
        intensity={220}
        color="#10b981"
        distance={18}
        decay={1.2}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-bias={-0.0005}
      />

      {/* Cool rim + warm rim — side lighting gives the board dimensionality on orbit */}
      <pointLight position={[-4, 2.5, -4]} intensity={55} color="#60a5fa" distance={14} decay={1.5} />
      <pointLight position={[4, 2, -4]} intensity={40} color="#f472b6" distance={12} decay={1.5} />
      <pointLight position={[0, 1, 5]} intensity={30} color="#10b981" distance={10} decay={1.8} />

      <group position={[0, 0, 0]}>
        {/* ── RGB perimeter underglow — slightly larger emissive plate beneath the body ── */}
        <RoundedBox
          ref={haloRef}
          args={[BASE_W + 0.35, 0.08, BASE_D + 0.35]}
          radius={0.18}
          smoothness={4}
          position={[0, -BASE_H + 0.02, 0]}
        >
          <meshBasicMaterial color="#10b981" transparent opacity={0.4} toneMapped={false} />
        </RoundedBox>

        {/* ── Main body — brushed anodized aluminum ── */}
        <RoundedBox
          args={[BASE_W, BASE_H, BASE_D]}
          radius={0.1}
          smoothness={4}
          position={[0, -BASE_H / 2, 0]}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial
            color="#1a1a1f"
            metalness={0.92}
            roughness={0.22}
          />
        </RoundedBox>

        {/* Dark recessed inner well — where the keys sit */}
        <RoundedBox
          args={[BASE_W - 0.6, 0.02, BASE_D - 0.6]}
          radius={0.04}
          smoothness={4}
          position={[0, 0.005, 0]}
          receiveShadow
        >
          <meshStandardMaterial color="#08080a" metalness={0.3} roughness={0.9} />
        </RoundedBox>

        {/* ── ROG-style diagonal accent stripes on top corners ── */}
        {[[2.35, 2.35, Math.PI / 4], [-2.35, 2.35, -Math.PI / 4], [2.35, -2.35, -Math.PI / 4], [-2.35, -2.35, Math.PI / 4]].map(([x, z, rot], i) => (
          <mesh key={i} position={[x, 0.012, z]} rotation={[0, rot, 0]}>
            <boxGeometry args={[0.7, 0.006, 0.04]} />
            <meshBasicMaterial color="#10b981" toneMapped={false} />
          </mesh>
        ))}

        {/* Secondary thin accent lines */}
        {[[1.9, 2.5, Math.PI / 4], [-1.9, 2.5, -Math.PI / 4], [1.9, -2.5, -Math.PI / 4], [-1.9, -2.5, Math.PI / 4]].map(([x, z, rot], i) => (
          <mesh key={i} position={[x, 0.012, z]} rotation={[0, rot, 0]}>
            <boxGeometry args={[0.4, 0.004, 0.02]} />
            <meshBasicMaterial color="#34d399" toneMapped={false} />
          </mesh>
        ))}

        {/* Beveled front lip with emissive edge (ROG signature lightbar) */}
        <mesh position={[0, -BASE_H + 0.08, BASE_D / 2 + 0.01]} rotation={[0, 0, 0]}>
          <boxGeometry args={[BASE_W - 0.6, 0.04, 0.02]} />
          <meshBasicMaterial color="#10b981" toneMapped={false} />
        </mesh>

        {/* 16 keycaps */}
        {techStack.map((tech, i) => {
          const row = Math.floor(i / 4);
          const col = i % 4;
          const x = (col - 1.5) * SPACING;
          const z = (row - 1.5) * SPACING;
          return (
            <Keycap
              key={tech.name}
              tech={tech}
              position={[x, 0, z]}
              isActive={activeName === tech.name}
              onActivate={() => onActivate(tech, i)}
            />
          );
        })}
      </group>

      <ContactShadows
        position={[0, -0.33, 0]}
        opacity={0.6}
        scale={16}
        blur={3}
        far={4}
        resolution={1024}
      />
    </>
  );
}
