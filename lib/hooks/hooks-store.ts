import { flushSync } from "react-dom";
import { Batcher, MicroTaskBatcher, TimerBatcher } from "../scheduler";
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
  type: "effect" | "layout-effect";
};

type EffectState = {
  __type: "effect";
  clearFunction: () => void;
  deps: unknown[];
  type: "effect" | "layout-effect";
  effects: Effect[];
};

type DataList = Array<[any, React.Dispatch<React.SetStateAction<any>>]>;

export class HooksStore {
  listeners = new Set<() => void>();
  dataList: DataList = new Array(30);
  effects: Effect[] = new Array(30);
  currentIndex = -1;

  private effectsBatcher: Batcher = new TimerBatcher();
  private layoutEffectsBatcher: Batcher = new MicroTaskBatcher();

  timeout: ReturnType<typeof setTimeout> | undefined = undefined;

  constructor() {}

  getCurrent<T = unknown>(
    initialState: T,
  ): [T, React.Dispatch<React.SetStateAction<T>>] {
    const currentIndex = this.currentIndex;
    let stateEntry = this.dataList[currentIndex];

    if (!stateEntry) {
      stateEntry = [
        applyAction(initialState, undefined),
        (action: React.SetStateAction<T>) => {
          const last = stateEntry[0];
          stateEntry[0] = applyAction(action, stateEntry[0]);
          // If the state has changed, notify the listeners
          if (last !== stateEntry[0]) {
            this.notifyListeners();
          }
        },
      ];

      this.dataList[currentIndex] = stateEntry;
    }

    return stateEntry;
  }

  scheduleEffect(effect: Effect) {
    const effectsState = this.getCurrent({
      __type: "effect",
      clearFunction: () => {},
      deps: ["______def_____"],
      type: effect.type,
      effects: [],
    } as EffectState);

    effectsState[0].effects.push(effect);

    if (effect.type === "layout-effect") {
      this.layoutEffectsBatcher.schedule(() => {
        flushSync(() => {
          this.runAllEffects("layout-effect");
        });
      });
    } else {
      this.effectsBatcher.schedule(() => {
        this.runAllEffects("effect");
      });
    }
  }

  runAllEffects(type: "layout-effect" | "effect") {
    this.dataList.forEach(([data]) => {
      if (data.__type === "effect" && data.type === type) {
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
    this.listeners.forEach((cb) => cb());
  }

  addListener(cb: () => void) {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }
}
