import { HooksStore } from "./hooks-store";

const stateStack: HooksStore[] = [];

export const getTopState = () => {
  const state = stateStack[stateStack.length - 1];
  if (!state) {
    throw new Error("Use should run useG hooks only in createGStore context");
  }
  return state;
};

export const pushStateStack = (state: HooksStore) => {
  stateStack.push(state);
};

export const popStateStack = () => {
  stateStack.pop();
};
