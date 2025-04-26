export type HeaderProps = {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (isOpen: boolean) => void;
};

export function Header({ isMobileMenuOpen, setIsMobileMenuOpen }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm md:hidden fixed top-0 left-0 right-0 z-40 ">
      <div className="max-w-7xl mx-auto h-16 py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-indigo-600">create-gstore</h1>
          <span className="ml-3 px-2 py-0.5 text-xs rounded-full bg-indigo-100 text-indigo-800">
            Beta
          </span>
        </div>
        <div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-gray-600 hover:text-gray-900"
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
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
                d={
                  isMobileMenuOpen
                    ? 'M6 18L18 6M6 6l12 12'
                    : 'M4 6h16M4 12h16M4 18h16'
                }
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
