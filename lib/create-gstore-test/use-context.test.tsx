import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { act, cleanup, render } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { createGStore } from "../index";

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("useContext in useGStore", () => {
  const createTestStore = () => {
    const context = createContext<{
      counter: number;
      setCounter: Dispatch<SetStateAction<number>> | null;
    }>({
      counter: 0,
      setCounter: null,
    });

    const Provider = ({
      children,
      initialValue,
    }: PropsWithChildren<{ initialValue?: number }>) => {
      const [counter, setCounter] = useState(initialValue ?? 1);

      return (
        <context.Provider value={{ counter, setCounter }}>
          {children}
        </context.Provider>
      );
    };

    const IncreaseCounterViaContext = () => {
      const { setCounter } = useContext(context);

      return (
        <button
          data-testid="increase-button"
          onClick={() => setCounter?.((prev) => prev + 1)}
        >
          Increase
        </button>
      );
    };

    const useGStore = createGStore(() => {
      const { counter, setCounter } = useContext(context);

      return {
        counter,
        setCounter,
      };
    });

    const Counter = () => {
      const counter = useGStore(({ counter }) => counter);

      return <div data-testid="counter">{counter}</div>;
    };

    return {
      useGStore,
      Counter,
      Provider,
      IncreaseCounterViaContext,
    };
  };

  test("Should initialize store with default context values when no provider is present", () => {
    const { useGStore } = createTestStore();

    expect(useGStore.getState()).toEqual({
      counter: 0,
      setCounter: null,
    });
  });

  test("Should render component with default context value when no provider is present", () => {
    const { Counter } = createTestStore();

    const { getByTestId } = render(<Counter />);

    expect(getByTestId("counter")).toHaveTextContent("0");
  });

  test("Should render component with provider's initial state and initialize store with provider values", () => {
    const { Counter, Provider, useGStore } = createTestStore();

    const { getByTestId } = render(
      <Provider>
        <Counter />
      </Provider>,
    );

    expect(getByTestId("counter")).toHaveTextContent("1");
    expect(useGStore.getState()).toEqual({
      counter: 1,
      setCounter: expect.any(Function),
    });
  });

  test("Should render component with provider's initial state and initialize store with closest provider values", () => {
    const { Counter, Provider, useGStore } = createTestStore();

    const { getByTestId } = render(
      <Provider initialValue={10}>
        <Provider initialValue={20}>
          <Counter />
        </Provider>
      </Provider>,
    );

    expect(getByTestId("counter")).toHaveTextContent("20");
    expect(useGStore.getState()).toEqual({
      counter: 20,
      setCounter: expect.any(Function),
    });
  });

  test.skip("Should update component state when store's setCounter is called directly", async () => {
    const { Counter, Provider, useGStore } = createTestStore();

    const { getByTestId } = render(
      <Provider>
        <Counter />
      </Provider>,
    );

    expect(getByTestId("counter")).toHaveTextContent("1");

    await act(async () =>
      useGStore.getState().setCounter?.((prev) => prev + 1),
    );

    expect(getByTestId("counter")).toHaveTextContent("2");
  });

  test.skip("Should update component state when counter is increased via context button click", async () => {
    const { Counter, Provider, IncreaseCounterViaContext } = createTestStore();

    const { getByTestId } = render(
      <Provider>
        <Counter />
        <IncreaseCounterViaContext />
      </Provider>,
    );

    const increaseButton = getByTestId("increase-button");

    expect(getByTestId("counter")).toHaveTextContent("1");

    await userEvent.click(increaseButton);

    expect(getByTestId("counter")).toHaveTextContent("2");
  });
});
