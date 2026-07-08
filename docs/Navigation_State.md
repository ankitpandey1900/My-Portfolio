# Navigation State Machine

The `<NavigationProvider />` maintains the master lifecycle state of the user's journey.

## States

- **`idle`**: User is exploring the main galaxy overview.
- **`planetSelected`**: User clicked a planet. Validating route.
- **`travelling`**: The Camera Travel Engine is currently executing a transition.
- **`focused`**: The Camera has arrived at a planet and is tracking it.
- **`viewingSection`**: The Camera is focused, and a Portfolio UI Section is currently mounted/visible.
- **`returning`**: User clicked "back", camera is flying back to the galaxy overview.
- **`error`**: Invalid URL slug or missing planet.

## Syncing with Camera Travel

The Navigation State runs _parallel_ to the Camera Travel State but dictates a higher level intent. While the Camera state might just be `travelling` (dumb path following), the Navigation State knows _why_ we are travelling and what UI to show upon arrival.
