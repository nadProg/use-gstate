import { CodeBlock } from "../components/code-block";

export function Introduction() {
  return (
    <div id="introduction">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">
        Why use-gstate?
      </h2>
      <p className="mb-6 text-lg text-gray-600">
        use-gstate is different from other state management solutions because it 
        lets you take any custom React hook and turn it into a global state. 
        This means you can easily share state and logic across components without 
        prop drilling or complex context setup.
      </p>

      <h3 className="text-2xl font-bold text-gray-900 my-4">Features</h3>
      <ul className="space-y-2 mb-6 list-disc pl-6 text-gray-600">
        <li>Share any React hook's state and logic globally</li>
        <li>Optimized re-renders using selectors</li>
        <li>
          Compatible with all React hooks - useState, useReducer,
          useContext, etc.
        </li>
        <li>TypeScript support</li>
        <li>Tiny bundle size</li>
        <li>No dependencies</li>
      </ul>

      <h3 className="text-2xl font-bold text-gray-900 my-4" id="installation">
        Installation
      </h3>
      <CodeBlock 
        language="bash" 
        code="npm install use-gstate" 
        showLineNumbers={false}
      />

      <h3 className="text-2xl font-bold text-gray-900 my-4" id="quick-start">
        Quick Start
      </h3>
      <p className="mb-2 text-gray-600">1. Create a global state from a hook:</p>
      <CodeBlock
        language="jsx"
        code={`import { createGState } from 'use-gstate';
import { useState } from 'react';

// Define a global state from a hook
const useGlobalCounter = createGState(() => {
  const [count, setCount] = useState(0);
  
  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);
  
  return { count, increment, decrement };
});`}
      />

      <p className="mb-2 text-gray-600">2. Use it in any component:</p>
      <CodeBlock
        language="jsx"
        code={`function CounterButton() {
  const { count, increment } = useGlobalCounter();
  return <button onClick={increment}>Count: {count}</button>;
}

function CounterDisplay() {
  const { count } = useGlobalCounter();
  return <div>Current count: {count}</div>;
}`}
      />
    </div>
  );
}
