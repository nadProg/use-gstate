import { createGStore } from '../../lib';
import { useReducer, useState } from 'react';

// Define a reducer for todos
type Todo = {
  id: number;
  text: string;
  completed: boolean;
};

type TodoAction =
  | { type: 'ADD'; text: string }
  | { type: 'TOGGLE'; id: number }
  | { type: 'DELETE'; id: number }
  | { type: 'CLEAR_COMPLETED' };

// Reducer function
function todoReducer(state: Todo[], action: TodoAction): Todo[] {
  switch (action.type) {
    case 'ADD':
      return [
        ...state,
        {
          id: Date.now(),
          text: action.text,
          completed: false,
        },
      ];
    case 'TOGGLE':
      return state.map((todo) =>
        todo.id === action.id ? { ...todo, completed: !todo.completed } : todo,
      );
    case 'DELETE':
      return state.filter((todo) => todo.id !== action.id);
    case 'CLEAR_COMPLETED':
      return state.filter((todo) => !todo.completed);
    default:
      return state;
  }
}

// Create global state with useReducer
const useGlobalTodos = createGStore(() => {
  const [todos, dispatch] = useReducer(todoReducer, [
    { id: 1, text: 'Learn create-gstore', completed: false },
    { id: 2, text: 'Try useReducer', completed: false },
  ]);

  // Helper functions
  const addTodo = (text: string) => dispatch({ type: 'ADD', text });
  const toggleTodo = (id: number) => dispatch({ type: 'TOGGLE', id });
  const deleteTodo = (id: number) => dispatch({ type: 'DELETE', id });
  const clearCompleted = () => dispatch({ type: 'CLEAR_COMPLETED' });

  return {
    todos,
    addTodo,
    toggleTodo,
    deleteTodo,
    clearCompleted,
    dispatch, // You can also expose the dispatch function directly
  };
});

// Components
export function TodoReducerExample() {
  const { todos, addTodo, toggleTodo, deleteTodo, clearCompleted } =
    useGlobalTodos();
  const [inputValue, setInputValue] = useState('');

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      addTodo(inputValue);
      setInputValue('');
    }
  };

  return (
    <div className="border rounded-lg p-4 max-w-md mx-auto bg-white shadow">
      <h2 className="text-lg font-bold mb-4">Todo List (with useReducer)</h2>

      <form onSubmit={handleAddTodo} className="flex gap-2 mb-4">
        <input
          className="flex-1 px-3 py-2 border rounded"
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Add a new todo"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add
        </button>
      </form>

      <ul className="space-y-2 mb-4">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="flex items-center justify-between p-2 border-b group"
          >
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
                className="h-4 w-4"
              />
              <span
                className={`${
                  todo.completed ? 'line-through text-gray-500' : ''
                }`}
              >
                {todo.text}
              </span>
            </div>
            <button
              onClick={() => deleteTodo(todo.id)}
              className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">
          {todos.filter((t) => !t.completed).length} items left
        </span>
        <button
          onClick={clearCompleted}
          className="text-sm text-blue-500 hover:underline"
        >
          Clear completed
        </button>
      </div>
    </div>
  );
}

// Observer component - demonstrates separation of concerns
export function TodoStats() {
  const todos = useGlobalTodos((state) => state.todos);
  const completed = todos.filter((t) => t.completed).length;

  return (
    <div className="mt-4 p-3 bg-gray-100 rounded text-center text-sm">
      <p>Total: {todos.length} todos</p>
      <p>Completed: {completed}</p>
      <p>
        Completion rate:{' '}
        {todos.length ? Math.round((completed / todos.length) * 100) : 0}%
      </p>
    </div>
  );
}

// Example usage
export function ReducerExample() {
  return (
    <div className="space-y-4">
      <TodoReducerExample />
      <TodoStats />
    </div>
  );
}
