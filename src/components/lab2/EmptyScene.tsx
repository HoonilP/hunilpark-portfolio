'use client';

export default function EmptyScene() {
  return (
    <>
      {/* Subtle ambient lighting for the empty scene */}
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 3, 0]} intensity={0.5} color="#ffffff" />
      {/* Ground reference plane — subtle wireframe grid */}
      <gridHelper args={[10, 10, '#333333', '#222222']} position={[0, 0, 0]} />
    </>
  );
}
