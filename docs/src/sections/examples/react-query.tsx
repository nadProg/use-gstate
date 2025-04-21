import { ReactQueryExample } from "../../../../src/examples/react-query";
import reactQueryExampleCode from "../../../../src/examples/react-query?raw";
import { CodeBlock } from "../../components/ui/code-block";
import { Subsection } from "../../components/ui/section";

export function ReactQueryIntegrationExample() {
  return (
    <Subsection id="react-query-example" title="React Query Integration">
      <p className="mb-6 text-gray-600">
        Integrating create-gstore with React Query for powerful data fetching.
      </p>

      <div className="mb-6">
        <h4 className="text-xl font-bold text-gray-800 mb-2">Live Demo</h4>
        <ReactQueryExample />
      </div>

      <h4 className="text-xl font-bold text-gray-800 mb-2">Code</h4>
      <CodeBlock
        language="tsx"
        code={reactQueryExampleCode}
        filename="react-query.tsx"
      />
    </Subsection>
  );
}
