export class TestExternalStore<S> {
  private listeners: (() => void)[] = [];
  private state: S;

  constructor(initialState: S) {
    this.state = initialState;
  }

  getSnapshot() {
    return this.state;
  }

  setState(next: S) {
    this.state = next;
    this.emit();
  }

  subscribe(callback: () => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== callback);
    };
  }

  private emit() {
    for (const listener of this.listeners) {
      listener();
    }
  }
}
