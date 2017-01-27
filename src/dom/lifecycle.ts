export type LifeCycleCallback = () => void;

/**
 * Used to collect functions in a single `trigger`
 */
export class Lifecycle {
  public listeners: LifeCycleCallback[] = [];

  /**
   * If a component doesn't have a `componentWillUnmount` we can fastUnmount
   */
  public fastUnmount = true;

  addListener(callback: LifeCycleCallback) {
    this.listeners.push(callback);
  }
  trigger() {
    this.listeners.forEach(listener => listener());
  }
}
