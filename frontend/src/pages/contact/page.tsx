
import { useEffect } from 'react';
import Header from '../home/components/Header';
import Footer from '../home/components/Footer';
import FloatingShapes from './components/FloatingShapes';
import ContactHero from './components/ContactHero';
import ContactForm from './components/ContactForm';
import ContactInfo from './components/ContactInfo';
import { siteContent } from '../../mocks/siteContent';

export default function Contact() {
  // Guard against missing map data
  const { map } = siteContent?.contactPage ?? {};

  useEffect(() => {
    // Scroll to top when the component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <FloatingShapes />
      <Header />
      <main className="relative z-10">
        <ContactHero />

        {/* Contact Content */}
        <section className="py-10 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-12">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 xl:gap-16">
              {/* Form - Takes 3 columns on desktop */}
              <div className="lg:col-span-3 order-2 lg:order-1">
                <ContactForm />
              </div>

              {/* Info - Takes 2 columns on desktop */}
              <div className="lg:col-span-2 order-1 lg:order-2">
                <ContactInfo />
              </div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="py-10 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-12">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm border border-gray-100">
              {map?.embedUrl ? (
                <iframe
                  src={map.embedUrl}
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={map.title || 'Location map'}
                  className="grayscale opacity-90 hover:grayscale-0 hover:opacity-100 transition-all duration-500 sm:h-[350px] lg:h-[400px]"
                ></iframe>
              ) : (
                <p className="p-4 text-center text-gray-500">
                  Map information is currently unavailable.
                </p>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
