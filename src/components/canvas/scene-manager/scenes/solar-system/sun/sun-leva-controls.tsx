'use client';

import * as React from 'react';
import { useControls } from 'leva';
import { useSun } from './sun-provider';

/**
 * Dev-only Leva panel for sun tuning. Must be a standalone component
 * so hooks are called at the top level (not inside useEffect).
 */
export function SunLevaControls() {
  const { config, setConfig } = useSun();

  const controls = useControls('Cosmic Engine.Sun System', {
    radius: { value: config.radius, min: 2.0, max: 8.0, step: 0.1 },
    coreColor: config.coreColor,
    glowColor: config.glowColor,
    emissiveIntensity: { value: config.emissiveIntensity, min: 0.1, max: 4.0, step: 0.1 },
    glowScale: { value: config.glowScale, min: 1.0, max: 1.5, step: 0.05 },
    glowOpacity: { value: config.glowOpacity, min: 0.0, max: 1.0, step: 0.05 },
    coronaScale: { value: config.coronaScale, min: 1.0, max: 2.0, step: 0.05 },
    coronaOpacity: { value: config.coronaOpacity, min: 0.0, max: 1.0, step: 0.05 },
    coronaSpeed: { value: config.coronaSpeed, min: 0.0, max: 0.2, step: 0.01 },
    enableGlow: config.enableGlow,
    enableCorona: config.enableCorona,
    octaves: { value: config.octaves, min: 1, max: 4, step: 1 },
  });

  React.useEffect(() => {
    setConfig({
      radius: controls.radius,
      coreColor: controls.coreColor,
      glowColor: controls.glowColor,
      emissiveIntensity: controls.emissiveIntensity,
      glowScale: controls.glowScale,
      glowOpacity: controls.glowOpacity,
      coronaScale: controls.coronaScale,
      coronaOpacity: controls.coronaOpacity,
      coronaSpeed: controls.coronaSpeed,
      enableGlow: controls.enableGlow,
      enableCorona: controls.enableCorona,
      octaves: controls.octaves,
    });
  }, [controls, setConfig]);

  return null;
}

