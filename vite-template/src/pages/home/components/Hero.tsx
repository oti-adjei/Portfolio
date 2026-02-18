
import { Link } from 'react-router-dom';
import { useContent } from '../../../contexts/ContentContext';

export default function Hero() {
  const { content } = useContent();
  const hero = content.homePage.hero;

  return (
    <section className="relative min-h-screen flex items-center px-4 sm:px-6 lg:px-12 overflow-hidden bg-white pt-20 lg:pt-0">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://readdy.ai/api/search-image?query=abstract%20white%20architectural%20pattern%20with%20diagonal%20lines%20and%20curves%2C%20minimalist%20geometric%20background%2C%20clean%20modern%20design%2C%20white%20and%20light%20gray%20tones%2C%20subtle%20depth%20and%20dimension%2C%20professional%20studio%20photography&width=1920&height=1080&seq=hero-bg-1&orientation=landscape"
          alt="Background"
          className="w-full h-full object-cover opacity-40"
        />
      </div>

      <div className="max-w-7xl mx-auto w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6 sm:space-y-8 text-center lg:text-left order-2 lg:order-1">
            <div className="space-y-4">
              <span className="inline-block px-4 py-2 bg-gray-100 text-gray-700 text-xs sm:text-sm font-medium rounded-full">
                {hero.badge}
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 leading-tight">
                {hero.heading}
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-lg mx-auto lg:mx-0">{hero.subtitle}</p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4">
              <Link
                to={hero.ctaButton?.url || '#'}
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gray-900 text-white font-medium rounded-full hover:bg-gray-800 transition-colors cursor-pointer whitespace-nowrap text-center"
              >
                {hero.ctaButton?.label || 'Get Started'}
              </Link>
              <Link
                to={hero.secondaryButton?.url || '#'}
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 border-2 border-gray-900 text-gray-900 font-medium rounded-full hover:bg-gray-900 hover:text-white transition-colors cursor-pointer whitespace-nowrap text-center"
              >
                {hero.secondaryButton?.label || 'Learn More'}
              </Link>
            </div>

            {/* Social Icons */}
            <div className="flex items-center justify-center lg:justify-start gap-4">
              <div className="flex -space-x-3">
                {hero.socialIcons?.map((social) => (
                  <a
                    key={social.id}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-white overflow-hidden bg-gray-900 flex items-center justify-center hover:scale-110 transition-transform cursor-pointer"
                  >
                    <i className={`${social.icon} text-white text-lg sm:text-xl`}></i>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative order-1 lg:order-2">
            <div className="w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] flex items-end justify-center">
              <img
                src={hero.image?.url}
                alt={hero.image?.alt || 'Hero image'}
                className="w-full h-full object-contain object-bottom"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
