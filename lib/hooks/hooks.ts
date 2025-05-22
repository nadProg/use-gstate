import * as React from "react";
import { shallowEqualArrays } from "../shallow-equal";
import { getTopState } from "./hooks-stores-state-stack";

export const useState: typeof React.useState = (initialState?: any): any => {
  const store = getTopState();
  store.nextState();
  return store.getCurrentState(initialState);
};

export const useReducer: typeof React.useReducer = (
  reducer: any,
  initialArg: any,
  init?: any,
): [any, (action: any) => void] => {
  const [state, setState] = useState(
    typeof init === "function" ? init(initialArg) : initialArg,
  );
  const dispatch = useCallback((action: any) => {
    setState((s: any) => reducer(s, action));
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, []);
  return [state, dispatch];
};

export const useRef: typeof React.useRef = (initialState?: any): any => {
  const [res] = useState({ current: initialState });
  return res;
};

export const useMemo: typeof React.useMemo = (fn: () => any, deps: any) => {
  const [res] = useState(() => ({ res: fn(), deps }));

  if (!shallowEqualArrays(res.deps, deps)) {
    res.res = fn();
    res.deps = deps;
    return res.res;
  }

  return res.res;
};

export const useCallback: typeof React.useCallback = (fn: any, deps: any) => {
  /* eslint-disable-next-line react-hooks/exhaustive-deps */
  return useMemo(() => fn, deps);
};

export const useEffect: typeof React.useEffect = (fn: any, deps: any) => {
  const store = getTopState();
  store.nextEffect();
  store.scheduleEffect({ fn, deps }, "effect");
};

export const useLayoutEffect: typeof React.useLayoutEffect = (
  fn: any,
  deps: any,
) => {
  const store = getTopState();
  store.nextEffect();
  store.scheduleEffect({ fn, deps }, "layout-effect");
};

export const useSyncExternalStore: typeof React.useSyncExternalStore = (
  subscribe: any,
  getSnapshot: any,
  getServerSnapshot: any,
) => {
  if (typeof window === "undefined") {
    return getServerSnapshot();
  }

  const snapshot = getSnapshot();

  /* eslint-disable-next-line react-hooks/rules-of-hooks */
  const [state, setState] = useState({
    count: 0,
    lastSnapshot: snapshot,
  });

  /* eslint-disable-next-line react-hooks/rules-of-hooks */
  useEffect(() => {
    return subscribe(() => {
      const newSnapshot = getSnapshot();
      if (state.lastSnapshot !== newSnapshot) {
        setState((s) => ({
          ...s,
          lastSnapshot: newSnapshot,
          count: s.count + 1,
        }));
        return;
      }
    });
  });

  return snapshot;
};

export const useContext: typeof React.useContext = (context: any) => {
  return useState(context._currentValue ?? context._currentValue2)[0];
};
