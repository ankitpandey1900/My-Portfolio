# Timeline Architecture

The `SequenceTimeline` class is an asynchronous execution engine that processes a `SequenceDefinition`.

## Cancellation & AbortController

Because the timeline relies on native JS Promises (specifically for `DelayAction`), standard Promise execution cannot be cleanly "cancelled" mid-flight without an `AbortController`.

The Timeline instantiates an `AbortController` upon playback. Every long-running action (like `executeDelay`) listens to the `abort` signal. When `cancelSequence()` or `skipSequence()` is called, the controller aborts, rejecting the current promises and instantly unwinding the async stack.

## Pausing

Pausing is handled via an unresolved `pausePromise`. At the start of every sequence step (and within loops), the Timeline calls `checkPause()`. If paused, it `await`s the `pausePromise` until `resumeSequence()` resolves it, freezing the timeline in place without impacting the main thread.
