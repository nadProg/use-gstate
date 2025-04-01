import { GStore, GStoreOptions } from "./store";
import { type TransitionStoreListener } from "./transition-store";

type GState<State> = {
  (): State;
  <R>(select: (state: State) => R): R;

  getState: () => State;
  setState: (state: State) => void;
  subscribe: (callback: TransitionStoreListener<State>) => () => void;
  destory: () => void;
};

export function createGState<State>(
  fn: () => State,
  options?: GStoreOptions
): GState<State>;
export function createGState(stateFactory: any, storeOptions = {}) {
  const store = new GStore(stateFactory, storeOptions);

  function useStateHook(selector?: (state: any) => any) {
    return store.useReact(selector);
  }

  useStateHook.destory = () => {
    store.destroy();
  };

  useStateHook.getState = () => {
    return store.getState();
  };

  useStateHook.setState = (state: any) => {
    store.setState(state);
  };

  useStateHook.subscribe = (callback: any) => {
    return store.subscribe(callback);
  };

  return useStateHook;
}
