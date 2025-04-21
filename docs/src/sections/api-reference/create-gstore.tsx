import { CodeBlock } from "../../components/ui/code-block";
import { Subsection } from "../../components/ui/section";

export function CreateGStoreSection() {
  return (
    <Subsection id="createGStore" title="createGStore">
      <p className="mb-6 text-gray-600">
        Creates a global state from a hook function.
      </p>

      <h4 className="text-xl font-bold text-gray-800 mb-2">Parameters</h4>
      <div className="mb-6 pl-4">
        <ul className="list-disc space-y-2 text-gray-600">
          <li>
            <code className="bg-gray-100 text-indigo-700 px-1 rounded">
              hookFactory
            </code>
            :
            <span className="ml-2">
              A function that returns a hook with state and methods to expose
              globally.
            </span>
          </li>
          <li>
            <code className="bg-gray-100 text-indigo-700 px-1 rounded">
              options
            </code>{" "}
            (optional):
            <span className="ml-2">
              Configuration options for the global state.
            </span>
          </li>
        </ul>
      </div>

      <h4 className="text-xl font-bold text-gray-800 mb-2">Returns</h4>
      <p className="mb-6 text-gray-600 pl-4">
        A hook function that can be used in React components to access the
        global state.
      </p>

      <h4 className="text-xl font-bold text-gray-800 mb-2">Example</h4>
      <CodeBlock
        language="tsx"
        code={`import { createGStore } from 'create-gstore';
import { useState } from 'react';

const useGlobalState = createGStore(() => {
  const [state, setState] = useState({ count: 0, user: null });
  
  const increment = () => setState({
    ...state,
    count: state.count + 1
  });
  
  return { state, setState, increment };
});`}
      />
    </Subsection>
  );
}
