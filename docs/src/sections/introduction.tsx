import { CodeBlock } from "../components/ui/code-block";
import { Section, Subsection } from "../components/ui/section";

export function Introduction() {
  return (
    <Section id="introduction" title="Why create-gstore?">
      <p className="mb-6 text-lg text-gray-600">
        create-gstore is different from other state management solutions because
        it lets you take any custom React hook and turn it into a global state.
        This means you can easily share state and logic across components
        without prop drilling or complex context setup.
      </p>

      <Subsection id="features" title="Features">
        <ul className="space-y-2 mb-6 list-disc pl-6 text-gray-600">
          <li>Share any React hook's state and logic globally</li>
          <li>Optimized re-renders using selectors</li>
          <li>
            Compatible with all React hooks - useState, useReducer, useContext,
            etc.
          </li>
          <li>TypeScript support</li>
          <li>Tiny bundle size</li>
          <li>No dependencies</li>
        </ul>
      </Subsection>
      <section id="getting-started">
        <Subsection id="installation" title="Installation">
          <CodeBlock
            language="bash"
            code="npm install create-gstore"
            showLineNumbers={false}
          />
        </Subsection>

        <Subsection id="quick-start" title="Quick Start">
          <p className="mb-2 text-gray-600">
            1. Create a global state from a hook:
          </p>
          <CodeBlock
            language="jsx"
            code={`import { createGStore } from 'create-gstore';
import { useState } from 'react';

// Define a global state from a hook
const useGlobalCounter = createGStore(() => {
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
  const count = useGlobalCounter(s => s.count);
  return <div>Current count: {count}</div>;
}`}
          />
        </Subsection>

        <Subsection id="supported-hooks" title="Supported Hooks">
          <p className="mb-6 text-gray-600">
            create-gstore supports most React hooks, but some have limitations
            or special considerations.
          </p>

          <div className="overflow-x-auto mb-6">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th className="py-3 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">
                    Hook
                  </th>
                  <th className="py-3 px-3 text-left text-sm font-semibold text-gray-900">
                    Support Status
                  </th>
                  <th className="py-3 px-3 text-left text-sm font-semibold text-gray-900">
                    Notes
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {[
                  {
                    hook: "useState",
                    status: { text: "Full Support", color: "green" },
                    notes: "Core functionality, fully supported",
                  },
                  {
                    hook: "useRef",
                    status: { text: "Full Support", color: "green" },
                    notes: "Fully supported for mutable references",
                  },
                  {
                    hook: "useMemo",
                    status: { text: "Full Support", color: "green" },
                    notes: "Memoization works as expected",
                  },
                  {
                    hook: "useCallback",
                    status: { text: "Full Support", color: "green" },
                    notes: "Function memoization works as expected",
                  },
                  {
                    hook: "useEffect",
                    status: { text: "Full Support", color: "green" },
                    notes: "Side effects work as expected",
                  },

                  {
                    hook: "useLayoutEffect",
                    status: { text: "Full Support", color: "green" },
                    notes: "Synchronous effects work as expected",
                  },
                  {
                    hook: "useSyncExternalStore",
                    status: { text: "Full Support", color: "green" },
                    notes: "Used internally for state subscription",
                  },
                  {
                    hook: "useContext",
                    status: { text: "Limited Support", color: "yellow" },
                    notes:
                      "Only works if state is initialized in a React component tree",
                  },
                  {
                    hook: "useReducer",
                    status: { text: "Full Support", color: "green" },
                    notes: "Fully supported for state with actions",
                  },
                  {
                    hook: "useId",
                    status: { text: "Not Supported", color: "red" },
                    notes: "Not currently implemented",
                  },
                  {
                    hook: "useTransition",
                    status: { text: "Not Supported", color: "red" },
                    notes: "Not currently implemented",
                  },
                  {
                    hook: "useDeferredValue",
                    status: { text: "Not Supported", color: "red" },
                    notes: "Not currently implemented",
                  },
                  {
                    hook: "useFormStatus (React 19)",
                    status: { text: "Not Supported", color: "red" },
                    notes: "Not currently implemented",
                  },
                  {
                    hook: "useActionState (React 19)",
                    status: { text: "Not Supported", color: "red" },
                    notes: "Not currently implemented",
                  },
                  {
                    hook: "useOptimistic (React 19)",
                    status: { text: "Not Supported", color: "red" },
                    notes: "Not currently implemented",
                  },
                  {
                    hook: "use (React 19)",
                    status: { text: "Not Supported", color: "red" },
                    notes: "Not currently implemented",
                  },
                  {
                    hook: "Third-party hooks",
                    status: { text: "Generally Supported", color: "yellow" },
                    notes: "Works if they use supported hooks internally",
                  },
                ].map(({ hook, status, notes }) => (
                  <tr key={hook}>
                    <td className="py-3 pl-4 pr-3 text-sm font-medium text-gray-900">
                      {hook}
                    </td>
                    <td
                      className={`py-3 px-3 text-sm font-medium ${
                        status.color === "green"
                          ? "text-green-600"
                          : status.color === "yellow"
                            ? "text-yellow-600"
                            : "text-red-600"
                      }`}
                    >
                      {status.text}
                    </td>
                    <td className="py-3 px-3 text-sm text-gray-500">{notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h4 className="text-xl font-bold text-gray-800 mb-2">
            useContext Limitations
          </h4>
          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-6">
            <p className="text-amber-700">
              <span className="font-bold">Important:</span> The{" "}
              <code className="bg-amber-100 px-1 rounded">useContext</code> hook
              has limited support in create-gstore
            </p>
            <ul className="list-disc pl-5 mt-2 text-amber-700">
              <li>
                Context value used in initialization. Not updated after first
                call
              </li>
              <li>
                The global state should be initialized <strong>within</strong> a
                React component tree
              </li>
              <li>
                The context being accessed should be already provided higher in
                the component tree
              </li>
            </ul>
          </div>

          <h4 className="text-xl font-bold text-gray-800 mb-2">
            Example with React Query
          </h4>
          <CodeBlock
            language="tsx"
            code={`// Create and use a QueryClient instance directly
const queryClient = new QueryClient();

// Pass the client directly to useQuery
const useGlobalData = createGStore(() => {
  const query = useQuery(
    { queryKey: ['data'], queryFn: fetchData },
    // Pass the QueryClient instance directly
    queryClient
  );
  
  return { 
    data: query.data,
    isLoading: query.isLoading
  };
});`}
          />
        </Subsection>
      </section>
    </Section>
  );
}
