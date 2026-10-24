import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { LandingPage } from '@/components/landing/LandingPage';
import { Workspace } from '@/components/workspace/Workspace';
import { AudioController } from '@/components/audio/AudioController';
import { AssistantModal } from '@/components/assistant/AssistantModal';
import { InfoModal, type ModalType } from '@/components/ui/InfoModal';
import { ToastContainer, type ToastMessage } from '@/components/ui/Toast';
import { audioService } from '@/services/audioService';

type Page = 'landing' | 'workspace';

function App() {
  const [page, setPage] = useState<Page>('landing');
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [isProActive, setIsProActive] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Unlock AudioContext on first user interaction to satisfy browser autoplay policy
  useEffect(() => {
    const unlockAudio = () => {
      audioService.initOnFirstInteraction();
      window.removeEventListener('pointerdown', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
    };

    window.addEventListener('pointerdown', unlockAudio, { passive: true });
    window.addEventListener('keydown', unlockAudio, { passive: true });

    return () => {
      window.removeEventListener('pointerdown', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
    };
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  const showToast = (text: string, type: 'success' | 'info' | 'warning' = 'info') => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleActivatePro = () => {
    setIsProActive(true);
    showToast('HyperSpace Pro trial activated for this session!', 'success');
  };

  const navigate = (target: Page) => {
    setPage(target);
    if (target === 'workspace') {
      window.scrollTo(0, 0);
    }
  };

  return (
    <div className="min-h-screen bg-base-950 text-white selection:bg-cyan-glow/30 selection:text-white">
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
              <LandingPage
                onCtaClick={() => navigate('workspace')}
                onOpenModal={setActiveModal}
                isProActive={isProActive}
              />
              <Footer onNavigate={navigate} onOpenModal={setActiveModal} />
            </>
          ) : (
            <Workspace
              onBack={() => navigate('landing')}
              onShowToast={showToast}
              isProActive={isProActive}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Floating Audio Controller */}
      <AudioController />

      {/* Floating Multilingual AI Assistant */}
      <AssistantModal />

      {/* Interactive Modal System */}
      <InfoModal
        type={activeModal}
        onClose={() => setActiveModal(null)}
        onActivatePro={handleActivatePro}
        isProActive={isProActive}
      />

      {/* Toast Feedback System */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

export default App;
