# createGStore Options

Configuration options for creating a GStore instance using `createGStore`.

## Overview

`createGStore` is a function that creates a global state hook from a state factory function. It provides a way to share state across your React application with fine-grained control over initialization, destruction, and subscription lifecycle.

## Subscription Mechanism

When a component calls the hook returned by `createGStore`, it automatically subscribes to state updates. This is implemented using React's `useSyncExternalStore` under the hood. The subscription callbacks (`onSubscribed`, `onUnsubscribed`, etc.) are triggered when:

- `onSubscribed`: A component starts using the hook
- `onUnsubscribed`: A component unmounts or stops using the hook
- `onFirstSubscribed`: The first component starts using the hook
- `onAllUnsubscribed`: The last component stops using the hook

The hook internally calls `getState()` to get the current state. This is important for understanding the initialization and destruction options.

## Usage

```typescript
import { createGStore } from 'create-gstore';

const useStore = createGStore(
  () => ({ user: { name: 'John' } }),
  {
    onSubscribed: (count) => console.log(`Current subscribers count: ${count}`),
    onFirstSubscribed: () => console.log('First subscriber added'),
    onUnsubscribed: (count) => console.log(`Current subscribers count: ${count}`),
    onAllUnsubscribed: () => console.log('All subscribers removed'),
    initialize: 'eager',
    destroy: 'on-all-unsubscribed'
  }
);
```

## Options

The following options control the behavior of the store. Note that subscription-related callbacks (`onSubscribed`, `onUnsubscribed`, etc.) are triggered in two ways:

1. **Explicit usage**: When you directly call `useStore.subscribe()` or `useStore.getState()`
2. **Implicit usage**: When you use the `useStore` hook in a React component, which internally uses `useSyncExternalStore` to:
   - Call `getState()` to get the current state
   - Call `subscribe()` to track state changes
   - Call the unsubscribe function when the component unmounts

### Callback Options

#### `onSubscribed?: (subscribers: number) => void`
Called when a new subscriber is added. This happens when:
- A component starts using the `useStore` hook
- `useStore.subscribe()` is called directly

Receives the total number of current subscribers.

```typescript
const useStore = createGStore(
  () => ({ user: { name: 'John' } }),
  {
    onSubscribed: (count) => {
      console.log(`New subscriber added. Total subscribers: ${count}`);
    }
  }
);
```

#### `onUnsubscribed?: (subscribers: number) => void`
Called when a subscriber is removed. This happens when:
- A component unmounts or stops using the `useStore` hook
- The unsubscribe function from `useStore.subscribe()` is called

Receives the total number of remaining subscribers.

```typescript
const useStore = createGStore(
  () => ({ user: { name: 'John' } }),
  {
    onUnsubscribed: (count) => {
      console.log(`Subscriber removed. Remaining subscribers: ${count}`);
    }
  }
);
```

#### `onFirstSubscribed?: () => void`
Called when the first subscriber is added to the store. This happens when:
- The first component starts using the `useStore` hook
- The first `useStore.subscribe()` call is made

Useful for lazy initialization of resources.

```typescript
const useStore = createGStore(
  () => ({ user: { name: 'John' } }),
  {
    onFirstSubscribed: () => {
      console.log('First subscriber added - initializing resources');
    }
  }
);
```

#### `onAllUnsubscribed?: () => void`
Called when all subscribers have been removed from the store. This happens when:
- The last component using the `useStore` hook unmounts
- The last subscription from `useStore.subscribe()` is unsubscribed

Useful for cleanup.

```typescript
const useStore = createGStore(
  () => ({ user: { name: 'John' } }),
  {
    onAllUnsubscribed: () => {
      console.log('All subscribers removed - cleaning up resources');
    }
  }
);
```

### Initialization Options

#### `initialize?: "lazy" | "eager"`
Controls when the store's state is initialized:
- `"lazy"` (default): State is initialized on first `getState()` call, which happens when:
  - A component first uses the `useStore` hook
  - `useStore.getState()` is called manually
- `"eager"`: State is initialized immediately when store is created, before any components use it

```typescript
// Lazy initialization (default)
const useLazyStore = createGStore(() => ({ user: { name: 'John' } }));

// Eager initialization
const useEagerStore = createGStore(
  () => ({ user: { name: 'John' } }),
  { initialize: 'eager' }
);
```

### Destruction Options

#### `destroy?: "no" | "on-all-unsubscribed"`
Controls when the store's state is destroyed:
- `"no"` (default): State is never automatically destroyed
- `"on-all-unsubscribed"`: State is destroyed when all subscribers are removed, which happens when:
  - The last component using the `useStore` hook unmounts
  - The last subscription from `useStore.subscribe()` is unsubscribed

```typescript
// Never destroy (default)
const useStore = createGStore(() => ({ user: { name: 'John' } }));

// Destroy when no subscribers
const useStore = createGStore(
  () => ({ user: { name: 'John' } }),
  { destroy: 'on-all-unsubscribed' }
);
```
