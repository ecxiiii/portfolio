import { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

const CAP_W = 1;
const CAP_H = 0.44;
const CAP_D = 1;

export function Keycap({ tech, position, isActive, onActivate }) {
  const groupRef = useRef(null);
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  const accent = useMemo(() => new THREE.Color(tech.accent), [tech.accent]);

  useFrame(() => {
    if (!groupRef.current) return;
    const targetY = pressed ? -0.08 : hovered || isActive ? 0.08 : 0;
    groupRef.current.position.y += (targetY - groupRef.current.position.y) * 0.2;
  });

  const lit = hovered || isActive;

  return (
    <group position={position}>
      <group ref={groupRef}>
        {/* Cap body — rounded, beveled edges catch rim light */}
        <RoundedBox
          args={[CAP_W, CAP_H, CAP_D]}
          radius={0.06}
          smoothness={4}
          position={[0, CAP_H / 2, 0]}
          castShadow
          receiveShadow
          onPointerOver={(e) => {
            e.stopPropagation();
            setHovered(true);
            onActivate();
            document.body.style.cursor = 'pointer';
          }}
          onPointerOut={(e) => {
            e.stopPropagation();
            setHovered(false);
            document.body.style.cursor = 'auto';
          }}
          onPointerDown={(e) => {
            e.stopPropagation();
            setPressed(true);
            onActivate();
          }}
          onPointerUp={(e) => {
            e.stopPropagation();
            setPressed(false);
          }}
        >
          <meshStandardMaterial
            color={lit ? '#0d1412' : '#232329'}
            metalness={0.45}
            roughness={0.45}
            emissive={accent}
            emissiveIntensity={lit ? 2.6 : 0.35}
          />
        </RoundedBox>

        {/* Inset dish on top — subtle concave hint. Slightly smaller and darker. */}
        <mesh position={[0, CAP_H - 0.003, 0]} rotation={[-Math.PI / 2, 0, 0]} raycast={() => null}>
          <planeGeometry args={[CAP_W - 0.12, CAP_D - 0.12]} />
          <meshStandardMaterial
            color={lit ? '#050807' : '#18181b'}
            metalness={0.3}
            roughness={0.75}
            emissive={accent}
            emissiveIntensity={lit ? 0.8 : 0.08}
          />
        </mesh>

        {/* Printed glyph */}
        <Text
          position={[0, CAP_H + 0.004, -0.05]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.32}
          fontWeight="bold"
          color={lit ? '#ffffff' : '#e4e4e7'}
          anchorX="center"
          anchorY="middle"
          material-toneMapped={false}
          raycast={() => null}
          outlineWidth={lit ? 0.01 : 0}
          outlineColor={tech.accent}
          outlineOpacity={lit ? 0.9 : 0}
        >
          {tech.key}
        </Text>

        {/* Tech name — small subscript */}
        <Text
          position={[0, CAP_H + 0.004, 0.34]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.085}
          color={lit ? '#a7f3d0' : '#a1a1aa'}
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.05}
          material-toneMapped={false}
          raycast={() => null}
        >
          {tech.name.toUpperCase()}
        </Text>
      </group>
    </group>
  );
}
