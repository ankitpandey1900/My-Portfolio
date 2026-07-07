# Scene System Future Expansion Guidelines

Guidelines mapping how the scene management system is prepared to support future expansions (multiplayer rendering, mini-games, and custom themes).

---

## 1. Multiplayer Scene Orchestration

- **Multiplayer states:** Real-time updates (such as player positions) are managed by connecting the Zustand store to a WebSocket or WebRTC connection (e.g. using Socket.io or PartyKit).
- **Nesting:** Mount dynamic player models (`<PlayerMesh />`) inside an active `<MultiplayerSceneWrapper>` group.

---

## 2. Interactive Mini-Games

To load interactive mini-games (e.g. landing a probe on Mars):

1. Register a new scene name (e.g. `MINIGAME_LANDER`) in the Zustand `SceneName` type definition.
2. Add a new switch case in `<SceneManagerCore>` to render the mini-game scene component.
3. The mini-game component handles its own physics loop internally, and updates the Zustand store once the game is finished to return to the planet view.

---

## 3. Seasonal Themes & Custom Events

- **Seasonal Themes:** Custom lighting rigs and nebula shaders are loaded dynamically by reading calendar dates (e.g. rendering a festive red and green nebula shader during December).
- **Easter Eggs:** Hidden scenes (e.g. a secret space station) are triggered when the user enters specific keyboard combinations or clicks secret orbit locations, updating `currentScene` to mount the easter egg mesh.
