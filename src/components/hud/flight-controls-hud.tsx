'use client';

import * as React from 'react';
import { useHomePlanetStore } from '@/components/home/home-planet-state';
import { useNavigationStore } from '@/components/navigation/navigation-store';
import { useCameraTravelStore } from '@/components/canvas/camera/travel/camera-travel-state';
import { useKeyboardKeys } from '@/hooks/use-keyboard-keys';

function KeyCap({ label, active = false, wide = false }: { label: string; active?: boolean; wide?: boolean }) {
  return (
    <kbd className="flight-controls__key" data-active={active} data-wide={wide}>
      {label}
    </kbd>
  );
}

export function FlightControlsHud() {
  const [collapsed, setCollapsed] = React.useState(false);
  const heroPhase = useHomePlanetStore((s) => s.phase);
  const navState = useNavigationStore((s) => s.state);
  const travelState = useCameraTravelStore((s) => s.state);

  const inSystem = heroPhase === 'dismissed';
  const travelling = travelState === 'preparing' || travelState === 'travelling';
  const inSection = navState === 'viewingSection';
  const visible = inSystem && !travelling && !inSection;

  const { isPressed } = useKeyboardKeys(visible);

  if (!visible) return null;

  return (
    <aside className="flight-controls" aria-label="Keyboard flight controls">
      <button
        type="button"
        className="flight-controls__toggle"
        aria-expanded={!collapsed}
        onClick={() => setCollapsed((value) => !value)}
      >
        {collapsed ? 'Controls' : 'Hide controls'}
      </button>

      {!collapsed ? (
        <div className="flight-controls__panel">
          <span className="flight-controls__title">Flight deck</span>

          <div className="flight-controls__cluster" aria-label="Orbit rotation">
            <KeyCap label="W" active={isPressed('w') || isPressed('ArrowUp')} />
            <div className="flight-controls__row">
              <KeyCap label="A" active={isPressed('a') || isPressed('ArrowLeft')} />
              <KeyCap label="S" active={isPressed('s') || isPressed('ArrowDown')} />
              <KeyCap label="D" active={isPressed('d') || isPressed('ArrowRight')} />
            </div>
            <span className="flight-controls__hint">Orbit</span>
          </div>

          <div className="flight-controls__cluster flight-controls__cluster--inline">
            <KeyCap label="Q" active={isPressed('q')} />
            <KeyCap label="E" active={isPressed('e')} />
            <span className="flight-controls__hint">Pan vertical</span>
          </div>

          <div className="flight-controls__cluster flight-controls__cluster--inline">
            <KeyCap label="+" active={isPressed('+') || isPressed('=')} />
            <KeyCap label="−" active={isPressed('-') || isPressed('_')} />
            <span className="flight-controls__hint">Zoom</span>
          </div>

          <div className="flight-controls__cluster flight-controls__cluster--inline">
            <KeyCap label="Shift" active={isPressed('shift')} wide />
            <span className="flight-controls__hint">Boost</span>
          </div>

          <ul className="flight-controls__notes">
            <li>Drag · orbit</li>
            <li>Scroll · zoom</li>
            <li>Click planet · travel</li>
          </ul>
        </div>
      ) : null}
    </aside>
  );
}

export default FlightControlsHud;

