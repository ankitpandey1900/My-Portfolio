// ─────────────────────────────────────────────────────────────────────────────
// Particle Renderer
// Connects the CPU ParticlePool to the GPU InstancedMesh.
// ─────────────────────────────────────────────────────────────────────────────
import * as React from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { createParticleMaterial } from './particle-material';
import type { ParticlePool } from './particle-pool';

interface ParticleRendererProps {
  pool: ParticlePool;
}

export function ParticleRenderer({ pool }: ParticleRendererProps) {
  const meshRef = React.useRef<THREE.InstancedMesh>(null);
  const geometryRef = React.useRef<THREE.InstancedBufferGeometry>(null);

  // Initialize geometries and attributes once
  const { geometry, material } = React.useMemo(() => {
    const geo = new THREE.InstancedBufferGeometry();

    // Base plane for billboarding
    const plane = new THREE.PlaneGeometry(1, 1);
    geo.index = plane.index;
    geo.attributes.position = plane.attributes.position as THREE.BufferAttribute;
    geo.attributes.uv = plane.attributes.uv as THREE.BufferAttribute;

    // Instanced attributes synced to the pool's arrays
    geo.setAttribute(
      'aInstancePositionStart',
      new THREE.InstancedBufferAttribute(pool.positionStart, 3)
    );
    geo.setAttribute('aVelocity', new THREE.InstancedBufferAttribute(pool.velocity, 3));
    geo.setAttribute('aAcceleration', new THREE.InstancedBufferAttribute(pool.acceleration, 3));
    geo.setAttribute('aColorStart', new THREE.InstancedBufferAttribute(pool.colorStart, 3));
    geo.setAttribute('aColorEnd', new THREE.InstancedBufferAttribute(pool.colorEnd, 3));
    geo.setAttribute('aSize', new THREE.InstancedBufferAttribute(pool.size, 1));
    geo.setAttribute('aRotationParams', new THREE.InstancedBufferAttribute(pool.rotationParams, 2));
    geo.setAttribute('aTimeParams', new THREE.InstancedBufferAttribute(pool.timeParams, 2));
    geo.setAttribute('aOpacityParams', new THREE.InstancedBufferAttribute(pool.opacityParams, 2));

    const mat = createParticleMaterial();

    return { geometry: geo, material: mat };
  }, [pool]);

  /* eslint-disable react-hooks/immutability */
  useFrame((state) => {
    if (material.uniforms.uTime) {
      // eslint-disable-next-line react-hooks/immutability
      material.uniforms.uTime.value = state.clock.elapsedTime;
    }

    if (geometryRef.current && pool.hasDirtyRange()) {
      const geo = geometryRef.current;

      const start = pool.dirtyStart;
      const count = pool.dirtyEnd - pool.dirtyStart + 1;

      const updateAttr = (name: string) => {
        const attr = geo.attributes[name] as THREE.InstancedBufferAttribute;
        attr.clearUpdateRanges();
        attr.addUpdateRange(start * attr.itemSize, count * attr.itemSize);
        attr.needsUpdate = true;
      };

      updateAttr('aInstancePositionStart');
      updateAttr('aVelocity');
      updateAttr('aAcceleration');
      updateAttr('aColorStart');
      updateAttr('aColorEnd');
      updateAttr('aSize');
      updateAttr('aRotationParams');
      updateAttr('aTimeParams');
      updateAttr('aOpacityParams');

      pool.resetDirtyRange();
    }
  });
  /* eslint-enable react-hooks/immutability */

  React.useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, material, pool.maxParticles]}
      frustumCulled={false} // Particles can be anywhere
    >
      <primitive object={geometry} ref={geometryRef} />
    </instancedMesh>
  );
}

