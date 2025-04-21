import { GlobalTodoList } from "../../../../src/examples/todo-list";
import todoListExampleCode from "../../../../src/examples/todo-list?raw";
import { CodeBlock } from "../../components/ui/code-block";
import { Subsection } from "../../components/ui/section";

export function TodoListExample() {
  return (
    <Subsection id="todo-list-example" title="Todo List Example">
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
    </Subsection>
  );
}
