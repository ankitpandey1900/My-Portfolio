type SceneEventCallback = (data?: unknown) => void;

class SceneEventEmitter {
  private events: Record<string, SceneEventCallback[]> = {};

  /**
   * Subscribe to a named canvas event, returning an unsubscribe callback.
   */
  on(event: string, callback: SceneEventCallback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
    return () => this.off(event, callback);
  }

  /**
   * Unsubscribe from a named canvas event.
   */
  off(event: string, callback: SceneEventCallback) {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter((cb) => cb !== callback);
  }

  /**
   * Publish/Broadcast a named canvas event with optional argument data.
   */
  emit(event: string, data?: unknown) {
    if (!this.events[event]) return;
    this.events[event].forEach((callback) => callback(data));
  }
}

export const sceneEventEmitter = new SceneEventEmitter();
export default sceneEventEmitter;

