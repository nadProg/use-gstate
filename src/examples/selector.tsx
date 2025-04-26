import { createGStore } from '../../lib';
import { useState, useCallback, useRef } from 'react';

// Create a global state
const useGlobalState = createGStore(() => {
  const [user, setUser] = useState({ name: 'John', age: 30 });
  const [settings, setSettings] = useState({ theme: 'dark' });

  const updateUser = useCallback((name: string, age: number) => {
    setUser({ name, age });
  }, []);

  const updateTheme = useCallback((theme: 'dark' | 'light') => {
    setSettings((prev) => ({ ...prev, theme }));
  }, []);

  return {
    user,
    settings,
    updateUser,
    updateTheme,
  };
});

// Component that only uses and updates user name
export function UserNameDisplay() {
  // Only re-renders when user.name changes
  const name = useGlobalState((state) => state.user.name);
  const age = useGlobalState((state) => state.user.age);

  const userRenderCount = useRef(0);
  userRenderCount.current++;
  const updateUser = useGlobalState((state) => state.updateUser);

  return (
    <div className="p-6 max-w-sm mx-auto my-4 bg-white rounded-xl shadow-md">
      <h3 className="text-lg font-medium text-gray-800 mb-3">User Component</h3>

      <div className="mb-4">
        <p className="text-gray-600">
          <span className="font-semibold">Name:</span> {name}
        </p>
        <p className="text-gray-600">
          <span className="font-semibold">Age:</span> {age}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          User state renders: {userRenderCount.current}
        </p>
      </div>

      <div className="mt-3 space-y-2">
        <button
          onClick={() => updateUser('Jane', 28)}
          className="w-full px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
        >
          Change to Jane
        </button>
        <button
          onClick={() => updateUser('John', 30)}
          className="w-full px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
        >
          Change to John
        </button>
      </div>
    </div>
  );
}

// Component that only uses and updates theme settings
export function ThemeToggle() {
  // Only re-renders when settings.theme changes
  const { theme, updateTheme } = useGlobalState(
    (state) => ({
      theme: state.settings.theme,
      updateTheme: state.updateTheme,
    }),
    'shallow',
  );

  const settingsRenderCount = useRef(0);
  settingsRenderCount.current++;

  return (
    <div className="p-6 max-w-sm mx-auto my-4 bg-gray-50 rounded-xl shadow-md">
      <h3 className="text-lg font-medium text-gray-800 mb-3">
        Theme Component
      </h3>

      <div className="mb-4">
        <p className="text-gray-600">
          <span className="font-semibold">Current theme:</span> {theme}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Settings state renders: {settingsRenderCount.current}
        </p>
      </div>

      <button
        onClick={() => updateTheme(theme === 'dark' ? 'light' : 'dark')}
        className="w-full px-3 py-1.5 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700"
      >
        Toggle theme ({theme === 'dark' ? 'light' : 'dark'})
      </button>
    </div>
  );
}

// Container component that combines both examples
export function SelectorExample() {
  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-medium text-gray-800 mb-4">
        Selector Pattern Example
      </h2>
      <p className="text-gray-600 mb-6">
        This example demonstrates how components can subscribe to specific parts
        of global state for optimized rendering. Each component only re-renders
        when its specific data changes.
      </p>

      <UserNameDisplay />
      <ThemeToggle />

      <p className="text-sm text-gray-500 mt-6">
        Notice how updating the user's information doesn't cause the theme
        component to re-render, and vice versa. The render counts track how many
        times each piece of state has been updated.
      </p>
    </div>
  );
}
