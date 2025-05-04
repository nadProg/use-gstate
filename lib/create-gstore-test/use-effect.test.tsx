import { useEffect, useState } from "react";
import "@testing-library/jest-dom";
import { describe, expect, vi, test } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

import { createGStore } from "../index";

describe("useEffect-based gStore behavior", () => {
  describe("useEffect with dependencies", () => {
    const createTestComponents = ({
      renderHook,
      effectHook,
      effectCleanupHook,
      initialize,
      destroy,
    }: {
      renderHook?: (name: string) => void;
      effectHook?: (value: unknown) => void;
      effectCleanupHook?: (value: unknown) => void;
      initialize?: "eager";
      destroy?: "on-all-unsubscribed";
    } = {}) => {
      const useGStore = createGStore(
        () => {
          const [counter, setCounter] = useState(0);

          const increase = () => setCounter((prevCounter) => prevCounter + 1);

          const [user, setUser] = useState<{ name: string } | null | undefined>(
            {
              name: "John",
            },
          );

          const resetUser = () => setUser({ name: "" });

          const restoreUser = () => setUser({ name: "John" });

          useEffect(() => {
            effectHook?.(counter);

            return () => {
              effectCleanupHook?.(counter);
            };
          }, [counter]);

          return {
            counter,
            increase,
            user,
            resetUser,
            restoreUser,
          };
        },
        {
          initialize,
          destroy,
        },
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
          <button
            typeof="button"
            data-testid="increase-button"
            onClick={increase}
          >
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

      const ResetUserButton = () => {
        const resetUser = useGStore(({ resetUser }) => resetUser);

        renderHook?.("reset-user-button");

        return (
          <button
            typeof="button"
            data-testid="reset-user-button"
            onClick={resetUser}
          >
            Reset user
          </button>
        );
      };

      const UserName = () => {
        const username = useGStore(({ user }) => user?.name);

        renderHook?.("username");

        return <div data-testid="username">{username}</div>;
      };

      const User = () => {
        renderHook?.("user");

        return (
          <div data-testid="user">
            <UserName />
            <ResetUserButton />
          </div>
        );
      };

      return {
        User,
        Counter,
        useGStore,
      };
    };

    describe("Initial rendering behavior", () => {
      test("should run effect once after component mount with default initialization", async () => {
        const effectHook = vi.fn();
        const effectCleanupHook = vi.fn();
        const { Counter, User } = createTestComponents({
          effectHook,
          effectCleanupHook,
        });

        expect(effectHook).not.toHaveBeenCalled();
        expect(effectCleanupHook).not.toHaveBeenCalled();

        render(
          <div>
            <Counter />
            <User />
          </div>,
        );

        expect(effectHook).not.toHaveBeenCalled();
        expect(effectCleanupHook).not.toHaveBeenCalled();

        await new Promise((resolve) => setTimeout(resolve));

        expect(effectHook).toHaveBeenCalledOnce();
        expect(effectHook).toHaveBeenCalledWith(0);
        expect(effectCleanupHook).not.toHaveBeenCalled();
      });

      test("should run effect once after component mount with eager initialization", async () => {
        const effectHook = vi.fn();
        const effectCleanupHook = vi.fn();
        const { Counter, User } = createTestComponents({
          effectHook,
          effectCleanupHook,
          initialize: "eager",
        });

        expect(effectHook).not.toHaveBeenCalled();
        expect(effectCleanupHook).not.toHaveBeenCalled();

        render(
          <div>
            <Counter />
            <User />
          </div>,
        );

        expect(effectHook).not.toHaveBeenCalled();
        expect(effectCleanupHook).not.toHaveBeenCalled();

        await new Promise((resolve) => setTimeout(resolve));

        expect(effectHook).toHaveBeenCalledOnce();
        expect(effectHook).toHaveBeenCalledWith(0);
        expect(effectCleanupHook).not.toHaveBeenCalled();
      });
    });

    describe("Component unmount behavior", () => {
      test("should not run effect cleanup when all components unmount with default destroy behavior", async () => {
        const effectHook = vi.fn();
        const effectCleanupHook = vi.fn();
        const { Counter, User } = createTestComponents({
          effectHook,
          effectCleanupHook,
        });

        expect(effectHook).not.toHaveBeenCalled();
        expect(effectCleanupHook).not.toHaveBeenCalled();

        const { unmount } = render(
          <div>
            <Counter />
            <User />
          </div>,
        );

        expect(effectHook).not.toHaveBeenCalled();
        expect(effectCleanupHook).not.toHaveBeenCalled();

        await new Promise((resolve) => setTimeout(resolve));

        unmount();

        await new Promise((resolve) => setTimeout(resolve));

        expect(effectHook).toHaveBeenCalledOnce();
        expect(effectHook).toHaveBeenCalledWith(0);
        expect(effectCleanupHook).not.toHaveBeenCalled();
      });

      test("should run effect cleanup when all components unmount with on-all-unsubscribed destroy behavior", async () => {
        const effectHook = vi.fn();
        const effectCleanupHook = vi.fn();
        const { Counter, User } = createTestComponents({
          effectHook,
          effectCleanupHook,
          destroy: "on-all-unsubscribed",
        });

        expect(effectHook).not.toHaveBeenCalled();
        expect(effectCleanupHook).not.toHaveBeenCalled();

        const { unmount } = render(
          <div>
            <Counter />
            <User />
          </div>,
        );

        expect(effectHook).not.toHaveBeenCalled();
        expect(effectCleanupHook).not.toHaveBeenCalled();

        await new Promise((resolve) => setTimeout(resolve));

        unmount();

        await new Promise((resolve) => setTimeout(resolve));

        expect(effectHook).toHaveBeenCalledOnce();
        expect(effectHook).toHaveBeenCalledWith(0);
        expect(effectCleanupHook).toHaveBeenCalledOnce();
        expect(effectCleanupHook).toHaveBeenCalledWith(0);
      });
    });

    describe("State update behavior", () => {
      test("should run effect and cleanup when dependencies change via component interaction", async () => {
        const effectHook = vi.fn();
        const effectCleanupHook = vi.fn();
        const { Counter, User } = createTestComponents({
          effectHook,
          effectCleanupHook,
        });

        expect(effectHook).not.toHaveBeenCalled();
        expect(effectCleanupHook).not.toHaveBeenCalled();

        render(
          <div>
            <Counter />
            <User />
          </div>,
        );

        const increaseCounterButton = screen.getByTestId("increase-button");

        expect(effectHook).not.toHaveBeenCalled();
        expect(effectCleanupHook).not.toHaveBeenCalled();

        await new Promise((resolve) => setTimeout(resolve));

        expect(effectHook).toHaveBeenCalledTimes(1);
        expect(effectHook).toHaveBeenLastCalledWith(0);
        expect(effectCleanupHook).not.toHaveBeenCalled();

        await userEvent.click(increaseCounterButton);

        await new Promise((resolve) => setTimeout(resolve));

        expect(effectCleanupHook).toHaveBeenCalledTimes(1);
        expect(effectCleanupHook).toHaveBeenLastCalledWith(0);

        expect(effectHook).toHaveBeenCalledTimes(2);
        expect(effectHook).toHaveBeenLastCalledWith(1);

        await new Promise((resolve) => setTimeout(resolve));

        await userEvent.click(increaseCounterButton);
        await userEvent.click(increaseCounterButton);

        await new Promise((resolve) => setTimeout(resolve));

        expect(effectCleanupHook).toHaveBeenCalledTimes(3);
        expect(effectCleanupHook).toHaveBeenLastCalledWith(2);

        expect(effectHook).toHaveBeenCalledTimes(4);
        expect(effectHook).toHaveBeenLastCalledWith(3);
      });

      test("should run effect and cleanup when dependencies change via direct state update", async () => {
        const effectHook = vi.fn();
        const effectCleanupHook = vi.fn();
        const { Counter, User, useGStore } = createTestComponents({
          effectHook,
          effectCleanupHook,
        });

        expect(effectHook).not.toHaveBeenCalled();
        expect(effectCleanupHook).not.toHaveBeenCalled();

        render(
          <div>
            <Counter />
            <User />
          </div>,
        );

        expect(effectHook).not.toHaveBeenCalled();
        expect(effectCleanupHook).not.toHaveBeenCalled();

        await new Promise((resolve) => setTimeout(resolve));

        expect(effectHook).toHaveBeenCalledTimes(1);
        expect(effectHook).toHaveBeenLastCalledWith(0);
        expect(effectCleanupHook).not.toHaveBeenCalled();

        await new Promise((resolve) => setTimeout(resolve));

        await act(async () => useGStore.getState().increase());

        await new Promise((resolve) => setTimeout(resolve));

        expect(effectCleanupHook).toHaveBeenCalledTimes(1);
        expect(effectCleanupHook).toHaveBeenLastCalledWith(0);

        expect(effectHook).toHaveBeenCalledTimes(2);
        expect(effectHook).toHaveBeenLastCalledWith(1);

        await new Promise((resolve) => setTimeout(resolve));

        await act(async () => useGStore.getState().increase());
        await act(async () => useGStore.getState().increase());

        await new Promise((resolve) => setTimeout(resolve));

        expect(effectCleanupHook).toHaveBeenCalledTimes(3);
        expect(effectCleanupHook).toHaveBeenLastCalledWith(2);

        expect(effectHook).toHaveBeenCalledTimes(4);
        expect(effectHook).toHaveBeenLastCalledWith(3);
      });
    });

    describe("State update without dependency changes", () => {
      test("should not run effect or cleanup when state updates without dependency changes", async () => {
        const effectHook = vi.fn();
        const effectCleanupHook = vi.fn();
        const { Counter, User } = createTestComponents({
          effectHook,
          effectCleanupHook,
        });

        expect(effectHook).not.toHaveBeenCalled();
        expect(effectCleanupHook).not.toHaveBeenCalled();

        render(
          <div>
            <Counter />
            <User />
          </div>,
        );

        const resetUserButton = screen.getByTestId("reset-user-button");
        const userNameComponent = screen.getByTestId("username");

        expect(resetUserButton).toBeInTheDocument();
        expect(userNameComponent).toBeInTheDocument();
        expect(userNameComponent).toHaveTextContent("John");

        expect(effectHook).not.toHaveBeenCalled();
        expect(effectCleanupHook).not.toHaveBeenCalled();

        await new Promise((resolve) => setTimeout(resolve));

        expect(effectHook).toHaveBeenCalledTimes(1);
        expect(effectHook).toHaveBeenLastCalledWith(0);
        expect(effectCleanupHook).not.toHaveBeenCalled();

        await new Promise((resolve) => setTimeout(resolve));

        await userEvent.click(resetUserButton);

        await new Promise((resolve) => setTimeout(resolve));

        expect(userNameComponent).toHaveTextContent("");

        expect(effectHook).toHaveBeenCalledTimes(1);
        expect(effectHook).toHaveBeenLastCalledWith(0);
        expect(effectCleanupHook).not.toHaveBeenCalled();
      });
    });
  });

  describe("useEffect with empty dependencies array", () => {
    const createTestComponents = ({
      renderHook,
      effectHook,
      effectCleanupHook,
      initialize,
      destroy,
    }: {
      renderHook?: (name: string) => void;
      effectHook?: () => void;
      effectCleanupHook?: () => void;
      initialize?: "eager" | "lazy";
      destroy?: "on-all-unsubscribed";
    } = {}) => {
      const useGStore = createGStore(
        () => {
          const [counter, setCounter] = useState(0);

          const increase = () => setCounter((prevCounter) => prevCounter + 1);

          const [user, setUser] = useState<{ name: string } | null | undefined>(
            {
              name: "John",
            },
          );

          const resetUser = () => setUser({ name: "" });

          const restoreUser = () => setUser({ name: "John" });

          useEffect(() => {
            effectHook?.();

            return () => {
              effectCleanupHook?.();
            };
          }, []);

          return {
            counter,
            increase,
            user,
            resetUser,
            restoreUser,
          };
        },
        {
          initialize,
          destroy,
        },
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
          <button
            typeof="button"
            data-testid="increase-button"
            onClick={increase}
          >
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

      const ResetUserButton = () => {
        const resetUser = useGStore(({ resetUser }) => resetUser);

        renderHook?.("reset-user-button");

        return (
          <button
            typeof="button"
            data-testid="reset-user-button"
            onClick={resetUser}
          >
            Reset user
          </button>
        );
      };

      const UserName = () => {
        const username = useGStore(({ user }) => user?.name);

        renderHook?.("username");

        return <div data-testid="username">{username}</div>;
      };

      const User = () => {
        renderHook?.("user");

        return (
          <div data-testid="user">
            <UserName />
            <ResetUserButton />
          </div>
        );
      };

      return {
        User,
        Counter,
        useGStore,
      };
    };

    describe("Initial rendering behavior", () => {
      test("should run effect once after component mount with default initialization", async () => {
        const effectHook = vi.fn();
        const effectCleanupHook = vi.fn();
        const { Counter, User } = createTestComponents({
          effectHook,
          effectCleanupHook,
        });

        expect(effectHook).not.toHaveBeenCalled();
        expect(effectCleanupHook).not.toHaveBeenCalled();

        render(
          <div>
            <Counter />
            <User />
          </div>,
        );

        expect(effectHook).not.toHaveBeenCalled();
        expect(effectCleanupHook).not.toHaveBeenCalled();

        await new Promise((resolve) => setTimeout(resolve));

        expect(effectHook).toHaveBeenCalledOnce();
        expect(effectCleanupHook).not.toHaveBeenCalled();
      });

      test("should run effect once after component mount with eager initialization", async () => {
        const effectHook = vi.fn();
        const effectCleanupHook = vi.fn();
        const { Counter, User } = createTestComponents({
          effectHook,
          effectCleanupHook,
          initialize: "eager",
        });

        expect(effectHook).not.toHaveBeenCalled();
        expect(effectCleanupHook).not.toHaveBeenCalled();

        render(
          <div>
            <Counter />
            <User />
          </div>,
        );

        expect(effectHook).not.toHaveBeenCalled();
        expect(effectCleanupHook).not.toHaveBeenCalled();

        await new Promise((resolve) => setTimeout(resolve));

        expect(effectHook).toHaveBeenCalledOnce();
        expect(effectCleanupHook).not.toHaveBeenCalled();
      });
    });

    describe("Component unmount behavior", () => {
      test("should not run effect cleanup when all components unmount with default destroy behavior", async () => {
        const effectHook = vi.fn();
        const effectCleanupHook = vi.fn();
        const { Counter, User } = createTestComponents({
          effectHook,
          effectCleanupHook,
        });

        expect(effectHook).not.toHaveBeenCalled();
        expect(effectCleanupHook).not.toHaveBeenCalled();

        const { unmount } = render(
          <div>
            <Counter />
            <User />
          </div>,
        );

        expect(effectHook).not.toHaveBeenCalled();
        expect(effectCleanupHook).not.toHaveBeenCalled();

        await new Promise((resolve) => setTimeout(resolve));

        unmount();

        await new Promise((resolve) => setTimeout(resolve));

        expect(effectHook).toHaveBeenCalledOnce();
        expect(effectCleanupHook).not.toHaveBeenCalled();
      });

      test("should run effect cleanup when all components unmount with on-all-unsubscribed destroy behavior", async () => {
        const effectHook = vi.fn();
        const effectCleanupHook = vi.fn();
        const { Counter, User } = createTestComponents({
          effectHook,
          effectCleanupHook,
          destroy: "on-all-unsubscribed",
        });

        expect(effectHook).not.toHaveBeenCalled();
        expect(effectCleanupHook).not.toHaveBeenCalled();

        const { unmount } = render(
          <div>
            <Counter />
            <User />
          </div>,
        );

        expect(effectHook).not.toHaveBeenCalled();
        expect(effectCleanupHook).not.toHaveBeenCalled();

        await new Promise((resolve) => setTimeout(resolve));

        unmount();

        await new Promise((resolve) => setTimeout(resolve));

        expect(effectHook).toHaveBeenCalledOnce();
        expect(effectCleanupHook).toHaveBeenCalledOnce();
      });
    });
  });

  describe("useEffect without dependencies array", () => {
    const createTestComponents = ({
      renderHook,
      effectHook,
      effectCleanupHook,
      initialize,
      destroy,
    }: {
      renderHook?: (name: string) => void;
      effectHook?: () => void;
      effectCleanupHook?: () => void;
      initialize?: "eager" | "lazy";
      destroy?: "on-all-unsubscribed";
    } = {}) => {
      const useGStore = createGStore(
        () => {
          const [counter, setCounter] = useState(0);

          const increase = () => setCounter((prevCounter) => prevCounter + 1);

          const [user, setUser] = useState<{ name: string } | null | undefined>(
            {
              name: "John",
            },
          );

          const resetUser = () => setUser({ name: "" });

          const restoreUser = () => setUser({ name: "John" });

          useEffect(() => {
            effectHook?.();

            return () => {
              effectCleanupHook?.();
            };
          });

          return {
            counter,
            increase,
            user,
            resetUser,
            restoreUser,
          };
        },
        {
          initialize,
          destroy,
        },
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
          <button
            typeof="button"
            data-testid="increase-button"
            onClick={increase}
          >
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

      const ResetUserButton = () => {
        const resetUser = useGStore(({ resetUser }) => resetUser);

        renderHook?.("reset-user-button");

        return (
          <button
            typeof="button"
            data-testid="reset-user-button"
            onClick={resetUser}
          >
            Reset user
          </button>
        );
      };

      const UserName = () => {
        const username = useGStore(({ user }) => user?.name);

        renderHook?.("username");

        return <div data-testid="username">{username}</div>;
      };

      const User = () => {
        renderHook?.("user");

        return (
          <div data-testid="user">
            <UserName />
            <ResetUserButton />
          </div>
        );
      };

      return {
        User,
        Counter,
        useGStore,
      };
    };

    describe("Initial rendering behavior", () => {
      test("should run effect once after component mount with default initialization", async () => {
        const effectHook = vi.fn();
        const effectCleanupHook = vi.fn();
        const { Counter, User } = createTestComponents({
          effectHook,
          effectCleanupHook,
        });

        expect(effectHook).not.toHaveBeenCalled();
        expect(effectCleanupHook).not.toHaveBeenCalled();

        render(
          <div>
            <Counter />
            <User />
          </div>,
        );

        expect(effectHook).not.toHaveBeenCalled();
        expect(effectCleanupHook).not.toHaveBeenCalled();

        await new Promise((resolve) => setTimeout(resolve));

        expect(effectHook).toHaveBeenCalledOnce();
        expect(effectCleanupHook).not.toHaveBeenCalled();
      });

      test("should run effect once after component mount with eager initialization", async () => {
        const effectHook = vi.fn();
        const effectCleanupHook = vi.fn();
        const { Counter, User } = createTestComponents({
          effectHook,
          effectCleanupHook,
          initialize: "eager",
        });

        expect(effectHook).not.toHaveBeenCalled();
        expect(effectCleanupHook).not.toHaveBeenCalled();

        render(
          <div>
            <Counter />
            <User />
          </div>,
        );

        expect(effectHook).not.toHaveBeenCalled();
        expect(effectCleanupHook).not.toHaveBeenCalled();

        await new Promise((resolve) => setTimeout(resolve));

        expect(effectHook).toHaveBeenCalledOnce();
        expect(effectCleanupHook).not.toHaveBeenCalled();
      });
    });

    describe("Component unmount behavior", () => {
      test("should not run effect cleanup when all components unmount with default destroy behavior", async () => {
        const effectHook = vi.fn();
        const effectCleanupHook = vi.fn();
        const { Counter, User } = createTestComponents({
          effectHook,
          effectCleanupHook,
        });

        expect(effectHook).not.toHaveBeenCalled();
        expect(effectCleanupHook).not.toHaveBeenCalled();

        const { unmount } = render(
          <div>
            <Counter />
            <User />
          </div>,
        );

        expect(effectHook).not.toHaveBeenCalled();
        expect(effectCleanupHook).not.toHaveBeenCalled();

        await new Promise((resolve) => setTimeout(resolve));

        unmount();

        await new Promise((resolve) => setTimeout(resolve));

        expect(effectHook).toHaveBeenCalledOnce();
        expect(effectCleanupHook).not.toHaveBeenCalled();
      });

      test("should run effect cleanup when all components unmount with on-all-unsubscribed destroy behavior", async () => {
        const effectHook = vi.fn();
        const effectCleanupHook = vi.fn();
        const { Counter, User } = createTestComponents({
          effectHook,
          effectCleanupHook,
          destroy: "on-all-unsubscribed",
        });

        expect(effectHook).not.toHaveBeenCalled();
        expect(effectCleanupHook).not.toHaveBeenCalled();

        const { unmount } = render(
          <div>
            <Counter />
            <User />
          </div>,
        );

        expect(effectHook).not.toHaveBeenCalled();
        expect(effectCleanupHook).not.toHaveBeenCalled();

        await new Promise((resolve) => setTimeout(resolve));

        unmount();

        await new Promise((resolve) => setTimeout(resolve));

        expect(effectHook).toHaveBeenCalledOnce();
        expect(effectCleanupHook).toHaveBeenCalledOnce();
      });
    });

    describe.skip("State update behavior", () => {
      test("should run effect and cleanup on every state update via component interaction", async () => {
        const effectHook = vi.fn();
        const effectCleanupHook = vi.fn();
        const { Counter, User } = createTestComponents({
          effectHook,
          effectCleanupHook,
        });

        expect(effectHook).not.toHaveBeenCalled();
        expect(effectCleanupHook).not.toHaveBeenCalled();

        render(
          <div>
            <Counter />
            <User />
          </div>,
        );

        const increaseCounterButton = screen.getByTestId("increase-button");

        expect(effectHook).not.toHaveBeenCalled();
        expect(effectCleanupHook).not.toHaveBeenCalled();

        await new Promise((resolve) => setTimeout(resolve));

        expect(effectHook).toHaveBeenCalledTimes(1);
        expect(effectCleanupHook).not.toHaveBeenCalled();

        await userEvent.click(increaseCounterButton);

        await new Promise((resolve) => setTimeout(resolve));

        expect(effectCleanupHook).toHaveBeenCalledTimes(1);

        expect(effectHook).toHaveBeenCalledTimes(2);

        await new Promise((resolve) => setTimeout(resolve));

        await userEvent.click(increaseCounterButton);
        await userEvent.click(increaseCounterButton);

        await new Promise((resolve) => setTimeout(resolve));

        expect(effectCleanupHook).toHaveBeenCalledTimes(3);

        expect(effectHook).toHaveBeenCalledTimes(4);
      });

      test("should run effect and cleanup on every state update via direct state update", async () => {
        const effectHook = vi.fn();
        const effectCleanupHook = vi.fn();
        const { Counter, User, useGStore } = createTestComponents({
          effectHook,
          effectCleanupHook,
        });

        expect(effectHook).not.toHaveBeenCalled();
        expect(effectCleanupHook).not.toHaveBeenCalled();

        render(
          <div>
            <Counter />
            <User />
          </div>,
        );

        expect(effectHook).not.toHaveBeenCalled();
        expect(effectCleanupHook).not.toHaveBeenCalled();

        await new Promise((resolve) => setTimeout(resolve));

        expect(effectHook).toHaveBeenCalledTimes(1);
        expect(effectCleanupHook).not.toHaveBeenCalled();

        await new Promise((resolve) => setTimeout(resolve));

        await act(async () => useGStore.getState().increase());

        await new Promise((resolve) => setTimeout(resolve));

        expect(effectCleanupHook).toHaveBeenCalledTimes(1);

        expect(effectHook).toHaveBeenCalledTimes(2);

        await new Promise((resolve) => setTimeout(resolve));

        await act(async () => useGStore.getState().increase());
        await act(async () => useGStore.getState().increase());

        await new Promise((resolve) => setTimeout(resolve));

        expect(effectCleanupHook).toHaveBeenCalledTimes(3);

        expect(effectHook).toHaveBeenCalledTimes(4);
      });
    });
  });
});
