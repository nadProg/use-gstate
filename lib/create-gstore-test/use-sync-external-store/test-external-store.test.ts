import { TestExternalStore } from "./test-external-store";

describe("TestExternalStore", () => {
  test("should return initial state", () => {
    const store = new TestExternalStore(5);
    expect(store.getSnapshot()).toBe(5);
  });

  test("should update state and call listeners", () => {
    const store = new TestExternalStore(0);
    const listener = vi.fn();

    store.subscribe(listener);

    store.setState(10);

    expect(store.getSnapshot()).toBe(10);
    expect(listener).toHaveBeenCalledTimes(1);
  });

  test("should support multiple listeners", () => {
    const store = new TestExternalStore(0);
    const listener1 = vi.fn();
    const listener2 = vi.fn();

    store.subscribe(listener1);
    store.subscribe(listener2);

    store.setState(20);

    expect(listener1).toHaveBeenCalledTimes(1);
    expect(listener2).toHaveBeenCalledTimes(1);
  });

  test("should unsubscribe listeners correctly", () => {
    const store = new TestExternalStore(0);
    const listener = vi.fn();

    const unsubscribe = store.subscribe(listener);

    store.setState(1);
    expect(listener).toHaveBeenCalledTimes(1);

    unsubscribe();

    store.setState(2);
    expect(listener).toHaveBeenCalledTimes(1);
  });
});
