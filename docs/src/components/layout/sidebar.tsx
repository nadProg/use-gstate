import { useState, useEffect } from 'react';
import {
  navigationLinks,
  defaultOpenSections,
  type NavigationLink,
} from '../../config/navigation';

type SidebarProps = {
  className?: string;
  isMobile?: boolean;
  onLinkClick?: () => void;
};

export function Sidebar({
  className = '',
  isMobile = false,
  onLinkClick,
}: SidebarProps) {
  const [openSections, setOpenSections] =
    useState<Record<string, boolean>>(defaultOpenSections);
  const [activeSection, setActiveSection] = useState<string>('');

  // Track scroll position and update active section
  useEffect(() => {
    const handleScroll = () => {
      // Find all section headers
      const sections = document.querySelectorAll('section[id], h2[id], h3[id]');

      // Find the current section
      let currentSection = '';
      sections.forEach((section) => {
        if (section.getBoundingClientRect().top <= 100) {
          currentSection = section.id;
        }
      });

      if (currentSection !== activeSection) {
        setActiveSection(currentSection);

        // Automatically expand parent sections
        navigationLinks.forEach((link) => {
          if (link.children) {
            const childFound = link.children.some(
              (child) => child.anchor === currentSection,
            );
            if (childFound) {
              setOpenSections((prev) => ({
                ...prev,
                [link.title]: true,
              }));
            }
          }
        });
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
    <aside
      className={`${
        isMobile ? 'w-full' : 'w-64'
      } bg-white shadow-sm overflow-y-auto ${
        isMobile ? '' : 'fixed top-0 z-50 h-screen'
      } ${className}`}
    >
      {!isMobile && (
        <div className="px-4 py-5 border-b border-gray-200">
          <a href="#top" className="flex items-center">
            <h1 className="text-xl font-bold text-indigo-600">create-gstore</h1>
            <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-indigo-100 text-indigo-800">
              Beta
            </span>
          </a>
          <p className="mt-1 text-sm text-gray-500">React State Management</p>
        </div>
      )}

      <nav className="px-2 py-4">
        <ul className="space-y-1">
          {navigationLinks.map((link) => (
            <SidebarItem
              key={link.anchor}
              link={link}
              isActive={activeSection === link.anchor}
              isOpen={openSections[link.title]}
              toggleSection={toggleSection}
              onLinkClick={handleLinkClick}
              activeSection={activeSection} // Pass the activeSection prop
            />
          ))}
        </ul>
      </nav>
    </aside>
  );
}

type SidebarItemProps = {
  link: NavigationLink;
  isActive: boolean;
  isOpen?: boolean;
  toggleSection: (title: string) => void;
  onLinkClick?: () => void;
  activeSection: string; // Add the activeSection prop
};

function SidebarItem({
  link,
  isActive,
  isOpen,
  toggleSection,
  onLinkClick,
  activeSection,
}: SidebarItemProps) {
  const handleClick = () => {
    if (onLinkClick) {
      onLinkClick();
    }
  };

  return (
    <li className="mb-2">
      {link.children ? (
        <div>
          <div
            className={`w-full flex items-center justify-between px-2 py-2 text-sm font-medium rounded-md cursor-pointer ${
              isActive
                ? 'text-indigo-600 bg-indigo-50'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => toggleSection(link.title)}
          >
            <a
              href={`#${link.anchor}`}
              className="flex-grow"
              onClick={(e) => {
                e.preventDefault();
                handleClick();
              }}
            >
              {link.title}
            </a>
            <svg
              className={`ml-1 h-5 w-5 transform transition-transform duration-200 ${
                isOpen ? 'rotate-90' : ''
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
          {isOpen && (
            <ul className="mt-1 ml-4 space-y-1">
              {link.children.map((child) => (
                <li key={child.anchor}>
                  <a
                    href={`#${child.anchor}`}
                    onClick={handleClick}
                    className={`block px-2 py-1.5 text-sm rounded-md ${
                      activeSection === child.anchor
                        ? 'text-indigo-600 bg-indigo-50 font-medium'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
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
          onClick={handleClick}
          className={`block px-2 py-2 text-sm font-medium rounded-md ${
            isActive
              ? 'text-indigo-600 bg-indigo-50'
              : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          {link.title}
        </a>
      )}
    </li>
  );
}
