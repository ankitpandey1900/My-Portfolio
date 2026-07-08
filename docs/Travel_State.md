# Travel State Machine

The Camera Travel Engine uses a strict Zustand state machine (`useCameraTravelStore`) to manage cinematic camera states safely without React re-renders.

## States

1. **idle**: Camera is at rest or controlled by standard orbital dragging.
2. **preparing**: A request has been pulled from the queue. The Controller calculates spline paths and resolves target coordinates. (Lasts exactly 1 frame).
3. **travelling**: The camera is actively interpolating along a generated path.
4. **arriving**: (Optional/Future) The final 10% of the journey, where landing effects (audio thrusters, focus pulls) trigger.
5. **focused**: The camera has arrived and is currently tracking a moving target.
6. **returning**: Returning to the default galaxy overview.
7. **cancelled**: Travel was interrupted (e.g., by a fast double-click on a new target).
8. **error**: Invalid target ID.

## Queueing System

If a travel request is dispatched while the camera is `travelling`, the new request is pushed into the `travelQueue`. Once the camera finishes its current journey and drops back to `idle`, the state machine automatically pops the next request and transitions back into `preparing`.
