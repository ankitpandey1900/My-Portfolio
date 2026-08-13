'use client';

import React, { useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { useDrag } from '@use-gesture/react';
import { a, useSpring } from '@react-spring/three';
import * as THREE from 'three';

interface DraggableObjectProps {
  children: React.ReactNode;
  initialPosition?: [number, number, number];
  onDragStart?: () => void;
  onDragEnd?: () => void;
  disableDrag?: boolean;
}

export function DraggableObject({
  children,
  initialPosition = [0, 0, 0],
  onDragStart,
  onDragEnd,
  disableDrag = false,
}: DraggableObjectProps) {
  const { size, camera } = useThree();

  const [{ position }, api] = useSpring(() => ({
    position: initialPosition,
    config: { mass: 1, tension: 170, friction: 26 },
  }));

  const bind = useDrag(
    ({ active, movement: [x, y], event, first, last }) => {
      if (disableDrag) return;
      if (first) {
        if (onDragStart) onDragStart();
        // Prevent default orbit controls from taking over when we drag an object
        if (event && event.stopPropagation) event.stopPropagation();
      }

      // Convert pixel movement to world units dynamically based on camera distance
      const distance = camera.position.distanceTo(new THREE.Vector3(...initialPosition));
      const factor = (distance / size.height) * 1.5;

      api.start({
        position: [
          initialPosition[0] + x * factor,
          initialPosition[1] - y * factor,
          initialPosition[2],
        ],
      });

      if (last) {
        if (onDragEnd) onDragEnd();
      }
    }
  );

  return (
    // @ts-ignore
    <a.group {...bind()} position={position}>
      {children}
    </a.group>
  );
}

