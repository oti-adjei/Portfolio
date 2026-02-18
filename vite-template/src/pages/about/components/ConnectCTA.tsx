
import { Link } from 'react-router-dom';
import { siteContent } from '../../../mocks/siteContent';

export default function ConnectCTA() {
  const { connectCTA } = siteContent.aboutPage;

  return (
    <section className="py-24 px-6">
      <div className="max-w-lg mx-auto">
        <div className="bg-gradient-to-br from-white to-sky-50/30 rounded-[32px] p-12 shadow-[0_8px_40px_rgba(0,0,0,0.04)] text-center animate-card-pulse-slow">
          <h3 className="text-2xl font-medium text-gray-800 mb-4">
            {connectCTA.heading}
          </h3>
          <p className="text-gray-500 mb-8 text-sm leading-relaxed">
            {connectCTA.description}
          </p>
          <Link
            to={connectCTA.ctaButton.url}
            className="inline-block px-8 py-3 border-2 border-teal-400 text-teal-500 rounded-full text-sm font-medium hover:bg-teal-400 hover:text-white transition-all duration-300 cursor-pointer whitespace-nowrap"
          >
            {connectCTA.ctaButton.label}
          </Link>
        </div>
      </div>
    </section>
  );
}
