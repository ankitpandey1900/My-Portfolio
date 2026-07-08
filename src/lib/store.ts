import { create } from 'zustand';

export type GraphicsQuality = 'low' | 'high';
export type QualityTier = 'ultra' | 'high' | 'medium' | 'low';
export type NavigationState = 'GALAXY' | 'SYSTEM' | 'PLANET' | 'FOCUS';
export type SceneName = 'LOADING' | 'GALAXY' | 'SYSTEM' | 'PLANET' | 'ERROR';
export type SpaceEnvPreset = 'deep-space' | 'nebula-glow' | 'solar-flare';
export type ToneMappingType = 'ACESFilmic' | 'Cineon' | 'Linear' | 'Reinhard' | 'None';
export type CameraMode = 'cinematic' | 'transitioning' | 'orbit' | 'free' | 'focus';
export type CameraPresetType = 'galaxy' | 'system' | 'planet' | 'cockpit';

const MAX_SCENE_HISTORY = 50;

interface RendererState {
  quality: GraphicsQuality;
  dpr: number;
  postProcessingEnabled: boolean;
  setQuality: (quality: GraphicsQuality) => void;
  setDpr: (dpr: number) => void;
  setPostProcessing: (enabled: boolean) => void;
}

interface CameraState {
  targetPosition: [number, number, number];
  targetLookAt: [number, number, number];
  isWarping: boolean;
  cameraMode: CameraMode;
  cameraPreset: CameraPresetType;
  cameraFov: number;
  setCameraTarget: (position: [number, number, number], lookAt: [number, number, number]) => void;
  setWarping: (warping: boolean) => void;
  setCameraMode: (mode: CameraMode) => void;
  setCameraPreset: (preset: CameraPresetType) => void;
  setCameraFov: (fov: number) => void;
  resetCamera: () => void;
}

interface LoadingState {
  isLoading: boolean;
  progress: number;
  loadedCount: number;
  totalCount: number;
  startLoading: (total: number) => void;
  updateProgress: (loaded: number, progress: number) => void;
  finishLoading: () => void;
}

interface PlanetState {
  activePlanet: string | null;
  navigationState: NavigationState;
  rotationPaused: boolean;
  setActivePlanet: (planet: string | null) => void;
  setNavigationState: (state: NavigationState) => void;
  setRotationPaused: (paused: boolean) => void;
}

interface AudioState {
  isMuted: boolean;
  volume: number;
  audioOptIn: boolean;
  setMuted: (muted: boolean) => void;
  setVolume: (volume: number) => void;
  setAudioOptIn: (optIn: boolean) => void;
}

interface ViewportState {
  viewport: { width: number; height: number; aspect: number };
  setViewport: (width: number, height: number) => void;
}

interface RenderState {
  qualityTier: QualityTier;
  isRenderActive: boolean;
  setQualityTier: (tier: QualityTier) => void;
  setRenderActive: (active: boolean) => void;
}

interface SceneState {
  currentScene: SceneName;
  sceneHistory: SceneName[];
  transitioningTo: SceneName | null;
  setCurrentScene: (scene: SceneName) => void;
  setTransitionTarget: (scene: SceneName | null) => void;
  goBackScene: () => void;
}

interface AppState
  extends
    RendererState,
    CameraState,
    LoadingState,
    PlanetState,
    AudioState,
    ViewportState,
    RenderState,
    SceneState {}

export const useStore = create<AppState>((set) => ({
  // 1. Renderer Subsystem State
  quality: 'high',
  dpr: 1.5,
  postProcessingEnabled: true,
  setQuality: (quality) => set({ quality, dpr: quality === 'high' ? 1.5 : 1 }),
  setDpr: (dpr) => set({ dpr }),
  setPostProcessing: (postProcessingEnabled) => set({ postProcessingEnabled }),

  // 2. Camera Viewport State
  targetPosition: [0, 15, 30],
  targetLookAt: [0, 0, 0],
  isWarping: false,
  cameraMode: 'cinematic',
  cameraPreset: 'galaxy',
  cameraFov: 34,
  setCameraTarget: (targetPosition, targetLookAt) => set({ targetPosition, targetLookAt }),
  setWarping: (isWarping) => set({ isWarping }),
  setCameraMode: (cameraMode) => set({ cameraMode }),
  setCameraPreset: (cameraPreset) => set({ cameraPreset }),
  setCameraFov: (cameraFov) => set({ cameraFov }),
  resetCamera: () =>
    set({
      targetPosition: [0, 15, 30],
      targetLookAt: [0, 0, 0],
      cameraFov: 34,
      cameraPreset: 'galaxy',
      cameraMode: 'cinematic',
      isWarping: false,
    }),

  // 3. Central Assets Preloader State
  isLoading: true,
  progress: 0,
  loadedCount: 0,
  totalCount: 0,
  startLoading: (total) => set({ isLoading: true, progress: 0, loadedCount: 0, totalCount: total }),
  updateProgress: (loaded, progress) => set({ loadedCount: loaded, progress }),
  finishLoading: () => set({ isLoading: false, progress: 100 }),

  // 5. Future Celestial Positions & Actions State
  activePlanet: null,
  navigationState: 'GALAXY',
  rotationPaused: false,
  setActivePlanet: (activePlanet) => set({ activePlanet }),
  setNavigationState: (navigationState) => set({ navigationState }),
  setRotationPaused: (rotationPaused) => set({ rotationPaused }),

  // 6. Spatial Web Audio State
  isMuted: true,
  volume: 0.5,
  audioOptIn: false,
  setMuted: (isMuted) => set({ isMuted }),
  setVolume: (volume) => set({ volume }),
  setAudioOptIn: (audioOptIn) => set({ audioOptIn }),

  // 7. Viewport Dimensions
  viewport: { width: 0, height: 0, aspect: 1 },
  setViewport: (width, height) =>
    set({ viewport: { width, height, aspect: width / (height || 1) } }),

  // 8. Render Pipeline State
  qualityTier: 'high',
  isRenderActive: true,
  setQualityTier: (qualityTier) => set({ qualityTier }),
  setRenderActive: (isRenderActive) => set({ isRenderActive }),

  // 9. Navigation Scene State Core
  currentScene: 'GALAXY',
  sceneHistory: ['GALAXY'],
  transitioningTo: null,
  setCurrentScene: (currentScene) =>
    set((state) => {
      const history = [...state.sceneHistory, currentScene];
      return {
        currentScene,
        sceneHistory:
          history.length > MAX_SCENE_HISTORY ? history.slice(-MAX_SCENE_HISTORY) : history,
      };
    }),
  setTransitionTarget: (transitioningTo) => set({ transitioningTo }),
  goBackScene: () =>
    set((state) => {
      if (state.sceneHistory.length <= 1) return {};
      const newHistory = [...state.sceneHistory];
      newHistory.pop();
      const prevScene = newHistory[newHistory.length - 1] ?? 'LOADING';
      return {
        currentScene: prevScene,
        sceneHistory: newHistory,
      };
    }),
}));
export default useStore;
