# Transition Flow

This system maps the timeline for complex event-driven animations.

1. **Trigger**: A user clicks the "Return" button.
2. **Queueing**: `TransitionController.queueTransition('ReturnHome', undefined, 100)` is called.
3. **Execution**: The `checkQueue()` internal loop notices the queue is populated, and fires `TransitionStarted`.
4. **Listener Action**: The Camera Travel Engine listens for `TransitionStarted` mapped to `'ReturnHome'`, and physically moves the camera.
5. **Resolution**: The Camera Travel Engine completes the movement, and explicitly calls `TransitionController.completeTransition()`.
6. **Next Item**: The Orchestrator pops the next item off the queue.
