import "./App.css";

import { useGState, createGState } from "../lib";
import { Suspense, use, useTransition } from "react";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const useGCounter = createGState((def: number) => {
  const [counter, setCounter] = useGState(sleep(3000).then(() => def));

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

  console.log("counter", counter);

  return {
    counter,
    increment,
    dicrement,
  };
});

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

function Counter() {
  const [isLoading, startTranstion] = useTransition();
  const { counter, increment, dicrement } = useGCounter({
    params: 10,
  });

  const v = use(counter);

  return (
    <>
      <button
        style={{ opacity: isLoading ? 0.5 : 1 }}
        onClick={() => startTranstion(() => increment())}
      >
        increment {v}
      </button>
      <button
        style={{ opacity: isLoading ? 0.5 : 1 }}
        onClick={() => startTranstion(() => dicrement())}
      >
        dicrement {v}
      </button>
    </>
  );
}

function Increment() {
  const increment = useGCounter({
    params: 10,
    select: (s) => s.increment,
  });

  return <button onClick={() => increment()}>increment</button>;
}

export default App;
