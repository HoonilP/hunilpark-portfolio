'use client';

export default function Lighting() {
  return (
    <>
      <ambientLight intensity={0.6} />

      {/* Main overhead light */}
      <directionalLight
        position={[2, 4, 2]}
        intensity={1}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      {/* Warm room fill from side */}
      <pointLight position={[-1, 2, 0]} intensity={0.5} color="#f5e6d0" distance={5} />
      <pointLight position={[1, 2, -1]} intensity={0.4} color="#e8dcc8" distance={5} />

      {/* Subtle blue/cool fill */}
      <hemisphereLight intensity={0.3} groundColor="#1a1a2e" color="#b0c4de" />
    </>
  );
}
