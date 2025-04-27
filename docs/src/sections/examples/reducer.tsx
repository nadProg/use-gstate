import { ReducerExample } from "../../../../src/examples/reducer";
import reducerExampleCode from "../../../../src/examples/reducer?raw";
import { CodeBlock } from "../../components/ui/code-block";
import { Subsection } from "../../components/ui/section";

export function ReducerPatternExample() {
  return (
    <Subsection id="reducer-example" title="Reducer Pattern Example">
      <p className="mb-6 text-gray-600">
        Using useReducer with create-gstore for complex state management.
      </p>

      <div className="mb-6">
        <h4 className="text-xl font-bold text-gray-800 mb-2">Live Demo</h4>
        <ReducerExample />
      </div>

      <h4 className="text-xl font-bold text-gray-800 mb-2">Code</h4>
      <CodeBlock
        language="tsx"
        code={reducerExampleCode}
        filename="reducer.tsx"
      />
    </Subsection>
  );
}
