# Planet Landing Experience System

The Landing System bridges the gap between the Camera Travel Engine completing its transition, and the Portfolio Section appearing on screen.

## Purpose

Instead of snapping the UI open the millisecond the camera stops moving, the Landing System allows us to orchestrate cinematic events in between.

- It can trigger particle thrusters.
- It can trigger audio whooshes.
- It can trigger "Prepare for Entry" loading screens.

## Architecture

1. **`LandingManager`**: Intercepts `TravelCompleted` from the Navigation Engine.
2. **`LandingController`**: Starts a virtual landing timeout (e.g. 1.5 seconds) configured in `landing-config.ts`.
3. **`LandingStore`**: Manages the local lifecycle (`preparing`, `landing`, `arrived`, `openingSection`).

Once the landing is completed, the controller commands the `NavigationController` to finally execute `navigateToSection()`.
