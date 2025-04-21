import { CodeBlock } from "../components/code-block";

export function ApiReference() {
  return (
    <div id="api-reference">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">API Reference</h2>
      
      <section id="creategstate" className="mb-12">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          createGState
        </h3>
        <p className="mb-6 text-gray-600">
          Creates a global state from a hook function.
        </p>
        
        <h4 className="text-xl font-bold text-gray-800 mb-2">Parameters</h4>
        <div className="mb-6 pl-4">
          <ul className="list-disc space-y-2 text-gray-600">
            <li>
              <code className="bg-gray-100 text-indigo-700 px-1 rounded">hookFactory</code>: 
              <span className="ml-2">A function that returns a hook with state and methods to expose globally.</span>
            </li>
            <li>
              <code className="bg-gray-100 text-indigo-700 px-1 rounded">options</code> (optional): 
              <span className="ml-2">Configuration options for the global state.</span>
            </li>
          </ul>
        </div>
        
        <h4 className="text-xl font-bold text-gray-800 mb-2">Returns</h4>
        <p className="mb-6 text-gray-600 pl-4">
          A hook function that can be used in React components to access the global state.
        </p>
        
        <h4 className="text-xl font-bold text-gray-800 mb-2">Example</h4>
        <CodeBlock
          language="tsx"
          code={`import { createGState } from 'use-gstate';
import { useState } from 'react';

const useGlobalState = createGState(() => {
  // Your hook logic here
  const [state, setState] = useState(initialState);
  
  // Functions to manipulate state
  const someAction = () => {
    setState(newState);
  };
  
  return { state, someAction };
});`}
        />
      </section>
      
      <section id="selectors" className="mb-12">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          Selectors
        </h3>
        <p className="mb-6 text-gray-600">
          Optimize renders by selecting only the state you need.
        </p>
        
        <h4 className="text-xl font-bold text-gray-800 mb-2">Usage</h4>
        <p className="mb-6 text-gray-600 pl-4">
          Selectors help prevent unnecessary re-renders by subscribing only to specific parts of the state.
        </p>
        
        <h4 className="text-xl font-bold text-gray-800 mb-2">Selector Modes</h4>
        <div className="mb-6">
          <p className="mb-4 text-gray-600">
            use-gstate supports two comparison modes for selectors that determine how state changes are detected and when components re-render:
          </p>
          
          <div className="overflow-x-auto mb-6">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th className="py-3 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">
                    Mode
                  </th>
                  <th className="py-3 px-3 text-left text-sm font-semibold text-gray-900">
                    Description
                  </th>
                  <th className="py-3 px-3 text-left text-sm font-semibold text-gray-900">
                    When to Use
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="py-3 pl-4 pr-3 text-sm font-medium text-gray-900">
                    "simple" (default)
                  </td>
                  <td className="py-3 px-3 text-sm text-gray-500">
                    Uses direct reference comparison (===) between new and previous selected state value
                  </td>
                  <td className="py-3 px-3 text-sm text-gray-500">
                    Best for primitive values (strings, numbers, booleans) or when you're already returning a new reference when data changes
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pl-4 pr-3 text-sm font-medium text-gray-900">
                    "shallow"
                  </td>
                  <td className="py-3 px-3 text-sm text-gray-500">
                    Performs shallow equality check on objects, comparing each top-level property
                  </td>
                  <td className="py-3 px-3 text-sm text-gray-500">
                    Best for objects or arrays when you want to detect changes to nested properties without creating new object references
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
            <p className="text-blue-700">
              <span className="font-bold">Tip:</span> The "shallow" comparison mode can be particularly useful when:
            </p>
            <ul className="list-disc pl-5 mt-2 text-blue-700">
              <li>Your selectors return objects or arrays</li>
              <li>You want to prevent unnecessary re-renders when unrelated parts of the object change</li>
              <li>You're working with deeply nested state structures</li>
            </ul>
          </div>
          
          <h5 className="text-lg font-semibold text-gray-800 mb-2">How to specify a selector mode:</h5>
          <CodeBlock
            language="tsx"
            code={`// Using the default "simple" mode (works with primitive values)
const count = useGlobalState(state => state.count);

// Using "shallow" mode for object comparisons
const userInfo = useGlobalState(
  state => ({ name: state.user.name, age: state.user.age }),
  "shallow"
);`}
          />
        </div>

        <h4 className="text-xl font-bold text-gray-800 mb-2">Example</h4>
        <CodeBlock
          language="tsx"
          code={`// Without selector (gets full state)
const { user, settings, posts } = useGlobalState();

// With selector (only gets user.name)
const userName = useGlobalState(state => state.user.name);

// With selector (gets multiple properties)
const { name, email } = useGlobalState(state => ({
  name: state.user.name,
  email: state.user.email
}), "shallow");

// Component only re-renders when selected state changes
function UserProfile() {
  // Only re-renders when user.profile changes
  const profile = useGlobalState(state => state.user.profile);
  
  return <div>{profile.bio}</div>;
}`}
        />
      </section>
      
      <section id="methods" className="mb-12">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          Methods
        </h3>
        <p className="mb-6 text-gray-600">
          Additional methods available on the global state hook.
        </p>
        
        <div className="overflow-x-auto mb-6">
          <table className="min-w-full divide-y divide-gray-300">
            <thead>
              <tr>
                <th className="py-3 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">
                  Method
                </th>
                <th className="py-3 px-3 text-left text-sm font-semibold text-gray-900">
                  Description
                </th>
                <th className="py-3 px-3 text-left text-sm font-semibold text-gray-900">
                  Example
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="py-3 pl-4 pr-3 text-sm font-medium text-gray-900">
                  getState
                </td>
                <td className="py-3 px-3 text-sm text-gray-500">
                  Get current state value outside of React components
                </td>
                <td className="py-3 px-3 text-sm text-gray-500">
                  <code>useGlobalState.getState()</code>
                </td>
              </tr>
              <tr>
                <td className="py-3 pl-4 pr-3 text-sm font-medium text-gray-900">
                  setState
                </td>
                <td className="py-3 px-3 text-sm text-gray-500">
                  Set state directly from outside of React components
                </td>
                <td className="py-3 px-3 text-sm text-gray-500">
                  <code>useGlobalState.setState(newState)</code>
                </td>
              </tr>
              <tr>
                <td className="py-3 pl-4 pr-3 text-sm font-medium text-gray-900">
                  subscribe
                </td>
                <td className="py-3 px-3 text-sm text-gray-500">
                  Subscribe to state changes
                </td>
                <td className="py-3 px-3 text-sm text-gray-500">
                  <code>useGlobalState.subscribe(callback)</code>
                </td>
              </tr>
              <tr>
                <td className="py-3 pl-4 pr-3 text-sm font-medium text-gray-900">
                  destroy
                </td>
                <td className="py-3 px-3 text-sm text-gray-500">
                  Clean up state
                </td>
                <td className="py-3 px-3 text-sm text-gray-500">
                  <code>useGlobalState.destroy()</code>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <h4 className="text-xl font-bold text-gray-800 mb-2">Example</h4>
        <CodeBlock
          language="tsx"
          code={`// Access state outside of React components
const currentState = useGlobalState.getState();
console.log('Current user:', currentState.user);

// Set state from outside of React components
useGlobalState.setState({
  ...useGlobalState.getState(),
  settings: { darkMode: true }
});

// Subscribe to state changes
const unsubscribe = useGlobalState.subscribe((newState, oldState) => {
  console.log('State changed:', newState, oldState);
});

// Cleanup when no longer needed
useGlobalState.destroy();`}
        />
      </section>
      
      <section id="supported-hooks" className="mb-12">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          Supported Hooks
        </h3>
        <p className="mb-6 text-gray-600">
          use-gstate supports most React hooks, but some have limitations or special considerations.
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
              <tr>
                <td className="py-3 pl-4 pr-3 text-sm font-medium text-gray-900">
                  useState
                </td>
                <td className="py-3 px-3 text-sm text-green-600 font-medium">
                  Full Support
                </td>
                <td className="py-3 px-3 text-sm text-gray-500">
                  Core functionality, fully supported
                </td>
              </tr>
              <tr>
                <td className="py-3 pl-4 pr-3 text-sm font-medium text-gray-900">
                  useRef
                </td>
                <td className="py-3 px-3 text-sm text-green-600 font-medium">
                  Full Support
                </td>
                <td className="py-3 px-3 text-sm text-gray-500">
                  Fully supported for mutable references
                </td>
              </tr>
              <tr>
                <td className="py-3 pl-4 pr-3 text-sm font-medium text-gray-900">
                  useMemo
                </td>
                <td className="py-3 px-3 text-sm text-green-600 font-medium">
                  Full Support
                </td>
                <td className="py-3 px-3 text-sm text-gray-500">
                  Memoization works as expected
                </td>
              </tr>
              <tr>
                <td className="py-3 pl-4 pr-3 text-sm font-medium text-gray-900">
                  useCallback
                </td>
                <td className="py-3 px-3 text-sm text-green-600 font-medium">
                  Full Support
                </td>
                <td className="py-3 px-3 text-sm text-gray-500">
                  Function memoization works as expected
                </td>
              </tr>
              <tr>
                <td className="py-3 pl-4 pr-3 text-sm font-medium text-gray-900">
                  useEffect
                </td>
                <td className="py-3 px-3 text-sm text-green-600 font-medium">
                  Full Support
                </td>
                <td className="py-3 px-3 text-sm text-gray-500">
                  Side effects work as expected
                </td>
              </tr>
              <tr>
                <td className="py-3 pl-4 pr-3 text-sm font-medium text-gray-900">
                  useLayoutEffect
                </td>
                <td className="py-3 px-3 text-sm text-green-600 font-medium">
                  Full Support
                </td>
                <td className="py-3 px-3 text-sm text-gray-500">
                  Synchronous effects work as expected
                </td>
              </tr>
              <tr>
                <td className="py-3 pl-4 pr-3 text-sm font-medium text-gray-900">
                  useSyncExternalStore
                </td>
                <td className="py-3 px-3 text-sm text-green-600 font-medium">
                  Full Support
                </td>
                <td className="py-3 px-3 text-sm text-gray-500">
                  Used internally for state subscription
                </td>
              </tr>
              <tr>
                <td className="py-3 pl-4 pr-3 text-sm font-medium text-gray-900">
                  useContext
                </td>
                <td className="py-3 px-3 text-sm text-yellow-600 font-medium">
                  Limited Support
                </td>
                <td className="py-3 px-3 text-sm text-gray-500">
                  Only works if state is initialized in a React component tree
                </td>
              </tr>
              <tr>
                <td className="py-3 pl-4 pr-3 text-sm font-medium text-gray-900">
                  useReducer
                </td>
                <td className="py-3 px-3 text-sm text-yellow-600 font-medium">
                  Supported via useState
                </td>
                <td className="py-3 px-3 text-sm text-gray-500">
                  Can be implemented using useState + useCallback
                </td>
              </tr>
              <tr>
                <td className="py-3 pl-4 pr-3 text-sm font-medium text-gray-900">
                  useTransition
                </td>
                <td className="py-3 px-3 text-sm text-red-600 font-medium">
                  Not Supported
                </td>
                <td className="py-3 px-3 text-sm text-gray-500">
                  Not currently implemented
                </td>
              </tr>
              <tr>
                <td className="py-3 pl-4 pr-3 text-sm font-medium text-gray-900">
                  useDeferredValue
                </td>
                <td className="py-3 px-3 text-sm text-red-600 font-medium">
                  Not Supported
                </td>
                <td className="py-3 px-3 text-sm text-gray-500">
                  Not currently implemented
                </td>
              </tr>
              <tr>
                <td className="py-3 pl-4 pr-3 text-sm font-medium text-gray-900">
                  Third-party hooks
                </td>
                <td className="py-3 px-3 text-sm text-yellow-600 font-medium">
                  Generally Supported
                </td>
                <td className="py-3 px-3 text-sm text-gray-500">
                  Works if they use supported hooks internally
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <h4 className="text-xl font-bold text-gray-800 mb-2">useContext Limitations</h4>
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-6">
          <p className="text-amber-700">
            <span className="font-bold">Important:</span> The <code className="bg-amber-100 px-1 rounded">useContext</code> hook has limited support in use-gstate. It will only work correctly if:
          </p>
          <ul className="list-disc pl-5 mt-2 text-amber-700">
            <li>The global state is initialized <strong>within</strong> a React component tree</li>
            <li>The context being accessed is already provided higher in the component tree</li>
            <li>The context value is accessed during the component's render phase</li>
          </ul>
          <p className="mt-2 text-amber-700">
            For libraries that depend heavily on context (like React Query's QueryClientProvider), it's recommended to:
          </p>
          <ul className="list-disc pl-5 mt-2 text-amber-700">
            <li>Pass necessary context values directly to the hooks that need them</li>
            <li>Initialize your global state inside a component where the context is available</li>
            <li>Use the React Query client instance directly in your hooks (see React Query example)</li>
          </ul>
        </div>
        
        <h4 className="text-xl font-bold text-gray-800 mb-2">Example with React Query</h4>
        <CodeBlock
          language="tsx"
          code={`// Create and use a QueryClient instance directly
const queryClient = new QueryClient();

// Pass the client directly to useQuery
const useGlobalData = createGState(() => {
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
      </section>
    </div>
  );
}
