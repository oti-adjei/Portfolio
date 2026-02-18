
import { useContent } from '../../../contexts/ContentContext';

export default function Services() {
  const { content } = useContent();
  const services = content.homePage.services;

  const colorMap: Record<
    string,
    { color: string; iconColor: string }
  > = {
    'ri-pencil-ruler-2-line': {
      color: 'from-red-50 to-red-100',
      iconColor: 'text-red-500',
    },
    'ri-code-s-slash-line': {
      color: 'from-teal-50 to-teal-100',
      iconColor: 'text-teal-500',
    },
    'ri-smartphone-line': {
      color: 'from-purple-50 to-purple-100',
      iconColor: 'text-purple-500',
    },
    'ri-layout-grid-line': {
      color: 'from-orange-50 to-orange-100',
      iconColor: 'text-orange-500',
    },
    'ri-magic-line': {
      color: 'from-pink-50 to-pink-100',
      iconColor: 'text-pink-500',
    },
    'ri-lightbulb-line': {
      color: 'from-emerald-50 to-emerald-100',
      iconColor: 'text-emerald-500',
    },
  };

  return (
    <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-12 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10 sm:mb-12 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
            {services.title}
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto">{services.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {services.items.map((service) => {
            const colors =
              colorMap[service.icon] || {
                color: 'from-gray-50 to-gray-100',
                iconColor: 'text-gray-500',
              };
            return (
              <div
                key={service.id}
                className={`bg-gradient-to-br ${colors.color} rounded-xl sm:rounded-2xl p-6 sm:p-8 hover:shadow-xl transition-all duration-300 group cursor-pointer`}
              >
                <div className="space-y-3 sm:space-y-4">
                  <div
                    className={`w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center bg-white rounded-lg sm:rounded-xl ${colors.iconColor} group-hover:scale-110 transition-transform duration-300`}
                  >
                    <i className={`${service.icon} text-2xl sm:text-3xl`}></i>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                    {service.title}
                  </h3>

                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
