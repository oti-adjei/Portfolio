import Header from './components/Header';
import Hero from './components/Hero';
import AboutNew from './components/AboutNew';
import SkillsOrbit from './components/SkillsOrbit';
import FeaturedWorks from './components/FeaturedWorks';
import Services from './components/Services';
import Stats from './components/Stats';
import StreamSchedule from './components/StreamSchedule';
import WritingSection from './components/WritingSection';
import ContactCTA from './components/ContactCTA';
import Footer from './components/Footer';
import Reveal from '../../components/Reveal';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <Reveal origin="bottom"><AboutNew /></Reveal>
      <Reveal origin="bottom"><SkillsOrbit /></Reveal>
      <Reveal origin="bottom"><FeaturedWorks /></Reveal>
      <Reveal origin="bottom"><Services /></Reveal>
      <Reveal origin="bottom"><Stats /></Reveal>
      <Reveal origin="bottom"><StreamSchedule /></Reveal>
      <Reveal origin="bottom"><WritingSection /></Reveal>
      <Reveal origin="bottom"><ContactCTA /></Reveal>
      <Reveal origin="bottom"><Footer /></Reveal>
    </div>
  );
}
