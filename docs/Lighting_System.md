# Lighting System Specs

## Purpose

The Lighting System document defines the light types, intensities, shadows, and performance restrictions across the portfolio.

## Light Types Registry

### 1. Ambient Light

- **Role:** Fills dark regions with a faint global illumination floor.
- **Default intensity:** `0.1`

### 2. Hemisphere Light

- **Role:** Simulates faint color bounces from nebulae (Nebula Violet sky to deep Space Black ground).
- **Default intensity:** `0.15`

### 3. Point Light (Solar Source)

- **Role:** Primary light source positioned at coordinates `[0, 0, 0]` inside the Sun mesh. Casts shadows outward behind orbiting planets.
- **Default intensity:** `2.5`
- **Cast shadows:** Enabled on High Graphics settings only.

### 4. Directional Light

- **Role:** Subtle key light highlighting cockpit/HUD surfaces details.
- **Default intensity:** `0.4`

---

## Shadow mapping constraints

Dynamic shadow maps are resource-heavy.

- Shadow mapping is restricted to **High Quality Profiles** only.
- On **Low Quality Profiles** (such as mobile browsers), shadow map casting is disabled, converting light nodes to simple directional vectors to preserve frame rate.
