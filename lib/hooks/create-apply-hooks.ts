import * as React from "react";
const ReactSharedInternals =
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;

type AnyHook = (...args: any[]) => unknown;

type Hooks = {
  useState: AnyHook;
  useRef: AnyHook;
  useMemo: AnyHook;
  useCallback: AnyHook;
  useEffect: AnyHook;
  useLayoutEffect: AnyHook;
  useSyncExternalStore: AnyHook;
  useContext: AnyHook;
  useReducer: AnyHook;
};

export const createApplyHooks = (hooks: Hooks) => {
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

  return {
    applyHooks,
  };
};
