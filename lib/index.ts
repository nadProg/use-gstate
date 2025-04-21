import { GStore, GStoreOptions } from "./store";
import { type TransitionStoreListener } from "./transition-store";

// Renamed from GState to GStoreHook to be more consistent with createGStore
type GStoreHook<State> = {
  (): State;
  <R>(select: (state: State) => R, mode?: "shallow" | "strict"): R;

  getState: () => State;
  subscribe: (callback: TransitionStoreListener<State>) => () => void;
  destroy: () => void; // Fixed typo in destroy method name
};

export function createGStore<State>(
  fn: () => State,
  options?: GStoreOptions
): GStoreHook<State>;
export function createGStore(stateFactory: any, storeOptions = {}) {
  const store = new GStore(stateFactory, storeOptions);

  function useStateHook(
    selector?: (state: any) => any,
    mode?: "shallow" | "strict"
  ) {
    return store.useReact(selector, mode);
  }

  useStateHook.destroy = () => {
    // Fixed typo in destroy method name
    store.destroy();
  };

  useStateHook.getState = () => {
    return store.getState();
  };

  useStateHook.subscribe = (callback: any) => {
    return store.subscribe(callback);
  };

  return useStateHook;
}
