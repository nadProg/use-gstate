export const nextTask = () => new Promise((resolve) => setTimeout(resolve));

export const nextMicrotask = () => Promise.resolve();

export const createContainer = ({ html }: { html?: string } = {}) => {
  const container = document.createElement("div");
  container.innerHTML = html ?? "";
  return container;
};
