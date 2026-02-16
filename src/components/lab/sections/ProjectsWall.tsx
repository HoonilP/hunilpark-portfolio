'use client';

import {useRef} from 'react';
import {useLoader} from '@react-three/fiber';
import {Text} from '@react-three/drei';
import * as THREE from 'three';

const PROJECTS = [
  {id: '6', title: 'Ministry of Truth', tech: 'Next.js / NestJS / Solidity', color: '#8b5cf6', thumbnail: '/projects/6/thumbnail.webp'},
  {id: '2', title: 'DY CMS', tech: 'Next.js / NestJS / PostgreSQL', color: '#3b82f6', thumbnail: '/projects/2/thumbnail.webp'},
  {id: '1', title: 'Joshua', tech: 'Electron / Angular / FastAPI', color: '#10b981', thumbnail: '/projects/1/thumbnail.webp'},
  {id: '3', title: 'Retail Analysis', tech: 'Pytorch / YOLO / VanillaJS', color: '#f59e0b', thumbnail: '/projects/3/thumbnail.webp'},
  {id: '4', title: 'Scholarly Chain', tech: 'Next.js / React / Firebase', color: '#ec4899', thumbnail: '/projects/4/thumbnail.webp'},
  {id: '5', title: 'Dino Go', tech: 'Next.js / Three.js / Move', color: '#06b6d4', thumbnail: '/projects/5/thumbnail.webp'},
];

function ProjectFrame({
  project,
  position,
  index,
}: {
  project: typeof PROJECTS[0];
  position: [number, number, number];
  index: number;
}) {
  const frameRef = useRef<THREE.Group>(null);
  const texture = useLoader(THREE.TextureLoader, project.thumbnail);

  return (
    <group ref={frameRef} position={position} rotation={[0, Math.PI / 2, 0]}>
      {/* Frame border */}
      <mesh>
        <boxGeometry args={[1.8, 1.3, 0.08]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Inner frame (gold accent) */}
      <mesh position={[0, 0, 0.02]}>
        <boxGeometry args={[1.7, 1.2, 0.02]} />
        <meshStandardMaterial color="#b8960c" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Project thumbnail */}
      <mesh position={[0, 0, 0.05]}>
        <planeGeometry args={[1.5, 1.0]} />
        <meshBasicMaterial map={texture} />
      </mesh>

      {/* Number plate */}
      <Text
        fontSize={0.06}
        color="#888888"
        anchorX="left"
        anchorY="top"
        position={[-0.75, -0.72, 0.05]}
        letterSpacing={0.1}
      >
        {String(index + 1).padStart(2, '0')}
      </Text>

      {/* Title */}
      <Text
        fontSize={0.08}
        color="#ffffff"
        anchorX="center"
        anchorY="top"
        position={[0, -0.74, 0.05]}
        letterSpacing={0.05}
      >
        {project.title}
      </Text>

      {/* Tech stack */}
      <Text
        fontSize={0.045}
        color="#888888"
        anchorX="center"
        anchorY="top"
        position={[0, -0.88, 0.05]}
        letterSpacing={0.03}
      >
        {project.tech}
      </Text>

      {/* Accent light */}
      <pointLight
        position={[0, -0.9, 0.5]}
        intensity={0.2}
        color={project.color}
        distance={3}
      />
    </group>
  );
}

export default function ProjectsWall() {
  // 6 frames in 2 rows of 3 along the left wall (x = -19)
  const positions: [number, number, number][] = [
    [-19, 2.2, 5],
    [-19, 2.2, 2],
    [-19, 2.2, -1],
    [-19, 0.8, 5],
    [-19, 0.8, 2],
    [-19, 0.8, -1],
  ];

  return (
    <group>
      {/* Section label */}
      <Text
        fontSize={0.1}
        color="#666666"
        anchorX="left"
        anchorY="middle"
        position={[-18.5, 3, 7]}
        rotation={[0, Math.PI / 2, 0]}
        letterSpacing={0.2}
      >
        COLLECTIONS
      </Text>

      {PROJECTS.map((project, i) => (
        <ProjectFrame
          key={project.id}
          project={project}
          position={positions[i]}
          index={i}
        />
      ))}
    </group>
  );
}
