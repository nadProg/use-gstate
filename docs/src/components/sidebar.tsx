import { useState, useEffect } from "react";

type SidebarLink = {
  title: string;
  anchor: string;
  children?: SidebarLink[];
};

const sidebarLinks: SidebarLink[] = [
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
    ],
  },
  {
    title: "Examples",
    anchor: "examples",
    children: [
      { title: "Counter", anchor: "counter-example" },
      { title: "Form", anchor: "form-example" },
      { title: "Todo List", anchor: "todo-list-example" },
      { title: "Selector Pattern", anchor: "selector-example" },
      { title: "React Query", anchor: "react-query-example" },
    ],
  },
  {
    title: "API Reference",
    anchor: "api-reference",
    children: [
      { title: "createGState", anchor: "creategstate" },
      { title: "Selectors", anchor: "selectors" },
      { title: "Methods", anchor: "methods" },
      { title: "Supported Hooks", anchor: "supported-hooks" },
    ],
  },
  {
    title: "Advanced",
    anchor: "advanced",
    children: [
      { title: "Performance", anchor: "performance" },
      { title: "TypeScript", anchor: "typescript" },
    ],
  },
];

type SidebarProps = {
  className?: string;
  isMobile?: boolean;
  onLinkClick?: () => void;
};

export function Sidebar({ className = "", isMobile = false, onLinkClick }: SidebarProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    "Getting Started": true,
    "Examples": false,
    "API Reference": false,
    "Advanced": false,
  });
  
  const [activeSection, setActiveSection] = useState<string>("");

  // Track scroll position and update active section
  useEffect(() => {
    const handleScroll = () => {
      // Find all section headers
      const sections = document.querySelectorAll("section[id], h2[id], h3[id]");
      
      // Find the current section
      let currentSection = "";
      sections.forEach((section) => {
        if (section.getBoundingClientRect().top <= 100) {
          currentSection = section.id;
        }
      });
      
      if (currentSection !== activeSection) {
        setActiveSection(currentSection);
        
        // Automatically expand parent sections
        sidebarLinks.forEach(link => {
          if (link.children) {
            const childFound = link.children.some(child => child.anchor === currentSection);
            if (childFound) {
              setOpenSections(prev => ({
                ...prev,
                [link.title]: true
              }));
            }
          }
        });
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeSection]);

  const toggleSection = (title: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const handleLinkClick = () => {
    if (onLinkClick && isMobile) {
      onLinkClick();
    }
  };

  return (
    <aside className={`${isMobile ? 'w-full' : 'w-64'} bg-white shadow-sm overflow-y-auto ${className}`}>
      {!isMobile && (
        <div className="px-4 py-5 border-b border-gray-200">
          <a href="#top" className="flex items-center">
            <h1 className="text-xl font-bold text-indigo-600">use-gstate</h1>
            <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-indigo-100 text-indigo-800">
              Beta
            </span>
          </a>
          <p className="mt-1 text-sm text-gray-500">React State Management</p>
        </div>
      )}

      <nav className="px-2 py-4">
        <ul className="space-y-1">
          {sidebarLinks.map((link) => (
            <li key={link.anchor} className="mb-2">
              {link.children ? (
                <div>
                  <div
                    className={`w-full flex items-center justify-between px-2 py-2 text-sm font-medium rounded-md cursor-pointer ${
                      activeSection === link.anchor
                        ? "text-indigo-600 bg-indigo-50"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                    onClick={() => toggleSection(link.title)}
                  >
                    <a
                      href={`#${link.anchor}`}
                      className="flex-grow"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLinkClick();
                      }}
                    >
                      {link.title}
                    </a>
                    <svg
                      className={`h-4 w-4 transform transition-transform ${
                        openSections[link.title] ? "rotate-90" : ""
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                  {openSections[link.title] && (
                    <ul className="mt-1 ml-4 space-y-1">
                      {link.children.map((child) => (
                        <li key={child.anchor}>
                          <a
                            href={`#${child.anchor}`}
                            className={`block px-2 py-1.5 text-sm rounded ${
                              activeSection === child.anchor
                                ? "text-indigo-600 bg-indigo-50"
                                : "text-gray-600 hover:text-indigo-600 hover:bg-gray-50"
                            }`}
                            onClick={handleLinkClick}
                          >
                            {child.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <a
                  href={`#${link.anchor}`}
                  className={`block px-2 py-2 text-sm font-medium rounded-md ${
                    activeSection === link.anchor
                      ? "text-indigo-600 bg-indigo-50"
                      : "text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
                  }`}
                  onClick={handleLinkClick}
                >
                  {link.title}
                </a>
              )}
            </li>
          ))}
        </ul>
      </nav>
      
      {!isMobile && (
        <div className="px-4 py-3 border-t border-gray-200">
          <div className="flex items-center">
            <a
              href="https://github.com/evo-community/use-gstate"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-600 hover:text-gray-900 flex items-center"
            >
              <svg
                fill="currentColor"
                viewBox="0 0 24 24"
                className="h-4 w-4 mr-1"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.268 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.293 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.841-2.337 4.687-4.565 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z"
                />
              </svg>
              GitHub
            </a>
          </div>
        </div>
      )}
    </aside>
  );
}
