import "./App.css";

import { createGState } from "../lib";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { FormErrors, GlobalForm } from "./Form";
import { GlobalTodoList } from "./TodoList";

function useCounter() {
  const rerenderRef = useRef(0);

  rerenderRef.current++;

  const [counter, setCounter] = useState(0);
  const [counter2, setCounter2] = useState(0);

  const increment = useCallback(() => {
    setCounter((last) => last + 1);
    setCounter2((last) => last + 1);
  }, []);

  const dicrement = useCallback(() => {
    setCounter2((last) => last - 1);
  }, []);

  const memoCounter = useMemo(() => ({ counter }), [counter]);

  useEffect(() => {
    console.log("effect2", memoCounter.counter);

    return () => {
      console.log("unmount2", memoCounter.counter);
    };
  }, [memoCounter]);

  useLayoutEffect(() => {
    console.log("effect");

    increment();

    return () => {
      console.log("unmount");
    };
  }, [increment]);

  return {
    counter: memoCounter.counter + counter2,
    increment,
    dicrement,
    rerenderCounter: rerenderRef.current,
  };
}

const useGSyncCounter = createGState(() => useCounter());

function Counter() {
  const { counter, increment, dicrement, rerenderCounter } = useGSyncCounter();

  return (
    <>
      <button onClick={() => increment()}>
        increment {counter} rerender {rerenderCounter}
      </button>
      <button onClick={() => dicrement()}>dicrement {counter}</button>
    </>
  );
}

function App() {
  return (
    <>
      <div></div>
      <h1>Vite + React</h1>
      <div className="card">
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>

      <hr />
      <FormErrors />
      <hr />
      <GlobalForm />

      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <hr />
      <GlobalTodoList />
      <GlobalTodoList />
    </>
  );
}

export default App;
