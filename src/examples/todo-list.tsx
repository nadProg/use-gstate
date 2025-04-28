import { useCallback, useEffect, useState } from "react";
import { createGStore } from "../../lib";
import "./examples.css";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const useCounter2 = createGStore(() => {
  const [counter, setCounter] = useState(0);
  const increment = useCallback(() => {
    setCounter((last) => last + 1);
  }, []);
  return { counter, increment };
});

const useTodoList = createGStore(() => {
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
    <div className="todo-container">
      <h2 className="header">Todo List Example</h2>

      <div className="todo-content">
        {isLoading && todos.length === 0 ? (
          <div className="loading-indicator">
            <div className="loading-dot"></div>
            <div className="loading-dot"></div>
            <div className="loading-dot"></div>
            <span>Loading todos...</span>
          </div>
        ) : (
          <div className="todo-items">
            {todos.map((todo) => (
              <div key={todo.id} className="todo-item">
                <span>{todo.title}</span>
              </div>
            ))}
            {todos.length === 0 && !isLoading && (
              <div className="empty-state">
                Click "Load More" to fetch todos
              </div>
            )}
          </div>
        )}

        <button
          onClick={() => increment()}
          disabled={isLoading}
          className="load-button"
        >
          {isLoading
            ? "Loading..."
            : todos.length === 0
              ? "Load Todos"
              : "Load More"}
        </button>
      </div>
    </div>
  );
}
