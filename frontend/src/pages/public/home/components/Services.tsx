
import { useContent } from '@/public/contexts/PublicContentContext';

export default function Services() {
  const { content } = useContent();
  const services = content.homePage.services;

  return (
    <section className="relative overflow-hidden py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-12 bg-white">

      {/* Floating geometric shapes */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Large lavender circle — top-left */}
        <div
          className="absolute -top-16 -left-16 w-[280px] h-[280px] rounded-full opacity-[0.15] animate-float-slow"
          style={{ backgroundColor: '#d9d1fa' }}
        />
        {/* Orange diamond — top-right */}
        <div
          className="absolute top-12 right-20 w-[100px] h-[100px] rotate-45 opacity-[0.15] animate-float-medium [animation-delay:2000ms]"
          style={{ backgroundColor: '#f75124' }}
        />
        {/* Mint ring — bottom-left */}
        <div
          className="absolute bottom-8 left-24 w-[180px] h-[180px] rounded-full opacity-[0.2] animate-float-fast [animation-delay:1000ms]"
          style={{ border: '2px solid #baebcd', backgroundColor: 'transparent' }}
        />
        {/* Peach circle — bottom-right */}
        <div
          className="absolute -bottom-12 -right-12 w-[140px] h-[140px] rounded-full opacity-[0.2] animate-float-slow [animation-delay:3000ms]"
          style={{ backgroundColor: '#faedce' }}
        />
        {/* Small orange circle — mid-left */}
        <div
          className="absolute top-1/2 left-8 w-[70px] h-[70px] rounded-full opacity-[0.15] animate-float-medium [animation-delay:500ms]"
          style={{ backgroundColor: '#f75124' }}
        />
        {/* Lavender diamond — mid-right */}
        <div
          className="absolute bottom-1/3 right-8 w-[90px] h-[90px] rotate-45 opacity-[0.12] animate-float-slow [animation-delay:4000ms]"
          style={{ backgroundColor: '#d9d1fa' }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-left mb-10 sm:mb-12 lg:mb-16">
          <p className="text-sm font-medium text-[#f75124] mb-2">Services</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
            {services.title}
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl">
            {services.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {services.items.map((service) => (
            <div key={service.id} className="flex flex-col">
              <div className="w-11 h-11 bg-gray-100 rounded-xl flex items-center justify-center mb-5 shrink-0">
                <i className={`${service.icon} text-xl text-gray-500`}></i>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {service.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
