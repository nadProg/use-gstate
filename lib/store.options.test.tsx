import { render } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import { GStore } from './store.ts';

describe('GStore - GStoreOptions', () => {
  const stateFactoryStub = () => ({});

  test('create GStore', () => {
    const store = new GStore(stateFactoryStub);

    expect(store).toBeDefined();
  });

  describe('onSubscribed', () => {
    test('calls onSubscribed when subscribed', () => {
      const onSubscribed = vi.fn();

      const gStore = new GStore(stateFactoryStub, { onSubscribed });

      expect(onSubscribed).not.toHaveBeenCalled();

      gStore.subscribe(() => ({}));

      expect(onSubscribed).toHaveBeenCalledOnce();
    });

    test('passes correct number of subscribers to onSubscribed', () => {
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

  describe('onUnsubscribed', () => {
    test('calls onUnsubscribed when unsubscribed', () => {
      const onUnsubscribed = vi.fn();

      const gStore = new GStore(stateFactoryStub, { onUnsubscribed });

      const unsubscribe = gStore.subscribe(() => ({}));

      expect(onUnsubscribed).not.toHaveBeenCalled();

      unsubscribe();

      expect(onUnsubscribed).toHaveBeenCalledOnce();
    });

    test('passes correct number of subscribers to onUnsubscribed', () => {
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

  describe('onFirstSubscribed', () => {
    test('calls onFirstSubscribed on first subscription', () => {
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

  describe('onAllUnsubscribed', () => {
    test('calls onAllUnsubscribed when all subscribers are unsubscribed', () => {
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
  });

  describe('onSubscribed + onFirstSubscribed + onUnsubscribed + onAllUnsubscribed', () => {
    test('should not affect together', () => {
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

  describe('initialize option', () => {
    test('does not call initialize with "lazy" before getState call', () => {
      const stateFactory = vi.fn();
      const initialize = vi.spyOn(GStore.prototype, 'initialize');

      const gStore = new GStore(stateFactory, { initialize: 'lazy' });

      expect(initialize).not.toHaveBeenCalled();
      expect(stateFactory).not.toHaveBeenCalled();

      gStore.getState();

      expect(initialize).toHaveBeenCalledOnce();
      expect(stateFactory).toHaveBeenCalledOnce();
    });

    test('does not call initialize by default before getState call', () => {
      const stateFactory = vi.fn();
      const initialize = vi.spyOn(GStore.prototype, 'initialize');

      const gStore = new GStore(stateFactory);

      expect(initialize).not.toHaveBeenCalled();
      expect(stateFactory).not.toHaveBeenCalled();

      gStore.getState();

      expect(initialize).toHaveBeenCalledOnce();
      expect(stateFactory).toHaveBeenCalledOnce();
    });

    test('does not call initialize with "lazy" before useReact call', () => {
      const stateFactory = vi.fn();
      const initialize = vi.spyOn(GStore.prototype, 'initialize');

      const gStore = new GStore(stateFactory, { initialize: 'lazy' });

      expect(initialize).not.toHaveBeenCalled();

      const TestComponent = () => {
        gStore.useReact(() => null);
        return null;
      };

      render(<TestComponent />);

      expect(initialize).toHaveBeenCalledOnce();
      expect(stateFactory).toHaveBeenCalledOnce();
    });

    test('does not call initialize by default before useReact call', () => {
      const stateFactory = vi.fn();
      const initialize = vi.spyOn(GStore.prototype, 'initialize');

      const gStore = new GStore(stateFactory);

      expect(initialize).not.toHaveBeenCalled();

      const TestComponent = () => {
        gStore.useReact(() => null);
        return null;
      };

      render(<TestComponent />);

      expect(initialize).toHaveBeenCalledOnce();
      expect(stateFactory).toHaveBeenCalledOnce();
    });

    test('calls initialize with "eager" when store is created', () => {
      const stateFactory = vi.fn();
      const initialize = vi.spyOn(GStore.prototype, 'initialize');

      new GStore(stateFactory, { initialize: 'eager' });

      expect(initialize).toHaveBeenCalledOnce();
      expect(stateFactory).toHaveBeenCalledOnce();
    });
  });

  describe('destroy option', () => {
    test('does not call destroy with destroy: "no"', () => {
      const destroy = vi.spyOn(GStore.prototype, 'destroy');

      const gStore = new GStore(stateFactoryStub, { destroy: 'no' });

      const unsubscribeFirst = gStore.subscribe(() => ({}));
      const unsubscribeSecond = gStore.subscribe(() => ({}));
      const unsubscribeThird = gStore.subscribe(() => ({}));

      unsubscribeFirst();
      unsubscribeSecond();
      unsubscribeThird();

      expect(destroy).not.toHaveBeenCalled();
    });

    test('does not call destroy by default', () => {
      const destroy = vi.spyOn(GStore.prototype, 'destroy');

      const gStore = new GStore(stateFactoryStub);

      const unsubscribeFirst = gStore.subscribe(() => ({}));
      const unsubscribeSecond = gStore.subscribe(() => ({}));
      const unsubscribeThird = gStore.subscribe(() => ({}));

      unsubscribeFirst();
      unsubscribeSecond();
      unsubscribeThird();

      expect(destroy).not.toHaveBeenCalled();
    });

    test('calls destroy with destroy: "on-all-unsubscribed" after all subscribers unsubscribe', () => {
      const destroy = vi.spyOn(GStore.prototype, 'destroy');

      const gStore = new GStore(stateFactoryStub, {
        destroy: 'on-all-unsubscribed',
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
  });
});
