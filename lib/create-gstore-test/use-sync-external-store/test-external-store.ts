export class TestExternalStore {
  private listeners: (() => void)[] = [];
  private state: number;

  constructor(initialState: number = 0) {
    this.state = initialState;
  }

  getSnapshot() {
    return this.state;
  }

  setState(next: number) {
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
