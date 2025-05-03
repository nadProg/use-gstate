import { render } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import { GStore } from "./store.ts";

describe("GStore - Configuration Options", () => {
  const stateFactoryStub = () => ({});

  test("should create a new GStore instance", () => {
    const store = new GStore(stateFactoryStub);
    expect(store).toBeDefined();
  });

  describe("onSubscribed callback", () => {
    test("should trigger when a new subscriber is added", () => {
      const onSubscribed = vi.fn();
      const gStore = new GStore(stateFactoryStub, { onSubscribed });
      expect(onSubscribed).not.toHaveBeenCalled();
      gStore.subscribe(() => ({}));
      expect(onSubscribed).toHaveBeenCalledOnce();
    });

    test("should pass the correct subscriber count to the callback", () => {
      const onSubscribed = vi.fn();
      const gStore = new GStore(stateFactoryStub, { onSubscribed });

      gStore.subscribe(() => ({}));
      expect(onSubscribed).toHaveBeenLastCalledWith(1);

      gStore.subscribe(() => ({}));
      expect(onSubscribed).toHaveBeenLastCalledWith(2);

      gStore.subscribe(() => ({}));
      expect(onSubscribed).toHaveBeenLastCalledWith(3);
      expect(onSubscribed).toHaveBeenCalledTimes(3);
    });
  });

  describe("onUnsubscribed callback", () => {
    test("should trigger when a subscriber is removed", () => {
      const onUnsubscribed = vi.fn();
      const gStore = new GStore(stateFactoryStub, { onUnsubscribed });
      const unsubscribe = gStore.subscribe(() => ({}));
      expect(onUnsubscribed).not.toHaveBeenCalled();
      unsubscribe();
      expect(onUnsubscribed).toHaveBeenCalledOnce();
    });

    test("should not trigger multiple times for the same unsubscribe call", () => {
      const onUnsubscribed = vi.fn();
      const gStore = new GStore(stateFactoryStub, { onUnsubscribed });
      const unsubscribe = gStore.subscribe(() => ({}));
      unsubscribe();
      unsubscribe();
      unsubscribe();
      expect(onUnsubscribed).toHaveBeenCalledOnce();
    });

    test("should pass the correct remaining subscriber count to the callback", () => {
      const onUnsubscribed = vi.fn();
      const gStore = new GStore(stateFactoryStub, { onUnsubscribed });

      const unsubscribeFirst = gStore.subscribe(() => ({}));
      const unsubscribeSecond = gStore.subscribe(() => ({}));
      const unsubscribeThird = gStore.subscribe(() => ({}));

      unsubscribeFirst();
      expect(onUnsubscribed).toHaveBeenLastCalledWith(2);

      unsubscribeSecond();
      expect(onUnsubscribed).toHaveBeenLastCalledWith(1);

      unsubscribeThird();
      expect(onUnsubscribed).toHaveBeenLastCalledWith(0);
      expect(onUnsubscribed).toHaveBeenCalledTimes(3);
    });
  });

  describe("onFirstSubscribed callback", () => {
    test("should trigger only on the first subscription", () => {
      const onFirstSubscribed = vi.fn();
      const gStore = new GStore(stateFactoryStub, { onFirstSubscribed });

      expect(onFirstSubscribed).not.toHaveBeenCalled();

      gStore.subscribe(() => ({}));
      expect(onFirstSubscribed).toHaveBeenCalledOnce();

      gStore.subscribe(() => ({}));
      gStore.subscribe(() => ({}));
      gStore.subscribe(() => ({}));

      expect(onFirstSubscribed).toHaveBeenCalledOnce();
    });
  });

  describe("onAllUnsubscribed callback", () => {
    test("should trigger when the last subscriber is removed", () => {
      const onAllUnsubscribed = vi.fn();
      const gStore = new GStore(stateFactoryStub, { onAllUnsubscribed });

      const unsubscribeFirst = gStore.subscribe(() => ({}));
      const unsubscribeSecond = gStore.subscribe(() => ({}));
      const unsubscribeThird = gStore.subscribe(() => ({}));

      unsubscribeFirst();
      unsubscribeSecond();
      expect(onAllUnsubscribed).not.toHaveBeenCalled();

      unsubscribeThird();
      expect(onAllUnsubscribed).toHaveBeenCalledOnce();
    });

    test("should trigger only once when all subscribers are removed", () => {
      const onAllUnsubscribed = vi.fn();
      const gStore = new GStore(stateFactoryStub, { onAllUnsubscribed });

      const unsubscribeFirst = gStore.subscribe(() => ({}));
      const unsubscribeSecond = gStore.subscribe(() => ({}));
      const unsubscribeThird = gStore.subscribe(() => ({}));

      unsubscribeFirst();
      unsubscribeSecond();
      unsubscribeThird();
      unsubscribeFirst();
      unsubscribeSecond();
      unsubscribeThird();

      expect(onAllUnsubscribed).toHaveBeenCalledOnce();
    });
  });

  describe("Callback interaction", () => {
    test("should handle all callbacks correctly in sequence", () => {
      const onSubscribed = vi.fn();
      const onUnsubscribed = vi.fn();
      const onAllUnsubscribed = vi.fn();
      const onFirstSubscribed = vi.fn();

      const gStore = new GStore(stateFactoryStub, {
        onSubscribed,
        onUnsubscribed,
        onAllUnsubscribed,
        onFirstSubscribed,
      });

      const unsubscribeFirst = gStore.subscribe(() => ({}));
      expect(onFirstSubscribed).toHaveBeenCalledOnce();

      const unsubscribeSecond = gStore.subscribe(() => ({}));
      const unsubscribeThird = gStore.subscribe(() => ({}));
      expect(onSubscribed).toHaveBeenCalledTimes(3);

      unsubscribeFirst();
      unsubscribeSecond();
      expect(onAllUnsubscribed).not.toHaveBeenCalled();

      unsubscribeThird();
      expect(onFirstSubscribed).toHaveBeenCalledOnce();
      expect(onSubscribed).toHaveBeenCalledTimes(3);
      expect(onSubscribed).toHaveBeenLastCalledWith(3);
      expect(onUnsubscribed).toHaveBeenLastCalledWith(0);
      expect(onUnsubscribed).toHaveBeenCalledTimes(3);
      expect(onAllUnsubscribed).toHaveBeenCalledOnce();
    });
  });

  describe("initialize option", () => {
    test('should not initialize state with "lazy" option until getState is called', () => {
      const stateFactory = vi.fn();
      const gStore = new GStore(stateFactory, { initialize: "lazy" });
      expect(stateFactory).not.toHaveBeenCalled();
      gStore.getState();
      expect(stateFactory).toHaveBeenCalledOnce();
    });

    test("should not initialize state by default until getState is called", () => {
      const stateFactory = vi.fn();
      const gStore = new GStore(stateFactory);
      expect(stateFactory).not.toHaveBeenCalled();
      gStore.getState();
      expect(stateFactory).toHaveBeenCalledOnce();
    });

    test('should not initialize state with "lazy" option until useReact is called', () => {
      const stateFactory = vi.fn();
      const gStore = new GStore(stateFactory, { initialize: "lazy" });
      expect(stateFactory).not.toHaveBeenCalledOnce();

      const TestComponent = () => {
        gStore.useReact(() => null);
        return null;
      };

      render(<TestComponent />);
      expect(stateFactory).toHaveBeenCalledOnce();
    });

    test("should not initialize state by default until useReact is called", () => {
      const stateFactory = vi.fn();
      const gStore = new GStore(stateFactory);
      expect(stateFactory).not.toHaveBeenCalledOnce();

      const TestComponent = () => {
        gStore.useReact(() => null);
        return null;
      };

      render(<TestComponent />);
      expect(stateFactory).toHaveBeenCalledOnce();
    });

    test('should initialize state immediately with "eager" option', () => {
      const stateFactory = vi.fn();
      new GStore(stateFactory, { initialize: "eager" });
      expect(stateFactory).toHaveBeenCalledOnce();
    });
  });

  describe("destroy option", () => {
    test('should not destroy state with "no" option after all subscribers are removed', () => {
      const destroy = vi.spyOn(GStore.prototype, "destroy");
      const gStore = new GStore(stateFactoryStub, { destroy: "no" });

      const unsubscribeFirst = gStore.subscribe(() => ({}));
      const unsubscribeSecond = gStore.subscribe(() => ({}));
      const unsubscribeThird = gStore.subscribe(() => ({}));

      unsubscribeFirst();
      unsubscribeSecond();
      unsubscribeThird();

      expect(destroy).not.toHaveBeenCalled();
    });

    test("should not destroy state by default after all subscribers are removed", () => {
      const destroy = vi.spyOn(GStore.prototype, "destroy");
      const gStore = new GStore(stateFactoryStub);

      const unsubscribeFirst = gStore.subscribe(() => ({}));
      const unsubscribeSecond = gStore.subscribe(() => ({}));
      const unsubscribeThird = gStore.subscribe(() => ({}));

      unsubscribeFirst();
      unsubscribeSecond();
      unsubscribeThird();

      expect(destroy).not.toHaveBeenCalled();
    });

    test('should destroy state with "on-all-unsubscribed" option when last subscriber is removed', () => {
      const destroy = vi.spyOn(GStore.prototype, "destroy");
      const gStore = new GStore(stateFactoryStub, {
        destroy: "on-all-unsubscribed",
      });

      const unsubscribeFirst = gStore.subscribe(() => ({}));
      const unsubscribeSecond = gStore.subscribe(() => ({}));
      const unsubscribeThird = gStore.subscribe(() => ({}));

      unsubscribeFirst();
      unsubscribeSecond();
      expect(destroy).not.toHaveBeenCalled();

      unsubscribeThird();
      expect(destroy).toHaveBeenCalledOnce();
    });

    test('should destroy state only once with "on-all-unsubscribed" option', () => {
      const destroy = vi.spyOn(GStore.prototype, "destroy");
      const gStore = new GStore(stateFactoryStub, {
        destroy: "on-all-unsubscribed",
      });

      const unsubscribeFirst = gStore.subscribe(() => ({}));
      const unsubscribeSecond = gStore.subscribe(() => ({}));
      const unsubscribeThird = gStore.subscribe(() => ({}));

      unsubscribeFirst();
      unsubscribeSecond();
      unsubscribeThird();
      unsubscribeFirst();
      unsubscribeSecond();
      unsubscribeThird();

      expect(destroy).toHaveBeenCalledOnce();
    });

    test('should not destroy state with "no" option after all components unmount', () => {
      const destroy = vi.spyOn(GStore.prototype, "destroy");
      const gStore = new GStore(stateFactoryStub, { destroy: "no" });

      const TestComponent = () => {
        gStore.useReact(() => null);
        return null;
      };

      const { unmount: unmountFirst } = render(<TestComponent />);
      const { unmount: unmountSecond } = render(<TestComponent />);

      unmountFirst();
      unmountSecond();

      expect(destroy).not.toHaveBeenCalled();
    });

    test("should not destroy state by default after all components unmount", () => {
      const destroy = vi.spyOn(GStore.prototype, "destroy");
      const gStore = new GStore(stateFactoryStub);

      const TestComponent = () => {
        gStore.useReact(() => null);
        return null;
      };

      const { unmount: unmountFirst } = render(<TestComponent />);
      const { unmount: unmountSecond } = render(<TestComponent />);

      unmountFirst();
      unmountSecond();

      expect(destroy).not.toHaveBeenCalled();
    });

    test('should destroy state with "on-all-unsubscribed" option after all components unmount', () => {
      const destroy = vi.spyOn(GStore.prototype, "destroy");
      const gStore = new GStore(stateFactoryStub, {
        destroy: "on-all-unsubscribed",
      });

      const TestComponent = () => {
        gStore.useReact(() => null);
        return null;
      };

      const { unmount: unmountFirst } = render(<TestComponent />);
      const { unmount: unmountSecond } = render(<TestComponent />);

      unmountFirst();
      expect(destroy).not.toHaveBeenCalled();

      unmountSecond();
      expect(destroy).toHaveBeenCalledOnce();
    });

    test('should reinitialize state after destruction with "lazy" initialization', () => {
      const stateFactory = vi.fn();
      const destroy = vi.spyOn(GStore.prototype, "destroy");

      const gStore = new GStore(stateFactory, {
        initialize: "lazy",
        destroy: "on-all-unsubscribed",
      });

      const unsubscribe = gStore.subscribe(() => ({}));
      gStore.getState();
      gStore.getState();
      gStore.getState();

      expect(stateFactory).toHaveBeenCalledOnce();
      expect(destroy).not.toHaveBeenCalled();

      unsubscribe();
      expect(destroy).toHaveBeenCalledOnce();
      expect(stateFactory).toHaveBeenCalledOnce();

      gStore.getState();
      gStore.getState();
      gStore.getState();

      expect(destroy).toHaveBeenCalledOnce();
      expect(stateFactory).toHaveBeenCalledTimes(2);
    });

    test('should reinitialize state after destruction with "eager" initialization', () => {
      const stateFactory = vi.fn();
      const destroy = vi.spyOn(GStore.prototype, "destroy");

      const gStore = new GStore(stateFactory, {
        initialize: "eager",
        destroy: "on-all-unsubscribed",
      });

      expect(stateFactory).toHaveBeenCalledOnce();

      const unsubscribe = gStore.subscribe(() => ({}));
      expect(destroy).not.toHaveBeenCalled();

      unsubscribe();
      expect(destroy).toHaveBeenCalledOnce();
      expect(stateFactory).toHaveBeenCalledOnce();

      gStore.getState();
      gStore.getState();
      gStore.getState();

      expect(destroy).toHaveBeenCalledOnce();
      expect(stateFactory).toHaveBeenCalledTimes(2);
    });
  });
});
