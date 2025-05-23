import { describe, expect } from "vitest";
import {
  createGStore,
  useCallback,
  useState,
  useEffect,
  useOnSubscribed,
} from "../index";
import { nextTask } from "./lib.ts";

afterEach(() => {
  vi.clearAllMocks();
});

const createTestGStore = ({ onSubscribed }: { onSubscribed?: () => void }) =>
  createGStore(() => {
    const [counter, setCounter] = useState(0);

    const increase = useCallback(
      () => setCounter((prevCounter) => prevCounter + 1),
      [],
    );

    useEffect(() => {
      /* */
    }, [counter]);

    useOnSubscribed(onSubscribed);

    return {
      counter,
      increase,
    };
  });

describe("Subscription hooks", () => {
  test("Should call useOnSubscribed", async () => {
    const onSubscribed = vi.fn();
    const useGStore = createTestGStore({ onSubscribed });

    expect(onSubscribed).not.toHaveBeenCalled();

    useGStore.getState();
    await nextTask();
    expect(onSubscribed).not.toHaveBeenCalled();

    const unsubscribe1 = useGStore.subscribe(() => null);
    await nextTask();
    expect(onSubscribed).toHaveBeenCalledTimes(1);

    const unsubscribe2 = useGStore.subscribe(() => null);
    const unsubscribe3 = useGStore.subscribe(() => null);

    await nextTask();
    expect(onSubscribed).toHaveBeenCalledTimes(3);

    unsubscribe1();
    unsubscribe2();
    unsubscribe3();

    expect(onSubscribed).toHaveBeenCalledTimes(3);
  });
});
