# Camera Travel Engine

The Camera Travel Engine supersedes basic linear interpolation by implementing frame-independent, curve-based cinematic transitions through the 3D scene.

## Architecture

1. **Travel Manager (`camera-travel-manager.tsx`)**
   A headless listener that bridges UI intents (clicks, presets) into state machine requests. It is the only system that triggers `queueTravel`.

2. **Travel Controller (`camera-travel-controller.tsx`)**
   The core R3F `useFrame` loop. When the state enters `preparing`, it calculates a mathematical spline via the **Path Generator** and resolves moving planetary targets via the **Target Resolver**. In `travelling`, it interpolates the camera along the generated spline.

3. **Target Resolver (`camera-target-resolver.ts`)**
   Because planets orbit the sun in real-time, the Camera Travel Engine calculates _where the planet will be_ at the end of the camera's travel duration, rather than aiming where it currently is. This ensures the camera perfectly aligns with the target upon arrival.

4. **Path Generator (`camera-path-generator.ts`)**
   Constructs 3D curves (e.g., Quadratic Beziers) to allow the camera to swoop over the sun instead of intersecting it directly when traveling from one side of the solar system to the other.

## Visual Pipeline (Future)

The `<CameraTransition />` hook sits in the provider to prepare post-processing effects during high-speed travel (e.g., Motion Blur, Bloom flashes).
