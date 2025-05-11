import { act, render } from "@testing-library/react";
import { useCallback, useState, useSyncExternalStore } from "react";
import { nextTask } from "../lib";
import { createGStore } from "../../index";

describe("useSyncExternalStore in useGStore", () => {
  describe("Subscription and snapshot behavior", () => {
    const createTestStore = <V extends number | string, S extends { value: V }>(
      {
        subscribe,
        getSnapshot,
        getServerSnapshot,
        renderHook,
      }: {
        renderHook?: (name: string) => void;
        subscribe: () => () => void;
        getSnapshot: () => S;
        getServerSnapshot?: () => S;
      },
      { destroy }: { destroy?: "on-all-unsubscribed" } = {},
    ) => {
      const useGStore = createGStore(
        () => {
          const snapshot = useSyncExternalStore(
            subscribe,
            getSnapshot,
            getServerSnapshot,
          );

          const [counter, setCounter] = useState(0);

          const increaseCounter = useCallback(
            () => setCounter((prevCounter) => prevCounter + 1),
            [],
          );

          return {
            snapshot,
            counter,
            increaseCounter,
          };
        },
        { destroy },
      );

      const Snapshot = () => {
        const snapshot = useGStore(({ snapshot }) => snapshot);
        renderHook?.("snapshot-value");
        return <div data-testid="snapshot-value">{snapshot.value}</div>;
      };

      return {
        Snapshot,
        useGStore,
      };
    };

    test("Should subscribe to external store on initial render and maintain subscription", async () => {
      const snapshot = {
        value: 1,
      };
      const renderHook = vi.fn();
      const subscribe = vi.fn(() => () => null);
      const getSnapshot = vi.fn(() => snapshot);

      const { Snapshot } = createTestStore({
        renderHook,
        subscribe,
        getSnapshot,
      });

      const { getByTestId } = render(<Snapshot />);

      expect(renderHook).toHaveBeenCalledWith("snapshot-value");
      expect(getByTestId("snapshot-value")).toHaveTextContent("1");

      await nextTask();

      expect(subscribe).toHaveBeenCalledTimes(1);
      expect(renderHook).toHaveBeenCalledTimes(1);
    });

    test("Should maintain memoized snapshot reference across state updates", async () => {
      const snapshot = {
        value: 1,
      };
      const renderHook = vi.fn();
      const subscribe = vi.fn(() => () => null);
      const getSnapshot = vi.fn(() => snapshot);

      const { Snapshot, useGStore } = createTestStore({
        renderHook,
        subscribe,
        getSnapshot,
      });

      render(<Snapshot />);

      expect(renderHook).toHaveBeenCalledTimes(1);
      expect(useGStore.getState().counter).toBe(0);

      await act(async () => useGStore.getState().increaseCounter());
      await act(async () => useGStore.getState().increaseCounter());
      await act(async () => useGStore.getState().increaseCounter());

      expect(useGStore.getState().counter).toBe(3);

      expect(renderHook).toHaveBeenCalledTimes(1);
    });

    test("Should maintain subscription after component unmount by default", async () => {
      const snapshot = {
        value: 1,
      };
      const unsubscribe = vi.fn();
      const subscribe = vi.fn(() => unsubscribe);
      const getSnapshot = vi.fn(() => snapshot);

      const { Snapshot } = createTestStore({
        subscribe,
        getSnapshot,
      });

      const { unmount } = render(<Snapshot />);

      await nextTask();

      unmount();

      await nextTask();

      expect(subscribe).toHaveBeenCalledTimes(1);
      expect(unsubscribe).toHaveBeenCalledTimes(0);
    });

    test("Should unsubscribe from external store when component unmounts with destroy: 'on-all-unsubscribed'", async () => {
      const snapshot = {
        value: 1,
      };
      const unsubscribe = vi.fn();
      const subscribe = vi.fn(() => unsubscribe);
      const getSnapshot = vi.fn(() => snapshot);

      const { Snapshot } = createTestStore(
        { subscribe, getSnapshot },
        { destroy: "on-all-unsubscribed" },
      );

      const { unmount } = render(<Snapshot />);

      await nextTask();

      expect(unsubscribe).toHaveBeenCalledTimes(0);

      unmount();

      await nextTask();

      expect(subscribe).toHaveBeenCalledTimes(1);
      expect(unsubscribe).toHaveBeenCalledTimes(1);
    });

    test("Should only use client snapshot during client-side rendering", async () => {
      const snapshot = {
        value: 1,
      };
      const subscribe = vi.fn(() => () => null);
      const getSnapshot = vi.fn(() => snapshot);
      const getServerSnapshot = vi.fn(() => snapshot);

      const { Snapshot } = createTestStore({
        subscribe,
        getSnapshot,
        getServerSnapshot,
      });

      const { unmount } = render(<Snapshot />);

      await nextTask();

      expect(getSnapshot).toHaveBeenCalledTimes(1);
      expect(getServerSnapshot).toHaveBeenCalledTimes(0);

      unmount();

      await nextTask();

      expect(getSnapshot).toHaveBeenCalledTimes(1);
      expect(getServerSnapshot).toHaveBeenCalledTimes(0);
    });

    test.todo("Check server snapshot");

    test.todo("Check hydration");
  });

  describe("Test with TestExternalStore", () => {
    test.skip("Should handle external store updates and re-renders correctly", async () => {});
  });
});
