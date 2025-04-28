export type NavigationLink = {
  title: string;
  anchor: string;
  children?: NavigationLink[];
};

export const navigationLinks: NavigationLink[] = [
  {
    title: "Introduction",
    anchor: "introduction",
  },
  {
    title: "Getting Started",
    anchor: "getting-started",
    children: [
      { title: "Installation", anchor: "installation" },
      { title: "Quick Start", anchor: "quick-start" },
      { title: "Supported Hooks", anchor: "supported-hooks" },
    ],
  },
  {
    title: "Examples",
    anchor: "examples",
    children: [
      { title: "Counter", anchor: "counter-example" },
      { title: "Todo List", anchor: "todo-list-example" },
      { title: "Selector Pattern", anchor: "selector-example" },
      { title: "Reducer", anchor: "reducer-example" },
      { title: "Form", anchor: "form-example" },
      { title: "React Query", anchor: "react-query-example" },
    ],
  },
  {
    title: "API Reference",
    anchor: "api-reference",
    children: [
      { title: "createGStore", anchor: "createGStore" },
      { title: "Selectors", anchor: "selectors" },
      { title: "Methods", anchor: "methods" },
    ],
  },
];

export const defaultOpenSections: Record<string, boolean> = {
  "Getting Started": true,
  Examples: false,
  "API Reference": false,
  Advanced: false,
};
