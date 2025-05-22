import * as React from "react";
import { HooksStore } from "./hooks-store";
import { shallowEqualArrays } from "../shallow-equal";

type HooksContext = {
  getTopState(): HooksStore;
};

const createUseState = (context: HooksContext): typeof React.useState => {
  return (initialState?: any): any => {
    const store = context.getTopState();
    store.nextState();
    return store.getCurrentState(initialState);
  };
};

const createUseReducer = (context: HooksContext): typeof React.useReducer => {
  const useState = createUseState(context);
  const useCallback = createUseCallback(context);

  return (
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
};

const createUseRef = (context: HooksContext): typeof React.useRef => {
  const useState = createUseState(context);
  return (initialState?: any): any => {
    const [res] = useState({ current: initialState });
    return res;
  };
};

const createUseMemo = (context: HooksContext): typeof React.useMemo => {
  const useState = createUseState(context);
  return (fn: () => any, deps: any) => {
    const [res] = useState(() => ({ res: fn(), deps }));

    if (!shallowEqualArrays(res.deps, deps)) {
      res.res = fn();
      res.deps = deps;
      return res.res;
    }

    return res.res;
  };
};

const createUseCallback = (context: HooksContext): typeof React.useCallback => {
  const useMemo = createUseMemo(context);
  return (fn: any, deps: any) => {
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
    return useMemo(() => fn, deps);
  };
};

const createUseEffect = (context: HooksContext): typeof React.useEffect => {
  return (fn: any, deps: any) => {
    const store = context.getTopState();
    store.nextEffect();
    store.scheduleEffect({ fn, deps }, "effect");
  };
};

const createUseLayoutEffect = (
  context: HooksContext,
): typeof React.useLayoutEffect => {
  return (fn: any, deps: any) => {
    const store = context.getTopState();
    store.nextEffect();
    store.scheduleEffect({ fn, deps }, "layout-effect");
  };
};

const createUseSyncExternalStore = (
  context: HooksContext,
): typeof React.useSyncExternalStore => {
  const useState = createUseState(context);
  const useEffect = createUseEffect(context);

  return (subscribe: any, getSnapshot: any, getServerSnapshot: any) => {
    if (typeof window === "undefined") {
      return getServerSnapshot();
    }

    const snapshot = getSnapshot();

    const [state, setState] = useState({
      count: 0,
      lastSnapshot: snapshot,
    });

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
};

const createUseContext = (context: HooksContext): typeof React.useContext => {
  const useState = createUseState(context);
  return (context: any) => {
    return useState(context._currentValue ?? context._currentValue2)[0];
  };
};

export const createHooks = (context: HooksContext) => ({
  useState: createUseState(context),
  useRef: createUseRef(context),
  useMemo: createUseMemo(context),
  useCallback: createUseCallback(context),
  useEffect: createUseEffect(context),
  useLayoutEffect: createUseLayoutEffect(context),
  useSyncExternalStore: createUseSyncExternalStore(context),
  useContext: createUseContext(context),
  useReducer: createUseReducer(context),
});
