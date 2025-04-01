"use client";
import { use, useEffect, useState } from "react";
import {
  TransitionExternalStore,
  useSyncTransitionExternalStore,
} from "./transition-store";

type Key = string;
type CacheEntry = {
  promise?: unknown;
};

const cache = new TransitionExternalStore<Record<Key, CacheEntry>>({});

export function useQuery<T>(key: string, loader: () => T) {
  const entry = useSyncTransitionExternalStore(
    cache,
    (last, next) => last[key] !== next[key]
  );

  const cacheEntry = entry[key];
  if (!cacheEntry) {
    entry[key] = {
      promise: loader(),
    };
  }

  const invalidate = (invalidateKey: Key) => {
    const entires = cache.getValue();

    cache.setValue(
      Object.entries(entires).reduce((acc, [key, value]) => {
        if (key.includes(invalidateKey)) {
          return acc;
        }
        return {
          ...acc,
          [key]: value,
        };
      }, {})
    );
  };

  return [cacheEntry.promise as Promise<T>, invalidate] as const;
}

export function useResolvePromise<T>(promise: Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    promise
      .then(setData)
      .catch(setError)
      .finally(() => setIsLoading(false));
  }, [promise]);

  return { data, error, isLoading };
}

export function UsePromise<T>({
  promise,
  render,
}: {
  promise: Promise<T>;
  render: (value: T) => React.ReactNode;
}) {
  const data = use(promise);

  return <>{render(data)}</>;
}
