# Sequence Engine

The Sequence Engine is built around declarative Action Primitives.

## Action Types

1. **`DelayAction`**: Pauses the timeline for a set duration (`setTimeout` wrapped in a Promise).
2. **`CallAction`**: Executes a synchronous or asynchronous callback. Used to communicate with external Controllers (like `EnvironmentController`).
3. **`EmitEventAction`**: Emits an event on the global bus (e.g., triggering UI transitions).
4. **`ParallelAction`**: Groups an array of actions and executes them simultaneously (via `Promise.all`).
5. **`SequentialAction`**: Groups an array of actions and executes them one by one.
6. **`ConditionalAction`**: Evaluates a boolean function at runtime to determine which branch of actions to execute.
