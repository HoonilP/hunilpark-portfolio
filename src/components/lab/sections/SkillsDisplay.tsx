'use client';

import {useRef} from 'react';
import {Text} from '@react-three/drei';
import {useFrame} from '@react-three/fiber';
import * as THREE from 'three';

const SKILL_CATEGORIES = [
  {
    name: 'Frontend',
    skills: ['TypeScript', 'React', 'Next.js', 'Angular', 'VanillaJS'],
    color: '#3b82f6',
    position: [-3, 0, 0] as [number, number, number],
  },
  {
    name: 'Backend',
    skills: ['NestJS', 'FastAPI', 'Python'],
    color: '#10b981',
    position: [-1, 0, 0] as [number, number, number],
  },
  {
    name: 'DevOps',
    skills: ['AWS', 'Docker', 'Kubernetes'],
    color: '#f59e0b',
    position: [1, 0, 0] as [number, number, number],
  },
  {
    name: 'Database',
    skills: ['MySQL', 'PostgreSQL'],
    color: '#8b5cf6',
    position: [3, 0, 0] as [number, number, number],
  },
];

function SkillBadge({
  text,
  position,
  color,
  delay,
}: {
  text: string;
  position: [number, number, number];
  color: string;
  delay: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.8 + delay) * 0.05;
    }
  });

  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <boxGeometry args={[0.8, 0.28, 0.04]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.15}
          emissive={color}
          emissiveIntensity={0.3}
        />
      </mesh>
      <Text
        fontSize={0.08}
        color="#e0e0e0"
        anchorX="center"
        anchorY="middle"
        position={[0, position[1], 0.03]}
      >
        {text}
      </Text>
    </group>
  );
}

function SkillCategory({
  category,
  basePosition,
}: {
  category: typeof SKILL_CATEGORIES[0];
  basePosition: [number, number, number];
}) {
  return (
    <group position={basePosition}>
      <Text
        fontSize={0.12}
        color={category.color}
        anchorX="center"
        anchorY="middle"
        position={[0, 1, 0]}
        letterSpacing={0.12}
      >
        {category.name.toUpperCase()}
      </Text>

      <mesh position={[0, 0.7, 0]}>
        <boxGeometry args={[0.6, 0.005, 0.005]} />
        <meshStandardMaterial color={category.color} emissive={category.color} emissiveIntensity={0.5} />
      </mesh>

      {category.skills.map((skill, i) => (
        <SkillBadge
          key={skill}
          text={skill}
          position={[0, 0.35 - i * 0.35, 0]}
          color={category.color}
          delay={i * 0.5}
        />
      ))}
    </group>
  );
}

export default function SkillsDisplay() {
  return (
    <group position={[0, 1, -8]}>
      <Text
        fontSize={0.1}
        color="#666666"
        anchorX="center"
        anchorY="middle"
        position={[0, 2.2, 0]}
        letterSpacing={0.2}
      >
        SKILLS
      </Text>

      {SKILL_CATEGORIES.map((cat) => (
        <SkillCategory
          key={cat.name}
          category={cat}
          basePosition={cat.position}
        />
      ))}
    </group>
  );
}
