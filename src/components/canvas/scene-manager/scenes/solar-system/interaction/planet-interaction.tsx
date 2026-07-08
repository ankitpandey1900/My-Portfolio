'use client';

import * as React from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useInteractionController } from './interaction-controller';
import { useInteractionStore } from './interaction-state';

interface PlanetInteractionProps {
  planetId: string;
  children: React.ReactNode;
}

/**
 * PlanetInteraction wraps meshes with pointer handlers and subtle hover feedback.
 */
export const PlanetInteraction = React.forwardRef<THREE.Group, PlanetInteractionProps>(
  ({ planetId, children }, ref) => {
    const innerRef = React.useRef<THREE.Group>(null);
    React.useImperativeHandle(ref, () => innerRef.current as THREE.Group);

    const { handlePointerOver, handlePointerOut, handlePointerDown, handleClick, handleDoubleClick } =
      useInteractionController(planetId);

    const isHovered = useInteractionStore((state) => state.hoveredPlanetId === planetId);
    const isSelected = useInteractionStore((state) => state.selectedPlanetId === planetId);
    const isDisabled = useInteractionStore((state) => state.disabledPlanets.includes(planetId));

    const targetScale = isSelected ? 1.02 : isHovered ? 1.012 : 1.0;

    useFrame((_, delta) => {
      if (!innerRef.current) return;
      const current = innerRef.current.scale.x;
      const next = THREE.MathUtils.lerp(current, targetScale, Math.min(delta * 3.5, 1));
      innerRef.current.scale.setScalar(next);
    });

    return (
      <group
        ref={innerRef}
        name={`planet-interaction-${planetId}`}
        onPointerOver={(event) => {
          if (isDisabled) return;
          document.body.style.cursor = 'pointer';
          handlePointerOver(event);
        }}
        onPointerOut={(event) => {
          document.body.style.cursor = 'auto';
          handlePointerOut(event);
        }}
        onPointerDown={handlePointerDown}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
      >
        {children}
      </group>
    );
  }
);
PlanetInteraction.displayName = 'PlanetInteraction';
