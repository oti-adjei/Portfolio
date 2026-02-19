
import { useContent } from '../../../contexts/ContentContext';

const circleColors = ['#f75124', '#baebcd', '#d9d1fa', '#faedce'];

export default function Services() {
  const { content } = useContent();
  const services = content.homePage.services;

  return (
    <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-12 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-left mb-10 sm:mb-12 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
            {services.title}
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl">
            {services.subtitle}
          </p>
        </div>

        {/* group on the grid so non-hovered cards can scale down */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8 group">
          {services.items.map((service, index) => {
            const bg = circleColors[index % circleColors.length];
            return (
              <div
                key={service.id}
                className="bg-white rounded-xl p-8 sm:p-10 cursor-pointer will-change-transform
                  shadow-[18px_0px_87px_0px_rgb(10_15_70_/_7%)]
                  transition-transform duration-500
                  group-hover:scale-90 hover:!scale-105"
              >
                {/* Circle icon */}
                <div
                  className="w-[65px] h-[65px] flex items-center justify-center rounded-full mb-5 shrink-0"
                  style={{ backgroundColor: bg }}
                >
                  <i className={`${service.icon} text-2xl text-gray-800`}></i>
                </div>

                <h3 className="text-2xl font-medium text-gray-900 mb-4">
                  {service.title}
                </h3>

                <p className="text-gray-600 leading-7 text-sm sm:text-base">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
