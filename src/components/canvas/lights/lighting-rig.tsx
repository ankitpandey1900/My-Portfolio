'use client';

export function LightingRig() {
  return (
    <group name="lighting-rig">
      {/* Subdued ambient light for space shadows */}
      <hemisphereLight args={['#080c10', '#000000', 0.15]} />
      {/* Powerful main sun illumination */}
      <directionalLight position={[-30, 22, 18]} color="#fff0dc" intensity={2.5} castShadow={false} />
    </group>
  );
}
export default LightingRig;

