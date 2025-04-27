import {
  GlobalCounter,
  CounterDisplay,
} from "../../../../src/examples/counter";
import counterExampleCode from "../../../../src/examples/counter?raw";
import { CodeBlock } from "../../components/ui/code-block";
import { Subsection } from "../../components/ui/section";

export function CounterExample() {
  return (
    <Subsection id="counter-example" title="Counter Example">
      <p className="mb-6 text-gray-600">
        A simple counter example showing how to share state between components.
      </p>

      <div className="mb-6">
        <h4 className="text-xl font-bold text-gray-800 mb-2">Live Demo</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <GlobalCounter />
          <CounterDisplay />
        </div>
      </div>

      <h4 className="text-xl font-bold text-gray-800 mb-2">Code</h4>
      <CodeBlock
        language="tsx"
        code={counterExampleCode}
        filename="counter.tsx"
      />
    </Subsection>
  );
}
