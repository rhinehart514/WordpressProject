import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from './(landing)/components/HeroSection';
import { StepAnimation } from './(landing)/components/StepAnimation';
import { PricingCards } from './(landing)/components/PricingCards';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main>
        <HeroSection />
        <StepAnimation />
        <PricingCards />
      </main>

      <Footer />
    </div>
  );
}
