
import { useEffect } from 'react';
import Header from '../home/components/Header';
import Footer from '../home/components/Footer';
import FloatingShapes from './components/FloatingShapes';
import AboutHero from './components/AboutHero';
import BioSection from './components/BioSection';
import ExpertiseCards from './components/ExpertiseCards';
import JourneyTimeline from './components/JourneyTimeline';
import PhilosophySection from './components/PhilosophySection';
import ConnectCTA from './components/ConnectCTA';

export default function About() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <FloatingShapes />
      <Header />
      <main className="relative z-10">
        <AboutHero />
        <BioSection />
        <ExpertiseCards />
        <JourneyTimeline />
        <PhilosophySection />
        <ConnectCTA />
      </main>
      <Footer />
    </div>
  );
}
