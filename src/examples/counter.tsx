import { createGStore } from '../../lib';
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import './examples.css';

const useGSyncCounter = createGStore(() => {
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
    console.log('effect2', memoCounter.counter);

    return () => {
      console.log('unmount2', memoCounter.counter);
    };
  }, [memoCounter]);

  useLayoutEffect(() => {
    console.log('effect');

    increment();

    return () => {
      console.log('unmount');
    };
  }, [increment]);

  return {
    counter: memoCounter.counter + counter2,
    increment,
    dicrement,
    rerenderCounter: rerenderRef.current,
  };
});

export function GlobalCounter() {
  const { counter, increment, dicrement, rerenderCounter } = useGSyncCounter();

  return (
    <div className="counter-container">
      <h2>Counter Example</h2>
      <div>
        <div className="counter-value">{counter}</div>
        <div className="render-count">Renders: {rerenderCounter}</div>
        <div className="button-group">
          <button onClick={() => increment()}>Increment</button>
          <button onClick={() => dicrement()}>Decrement</button>
        </div>
      </div>
    </div>
  );
}

export function CounterDisplay() {
  const { counter } = useGSyncCounter();

  return (
    <div className="counter-display">
      <h3>Counter Display</h3>
      <p>
        Current count: <span>{counter}</span>
      </p>
      <p className="note">This component reads from the same global state</p>
    </div>
  );
}
