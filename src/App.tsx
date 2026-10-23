import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { LandingPage } from '@/components/landing/LandingPage';
import { Workspace } from '@/components/workspace/Workspace';

type Page = 'landing' | 'workspace';

function App() {
  const [page, setPage] = useState<Page>('landing');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  const navigate = (target: Page) => {
    setPage(target);
    if (target === 'workspace') {
      window.scrollTo(0, 0);
    }
  };

  return (
    <div className="min-h-screen bg-base-950">
      <Navbar onNavigate={navigate} currentPage={page} />

      <AnimatePresence mode="wait">
        <motion.div
          key={page}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {page === 'landing' ? (
            <>
              <LandingPage onCtaClick={() => navigate('workspace')} />
              <Footer onNavigate={navigate} />
            </>
          ) : (
            <Workspace onBack={() => navigate('landing')} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default App;
