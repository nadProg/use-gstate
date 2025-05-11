import { act, render } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { useCallback, useState, useSyncExternalStore } from "react";
import { createGStore } from "../../index";
import { nextTask } from "../lib";
import { TestExternalStore } from "./test-external-store.ts";

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

      const { Snapshot, useGStore } = createTestStore({
        renderHook,
        subscribe,
        getSnapshot,
      });

      const { getByTestId } = render(<Snapshot />);

      expect(renderHook).toHaveBeenCalledWith("snapshot-value");
      expect(getByTestId("snapshot-value")).toHaveTextContent("1");
      expect(useGStore.getState().snapshot).toEqual({ value: 1 });

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

    test("Should get server snapshot when there's no window in the environment", async () => {
      const originalWindow = globalThis.window;

      try {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        delete globalThis.window;

        const clientSnapshot = {
          value: "ssr",
        };
        const serverSnapshot = {
          value: "ssr",
        };
        const renderHook = vi.fn();
        const subscribe = vi.fn(() => () => null);
        const getSnapshot = vi.fn(() => clientSnapshot);
        const getServerSnapshot = vi.fn(() => serverSnapshot);

        const { Snapshot } = createTestStore({
          renderHook,
          subscribe,
          getSnapshot,
          getServerSnapshot,
        });

        const serverHtml = renderToString(<Snapshot />);

        expect(serverHtml).toBe('<div data-testid="snapshot-value">ssr</div>');
        expect(getSnapshot).not.toHaveBeenCalled();
        expect(getServerSnapshot).toHaveBeenCalledOnce();
        expect(renderHook).toHaveBeenCalledOnce();
      } finally {
        globalThis.window = originalWindow;
      }
    });

    test("Support hydration behavior after server rendering", async () => {
      const originalWindow = globalThis.window;

      try {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        delete globalThis.window;

        const clientSnapshot = {
          value: "ssr",
        };
        const serverSnapshot = {
          value: "ssr",
        };
        const renderHook = vi.fn();
        const subscribe = vi.fn(() => () => null);
        const getSnapshot = vi.fn(() => clientSnapshot);
        const getServerSnapshot = vi.fn(() => serverSnapshot);

        const { Snapshot } = createTestStore({
          renderHook,
          subscribe,
          getSnapshot,
          getServerSnapshot,
        });

        const serverSnapshotHtml = renderToString(<Snapshot />);

        globalThis.window = originalWindow;

        const container = document.createElement("div");
        container.innerHTML = serverSnapshotHtml;

        const { getByTestId } = render(<Snapshot />, {
          container,
          hydrate: true,
        });

        expect(renderHook).toHaveBeenCalledTimes(2);
        // todo: client snapshot should be called
        // expect(getSnapshot).toHaveBeenCalledOnce();
        expect(getServerSnapshot).toHaveBeenCalledOnce();
        expect(getByTestId("snapshot-value")).toHaveTextContent("ssr");

        await nextTask();
        // todo: subscription should happen
        // expect(subscribe).toHaveBeenCalledOnce();
      } finally {
        globalThis.window = originalWindow;
      }
    });
  });

  describe("Test with TestExternalStore", () => {
    const createTestStore = <V extends number | string, S extends { value: V }>(
      {
        renderHook,
        initialState,
      }: { initialState: S; renderHook?: (name: string) => void },
      { destroy }: { destroy?: "on-all-unsubscribed" } = {},
    ) => {
      const externalStore = new TestExternalStore<S>(initialState);

      const useGStore = createGStore(
        () => {
          const snapshot = useSyncExternalStore(
            (listener) => externalStore.subscribe(listener),
            () => externalStore.getSnapshot(),
            () => externalStore.getSnapshot(),
          );

          return {
            snapshot,
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
        externalStore,
      };
    };

    test("Initial render", async () => {
      const renderHook = vi.fn();

      const { Snapshot, useGStore } = createTestStore({
        renderHook,
        initialState: { value: 1 },
      });

      const { getByTestId } = render(<Snapshot />);

      expect(renderHook).toHaveBeenCalledWith("snapshot-value");
      expect(getByTestId("snapshot-value")).toHaveTextContent("1");
      expect(useGStore.getState().snapshot).toEqual({ value: 1 });
      expect(renderHook).toHaveBeenCalledTimes(1);
    });

    test("Should handle external store updates and re-renders correctly", async () => {
      const renderHook = vi.fn();

      const { Snapshot, externalStore } = createTestStore({
        renderHook,
        initialState: { value: 1 as number },
      });

      const { getByTestId } = render(<Snapshot />);

      expect(getByTestId("snapshot-value")).toHaveTextContent("1");
      expect(renderHook).toHaveBeenCalledTimes(1);

      await nextTask();

      await act(async () => externalStore.setState({ value: 5 }));

      expect(getByTestId("snapshot-value")).toHaveTextContent("5");
      expect(renderHook).toHaveBeenCalledTimes(2);

      await act(async () => externalStore.setState({ value: 10 }));

      expect(getByTestId("snapshot-value")).toHaveTextContent("10");
      expect(renderHook).toHaveBeenCalledTimes(3);
    });

    test("Should get server snapshot when there's no window in the environment", async () => {
      const originalWindow = globalThis.window;

      try {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        delete globalThis.window;

        const { Snapshot } = createTestStore({
          initialState: { value: "ssr" as string },
        });

        const serverHtml = renderToString(<Snapshot />);

        expect(serverHtml).toBe('<div data-testid="snapshot-value">ssr</div>');
      } finally {
        globalThis.window = originalWindow;
      }
    });

    test("Support hydration behavior after server rendering", async () => {
      const originalWindow = globalThis.window;

      try {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        delete globalThis.window;

        const { Snapshot, externalStore } = createTestStore({
          initialState: { value: "ssr" as string },
        });

        const serverSnapshotHtml = renderToString(<Snapshot />);

        globalThis.window = originalWindow;

        const container = document.createElement("div");
        container.innerHTML = serverSnapshotHtml;

        const { getByTestId } = render(<Snapshot />, {
          container,
          hydrate: true,
        });

        expect(getByTestId("snapshot-value")).toHaveTextContent("ssr");

        await nextTask();

        await act(async () => externalStore.setState({ value: "client" }));

        // todo: state should be updated
        // expect(getByTestId("snapshot-value")).toHaveTextContent("client");
      } finally {
        globalThis.window = originalWindow;
      }
    });
  });
});
