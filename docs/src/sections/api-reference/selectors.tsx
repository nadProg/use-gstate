import { CodeBlock } from "../../components/ui/code-block";
import { Subsection } from "../../components/ui/section";

export function SelectorsSection() {
  return (
    <Subsection id="selectors" title="Selectors">
      <p className="mb-6 text-gray-600">
        Optimize renders by selecting only the state you need.
      </p>

      <h4 className="text-xl font-bold text-gray-800 mb-2">Usage</h4>
      <p className="mb-6 text-gray-600 pl-4">
        Selectors help prevent unnecessary re-renders by subscribing only to
        specific parts of the state.
      </p>

      <h4 className="text-xl font-bold text-gray-800 mb-2">Selector Modes</h4>
      <div className="mb-6">
        <p className="mb-4 text-gray-600">
          create-gstore supports two comparison modes for selectors that
          determine how state changes are detected and when components
          re-render:
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
                  "strict" (default)
                </td>
                <td className="py-3 px-3 text-sm text-gray-500">
                  Uses direct reference comparison (===) between new and
                  previous selected state value
                </td>
                <td className="py-3 px-3 text-sm text-gray-500">
                  Best for primitive values (strings, numbers, booleans) or
                  when you're already returning a new reference when data
                  changes
                </td>
              </tr>
              <tr>
                <td className="py-3 pl-4 pr-3 text-sm font-medium text-gray-900">
                  "shallow"
                </td>
                <td className="py-3 px-3 text-sm text-gray-500">
                  Performs shallow equality check on objects, comparing each
                  top-level property
                </td>
                <td className="py-3 px-3 text-sm text-gray-500">
                  Best for objects or arrays when you want to detect changes
                  to nested properties without creating new object references
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
          <p className="text-blue-700">
            <span className="font-bold">Tip:</span> The "shallow" comparison
            mode can be particularly useful when:
          </p>
          <ul className="list-disc pl-5 mt-2 text-blue-700">
            <li>Your selectors return objects or arrays</li>
            <li>
              You want to prevent unnecessary re-renders when unrelated parts
              of the object change
            </li>
            <li>You're working with deeply nested state structures</li>
          </ul>
        </div>

        <h5 className="text-lg font-semibold text-gray-800 mb-2">
          How to specify a selector mode:
        </h5>
        <CodeBlock
          language="tsx"
          code={`// Using the default "strict" mode (works with primitive values)
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
    </Subsection>
  );
}
