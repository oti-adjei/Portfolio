import { useState } from 'react';

export default function Brands() {
  const brand = [
    {
      id: '1',
      name: 'TechCorp',
      logo: 'https://readdy.ai/api/search-image?query=modern%20tech%20company%20logo%20design%20minimalist%20black%20and%20white%20simple%20geometric%20shape%20professional%20brand%20identity%20on%20white%20background&width=200&height=100&seq=brand-1&orientation=landscape',
      url: 'https://www.techcorp.com'

    },
    {
      id: '2',
      name: 'RetailHub',
      logo: 'https://readdy.ai/api/search-image?query=retail%20e-commerce%20company%20logo%20design%20minimalist%20black%20and%20white%20simple%20modern%20brand%20identity%20on%20white%20background&width=200&height=100&seq=brand-2&orientation=landscape',
      url: 'https://www.techcorp.com'
    },
    {
      id: '3',
      name: 'StreamFlix',
      logo: 'https://readdy.ai/api/search-image?query=streaming%20media%20company%20logo%20design%20minimalist%20black%20and%20white%20simple%20modern%20brand%20identity%20on%20white%20background&width=200&height=100&seq=brand-3&orientation=landscape',
      url: 'https://www.techcorp.com'
    },
    {
      id: '4',
      name: 'HealthTrack',
      logo: 'https://readdy.ai/api/search-image?query=healthcare%20technology%20company%20logo%20design%20minimalist%20black%20and%20white%20simple%20modern%20medical%20brand%20identity%20on%20white%20background&width=200&height=100&seq=brand-4&orientation=landscape',
      url: 'https://www.techcorp.com'
    },
    {
      id: '5',
      name: 'EduLearn',
      logo: 'https://readdy.ai/api/search-image?query=education%20technology%20company%20logo%20design%20minimalist%20black%20and%20white%20simple%20modern%20learning%20brand%20identity%20on%20white%20background&width=200&height=100&seq=brand-5&orientation=landscape',
      url: 'https://www.techcorp.com'
    },
    {
      id: '6',
      name: 'FoodieHub',
      logo: 'https://readdy.ai/api/search-image?query=food%20delivery%20company%20logo%20design%20minimalist%20black%20and%20white%20simple%20modern%20restaurant%20brand%20identity%20on%20white%20background&width=200&height=100&seq=brand-6&orientation=landscape',
      url: 'https://www.techcorp.com'
    }
  ];

  const [brands, setBrands] = useState(brand);
  const [isPaused, setIsPaused] = useState(false);

  return (
    <section className="py-12 lg:py-20 bg-white relative z-10 overflow-hidden border-t border-b border-gray-200">
      <div className="px-4 lg:px-[8%] mb-8 lg:mb-12">
        <h3 className="text-xs lg:text-sm uppercase tracking-[0.2em] text-gray-500 font-medium text-center lg:text-left">
          Trusted by Industry Leaders
        </h3>
      </div>

      <div
        className="relative"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className={`flex gap-8 lg:gap-16 ${isPaused ? '' : 'animate-scroll-mobile lg:animate-scroll'}`}>
          {brands.map((brand, index) => (
            <a
              key={`brand-1-${index}`}
              href={brand.url || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 w-32 lg:w-48 h-16 lg:h-24 flex items-center justify-center grayscale hover:grayscale-0 opacity-50 hover:opacity-100 transition-all duration-300 cursor-pointer group"
            >
              <img
                src={brand.logo}
                alt={brand.name}
                className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-300"
              />
            </a>
          ))}
          {/* Duplicate for seamless scroll */}
          {brands.map((brand, index) => (
            <a
              key={`brand-2-${index}`}
              href={brand.url || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 w-32 lg:w-48 h-16 lg:h-24 flex items-center justify-center grayscale hover:grayscale-0 opacity-50 hover:opacity-100 transition-all duration-300 cursor-pointer group"
            >
              <img
                src={brand.logo}
                alt={brand.name}
                className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-300"
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}