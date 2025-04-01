import { useEffect } from "react";
import { useStateContext } from "./use-state";
export { useGState } from "./use-state";
import {
  TransitionExternalStore,
  useSyncTransitionExternalStore,
} from "./transition-store";
import { shallowEqual } from "./shallow-equal";

export function createGState(stateFactory, storeOptions = {}) {
  // Создаём хранилку для хуков
  let useStateStore = useStateContext.createStore();
  let unsubscribeStateStore = () => {};

  // Инициализация кэша стейта
  let stateStore = undefined;
  let subscribers = 0;

  function useStateHook(options = {}) {
    if (!options.select) {
      options.select = (state) => state;
    }

    // Если состояние не проинициализировано
    if (!stateStore) {
      // Запускаем фабрику состояния
      const result = useStateContext.runInContext(
        () => stateFactory(options.params),
        useStateStore
      );

      // Инициализируем стейт с результатом
      stateStore = new TransitionExternalStore(result);

      // Подбисываемся на изменения состояний
      unsubscribeStateStore = useStateStore.addListener(() => {
        const last = stateStore.getValue();

        const next = useStateContext.runInContext(
          () => stateFactory(options.params),
          useStateStore
        );

        if (!shallowEqual(last, next)) {
          stateStore.setValue(next);
        }
      });
    }

    // Подсчёт подписчиков
    useEffect(() => {
      subscribers++;

      storeOptions.onSubscribed?.(subscribers);
      if (subscribers === 1) {
        storeOptions.onFirstSubscribed?.();
      }

      return () => {
        subscribers--;

        storeOptions.onUnsubscribed?.(subscribers);

        if (subscribers === 0) {
          storeOptions.onAllUnsubscribed?.();
        }
      };
    }, []);

    // Подписываемся на поддерживающий transtion стор
    const stateResult = useSyncTransitionExternalStore(
      stateStore,
      (last, next) => !shallowEqual(options.select(last), options.select(next))
    );

    return options.select(stateResult);
  }

  useStateHook.reset = () => {
    stateStore = undefined;
    unsubscribeStateStore();
  };

  return useStateHook;
}
