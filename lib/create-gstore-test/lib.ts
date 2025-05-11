export const nextTask = () => new Promise((resolve) => setTimeout(resolve));

export const nextMicrotask = () => Promise.resolve();
