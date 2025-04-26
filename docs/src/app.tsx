import { useEffect } from 'react';
import { Introduction } from './sections/introduction';
import { Examples } from './sections/examples/index';
import { ApiReference } from './sections/api-reference/index';
import { Layout } from './components/layout/layout';

function App() {
  // Add smooth scrolling for anchor links
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      if (
        target.tagName === 'A' &&
        target.getAttribute('href')?.startsWith('#')
      ) {
        e.preventDefault();
        const id = target.getAttribute('href')?.slice(1);
        const element = document.getElementById(id || '');

        if (element) {
          window.scrollTo({
            top: element.offsetTop - 20,
            behavior: 'smooth',
          });
          // Update URL without triggering page reload
          history.pushState(null, '', `#${id}`);
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);
    return () => document.removeEventListener('click', handleAnchorClick);
  }, []);

  return (
    <Layout>
      <Introduction />
      <Examples />
      <ApiReference />
    </Layout>
  );
}

export default App;
