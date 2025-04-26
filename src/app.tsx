import { CounterDisplay, GlobalCounter } from './examples/counter';
import { FormErrors, GlobalForm } from './examples/form';
import { GlobalTodoList } from './examples/todo-list';

export function App() {
  return (
    <div className="container mx-auto flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Examples</h1>
      <h2 className="text-xl font-bold text-gray-900 mb-4">Global counter</h2>
      <hr />
      <div className="flex items-center justify-between">
        <GlobalCounter />
        <CounterDisplay />
      </div>
      <hr />
      <h2 className="text-xl font-bold text-gray-900 mb-4">Global form</h2>
      <hr />
      <GlobalForm />
      👇 another component <br />
      <FormErrors />
      <hr />
      <h2 className="text-xl font-bold text-gray-900 mb-4">Global todo list</h2>
      <hr />
      👇 2 todo list copies with same state <br />
      <GlobalTodoList />
      <GlobalTodoList />
      <hr />
    </div>
  );
}
