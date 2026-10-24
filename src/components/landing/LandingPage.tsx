import { Hero } from '@/components/landing/Hero';
import { Benefits } from '@/components/landing/Benefits';
import { ProductPreview } from '@/components/landing/ProductPreview';
import { World3D } from '@/components/landing/World3D';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { Pricing } from '@/components/landing/Pricing';
import { FAQ } from '@/components/landing/FAQ';
import { FinalCTA } from '@/components/landing/FinalCTA';
import type { ModalType } from '@/components/ui/InfoModal';

interface LandingPageProps {
  onCtaClick: () => void;
  onOpenModal: (type: ModalType) => void;
  isProActive?: boolean;
}

export function LandingPage({ onCtaClick, onOpenModal, isProActive }: LandingPageProps) {
  return (
    <>
      <Hero onCtaClick={onCtaClick} />
      <Benefits />
      <ProductPreview />
      <World3D />
      <HowItWorks />
      <Pricing
        onCtaClick={onCtaClick}
        onOpenModal={onOpenModal}
        isProActive={isProActive}
      />
      <FAQ />
      <FinalCTA onCtaClick={onCtaClick} />
    </>
  );
}
