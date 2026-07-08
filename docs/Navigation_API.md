# Navigation API

To trigger global navigation from anywhere in the app (3D Canvas or HTML DOM):

```typescript
import { NavigationController } from '@/components/navigation/navigation-controller';

// 1. Travel to a planet & automatically open its assigned portfolio section
NavigationController.selectPlanet('mars');

// 2. Open a specific sub-section UI without moving the camera
NavigationController.navigateToSection('projects_gallery');

// 3. Return to the galaxy overview and close all UI
NavigationController.goHome();
```

To read the current navigation state (e.g., to animate an HTML overlay):

```typescript
import { useNavigationStore } from '@/components/navigation/navigation-store';

const currentSection = useNavigationStore((state) => state.currentSectionId);
const isTravelling = useNavigationStore((state) => state.state === 'travelling');

// Use isTravelling to fade out UI elements gracefully
```
