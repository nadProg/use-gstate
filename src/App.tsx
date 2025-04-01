import "./App.css";

import { createGState } from "../lib";
import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const useTodoList = createGState(() => {
  const [todos, setTodos] = useState<{ id: number; title: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    fetch("http://jsonplaceholder.typicode.com/todos")
      .then((res) => res.json())
      .then((data) => setTodos(data))
      .finally(() => setIsLoading(false));
  }, []);

  return {
    todos,
    isLoading,
  };
});

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

  console.log("render", counter);

  useEffect(() => {
    console.log("effect");

    increment();
    return () => {
      console.log("unmount");
    };
  }, [increment]);

  useEffect(() => {
    console.log("effect2", memoCounter.counter);

    return () => {
      console.log("unmount2", memoCounter.counter);
    };
  }, [memoCounter]);

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

function TodoList({ index }: { index: number }) {
  const { todos, isLoading } = useTodoList();

  console.log(todos);
  return (
    <div>
      {isLoading ? (
        <div>loading</div>
      ) : (
        [todos[index] ?? []].map((todo) => (
          <div key={todo.id}>{todo.title}</div>
        ))
      )}
    </div>
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
      <TodoList index={0} />
      <TodoList index={1} />

      <Suspense fallback={<div>loading</div>}>
        <Counter />
        <Counter />
        <Counter />
      </Suspense>
      <Increment />

      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

function Increment() {
  const increment = useGSyncCounter((s) => s.increment);

  return <button onClick={() => increment()}>increment</button>;
}

export default App;
