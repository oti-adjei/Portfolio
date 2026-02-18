import Header from './components/Header';
import Hero from './components/Hero';
import AboutNew from './components/AboutNew';
import SkillsOrbit from './components/SkillsOrbit';
import FeaturedWorks from './components/FeaturedWorks';
import Services from './components/Services';
import Stats from './components/Stats';
import ContactCTA from './components/ContactCTA';
import Footer from './components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <AboutNew />
      <SkillsOrbit />
      <FeaturedWorks />
      <Services />
      <Stats />
      <ContactCTA />
      <Footer />
    </div>
  );
}
