import { useState } from "react";
import "@testing-library/jest-dom";
import { describe, expect, vi, test } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

import { createGStore } from "../index";

const createTestComponents = ({
  renderHook,
  destroy,
}: {
  renderHook?: (name: string) => void;
  destroy?: "no" | "on-all-unsubscribed";
} = {}) => {
  const useGStore = createGStore(
    () => {
      const [counter, setCounter] = useState(0);

      const increase = () => setCounter((prevCounter) => prevCounter + 1);

      const reset = () => setCounter(0);

      const [user, setUser] = useState({ name: "John" });

      const setUserName = (name: string) =>
        setUser((prevUser) => ({ ...prevUser, name }));

      return {
        counter,
        increase,
        reset,
        user,
        setUserName,
      };
    },
    { destroy },
  );

  const CounterValue = () => {
    const counter = useGStore(({ counter }) => counter);

    renderHook?.("counter-value");

    return <div data-testid="counter-value">{counter}</div>;
  };

  const CounterIncreaseButton = () => {
    const increase = useGStore(({ increase }) => increase);

    renderHook?.("increase-button");

    return (
      <button typeof="button" data-testid="increase-button" onClick={increase}>
        Increase
      </button>
    );
  };

  const Counter = () => {
    renderHook?.("counter");

    return (
      <div data-testid={"counter"}>
        <CounterIncreaseButton />
        <CounterValue />
      </div>
    );
  };

  const UserName = () => {
    const username = useGStore(({ user }) => user.name);

    renderHook?.("username");

    return <div data-testid="username">{username}</div>;
  };

  const User = () => {
    renderHook?.("user");

    return (
      <div data-testid="user">
        <UserName />
      </div>
    );
  };

  return {
    User,
    Counter,
    useGStore,
  };
};

describe("useState-based gStore behavior", () => {
  describe("Initial rendering behavior", () => {
    test("should render Counter component with initial state and child components", () => {
      const renderHook = vi.fn();
      const { Counter } = createTestComponents({ renderHook });

      render(<Counter />);

      const counterComponent = screen.getByTestId("counter");

      expect(counterComponent).toBeInTheDocument();
      expect(screen.getByTestId("counter-value")).toBeInTheDocument();
      expect(screen.getByTestId("increase-button")).toBeInTheDocument();

      const counterValueComponent = counterComponent.querySelector(
        '[data-testid="counter-value"]',
      );

      const increaseButtonComponent = counterComponent.querySelector(
        '[data-testid="increase-button"]',
      );

      expect(counterValueComponent).toBeInTheDocument();
      expect(counterValueComponent).toHaveTextContent("0");

      expect(increaseButtonComponent).toBeInTheDocument();

      expect(renderHook).toHaveBeenCalledWith("counter");
      expect(renderHook).toHaveBeenCalledWith("counter-value");
      expect(renderHook).toHaveBeenCalledWith("increase-button");
      expect(renderHook).toHaveBeenCalledTimes(3);
    });

    test("should render User component with initial user state", () => {
      const renderHook = vi.fn();
      const { User } = createTestComponents({ renderHook });

      render(<User />);

      const userComponent = screen.getByTestId("user");

      expect(userComponent).toBeInTheDocument();
      expect(screen.getByTestId("username")).toBeInTheDocument();

      const usernameComponent = userComponent.querySelector(
        '[data-testid="username"]',
      );

      expect(usernameComponent).toBeInTheDocument();
      expect(usernameComponent).toHaveTextContent("John");

      expect(renderHook).toHaveBeenCalledWith("user");
      expect(renderHook).toHaveBeenCalledWith("username");
      expect(renderHook).toHaveBeenCalledTimes(2);
    });
  });

  describe("State updates and rerendering", () => {
    test("should increment counter state when increase button is clicked", async () => {
      const { Counter } = createTestComponents();

      render(<Counter />);

      const counterValueComponent = screen.getByTestId("counter-value");
      const increaseButtonComponent = screen.getByTestId("increase-button");

      expect(counterValueComponent).toHaveTextContent("0");

      expect(increaseButtonComponent).toBeInTheDocument();

      await userEvent.click(increaseButtonComponent);

      expect(counterValueComponent).toHaveTextContent("1");

      await userEvent.click(increaseButtonComponent);
      await userEvent.click(increaseButtonComponent);

      expect(counterValueComponent).toHaveTextContent("3");
    });

    test("should only rerender components that subscribe to changed state", async () => {
      const renderHook = vi.fn();
      const { Counter, User } = createTestComponents({ renderHook });

      render(
        <div>
          <Counter />
          <User />
        </div>,
      );

      const increaseButtonComponent = screen.getByTestId("increase-button");

      expect(renderHook).toHaveBeenCalledWith("counter");
      expect(renderHook).toHaveBeenCalledWith("increase-button");
      expect(renderHook).toHaveBeenCalledWith("counter-value");
      expect(renderHook).toHaveBeenCalledWith("user");
      expect(renderHook).toHaveBeenCalledWith("username");
      expect(renderHook).toHaveBeenCalledTimes(5);

      await userEvent.click(increaseButtonComponent);
      await userEvent.click(increaseButtonComponent);
      await userEvent.click(increaseButtonComponent);

      // +6 = 3 count updates + 3 non-memoized increase callbacks
      expect(renderHook).toHaveBeenCalledTimes(11);
    });

    test("should update state and trigger rerenders when state is modified outside components", async () => {
      const renderHook = vi.fn();
      const { Counter, User, useGStore } = createTestComponents({ renderHook });

      render(
        <div>
          <Counter />
          <User />
        </div>,
      );

      const counterValueComponent = screen.getByTestId("counter-value");

      expect(renderHook).toHaveBeenCalledWith("counter");
      expect(renderHook).toHaveBeenCalledWith("increase-button");
      expect(renderHook).toHaveBeenCalledWith("counter-value");
      expect(renderHook).toHaveBeenCalledWith("user");
      expect(renderHook).toHaveBeenCalledWith("username");
      expect(renderHook).toHaveBeenCalledTimes(5);

      await act(async () => useGStore.getState().increase());
      await act(async () => useGStore.getState().increase());
      await act(async () => useGStore.getState().increase());

      // +6 = 3 count updates + 3 non-memoized increase callbacks
      expect(renderHook).toHaveBeenCalledTimes(11);
      expect(counterValueComponent).toHaveTextContent("3");
    });

    test("should reflect component state updates in getState() result", async () => {
      const renderHook = vi.fn();
      const { Counter, User, useGStore } = createTestComponents({ renderHook });

      render(
        <div>
          <Counter />
          <User />
        </div>,
      );

      const increaseButtonComponent = screen.getByTestId("increase-button");

      await userEvent.click(increaseButtonComponent);
      await userEvent.click(increaseButtonComponent);
      await userEvent.click(increaseButtonComponent);

      expect(useGStore.getState()).toEqual(
        expect.objectContaining({
          counter: 3,
          increase: expect.any(Function),
          reset: expect.any(Function),
          user: { name: "John" },
          setUserName: expect.any(Function),
        }),
      );
    });

    test("should trigger subscribers when state is updated through components", async () => {
      const renderHook = vi.fn();
      const subscriber = vi.fn();
      const { Counter, User, useGStore } = createTestComponents({ renderHook });

      useGStore.subscribe(subscriber);

      render(
        <div>
          <Counter />
          <User />
        </div>,
      );

      expect(subscriber).not.toHaveBeenCalled();

      const increaseButtonComponent = screen.getByTestId("increase-button");

      await userEvent.click(increaseButtonComponent);
      await userEvent.click(increaseButtonComponent);
      await userEvent.click(increaseButtonComponent);

      expect(subscriber).toHaveBeenCalledTimes(3);
    });
  });

  describe("Remount component behavior", () => {
    test("should persist state after component unmount by default", async () => {
      const { Counter } = createTestComponents();

      const { unmount } = render(<Counter />);

      let counterValueComponent = screen.getByTestId("counter-value");
      const increaseButtonComponent = screen.getByTestId("increase-button");

      expect(counterValueComponent).toHaveTextContent("0");

      await userEvent.click(increaseButtonComponent);
      await userEvent.click(increaseButtonComponent);
      await userEvent.click(increaseButtonComponent);

      expect(counterValueComponent).toHaveTextContent("3");

      unmount();

      render(<Counter />);

      counterValueComponent = screen.getByTestId("counter-value");

      expect(counterValueComponent).toHaveTextContent("3");
    });

    test("should reset state after unmount when destroy option is set to 'on-all-unsubscribed'", async () => {
      const { Counter } = createTestComponents({
        destroy: "on-all-unsubscribed",
      });

      const { unmount } = render(<Counter />);

      let counterValueComponent = screen.getByTestId("counter-value");
      const increaseButtonComponent = screen.getByTestId("increase-button");

      expect(counterValueComponent).toHaveTextContent("0");

      await userEvent.click(increaseButtonComponent);
      await userEvent.click(increaseButtonComponent);
      await userEvent.click(increaseButtonComponent);

      expect(counterValueComponent).toHaveTextContent("3");

      unmount();

      render(<Counter />);

      counterValueComponent = screen.getByTestId("counter-value");

      expect(counterValueComponent).toHaveTextContent("0");
    });
  });
});
