export class VersionId {
  constructor() {}
}
export const versionId = (): VersionId => new VersionId();

export type TransitionStoreListener<T> = (params: {
  lastValue: T;
  value: T;
  version: VersionId;
}) => void;

export class TransitionExternalStore<T = unknown> {
  currentVersion: VersionId;
  currentValue: T;
  constructor(value: T) {
    this.currentVersion = versionId();
    this.currentValue = value;
    this.versions.set(this.currentVersion, value);
  }

  versions: WeakMap<VersionId, T> = new WeakMap();

  setValue(value: T) {
    const id = versionId();
    const lastValue = this.versions.get(this.currentVersion)!;
    this.versions.set(id, value);
    this.currentVersion = id;
    this.currentValue = value;
    this.notify({ lastValue, value, version: id });
  }

  setCurrentVersion(value: T) {
    this.versions.set(this.currentVersion, value);
    this.currentVersion = versionId();
    this.currentValue = value;
  }

  getValue(version = this.currentVersion) {
    if (version === this.currentVersion) {
      return this.currentValue;
    }
    return this.versions.get(version)!;
  }

  private listeners: Set<TransitionStoreListener<T>> = new Set();

  subscribe(callback: TransitionStoreListener<T>) {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  private notify({
    value,
    lastValue,
    version,
  }: {
    value: T;
    lastValue: T;
    version: VersionId;
  }) {
    for (const listener of this.listeners) {
      listener({ value, lastValue, version });
    }
  }
}
