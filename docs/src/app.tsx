import { useState, useEffect } from "react";
import { Sidebar } from "./components/sidebar";
import { Introduction } from "./pages/introduction";
import { Examples } from "./pages/examples";
import { ApiReference } from "./pages/api-reference";

function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Add smooth scrolling for anchor links
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'A' && target.getAttribute('href')?.startsWith('#')) {
        e.preventDefault();
        const id = target.getAttribute('href')?.slice(1);
        const element = document.getElementById(id || '');
        if (element) {
          window.scrollTo({
            top: element.offsetTop - 20,
            behavior: 'smooth'
          });
          // Update URL without triggering page reload
          history.pushState(null, '', `#${id}`);
          // Close mobile menu if open
          setIsMobileMenuOpen(false);
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);
    return () => document.removeEventListener('click', handleAnchorClick);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header for mobile */}
      <header className="bg-white shadow-sm md:hidden">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-indigo-600">use-gstate</h1>
            <span className="ml-3 px-2 py-0.5 text-xs rounded-full bg-indigo-100 text-indigo-800">
              Beta
            </span>
          </div>
          <div>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-600 hover:text-gray-900"
            >
              <svg 
                className="h-6 w-6" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} 
                />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-40 flex">
            {/* Overlay */}
            <div 
              className="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity" 
              onClick={() => setIsMobileMenuOpen(false)}
              aria-hidden="true"
            ></div>
            
            {/* Mobile sidebar */}
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white transform transition-all ease-in-out duration-300">
              <div className="absolute top-0 right-0 -mr-12 pt-2">
                <button
                  className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="sr-only">Close sidebar</span>
                  <svg 
                    className="h-6 w-6 text-white" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              
              <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                <div className="px-4 pb-2 border-b border-gray-200">
                  <a 
                    href="#top" 
                    className="flex items-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <h1 className="text-xl font-bold text-indigo-600">use-gstate</h1>
                    <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-indigo-100 text-indigo-800">
                      Beta
                    </span>
                  </a>
                  <p className="mt-1 text-sm text-gray-500">React State Management</p>
                </div>
                
                <Sidebar 
                  className="mt-4" 
                  isMobile={true} 
                  onLinkClick={() => setIsMobileMenuOpen(false)} 
                />
              </div>
              
              <div className="flex-shrink-0 px-4 py-3 border-t border-gray-200">
                <a
                  href="https://github.com/evo-community/use-gstate"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-600 hover:text-gray-900 flex items-center"
                  onClick={() => setIsMobileMenuOpen(false)}
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
            
            <div className="flex-shrink-0 w-14" aria-hidden="true">
              {/* Force sidebar to shrink to fit close icon */}
            </div>
          </div>
        )}
      </header>

      {/* Main content */}
      <div className="flex-1 flex">
        {/* Sidebar - hidden on mobile */}
        <Sidebar className="hidden md:block h-screen sticky top-0" />
        
        {/* Main content area */}
        <main className="flex-1 px-4 py-8 md:px-8 lg:px-12 max-w-4xl mx-auto">
          <div id="top"></div>
          <Introduction />
          <Examples />
          <ApiReference />
          
          {/* Footer */}
          <footer className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500">
                &copy; 2025 use-gstate. All rights reserved.
              </p>
              <div className="flex items-center space-x-4">
                <a 
                  href="https://github.com/evo-community/use-gstate"
                  className="text-sm text-gray-500 hover:text-gray-700"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>
                <a 
                  href="https://github.com/evo-community/use-gstate/blob/main/LICENSE"
                  className="text-sm text-gray-500 hover:text-gray-700"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  License
                </a>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}

export default App;
