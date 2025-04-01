import * as React from "react";

const applyAction = (action, last) => {
  if (typeof action === "function") {
    return action(last);
  } else {
    return action;
  }
};

class UseStateStore {
  listeners = new Set();
  dataList = new Array(100);
  currentIndex = 0;

  getCurrent(initialState) {
    const currentIndex = this.currentIndex;
    let stateEntry = this.dataList[currentIndex];

    if (!stateEntry) {
      stateEntry = [
        applyAction(initialState, undefined),
        (action) => {
          stateEntry[0] = applyAction(action, stateEntry[0]);
          this.notifyListeners();
        },
      ];

      this.dataList[currentIndex] = stateEntry;
    }

    return stateEntry;
  }

  resetCurrent() {
    this.currentIndex = 0;
  }

  next() {
    current++;
  }

  notifyListeners() {
    this.listeners.forEach((cb) => cb());
  }

  addListener(cb) {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }
}

// @ts-ignore
const ReactSharedInternals =
  // @ts-ignore
  React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;

console.log(ReactSharedInternals);

class UseStateContext {
  stateStack = [];

  createStore() {
    return new UseStateStore();
  }

  getTopState() {
    const state = this.stateStack[this.stateStack.length - 1];
    if (!state) {
      throw new Error("Use should run useG hooks only in createGState context");
    }
    return state;
  }

  runInContext(fn, state) {
    const last = { ...ReactSharedInternals.H };
    ReactSharedInternals.H.useState = useGState;
    this.stateStack.push(state);

    try {
      return fn();
    } finally {
      Object.assign(ReactSharedInternals.H, last);
      state.resetCurrent();
      this.stateStack.pop();
    }
  }
}

export const useStateContext = new UseStateContext();

export function useGState(initialState) {
  return useStateContext.getTopState().getCurrent(initialState);
}
