import { GlobalCounter, CounterDisplay } from "../../../src/examples/counter";
import counterExampleCode from "../../../src/examples/counter?raw";
import { GlobalForm } from "../../../src/examples/form";
import formExampleCode from "../../../src/examples/form?raw";
import { GlobalTodoList } from "../../../src/examples/todo-list";
import todoListExampleCode from "../../../src/examples/todo-list?raw";
import { SelectorExample } from "../../../src/examples/selector";
import selectorExampleCode from "../../../src/examples/selector?raw";
import { ReactQueryExample } from "../../../src/examples/react-query";
import reactQueryExampleCode from "../../../src/examples/react-query?raw";
import { CodeBlock } from "../components/code-block";

export function Examples() {
  return (
    <div id="examples">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Examples</h2>

      <section id="counter-example" className="mb-12">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          Counter Example
        </h3>
        <p className="mb-6 text-gray-600">
          A simple counter example showing how to share state between
          components.
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
      </section>

      <section id="todo-list-example" className="mb-12">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          Todo List Example
        </h3>
        <p className="mb-6 text-gray-600">
          An example demonstrating async data fetching with a global state.
        </p>

        <div className="mb-6">
          <h4 className="text-xl font-bold text-gray-800 mb-2">Live Demo</h4>
          <GlobalTodoList />
        </div>

        <h4 className="text-xl font-bold text-gray-800 mb-2">Code</h4>
        <CodeBlock
          language="tsx"
          code={todoListExampleCode}
          filename="todo-list.tsx"
        />
      </section>

      <section id="selector-example" className="mb-12">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          Selector Pattern Example
        </h3>
        <p className="mb-6 text-gray-600">
          This example demonstrates how to use selectors to optimize renders by
          having components subscribe only to the specific parts of state they
          need.
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
      </section>
      <section id="form-example" className="mb-12">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Form Example</h3>
        <p className="mb-6 text-gray-600">
          An example showing how to use form state globally with
          react-hook-form.
        </p>

        <div className="mb-6">
          <h4 className="text-xl font-bold text-gray-800 mb-2">Live Demo</h4>
          <GlobalForm />
        </div>

        <h4 className="text-xl font-bold text-gray-800 mb-2">Code</h4>
        <CodeBlock language="tsx" code={formExampleCode} filename="form.tsx" />
      </section>
      <section id="react-query-example" className="mb-12">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          React Query Integration
        </h3>
        <p className="mb-6 text-gray-600">
          This example demonstrates how to integrate React Query with use-gstate
          for powerful data fetching capabilities with global state management.
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
      </section>
    </div>
  );
}
