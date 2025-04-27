import { CodeBlock } from "../../components/ui/code-block";
import { Subsection } from "../../components/ui/section";

export function MethodsSection() {
  return (
    <Subsection id="methods" title="Methods">
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

// Subscribe to state changes
const unsubscribe = useGlobalState.subscribe((newState, oldState) => {
  console.log('State changed:', newState, oldState);
});

// update state
currentState.createUser("Jane", 28);

// Cleanup when no longer needed
useGlobalState.destroy();`}
      />
    </Subsection>
  );
}
