export type SyncStoreListener<T> = (params: { lastValue: T; value: T }) => void;

export class SyncStore<T = unknown> {
  currentValue: T;
  constructor(value: T) {
    this.currentValue = value;
  }

  setValue(value: T) {
    const lastValue = this.currentValue;
    this.currentValue = value;
    this.notify({ lastValue, value });
  }

  getValue() {
    return this.currentValue;
  }

  private listeners: Set<SyncStoreListener<T>> = new Set();

  subscribe(callback: SyncStoreListener<T>) {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  private notify({ value, lastValue }: { value: T; lastValue: T }) {
    for (const listener of this.listeners) {
      listener({ value, lastValue });
    }
  }
}
