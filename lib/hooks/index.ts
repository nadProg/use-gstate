import { HooksStore } from "./hooks-store";
import { createHooks } from "./create-hooks";
import { createApplyHooks } from "./create-apply-hooks";

export class HooksContext {
  stateStack: HooksStore[] = [];

  constructor() {}

  getTopState() {
    const state = this.stateStack[this.stateStack.length - 1];
    if (!state) {
      throw new Error("Use should run useG hooks only in createGStore context");
    }
    return state;
  }

  get inContext() {
    return this.stateStack.length > 0;
  }

  runInContext<T>(fn: () => T, state: HooksStore) {
    this.stateStack.push(state);
    const restoreHooks = applyHooks();

    try {
      return fn();
    } finally {
      restoreHooks();
      state.resetCurrent();
      this.stateStack.pop();
    }
  }
}

const hooksContext = new HooksContext();
const hooks = createHooks(hooksContext);
const { applyHooks } = createApplyHooks(hooks);

export { hooksContext };
export const {
  useState,
  useRef,
  useMemo,
  useCallback,
  useEffect,
  useLayoutEffect,
  useSyncExternalStore,
  useContext,
  useReducer,
} = hooks;
