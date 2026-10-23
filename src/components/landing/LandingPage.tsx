import { Hero } from '@/components/landing/Hero';
import { Benefits } from '@/components/landing/Benefits';
import { ProductPreview } from '@/components/landing/ProductPreview';
import { World3D } from '@/components/landing/World3D';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { Pricing } from '@/components/landing/Pricing';
import { FAQ } from '@/components/landing/FAQ';
import { FinalCTA } from '@/components/landing/FinalCTA';

interface LandingPageProps {
  onCtaClick: () => void;
}

export function LandingPage({ onCtaClick }: LandingPageProps) {
  return (
    <>
      <Hero onCtaClick={onCtaClick} />
      <Benefits />
      <ProductPreview />
      <World3D />
      <HowItWorks />
      <Pricing onCtaClick={onCtaClick} />
      <FAQ />
      <FinalCTA onCtaClick={onCtaClick} />
    </>
  );
}
