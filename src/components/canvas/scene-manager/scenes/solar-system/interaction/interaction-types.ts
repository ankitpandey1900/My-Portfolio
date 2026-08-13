export type PlanetInteractionState =
  'idle' | 'hovered' | 'focused' | 'selected' | 'disabled' | 'hidden' | 'locked';

export type InteractionEventName =
  | 'PlanetHover'
  | 'PlanetLeave'
  | 'PlanetClick'
  | 'PlanetDoubleClick'
  | 'PlanetFocus'
  | 'PlanetBlur'
  | 'FutureLongPress'
  | 'FutureContextMenu';

export type InputDevice = 'mouse' | 'trackpad' | 'touch' | 'keyboard' | 'gamepad';

export interface InteractionPayload {
  planetId: string;
  device?: InputDevice;
  timestamp: number;
}

