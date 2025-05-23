import { getTopState } from "./hooks-stores-state-stack";

export const useOnSubscribed: (
  fn?: (listenersCount: number) => void,
) => void = (fn?: (listenersCount: any) => void) => {
  const store = getTopState();
  store.nextSubscriptionEvent();
  store.scheduleSubscriptionEffect(fn, "on-subscribed");
};
