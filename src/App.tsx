import "./App.css";

import { createGState } from "../lib";
import { Suspense, use, useTransition, useState } from "react";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const useGAsyncCounter = createGState((def: number) => {
  const [counter, setCounter] = useState(sleep(3000).then(() => def));

  const increment = () => {
    setCounter((last) =>
      last.then(async (r) => {
        await sleep(1000);
        return r + 1;
      })
    );
  };

  const dicrement = () => {
    setCounter((last) => last.then((r) => r - 1));
  };

  return {
    counter,
    increment,
    dicrement,
  };
});

function useCounter() {
  const [counter, setCounter] = useState(0);

  const increment = () => {
    setCounter((last) => last + 1);
  };

  const dicrement = () => {
    setCounter((last) => last - 1);
  };

  return {
    counter,
    increment,
    dicrement,
  };
}

const useGSyncCounter = createGState(() => useCounter());

function Counter() {
  const { counter, increment, dicrement } = useGSyncCounter({});

  return (
    <>
      <button onClick={() => increment()}>increment {counter}</button>
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
  const increment = useGSyncCounter({
    select: (s) => s.increment,
  });

  return <button onClick={() => increment()}>increment</button>;
}

export default App;
