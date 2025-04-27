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

  describe.skip('onFirstSubscribed', () => {
    test('calls onFirstSubscribed on first subscription', () => {});
  });

  describe.skip('onAllUnsubscribed', () => {
    test('calls onAllUnsubscribed when all subscribers are unsubscribed', () => {});
  });

  describe.skip('initialize option', () => {
    test('does not call initialize with "lazy" and no subscribers', () => {});
    test('calls initialize with "eager" when store is created', () => {});
  });

  describe.skip('destroy option', () => {
    test('does not call destroy with destroy: "no"', () => {});
    test('calls destroy with destroy: "on-all-unsubscribed" after all subscribers unsubscribe', () => {});
  });
});
