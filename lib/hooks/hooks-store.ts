import { Bather, TimerBather } from "../scheduler";
import { shallowEqualArrays } from "../shallow-equal";
import * as React from "react";

const applyAction = <T>(action: React.SetStateAction<T>, last: T) => {
  if (typeof action === "function") {
    const functionAction = action as (last: T) => T;
    return functionAction(last);
  } else {
    return action;
  }
};

type Effect = {
  fn: () => (() => void) | undefined;
  deps: unknown[];
};

type EffectState = {
  __type: "effect";
  clearFunction: () => void;
  deps: unknown[];
  effects: Effect[];
};

export class HooksStore {
  listeners = new Set<() => void>();
  dataList = new Array(100);
  effects: Effect[] = new Array(100);
  currentIndex = -1;

  timeout: NodeJS.Timeout | undefined = undefined;

  constructor(private bather: Bather = new TimerBather()) {}

  getCurrent<T = unknown>(
    initialState: T
  ): [T, React.Dispatch<React.SetStateAction<T>>] {
    const currentIndex = this.currentIndex;
    let stateEntry = this.dataList[currentIndex];

    if (!stateEntry) {
      stateEntry = [
        applyAction(initialState, undefined),
        (action: React.SetStateAction<T>) => {
          stateEntry[0] = applyAction(action, stateEntry[0]);
          this.notifyListeners();
        },
      ];

      this.dataList[currentIndex] = stateEntry;
    }

    return stateEntry;
  }

  scheduleEffect(effect: Effect) {
    clearTimeout(this.timeout);

    const effectsState = this.getCurrent({
      __type: "effect",
      clearFunction: () => {},
      deps: ["______def_____"],
      effects: [],
    } as EffectState);

    effectsState[0].effects.push(effect);

    this.bather.schedule(() => {
      this.runAllEffects();
    });
  }

  runAllEffects() {
    this.dataList.forEach(([data]) => {
      if (data.__type === "effect") {
        const effectState = data as EffectState;

        while (effectState.effects.length) {
          const effect = effectState.effects.shift()!;

          if (shallowEqualArrays(effectState.deps, effect.deps)) {
            continue;
          }
          effectState.clearFunction();
          effectState.deps = effect.deps;
          effectState.clearFunction = effect.fn() ?? (() => {});
        }
      }
    });
  }

  destroy() {
    this.dataList.forEach(([data]) => {
      if (data.__type === "effect") {
        const effectState = data as EffectState;
        effectState.clearFunction();
      }
    });
    this.dataList = [];
    this.currentIndex = -1;
  }

  next() {
    this.currentIndex++;
  }

  resetCurrent() {
    this.currentIndex = -1;
  }

  notifyListeners() {
    this.bather.schedule(() => {
      this.listeners.forEach((cb) => cb());
    });
  }

  addListener(cb: () => void) {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }
}
