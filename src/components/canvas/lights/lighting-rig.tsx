'use client';

export function LightingRig() {
  return (
    <group name="lighting-rig">
      <hemisphereLight args={['#121820', '#020204', 0.06]} />
      <directionalLight position={[-30, 22, 18]} color="#fff0dc" intensity={0.22} castShadow={false} />
    </group>
  );
}
export default LightingRig;

