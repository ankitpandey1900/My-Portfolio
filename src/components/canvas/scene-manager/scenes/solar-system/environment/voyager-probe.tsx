'use client';

import * as React from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useStore } from '@/lib/store';
import { PLANET_DEFINITIONS } from '../planet/planet-definitions';

// Generate a random position on a planet's orbit
function getRandomOrbitPosition(radius: number): THREE.Vector3 {
  const angle = Math.random() * Math.PI * 2;
  return new THREE.Vector3(
    Math.cos(angle) * radius,
    (Math.random() - 0.5) * 4, // Slight vertical variance
    Math.sin(angle) * radius
  );
}

export function VoyagerProbe() {
  const isRenderActive = useStore((s) => s.isRenderActive);
  const meshRef = React.useRef<THREE.Group>(null);
  const trailRef = React.useRef<THREE.Line>(null);

  // State machine for autonomous pathing
  const pathRef = React.useRef<{
    curve: THREE.CatmullRomCurve3 | null;
    progress: number;
    duration: number; // seconds to travel
    startPos: THREE.Vector3;
    targetPlanetId: string;
  }>({
    curve: null,
    progress: 0,
    duration: 10,
    startPos: new THREE.Vector3(0, 0, 0), // Start at Sun
    targetPlanetId: '',
  });

  const trailPositions = React.useRef<THREE.Vector3[]>([]);

  // Function to calculate a new flight path
  const calculateNewPath = () => {
    const state = pathRef.current;
    
    // Pick a random planet different from the current one
    const availablePlanets = PLANET_DEFINITIONS.filter((p) => p.id !== state.targetPlanetId);
    const nextPlanet = availablePlanets[Math.floor(Math.random() * availablePlanets.length)];
    if (!nextPlanet) return;
    
    const targetPos = getRandomOrbitPosition(nextPlanet.orbitRadius);
    
    // Create intermediate control points for a beautiful swooping curve
    // Midpoint that swoops high above or below the planetary plane
    const midPoint = new THREE.Vector3().lerpVectors(state.startPos, targetPos, 0.5);
    midPoint.y += (Math.random() > 0.5 ? 1 : -1) * (15 + Math.random() * 10);
    
    // Add some random lateral arc to make it a curved trajectory, not a straight line
    midPoint.x += (Math.random() - 0.5) * 20;
    midPoint.z += (Math.random() - 0.5) * 20;

    state.curve = new THREE.CatmullRomCurve3([
      state.startPos.clone(),
      midPoint,
      targetPos.clone()
    ]);
    
    state.progress = 0;
    // Travel time scales with distance so it doesn't fly infinitely fast between far planets
    state.duration = state.startPos.distanceTo(targetPos) * 0.25; 
    if (state.duration < 12) state.duration = 12; // Minimum travel time
    
    state.targetPlanetId = nextPlanet.id;
    // The next startPos is the current targetPos
    state.startPos.copy(targetPos);
  };

  React.useEffect(() => {
    // Initialize first path on mount
    calculateNewPath();
  }, []);

  useFrame((_, delta) => {
    if (!isRenderActive || !meshRef.current || !pathRef.current.curve) return;
    
    const state = pathRef.current;
    const curve = state.curve;
    if (!curve) return;

    state.progress += delta / state.duration;

    if (state.progress >= 1) {
      // Reached destination! Recalculate new path
      calculateNewPath();
      return;
    }

    // Move probe along curve
    const currentPos = curve.getPointAt(state.progress);
    meshRef.current.position.copy(currentPos);

    // Look at next point to orient correctly
    const nextPos = curve.getPointAt(Math.min(1, state.progress + 0.01));
    meshRef.current.lookAt(nextPos);

    // Spin the octahedron for a futuristic data packet effect
    meshRef.current.rotation.z += delta * 2;
    meshRef.current.rotation.x += delta * 1;
    
    // Update Glowing Trail
    trailPositions.current.push(currentPos.clone());
    if (trailPositions.current.length > 80) {
      trailPositions.current.shift(); // keep trail length fixed
    }
    
    if (trailRef.current && trailPositions.current.length > 2) {
      const geometry = trailRef.current.geometry;
      geometry.setFromPoints(trailPositions.current);
    }
  });

  return (
    <group name="voyager-probe-system">
      {/* Probe Mesh */}
      <group ref={meshRef}>
        <mesh>
          <octahedronGeometry args={[0.3, 0]} />
          <meshStandardMaterial color="#60a5fa" emissive="#3b82f6" emissiveIntensity={3} roughness={0.1} metalness={1} />
        </mesh>
        <mesh scale={1.2}>
          <octahedronGeometry args={[0.3, 0]} />
          <meshBasicMaterial color="#93c5fd" transparent opacity={0.3} blending={THREE.AdditiveBlending} />
        </mesh>
        {/* Probe Core Light */}
        <pointLight color="#60a5fa" intensity={2.5} distance={15} decay={2} />
      </group>
      
      {/* Glowing Light Trail */}
      <line ref={trailRef as any}>
        <bufferGeometry />
        <lineBasicMaterial color="#60a5fa" transparent opacity={0.5} blending={THREE.AdditiveBlending} />
      </line>
    </group>
  );
}
