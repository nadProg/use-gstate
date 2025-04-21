import { SelectorExample } from "../../../../src/examples/selector";
import selectorExampleCode from "../../../../src/examples/selector?raw";
import { CodeBlock } from "../../components/ui/code-block";
import { Subsection } from "../../components/ui/section";

export function SelectorPatternExample() {
  return (
    <Subsection id="selector-example" title="Selector Pattern Example">
      <p className="mb-6 text-gray-600">
        Using selectors to optimize renders by selecting only what you need
        from state.
      </p>

      <div className="mb-6">
        <h4 className="text-xl font-bold text-gray-800 mb-2">Live Demo</h4>
        <SelectorExample />
      </div>

      <h4 className="text-xl font-bold text-gray-800 mb-2">Code</h4>
      <CodeBlock
        language="tsx"
        code={selectorExampleCode}
        filename="selector.tsx"
      />
    </Subsection>
  );
}
