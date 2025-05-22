import * as React from "react";
const ReactSharedInternals =
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;

import { HooksStore } from "./hooks-store";
import {
  useState,
  useRef,
  useMemo,
  useCallback,
  useEffect,
  useLayoutEffect,
  useSyncExternalStore,
  useContext,
  useReducer,
} from "./hooks";
import { popStateStack, pushStateStack } from "./hooks-stores-state-stack";

const hooks = {
  useState,
  useRef,
  useMemo,
  useCallback,
  useEffect,
  useLayoutEffect,
  useSyncExternalStore,
  useContext,
  useReducer,
};

const applyHooks = () => {
  const last = ReactSharedInternals.H;
  ReactSharedInternals.H = {
    ...last,
    ...hooks,
  };

  return () => {
    ReactSharedInternals.H = last;
  };
};

export const runInHooksContext = <T>(fn: () => T, state: HooksStore) => {
  pushStateStack(state);
  const restoreHooks = applyHooks();

  try {
    return fn();
  } finally {
    restoreHooks();
    state.resetCurrent();
    popStateStack();
  }
};
