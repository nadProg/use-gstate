import { useSyncExternalStore } from "react";
import { act, cleanup, getByTestId, render } from "@testing-library/react";
import { hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { createContainer, nextTask } from "../lib";
import { TestExternalStore } from "./test-external-store.ts";

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("Native useSyncExternalStore subscription and snapshot behavior", () => {
  test("calls subscribe and getSnapshot on client, not getServerSnapshot, and renders value", () => {
    const subscribe = vi.fn(() => () => null);
    const getSnapshot = vi.fn(() => "value");
    const getServerSnapshot = vi.fn(() => "value");

    const Component = () => {
      const store = useSyncExternalStore(
        subscribe,
        getSnapshot,
        getServerSnapshot,
      );

      return <div data-testid="value">{store}</div>;
    };

    const { getByTestId } = render(<Component />);

    expect(subscribe).toHaveBeenCalledOnce();
    expect(getSnapshot).toHaveBeenCalled();
    expect(getServerSnapshot).not.toHaveBeenCalled();
    expect(getByTestId("value")).toHaveTextContent("value");
  });

  test("calls only getServerSnapshot on server and renders value, does not call subscribe or getSnapshot", () => {
    const subscribe = vi.fn(() => () => null);
    const getSnapshot = vi.fn(() => "value");
    const getServerSnapshot = vi.fn(() => "value");

    const Component = () => {
      const store = useSyncExternalStore(
        subscribe,
        getSnapshot,
        getServerSnapshot,
      );

      return <div data-testid="value">{store}</div>;
    };

    const html = renderToString(<Component />);

    expect(subscribe).not.toHaveBeenCalled();
    expect(getSnapshot).not.toHaveBeenCalled();
    expect(getServerSnapshot).toHaveBeenCalled();
    expect(html).toBe('<div data-testid="value">value</div>');
  });

  test("hydrates from server to client: uses getServerSnapshot on server, then subscribe and getSnapshot on client, unsubscribes on unmount", () => {
    const unsubscribe = vi.fn();
    const subscribe = vi.fn(() => unsubscribe);
    const getSnapshot = vi.fn(() => "client");
    const getServerSnapshot = vi.fn(() => "server");

    const Component = () => {
      const store = useSyncExternalStore(
        subscribe,
        getSnapshot,
        getServerSnapshot,
      );

      return <div data-testid="value">{store}</div>;
    };

    const html = renderToString(<Component />);

    expect(subscribe).not.toHaveBeenCalled();
    expect(getSnapshot).not.toHaveBeenCalled();
    expect(getServerSnapshot).toHaveBeenCalled();
    expect(html).toBe('<div data-testid="value">server</div>');

    const container = document.createElement("div");
    container.innerHTML = html;

    const { getByTestId, unmount } = render(<Component />, {
      container,
      hydrate: true,
    });

    expect(subscribe).toHaveBeenCalled();
    expect(getSnapshot).toHaveBeenCalled();
    expect(getByTestId("value")).toHaveTextContent("client");
    expect(unsubscribe).not.toHaveBeenCalled();

    unmount();

    expect(unsubscribe).toHaveBeenCalledOnce();
  });

  test("hydrates with hydrateRoot: uses getServerSnapshot on server, then subscribe and getSnapshot on client, unsubscribes on unmount (async)", async () => {
    const unsubscribe = vi.fn();
    const subscribe = vi.fn(() => unsubscribe);
    const getSnapshot = vi.fn(() => "client");
    const getServerSnapshot = vi.fn(() => "server");

    const Component = () => {
      const store = useSyncExternalStore(
        subscribe,
        getSnapshot,
        getServerSnapshot,
      );

      return <div data-testid="value">{store}</div>;
    };

    const html = renderToString(<Component />);

    expect(subscribe).not.toHaveBeenCalled();
    expect(getSnapshot).not.toHaveBeenCalled();
    expect(getServerSnapshot).toHaveBeenCalled();
    expect(html).toBe('<div data-testid="value">server</div>');

    const container = createContainer({ html });

    const root = hydrateRoot(container, <Component />);

    await nextTask();
    await act(async () => root.render(<Component />));

    expect(subscribe).toHaveBeenCalled();
    expect(getSnapshot).toHaveBeenCalled();
    expect(getByTestId(container, "value")).toHaveTextContent("client");
    expect(unsubscribe).not.toHaveBeenCalled();

    await act(async () => root.unmount());

    expect(unsubscribe).toHaveBeenCalledOnce();
  });

  test("updates component when external store state changes", async () => {
    const externalStore = new TestExternalStore(0);

    const Component = () => {
      const store = useSyncExternalStore(
        (listener) => externalStore.subscribe(listener),
        () => externalStore.getSnapshot(),
      );

      return <div data-testid="value">{store}</div>;
    };

    const { getByTestId } = render(<Component />);

    expect(getByTestId("value")).toHaveTextContent("0");

    await act(async () => externalStore.setState(5));

    expect(getByTestId("value")).toHaveTextContent("5");
  });
});
