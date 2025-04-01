import { HooksStore } from "./hooks-store";
import { ReactHooksMock } from "./react-hooks";

export class HooksContext {
  stateStack: HooksStore[] = [];
  private hooks = new ReactHooksMock(this);

  constructor() {}

  getTopState() {
    const state = this.stateStack[this.stateStack.length - 1];
    if (!state) {
      throw new Error("Use should run useG hooks only in createGState context");
    }
    return state;
  }

  get inContext() {
    return this.stateStack.length > 0;
  }

  runInContext<T>(fn: () => T, state: HooksStore) {
    this.stateStack.push(state);
    const restoreHooks = this.hooks.applyHooks();

    try {
      return fn();
    } finally {
      restoreHooks();
      state.resetCurrent();
      this.stateStack.pop();
    }
  }
}

export const hooksContext = new HooksContext();
