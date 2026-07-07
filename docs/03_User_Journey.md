# 03_User_Journey

## Purpose

The User Journey document maps the navigation flows, spatial transitions, interactions, and narrative arcs for all target user personas. It bridges the gap between creative storytelling and product interactions, ensuring a smooth flow across the space exploration experience.

## Goals

1. **Reduce Interaction Friction:** Make finding professional credentials intuitive, even in a spatial 3D game.
2. **Dynamic Storytelling:** Create an immersive path from high-level vision down to detailed service offerings.
3. **Engaging Feedback Loops:** Provide clear visual and audio feedback during warp travels, zoom transitions, and UI overlays.

## Architecture

The user journey is divided into discrete navigation states managed by a global finite state machine (FSM).

```
[State: GALAXY_LOAD]
       │
       ▼ (Enter Command / Zoom)
[State: SPACE_TRAVEL]
       │
       ▼ (Orbit Transition)
[State: SOLAR_SYSTEM] ─── (Warp Zoom) ───► [State: PLANET_VIEW]
       │                                         │
       │ (Warp Zoom)                             ▼ (Open Console)
[State: SUN_HOME]                          [State: PLANET_HUD_OPEN]
```

- **Galaxy State (Global Entrance):** Initial cosmic overview. Serves as the loading coordinator.
- **Space Travel State:** Interactive camera pans moving through stars and nebulae.
- **Solar System State:** Orbital overhead view where the Sun (Home) and planets are visible.
- **Planet Focus State:** The camera zooms into close orbit of a specific planet. HUD displays telemetry.
- **HUD Overlay State:** Slide-in terminal panel containing professional info (Skills, Projects, Services, Contact Form).
- **Return State:** Zoom out to orbit or system overview.

## Decisions

- **Dynamic Travel Sequences (GSAP Bezier Paths):** Camera transitions between planets will follow curved Spline/Bezier paths rather than straight lines. This mimics real gravitational space curves and creates a more cinematic feel.
- **Persistent Telemetry HUD:** The user's screen edges will feature static HUD elements (e.g. system status, active coordinate markers, warp selector dropdown, mute toggle). This prevents the user from getting lost and provides a persistent exit strategy.
- **Interactive Sound Triggers:** Low-frequency ambient drones play in deep space, pitching up during warp transitions, and resolving to sleek digital tones when UI panels open.

## Tradeoffs

- **Fidelity vs. Cognitive Load:** Forcing users to complete a 5-second camera flight every time they click a menu item is frustrating. _Decision:_ Provide a **"Hyperdrive (Skip Visuals)"** checkbox in the HUD settings. When active, camera travels are bypassed, transitioning the scene instantly via a 200ms screen bloom fade.
- **Mobile Gestures vs. Mouse Controls:** Multi-touch orbit controls on a canvas are often clumsy. _Decision:_ On mobile, we disable active orbital rotation dragging. Instead, we use a simple **"Next Planet"** arrow carousel overlay, allowing users to scroll planets sequentially.

## Future Expansion

- **Dynamic Missions:** Introduce a "Mission Log" widget in the HUD. Users can select "I want to hire you," which highlights the Earth (Projects) and Mars (Services) nodes, leading them on a guided narrative path.
- **Interactive Ship Console:** Allow visitors to customize the HUD color scheme or toggle dashboard widgets as if upgrading their ship.

## Risks

- **Disorientation:** If the camera path gets disrupted or spins too quickly, it can cause motion sickness. _Mitigation:_ Cap camera rotation angles, disable secondary axis rolls, and allow users to select "Reduced Motion" to switch to static 2D panels.

## Acceptance Criteria

### User Persona Paths

1. **Freelance Client Journey:**
   - Land on loading screen -> Fast-travel to Mars (Services) -> Explore service cards -> Click "Request Quote" -> Open pricing calculator -> Submit form -> Receive confirmation log.
2. **Recruiter Journey:**
   - Land on loading screen -> Warp to Venus (Experience Timeline) -> Scroll through chronological timeline -> Click "Download Resume" -> Resume downloads successfully -> Jump to Saturn (Contact).
3. **Developer Journey:**
   - Land on loading screen -> Warp to Earth (Projects) -> Filter projects by tag "Next.js" -> Click Github repository link -> Check Github contribution heatmap on Jupiter (Analytics).

## Engineering Notes

- **GSAP Timeline Coordination:** All travel animations must utilize a central GSAP timeline that pauses WebGL orbit rotation scripts, executes the camera travel, registers the destination state, and then slides in the HUD.
- **Key Event Listeners:** Map the `Escape` key to close any open UI terminal and zoom the camera back out to the solar system view.
