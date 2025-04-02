import { useCallback, useEffect, useState } from "react";
import { createGState } from "use-gstate";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const useCounter2 = createGState(() => {
  const [counter, setCounter] = useState(0);
  const increment = useCallback(() => {
    setCounter((last) => last + 1);
  }, []);
  return { counter, increment };
});

const useTodoList = createGState(() => {
  const [todos, setTodos] = useState<{ id: number; title: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const counter2 = useCounter2();

  useEffect(() => {
    setIsLoading(true);
    const abortController = new AbortController();
    fetch("http://jsonplaceholder.typicode.com/todos", {
      signal: abortController.signal,
    })
      .then((res) => res.json())
      .then(async (data) => {
        await sleep(1000);
        setTodos(data.slice(0, counter2.counter));
      })
      .finally(() => {
        setIsLoading(false);
      });

    return () => {
      abortController.abort();
    };
  }, [counter2.counter]);

  return {
    todos,
    isLoading,
    increment: counter2.increment,
  };
});

export function GlobalTodoList() {
  const { todos, isLoading, increment } = useTodoList();

  return (
    <div>
      {isLoading && todos.length === 0 ? (
        <div>loading</div>
      ) : (
        todos.map((todo) => <div key={todo.id}>{todo.title}</div>)
      )}
      <button onClick={() => increment()}>
        {isLoading ? "loading" : "add"}
      </button>
    </div>
  );
}
