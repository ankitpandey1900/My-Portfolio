'use client';

import { useHomePlanetStore } from '@/components/home/home-planet-state';
import { useNavigationStore } from '@/components/navigation/navigation-store';
import { useCameraTravelStore } from '@/components/canvas/camera/travel/camera-travel-state';

export function CameraHint() {
  const heroPhase = useHomePlanetStore((s) => s.phase);
  const navState = useNavigationStore((s) => s.state);
  const travelState = useCameraTravelStore((s) => s.state);

  const inSystem = heroPhase === 'dismissed';
  const travelling = travelState === 'preparing' || travelState === 'travelling';
  const inSection = navState === 'viewingSection';

  if (!inSystem || travelling || inSection) return null;

  return (
    <p className="camera-hint" role="status">
      Click planet · 1–8 jump · 0 overview · WASD explore
    </p>
  );
}

