import { useLayoutEffect, useState } from "react";

class VersionId {
  constructor() {}
}
const versionId = (): VersionId => new VersionId();

export class TransitionExternalStore<T> {
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
    this.notify(id, { lastValue, value });
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

  private listeners: Set<
    (version: VersionId, info: { value: T; lastValue: T }) => void
  > = new Set();

  subscribe(
    callback: (version: VersionId, info: { value: T; lastValue: T }) => void
  ) {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  private notify(
    version: VersionId,
    { value, lastValue }: { value: T; lastValue: T }
  ) {
    for (const listener of this.listeners) {
      listener(version, { value, lastValue });
    }
  }
}

export function useSyncTransitionExternalStore<T>(
  store: TransitionExternalStore<T>,
  shouldUpdate: (value: T, lastValue: T) => boolean = () => true
): T {
  const [version, setVersion] = useState<VersionId>(store.currentVersion);

  useLayoutEffect(() => {
    const unsubscribe = store.subscribe((version, { lastValue, value }) => {
      if (shouldUpdate(value, lastValue)) {
        setVersion(version);
      }
    });
    return () => {
      unsubscribe();
    };
  }, [store]);

  return store.getValue(version);
}
