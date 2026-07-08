# Intro Sequence Orchestration

The `IntroSequence` is defined in the `SequenceRegistry`. It perfectly choreographs the initial visitor experience upon entering the portfolio.

## Choreography Steps

1. **Scene Initialization**: A short buffer delay to allow WebGL assets to compile.
2. **Environment Fade In**: Parallels a delay with calling the `EnvironmentController` to fade in the Nebula and adjust ambient exposure.
3. **Starfield & Particles Activation**: Parallels a delay with calling the `ParticleController` to mount the `SolarEnergy` preset.
4. **Sun & Camera Transition**: Triggers the Camera Controller to slowly approach the solar system while scaling the sun's intensity.
5. **UI Reveal**: Sequentially emits typed events (`ShowLogo`, `ShowName`, `ShowTitle`, `ShowTagline`, `ShowCTA`) with precise 500ms timing delays in between.
6. **Reveal & Idle**: Transitions the global state to Idle, awaiting user interaction.
