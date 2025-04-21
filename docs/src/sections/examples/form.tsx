import { GlobalForm } from "../../../../src/examples/form";
import formExampleCode from "../../../../src/examples/form?raw";
import { CodeBlock } from "../../components/ui/code-block";
import { Subsection } from "../../components/ui/section";

export function FormExample() {
  return (
    <Subsection id="form-example" title="Form Example">
      <p className="mb-6 text-gray-600">
        Form handling with global state for better component organization.
      </p>

      <div className="mb-6">
        <h4 className="text-xl font-bold text-gray-800 mb-2">Live Demo</h4>
        <GlobalForm />
      </div>

      <h4 className="text-xl font-bold text-gray-800 mb-2">Code</h4>
      <CodeBlock
        language="tsx"
        code={formExampleCode}
        filename="form.tsx"
      />
    </Subsection>
  );
}
