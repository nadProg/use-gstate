# create-gstore

A lightweight, powerful state management library for React applications that allows you to create global state from React hooks.

## Features

- **Share Hook Logic**: Turn any local React hook into global shared state
- **Zero Dependencies**: Minimal footprint with no external dependencies
- **Composable**: Easily combine multiple state sources
- **Performance Optimized**: Re-renders only when necessary
- **Familiar API**: Intuitive API similar to React's built-in hooks

## Documentation

For complete documentation with interactive examples, visit:

**[📚 create-gstore Documentation](https://evo-community.github.io/use-gstate/)**

## Installation

```bash
npm install create-gstore
```

## Quick Start

```jsx
import { createGStore } from "create-gstore";
import { useState } from "react";

// Define a global state from a hook
const useGlobalCounter = createGStore(() => {
  const [count, setCount] = useState(0);

  const increment = () => setCount(count + 1);

  return { count, increment };
});

// Use the global state in any component
function CounterButton() {
  const { count, increment } = useGlobalCounter();
  return <button onClick={increment}>Count: {count}</button>;
}

// Use the same state in another component
function CounterDisplay() {
  const { count } = useGlobalCounter();
  return <div>Current count: {count}</div>;
}
```

This approach allows you to:

1. **Optimize performance**: Components only re-render when the specific data they use changes
2. **Separate concerns**: Components can access only the state they need
3. **Simplify components**: No need to use `useMemo` or other optimization techniques
   |

This approach allows you to:

1. **Optimize performance**: Components only re-render when the specific data they use changes
2. **Separate concerns**: Components can access only the state they need
3. **Simplify components**: No need to use `useMemo` or other optimization techniques

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT
